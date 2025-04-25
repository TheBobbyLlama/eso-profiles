import { useEffect, useState } from "react";

import EditCharacter from "../../components/EditCharacter/EditCharacter";

import { localize } from "../../localization";

import "./Create.css";

function Create() {
	const [ fadeClass, setFadeClass ] = useState("fade");

	// Trigger fade immediately.
	useEffect(() => {
		setFadeClass("fade fade-in");
		document.title = `${localize("LABEL_CHARACTER_CREATE")} - ${localize("APP_TITLE")}`;
	}, []);

	return <div className={`auto-scrollable ${fadeClass}`}>
		<EditCharacter create={true} />
	</div>;
}

export default Create;