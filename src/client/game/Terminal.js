import { Container, Point, Graphics, Text, TextStyle, SCALE_MODES, settings, Sprite, RenderTexture } from 'pixi.js';
import { RGBSplitFilter } from 'pixi-filters';
import bluebird from "bluebird";

import * as engine from 'engine';
import * as display from 'engine/display';
import * as input from 'engine/input';
import * as resources from 'engine/resources';

import { randBetween, randItemFromArray } from 'helpers/random';

import { getFakeTextLines } from './fakeOutput';

export default class Terminal extends Sprite {
  constructor({ width = display.width, height = display.height, position = new Point(0, 0) } = {}) {
    const renderTexture = RenderTexture.create(width, height);
    super(renderTexture);

    const margin = height * 0.02;

    this.position.x = position.x + margin;
    this.position.y = position.y + margin;
    this.width = width - margin * 2;
    this.height = height - margin * 2;

    this.renderTexture = renderTexture;

    this.container = new Container();

    this.textLines = [];
    const style = new TextStyle({
        fontFamily: '"Lucia Console","Courier 10 Pitch","Nimbus Mono L","Courier New","Courier",monospace',
        fontSize: height * 0.02,
        fill: '#61ffb0',
    });

    this.text = new Text('', style);

    this.container.addChild(this.text);

    this.dirtyText = false;

    this.writeRandomLines();
  }

  render() {
    display.renderer.render(this.container, this.renderTexture);
  }

  update(delta) {
    if (this.dirtyText) {
      this.dirtyText = false;
      this.text.text = this.textLines.join('\n');
      this.render();
    }
  }

  writeRandomLines() {
    if (Math.random() > 0.1) {
      return this.write(getFakeTextLines(), true)
        .delay(randBetween(0, 300))
        .then(() => this.writeRandomLines());
    }

    return this.write(getFakeTextLines())
      .delay(randBetween(0, 2000))
      .then(() => {
        if (Math.random() > .8) {
          this.clear();
        }

        return this.writeRandomLines()
      });
  }

  updateText() {
    this.dirtyText = true;
  }

  write(textLines, instant) {
    if (instant) {
      this.textLines = textLines;

      this.updateText();
      return bluebird.resolve();
    }

    return this.writeLines(textLines);
  }

  clear() {
    this.textLines = [];
    this.updateText();
  }

  writeLines(lines, speed = randBetween(0, 200)) {
    if (!lines || !lines.length) {
      return;
    }

    this.writeLine(lines[0]);

    return bluebird.delay(speed * Math.random() * 2)
      .then(() => this.writeLines(lines.slice(1), speed));
  }

  writeLine(text) {
    this.textLines.push(text);

    if (this.text.height > this.height) {
      this.textLines.shift();
    }

    this.updateText();
  }

  writeLineAsync(text, speed = 0) {
    this.textLines.push('');
    if (this.text.height > this.height * .9) {
      this.textLines.shift();
    }

    return new bluebird.Promise((resolve) => {

      if (speed === 0) {
          this.textLines[this.textLines.length - 1] = text;
          this.updateText();
          resolve();
          return;
      }

      const timeToWrite = (Math.cos((Date.now()/ 1000) )) * 5 + (Math.cos((Date.now()/ 500) )) * 2.5;
      setTimeout(resolve, (text.length + 1) * timeToWrite);

      text.split('').forEach((character, index) => {
          setTimeout(
            () => {
              this.textLines[this.textLines.length - 1] = this.textLines[this.textLines.length - 1] + text[index];
              this.updateText();
            },
            index * timeToWrite
          );
      });
    });
  }
}
