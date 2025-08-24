import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FooterBtn.scss'

export default function Footer({
  label = '다음',
  to,                 // 이동 경로 (선택)
  onClick,            // 클릭 핸들러 (선택)
  disabled = false,
  type = 'button',    // 폼 안에서 submit 쓰면 'submit'
  className = '',
}) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (disabled) return
    if (onClick) onClick(e)      // 1) 화면별 액션
    if (to) navigate(to)         // 2) 경로 이동
  }

  return (
    <div className={`Footer_wrap ${className}`}>
      <button
        type={type}
        className="nextbtn"
        disabled={disabled}
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  )
}
