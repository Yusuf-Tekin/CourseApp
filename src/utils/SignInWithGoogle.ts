import { message } from "antd";
import { FailSaveToGlobalState, FinishSaveToGlobalState, StartSaveToGlobalState, SuccessSaveToGlobalState } from "../features/userSlice";
import firebase from "../Firebase/firebaseConfig"


export const onSignInWithGoogle = (dispatch:any) => {
    dispatch(StartSaveToGlobalState())
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(response => {
        dispatch(SuccessSaveToGlobalState(response.user));
    }).catch(error => {
        dispatch(FailSaveToGlobalState())
        message.error('İptal edildi')
    }).finally(() => {
        dispatch(FinishSaveToGlobalState())
    })

}