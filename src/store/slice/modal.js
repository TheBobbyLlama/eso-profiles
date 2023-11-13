import { createSlice } from "@reduxjs/toolkit";

export const modalKey = {
	clear: null,
	generic: 1,
	signup: 2,
}

export const modalSlice = createSlice({
	name: "modal",
	initialState: {
		key: null,
	},
	reducers: {
		showModal(state, action) {
			state.key = action.payload.key;
			state.data = action.payload.data;
		}
	}
});

export const modalActions = modalSlice.actions;

export const modalSelectors = {
	key: (state) => {
		return state.modal.key;
	},
	data: (state) => {
		return state.modal.data;
	},
}

export default modalSlice.reducer;