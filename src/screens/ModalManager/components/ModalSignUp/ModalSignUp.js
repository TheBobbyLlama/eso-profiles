import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "../../../../store/slice/auth";
import { modalKey, modalActions } from "../../../../store/slice/modal";

import { localize } from "../../../../localization";

import "./ModalSignUp.css";

function ModalSignup() {
	const [ userInfo, setUserInfo ] = useState({displayName: "", email: "", password: "" });
	const [ passwordConfirm, setPasswordConfirm ] = useState("");
	const authBusy = useSelector(authSelectors.busy);
	const authUser = useSelector(authSelectors.user);
	const authError = useSelector(authSelectors.error);
	const dispatch = useDispatch();

	const updateUserInfo = (e) => {
		if (e.target.name) {
			let tmpInfo = { ...userInfo };
			tmpInfo[e.target.name] = e.target.value;

			setUserInfo(tmpInfo);
			dispatch(authActions.clearError());
		}
	}

	const clearModal = useCallback(() => {
		dispatch(authActions.clearError());
		dispatch(modalActions.showModal({ key: modalKey.clear }));
	}, [dispatch]);

	const doSignup= (e) => {
		e.preventDefault();

		if ((userInfo.displayName) && (userInfo.email) && (userInfo.password)) {
			dispatch(authActions.signup(userInfo));
		} else {
			dispatch(authActions.error("ERROR_MISSING_DATA"));
		}
	}

	useEffect(() => {
		if (authUser) {
			clearModal();
		}
	}, [ authUser, clearModal ]);

	return <section id="sign-up">
		<h2>{localize("LABEL_SIGN_UP")}</h2>
		<form onSubmit={doSignup}>
			<input type="text" name="displayName" placeholder={localize("LABEL_ACCOUNT_NAME")} onChange={updateUserInfo} value={userInfo.displayName}></input>
			<input type="email" name="email" placeholder={localize("LABEL_EMAIL")} onChange={updateUserInfo} value={userInfo.email}></input>
			<input type="password" className={userInfo.password !== passwordConfirm ? "error" : ""} name="password" placeholder={localize("LABEL_PASSWORD")} onChange={updateUserInfo} value={userInfo.password}></input>
			<input type="password" className={userInfo.password !== passwordConfirm ? "error" : ""} name="password-confirm" placeholder={localize("LABEL_PASSWORD_CONFIRM")} onChange={(e) => {setPasswordConfirm(e.target.value)}} value={passwordConfirm}></input>
			{authError && <div className="error">{localize(authError)}</div>}
			<div>
				<button type="submit" disabled={authBusy || !userInfo.displayName || !userInfo.email || !userInfo.password || userInfo.password !== passwordConfirm}>{localize("LABEL_OK")}</button>
				<button disabled={authBusy} onClick={clearModal}>{localize("LABEL_CANCEL")}</button>
			</div>
		</form>
	</section>
}

export default ModalSignup;