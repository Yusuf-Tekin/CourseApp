import { Steps, Popover, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/store'
import './CreateCourse.css'
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import Step1 from './Pages/Step1';
import Step2 from './Pages/Step2';
import { db, storage } from './../../Firebase/firebaseConfig';
import { message } from 'antd';
import Step3 from './Pages/Step3';
import slugify from 'slugify';
import Step4 from './Pages/Step4';
import { useHistory } from 'react-router-dom';

const { Step } = Steps;
function CreateCourse() {

    const user = useAppSelector(state => state.user);
    let [currentCount, setCurrentCount] = useState<number>(0);
    const [nextButtonStatus, setNextButtonStatus] = useState<boolean>(false);
    const [previousButtonStatus, setPreviousButtonStatus] = useState<boolean>(false);
    const [courseName, setCourseName] = useState<string>("")
    const [savedCourse, setSavedCourse] = useState<boolean>(false)
    const [courseId, setCourseId] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const history = useHistory();

    const onChangeCourseName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCourseName(e.currentTarget.value);
    }

    const onChangeCourseDescription = (description: string, courseId: string) => {

        db.collection('courses').doc(courseId).update({
            description: description
        }).then(res => {
            message.success('Kurs Tamamlandı.');
            history.push('/course-create-success', { courseName: courseName,slugName:slugify(courseName) })
        }).catch(err => {
            message.error('Bir hata oluştu')
        })

    }

    const changeCurrentCount = () => {
        setCurrentCount(currentCount += 1);
    }

    const CreateCourseEvent = async () => {
        if(courseName.trim().length > 0){
            await db.collection('courses').add({
                courseName: courseName,
                owner: user.data?.displayName,
                email: user.data?.email,
                date: Date.now(),
                slug: slugify(courseName),
                registerUsers:[]
            }).then(res => {
                setCourseId(res.id);
                if (image !== null) {
                    storage.ref(`/courseImages/${res.id}`).put(image);
                }
                setSavedCourse(true);
                setCurrentCount(currentCount += 1)
                message.success('Kurs kayıt edildi.')
            }).catch(err => {
                message.error('Bir hata oluştu.Lütfen tekrar deneyiniz.');
                console.log({ err })
            }).finally(() => {
            })
        }
        else{
            message.error('Kurs adı boş bırakılamaz.')
        }
    }


    useEffect(() => {
        if (currentCount === 0) {
            setPreviousButtonStatus(true)
        }
        else {
            setPreviousButtonStatus(false)
        }
        if (savedCourse === true) {
            setNextButtonStatus(false)
        }
        if (currentCount === 3) {
            setNextButtonStatus(true)
        }
        else if (courseName.trim().length < 5) {
            setNextButtonStatus(true)
        }
    }, [currentCount, courseName, savedCourse])


    const popoverConfig = (dot: any, { status, index }: any) => (
        <Popover
            content={
                <span>
                    Adım {index + 1}
                </span>
            }
        >
            {dot}
        </Popover>
    )

    const onSetUploadedImage = (image: File) => {
        setImage(image);
    }

    return (
        <div className="create-course-component">
            <div className="main-component">
                <Steps size="small" current={currentCount} progressDot={popoverConfig}>
                    <Step title="Adım 1" description="Kurs Adı" />
                    <Step title="Adım 2" description="Kurs Bölümleri" />
                    <Step title="Adım 3" description="Kurs İçeriği" />
                    <Step title="Adım 4" description="Kurs Açıklaması" />
                </Steps>
                <div className="pagination-area">
                    {
                        currentCount === 0 ? <Step1 onSetUploadedImage={onSetUploadedImage} savedCourse={savedCourse} CreateCourseEvent={CreateCourseEvent} courseName={courseName} onChangeCourseNameEvent={onChangeCourseName} /> : currentCount === 1 ? <Step2 courseId={courseId} changeCurrentCount={changeCurrentCount} /> : currentCount === 2 ? <Step3 courseName={courseName} changeCurrentCount={changeCurrentCount} courseId={courseId} /> : currentCount === 3 ? <Step4 courseId={courseId} onChangeCourseDescription={onChangeCourseDescription} /> : null
                    }


                </div>
                <div className="next-previous-button">
                    {
                        previousButtonStatus === true ? <Button disabled type="primary" shape="circle" onClick={() => {
                            setCurrentCount(currentCount--)
                            console.log('Artıor')
                        }}><LeftOutlined /></Button> : <Button type="primary" shape="circle" onClick={() => { setCurrentCount(currentCount--) }}><LeftOutlined /></Button>
                    }

                    {
                        nextButtonStatus === true ? <Button type="primary" disabled shape="circle" onClick={() => { setCurrentCount(currentCount++) }}><RightOutlined /></Button> : <Button type="primary" shape="circle" onClick={() => { setCurrentCount(currentCount++) }}><RightOutlined /></Button>

                    }                </div>
            </div>
        </div>
    )
}

export default CreateCourse
