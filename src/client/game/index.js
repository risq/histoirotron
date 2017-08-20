import './style.css'; // webpack magic

import { Container, Point, Graphics, Text, TextStyle, SCALE_MODES, settings, Sprite } from 'pixi.js';
import { RGBSplitFilter } from 'pixi-filters';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

import bluebird from "bluebird";
import io from 'socket.io-client';

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

    this.socket = io('http://localhost:8000');

    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));
    this.socket.on('startScanAnimation', () => this.startScanAnimation());
    this.socket.on('startEndAnimation', () => this.startEndAnimation());

    this.badTvFilter = new BadTvFilter();
    this.crtFilter = new CrtFilter();
    this.RGBSplitFilter = new RGBSplitFilter();

    this.stage.filters = [
      this.badTvFilter,
      this.RGBSplitFilter,
      this.crtFilter,
    ];

    this.randomizeRGBSplit(0);

    this.background = new Graphics();
    this.background
      .beginFill(0x111111)
      .drawRect(0, 0, display.width, display.height);

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
    this.lines
      .lineStyle(strokeSize, 0x61ffb0)
      .moveTo(margin, margin)
      .lineTo(display.width - margin, margin)
      .lineTo(display.width - margin, display.height - margin)
      .lineTo(margin, display.height - margin)
      .lineTo(margin, margin)
      .moveTo(display.width / 2, margin)
      .lineTo(display.width / 2, display.height - margin)
      .moveTo(display.width / 2, display.height / 2)
      .lineTo(display.width - margin, display.height / 2);

    this.stage.addChild(this.lines);

    const popupHeight = display.height / 5;
    const popupWidth = display.width / 2;

    this.messages = {
      begin: Sprite.fromFrame('message1'),
      end: Sprite.fromFrame('message2'),
    }

    this.messages.begin.anchor.set(0.5, 0.5);
    this.messages.begin.position.set(display.width / 2, display.height / 2);

    this.messages.end.anchor.set(0.5, 0.5);
    this.messages.end.position.set(display.width / 2, display.height / 2);
    this.messages.end.visible = false;

    this.stage.addChild(this.messages.begin);
    this.stage.addChild(this.messages.end);
  }

  update(delta) {
    const time = performance.now() / 1000;

    this.badTvFilter.uniforms.time = time;
    this.crtFilter.uniforms.time = time;

    for (let i = this.terminals.length - 1; i >= 0; i--) {
      this.terminals[i].update();
    }
  }

  startGlitch() {
    if (this.isGlitching) {
      return;
    }

    this.isGlitching = true;
    this.terminals.forEach(terminal => terminal.isGlitching = true);

    this.glitch();
  }

  stopGlitch() {
    if (!this.isGlitching) {
      return;
    }

    this.isGlitching = false;
    this.terminals.forEach(terminal => terminal.isGlitching = false);

    this.randomizeRGBSplit(0);
  }

  glitch() {
    if (!this.isGlitching) {
      return;
    }

    const strength = Math.random();
    const invStrength = 1 - strength;

    this.badTvFilter.setStrength(1 + strength * 4);
    this.randomizeRGBSplit(50 * (strength / strength / 2));

    return bluebird.delay(randBetween(5, 2000 * invStrength))
      .then(() => {
        this.badTvFilter.setStrength(1);
        this.randomizeRGBSplit(randBetween(1, 4));
      })
      .delay(randBetween(10, 500))
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

  startScanAnimation() {
    if (this.endAnimationTimeout) {
      clearTimeout(this.endAnimationTimeout);
    }

    this.messages.begin.visible = false;
    this.messages.end.visible = false;

    this.startGlitch();
  }

  startEndAnimation() {
    if (this.endAnimationTimeout) {
      clearTimeout(this.endAnimationTimeout);
    }

    this.messages.begin.visible = false;
    this.messages.end.visible = true;
    this.stopGlitch();

    this.endAnimationTimeout = setTimeout(() => {
      this.messages.begin.visible = true;
      this.messages.end.visible = false;
    }, 10000);
  }
}

const parentElement = document.body;
parentElement.innerHTML = '<div class="msg-loading">Loading...</div>';

engine.launch(new Histoirotron(), {parentElement});
