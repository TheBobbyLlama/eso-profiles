import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { get, set, ref } from "firebase/database";

import db, { auth } from ".";
import dbUtil from "./util";

// import { setLocalizationLanguage } from "../localization";

function loadUserData(accountName) {
	return new Promise  ((res) => {
		const accountRef = ref(db, `accounts/${dbUtil.transform(accountName)}`);

		get (accountRef).then(async (result) => {
			if (result.exists()) {
				const userData = result.val();

				// TODO - Whenever extra localization is added!
				// if (userData.language) {
				// 	setLocalizationLanguage(userData.language);
				// }

				res(userData);
			} else {
				res({ display: accountName });
			}
		})
	});
}

// Load metadata, then check if user is already logged in.
function startupTasks() {
	return new Promise((res) => {
		if (auth.currentUser) {
			res(loadUserData(auth.currentUser.displayName));
		} else {
			res(false);
		}
	});
}

function login(userData) {
	return new Promise((res, rej) => {
		try {
			signInWithEmailAndPassword(auth, userData.email, userData.password).then((result) => {
				const { displayName } = result.user;

				return loadUserData(displayName);
			}).then(res).catch((e) => {
				rej(e.toString());
			});
		} catch (e) {
			rej(e.toString());
		}
	});
}

function logout() {
	return new Promise((res) => {
		signOut(auth).then(res);
	});
}

function signup(userData) {
	return new Promise((res, rej) => {
		try {
			const displayName = userData.displayName.match(/(?:@*)([\w]+)/)[1]; // Strip any @ the user may have added
			const accountRef = ref(db, `accounts/${dbUtil.transform(displayName)}`);

			get(accountRef).then((result) => {
				if (result.exists()) {
					rej("ERROR_ACCOUNT_NAME_TAKEN");
				} else {
					createUserWithEmailAndPassword(auth, userData.email, userData.password).then((credentials) => {
						return updateProfile(credentials.user, { displayName });
					}).then(() => {
						return set(accountRef, { display: displayName });
					}).then(() => {
						res({ display: displayName }); // Return bare account data object
					}).catch((e) => {
						rej(e.toString());
					});
				}
			});
		} catch (e) {
			rej(e.toString());
		}
	});
}

const authFuncs = {
	startupTasks,
	login,
	logout,
	signup,
};

export default authFuncs;