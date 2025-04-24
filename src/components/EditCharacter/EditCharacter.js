import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../store/slice/auth";
import { charActions, charSelectors } from "../../store/slice/characters";
import { modalActions, modalKey } from "../../store/slice/modal";
import { localize } from"../../localization";
import { getUrlBase } from "../../util";

import MarkDownInput from "../Markdown/MarkdownInput";
import MarkdownTextArea from "../Markdown/MarkdownTextArea";

import charData from "../../data/character.json";
import mapKey from "../../localization/map";

import "./EditCharacter.css";

function EditCharacter({create, character}) {
	const user = useSelector(authSelectors.user);
	const characterError = useSelector(charSelectors.error);
	const dispatch = useDispatch();
	const [ changeName, setChangeName ] = useState(!!create);
	const [ changed, setChanged ] = useState(!!create);
	const [ workingChar, setWorkingChar ] = useState(character || {
		// Character defaults - race and sex dropdowns default to Altmer and Female, so reflect that here
		character: {
			player: user?.display,
			race: "Altmer",
			sex: 1,
			emptyProfile: true,
		}
	});
	const [ imageInput, setImageInput ] = useState(character?.profile?.image || ""); // Store image input separately from workingChar so we can only update onBlur

	useEffect(() => {
		if (characterError) {
			dispatch(modalActions.showModal({
				key: modalKey.generic,
				data: {
					title: localize(`LABEL_CHARACTER_CANT_${changeName ? "CREATE" : "SAVE"}_TITLE`),
					text: localize(characterError),
					action: charActions.setErrorState(null),
					error: true,
				}
			}));
		} else {
			setChangeName(create);	
		}
	}, [ characterError, create, dispatch ]);

	// Clear error states if user navigates away.
	useEffect(() => {
		return () => {
			dispatch(modalActions.showModal({ key: modalKey.clear }));
			dispatch(charActions.setErrorState(null));
		}
	}, [ dispatch ])

	// Bail out if not authorized to edit/create this character
	if ((!user) || (user.display !== workingChar.character.player)) {
		window.location.replace(getUrlBase());
		return <></>;
	}

	const getCharacteritem = (path) => {
		let i;
		let curPath = workingChar;
		const fragments = path.split(".");

		for (i = 0; i < fragments.length - 1; i++) {
			if (curPath[fragments[i]] === undefined) {
				return "";
			}

			curPath = curPath[fragments[i]];
		}

		return curPath[fragments[i]] || "";
	}

	const editCharacter = (e, dataPath) => {
		const newValue = ((e) => {
			if (e?.target) {
				return e.target.value;
			} else {
				return e;
			}
		})(e);
		const newData = { ...workingChar };
		const path = e.target?.dataset.path.split(".") || dataPath.split(".");
		
		let i = 0;
		let curData = newData;

		for(i = 0; i < path.length - 1; i++) {
			if (!curData[path[i]]) {
				curData[path[i]] = {};
			} else {
				curData[path[i]] = { ...curData[path[i]] };
			}

			curData = curData[path[i]];
		}

		if ((!newValue) || (newValue === "LABEL_NOT_SET")) {
			delete curData[path[i]];
		} else {
			curData[path[i]] = newValue;
		}

		if ((newData.profile) && (Object.entries(newData.profile).length)) {
			delete newData.character.emptyProfile;
		}

		setWorkingChar(newData);
		setChanged(true);
	}

	const validateCharacterImage = (e) => {
		const newValue = e.target.value;

		if (newValue.match(/^(https?:\/\/)?[A-Za-z0-9-_]+\.[A-Za-z0-9-_.]+[A-Za-z0-9](\/[A-Za-z0-9-_]+)*\/[A-Za-z0-9-_.]+(\.[Bb][Mm][Pp]|\.[Gg][Ii][Ff]|\.[Jj][Pp][Gg]|\.[Pp][Nn][Gg])(\?[\w=&]+)*$/g)) {
			e.target.classList.remove("invalid")
		} else {
			e.target.classList.add("invalid");
		}

		setImageInput(e.target.value);
	}

	const characterImage = workingChar.profile?.image ? {
		backgroundImage: `url('${workingChar.profile.image})`
	} : {};

	const validateCharacter = () => {
		if (getCharacteritem("character.name").length < 4) {
			return false;
		}

		return true;
	}

	const saveCharacterChanges = () => {
		setChangeName(false);
		setChanged(false);

		dispatch(charActions.saveCharacter({ data: workingChar, create }));
	}

	const SaveButton = () => {
		return <button onClick={saveCharacterChanges} disabled={!changed || !validateCharacter()}>{localize(changeName ? "LABEL_CREATE" : "LABEL_SAVE")}</button>
	}

	return <main id="edit">
		<section id="characterInfo">
			<div id="headerRow">
				{(changeName) ? 
					<>
						<input type="text" placeholder={localize("LABEL_NAME")} maxLength={24} value={getCharacteritem("character.name")} data-path="character.name" onChange={editCharacter} />
						<button disabled={true}>{localize("LABEL_GENERATE")}</button>
					</> :
					<h2>{getCharacteritem("character.name")}</h2>
				}
			</div>
			<div id="attributes">
				<div>
					<label>{localize("LABEL_RACE")}:</label>
					<select value={mapKey(getCharacteritem("character.race"))} data-path="character.race" onChange={editCharacter}>
						{charData.LABEL_RACE.map((item) => <option key={item} value={item}>{localize(item)}</option>)}
					</select>
				</div>
				<div>
					<label>{localize("LABEL_GENDER")}:</label>
					<select value={mapKey(workingChar.character?.sex)} data-path="character.sex" onChange={editCharacter}>
						{charData.LABEL_GENDER.map((item) => <option key={item} value={item}>{localize(item)}</option>)}
					</select>
				</div>
				<div>
					<label>{localize("LABEL_SUPERNATURAL")}:</label>
					<select value={mapKey(workingChar.character?.supernatural)} data-path="character.supernatural" onChange={editCharacter}>
						{charData.LABEL_SUPERNATURAL.map((item) => <option key={item} value={item}>{localize(item)}</option>)}
					</select>
				</div>
				<div>
					<label>{localize("LABEL_CLASS")}:</label>
					<select value={mapKey(workingChar.character?.class)} data-path="character.class" onChange={editCharacter}>
						{charData.LABEL_CLASS.map((item) => <option key={item} value={item}>{localize(item)}</option>)}
					</select>
				</div>
			</div>
			<h3>{localize("LABEL_CHARACTER_IMAGE")}</h3>
			<div id="character-image">
				<div id="image" style={characterImage} />
				<textarea placeholder={localize("LABEL_CHARACTER_IMAGE_HELPER")} value={imageInput} data-path="profile.image" onChange={validateCharacterImage} onBlur={() => editCharacter(imageInput, "profile.image")} />
			</div>
			<div id="big-save"><SaveButton /></div>
			<h3>{localize("LABEL_CHARACTER_INFO")}</h3>
			{charData.LABEL_CHARACTER_INFO.map((info) => {
				return info.maxLength ?
					<div className="character-characteristic" key={info.key}>
						<MarkDownInput label={localize(info.key)} maxLength={info.maxLength} placeholder={localize(info.key + "_HELPER")} value={getCharacteritem(info.path)} onChange={editCharacter} dataPath={info.path} />
					</div> :
					<div className="character-characteristic characteristic-select" key={info.key}>
						<label>{localize(info.key)}</label>
						<select  value={getCharacteritem(info.path)} onChange={editCharacter} data-path={info.path}>
							{charData[info.key].map((item) => <option key={item} value={item}>{localize(item)}</option>)}
						</select>
					</div>
				}
			)}
		</section>
		<section>
			<h2>{localize("LABEL_SHORT_DESCRIPTION")}</h2>
			<div className="save-container"><SaveButton /></div>
			<MarkdownTextArea maxLength={1000} placeholder={localize("LABEL_SHORT_DESCRIPTION_HELPER")} value={getCharacteritem("profile.description")} onChange={editCharacter} dataPath={"profile.description"} />
		</section>
		<section>
			<h2>{localize("LABEL_BIOGRAPHY")}</h2>
			<div className="save-container"><SaveButton /></div>
			<MarkdownTextArea maxLength={10000} placeholder={localize("LABEL_BIOGRAPHY_HELPER")} value={getCharacteritem("profile.biography")} onChange={editCharacter} dataPath={"profile.biography"} />
		</section>
		<section>
			<h2>{localize("LABEL_OOC_INFO")}</h2>
			<div className="save-container"><SaveButton /></div>
			<MarkdownTextArea maxLength={1000} placeholder={localize("LABEL_OOC_INFO_HELPER")} value={getCharacteritem("profile.oocInfo")} onChange={editCharacter} dataPath={"profile.oocInfo"} />
		</section>
	</main>;
}

export default EditCharacter;