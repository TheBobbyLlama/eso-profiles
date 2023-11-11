import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import Profile from "../../components/Profile/Profile";

import { charActions } from "../../store/slice/characters";
import dbUtil from "../../db/util";
import { localize } from "../../localization";

function ViewProfile() {
	const { characterName } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (characterName) {
			dispatch(charActions.loadFullCharacterData(dbUtil.transform(characterName)));
		}
	}, [characterName, dispatch]);

	document.title = (characterName) ? `${characterName} - ${localize("APP_TITLE")}` : localize("APP_TITLE");

	return <Profile character={characterName} />
}

export default ViewProfile;