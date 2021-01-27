import * as Three from 'three';

import { OBJECTS } from '@/utils/constants';
import { randomInteger, yesOrNo, loaderDispatchHelper } from '@/utils/utilities';


import { DDSLoader } from '@/components/Three/Modules/Utils/DDSLoader';

function Stones() {
  this.init = function(scope, scene, objects, view) {
    const loader = new DDSLoader();

    const map = loader.load('./images/textures/stone.dds', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'stoneLoaded');
    });
    map.anisotropy = 4;
    const material = new Three.MeshPhongMaterial( { map } );

    switch (view) {
      case 'mountains':
        for (let i = 0; i < OBJECTS.MOUNTAINS.position.length; i++) {
          const top = randomInteger(0, OBJECTS.MOUNTAINS.topMax);
          const bottom = randomInteger(OBJECTS.MOUNTAINS.bottomMin, OBJECTS.MOUNTAINS.bottomMax);

          const geometry = new Three.CylinderBufferGeometry( top, bottom, OBJECTS.MOUNTAINS.position[i][2], 4, 1 );
          const stone = new Three.Mesh(geometry, material);

          stone.position.x = OBJECTS.MOUNTAINS.position[i][0];
          stone.position.y = -0.01;
          stone.position.z = OBJECTS.MOUNTAINS.position[i][1];

          // stone.castShadow = true;
          // stone.receiveShadow = true;

          stone.updateMatrix();
          stone.matrixAutoUpdate = false;

          scene.add(stone);
          objects.push(stone);
        }
        loaderDispatchHelper(scope.$store, 'mountainsBuilt');
        break;
      case 'stones':
        for (let i = 0; i < OBJECTS.STONES.position.length; i++) {
          const elements = randomInteger(OBJECTS.STONES.quantityMin, OBJECTS.STONES.quantityMax);

          for (let n = 0; n < elements; n++) {
            let radius;
            if (n === 0) {
              radius = randomInteger(OBJECTS.STONES.largeMin, OBJECTS.STONES.largeMax);
            } else {
              radius = randomInteger(OBJECTS.STONES.smallMin, OBJECTS.STONES.smallMax);
            }

            const geometry = new Three.OctahedronBufferGeometry(radius, randomInteger(1, 5));
            const stone = new Three.Mesh(geometry, material);

            stone.position.x = OBJECTS.STONES.position[i][0] + randomInteger(20, 80) * yesOrNo();
            stone.position.y = randomInteger(-0.5 * radius, radius * 0.5);
            stone.position.z =  OBJECTS.STONES.position[i][1] + randomInteger(20, 80) * yesOrNo();

            if (stone.position.y - radius > 0) stone.position.y -= radius / 2;
            if (stone.position.y + radius < 0) stone.position.y += radius / 2;

            // stone.castShadow = true;
            // stone.receiveShadow = true;

            stone.updateMatrix();
            stone.matrixAutoUpdate = false;

            scene.add(stone);
            objects.push(stone);
          }
        }
        loaderDispatchHelper(scope.$store, 'stonesBuilt');
        break;
      default:
        break;
    }
  };
}

export default Stones;
