import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Form, Button, message } from 'antd';
import { FC } from 'react';
import slugify from 'slugify';
import { db } from '../../../Firebase/firebaseConfig';


const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 28, offset: 0 },
    },
};


interface IStep2 {
    courseId:string,
    changeCurrentCount:Function
}
const Step2:FC<IStep2> = (props) => {

    const {courseId,changeCurrentCount} = props;
    const onFinish = (values: any) => {
        values.names.forEach(async(sectionName:any) => {
            await db.collection('courses').doc(courseId).collection('sections').add({
                sectionName:sectionName,
                slugName:slugify(sectionName)
            })
        })
        message.success('Bölüm eklendi.')
        changeCurrentCount();


    };

    return (
        <div className="step2-component">
            <div className="section-area">
                <small>Adım değişikliğinde tüm veriler kaybolur.</small>
                <br />
                <br />
                <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish}>
                    <Form.List
                        name="names"
                        rules={[
                            {
                                validator: async (_, names) => {
                                    if (!names || names.length < 1) {
                                        return Promise.reject(new Error('En az 1 bölüm'));
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "Bölüm adı zorunludur.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input autoComplete = "off" placeholder={`Bölüm ${index+1}`} style={{ width: '80%' }} />
                                        </Form.Item>
                                        {fields.length > 1 ? (

                                            <MinusCircleOutlined
                                                style={{ marginLeft: "6px" }}
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '60%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        Bölüm Ekle
                                    </Button>
                                    <Form.ErrorList errors={errors} />
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
        </div>
    )
}

export default Step2;
