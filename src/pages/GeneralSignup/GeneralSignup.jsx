import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './GeneralSignup.scss'
import Header from '../../components/Header/Header'
import Logo from '../../assets/Logo.svg'
import Back from '../../assets/Back.svg'
import Footer from '../../components/FooterBtn/FooterBtn'

const isEmail = (v) => /\S+@\S+\.\S+/.test(v)

const GeneralSignup = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!nickname.trim()) return alert('닉네임을 입력해 주세요.')
    if (!isEmail(userId)) return alert('올바른 이메일을 입력해 주세요.')
    if (!password) return alert('비밀번호를 입력해 주세요.')

    try {
      setLoading(true)
      const res = await fetch('http://54.180.244.106:8080/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          email: userId,
          password,
          role: "GENERAL",
          location: null,
          latitude: null,
          longitude: null,
          category: null
        }),
      })
      if (!res.ok) throw new Error('signup failed')
      navigate('/login')
    } catch (e) {
      alert('회원가입 실패. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header title='Flow' />
      <div className="back" onClick={() => navigate(-1)}>
        <img src={Back} alt="뒤로가기" />
      </div>

      <div className="GeneralSignup_wrap">
        <div className="logo"><img src={Logo} alt="" /></div>

        <div className="signup">
          {/* 닉네임 */}
          <div className="nickname">
            <label>닉네임</label>
            <div className="input_wrap">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="사용할 닉네임을 입력해 주세요."
                maxLength={10}
              />
              <span className="char-count">{nickname.length}/10</span>
            </div>
          </div>

          {/* 아이디 */}
          <div className="id">
            <label>아이디</label>
            <div className="input_wrap">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="이메일을 입력해 주세요."
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
                placeholder="사용할 비밀번호를 입력해 주세요."
                maxLength={20}
              />
            </div>
          </div>
        </div>

        <div className="next">닉네임과 비밀번호는 마이페이지에서 수정할 수 있어요.</div>
        <Footer label={loading ? '처리 중...' : '다음'} onClick={handleSubmit} disabled={loading} />
      </div>
    </>
  )
}

export default GeneralSignup
