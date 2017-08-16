const debug = require('debug')('histoirotron:storyGenerator');

const dictionary = require('./dictionary');

const contextTags = {
  espace: 5,
  cute: 5,
}

generateStory();

function generateStory() {
  const context = { contextTags, persistantValues : {} };
  const bucket = dictionary.map(parsePart);

  const story = fillPart('<story>', bucket, context);
  debug('---------- Story -----------');
  debug(story);
  debug('----------- End ------------');
  debug('Final context', context);
}


function fillPart(part, bucket, context = {}) {
  return part.replace(/<(.*?)>/gi,
    (fullText, keywords) => fillPart(findPart(bucket, context, ...keywords.split(" ")), bucket, context)).replace(/\/\/\//g, '\n');
}


// Returns a part (string) from an <element> by finding a matching part. Handle
// persistant values if needed.
function findPart(bucket, context, partType, ...partTags) {
	const contextMatch = partType.match(/@(.*)/);

  if (contextMatch) {
  	partType = contextMatch[1];
  	const contextKey = `${partType}-${partTags.join('-')}`;

    if (!context.persistantValues[contextKey]) {
    	context.persistantValues[contextKey] = fillPart(requestMatchingPart(bucket, context, partType, partTags), bucket, context);
    }

		return context.persistantValues[contextKey];
  }

  return requestMatchingPart(bucket, context, partType, partTags);
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
    choosenPart.contextTags.forEach( tag => {
      if(!context.contextTags[tag]) context.contextTags[tag] = 0;
      context.contextTags[tag]++;
    });
    return choosenPart.value;
  }

  return '[...]';
}

function parsePart(part) {
	const reg = /(.*?)(\s.*?)?:(.*)/g
  const res = reg.exec(part);
  return {
  	type: res[1].trim(),
    tags: getAllMatches(/\#(.*?)(\s|$)/g, res[2]).map(match => match[1]),
    contextTags: getAllMatches(/\!(.*?)(\s|$)/g, res[2]).map(match => match[1]),
    value: res[3].trim(),
  };
}

function parseTags(tags) {
	return tags.split('#')
  	.filter(tag => tag !== '')
    .map(tag => tag.trim());
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
  let m;
  const res = [];
  while ((m = regexp.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
        regexp.lastIndex++;
    }

    res.push(m)

  }
  return res;
}


module.exports = fillPart;
