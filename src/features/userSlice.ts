
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

export interface IUser {
    data: firebase.default.User | null,
    loading: boolean,
    error: string,
    isLoggedIn:boolean
}

const userInitialState: IUser = {
    data: null,
    loading: false,
    error: '',
    isLoggedIn:false
}

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        StartSaveToGlobalState: (state) => {
            state.loading = true;
            return state;
        },
        SuccessSaveToGlobalState:(state,action:PayloadAction<firebase.default.User | null>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = "";
            state.isLoggedIn = true;
            return state;
        },
        FailSaveToGlobalState:(state) => {
            state.loading = false;
            state.error = "Bir hata oluştu"
            return state;
        },
        FinishSaveToGlobalState:(state) => {
            state.loading = false;
            return state;
        },
        SignOutSuccess:(state) => {
            state.isLoggedIn = false;
            return state;
        }
    }
})

export default userSlice.reducer;
export const { StartSaveToGlobalState,SuccessSaveToGlobalState,FailSaveToGlobalState,FinishSaveToGlobalState,SignOutSuccess } = userSlice.actions;



