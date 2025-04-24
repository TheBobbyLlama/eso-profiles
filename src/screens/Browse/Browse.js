import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDelayedSpinner from "../../hooks/useDelayedSpinner";
import useFade from "../../hooks/useFade";

import Profile from "../../components/Profile/Profile";

import { authSelectors } from "../../store/slice/auth";
import { charActions, charSelectors } from "../../store/slice/characters";
import { modalActions, modalKey } from "../../store/slice/modal";
import { localize } from "../../localization";
import mapKey from "../../localization/map";
import dbUtil from "../../db/util";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import spinner from "../../assets/images/spinner.gif";

import "./Browse.css";

function Browse() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Screen resize detection
	const [curCharacter, setCurCharacter] = useState("");
	const [pendingCharacter, setPendingCharacter] = useState("");
	const navigate = useNavigate();
	const ref = useRef(null);
  	const user = useSelector(authSelectors.user);
	const characterList = useSelector(charSelectors.list);
	const filter = useSelector(charSelectors.filter);
	const dispatch = useDispatch();
	const [ showSpinner, startLoadTimer, endLoadTimer ] = useDelayedSpinner();
	useFade(ref);

	const pendingProfileData = pendingCharacter && characterList[pendingCharacter]?.profile;

	// Load character list on mount
	useEffect(() => {
		dispatch(charActions.loadCharacterList());
	}, [ dispatch ]);

	// Use loading spinner while list loads
	useEffect(() => {
		if (Object.keys(characterList).length) {
			endLoadTimer();
		} else {
			startLoadTimer();
		}

		return endLoadTimer;
	}, [ characterList, startLoadTimer, endLoadTimer ]);

	// Force redraw on window resize
	useEffect(() => {
		const doResize = () => {
			setWindowWidth(window.innerWidth);
		}

		window.addEventListener("resize", doResize);
		
		return () => { window.removeEventListener("resize", doResize) };
	}, []); // Don't listen to the React linter here

	// Reset character filter on login/logout
	useEffect(() => {
		const newFilter = {};

		if (user)
			newFilter.player = [ user.display ];

		dispatch(charActions.setListFilter(newFilter));
	}, [ user, dispatch ]);

	// Clear selected character when filter changes
	useEffect(() => {
		setCurCharacter("");
	}, [ filter, dispatch ]);

	// Timing for displaying new profiles
	useEffect(() => {
		if (characterList[pendingCharacter]?.profile) {
			endLoadTimer();
			if (pendingCharacter !== curCharacter) {
				setCurCharacter(pendingCharacter);
			}
		} else {
			endLoadTimer();
		}
	}, [ pendingProfileData, endLoadTimer ]);

	const showFilter = () => {
		dispatch(modalActions.showModal({ key: modalKey.characterFilter }));
	}

	const setCharacter = (key) => {
		if (characterList[key].profile) {
			setCurCharacter(key);
		} else {
			setPendingCharacter(key);
			dispatch(charActions.loadCharacterProfile(key));
			startLoadTimer();
		}
	}

	const createCharacter = () => {
		navigate(`/create`);
	}

	const workingList = (() => {
		if (!characterList) return null;

		const result = {};

		Object.keys(characterList).forEach((character) => {
			const curChar = characterList[character];

			if ((curChar.character.emptyProfile) && (user?.display !== curChar.character.player)) {
				return;
			}

			if ((filter.sex?.length) && (filter.sex.indexOf(mapKey(curChar.character.sex)) < 0)) {
				return;
			}

			if ((filter.race?.length) && (filter.race.indexOf(mapKey(curChar.character.race)) < 0)) {
				return;
			}

			if ((filter.class?.length) && (filter.class.indexOf(mapKey(curChar.character.class)) < 0)) {
				return;
			}

			if ((filter.supernatural?.length) && (filter.supernatural.indexOf(mapKey(curChar.character.supernatural)) < 0)) {
				return;
			}

			if ((filter.player?.length) && (filter.player.indexOf(curChar.character.player.match(/(?:@*)([\w]+)/)[1]) < 0))
				return;

			result[character] = curChar;
		})

		return result;
	})();

	return <>
		{Object.keys(characterList).length ? <main id="browse" ref={ref}>
			<section id="character-list">
				<div className="list-header">
					<div>
						<h2 title={localize("LABEL_CHARACTER_COUNT", Object.keys(workingList).length)}>{localize("LABEL_CHARACTERS")} <button aria-label={localize("LABEL_CHARACTER_FILTER")} title={localize("LABEL_CHARACTER_FILTER")} onClick={showFilter}><FontAwesomeIcon className="fa-icon" icon={faFilter} /></button></h2>
					</div>
					{user && <button aria-label={localize("LABEL_ADD")} title={localize("LABEL_ADD")} onClick={createCharacter}>Add</button>}
				</div>
				{(windowWidth > 1000) && <div id="list-holder">
					<ol>
						{Object.keys(workingList).map((key) => {
							return <li key={key} className={(curCharacter === key) ? "selected" : ""} onClick={() => { setCharacter(key) }}>{dbUtil.decode(workingList[key].character.name)}</li>
						})}
					</ol>
				</div>}
				{(windowWidth <= 1000) && <select id="abbr-list" aria-label={localize("LABEL_CHARACTER_LIST")} value={curCharacter} onChange={(e) => { setCharacter(e.target.value)}}>
					{!curCharacter && <option></option>}
					{Object.keys(workingList).map((key) => {
						return <option key={key} className={(curCharacter === key ? "selected" : "")} value={key}>{dbUtil.decode(workingList[key].character.name)}</option>
					})}
				</select>}
			</section>
			<div id="character-profile">
				<Profile character={curCharacter} inset={true}></Profile>
			</div>
		</main> : <></>}
		{showSpinner && <div id="spinner-container"><img src={spinner} alt="Loading..." /></div>}
	</>
}

export default Browse;