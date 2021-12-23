import { Button, Input } from 'antd';
import React, { FC, useState } from 'react'


interface IStep4Props{
    courseId:string,
    onChangeCourseDescription:Function
}
const {TextArea} = Input

const Step4:FC<IStep4Props> = (props) => {

    const {courseId,onChangeCourseDescription} = props;
    const [description,setDescription] = useState<string>('');
    const onSetDescription = (value:React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(value.currentTarget.value);
    }

    return (
        <div>
            <h4>Kursunuz hakkında daha fazla bilgi verin.(Opsiyonel) {500-description.length}/500</h4>
            <TextArea rows={4} cols= {12} maxLength = {500} value = {description} onChange = {onSetDescription} />
            <br />
            <br />
            <Button onClick = {() => {onChangeCourseDescription(description,courseId)}}>Tamamla</Button>
        </div>
    )
}

export default Step4
