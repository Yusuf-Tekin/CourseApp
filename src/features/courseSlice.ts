import { createSlice } from "@reduxjs/toolkit";


export interface InitialStateCourse {
    data: Array<{
        courseId: string,
        courses: {
            courseName: string,
            email: string,
            date: Date,
            owner: string,
            slug: string
        }
    }> | null,
    loading: boolean,
    error: string
}

const initialState: InitialStateCourse = {
    data: null,
    loading: false,
    error: ''
}

const courseSlice = createSlice({
    name: 'courseSlice',
    initialState,
    reducers: {
        StartSaveCoursesToGlobalState: (state) => {
            state.loading = true;
            return state;
        },
        SuccessSaveCoursesToGlobalState: (state, action) => {
            state.loading = false;
            state.data = action.payload;
            return state;
        },
        FailSaveCoursesToGlobalState: (state) => {
            state.loading = false;
            state.error = "Bir hata oluştu"
            return state
        },
        FinishSaveCoursesToGlobalState: (state) => {
            state.loading = false;
            return state;
        }
    }
})

export default courseSlice.reducer;
export const { StartSaveCoursesToGlobalState, SuccessSaveCoursesToGlobalState, FailSaveCoursesToGlobalState, FinishSaveCoursesToGlobalState } = courseSlice.actions