import React, { FC, useState } from 'react'
import './AddSectionVideo'
import { Form, Space, Input, Button, Upload, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { db, storage } from '../../Firebase/firebaseConfig';
import {getStorage,ref,uploadBytes} from 'firebase/storage'


export interface File {
    uid: string;
}

export interface OriginFileObj {
    uid: string;
}

export interface FileList {
    uid: string;
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    percent: number;
    originFileObj: OriginFileObj;
}

export interface LessonVideo {
    file: File;
    fileList: FileList[];
}

export interface UploadedDataObject {
    lessonName: string;
    lessonVideo: LessonVideo;
}



interface IAddSectionVideo {
    sectionName: string | undefined,
    courseId: string | undefined,
    sectionId: string | undefined,
    changeCurrentFunction:Function
}

const AddSectionVideo: FC<IAddSectionVideo> = (props) => {

    const { sectionName, courseId, sectionId,changeCurrentFunction } = props;
    const [videoFile, setVideoFile] = useState<any>(null)
    const onFinish = (values:{
        contents:Array<UploadedDataObject>
    }) => {
        if (videoFile !== null) {
            console.log(videoFile)
            values.contents.forEach(async (value) => {
                console.log(value)
                const type = value.lessonVideo.fileList[0].type;
                const extension = type.split('/')[1]
                db.collection('courses').doc(courseId).collection('sections').doc(sectionId!).collection('lessons').add({
                    lessonName: value.lessonName,
                    lessonVideo: `/courseVideos/${courseId}_${sectionId}_${value.lessonVideo.file.uid}.${extension}`,
                    sectionId: sectionId,
                    lessonCompleted:[]
                }).then(res => {
                }).catch(err => {
                    message.error('Bir hata oluştu.')
                }).finally(() => {
                    //`/courseVideos/${courseId}_${sectionId}_${value.lessonVideo.file.uid}.${extension}`
                    uploadBytes(storage.ref('videoos.mp4'), videoFile.name).then((snapshot) => {
                        console.log(snapshot)
                        console.log('Uploaded a blob or file!');
                      });
                    // ref.child(videoFile.name).put(videoFile,{
                    //     contentType:'video/mp4'
                    // }).then(result => {
                    //     message.success('İçerik yüklendi.')
                    //     
                    // }).catch(err => {
                    //     message.error('İçerik yüklenemedi.')
                    // })
                    changeCurrentFunction();
                })
            })
        }
        else {
            message.error('Ders videosu eklemek zorunludur.')
        }


    };

    const uploadProps = {
        beforeUpload: () => false,
        onChange: (info: any) => {
            setVideoFile(info.fileList[0])
        },

    };
    return (
        <div>
            <h3>{sectionName}</h3>
            <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.List name="contents">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'lessonName']}
                                            fieldKey={[fieldKey, 'lessonName']}
                                            rules={[{ required: true, message: 'Ders adı zorunludur' }]}
                                        >
                                            <Input placeholder="Ders Adı" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'lessonVideo']}
                                            fieldKey={[fieldKey, 'lessonVideo']}
                                            rules={[{ required: true, message: 'Ders içeriği zorunludur.' }]}
                                        >
                                            <Upload maxCount={1} {...uploadProps} accept="video/*">
                                                <Button icon={<UploadOutlined />}>Ders İçeriği</Button>
                                            </Upload>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size={'small'}>
                                    Ders Ekle
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Kaydet
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddSectionVideo
