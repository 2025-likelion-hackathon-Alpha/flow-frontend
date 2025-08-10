import React, { useEffect, useRef, useState } from 'react'
import CoverImg from '../../assets/Cover.png'
import { useNavigate } from 'react-router-dom'

const FADE = 250;   // 애니메이션 시간
const WAIT = 1750;  // 1.75초 이후 화면 이동

export default function Cover() {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const once = useRef(false)

  const goNext = () => {
    if (once.current) return
    once.current = true
    setLeaving(true)                      // 페이드아웃 시작
    setTimeout(() => navigate('/select'), FADE) // FADE 후 라우팅
  }

  useEffect(() => {
    const t = setTimeout(goNext, WAIT)    // 자동 이동
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={goNext}
      style={{
        cursor: 'pointer',
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE}ms ease` // 투명도 변화
      }}
    >
      <img src={CoverImg} alt="cover" style={{ width: '100%', display: 'block' }} />
    </div>
  )
}
