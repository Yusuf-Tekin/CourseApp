

import React, { FC, useEffect, useState } from 'react'
import { db } from '../../Firebase/firebaseConfig';
import { useAppDispatch, useAppSelector } from '../../store/store'
import Loading from './../Loading/Loading';
import { Menu } from 'antd';
import { FundOutlined, UserOutlined } from '@ant-design/icons';
import './MyCourse.css'
import SingleCourseMenu from './SingleCourseMenu';
import { FinishSaveCoursesToGlobalState, StartSaveCoursesToGlobalState } from '../../features/courseSlice';
import { Link } from 'react-router-dom';

const {SubMenu} = Menu;

interface IMyCourse {

}

const MyCourse: FC<IMyCourse> = (props) => {
    const { children } = props;
    const courses = useAppSelector(state => state.courses);
    const [courseSections,setCourseSections] = useState<any[] | null>(null)    
    const sections:any[] = [];
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    console.log(courses)
    const getCoursesSection = (id:string) => {
        db.collection('courses').doc(id).collection('sections').get().then(res => {
            res.forEach(e => {
                sections.push({
                    courseId:id,
                    section:{
                        sectionId:e.id,
                        name:e.data().sectionName,
                        slugName:e.data().slugName
                    }
                })
            })
            setCourseSections(sections);
           
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        dispatch(StartSaveCoursesToGlobalState());
        courses.data?.forEach((course) => {
            getCoursesSection(course.courseId);
        })
        dispatch(FinishSaveCoursesToGlobalState())

    },[])


    if (courses.loading) {
        return (
            <Loading />
        )
    }
    else {
        return (
            <div className="my-course-component">
                <div className="myCoursesMenu">
                    <Menu
                        style={{ width: '100%', height: "100%" }}
                        mode="inline"
                        defaultOpenKeys={['courses']}
                    >
                        <SubMenu key = 'courses' icon={<FundOutlined />} title={'Kurslarım'}>
                        {
                                courses.data?.map((course) => (
                                    <Menu.Item id = {`course${course.courseId}`} key = {course.courseId}>
                                        <Link to = {`/course/${course.courses.slug}`}>{course.courses.courseName} ({course.courses.email === user.data?.email ? <UserOutlined /> : null}) </Link>
                                    </Menu.Item>
                                ))
                        }
                        </SubMenu>
                    </Menu>
                </div>

                <div className="course-content-component">
                    {children}
                </div>

            </div>
        )
    }
}

export default MyCourse