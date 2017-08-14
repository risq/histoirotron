import vertex from 'filters/tools/default.vert';
import fragment from './crt.frag';

import {Filter} from 'pixi.js';

export default class CrtFilter extends Filter {
  constructor(distortion = 0.3) {
     super(vertex, fragment);
     this.uniforms.grayscale = false;
     this.uniforms.nIntensity = .3;
     this.uniforms.sIntensity = .6;
     this.uniforms.sCount = 500;
  }
}
