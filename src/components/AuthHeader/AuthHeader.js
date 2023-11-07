import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authActions, authSelectors } from "../../store/slice/auth";
import { localize } from "../../localization";

import spinner from "../../assets/images/spinner.gif";
import "./AuthHeader.css";

function AuthHeader() {
	const userLoading = useSelector(authSelectors.busy);
  	const user = useSelector(authSelectors.user);
	const authError = useSelector(authSelectors.error);
	const dispatch = useDispatch();

	const [ userInfo, setUserInfo ] = useState({ username: "", password: "" });

	useEffect(() => {
		setTimeout(() => { dispatch(authActions.startupTasks()); }, 100);
	});

	const displayUserItem = () => {
		if (user) {
			return <div>
				<div>{user.display}</div>
				<button>{localize("LABEL_LOGOUT")}</button>
			</div>
		} else if (userLoading) {
			return <div><img src={spinner} alt="Loading..." /></div>
		} else {
			const updateUserInfo = (e) => {
				if (e.target.name) {
					let tmpInfo = { ...userInfo };
					tmpInfo[e.target.name] = e.target.value;
					setUserInfo(tmpInfo);
				}
			}

			return <form>
			<div>
				<div>
					<input type="text" name="username" placeholder={localize("LABEL_USERNAME")} value={userInfo.username} onChange={updateUserInfo}></input>
					<input type="password" name="password" placeholder={localize("LABEL_PASSWORD")} value={userInfo.password} onChange={updateUserInfo}></input>
				</div>
				<div>
					<button type="submit" disabled={!userInfo.userName || !userInfo.password}>{localize("LABEL_LOGIN")}</button>
					<button>{localize("LABEL_SIGNUP")}</button>
				</div>
			</div>
			{(authError) ? <div className="error">{authError}</div> : <></>}
		</form>
		}
	}

	return <header>
		{displayUserItem()}
		<h1>{localize("APP_TITLE")}</h1>
	</header>
}

export default AuthHeader;