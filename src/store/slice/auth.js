import { createSlice } from "@reduxjs/toolkit";
import { listener } from "../listener";
import authFuncs from "../../db/auth";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		busy: true
	},
	reducers: {
		startupTasks() { },
		login(state, action) {
			state.busy = true;
			state.error = undefined;
		},
		loginSuccess(state, action) {
			state.user = action.payload;
			state.busy = false;
			state.error = undefined;
		},
		loginFailed(state, action) {
			state.user = undefined;
			state.busy = false;
			state.error = action.payload.toString() || "Login failed.";
		},
		logout(state) {
			state.busy = true;
		},
		logoutComplete(state) {
			state.user = undefined;
			state.busy = false;
		},
		setBusy(state, action) {
			state.busy = action.payload;
		}
	}
});

export const authActions = authSlice.actions;

export const authSelectors = {
	error: (state) => {
		return state.auth.error;
	},
	busy: (state) => {
		return state.auth.busy;
	},
	user: (state) => {
		return state.auth.user;
	}
}

listener.startListening({
	actionCreator: authActions.startupTasks,
	effect: async (action, listenerApi) => {
		authFuncs.startupTasks().then((result) => {
			if (result) {
				listenerApi.dispatch(authActions.loginSuccess(result));
			} else {
				listenerApi.dispatch(authActions.setBusy(false));
			}
		}).catch((error) => {
			listenerApi.dispatch(authActions.loginFailed(error));
		})
	}
});

listener.startListening({
	actionCreator: authActions.login,
	effect: async (action, listenerApi) => {
		// authFuncs.login(action.payload).then((result) => {
		// 	listenerApi.dispatch(authActions.loginSuccess(result));
		// }).catch((error) => {
		// 	listenerApi.dispatch(authActions.loginFailed(error));
		// });
	}
});

listener.startListening({
	actionCreator: authActions.logout,
	effect: async (action, listenerApi) => {
		// authFuncs.logout().then(() => {
		// 	listenerApi.dispatch(authActions.logoutComplete());
		// });
	}
})

export default authSlice.reducer;