import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StoreSignup.scss'
import Header from '../../components/Header/Header'
import Logo from '../../assets/Logo.svg'
import Back from '../../assets/Back.svg'
import Footer from '../../components/FooterBtn/FooterBtn'

const GOOGLE_API_KEY = "AIzaSyAO_GNqascex_uhT89R-YQYFIeddCN3I-I"  // ← 구글 API 키 넣기!

const StoreSignup = () => {
  const navigate = useNavigate()
  const [storeName, setStoreName] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [placeId, setPlaceId] = useState(null)  // ✅ 구글 place_id 상태 추가
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ 주소 → 위도, 경도 변환
  const fetchLatLngFromAddress = async (address) => {
    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      )
      const geoData = await geoRes.json()

      if (!geoData.results.length) throw new Error("주소 변환 실패")

      const { lat, lng } = geoData.results[0].geometry.location
      setLatitude(lat)
      setLongitude(lng)
      console.log("✅ 위도/경도:", lat, lng)
      return { lat, lng }
    } catch (err) {
      console.error("위도/경도 변환 에러:", err)
      return { lat: null, lng: null }
    }
  }

  // ✅ 주소 → Place ID 변환
  const fetchPlaceIdFromAddress = async (address) => {
    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      )
      const geoData = await geoRes.json()
      if (!geoData.results.length) throw new Error("주소 변환 실패")

      const pid = geoData.results[0].place_id
      setPlaceId(pid)
      console.log("✅ 변환된 Google Place ID:", pid)
      return pid
    } catch (err) {
      console.error("구글 Place ID 변환 에러:", err)
      return null
    }
  }

  // ✅ 회원가입 요청
  const handleSubmit = async () => {
    if (!storeName.trim()) return alert('매장 이름을 입력해 주세요.')
    if (!storeAddress.trim()) return alert('매장 주소를 입력해 주세요.')
    if (!userId.trim()) return alert('아이디(이메일)를 입력해 주세요.')
    if (!password) return alert('비밀번호를 입력해 주세요.')

    try {
      setLoading(true)

      // 주소 → 위도/경도 변환
      const { lat, lng } = await fetchLatLngFromAddress(storeAddress)
      // 주소 → Place ID 변환
      const pid = await fetchPlaceIdFromAddress(storeAddress)

      const res = await fetch('https://api.flowalpha.store/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: storeName,
          email: userId,
          password,
          role: "SHOP",
          location: storeAddress,
          googlePlaceId: pid,
          latitude: lat,
          longitude: lng,
          category: "ECT"
        }),
      })

      if (!res.ok) throw new Error('store signup failed')
      alert("회원가입 성공!")
      navigate('/login') // ✅ 가입 후 로그인 화면으로 이동
    } catch (e) {
      console.error(e)
      alert('가입에 실패했어요. 잠시 후 다시 시도해 주세요.')
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

      <div className="StoreSignup_wrap">
        <div className="logo"><img src={Logo} alt="" /></div>

        <div className="signup">
          {/* 매장 이름 */}
          <div className="storename">
            <label>매장 이름</label>
            <div className="input_wrap">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="매장 확인을 위해 매장 명을 등록해 주세요."
                maxLength={10}
              />
              <span className="char-count">{storeName.length}/10</span>
            </div>
          </div>

          {/* 매장 위치 */}
          <div className="id">
            <label>매장 위치</label>
            <div className="input_wrap">
              <input
                type="text"
                value={storeAddress}
                placeholder="매장 주소를 입력해 주세요."
                readOnly
                onClick={() => {
                  new window.daum.Postcode({
                    oncomplete: function (data) {
                      const addr = data.userSelectedType === 'R'
                        ? data.roadAddress
                        : data.jibunAddress
                      setStoreAddress(addr)
                      fetchPlaceIdFromAddress(addr)  // ✅ 주소 선택 시 자동 변환
                    }
                  }).open()
                }}
              />
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
        <div className="goto-login">
          <button onClick={() => navigate('/login')} className="btn secondary">
            로그인 화면으로 가기
          </button>
        </div>
        <Footer label={loading ? '처리 중...' : '다음'} onClick={handleSubmit} disabled={loading} />
      </div>
    </>
  )
}

export default StoreSignup
