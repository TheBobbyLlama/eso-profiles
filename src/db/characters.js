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

const characterFuncs = {
	getAllCharacterData,
	getFullCharacterData,
	getCharacterProfileData,
};

export default characterFuncs;