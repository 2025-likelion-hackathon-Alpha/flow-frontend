import React, { useState, useEffect } from "react";
import "./Coupon.scss";
import Previous from "../../assets/previous_black.svg";
import Header from '../../components/Header/Header';
import { useNavigate } from "react-router-dom";
import DelImg from '../../assets/del_icon.svg';
import couponimg from '../../assets/couponimg.jpg';

const CouponPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // ✅ 로그인 시 저장된 userId 가져오기
  const userId = localStorage.getItem("userId");

  // ✅ 쿠폰 리스트 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchCoupons = async () => {
      try {
        const res = await fetch(
          `https://api.flowalpha.store/api/user/${userId}/userMypage/coupon`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("쿠폰 리스트 불러오기 실패");
        const data = await res.json();

        // UI 표시용 변환
        const mapped = data.content.map((c) => ({
          id: c.receiveCouponId,
          type: c.type,
          used: c.used,
          store: c.visit ? `매장ID ${c.visit.shopInfo_id}` : "리워드 쿠폰",
          name: c.reward ? `Reward 쿠폰 (${c.reward.rewardCoupon_id})` : "방문 쿠폰",
          img: couponimg, // 기본 이미지 (백엔드에서 이미지 주면 교체)
        }));

        setCoupons(mapped);
      } catch (err) {
        console.error("❌ 쿠폰 API 에러:", err);
      }
    };

    fetchCoupons();
  }, [userId]);

  // ✅ 쿠폰 사용 처리
  const handleUseCoupon = async () => {
    if (!selected) {
      alert("쿠폰을 선택해주세요.");
      return;
    }

    try {
      const res = await fetch(
        `https://api.flowalpha.store/api/user/${userId}/mypage/coupons/${selected}/use`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ used: true }),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("쿠폰 사용 실패");
      const result = await res.json();

      console.log("✅ 쿠폰 사용 성공:", result);
      alert("쿠폰이 사용 처리되었습니다!");

      // UI에서 해당 쿠폰을 used=true로 업데이트
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === selected ? { ...c, used: true } : c
        )
      );
      setShowModal(false);
      setSelected(null);
    } catch (err) {
      console.error("❌ 쿠폰 사용 에러:", err);
      alert("쿠폰 사용 중 오류가 발생했습니다.");
    }
  };

  const selectedCoupon = coupons.find((c) => c.id === selected);

  return (
    <div className="coupon-page">
      <Header />
      <header className="header">
        <button className="back-btn" onClick={() => navigate("/mypage")}>
          <img src={Previous} alt="이전" />
        </button>
        <h2>쿠폰함</h2>
      </header>

      <div className="greeting">
        <h3>{userId ? `${userId}번 유저` : "유저"} 님</h3>
        <p>지금까지 얻은 쿠폰을 사용해 보세요.</p>
      </div>

      <ul className="coupon-list">
        {coupons.map((coupon) => (
          <li
            key={coupon.id}
            className={`coupon-item ${selected === coupon.id ? "selected" : ""} ${coupon.used ? "used" : ""}`}
            onClick={() => !coupon.used && setSelected(coupon.id)}
          >
            <img src={coupon.img} alt={coupon.name} className="coupon-img" />
            <div>
              <p className="coupon-name">{coupon.name}</p>
              <p className="coupon-store">{coupon.store}</p>
              {coupon.used && <span className="used-label">사용완료</span>}
            </div>
          </li>
        ))}
      </ul>

      <button className="use-btn" onClick={() => setShowModal(true)} disabled={!selected}>
        사용하기
      </button>

      {showModal && selectedCoupon && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <img src={DelImg} alt="취소" />
            </button>
            <img src={selectedCoupon.img} alt={selectedCoupon.name} className="modal-img" />
            <h3>{selectedCoupon.name}</h3>
            <p>{selectedCoupon.store}</p>
            <p className="modal-desc">매장에 해당 화면을 보여주세요!</p>
            <button className="confirm-btn" onClick={handleUseCoupon}>
              사용 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponPage;

