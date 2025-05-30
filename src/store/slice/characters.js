import { createSlice } from "@reduxjs/toolkit";
import { listener } from "../listener";
import charFuncs from "../../db/characters";
import dbUtil from "../../db/util";

export const charSlice = createSlice({
	name: "characters",
	initialState: {
		error: null,
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
				state.list[key].profile = Object.values(action.payload)[0].profile;
				state.list[key].notes = Object.values(action.payload)[0].notes;
				state.list[key].lastUpdate = Date.now();
			}
		},
		updateCharacterNotes(state, action) {
			const key = dbUtil.transform(action.payload.character);

			state.list[key].notes = action.payload.notes;

			charFuncs.saveCharacterNotes(key, action.payload.notes);
		},
		setListFilter(state, action) {
			state.filter = action.payload;
		},
		saveCharacter() {},
		saveCharacterComplete(state, action) {
			const key = dbUtil.transform(action.payload.character?.name);

			if (key) {
				state.list[key] = action.payload;
			}
		},
		deleteCharacter() {},
		deleteCharacterComplete(state, action) {
			const key = dbUtil.transform(action.payload);

			if (key) {
				delete state.list[key];
			}
		},
		setErrorState(state, action) {
			state.error = action.payload;
		},
	}
});

export const charActions = charSlice.actions;

export const charSelectors = {
	filter: (state) => {
		return state.characters.filter;
	},
	list: (state) => {
		return state.characters.list;
	},
	error: (state) => {
		return state.characters.error;
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

listener.startListening({
	actionCreator: charActions.saveCharacter,
	effect: async (action, listenerApi) => {
		try {
			const canSave = await charFuncs.canSaveCharacter(dbUtil.transform(action.payload.data.character.name), action.payload.data.character.player, !!action.payload.create);

			if (!canSave) {
				listenerApi.dispatch(charActions.setErrorState(action.payload.create ? "LABEL_CHARACTER_CANT_CREATE" : "LABEL_CHARACTER_CANT_SAVE"));
			} else {
				await charFuncs.saveCharacter(action.payload.data);
				listenerApi.dispatch(charActions.saveCharacterComplete(action.payload.data));
			}
		} catch (e) {
			listenerApi.dispatch(charActions.setErrorState(e.toString()));
		}
	}
})

listener.startListening({
	actionCreator: charActions.deleteCharacter,
	effect: async (action, listenerApi) => {
		try {
			const canDelete = await charFuncs.canDeleteCharacter(dbUtil.transform(action.payload.character.name), action.payload.character.player);

			if (!canDelete) {
				listenerApi.dispatch(charActions.setErrorState("LABEL_CHARACTER_CANT_DELETE"));
			} else {
				await charFuncs.deleteCharacter(action.payload.character.name, action.payload.character.player);
				listenerApi.dispatch(charActions.deleteCharacterComplete(action.payload.character.name));
			}
		} catch (e) {
			listenerApi.dispatch(charActions.setErrorState(e.toString()));
		}
	}
})

export default charSlice.reducer;