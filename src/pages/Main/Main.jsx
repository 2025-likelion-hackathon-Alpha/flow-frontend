import React, { useState } from 'react'
import './Main.scss'
import Header from '../../components/Header/Header'
import Logo from '../../assets/WhiteLogo.svg'
import Reward from '../../components/Reward/Reward'
import Calendar from '../../components/Calendar/Calendar'
import Recommend from '../../components/Recommend/Recommend'
import Back from '../../assets/Back.svg'
import Cafe from '../../assets/Cafe.png'
import { useEffect } from "react"

const Main = () => {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
  }, [isOpen])

  // 로그인한 사용자 이름 (임시로 하드코딩, 나중에 props/context에서 가져오면 됨)
  const username = "아기사자"

  return (
    <div className="Main_wrap">
      <Header title="Flow" bgColor='#62E59B' />

      <div className="options">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>

        {/* 리워드 (페이지 이동만) */}
        <Reward user={username} points={1200} />

        {/* 캘린더 */}
        <Calendar
          year={2025}
          month={8}
          today={27}
          pointDays={[3, 12, 19, 27]}
        />

        {/* 추천 매장 (여기서 모달 열림) */}
        <Recommend onOpen={() => setIsOpen(true)} />
      </div>

      {/* AI 소비 추천 매장 모달 */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            {/* 헤더 */}
            <div className="modal-header">
              <button className="back-btn" onClick={() => setIsOpen(false)}>
                <img src={Back} alt="뒤로가기" />
              </button>
              <h2>AI 소비 추천 매장</h2>
            </div>

            {/* 본문 */}
            <div className="modal-content">
              {/* 달력 */}
              <Calendar
                year={2025}
                month={8}
                today={26}
                pointDays={[3, 12, 19, 26]}
              />

              {/* 추천 매장 */}
              <div className="recommend-detail">
                <h3>{username}님<br />오늘은 이곳 어때요?</h3>
                <div className="store-card">
                  <img src={Cafe} alt="선잠" />
                  <div className="info">
                    <h4>선잠 <span className="status">영업중</span></h4>
                    <p className="desc">숨겨진 공간의 아늑한 카페</p>
                  </div>
                </div>
              </div>

              {/* 매장 혜택 (초록색) */}
              <div className="coupon-tip">
                🎁 3회 방문 시 아메리카노 쿠폰 지급
              </div>

              {/* 매장 관련 정보 (회색) */}
              <div className="reasons">
                <div className="reason">☕ 비 오는 날엔 따뜻한 실내 공간이 인기!<br />
                  &nbsp;오늘 같은 날씨에 조용한 분위기의 공간이 많이 찾는 곳이에요.</div>
                <div className="reason">📍현재 위치에서 도보 3분 거리!<br />
                  &nbsp;이동 거리도 짧고 지금 바로 방문 가능해요.</div>
                <div className="reason">🧾 최근 2주간, 유사한 시간대에 3명이 다녀갔어요!<br />
                  &nbsp;다른 사용자들도 자주 찾는 루틴 장소예요.</div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <button className="map-btn">지도 보기</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Main
