import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";

import db, { auth } from ".";

function loadUserData(uid) {
	console.log("loadUserData", uid);
	return;
	return new Promise((res, rej) => {
		const userRef = ref(db, `users/${uid}`);

		get(userRef).then(async (result) => {
			if (result.exists()) {
				const output = { ...result.val(), uid };

				output.permissions = output.permissions ? output.permissions.split("+") : [];

				if (output.permissions.find(item => item === "developer")) {
					output.towns = window.metadata?.towns || [];
				}

				if (!output.towns) {
					output.towns = [];
				}

				res(output);
			} else {
				rej("No user data found.");
			}
		}).catch(rej);
	})
}

// Load metadata, then check if user is already logged in.
function startupTasks() {
	return new Promise((res) => {
		if (auth.currentUser) {
			res(loadUserData(auth.currentUser.uid));
		} else {
			res(false);
		}
	});
}

function login(userData) {
	return new Promise((res, rej) => {
		try {
			signInWithEmailAndPassword(auth, userData.email, userData.password).then((result) => {
				const { uid } = result.user;

				return loadUserData(uid);
			}).then(res).catch(rej);
		} catch (e) {
			rej(e);
		}
	});
}

function logout() {
	return new Promise((res) => {
		signOut(auth).then(res);
	});
}

const authFuncs = {
	startupTasks,
	login,
	logout,
};

export default authFuncs;