import { get, ref } from "firebase/database";

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

const characterFuncs = {
	getAllCharacterData,
	getCharacterProfileData,
};

export default characterFuncs;