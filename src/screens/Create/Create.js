import { useEffect, useState } from "react";

import EditCharacter from "../../components/EditCharacter/EditCharacter";

import "./Create.css";

function Create() {
	const [ fadeClass, setFadeClass ] = useState("fade");

	// Trigger fade immediately.
	useEffect(() => {
		setFadeClass("fade fade-in");
	}, []);

	return <div className={`auto-scrollable ${fadeClass}`}>
		<EditCharacter create={true} />
	</div>;
}

export default Create;