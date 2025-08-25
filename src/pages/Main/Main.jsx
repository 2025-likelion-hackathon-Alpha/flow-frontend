import React, { useState, useEffect } from 'react'
import './Main.scss'
import Header from '../../components/Header/Header'
import Logo from '../../assets/WhiteLogo.svg'
import Reward from '../../components/Reward/Reward'
import Calendar from '../../components/Calendar/Calendar'
import Recommend from '../../components/Recommend/Recommend'
import Back from '../../assets/Back.svg'

const Main = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [homeData, setHomeData] = useState(null)       // /api/home
  const [shopDetail, setShopDetail] = useState(null)   // /api/home/recommendShop
  const [loading, setLoading] = useState(true)

  // 처음 홈 데이터 불러오기
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch("/api/home")
        if (!res.ok) throw new Error("홈 데이터 실패")
        const data = await res.json()
        setHomeData(data)

        // 추천 매장 상세 데이터 호출
        const detailRes = await fetch(`/api/home/recommendShop?recommendShopId=${data.recommendShopId}`)
        if (!detailRes.ok) throw new Error("추천 매장 실패")
        const detailData = await detailRes.json()
        setShopDetail(detailData)
      } catch (e) {
        console.error(e)
        alert("홈 데이터를 불러오지 못했어요 😢")
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  if (loading) return <p>홈 화면 불러오는 중...</p>
  if (!homeData || !shopDetail) return <p>데이터 없음</p>

  // checkDate → 달력에 쓸 일(day)만 추출
  const pointDays = shopDetail.checkDate.map(d => new Date(d).getDate())

  return (
    <div className="Main_wrap">
      <Header title="Flow" />

      <div className="options">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>

        {/* 리워드 */}
        <Reward user={homeData.nickname} points={homeData.point} />

        {/* 캘린더 */}
        <Calendar
          year={new Date().getFullYear()}
          month={new Date().getMonth() + 1}
          today={new Date().getDate()}
          pointDays={pointDays}
        />

        {/* 추천 매장 카드 */}
        <Recommend
          user={shopDetail.nickname}
          storeName={shopDetail.shopName}
          status={shopDetail.openStatus ? "영업중" : "영업종료"}
          description={shopDetail.recommendInfo}
          image={shopDetail.shopImage}
          onOpen={() => setIsOpen(true)}
        />
      </div>

      {/* 추천 매장 모달 */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="back-btn" onClick={() => setIsOpen(false)}>
                <img src={Back} alt="뒤로가기" />
              </button>
              <h2>AI 소비 추천 매장</h2>
            </div>

            <div className="modal-content">
              {/* 달력 */}
              <Calendar
                year={new Date().getFullYear()}
                month={new Date().getMonth() + 1}
                today={new Date().getDate()}
                pointDays={pointDays}
              />

              {/* 추천 매장 */}
              <div className="recommend-detail">
                <h3>{shopDetail.nickname}님<br />오늘은 이곳 어때요?</h3>
                <div className="store-card">
                  <img src={shopDetail.shopImage} alt={shopDetail.shopName} />
                  <div className="info">
                    <h4>
                      {shopDetail.shopName}{" "}
                      <span className="status">
                        {shopDetail.openStatus ? "영업중" : "영업종료"}
                      </span>
                    </h4>
                    <p className="desc">{shopDetail.recommendInfo}</p>
                  </div>
                </div>
              </div>

              {/* 혜택 */}
              {shopDetail.visitCount && shopDetail.couponType && (
                <div className="coupon-tip">
                  🎁 {shopDetail.visitCount}회 방문 시 {shopDetail.couponType} 쿠폰 지급
                </div>
              )}

              {/* 추천 코멘트 */}
              <div className="reasons">
                {shopDetail.comments.map((c, i) => (
                  <div className="reason" key={i}>{c.comment}</div>
                ))}
              </div>
            </div>

            <button className="map-btn">지도 보기</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Main
