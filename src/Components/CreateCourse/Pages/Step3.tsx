import { MailOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react'
import { db } from '../../../Firebase/firebaseConfig'
import { Menu, MenuProps } from 'antd';
import Loading from '../../Loading/Loading';
import AddSectionVideo from '../../AddSectionVideo/AddSectionVideo';


interface IStep3 {
    courseId: string,
    changeCurrentCount: Function,
    courseName:string
}

const Step3: FC<IStep3> = (props) => {
    const { SubMenu } = Menu;
    const { courseId, changeCurrentCount,courseName } = props
    const [sectionNames, setSectionNames] = useState<Array<{
        name: string,
        id: string
    }> | null>(null);
    const [loading,setLoading] = useState(true);
    const [activeSection,setActiveSection] = useState<{name:string,id:string} | null>(null);



    useEffect(() => {
        const course = db.collection('courses').doc(courseId).collection('sections');
        course.get().then(doc => {
            const sectionNames: Array<
                {
                    name: string,
                    id: string
                }> = [];
            doc.forEach(q => {
                sectionNames.push({
                    name: q.data().sectionName,
                    id: q.id
                })

                setSectionNames(sectionNames);
            })
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        console.log(activeSection)
    }, [activeSection])

    const onSetActiveSection= (name:string,id:string) => {
        setActiveSection({
            name:name,
            id:id
        })
    }



    if(loading === true){
        return <Loading />
    }
    else {
        return (
            <div className="step3-component">
                <div className="section-area">
                    <Menu
                        style={{ width: 256}}
                        mode="inline"
                        defaultOpenKeys={['sub1']}
                    >
                        <SubMenu key="sub1" icon={<MailOutlined />} title={courseName}>
                            {
                                sectionNames?.map(section => (
                                    <Menu.Item onClick = {() => {onSetActiveSection(section.name,section.id)}} key = {section.id}>{section.name}</Menu.Item>
                                ))
                            }
                        </SubMenu>
                    </Menu>
                </div>
                <div className="content-area">
                    {
                        activeSection?.name !== undefined ? <AddSectionVideo changeCurrentFunction = {changeCurrentCount} courseId= {courseId} sectionId = {activeSection?.id} sectionName = {activeSection?.name} /> : null
                    }
                </div>
            </div>
        )
    }
}

export default Step3
