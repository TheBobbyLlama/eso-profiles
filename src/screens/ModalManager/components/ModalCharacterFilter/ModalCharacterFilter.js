import { useState } from "react";

import ResponsiveTabView from "../../../../components/ResponsiveTabView/ResponsiveTabView";
import SelectionList from "../../../../components/SelectionList/SelectionList";

import { useDispatch, useSelector } from "react-redux";
import { charSelectors } from "../../../../store/slice/characters";
import { charActions } from "../../../../store/slice/characters";
import { modalActions, modalKey } from "../../../../store/slice/modal";

import charData from "../../../../data/character.json";
import { htmlDecode } from "../../../../util";
import { localize } from "../../../../localization";

import "./ModalCharacterFilter.css";

const filterKeys = [
	"LABEL_GENDER",
	"LABEL_RACE",
	"LABEL_SUPERNATURAL",
]

const getItemFromKey = (key) => {
	switch (key) {
		case "account":
		case "player":
			return "player";
		case "LABEL_GENDER":
			return "sex";
		case "LABEL_RACE":
			return "race";
		case "LABEL_CLASS":
			return "class";
		case "LABEL_SUPERNATURAL":
			return "supernatural";
		default:
			return undefined; // Error state
	}
}

function ModalCharacterFilter() {
	const [filter, setFilter] = useState(useSelector(charSelectors.filter));
	const charList = useSelector(charSelectors.list);

	const dispatch = useDispatch();

	const setFilterValue = (item, value) => {
		const newFilter = { ...filter };

		if (!newFilter[item]) {
			newFilter[item] = [ value ];
		} else if (newFilter[item].indexOf(value) < 0) {
			newFilter[item] = [ ...newFilter[item] ];
			newFilter[item].push(value);
			newFilter[item].sort();
		} else {
			newFilter[item] = newFilter[item].filter(val => val !== value);

			if (!newFilter[item].length) {
				delete newFilter[item];
			}
		}

		setFilter(newFilter);
	}

	const closeModal = () => {
		dispatch(modalActions.showModal({ key: modalKey.clear }));
	}

	const confirmFilter = () => {
		dispatch(charActions.setListFilter(filter));
		closeModal();
	}

	const clearFilter = () => {
		setFilter({});
	}

	return <section className="character-filter">
		<h2>{localize("LABEL_CHARACTER_FILTER")}</h2>
		<ResponsiveTabView labels={ [ localize("LABEL_CHARACTERS"), localize("LABEL_PLAYERS") ]}>
			<div className="character-filter-attributes">
				{
					filterKeys.map((key) => {
						return <div key={key}>
							<label>{localize(key)}</label>
							<SelectionList
								optionList={charData[key].filter(item => !!item)}
								optionSelected={filter[getItemFromKey(key)] || []}
								onOptionClick={(value) => {
									setFilterValue(getItemFromKey(key), value);
								}}
							/>
						</div>;
					})
				}
			</div>
			<div className="character-filter-players">
				<div>
					<label>{localize("LABEL_PLAYER")}</label>
					<SelectionList
						optionList={Object.values(charList).map(char => htmlDecode(char.character.player.replace(/^(@)?(.*)$/, "$2")))
							.filter((value, index, array) => { return array.indexOf(value) === index; })
							.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: "base" }))}
						optionSelected={filter.player || []}
						onOptionClick = {(value) => {
							setFilterValue("player", value);
						}}
					/>
				</div>
			</div>
		</ResponsiveTabView>
		<div>
			<button onClick={confirmFilter}>{localize("LABEL_OK")}</button>
			<button onClick={closeModal}>{localize("LABEL_CANCEL")}</button>
			<button onClick={clearFilter} disabled={!Object.keys(filter).length}>{localize("LABEL_CLEAR")}</button>
		</div>
	</section>
}

ModalCharacterFilter.clickOff = true;

export default ModalCharacterFilter;