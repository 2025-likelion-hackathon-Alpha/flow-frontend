import React from 'react'
import './Footer.scss'
import { NavLink } from "react-router-dom"

// 기본 아이콘
import HomeIcon from '../../assets/home_icon.svg?react'
import MapIcon from '../../assets/map_icon.svg?react'
import FundingIcon from '../../assets/funding_icon.svg?react'
import MypageIcon from '../../assets/mypage_icon.svg?react'

// Active 아이콘
import HomeIconActive from '../../assets/home_icon_active.svg?react'
import MapIconActive from '../../assets/map_icon_active.svg?react'
import FundingIconActive from '../../assets/funding_icon_active.svg?react'
import MypageIconActive from '../../assets/mypage_icon_active.svg?react'

export default function Footer() {
  return (
    <nav className="footer">
      {/* 홈 */}
      <NavLink to="/home" className="tab" end>
        {({ isActive }) => (
          <>
            {isActive ? <HomeIconActive className="icon" /> : <HomeIcon className="icon" />}
            <span className="label">홈</span>
          </>
        )}
      </NavLink>

      {/* 지도 */}
      <NavLink to="/map" className="tab">
        {({ isActive }) => (
          <>
            {isActive ? <MapIconActive className="icon" /> : <MapIcon className="icon" />}
            <span className="label">지도</span>
          </>
        )}
      </NavLink>

      {/* 펀딩 */}
      <NavLink to="/funding" className="tab">
        {({ isActive }) => (
          <>
            {isActive ? <FundingIconActive className="icon" /> : <FundingIcon className="icon" />}
            <span className="label">펀딩</span>
          </>
        )}
      </NavLink>

      {/* 내정보 */}
      <NavLink to="/mypage" className="tab">
        {({ isActive }) => (
          <>
            {isActive ? <MypageIconActive className="icon" /> : <MypageIcon className="icon" />}
            <span className="label">내정보</span>
          </>
        )}
      </NavLink>
    </nav>
  )
}
