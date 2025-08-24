import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Logo from '../../assets/BlurLogo.svg'
import './Success.scss'

const Success = () => {
    const navigate = useNavigate()

    return (
        <>
            <Header title='Flow' />

            <div className="Success_wrap">
                <div className="title">
                    <h1>이제부터 지역과 나,<br />
                        더 똑똑하게 연결해 볼까요?</h1>
                    <p>스마트한 지역화폐 소비를 플로와 함께해요!</p>
                </div>
                <div className="logo">
                    <img src={Logo} alt="" />
                </div>
                <div className="btn" onClick={() => navigate('/main')}>시작하기</div>
            </div>
        </>
    )
}

export default Success