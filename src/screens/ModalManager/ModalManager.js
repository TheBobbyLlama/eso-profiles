import { useSelector } from "react-redux";
import ModalGeneric from "./components/ModalGeneric/ModalGeneric";
import ModalSignup from "./components/ModalSignUp/ModalSignUp";

import { modalKey, modalSelectors } from "../../store/slice/modal";

import "./ModalManager.css";

function ModalManager() {
	const currentKey = useSelector(modalSelectors.key);

	if (currentKey) {
		let ModalComponent;

		switch (currentKey) {
			case modalKey.generic:
				ModalComponent = ModalGeneric;
				break;
			case modalKey.signup:
				ModalComponent = ModalSignup;
				break;
			default:
				ModalComponent = null;
		}

		if (ModalComponent) {
			return <div id="modalBG">
				<ModalComponent />
			</div>;
		}
	}
	
	return null;
}

export default ModalManager;