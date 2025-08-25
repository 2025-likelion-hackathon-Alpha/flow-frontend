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
      const res = await fetch('http://54.180.244.106:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userId,
          password
        }),
      })

      const data = await res.json()
      console.log('응답 상태:', res.status)
      console.log('응답 데이터:', data)

      if (!res.ok) {
        // 실패 응답 처리
        return alert(data.message || '로그인에 실패했어요.')
      }

      // 성공 응답 처리
      alert('로그인 성공!')
      console.log('로그인 성공:', data)

      // userId 저장
      sessionStorage.setItem('userId', data.userId)

      // role 값에 따라 라우팅
      if (data.role === 'GENERAL') {
        navigate('/Nicetomeetyou')       // 일반 사용자 홈
      } else if (data.role === 'SHOP') {
        navigate('/store')      // 매장 사용자 홈
      } else {
        navigate('/')           // 기본값
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
      <Header title='Flow' bgColor='#62E59B'/>
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
                maxLength={30}
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
                maxLength={20}
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
