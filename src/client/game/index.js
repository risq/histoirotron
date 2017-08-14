import './style.css'; // webpack magic

import { Container, Point, Graphics, Text, TextStyle, SCALE_MODES, settings, Sprite } from 'pixi.js';
import { RGBSplitFilter } from 'pixi-filters';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

import bluebird from "bluebird";

import * as engine from 'engine';
import * as display from 'engine/display';
import * as input from 'engine/input';
import * as resources from 'engine/resources';
import Scene from 'engine/Scene';

import BadTvFilter from 'filters/badTv';
import CrtFilter from 'filters/crt';

import { randBetween, randItemFromArray } from 'helpers/random';

import { getFakeOutput } from './fakeOutput';
import Terminal from './Terminal';

class Histoirotron extends Scene {
  init() {
    this.badTvFilter = new BadTvFilter();
    this.crtFilter = new CrtFilter();
    this.RGBSplitFilter = new RGBSplitFilter();

    this.stage.filters = [
      this.badTvFilter,
      this.RGBSplitFilter,
      this.crtFilter,
    ];

    this.background = new Graphics();
    this.background.beginFill(0x111111);
    this.background.drawRect(0, 0, display.width, display.height);
    this.stage.addChild(this.background);

    this.terminals = [
      new Terminal({
        width: display.width / 2,
        height: display.height,
      }),
      new Terminal({
        position: new Point(display.width / 2, 0),
        width: display.width / 2,
        height: display.height / 2,
      }),
      new Terminal({
        position: new Point(display.width / 2, display.height / 2),
        width: display.width / 2,
        height: display.height / 2,
      }),
    ];

    this.terminals.forEach(terminal => this.stage.addChild(terminal));

    const strokeSize = 6;
    const margin = strokeSize / 2;

    this.lines = new Graphics();
    this.lines.lineStyle(strokeSize, 0x61ffb0)
       .moveTo(margin, margin)
       .lineTo(display.width - margin, margin)
       .lineTo(display.width - margin, display.height - margin)
       .lineTo(margin, display.height - margin)
       .lineTo(margin, margin)
       .moveTo(display.width / 2, margin)
       .lineTo(display.width / 2, display.height - margin)
       .moveTo(display.width / 2, display.height / 2)
       .lineTo(display.width - margin, display.height / 2)

    this.stage.addChild(this.lines);

    this.glitch();
  }

  update(delta) {
    const time = performance.now() / 1000;

    this.badTvFilter.uniforms.time = time;
    this.crtFilter.uniforms.time = time;

    for (let i = this.terminals.length - 1; i >= 0; i--) {
      this.terminals[i].update();
    }
  }

  glitch() {
    const strength = Math.random();
    const invStrength = 1 - strength;

    this.badTvFilter.setStrength(1 + strength * 4);
    this.randomizeRGBSplit(50 * (strength / strength / 2));

    return bluebird.delay(randBetween(5, 2000 * invStrength))
      .then(() => {
        this.badTvFilter.setStrength(1);
        this.randomizeRGBSplit(randBetween(1, 4));
      })
      .delay(randBetween(100, 5000))
      .then(() => this.glitch());
  }

  randomizeRGBSplit(size = 1) {
    this.RGBSplitFilter.uniforms.red.x = randBetween(-size, size);
    this.RGBSplitFilter.uniforms.red.y = randBetween(-size, size);
    this.RGBSplitFilter.uniforms.green.x = randBetween(-size, size);
    this.RGBSplitFilter.uniforms.green.y = randBetween(-size, size);
    this.RGBSplitFilter.uniforms.blue.x = randBetween(-size, size);
    this.RGBSplitFilter.uniforms.blue.y = randBetween(-size, size);
  }
}

const parentElement = document.body;
parentElement.innerHTML = '<div class="msg-loading">Loading...</div>';

engine.launch(new Histoirotron(), {parentElement});
