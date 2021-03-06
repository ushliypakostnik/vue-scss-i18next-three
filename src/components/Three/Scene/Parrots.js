import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN, OBJECTS } from '@/utils/constants';
import {
  fixEnemyPosition,
  randomInteger,
  yesOrNo,
  distance2D,
  loaderDispatchHelper,
  addImmediateAudioToObjects,
  addAudioToObjects,
  getMinIntoxication,
  degreesToRadians,
} from '@/utils/utilities';

function Parrots() {
  const manager = new Three.LoadingManager();
  const managerAudio1 = new Three.LoadingManager();
  const managerAudio2 = new Three.LoadingManager();
  const loader = new GLTFLoader(manager);
  const audioLoader1 = new Three.AudioLoader(managerAudio1);
  const audioLoader2 = new Three.AudioLoader(managerAudio2);
  const audioLoader3 = new Three.AudioLoader();

  const fakeMaterial = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.parrot0x });
  fakeMaterial.blending = Three.NoBlending;
  fakeMaterial.side = Three.DoubleSide;
  const fakeGeometry = new Three.SphereBufferGeometry(OBJECTS.PARROTS.scale * 60, 32, 32);
  let pseudoMesh;

  const parrots = [];
  let parrot;
  let X;
  let Z;
  let x;
  let z;
  let y;
  let mixer;

  let onDown; // попугаям нужно кастить вниз

  const PARROTS_RADIUS = DESIGN.GROUND_SIZE * 0.57;

  this.init = (scope) => {
    managerAudio2.onLoad = () => {
      audioLoader3.load('./audio/parrotcry.mp3', (buffer) => {
        addAudioToObjects(scope, parrots, buffer, DESIGN.VOLUME.parrots.cry);

        loaderDispatchHelper(scope.$store, 'isParrotCryComplete');
      });
    };

    managerAudio1.onLoad = () => {
      audioLoader2.load('./audio/parrotcry2.mp3', (buffer) => {
        addAudioToObjects(scope, parrots, buffer, DESIGN.VOLUME.parrots.cry2);

        loaderDispatchHelper(scope.$store, 'isParrotCry2Complete');
      });
    };

    manager.onLoad = () => {
      audioLoader1.load('./audio/parrotfly.mp3', (buffer) => {
        addImmediateAudioToObjects(scope, parrots, buffer, DESIGN.VOLUME.parrots.volume, false);

        loaderDispatchHelper(scope.$store, 'isParrotFlyComplete');
      });
    };

    loader.load('./images/models/Parrot.glb', (gltf) => {
      loaderDispatchHelper(scope.$store, 'isParrotLoaded');

      for (let i = 0; i < OBJECTS.PARROTS.quantity; i++) {
        parrot = gltf.scene.clone(true).children[0];
        parrot.scale.set(OBJECTS.PARROTS.scale, OBJECTS.PARROTS.scale, OBJECTS.PARROTS.scale);

        X = randomInteger(-1 * DESIGN.GROUND_SIZE / 2, DESIGN.GROUND_SIZE / 2);
        y = randomInteger(OBJECTS.PARROTS.minHeight, OBJECTS.PARROTS.maxHeight);
        Z = randomInteger(-1 * DESIGN.GROUND_SIZE / 2, DESIGN.GROUND_SIZE / 2);

        [x, z] = fixEnemyPosition(
          PARROTS_RADIUS * 0.9,
          scope.objectsStoneData,
          scope.objectsTreesData, X, Z);

        parrot.position.set(x, y, z);

        scope.rotate = randomInteger(-180, 180);
        parrot.rotateY(degreesToRadians(scope.rotate));

        mixer = new Three.AnimationMixer(parrot);
        mixer.clipAction(gltf.animations[0]).setDuration(1).play();

        pseudoMesh = new Three.Mesh(fakeGeometry, fakeMaterial);

        pseudoMesh.name = OBJECTS.PARROTS.name;

        pseudoMesh.position.set(x, y, z);
        pseudoMesh.visible = false;

        parrots.push({
          health: 100,
          damage: OBJECTS.PARROTS.damage,
          mode: DESIGN.ENEMIES.mode.idle,
          mesh: parrot,
          pseudoMesh,
          mixer,
          bend: yesOrNo(),
          accelerationVelocity: Math.random() + 0.5,
          accelerationBend: Math.random(),
          velocityVertical: Math.random() + 2.5,
          beforeObject: false,
          isStop: false,
          stopSide: yesOrNo(),
          stopAngle: 0,
          isFall: false,
        });
        scope.scene.add(parrot);
        scope.scene.add(pseudoMesh);
        scope.objectsPseudoEnemies.push(pseudoMesh);
      }
      scope.objectsEnemies = scope.objectsEnemies.concat(parrots);
      loaderDispatchHelper(scope.$store, 'isParrotsBuilt');
    });
  };

  // Idle or Active Mode Movement
  const sober = (parrot, scope) => {
    // Полет
    if (parrot.mesh.children[0] && !parrot.mesh.children[0].isPlaying) parrot.mesh.children[0].play();

    // Скорость
    scope.intoxication = getMinIntoxication(parrot.health);
    scope.speed = parrot.accelerationVelocity * OBJECTS.PARROTS.velocityMove[parrot.mode] * scope.intoxication;

    // Скорость аудио
    if (parrot.mesh.children[0] && parrot.mesh.children[0].isPlaying)
      parrot.mesh.children[0].setPlaybackRate(scope.speed / 1.25);

    // Raycast
    // Спереди
    scope.directionForward = parrot.mesh.getWorldDirection(scope.direction);
    scope.raycasterForward.set(parrot.mesh.position, scope.directionForward);
    scope.intersections = scope.raycasterForward.intersectObjects(scope.objectsVertical);

    // Объект спереди - поворачиваем
    if (scope.intersections.length > 0) {
      parrot.bend = yesOrNo();
      parrot.mesh.rotateY(parrot.bend * Math.PI / 4);

      // Слишком близко - отбрасываем сильнее
      if (scope.intersections[0].distance < 5) {
        parrot.mesh.position.add(parrot.mesh.getWorldDirection(scope.direction).negate().multiplyScalar(scope.speed * OBJECTS.PARROTS.distance[parrot.mode] * scope.delta * 5));
      } else parrot.mesh.position.add(parrot.mesh.getWorldDirection(scope.direction).negate().multiplyScalar(scope.speed * OBJECTS.PARROTS.distance[parrot.mode] * scope.delta * 2.5));
    } else {
      scope.decision = randomInteger(1, 25) === 1;
      if (scope.decision) parrot.bend = yesOrNo();

      scope.decision = randomInteger(1, 50) === 1;
      if (scope.decision) parrot.accelerationBend = Math.random();

      parrot.mesh.rotateY(degreesToRadians(parrot.bend * parrot.accelerationBend * OBJECTS.PARROTS.velocityBend[parrot.mode] * scope.intoxication * scope.delta));

      scope.decision = randomInteger(1, 50) === 1;
      if (scope.decision) parrot.accelerationVelocity = Math.random() + 0.5;

      // Высота
      scope.decision = randomInteger(1, 50) === 1;
      if (scope.decision) parrot.velocityVertical = (Math.random() + 2.5) * yesOrNo();

      // Снизу
      scope.directionDown = new Three.Vector3(0, 0, 0).crossVectors(scope.x, scope.z);
      scope.raycasterDown.set(parrot.mesh.position, scope.directionDown);
      scope.intersections = scope.raycasterDown.intersectObjects(scope.objectsVertical);
      onDown = scope.intersections.length > 0;

      if (onDown && parrot.mesh.position.y > OBJECTS.PARROTS.maxHeight) {
        parrot.velocityVertical = 0;
        parrot.accelerationVelocity = 1.5;
      } else if (onDown || parrot.mesh.position.y < OBJECTS.PARROTS.minHeight) parrot.velocityVertical = Math.abs(parrot.velocityVertical);
      else if (parrot.mesh.position.y > OBJECTS.PARROTS.maxHeight) parrot.velocityVertical = -1 * Math.abs(parrot.velocityVertical);

      // Не слишком далеко: сильнее поворачиваем и продвигаем в правильную сторону
      if (distance2D(0, 0, parrot.mesh.position.x, parrot.mesh.position.z) > PARROTS_RADIUS) {
        parrot.mesh.rotateY(degreesToRadians(parrot.bend * parrot.accelerationBend * OBJECTS.PARROTS.velocityBend[parrot.mode] * scope.intoxication * scope.delta * 10));

        scope.directionOnHero.copy(parrot.mesh.position);
        scope.directionOnHero.add(parrot.mesh.getWorldDirection(scope.direction).multiplyScalar(scope.speed * OBJECTS.PARROTS.distance[parrot.mode] * scope.delta));

        if (distance2D(0, 0, scope.directionOnHero.x, scope.directionOnHero.z) < distance2D(0, 0, parrot.mesh.position.x, parrot.mesh.position.z))
          parrot.mesh.position.add(parrot.mesh.getWorldDirection(scope.direction).multiplyScalar(scope.speed * OBJECTS.PARROTS.distance[parrot.mode] * scope.delta * 2));
      } else {
        // Вперед!!!
        parrot.mesh.position.y += parrot.velocityVertical * scope.delta;
        parrot.mesh.position.add(parrot.mesh.getWorldDirection(scope.direction).multiplyScalar(scope.speed * OBJECTS.PARROTS.distance[parrot.mode] * scope.delta));
      }
    }

    parrot.pseudoMesh.position.set(parrot.mesh.position.x, parrot.mesh.position.y, parrot.mesh.position.z);
    if (parrot.mixer) parrot.mixer.update(scope.speed * scope.delta);
  };

  this.animate = (scope) => {
    parrots.filter(parrot => parrot.mode !== DESIGN.ENEMIES.mode.thing).forEach((parrot) => {
      switch (parrot.mode) {
        // Cпокойный режим
        case DESIGN.ENEMIES.mode.idle:
          // Крики 2
          scope.decision = randomInteger(1, OBJECTS.PARROTS.frequency.cry) === 1;
          if (scope.decision) {
            if (parrot.pseudoMesh.children[1] && parrot.pseudoMesh.children[1].isPlaying) parrot.pseudoMesh.children[1].stop();
            if (parrot.pseudoMesh.children[0] && !parrot.pseudoMesh.children[0].isPlaying) parrot.pseudoMesh.children[0].play();
          }

          sober(parrot, scope);
          break;

        // Aктивный режим
        case DESIGN.ENEMIES.mode.active:
          // Крики
          scope.decision = randomInteger(1, OBJECTS.PARROTS.frequency.cry2) === 1;
          if (scope.decision) {
            if (parrot.pseudoMesh.children[0] && parrot.pseudoMesh.children[0].isPlaying) parrot.pseudoMesh.children[0].stop();
            if (parrot.pseudoMesh.children[1] && !parrot.pseudoMesh.children[1].isPlaying) parrot.pseudoMesh.children[1].play();
          }

          sober(parrot, scope);
          break;

        // Опьянел
        case DESIGN.ENEMIES.mode.drunk:
          if (!parrot.isStop) {
            stop(parrot);
            parrot.isStop = true;
          }

          if (!parrot.isFall) {
            scope.speed = OBJECTS.PARROTS.velocityBend[DESIGN.ENEMIES.mode.idle] * parrot.stopSide * scope.delta / 30;
            parrot.mesh.rotateZ(scope.speed);
            parrot.stopAngle += Math.abs(scope.speed);
            if (parrot.stopAngle > Math.PI) parrot.isFall = true;
          } else {
            // Снизу distance
            scope.directionDown = new Three.Vector3(0, 0, 0).crossVectors(scope.x, scope.z);
            scope.raycasterDown.set(parrot.mesh.position, scope.directionDown);
            scope.intersections = scope.raycasterDown.intersectObjects(scope.objectsGround.concat(scope.objectsVertical));
            onDown = scope.intersections[0].distance ? scope.intersections[0].distance : 1;

            parrot.mesh.position.y -= scope.delta * 10;
            parrot.pseudoMesh.position.y = parrot.mesh.position.y;
            if (onDown < 1.5) {
              parrot.mode = DESIGN.ENEMIES.mode.thing;
              parrot.pseudoMesh.userData = { isThing: true };
              parrot.pseudoMesh.position.y -= 0.5;
              parrot.pseudoMesh.scale.set(0.5, 0.5, 0.5);
            }
          }
          break;
      }
    });
  };

  const stop = (parrot) => {
    if (parrot.mesh.children[0] && parrot.mesh.children[0].isPlaying) parrot.mesh.children[0].stop();

    // Крики
    if (parrot.pseudoMesh.children[0] && parrot.pseudoMesh.children[0].isPlaying) parrot.pseudoMesh.children[0].stop();
    if (parrot.pseudoMesh.children[1] && parrot.pseudoMesh.children[1].isPlaying) parrot.pseudoMesh.children[1].stop();
  };

  this.stop = () => {
    parrots.forEach((parrot) => {
      // Полет
      if (parrot.mesh.children[0] && parrot.mesh.children[0].isPlaying) parrot.mesh.children[0].stop();

      // Крики
      if (parrot.pseudoMesh.children[0] && parrot.pseudoMesh.children[0].isPlaying) parrot.pseudoMesh.children[0].stop();
      if (parrot.pseudoMesh.children[1] && parrot.pseudoMesh.children[1].isPlaying) parrot.pseudoMesh.children[1].stop();
    });
  };
}

export default Parrots;
