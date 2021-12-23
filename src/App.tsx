import { useEffect, useState } from 'react';
import './App.css';
import RouterConfig from './Components/RouterConfig/RouterConfig';
import { useAppDispatch, useAppSelector } from './store/store';
import firebase, { db } from './Firebase/firebaseConfig';
import { FinishSaveToGlobalState, StartSaveToGlobalState, SuccessSaveToGlobalState } from './features/userSlice';
import Loading from './Components/Loading/Loading';
import './Components/Css/Global.css'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { collection, query, where, getDocs } from "firebase/firestore";
import { FinishSaveCoursesToGlobalState, StartSaveCoursesToGlobalState, SuccessSaveCoursesToGlobalState } from './features/courseSlice';

interface SectionDatasInterface {
  sectionName: string,
  parentId: string,
  slugName: string
}

function App() {

  const user = useAppSelector(state => state.user)
  const courses = useAppSelector(state => state.courses)
  const dispatch = useAppDispatch();
  const courseData: any[] = [];

  useEffect(() => {
    dispatch(StartSaveToGlobalState());
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        dispatch(SuccessSaveToGlobalState(firebase.auth().currentUser))
        dispatch(FinishSaveToGlobalState())
      }
      else {
        return dispatch(FinishSaveToGlobalState())
      }
    })
  }, [])


  // const getRegisterCourse = async (id: string) => {
  //   const docRef = await db.collection('courses').doc(id)

  //   docRef.get().then(res => {
  //     if (res.exists) {
        
  //       courseData.push({ courseId: res.id, courses: res.data() })

  //     }

  //   })

  // }


  const getCoursesData = async () => {
    const q = query(collection(db, "courses"), where("email", "==", user.data?.email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(q => {
      courseData.push({ courseId: q.id, courses: q.data() })
    })


    dispatch(SuccessSaveCoursesToGlobalState(courseData))
    dispatch(FinishSaveCoursesToGlobalState())
  }


  useEffect(() => {
    dispatch(StartSaveCoursesToGlobalState());
    user.data?.email && getCoursesData();
    user.data?.email && db.collection('userRegisteredCourse').doc(user.data?.email).collection('courses').get().then(res => {
      res.forEach(course => {
        //getRegisterCourse(course.data().courseId);
      })
    })
  }, [user.data])


  return (
    <div className="App">
      {
        user.loading === true ? <Loading /> : <RouterConfig />
      }
    </div>
  );
}

export default App;
