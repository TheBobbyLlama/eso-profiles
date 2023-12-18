import { localize } from "../../localization";

import "./SelectionList.css";

function SelectionList({ optionList, optionSelected, onOptionClick, ...props }) {
	return <ul className="selection-list" {...props}>
		{optionList.map((key) => {
			return <li key={key} className={optionSelected.indexOf(key) > -1 ? "selected" : ""} onClick={() => { if (onOptionClick) onOptionClick(key); }}>{localize(key)}</li>;
		})}
	</ul>
}

export default SelectionList;