import React, { useState, useEffect } from 'react';
import './Mypage01.scss';
import Header from '../../components/Header/Header';
import Logo from "../../assets/flow_logo.svg";
import { useNavigate } from 'react-router-dom';

export default function Mypage01() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId")
    fetch(`https://api.flowalpha.store/api/user/${userId}/userMypage`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("유저 마이페이지 API 에러:", err))
  }, [])



  if (!userData) return <div>로딩 중...</div>;

  const { nickname, profile } = userData;

  return (
    <div className="mypage-wrap">
      <Header bgColor="#62E59B" />
      <div className="mypage-hero">
        <div className="greeting">
          <span className="nick">{nickname}</span> 님이 만든 변화,
          <img src={Logo} alt="Flow 로고" className="brand-logo" />
        </div>
      </div>

      <div className='backgroud_design'>
        <div className="mypage-content">
          <div className="cards-wrapper">
            <section className="mypage-cards">
              <div className="card"><div className="card-title">지역을 위한 소비</div><div className="value"><strong>{profile.localConsumption}</strong><span>번</span></div></div>
              <div className="card"><div className="card-title">함께한 펀딩</div><div className="value"><strong>{profile.funding}</strong><span>번</span></div></div>
              <div className="card"><div className="card-title">심은 씨앗</div><div className="value"><strong>{profile.seeds.toLocaleString()}</strong><span>씨앗</span></div></div>
              <div className="card"><div className="card-title">포인트</div><div className="value"><strong>{profile.point.toLocaleString()}</strong><span>P</span></div></div>
            </section>
          </div>

          <div className="actions-box">
            <section className="mypage-actions">
              <button className="btn secondary" onClick={() => navigate('/coupon')}>쿠폰함</button>
              <button className="btn text danger" onClick={() => navigate("/")} >로그아웃</button>
            </section>
          </div>
        </div>
      </div>
      <div className="bottom-space" />
    </div>
  );
}
