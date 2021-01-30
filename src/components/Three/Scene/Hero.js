import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function Hero() {
  const audioLoader = new Three.AudioLoader();
  const listener = new Three.AudioListener();

  let steps;
  let run;
  let watersteps;
  let waterrun;
  let waterjump;
  let jump;
  let spit;

  let onFly = false;
  let onFloor = 0;
  let shot = 0;

  const geometry = new Three.SphereBufferGeometry(1, 1, 1);
  const material = new Three.MeshStandardMaterial({ color: 0xff0000 });

  this.init = function(scope) {

    /*
    const geometry = new Three.SphereBufferGeometry( 2, 32, 32 );
    const material = new Three.MeshStandardMaterial( { color: 0xff0000 } );

    steps = new Three.Mesh(geometry, material);
    steps.position.set(camera.position);
    steps.visible = false;

    audioLoader.load( './audio/steps.mp3', (buffer) => {
      const audio = new Three.PositionalAudio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME);
      audio.setLoop(true);

      steps.add(audio);
      scene.add(steps);
      loaderDispatchHelper($store, 'isStepComplete');
    });
    */

    steps = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/steps.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);
      audio.setLoop(true);

      steps.add(audio);
      steps.visible = false;

      scope.scene.add(steps);
      loaderDispatchHelper(scope.$store, 'isStepComplete');
    });

    run = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/run.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);
      audio.setLoop(true);

      run.add(audio);
      run.visible = false;

      scope.scene.add(run);
      loaderDispatchHelper(scope.$store, 'isRunComplete');
    });

    watersteps = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/waterstep.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);
      audio.setLoop(true);

      watersteps.add(audio);
      watersteps.visible = false;

      scope.scene.add(watersteps);
      loaderDispatchHelper(scope.$store, 'isWaterStepsComplete');
    });

    waterrun = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/waterrun.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);
      audio.setLoop(true);

      waterrun.add(audio);
      waterrun.visible = false;

      scope.scene.add(waterrun);
      loaderDispatchHelper(scope.$store, 'isWaterRunComplete');
    });

    jump = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/jump.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);

      jump.add(audio);
      jump.visible = false;

      scope.scene.add(jump);
      loaderDispatchHelper(scope.$store, 'isJumpComplete');
    });

    waterjump = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/waterjump.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);

      waterjump.add(audio);
      waterjump.visible = false;

      scope.scene.add(waterjump);
      loaderDispatchHelper(scope.$store, 'isWaterJumpComplete');
    });

    spit = new Three.Mesh(geometry, material);

    audioLoader.load( './audio/spit.mp3', (buffer) => {
      const audio = new Three.Audio(listener);
      audio.setBuffer(buffer);
      audio.setVolume(DESIGN.VOLUME.normal);

      spit.add(audio);
      spit.visible = false;

      scope.scene.add(spit);
      loaderDispatchHelper(scope.$store, 'isSpitComplete');
    });
  };

  const stop = (play) => {
    if (play !== 'steps' && steps && steps.children[0] && steps.children[0].isPlaying) steps.children[0].stop();
    if (play !== 'run' && run && run.children[0] && run.children[0].isPlaying) run.children[0].stop();
    if (play !== 'watersteps' && watersteps && watersteps.children[0] && watersteps.children[0].isPlaying) watersteps.children[0].stop();
    if (play !== 'waterrun' && waterrun && waterrun.children[0] && waterrun.children[0].isPlaying) waterrun.children[0].stop();
  };

  this.animate = function(scope) {
    if (!scope.pause) {
      if (scope.ammoIdx !== shot) {
        if (spit && spit.children[0]) {
          spit.children[0].play();
        }
        shot = scope.ammoIdx;
      } else if (scope.canJump !== !onFly) {
        if (onFly) {
          if (scope.inWater) {
            if (waterjump && waterjump.children[0]) {
              stop();
              waterjump.children[0].play();
            }
          } else {
            if (jump && jump.children[0]) {
              stop();
              jump.children[0].play();
            }
          }
        }
        onFly = !scope.canJump;
      } else if (scope.onObjectHeight !== onFloor) {
        if (scope.inWater) {
          if (waterjump && waterjump.children[0]) {
            stop();
            waterjump.children[0].play();
          }
        } else {
          if (jump && jump.children[0]) {
            stop();
            jump.children[0].play();
          }
        }
        onFloor = scope.onObjectHeight;
      } else {
        if (scope.moveForward || scope.moveBackward || scope.moveLeft || scope.moveRight) {
          if (scope.moveRun) {
            if (scope.inWater) {
              if (waterrun && waterrun.children[0]) {
                stop('waterrun');
                waterrun.children[0].play();
              }
            } else {
              if (run && run.children[0]) {
                stop('run');
                run.children[0].play();
              }
            }
          }

          if (!scope.moveRun) {
            if (scope.inWater) {
              if (watersteps && watersteps.children[0]){
                stop('watersteps');
                if (scope.moveHidden) {
                  watersteps.children[0].setPlaybackRate(0.75);
                } else watersteps.children[0].setPlaybackRate(1);
                watersteps.children[0].play();
              }
            } else {
              if (steps && steps.children[0]){
                if (scope.moveHidden) {
                  steps.children[0].setPlaybackRate(0.75);
                } else steps.children[0].setPlaybackRate(1);
                stop('steps');
                steps.children[0].play();
              }
            }
          }
        } else {
          stop();
        }
      }
    } else {
      stop();
    }
  };
}

export default Hero;