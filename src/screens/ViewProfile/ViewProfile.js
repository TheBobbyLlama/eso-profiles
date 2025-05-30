import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Profile from "../../components/Profile/Profile";

import { authSelectors } from "../../store/slice/auth";
import { charActions, charSelectors } from "../../store/slice/characters";
import dbUtil from "../../db/util";
import { localize } from "../../localization";

function ViewProfile() {
	const { characterName } = useParams();
	const [ curCharacter, setCurCharacter ] = useState("");
	const characterData = useSelector(charSelectors.list)[dbUtil.transform(characterName)];
	const user = useSelector(authSelectors.user);
	const dispatch = useDispatch();

	// Load character data if needed.  This should always trigger?
	useEffect(() => {
		if ((characterName) && (!characterData?.profile)) {
			dispatch(charActions.loadFullCharacterData(dbUtil.transform(characterName)));
		}
	}, [characterName, characterData, dispatch]);

	// Delay setting current character until data is loaded, for proper fade in.
	useEffect(() => {
		if (characterData) {
			setCurCharacter(characterName);
		}
	}, [ characterData, characterName ]);

	useEffect(() => {
		document.title = (characterName) ? `${characterName} - ${localize("APP_TITLE")}` : localize("APP_TITLE");
	}, []);

	return <main id="view-profile">
		<Profile character={curCharacter} />
	</main>;
}

export default ViewProfile;