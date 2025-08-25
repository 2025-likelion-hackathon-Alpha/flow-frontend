import React, { useState, useEffect } from 'react'
import { apiRequest } from '../../utils/api'
import Header from '../../components/Header/Header'
import Logo from '../../assets/WhiteLogo.svg'
import Reward from '../../components/Reward/Reward'
import Calendar from '../../components/Calendar/Calendar'
import Recommend from '../../components/Recommend/Recommend'
import Back from '../../assets/Back.svg'
import './Main.scss'

const Main = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [homeData, setHomeData] = useState(null)
  const [shopDetail, setShopDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await apiRequest("/api/home", { method: "GET" })
        setHomeData(data)
      } catch (err) {
        console.error("홈 API 에러:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const data = await apiRequest("/api/home/recommendShop", { method: "GET" })
        setShopDetail(data)
      } catch (err) {
        console.error("추천 매장 API 에러:", err)
      }
    }
    if (homeData) fetchShop()
  }, [homeData])

  if (loading) return <p>홈 화면 불러오는 중...</p>
  if (!homeData || !shopDetail) return <p>데이터 없음</p>

  const pointDays = shopDetail.checkDate.map(d => new Date(d).getDate())

  return (
    <div className="Main_wrap">
      <Header title="Flow" />
      <div className="options">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>

        <Reward user={homeData.nickname} points={homeData.point} />

        <Calendar
          year={new Date().getFullYear()}
          month={new Date().getMonth() + 1}
          today={new Date().getDate()}
          pointDays={pointDays}
        />

        <Recommend
          user={shopDetail.nickname}
          storeName={shopDetail.shopName}
          status={shopDetail.openStatus ? "영업중" : "영업종료"}
          description={shopDetail.recommendInfo}
          image={shopDetail.shopImage}
          onOpen={() => setIsOpen(true)}
        />
      </div>
    </div>
  )
}

export default Main
