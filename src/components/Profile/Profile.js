import CustomMarkdown from "../CustomMarkdown/CustomMarkdown";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelectors } from "../../store/slice/auth";
import { charSelectors } from "../../store/slice/characters";

import dbUtil from "../../db/util";
import mapKey from "../../localization/map";
import useFade from "../../hooks/useFade";

import { localize } from "../../localization";
import { getUrlBase } from "../../util";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPenToSquare, faTrash, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import "./Profile.css";


// Profile key, label key, should localize
const characteristics = [
	[ "aliases", "LABEL_ALIASES" ],
	[ "alignment", "LABEL_ALIGNMENT", true ],
	[ "birthsign", "LABEL_BIRTHSIGN", true ],
	[ "residence", "LABEL_PRIMARY_RESIDENCE" ],
	[ "organizations", "LABEL_ORGANIZATIONS" ],
	[ "alliances", "LABEL_ALLIANCES" ],
	[ "enemies", "LABEL_ENEMIES" ],
	[ "relationships", "LABEL_RELATIONSHIPS" ],
];

function Profile({character, inset}) {
	const [curCharacter, setCurCharacter] = useState(character);
	const characterData = useSelector(charSelectors.list)[dbUtil.transform(curCharacter)];
	const userName = useSelector(authSelectors.user)?.display;
	const ref = useRef(null);
	const fadeTransition = useFade(ref);
	const navigate = useNavigate();

	useEffect(() => {
		if (character !== curCharacter) {
			fadeTransition((char) => {
				setCurCharacter(char);
				if (ref.current)
					ref.current.scrollIntoView({ behavior: "instant", inline: "start" }); // Scroll profile to top
			}, character);
		}
	}, [character]);

	const goCharacterProfile = () => {
		if (characterData) {
			window.open(`${getUrlBase()}/view/${characterData.character.name}`, {});
		}
	}

	const goCharacterEdit = () => {
		if (characterData) {
			navigate(`/edit/${characterData.character.name}`);
		}
	}

	const characterReadOut = [];
	const characterCharacteristics = [];

	if (characterData) {
		if (characterData.character.race) {
			characterReadOut.push(localize(mapKey(characterData.character.race)));
		}

		characterReadOut.push(localize(mapKey(characterData.character.sex)));

		if (characterData.character.class) {
			characterReadOut.push(localize(mapKey(characterData.character.class)));
		}

		if (characterData.character.supernatural) {
			characterReadOut.push(localize(mapKey(characterData.character.supernatural)));
		}

		if (characterData.profile) {
			characteristics.forEach((item) => {
				const data = characterData.profile[item[0]];
				if (data) {
					characterCharacteristics.push([localize(item[1]), item[2] ? localize(data) : data])
				}
			})
		}
	} else {
		return <></>;
	}

	const ownedByCurrentUser = (characterData?.character.player === userName);

	return <div id="profile" ref={ref}>
		{(characterData?.profile) ? <>
			<div className="top-left">
				{(ownedByCurrentUser) && <button className="minimal" aria-label={localize("LABEL_EDIT_CHARACTER")} title={localize("LABEL_EDIT_CHARACTER")} onClick={goCharacterEdit}><FontAwesomeIcon icon={faPenToSquare} /></button>}
				{((ownedByCurrentUser) || (Object.keys(characterData?.stories || {}).length)) ? <button className="minimal" aria-label={localize("LABEL_STORIES")} title={localize("LABEL_STORIES")}><FontAwesomeIcon icon={faBook} /></button> : <></>}
				{(ownedByCurrentUser) && <button className="minimal" aria-label={localize("LABEL_DELETE_CHARACTER")} title={localize("LABEL_DELETE_CHARACTER")}><FontAwesomeIcon icon={faTrash} /></button>}
			</div>
			{inset && <div className="top-right">
				<button className="minimal" aria-label={localize("LABEL_SHOW_PROFILE")} title={localize("LABEL_SHOW_PROFILE")} onClick={goCharacterProfile}><FontAwesomeIcon icon={faUpRightFromSquare} /></button>
			</div>}
			<h1>{dbUtil.decode(characterData.character.name)}</h1>
			<div className="player">@{dbUtil.decode(characterData.character.player)}</div>
			{(characterReadOut.length) ? <ul>
				{characterReadOut.map((item, index) => {
					return <li key={index}>{item}</li>
				})}
			</ul> : <></>}
			{(characterData.profile.image) ? <div id="profile-image" style={{ background: `url('${characterData.profile.image}')`}} /> : <></>}
			{(characterCharacteristics.length) ? <table id="profile-info" className={(characterData.profile.image) ? "with-image" : ""}><tbody>
				{characterCharacteristics.map((item, index) => {return <tr key={item[0]}><td><label>{localize("LABELIZE", item[0])}</label></td><td>{characterCharacteristics[index][2] ? <>{item[1]}</> : <CustomMarkdown text={item[1]} />}</td></tr> })}
			</tbody></table> : <></>}
			{(characterData.profile.description) ? <>
				<h2>{localize("LABEL_DESCRIPTION")}</h2>
				<section>
					<CustomMarkdown
						text={characterData.profile.description}
					/>
				</section>
			</> : <></>}
			{(characterData.profile.biography) ? <>
				<h2>{localize("LABEL_BIOGRAPHY")}</h2>
				<section>
					<CustomMarkdown
						text={characterData.profile.biography}
					/>
				</section>
			</> : <></>}
			{(characterData.profile.oocInfo) ? <>
				<h2>{localize("LABEL_OOC_INFO")}</h2>
				<section>
					<CustomMarkdown
						text={characterData.profile.oocInfo}
					/>
				</section>
			</> : <></>}
		</> : <></>}
	</div>
}

export default Profile;