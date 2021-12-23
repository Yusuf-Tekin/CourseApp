import React, { FC, useEffect, useState } from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom';


interface ISingleCourseMenu {
    courseSections: Array<any> | null,
    courseId: string
}

const SingleCourseMenu: FC<ISingleCourseMenu> = (props) => {

    const { courseSections, courseId } = props;
    const [sections, setSection] = useState<any[] | undefined>([])

    useEffect(() => {
        const sectionFilter = courseSections?.filter(course => course.courseId === courseId);
        setSection(sectionFilter);

    }, [])

    return (
        <React.Fragment>
            {/* {
                sections?.map((single, index) => (
                    <Menu.Item key={`${single.section.sectionId}`}><Link to = {`/course/${single.section.slugName}`}>{single.section.name}</Link></Menu.Item>
                ))
            } */}
        </React.Fragment>
    )
}

export default SingleCourseMenu