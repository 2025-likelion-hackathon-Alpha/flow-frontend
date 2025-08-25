import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Logo from '../../assets/Logo.svg'
import './Login.scss'
import Footer from '../../components/FooterBtn/FooterBtn'

const Login = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!userId.trim()) return alert('이메일을 입력해 주세요.')
    if (!password.trim()) return alert('비밀번호를 입력해 주세요.')

    try {
      setLoading(true)
      const res = await fetch('https://api.flowalpha.store/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userId,
          password
        }),
      })

      const data = await res.json()
      console.log('응답 상태:', res.status, data)

      if (!res.ok) {
        return alert(data.message || '로그인에 실패했어요.')
      }

      // ✅ 토큰 저장 (tokens는 문자열임)
      localStorage.setItem("accessToken", data.token)

      // userId 저장
      sessionStorage.setItem('userId', data.userId)

      // 성공 응답 처리
      alert('로그인 성공!')
      console.log('로그인 성공 전체 데이터:', data)   // 🔍 응답 구조 확인

      // ✅ 토큰 확인
      if (data.token) {
        console.log("토큰 값:", data.tokens)

        // 문자열인 경우
        if (typeof data.token === "string") {
          localStorage.setItem("accessToken", data.token)
        }

        // 객체 안에 accessToken이 있는 경우
        else if (data.token.accessToken) {
          localStorage.setItem("accessToken", data.token.accessToken)
        }
      } else {
        console.warn("⚠️ 응답에 tokens 값이 없음!")
      }


      if (data.role === 'GENERAL') {
        navigate('/Nicetomeetyou')
      } else if (data.role === 'SHOP') {
        navigate('/store')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header title='Flow' />
      <div className="Login_wrap">
        <div className="logo">
          <img src={Logo} alt="" />
          <p>지역을 움직이는 소비의 리듬</p>
        </div>

        <div className="login">
          {/* 아이디 */}
          <div className="id">
            <label>아이디</label>
            <div className="input_wrap">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="email"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="password">
            <label>비밀번호</label>
            <div className="input_wrap">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
          </div>
        </div>

        <Footer
          label={loading ? '처리 중...' : '로그인'}
          onClick={handleLogin}
          disabled={loading}
        />
      </div>
    </>
  )
}

export default Login
