import vertex from 'filters/tools/default.vert';
import fragment from './badTv.frag';

import {Filter} from 'pixi.js';

export default class BadTvFilter extends Filter {
  constructor(distortion = 0.3) {
     super(vertex, fragment);
     this.setStrength(1);
  }

  setStrength(strength) {
    this.uniforms.distortion = 0.6 * strength * strength;
    this.uniforms.distortion2 = 0.3 * strength;
    this.uniforms.speed = 0.1 * strength * strength;
  }
}
