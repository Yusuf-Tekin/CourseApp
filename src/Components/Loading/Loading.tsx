import React from 'react'
import './Loading.css'
import LoadingSVG from '../../img/loading.svg'
function Loading() {
    return (
        <div className = "loading-component">
             <img src = {LoadingSVG} width = "48" height = "48"></img>
        </div>
    )
}

export default Loading
