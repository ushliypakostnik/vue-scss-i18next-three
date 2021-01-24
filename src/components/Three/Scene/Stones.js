import * as Three from 'three';

import { OBJECTS } from '@/utils/constants';
import { randomInteger, yesOrNo } from '@/utils/utilities';

import { DDSLoader } from '@/components/Three/Modules/Utils/DDSLoader';

function Stones() {
  this.init = function(scope, scene, objects) {
    const loader = new DDSLoader();

    const map = loader.load('./images/textures/stone.dds', () => {
      scope.render();
    });
    map.anisotropy = 4;

    for (let i = 0; i < OBJECTS.STONES.position.length; i++) {
      const elements = randomInteger(5, 20);

      for (let n = 0; n < elements; n++) {
        let radius;
        if (n === 0) {
          radius = randomInteger(10, 40);
        } else {
          radius = randomInteger(2, 20);
        }

        const geometry = new Three.OctahedronBufferGeometry(radius, randomInteger(0, 5));
        const material = new Three.MeshPhongMaterial({ map });
        const stone = new Three.Mesh(geometry, material);

        stone.position.x = OBJECTS.STONES.position[i][0] + randomInteger(25, 100) * yesOrNo();
        stone.position.y = randomInteger(-10, 10);
        stone.position.z =  OBJECTS.STONES.position[i][1] + randomInteger(25, 100) * yesOrNo();

        if (stone.position.y - radius > -1) stone.position.y = -1;

        // stone.castShadow = true;
        // stone.receiveShadow = true;

        stone.updateMatrix();
        stone.matrixAutoUpdate = false;

        scene.add(stone);
        objects.push(stone);
      }
    }
  };
}

export default Stones;
