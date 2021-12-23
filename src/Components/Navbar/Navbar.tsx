import './Navbar.css'
import Logo from '../../img/logo.png'
import { BsSearch, HiOutlineHeart, MdNotificationsNone } from 'react-icons/all'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { Button, Dropdown, Menu, message, Modal, Tooltip } from 'antd'
import firebase, { db } from './../../Firebase/firebaseConfig';
import { SignOutSuccess } from '../../features/userSlice'
import { Link } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import slugify from 'slugify'
import { List } from 'antd'
import { UserOutlined } from '@ant-design/icons'


interface ISinglePros {
    slug: string,
    description: string,
    owner: string,
    date: string,
    email: String,
    courseName: string
}


function Navbar() {

    const user = useAppSelector(state => state.user);

    const [filterCourseData, setFilterCourseData] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    let onSignOut = () => {
        firebase.auth().signOut();
        dispatch(SignOutSuccess())
    }

    const [searchText, setSearchText] = useState<string | undefined>('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [myRegisterCourses, setMyRegisterCourses] = useState<any[]>([]);
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    let onSetSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.currentTarget.value)
    }


    useEffect(() => {
        db.collection('userRegisteredCourse').get().then(res => {
            const registerCourses: any[] = []
            res.forEach(e => {
                registerCourses.push({
                    id: e.id,
                    data: e.data()
                })
            })
            setMyRegisterCourses(registerCourses)
        }).catch(err => {
            console.log(err)
            message.error('Bir hata oluştu')
        })
    }, [])

    useEffect(() => {

        if (searchText === '') {
            setFilterCourseData([])
        }
    }, [searchText])

    const sendSearchRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (searchText?.trim().length !== 0) {
            const filterData: any[] = []
            db.collection('courses').get().then(result => {
                result.forEach(e => {

                    const { courseName } = e.data();
                    if (slugify(courseName.toLowerCase()).includes(slugify(searchText!.toLowerCase()))) {
                        filterData.push({
                            id: e.id,
                            data: e.data()
                        })
                    }
                })
            }).catch(err => {
                console.log(err)
                message.error("Bir hata oluştu")
            }).finally(() => {
                setFilterCourseData(filterData)

                if (filterData.length === 0) {
                    message.error(`'${searchText}' kelimesini içeren kurs bulunamadı.`)
                }
            })

            showModal()
        }
        else{
            message.error('Bir arama kelimesi girin.')
        }

    }

    const usermenu = (
        <Menu>
            <Menu.Item key="1">Ayarlar</Menu.Item>
            <Menu.Item key="2"><Link to="/my-courses">Kurslarım</Link></Menu.Item>
            <Menu.Item onClick={onSignOut} key="3">Çıkış Yap</Menu.Item>
        </Menu>
    )


    // const RegisterCourse = (id: string) => {
    //     db.collection('userRegisteredCourse').doc(user.data?.email!).collection('courses').add({
    //         ownerName: user.data?.displayName,
    //         ownerEmail: user.data?.email,
    //         courseId: id,
    //         ownerId: user.data?.uid
    //     }).then(res => {
    //         message.success('Kursa kayıt oldunuz')
    //         setIsModalVisible(false);
    //     }).catch(err => {
    //         message.error('Hay aksi... Bir hata oluştu')
    //     })
    // }

    const Footer = () => (
        <Button type="primary" onClick={handleOk}>Kapat</Button>
    )
    return (
        <div className="navbar-component">


            <div className="logo-search">
                <img src={Logo} width="96" />
                <span className="search-input-icon">
                    <BsSearch />
                </span>
                <form onSubmit={sendSearchRequest} style={{ width: '100%' }}>
                    <input onChange={onSetSearchText} value={searchText} className="searchInput outfitText" placeholder="Ne tür bir kurs arıyorsun?" />
                </form>
            </div>
            <div className='searchResultScreen'>

                <Modal title="Arama Sonucu" okText="Kapat" confirmLoading footer={<Footer />} visible={isModalVisible} onOk={handleOk}>
                    <h5 style={{ textAlign: 'center' }}><b>{searchText}</b> adlı kurslar...</h5>
                    <div>
                        {
                            filterCourseData?.map(s => {
                                return (<div key={s.data.slugName} className='filterCourseList'>
                                    <div className='left'>
                                        <span>{s.data.courseName}</span>
                                        <small style={{ color: 'darkgray' }}><UserOutlined />  {s.data.owner}</small>
                                    </div>
                                    <Button type="primary">Kurs'a Git</Button>
                                </div>)
                            })
                        }
                    </div>
                </Modal>
            </div>

            <div className="user-menu">
                <Link to="/create-course">
                    <span className="user-single-menu-text outfitText">
                        Kurs Oluştur
                    </span>
                </Link>
                <span className="user-single-menu">
                    <HiOutlineHeart />
                </span>
                <span className="user-single-menu">
                    <MdNotificationsNone />
                </span>

                <Dropdown overlay={usermenu}>
                    <Tooltip title={`${user.data?.displayName}`} placement='left'>
                        <span className="user-profile">
                            <img src={`${user.data?.photoURL}`} />
                        </span>
                    </Tooltip>

                </Dropdown>
            </div>
        </div>
    )
}

export default Navbar
