import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Logo from '../../assets/Logo.svg'
import './Select.scss'
import { useNavigate } from 'react-router-dom'

export default function Select() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // 클릭 시 처리
  const handleSelect = (type) => {
    setSelected(type) // 색 변경
    setTimeout(() => {
      navigate(type === 'general' ? 'https://api.flowalpha.store/api/signup/general' : '/signup/store')
    }, 500) // 0.5초 뒤 이동
  }

  return (
    <>
      <Header title='Flow' />
      <main
        style={{
          padding: 16,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 250ms ease'
        }}
      >
        <div className="Select_wrap">
          <div className="logo">
            <img src={Logo} alt="" />
            <p>지역을 움직이는 소비의 리듬</p>
          </div>

          <div className="type">
            <p>사용자 유형을 선택해 주세요.</p>
          </div>

          <div className="select">
            <div
              className={`general_users ${selected === 'general' ? 'active' : ''}`}
              onClick={() => handleSelect('general')}
            >
              <h2>일반 사용자</h2>
              <p>
                지역을 누비며 소비하고,<br />
                펀딩에 참여해보세요.
              </p>
            </div>
            <div
              className={`store_users ${selected === 'store' ? 'active' : ''}`}
              onClick={() => handleSelect('store')}
            >
              <h2>매장 사용자</h2>
              <p>
                우리 매장을 지역화폐<br />
                가맹점으로 등록하고, <br />
                더 많은 손님을 만나보세요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 