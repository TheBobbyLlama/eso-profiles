let localizationData = {};

export const languageOptions = [
	{
		label: "English",
		key: "EN-US"
	}
]

export const setLocalizationLanguage = async (language) => {
	if (!languageOptions.find(data => data.key === language)) {
		language = "EN-US";
	}

	localizationData = await require("./" + language + ".json");
}

export const localize = (key) => {
	let result = localizationData[key] || key;
	const nestedKeys = result.match(/\[\[.+?\]\]/g);
	nestedKeys?.forEach(item => result = result.replaceAll(item, localize(item.substring(2, item.length - 2))));
	return result;
}

setLocalizationLanguage(navigator.language?.toUpperCase());