import { Button, Result } from 'antd'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
function CourseCreateSuccess() {
    let history = useHistory<{courseName:string,slugName:string}>()
    console.log(history)

    return (
        <Result
            status="success"
            title="Tebrikler! Yeni bir kurs oluşturdun."
            subTitle={`${history.location.state.courseName} kursunu şimdi paylaşarak daha çok öğrenciye ulaşmasını sağlayabilirsin.`}
            extra={[
                <Button type="primary" key="console">
                    Anasayfa'ya Dön
                </Button>,
            ]}
        />
    )
}

export default CourseCreateSuccess
