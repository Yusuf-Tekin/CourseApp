import { FC, useEffect, useState } from "react";
import { useParams } from "react-router"
import { FinishSaveCoursesToGlobalState, InitialStateCourse, StartSaveCoursesToGlobalState, SuccessSaveCoursesToGlobalState } from "../../features/courseSlice";
import { db, storage } from "../../Firebase/firebaseConfig";
import './CourseContent.css'
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Loading from "../Loading/Loading";
import { FinishSaveToGlobalState, StartSaveToGlobalState } from "../../features/userSlice";
import { message } from "antd";
import SingleCourseContent from "./SingleCourseContent";


interface IParams {
    slugName: string
}


export interface Course {
    email: string;
    owner: string;
    slug: string;
    date: number;
    description: string;
    courseName: string;
}

export interface SingleCourseObject {
    course: Course;
    image: string;
    id: string;
}



const CourseContent = () => {
    const params = useParams<IParams>();
    const [courseContent, setCourseContent] = useState<SingleCourseObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const getCourseData = (slug: string) => {
       
        db.collection("courses").where("slug", "==", slug).get().then(res => {
            const courseData: any[] = [];

            res.forEach(async (e) => {
                let imageUrl = '';

                const pathRef = storage.ref(`/courseImages/${e.id}`)
                const image = await pathRef.getDownloadURL().then(url => {
                    imageUrl = url;
                })
                courseData.push({
                    course: e.data(),
                    image: imageUrl,
                    id: e.id
                })
            })
            setCourseContent(courseData)
            
        }).catch(err => {
            console.log(err)
            message.error('Bir hata oluştu.')
        }).finally(()=> {
            setLoading(false)
        })

    }

    useEffect(() => {
        setLoading(true)
        params.slugName && getCourseData(params.slugName)
    }, [params.slugName])

    if (loading === true) {
        return <Loading />
    }
    else {
        return (
            <div>
                {
                    courseContent[0] && <SingleCourseContent course={courseContent[0].course} image = {courseContent[0].image} id = {courseContent[0].id} />
                }
            </div>
        )


    }
}

export default CourseContent
