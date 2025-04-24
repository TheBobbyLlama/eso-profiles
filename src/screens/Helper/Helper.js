import { useState } from "react";

import { localize } from "../../localization";

import "./Helper.css";

const noteStorageToken = "ESO-Profile[notes]";

function RPHelper() {
	const [inputText, setInputText] = useState("");
	const [outputData, setOutputData] = useState([]);
	const [outputPanel, setOutputPanel] = useState(0);
	const [notesText, setNotesText] = useState(localStorage.getItem(noteStorageToken));

	const changeInput = (e) => {
		const textChunks = [];
		let inputMe = e.target.value || "";

		let start = 0;
		let end = start + 348;

		// Loop to break apart input text...
		while (end < inputMe.length - 1) {
			// Find end of last word, or if we can't, bite off the whole chunk.
			while (inputMe[end] !== " ") {
				end--;

				if (end === start) {
					end = start + 346;
					break;
				}
			}

			let tmpText = inputMe.substring(start, end).trim()

			if (textChunks.length) {
				tmpText = "+ " + tmpText;
			}

			textChunks.push(tmpText + " +");

			// Set up the next go in the loop.
			start = end;

			while ((start < inputMe.length - 1) && (inputMe[start] === " ")) {
				start++;
			}

			end = start + 346;
		}

		// Finally, grab the last piece if applicable
		if (inputMe.length) {
			if (textChunks.length)
				textChunks.push("+ " + inputMe.substring(start));
			else
				textChunks.push(inputMe.substring(start));
		}

		setInputText(e.target.value);
		setOutputData(textChunks);
		setOutputPanel(0);
	}

	const copyCurrentPanel = () => {
		navigator.clipboard.writeText(outputData[outputPanel]);
	}

	const changeNotes = (e) => {
		localStorage.setItem(noteStorageToken, e.target.value);
		setNotesText(e.target.value);
	}

	return <section id="rp-helper">
		<h2>{localize("LABEL_RP_HELPER")}</h2>
		<div className="rp-helper-text">
			<div className="input">
				<h3>{localize("LABEL_TEXT_INPUT")}</h3>
				<textarea value={inputText} onChange={changeInput} placeholder={localize("LABEL_TEXT_INPUT_HELPER")}></textarea>
			</div>
			<div className="output">
				<div>
					<h3>{localize("LABEL_TEXT_OUTPUT")}</h3>
				</div>
				<div>
					<textarea readOnly={true} value={outputData[outputPanel] || ""} maxLength={350} placeholder={localize("LABEL_TEXT_OUTPUT_HELPER")}></textarea>
				</div>
				<div>
					<div>
						<button type="button" onClick={() => setOutputPanel(outputPanel - 1)} disabled={!outputData.length || outputPanel <= 0}>&lt;</button>
						<span>{outputData.length ? outputPanel + 1 : 0}/{outputData.length}</span>
						<button type="button" onClick={() => setOutputPanel(outputPanel + 1)} disabled={!outputData.length || outputPanel >= outputData.length - 1}>&gt;</button>
					</div>
					<button type="button" onClick={copyCurrentPanel} disabled={!outputData.length}>{localize("LABEL_COPY")}</button>
				</div>
			</div>
		</div>
		<div className="rp-helper-notes">
			<h3>{localize("LABEL_NOTES")}</h3>
			<textarea className="notes" value={notesText} onChange={changeNotes} placeholder={localize("LABEL_NOTES_HELPER")}></textarea>
		</div>
	</section>
}

export default RPHelper;