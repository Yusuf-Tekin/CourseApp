import React from 'react'
import './Login.css'
import GoogleButton from 'react-google-button'
import { onSignInWithGoogle } from '../../utils/SignInWithGoogle'
import { useAppDispatch } from '../../store/store'
function Login() {

    const dispatch = useAppDispatch();

    const signInWithGoogle = () => {
        onSignInWithGoogle(dispatch);
    }

    return (
        <div className = "login-component">
            <GoogleButton label = "Google ile oturum aç" onClick = {signInWithGoogle} type = "light" />
        </div>
    )
}

export default Login
