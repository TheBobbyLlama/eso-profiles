import { useDispatch, useSelector } from "react-redux";
import ModalGeneric from "./components/ModalGeneric/ModalGeneric";
import ModalSignup from "./components/ModalSignUp/ModalSignUp";
import ModalCharacterFilter from "./components/ModalCharacterFilter/ModalCharacterFilter";

import { modalActions, modalKey, modalSelectors } from "../../store/slice/modal";

import "./ModalManager.css";

function ModalManager() {
	const currentKey = useSelector(modalSelectors.key);
	const dispatch = useDispatch();

	if (currentKey) {
		let ModalComponent;

		switch (currentKey) {
			case modalKey.generic:
				ModalComponent = ModalGeneric;
				break;
			case modalKey.signup:
				ModalComponent = ModalSignup;
				break;
			case modalKey.characterFilter:
				ModalComponent = ModalCharacterFilter;
				break;
			default:
				ModalComponent = null;
		}

		const clickOff = (e) => {
			if ((e.target.id == "modalBG") && (ModalComponent.clickOff)) {
				dispatch(modalActions.showModal({ key: modalKey.clear }));
			}
		}

		if (ModalComponent) {
			return <div id="modalBG" onClick={clickOff}>
				<ModalComponent />
			</div>;
		}
	}
	
	return null;
}

export default ModalManager;