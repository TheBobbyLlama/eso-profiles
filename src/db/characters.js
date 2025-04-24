import { get, ref, set, update } from "firebase/database";
import dbUtil from "./util";

import db from ".";

function getAllCharacterData() {
	return new Promise((res) => {
		const charList = ref(db, `characters`);

		get(charList).then(async (result) => {
			if (result.exists()) {
				res(result.val());
			} else {
				res({});
			}
		});
	});
}

function getFullCharacterData(key) {
		return new Promise((res) => {
			const charRef = ref(db, `characters/${key}`);

			get(charRef).then(async (charResult) => {
				if (charResult.exists()) {
					const charData = { character: charResult.val() };
					const profileRef = ref(db, `profiles/${key}`);

					get(profileRef).then(async (profileResult) => {
						if (profileResult.exists()) {
							charData.profile = profileResult.val();

							res(charData);
						} else {
							res(charData);
						}
					})
				} else {
					res({});
				}
			})
		})
}

function getCharacterProfileData(key) {
	return new Promise((res) => {
		const profileRef = ref(db, `profiles/${key}`);

		get(profileRef).then(async (result) => {
			if (result.exists()) {
				res({ [key]: result.val() });
			} else {
				res({ [key]: {}});
			}
		})
	})
}

async function canSaveCharacter(key, user, create) {
	if (!key) throw new Error("canSaveCharacter: No character key!");
	if (!user) throw new Error("canSaveCharacter: No user!");

	const characterRef = ref(db, `characters/${key}`);
	const result = await get(characterRef);

	if (result.exists()) {
		if (create) {
			return false;
		} else {
			return result.val().player === user;
		}
	} else {
		return true;
	}
}

async function canDeleteCharacter(key, user) {
	if (!key) throw new Error("canSaveCharacter: No character key!");
	if (!user) throw new Error("canSaveCharacter: No user!");

	const characterRef = ref(db, `characters/${key}`);
	const result = await get(characterRef);

	if (result.exists()) {
		return result.val().player === user;
	} else {
		return false;
	}
}

async function addCharacterToAccountList(user, characterName) {
	if (!user) throw new Error("addCharacterToAccountList: No user!");
	if (!characterName) throw new Error("addCharacterToAccountList: No name!");

	const listRef = ref(db, `accounts/${dbUtil.transform(user)}/characters`);

	get(listRef).then((result) => {
		const charList = result.val() || [];

		if (charList.indexOf(characterName) < 0) {
			charList.push(characterName);
			charList.sort();
			set(listRef, charList);
		}
	})
}

async function removeCharacterFromAccountList(user, characterName) {
	if (!user) throw new Error("removeCharacterFromAccountList: No user!");

	const listRef = ref(db, `accounts/${dbUtil.transform(user)}/characters`);

	get(listRef).then((result) => {
		const charList = result.val() || [];

		set(listRef, charList.filter(name => name !== characterName));
	})
}

function saveCharacter(characterData) {
	const key = dbUtil.transform(characterData.character.name);

	if (!key) throw new Error("saveCharacter: No character key!");

	addCharacterToAccountList(characterData.character.player, characterData.character.name);

	const updates = {};
	updates[`characters/${key}`] = characterData.character;
	updates[`profiles/${key}`] = characterData.profile || null;

	return update(ref(db), updates);
}

function deleteCharacter(characterName, user) {
	const key = dbUtil.transform(characterName);

	if (!key) throw new Error("saveCharacter: No character key!");

	removeCharacterFromAccountList(user, characterName);

	const updates = {};
	updates[`characters/${key}`] = null;
	updates[`profiles/${key}`] = null;
	updates[`stories/${key}`] = null;
	updates[`storytext/${key}`] = null;

	return update(ref(db), updates);
}

const characterFuncs = {
	canSaveCharacter,
	canDeleteCharacter,
	deleteCharacter,
	getAllCharacterData,
	getFullCharacterData,
	getCharacterProfileData,
	saveCharacter,
};

export default characterFuncs;