import checkWordConflict from "./spellcheck";

/// Applies our filters and returns an array valid component lists for each possible word in the name.
function getComponentLists(dataset, nameInfo) {
	const result = [];
	let componentIndex = 1;
	const catIndex = dataset.findIndex(cat => (cat.category === nameInfo.category));

	if (catIndex < 0) {
		return result;
	}

	let curSubcat;

	if (dataset[catIndex].randomSubcategory) {
		let tmpList = dataset[catIndex].subcategories.map(subcat => subcat.name).filter((subcat, index, self) => ((subcat) && (self.indexOf(subcat) === index)))
		curSubcat = tmpList[getRandomIndex(tmpList.length)];
	} else {
		curSubcat = nameInfo.subcategory;
	}

	while (true) {
		const tmpResults = [];

		for (let x = 0; x < dataset[catIndex].subcategories.length; x++) {
			const curSet = dataset[catIndex].subcategories[x];

			if ((curSet.componentList.index === componentIndex) && ((!curSet.name) || (curSet.name === curSubcat))) {

				for (let i = 0; i < curSet.componentList.components.length; i++) {
					if ((!curSet.componentList.components[i].filter) || (nameInfo.filters.indexOf(curSet.componentList.components[i].filter) > -1)) {
						tmpResults.push(curSet.componentList.components[i]);
					}
				}
			}
		}

		if (tmpResults.length > 0) {
			result.push(tmpResults);
			componentIndex++;
		} else {
			return result;
		}
	}
}

/// Generates an individual name.
function generateName(workingList) {
	const result = [];

	for (let i = 0; i < workingList.length; i++) {
		result.push(createNameComponent(workingList[i]));
	}

	return result;
}

/// The heavy lifting of name generation - Chooses a component list and then builds a word from it.
function createNameComponent(componentList, stack = 0) {
	if (stack >= 100) {
		console.warn("Unable to generate name: All results were real words.")
		return "N/A";
	}

	const endRegex = /^\+?[bcdfghjklmnpqrstvwxyz]*[aeiou]*/i; // From the start of the string, optionally match any consonants, then any vowels.
	let count = 0;
	let random;
	let curList = 0;
	let curLength;
	let textResult = "";
	let result = [];

	for (let i = 0; i < componentList.length; i++) {
		count += componentList[i].list.length;
	}

	random = getRandomIndex(count);

	while (componentList[curList].list.length < random) {
		random -= componentList[curList].list.length;
		curList++;
	}

	if (typeof(componentList[curList].length) === "string") {
		const tmpVals = componentList[curList].length.split("-").map(element => parseInt(element));
		// Extra Math.random() is there to create a bias toward lower end of the scale!
		curLength = tmpVals[0] + Math.floor((((tmpVals[1] - tmpVals[0]) * Math.random()) + 1) * Math.random());
	} else {
		curLength = componentList[curList].length;
	}

	for (let i = 0; i < curLength; i++) {
		let workingList;
		let tmpComponent;
		let tmpEnd;
		let safety = 0;

		if (i === 0) {
			workingList = componentList[curList].list.filter(element => element[0] !== "+");
		} else if (i >= curLength - 1) {
			workingList = componentList[curList].list.filter(element => element[element.length - 1] !== "+");
		} else {
			workingList = componentList[curList].list.filter(element => ((element[0] === "+") && (element[element.length - 1] === "+")));
		}

		tmpComponent = workingList[getRandomIndex(workingList.length)];
		tmpEnd = tmpComponent.replace(endRegex, "");

		// Prevents generation of names with repeated consonants, like Ilelaliel.
		// Only checks against the end of the name so far, so something like Ilenalien (which is much less of a tongue twister) is still possible.
		while ((safety++ < 100) && (tmpEnd) && (result.length) && (result[result.length - 1].endsWith(tmpEnd))) {
			tmpComponent = workingList[getRandomIndex(workingList.length)];
			tmpEnd = tmpComponent.replace(endRegex, "");
		}

		result.push(tmpComponent.replace(/\+/g, ""));
	}

	for (let i = 0; i < result.length; i++) {
		// Reduce stems - If this is true, "Thresh" + "hold" will reduce to "Threshold" instead of "Threshhold"
		// This will work for any number of overlapping characters - "Breath" + "thorn" -> "Breathorn"
		if ((i < result.length - 1) && (componentList[curList].reduceStems)) {
			for (let x = 1; x < result[i].length; x++) {
				if (result[i + 1].startsWith(result[i].substring(x))) {
					// console.log("Reducing!", result.text[i], result.text[i + 1], result.text[i].length - x);
					result[i] = result[i].substring(0, x); // Chop the recurring characters off the end of the current piece.
					break;
				}
			}
		}

		textResult += result[i];
	}

	result = textResult;

	// If this is made up of syllables mashed together, don't let it collide with real words.
	if ((curLength > 1) && (checkWordConflict(result, componentList[curList].allowedWords))) {
		// console.log("Name '" + result + "' is a real word.  Trying again.");
		return createNameComponent(componentList, stack + 1);
	}

	return result;
}

/// Helper function for random numbers.
function getRandomIndex(max) {
	return Math.floor(max * Math.random());
}

export const generateNames = function(dataset, nameInfo, resultCount) {
	const results = [];

	let componentBucket = getComponentLists(dataset, nameInfo);

	for (let i = 0; i < resultCount; i++) {
		const nameResult = generateName(componentBucket);

		if (nameResult.length) {
			results.push(nameResult.join(" ").replace(/- /g, "-").replace(/ >/g, ""));

			if (dataset.find(cat => (cat.category === nameInfo.category))?.randomSubcategory) {
				componentBucket = getComponentLists(dataset, nameInfo);
			}
		}
	}

	results.sort();

	return results;
}