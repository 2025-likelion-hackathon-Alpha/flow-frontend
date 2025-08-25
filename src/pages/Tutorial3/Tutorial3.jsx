import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Tutorial3.scss'
import Header from '../../components/Header/Header'
import Back from '../../assets/Back.svg'
import Slide from '../../assets/tutorial3.png'
import Coupon from '../../assets/Coupon.svg'
import Ex4 from '../../assets/Ex4.svg'

const Tutorial3 = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="Tutorial_wrap">
        <Header title='Flow' bgColor='#62E59B'/>
        <div className="back" onClick={() => navigate(-1)}>
          <img src={Back} alt="뒤로가기" />
        </div>

        <div className="slide">
          <img src={Slide} alt="" />
        </div>

        <div className="title">
          <div className="coupon">
            <img src={Coupon} alt="" />
          </div>
          <p>쿠폰 지급</p>
        </div>

        <div className="example">
          <img src={Ex4} alt="" />
          <p>AI 추천 이용, 루틴 달성, 펀딩 참여 시 다양한 쿠폰이 지급돼요.</p>
          <div className="btn" onClick={() => navigate('/success')}>다음</div>
        </div>

      </div>
    </>
  )
}

export default Tutorial3