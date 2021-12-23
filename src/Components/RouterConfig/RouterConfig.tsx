import React, { useEffect } from 'react'
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import CourseCreateSuccess from '../CourseCreateSuccess/CourseCreateSuccess';
import CreateCourse from '../CreateCourse/CreateCourse';
import Home from '../Home/Home';
import Login from '../Login/Login';
import MyCourse from '../MyCourse/MyCourse';
import Navbar from '../Navbar/Navbar';
import CourseContent from './../CourseContent/CourseContent';
function RouterConfig() {


    const user = useAppSelector(state => state.user);
    const courses = useAppSelector(state => state.courses)
    if(!user.isLoggedIn){
        return(
            <Router>
                <Switch>
                    <Route exact path = "/">
                        <Login />
                    </Route>
                    <Route exact path = "*">
                        <Redirect to = "/" />
                    </Route>
                </Switch>
            </Router>
        )
    }
    else{
        return(
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path = "/">
                        <Home />
                    </Route>
                    <Route exact path = "/create-course">
                        <CreateCourse />
                    </Route>
                    <Route exact path = "/my-courses">
                        <MyCourse />
                    </Route>
                    <Route exact path = "/course/:slugName">
                        <MyCourse>
                            <CourseContent />
                        </MyCourse>
                    </Route>
                    <Route exact path ="/course-create-success">
                        <CourseCreateSuccess />
                    </Route>
                </Switch>
            </Router>
        )
    }
    
}

export default RouterConfig
