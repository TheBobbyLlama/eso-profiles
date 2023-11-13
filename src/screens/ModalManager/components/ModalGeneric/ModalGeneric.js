import { useDispatch, useSelector } from "react-redux";
import { modalActions, modalKey, modalSelectors } from "../../../../store/slice/modal";

import { localize } from "../../../../localization";

function generateTextMarkup(text, index) {
	const split = text.split(":");

	switch(split[0]) {
		case "CODE":
			return <code key={index}>{split.slice(1).join(":")}</code>;
		case "LIST":
			return <div key={index} className="list">{split.slice(1).join(":")}</div>;
		case "HEADER":
			return <h3 key={index}>{split.slice(1).join(":")}</h3>;
		case "WARNING":
			return <h3 key={index} className="warning">{split.slice(1).join(":")}</h3>;
		default:
			return <p key={index}>{text}</p>;
	}
}

function ModalGeneric() {
	const modalData = useSelector(modalSelectors.data);
	const dispatch = useDispatch();

	const doAction = () => {
		if (modalData.action) {
			dispatch(modalData.action);

			// Clear the modal if we're not chaining into a different one.
			if (!modalData.action.type.startsWith("modal")) {
				dispatch(modalActions.showModal({ key: modalKey.clear }));
			}
		} else {
			dispatch(modalActions.showModal({ key: modalKey.clear }));
		}
	}

	const cancelAction= () => {
		dispatch(modalActions.showModal({ key: modalKey.clear }));
	}

	return <section style={{ minWidth: modalData.width ? modalData.width : "auto" }}>
		<h2>{modalData.title}</h2>
		{ modalData.text.map ?
			modalData.text.map((item, index) => generateTextMarkup(item, index)) : generateTextMarkup(modalData.text)}
		<div>
			<button onClick={doAction}>{modalData.buttonLabel || localize("LABEL_OK")}</button>
			{modalData.action && <button onClick={cancelAction}>{localize("LABEL_CANCEL")}</button>}
		</div>
	</section>;
}

export default ModalGeneric;