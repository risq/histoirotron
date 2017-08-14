import { randBetween, randItemFromArray } from 'helpers/random';

function requireAllLogs() {
  const requireFunction = require.context('./data/', true, /\.log$/);
  return requireFunction.keys().map(file => requireFunction(file));
}

const logs = requireAllLogs();

function getTextLines() {
  return randItemFromArray(logs)
    .split('\n')
    .slice(0, randBetween(20, 60))
    .concat('', '', '');
}

function glitchText(textLines) {
  return textLines.reduce((acc, textLine) => {
    const rand = randBetween(0, 25);

    if (rand === 0) {
      return acc.concat(
        Array(randBetween(2, 20))
          .fill(textLine)
          .map(line => glitchLine(line))
      );
    } else if (rand < 5) {
      return acc.concat(glitchLine(textLine), glitchLine(textLine));
    }

    return acc.concat(glitchLine(textLine));
  }, [])
}

function glitchLine(line) {
  const amount = randBetween(0, 5);

  for (let i = 0; i < amount; i++) {
    const position = randBetween(0, line.length);

    if (line[position] === ' ') {
      continue;
    }

    const char = String.fromCharCode(randBetween(65, 255));
    line = line.slice(0, position) + char + line.slice(position + 1, line.length);
  }

  const spaces = Math.random() > 0.8 && randBetween(0, 10);
  for (let i = 0; i < spaces; i++) {
    line = ' ' + line;
  }

  return line;
}

function joinTexts(a, b) {
  return a.reduce((acc, line, lineIndex) => {
    if (!b[lineIndex]) {
      return [...acc, line];
    }

    const rand = randBetween(0, 3);

    if (rand === 0) {
      return [...acc, line, b[lineIndex]];
    } else if (rand === 1) {
      return [...acc, b[lineIndex]];
    }

    return [...acc, line];
  }, []);
}

export function getFakeTextLines() {
  if (Math.random() > 0.3) {
    return glitchText(joinTexts(getTextLines(), getTextLines()));
  }
  return glitchText(getTextLines());
}
