import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Logo from '../../assets/Logo.svg'
import './Select.scss'

export default function Select() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname, email, password } = location.state || {}; // ← GeneralSignup에서 전달됨

  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleSelect = async (type) => {
    setSelected(type)

    try {
      if (type === 'general') {
        if (!nickname || !email || !password) {
          alert("회원가입 정보가 누락되었습니다.");
          return;
        }

        // ✅ 일반 사용자 회원가입 API
        const res = await fetch("https://api.flowalpha.store/api/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            email,
            password,
            role: "GENERAL"
          }),
        });

        if (!res.ok) throw new Error("일반 사용자 회원가입 실패");
        const data = await res.json();
        console.log("✅ 일반 사용자 가입 성공:", data);

        // 성공 시 환영 페이지로 이동
        navigate("/Nicetomeetyou", { state: { username: data.nickname } });
      } else {
        // ✅ 매장 사용자 → 매장 회원가입 페이지
        navigate("/signup/store");
      }
    } catch (err) {
      console.error("API 요청 에러:", err);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header title='Flow' />
      <main style={{ padding: 16, opacity: mounted ? 1 : 0, transition: 'opacity 250ms ease' }}>
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
              <p>지역을 누비며 소비하고,<br />펀딩에 참여해보세요.</p>
            </div>
            <div
              className={`store_users ${selected === 'store' ? 'active' : ''}`}
              onClick={() => handleSelect('store')}
            >
              <h2>매장 사용자</h2>
              <p>우리 매장을 지역화폐<br />가맹점으로 등록하고, <br />더 많은 손님을 만나보세요.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
