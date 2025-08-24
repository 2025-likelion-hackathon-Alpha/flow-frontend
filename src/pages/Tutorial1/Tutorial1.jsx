import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Tutorial1.scss'
import Header from '../../components/Header/Header'
import Back from '../../assets/Back.svg'
import Slide from '../../assets/tutorial1.png'
import Robot from '../../assets/Robot.svg'
import Ex1 from '../../assets/Ex1.svg'

const Tutorial1 = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="Tutorial_wrap">
                <Header title='Flow' />
                <div className="back" onClick={() => navigate(-1)}>
                    <img src={Back} alt="뒤로가기" />
                </div>

                <div className="slide">
                    <img src={Slide} alt="" />
                </div>

                <div className="title">
                    <div className="robot">
                        <img src={Robot} alt="" />
                    </div>
                    <p>AI 소비 추천</p>
                </div>

                <div className="example">
                    <img src={Ex1} alt="" />
                    <p>지금 가기 좋은 지역 가게를 AI가 실시간으로 추천해요.</p>
                    <div className="btn" onClick={() => navigate('/tutorial2')}>다음</div>
                </div>

            </div>
        </>
    )
}

export default Tutorial1