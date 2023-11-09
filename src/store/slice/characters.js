import { createSlice } from "@reduxjs/toolkit";
import { listener } from "../listener";
import charFuncs from "../../db/characters";

export const charSlice = createSlice({
	name: "characters",
	initialState: {
		list: {}
	},
	reducers: {
		loadFullCharacterList() { },
		fullCharacterListLoaded(state, action) {
			state.list = action.payload;
		},
		loadCharacterProfile(state, action) { },
		characterProfileLoaded(state, action) {
			const key = Object.keys(action.payload)[0];

			if (key) {
				state.list[key].profile = Object.values(action.payload)[0];
				state.list[key].lastUpdate = Date.now();
			}
		}
	}
});

export const charActions = charSlice.actions;

export const charSelectors = {
	list: (state) => {
		return state.characters.list;
	}
}

listener.startListening({
	actionCreator: charActions.loadFullCharacterList,
	effect: async (action, listenerApi) => {
		charFuncs.getAllCharacterData().then((result) => {
			listenerApi.dispatch(charActions.fullCharacterListLoaded(result));
		}).catch((error) => {
			listenerApi.dispatch(charActions.fullCharacterListLoaded({}));
		})
	}
});

listener.startListening({
	actionCreator: charActions.loadCharacterProfile,
	effect: async (action, listenerApi) => {
		charFuncs.getCharacterProfileData(action.payload).then((result) => {
			listenerApi.dispatch(charActions.characterProfileLoaded(result));
		})
	}
});

export default charSlice.reducer;