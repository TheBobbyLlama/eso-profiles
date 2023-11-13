import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authActions, authSelectors } from "../../store/slice/auth";
import { modalKey, modalActions, modalSelectors } from "../../store/slice/modal";
import { localize } from "../../localization";

import spinner from "../../assets/images/spinner.gif";
import "./AuthHeader.css";

function AuthHeader() {
	const userLoading = useSelector(authSelectors.busy);
  	const user = useSelector(authSelectors.user);
	const authError = useSelector(authSelectors.error);
	const curModal = useSelector(modalSelectors.key);
	const dispatch = useDispatch();

	const [ userInfo, setUserInfo ] = useState({ email: "", password: "" });

	useEffect(() => {
		setTimeout(() => { dispatch(authActions.startupTasks()); }, 100);
	}, []);

	const displayUserItem = () => {
		if (user) {
			const doLogout = (e) => {
				dispatch(modalActions.showModal({
					key: modalKey.generic,
					data: {
						title: localize("LABEL_LOGOUT"),
						text: localize("LABEL_LOGOUT_CONFIRM"),
						action: authActions.logout(),
					}
				}))
			}
			return <div>
				<div>{user.display}</div>
				<button onClick={doLogout}>{localize("LABEL_LOGOUT")}</button>
			</div>
		} else if (userLoading) {
			return <div><img src={spinner} alt="Loading..." /></div>
		} else {
			const updateUserInfo = (e) => {
				if (e.target.name) {
					let tmpInfo = { ...userInfo };
					tmpInfo[e.target.name] = e.target.value;

					setUserInfo(tmpInfo);
					dispatch(authActions.clearError());
				}
			}

			const doLogin = (e) => {
				e.preventDefault();

				if ((userInfo.email) && (userInfo.password)) {
					dispatch(authActions.login(userInfo));
				} else {
					dispatch(authActions.loginFailed(localize("ERROR_EMAIL_PASSWORD_REQUIRED")));
				}
			}

			const doSignup = () => {
				dispatch(authActions.clearError());
				dispatch(modalActions.showModal({ key: modalKey.signup }));
			}

			return <form onSubmit={doLogin}>
			<div>
				<div>
					<input type="email" name="email" placeholder={localize("LABEL_EMAIL")} value={userInfo.email} onChange={updateUserInfo}></input>
					<input type="password" name="password" placeholder={localize("LABEL_PASSWORD")} value={userInfo.password} onChange={updateUserInfo}></input>
				</div>
				<div>
					<button type="submit" disabled={!userInfo.email || !userInfo.password}>{localize("LABEL_LOGIN")}</button>
					<button type="button" onClick={doSignup}>{localize("LABEL_SIGN_UP")}</button>
				</div>
			</div>
			{(authError && !curModal) ? <div className="error">{localize(authError)}</div> : <></>}
		</form>
		}
	}

	return <header>
		{displayUserItem()}
		<h1>{localize("APP_TITLE")}</h1>
	</header>
}

export default AuthHeader;