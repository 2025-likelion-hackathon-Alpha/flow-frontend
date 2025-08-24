import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Tutorial2.scss'
import Header from '../../components/Header/Header'
import Back from '../../assets/Back.svg'
import Slide from '../../assets/tutorial2.png'
import Point from '../../assets/Point.svg'
import Ex2 from '../../assets/Ex2.svg'
import Ex3 from '../../assets/Ex3.svg'

const Tutorial2 = () => {
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
          <div className="point">
            <img src={Point} alt="" />
          </div>
          <p>포인트 & 씨앗</p>
        </div>

        <div className="example">
          <div className="ex2">
            <img src={Ex2} alt="" />
            <p>지역화폐 결제 금액의 2%가<br />
              펀딩을 위한 씨앗으로 적립돼요!</p>
          </div>
          <div className="ex3">
            <img src={Ex3} alt="" />
            <p>플로의 다양한 혜택으로 포인트를 적립해<br />
              지역 매장의 쿠폰으로 교환하세요!</p>
          </div>
          <div className="btn" onClick={() => navigate('/tutorial3')}>다음</div>
        </div>

      </div>
    </>
  )
}

export default Tutorial2