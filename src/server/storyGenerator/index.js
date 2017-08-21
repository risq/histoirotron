const debug = require('debug')('histoirotron:storyGenerator');

const dictionary = require('./dictionary');

const contextTags = {
  //drug: 3,
  //pirate: 3,
}

function generateStory() {
  const context = { contextTags, persistantValues : {} };
  const bucket = dictionary.map(parsePart);

  const story = fillPart('<story>', bucket, context)
    .split('\n')
    .map(line => {
      line = line.trim();
      return line[0].toUpperCase() + line.slice(1);
    })
    .join('\n')
    .replace(/de le/g, 'du')
    .replace(/de les/g, 'des')
    .replace(/de y/g, 'd\'y')
    .replace(/,\./g, '.');
  debug('---------- Story -----------');
  debug(story);
  debug('----------- End ------------');
  debug('Final context', context);
  return story;
}


function fillPart(part, bucket, context = {}) {
  return part.replace(/<(.*?)>/gi,
    (fullText, keywords) => fillPart(findPart(bucket, context, ...keywords.split(" ")), bucket, context)).replace(/\/\/\//g, '\n');
}


// Returns a part (string) from an <element> by finding a matching part. Handle
// persistant values if needed.
function findPart(bucket, context, partType, ...partTags) {
  let contextKey;
	const contextMatch = partType.match(/@(.+)/);
	const namedContextMatch = partType.match(/(.+)@(.+)/);
  const alternativeRegex = /\((.*?),(.*?)\)/g;

  if (namedContextMatch) {
    contextKey = namedContextMatch[1]
    partType = namedContextMatch[2];
  } else if (contextMatch) {
  	partType = contextMatch[1];
  	contextKey = `${partType}-${partTags.join('-')}`;
  }

  if (contextKey) {
    if (!context.persistantValues[contextKey]) {
    	context.persistantValues[contextKey] = fillPart(requestMatchingPart(bucket, context, partType, partTags), bucket, context);

      return context.persistantValues[contextKey].replace(alternativeRegex, "$1")
    } else {
      return context.persistantValues[contextKey].replace(alternativeRegex, "$2");
    }
  }

  return requestMatchingPart(bucket, context, partType, partTags).replace(alternativeRegex, "$1");
}

// From all the parts in a bucket, returns the best result for a type with tags
function requestMatchingPart(bucket, context, partType, partTags) {
  // filter by partTags:
	const matchingParts = bucket.filter(
  	availablePart =>
    	partType === availablePart.type &&
      partTags.every(tag => availablePart.tags.includes(tag))
  ).map(filteredPart => {
    // compûtes the score of each candidate
    const score =  filteredPart.tags.reduce(
      (acc, tag) => (context.contextTags[tag] !== undefined ? acc + context.contextTags[tag] : acc), 0);
    return {part: filteredPart, score };
  });

  if (matchingParts.length) {
    // select random into the best scores
  	const choosenPart = getBestScorePart(matchingParts);
    choosenPart.contextTags.forEach(tag => {
      if(!context.contextTags[tag]) context.contextTags[tag] = 0;
      context.contextTags[tag]++;
    });
    bucket.splice(bucket.findIndex(part => part === choosenPart), 1);
    return choosenPart.value;
  }

  console.log(`> Can not find part for ${partType} ${partTags.join(',')}`)
  return '[...]';
}

function parsePart(part) {
	const reg = /(.*?)(\s.*?)?:(.*)/g
  const res = reg.exec(part);
  return {
  	type: res[1].trim(),
    tags: getAllMatches(/([a-zA-Z0-9\-]+)(\s|$)/g, res[2]).map(match => match[1]),
    contextTags: getAllMatches(/\!(.*?)(\s|$)/g, res[2]).map(match => match[1]),
    value: res[3].trim(),
  };
}

function getBestScorePart(results) {
  const bestParts = results.sort((a, b) => b.score - a.score)
    .filter((result, index, array) => result.score === array[0].score);
	return getRandomFromArray(bestParts).part;
}

function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getAllMatches(regexp, str) {
  if (!str) {
    return [];
  }

  let m;
  const res = [];
  while ((m = regexp.exec(str.trim())) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
        regexp.lastIndex++;
    }

    res.push(m)

  }
  return res;
}


module.exports = {
  generateStory,
};
