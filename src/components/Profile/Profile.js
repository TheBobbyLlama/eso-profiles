import CustomMarkdown from "../CustomMarkdown/CustomMarkdown";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { charSelectors } from "../../store/slice/characters";

import dbUtil from "../../db/util";
import mapKey from "../../localization/map";
import useFade from "../../hooks/useFade";

import { localize } from "../../localization";

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

function Profile({character}) {
	const [curCharacter, setCurCharacter] = useState(character);
	const characterData = useSelector(charSelectors.list)[curCharacter];
	const ref = useRef(null);
	const fadeTransition = useFade(ref);

	useEffect(() => {
		if (!curCharacter) {
			setCurCharacter(character);
		} else {
			fadeTransition(setCurCharacter, character);
		}
	}, [character]); // Don't listen to the React linter here, it's stupid af and I hate it

	const characterReadOut = [];
	const characterCharacteristics = [];

	if (characterData) {
		if (characterData.race) {
			characterReadOut.push(localize(mapKey(characterData.race)));
		}

		characterReadOut.push(localize(mapKey(characterData.sex)));

		if (characterData.class) {
			characterReadOut.push(localize(`CLASS_${characterData.class.toUpperCase()}`));
		}

		if (characterData.supernatural) {
			characterReadOut.push(localize(mapKey(characterData.supernatural)));
		}

		if (characterData.profile) {
			characteristics.forEach((item) => {
				const data = characterData.profile[item[0]];
				if (data) {
					characterCharacteristics.push([localize(item[1]), item[2] ? localize(data) : data])
				}
			})
		}

		console.log(characterData);
	}

	return <>
		{(characterData?.profile) ? <div id="profile" ref={ref}>
			<h1>{dbUtil.decode(characterData.name)}</h1>
			<label className="player">@{characterData.player}</label>
			{(characterReadOut.length) ? <ul>
				{characterReadOut.map((item, index) => {
					return <li key={index}>{item}</li>
				})}
			</ul> : <></>}
			{(characterData.profile.image) ? <div id="profile-image" style={{ background: `url('${characterData.profile.image}')`}} /> : <></>}
			{(characterCharacteristics.length) ? <table id="profile-info" className={(characterData.profile.image) ? "with-image" : ""}><tbody>
				{characterCharacteristics.map((item, index) => {return <tr key={item[0]}><td><label>{localize("LABELIZE", item[0])}</label></td><td>{characterCharacteristics[index][2] ? <>{item[1]}</> : <CustomMarkdown markdown={item[1]} />}</td></tr> })}
			</tbody></table> : <></>}
			{(characterData.profile.description) ? <>
				<h2>{localize("LABEL_DESCRIPTION")}</h2>
				<section>
					<CustomMarkdown
						markdown={characterData.profile.description}
					/>
				</section>
			</> : <></>}
			{(characterData.profile.biography) ? <>
				<h2>{localize("LABEL_BIOGRAPHY")}</h2>
				<section>
					<CustomMarkdown
						markdown={characterData.profile.biography}
					/>
				</section>
			</> : <></>}
			{(characterData.profile.oocInfo) ? <>
				<h2>{localize("LABEL_OOC_INFO")}</h2>
				<section>
					<CustomMarkdown
						markdown={characterData.profile.oocInfo}
					/>
				</section>
			</> : <></>}
		</div> : <></>}
	</>
}

export default Profile;