import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Profile from "../../components/Profile/Profile";

import { authSelectors } from "../../store/slice/auth";
import { charActions, charSelectors } from "../../store/slice/characters";
import { localize } from "../../localization";
import dbUtil from "../../db/util";

import useFade from "../../hooks/useFade";
import "./Browse.css";

function Browse() {
	const [forceRender, setForceRender] = useState(false); // Screen resize detection
	const [curCharacter, setCurCharacter] = useState("");
	const ref = useRef(null);
  	const user = useSelector(authSelectors.user);
	const characterList = useSelector(charSelectors.list);
	const dispatch = useDispatch();

	const fadeTransition = useFade(ref);

	useEffect(() => {
		dispatch(charActions.loadCharacterList());
	}, []);

	useEffect(() => {
		setForceRender(!forceRender);
	}, [window.screen.width]); // Don't listen to the React linter here, it's stupid af and I hate it

	const setCharacter = (key) => {
		setCurCharacter(key);
		dispatch(charActions.loadCharacterProfile(key));
	}

	// TODO - Apply filters!
	const workingList = characterList;

	return <>
		{Object.keys(characterList).length ? <main id="browse" ref={ref} className="fade">
			<section id="character-list">
				<h2>{localize("LABEL_CHARACTERS")}</h2>
				<div id="list-holder">
					<ol>
						{Object.keys(workingList).map((key) => {
							return <li key={key} className={(curCharacter === key) ? "selected" : ""} onClick={() => { setCharacter(key) }}>{dbUtil.decode(workingList[key].name)}</li>
						})}
					</ol>
				</div>
				<select id="abbr-list" value={curCharacter} onChange={(e) => { setCharacter(e.target.value)}}>
					<option></option>
					{Object.keys(workingList).map((key) => {
						return <option key={key} className={(curCharacter === key ? "selected" : "")} value={key}>{dbUtil.decode(workingList[key].name)}</option>
					})}
				</select>
			</section>
			<div id="character-profile">
				<Profile character={curCharacter}></Profile>
			</div>
		</main> : <></>}
	</>
}

export default Browse;