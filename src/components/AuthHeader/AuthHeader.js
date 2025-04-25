import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { authActions, authSelectors } from "../../store/slice/auth";
import { modalKey, modalActions, modalSelectors } from "../../store/slice/modal";
import { localize } from "../../localization";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket, faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";

import QuickMenu from "../QuickMenu/QuickMenu";

import spinner from "../../assets/images/spinner.gif";
import "./AuthHeader.css";

function AuthHeader() {
	const userLoading = useSelector(authSelectors.busy);
  	const user = useSelector(authSelectors.user);
	const authError = useSelector(authSelectors.error);
	const curModal = useSelector(modalSelectors.key);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const [ quickMenuOpen, displayQuickMenu ] = useState(false);
	const [ userInfo, setUserInfo ] = useState({ email: "", password: "" });

	useEffect(() => {
		setTimeout(() => { dispatch(authActions.startupTasks()); }, 100);
// eslint-disable-next-line
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
				<button className="minimal" aria-label={localize("LABEL_LOGOUT")} title={localize("LABEL_LOGOUT")} onClick={doLogout}><FontAwesomeIcon icon={faRightFromBracket} /></button>
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
				<input
					type="email"
					name="email"
					placeholder={localize("LABEL_EMAIL")}
					aria-label={localize("LABEL_EMAIL")}
					autoComplete="email"
					value={userInfo.email}
					onChange={updateUserInfo}>
				</input>
				<input
					type="password"
					name="password"
					placeholder={localize("LABEL_PASSWORD")}
					aria-label={localize("LABEL_PASSWORD")}
					autoComplete="current-password"
					value={userInfo.password}
					onChange={updateUserInfo}>
				</input>
				<button className="minimal" type="submit" aria-label={localize("LABEL_LOGIN")} title={localize("LABEL_LOGIN")} disabled={!userInfo.email || !userInfo.password}><FontAwesomeIcon icon={faRightToBracket} /></button>
				<button className="minimal" type="button" aria-label={localize("LABEL_SIGN_UP")} title={localize("LABEL_SIGN_UP")} onClick={doSignup}><FontAwesomeIcon icon={faUserPlus} /></button>
			</div>
			{(authError && !curModal) ? <div className="error">{localize(authError)}</div> : <></>}
		</form>
		}
	}

	const goToRoot = () => {
		if (location.pathname !== "/") {
			navigate("/");
		}
	}

	return <header>
		<button className="top-left minimal" onClick={() => displayQuickMenu(true)} title={localize("LABEL_QUICKMENU")} aria-label={localize("LABEL_QUICKMENU")}>
			<FontAwesomeIcon icon={faBars} />
		</button>
		{quickMenuOpen && <QuickMenu displayFunc={displayQuickMenu} />}
		{displayUserItem()}
		<h1><div className={location.pathname === "/" ? "" : "clickable"} onClick={goToRoot} title={location.pathname === "/" ? "" : localize("LABEL_RETURN_HOME")}>{localize("APP_TITLE")}</div></h1>
	</header>
}

export default AuthHeader;