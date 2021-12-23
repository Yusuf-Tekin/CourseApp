import { InfoCircleOutlined, UploadOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Button, Input, message, Tooltip, Upload } from 'antd'
import { Form } from 'antd';
import React, { useState } from 'react'
import { useAppSelector } from '../../../store/store';

interface IStep1 {
    courseName: string,
    onChangeCourseNameEvent: Function,
    CreateCourseEvent: Function,
    savedCourse: boolean,
    onSetUploadedImage:Function
}


const Step1: React.FC<IStep1> = (props) => {

    const { courseName, onChangeCourseNameEvent, savedCourse,onSetUploadedImage} = props;

    const user = useAppSelector(state => state.user).data;
    const fileProps = {
        onChange({ file, fileList }: any) {
            if(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' && file.status !== 'uploading'){
                onSetUploadedImage(file);
                message.success('Dosya yüklendi')
            }
        }
    };
    return (
        <div className="step1-component">
            <h4 className="step-header">
                Merhaba {user?.displayName?.split(' ')[0]},<br></br>
                ilk adımda senden kapak fotoğrafı ve kurs adı vermeni istiyoruz.
                Kurs adını vermek zorunludur.Vermediğin sürece bir sonraki adıma geçemezsin.
            </h4>
            <div className="step1-main">
                <div className="upload-image">
                    <Upload maxCount = {1} beforeUpload = {() => false} {...fileProps}>
                        <Button icon={<UploadOutlined />}>Kapak Fotoğrafı</Button>
                    </Upload>
                </div>
                <div className="set-course-infos" style={{ marginTop: '15px' }}>
                    {
                        savedCourse === true ? <Input
                            disabled
                            required
                            size="large"
                            style={{ width: '350px' }}
                            placeholder="Kurs Adı"
                            value={courseName}
                            onChange={(e) => onChangeCourseNameEvent(e)}
                            prefix={<ThunderboltOutlined className="site-form-item-icon" />}
                            suffix={
                                <Tooltip title="Diğer kullanıcıların kursunuzu daha rahat bulabilmeleri için özgün bir isim verin">
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        /> : <Input
                            required
                            size="large"
                            style={{ width: '350px' }}
                            placeholder="Kurs Adı"
                            value={courseName}
                            onChange={(e) => onChangeCourseNameEvent(e)}
                            prefix={<ThunderboltOutlined className="site-form-item-icon" />}
                            suffix={
                                <Tooltip title="Diğer kullanıcıların kursunuzu daha rahat bulabilmeleri için özgün bir isim verin">
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    }
                    <br />
                    <br />
                    {
                        props.savedCourse === true ? <Button type="primary" onClick={() => { props.CreateCourseEvent() }} disabled>Oluştur</Button> : <Button type="primary" onClick={() => { props.CreateCourseEvent() }}>Oluştur</Button>
                    }
                </div>
            </div>

        </div>
    )
}

export default Step1
