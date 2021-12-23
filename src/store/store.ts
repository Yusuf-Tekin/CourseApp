import {useDispatch,useSelector,TypedUseSelectorHook} from 'react-redux'
import {configureStore,getDefaultMiddleware} from '@reduxjs/toolkit'
import userSlice from '../features/userSlice';
import courseSlice from '../features/courseSlice';
const store = configureStore({
    reducer:{
        user:userSlice,
        courses:courseSlice
    },
    middleware:getDefaultMiddleware({
        serializableCheck:false
    })
})

export default store;


export type RootState =ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector