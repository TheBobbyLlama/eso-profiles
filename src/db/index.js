import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const scramble = [ "AIz", "8dl", "0fr", "DcR", "aSy", "3ix", "Zxt", "N1b", "Ake", "FEM", "cNu", "YPo", "vKU" ];

function buildKey() {
	let result = "";

	for (let i = 0; i < scramble.length; i++) {
		result += scramble[(17 * i) % scramble.length];
	}

	return result;
}

const firebaseConfig = {
	apiKey: buildKey(),
	authDomain: "eso-roleplay.firebaseapp.com",
	databaseURL: "https://eso-roleplay.firebaseio.com",
	projectId: "eso-roleplay",
	storageBucket: "eso-roleplay.appspot.com",
	messagingSenderId: "119094011178",
	appId: "1:119094011178:web:0954057546a32fda3e6a53"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export const auth = getAuth(app);

export default database;