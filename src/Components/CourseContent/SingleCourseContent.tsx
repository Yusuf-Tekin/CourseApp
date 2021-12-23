import { EditOutlined, RightOutlined } from "@ant-design/icons"
import { Avatar, Button, List, message, Popconfirm, Space, Tabs } from "antd"
import React, { FC, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { db, storage } from "../../Firebase/firebaseConfig"
import { useAppSelector } from "../../store/store"
import './CourseContent.css'
export interface Course {
    slug: string;
    description: string;
    courseName: string;
    date: number;
    owner: string;
    email: string;
}

export interface ISingleCourseContent {
    course: Course;
    image: string;
    id: string;
}


const SingleCourseContent: FC<ISingleCourseContent> = (props) => {
    const { TabPane } = Tabs;
    const { course, image, id } = props
    const [singleCourseState, setSingleCourseState] = useState<ISingleCourseContent | null>(null)
    const [sectionNames, setSectionNames] = useState<any[]>([]);
    const [sectionLessons, setSectionLessons] = useState<any[]>([]);
    const user = useAppSelector(state => state.user);
    let history = useHistory();
    useEffect(() => {
        setSingleCourseState({ course, image, id });
    }, [])


    useEffect(() => {
        const sectionNamesArray: any[] = [];
        id && db.collection('courses').doc(id).collection('sections').get().then(response => {
            response.forEach(r => {
                sectionNamesArray.push({
                    sectionId: r.id,
                    sectiondata: r.data()
                });
            })
        }).catch(err => {
            message.error('Bir hata oluştu')
            console.log(err)
        }).finally(() => {
            setSectionNames(sectionNamesArray);
            console.log(sectionNamesArray)
        })
    }, [])


    const getLessons = (sectionId: string) => {
        const lessonDatasArray: any[] = [];
        db.collection('courses').doc(id).collection('sections').doc(sectionId).collection('lessons').get().then(lessons => {
            lessons.forEach(async (lesson) => {

                let videoUrl = ''
                // await storage.ref(lesson.data().lessonVideo).getDownloadURL().then(url => {
                //     videoUrl = url
                // })

                lessonDatasArray.push({
                    id: lesson.id,
                    lessonDatas: lesson.data(),
                    videoUrl: videoUrl
                })
            })
        }).catch(err => {
            message.error('Dersler alınırken bir hata meydana geldi.')
            console.log(err)
        }).finally(() => {
            setSectionLessons(lessonDatasArray);
            console.log(lessonDatasArray)
        })
    }

    useEffect(() => {

        db.collection('courses').doc(id).collection('sections').get().then(section => {

            const ids: string[] = []
            section.forEach(e => {
                ids.push(e.id);
            })
            getLessons(ids[0]);
        })

    }, [])

    const deleteCourse = (courseId: string) => {
        db.collection('courses').doc(courseId).delete().then(res => {
            message.success('Kurs başarıyla silindi.')
            window.location.href = "/my-courses"
        }).catch(err => {
            message.error("Kurs silinemedi.Daha sonra tekrar deneyin.")
        })
    }

    const onChangeTab = (sectionId: string) => {
        getLessons(sectionId);
    }

    return (
        <div className="CourseContentComponent">
            <div className="content-left">
                <img className="course-content-image" src={singleCourseState?.image} alt="Course Photo" />
                <h4>{singleCourseState?.course.courseName}</h4>
                <Popconfirm
                    title="Emin misiniz?"
                    onConfirm={() => { deleteCourse(id) }}
                    onVisibleChange={() => console.log('visible change')}
                >
                    {
                        course.email === user.data?.email ? <Button size="small" danger>Kursu Kaldır</Button> : null
                    }
                </Popconfirm>
            </div>
            <div className="content-right">
                <div className="course-right-header">
                    <h2>Kurs İçeriği</h2>

                    <hr />
                    <Tabs defaultActiveKey="1" onChange={onChangeTab} centered>

                        {
                            sectionNames.map(tab => (
                                <TabPane tab={tab.sectiondata.sectionName} key={tab.sectionId}>
                                    {
                                        <List
                                            itemLayout="vertical"
                                            size="large"
                                            dataSource={sectionLessons.reverse()}
                                            renderItem={item => (
                                                <List.Item
                                                    key={item.title}
                                                    extra={
                                                        <div>
                                                            {
                                                                user.data?.email === course.email ? <Button danger type="dashed"  style={{marginRight:"5px"}} icon={<EditOutlined />}></Button> : null
                                                            }
                                                            <Button icon={<RightOutlined />} type="primary">Ders'e Git</Button>
                                                        </div>

                                                    }
                                                >
                                                    <List.Item.Meta
                                                        title={item.lessonDatas.lessonName}
                                                        description={item.description}
                                                    />
                                                    {item.content}
                                                </List.Item>
                                            )}
                                        />
                                    }
                                </TabPane>
                            ))
                        }
                    </Tabs>


                </div>
            </div>
        </div>
    )
}

export default SingleCourseContent
