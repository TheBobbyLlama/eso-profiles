import { useState } from "react";

import { localize } from "../../localization";
import nameData from "../../assets/data/Names.json";
import { generateNames } from "../../util/namegeneration";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

import "./NameGenerator.css";

const sortLocalized = (a, b) => localize(a) < localize(b);

function NameGenerator() {
	const raceList = nameData.map(item => item.category);
	raceList.sort(sortLocalized);

	const genderList = [ "GENDER_FEMALE", "GENDER_MALE" ];
	genderList.sort(sortLocalized);

	const gameList = [ "GAME_MORROWIND", "GAME_OBLIVION", "GAME_SKYRIM", "GAME_ONLINE" ];

	const [ curRace, setCurRace ] = useState(raceList[0]);
	const [ curGender, setCurGender ] = useState(genderList[0]);
	const [ curFilters, setCurFilters ] = useState([...gameList]);

	const generatedNames = generateNames(nameData, { category: curRace, subcategory: curGender, filters: curFilters }, 50);
	generatedNames.sort();

	const toggleFilter = (e) => {
		let curElement = e.target;

		while (curElement.tagName.toUpperCase() !== "DIV") {
			curElement = curElement.parentElement;
		}

		const curCheckbox = curElement.getElementsByTagName("input")[0];

		if (curFilters.indexOf(curElement.id) > -1) {
			setCurFilters(curFilters.filter(item => item !== curElement.id));
			curCheckbox.checked = false;
		} else {
			setCurFilters([...curFilters, curElement.id]);
			curCheckbox.checked = true;
		}
	}

	const copyName = (name) => {
		navigator.clipboard.writeText(name);
	}

	return <section id="name-generator">
		<h2>Name Generator</h2>
		<div className="name-info">
			<div>
				<div>
					<label htmlFor="name-race">{localize("LABELIZE", localize("LABEL_RACE"))}</label>
					<select name="name-race" value={curRace} onChange={(e) => setCurRace(e.target.value)}>
						{raceList.map(item => <option key={item} value={item}>{localize(item)}</option>)}
					</select>
				</div>
				<div>
					<label htmlFor="name-race">{localize("LABELIZE", localize("LABEL_GENDER"))}</label>
					<select name="name-race" value={curGender} onChange={(e) => setCurGender(e.target.value)}>
						{genderList.map(item => <option key={item} value={item}>{localize(item)}</option>)}
					</select>
				</div>
			</div>
			<div>
				{gameList.map(item => <div key={item} id={item} title={localize("LABEL_NAME_FILTER_HELPER", localize(item))} onClick={toggleFilter}>
					<input name={item} type="checkbox" aria-label={localize("LABEL_NAME_FILTER_HELPER", localize(item))} defaultChecked={curFilters.indexOf(item) > -1} />
					<label htmlFor={item}>{localize(item)}</label>
				</div>)}
			</div>
		</div>
		<h3>{`${localize("LABEL_RESULTS")} (${generatedNames.length})`}</h3>
		<div className="name-results">
			{generatedNames.map((name) => <div key={name}>
				<span>{name}</span>
				<button className="minimal" title={localize("LABEL_NAME_COPY")} aria-label={localize("LABEL_NAME_COPY")} onClick={() => copyName(name)}>
					<FontAwesomeIcon icon={faClipboard} />
				</button>
			</div>)}
		</div>
	</section>
}

export default NameGenerator;