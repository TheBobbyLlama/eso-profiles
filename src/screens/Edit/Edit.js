import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import EditCharacter from "../../components/EditCharacter/EditCharacter";

import { charActions, charSelectors } from "../../store/slice/characters";
import dbUtil from "../../db/util";
import { localize } from "../../localization";

import "./Edit.css";

function Edit() {
	const { characterName } = useParams();
	const [ fadeClass, setFadeClass ] = useState("fade");
	const characterData = useSelector(charSelectors.list)[dbUtil.transform(characterName)];
	const dispatch = useDispatch();

	// Load character data if needed.
	useEffect(() => {
		if (characterName) {
			if (!characterData?.profile) {
				dispatch(charActions.loadFullCharacterData(dbUtil.transform(characterName)));
			}

			document.title = `${localize("LABEL_CHARACTER_EDIT")} - ${characterName} - ${localize("APP_TITLE")}`;
		}
	}, [characterName, dispatch]);

	// Trigger fade when we have character data.
	useEffect(() => {
		if (characterData) {
			setFadeClass("fade fade-in");
			dispatch(charActions.loadCharacterNotes(dbUtil.transform(characterName)));
		}
	}, [ characterData, characterName ]);

	if (characterData) {
		return <div className={`auto-scrollable ${fadeClass}`}>
			<EditCharacter character={characterData} />
		</div>;
	} else {
		return <></>;
	}
}

export default Edit;