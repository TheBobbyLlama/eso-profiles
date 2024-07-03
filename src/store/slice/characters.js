import { createSlice } from "@reduxjs/toolkit";
import { listener } from "../listener";
import charFuncs from "../../db/characters";
import dbUtil from "../../db/util";

export const charSlice = createSlice({
	name: "characters",
	initialState: {
		filter: {},
		list: {}
	},
	reducers: {
		loadCharacterList() { },
		characterListLoaded(state, action) {
			state.list = {};

			Object.entries(action.payload).forEach(([key, value]) => {
				state.list[key] = {};
				state.list[key].character = value;
			});
		},
		loadFullCharacterData(state, action) { },
		fullCharacterDataLoaded(state, action) {
			const key = dbUtil.transform(action.payload.character?.name);

			if (key) {
				state.list[key] = action.payload;
			}
		},
		loadCharacterProfile(state, action) { },
		characterProfileLoaded(state, action) {
			const key = Object.keys(action.payload)[0];

			if (key) {
				state.list[key].profile = Object.values(action.payload)[0];
				state.list[key].lastUpdate = Date.now();
			}
		},
		setListFilter(state, action) {
			state.filter = action.payload;
		}
	}
});

export const charActions = charSlice.actions;

export const charSelectors = {
	filter: (state) => {
		return state.characters.filter;
	},
	list: (state) => {
		return state.characters.list;
	}
}

listener.startListening({
	actionCreator: charActions.loadCharacterList,
	effect: async (action, listenerApi) => {
		charFuncs.getAllCharacterData().then((result) => {
			listenerApi.dispatch(charActions.characterListLoaded(result));
		}).catch((error) => {
			listenerApi.dispatch(charActions.characterListLoaded({}));
		})
	}
});

listener.startListening({
	actionCreator: charActions.loadFullCharacterData,
	effect: async (action, listenerApi) => {
		charFuncs.getFullCharacterData(action.payload).then((result) => {
			listenerApi.dispatch(charActions.fullCharacterDataLoaded(result));
		}).catch((error) => {
			listenerApi.dispatch(charActions.fullCharacterDataLoaded({}));
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