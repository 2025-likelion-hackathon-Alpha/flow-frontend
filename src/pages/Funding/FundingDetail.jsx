import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Previous from "../../assets/previous_black.svg";
import "./FundingDetail.scss";
import Close from '../../assets/del_icon.svg';
import Header from "../../components/Header/Header";
import CoinImg from '../../assets/coin.png';

export default function FundingDetail() {
  const { id } = useParams(); // fundingId
  const navigate = useNavigate();

  // 상태
  const [funding, setFunding] = useState(null);       // 펀딩 상세
  const [fundingSeeds, setFundingSeeds] = useState(); // 참여 팝업 데이터
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(null); // "normal" | "reward"
  const [inputAmount, setInputAmount] = useState("");

  // 펀딩 상세 불러오기
  useEffect(() => {
    const fetchFundingDetail = async () => {
      try {
        const res = await fetch(
          `http://54.180.244.106:8080/api/funding/detail?fundingId=${id}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("펀딩 상세 불러오기 실패");
        const data = await res.json();
        setFunding(data);
      } catch (err) {
        console.error("펀딩 상세 API 에러:", err);
      }
    };
    fetchFundingDetail();
  }, [id]);

  if (!funding) return <p>로딩중...</p>;

  // 진행률
  const percent = Math.floor((funding.nowSeed / funding.goalSeed) * 100);

  // 남은 일수 계산
  const getDeadlineDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
  };
  const daysLeft = getDeadlineDays(funding.endDate);

  // 참여 팝업 열기
  const openFundingModal = async () => {
    try {
      const res = await fetch(
        `http://54.180.244.106:8080/api/funding/seeds?fundingId=${funding.fundingId}`,
        { method: "GET", credentials: "include" }
      );
      if (!res.ok) throw new Error("보유 씨앗 불러오기 실패");
      const data = await res.json();
      setFundingSeeds(data);
      setShowFundingModal(true);
    } catch (err) {
      console.error("씨앗 정보 API 에러:", err);
    }
  };

  //펀딩 참여 API
  const handleConfirmFunding = async () => {
    const amount = Number(inputAmount);
    if (!amount || amount <= 0) {
      alert("펀딩할 씨앗 수를 입력하세요!");
      return;
    }

    try {
      const res = await fetch("http://54.180.244.106:8080/api/funding/giveSeeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fundingId: funding.fundingId,
          fundedSeeds: amount,
        }),
      });

      if (!res.ok) throw new Error("펀딩 참여 실패");
      const data = await res.json();
      console.log("펀딩 완료:", data);

      // 프론트 상태 갱신
      setFunding((prev) => ({
        ...prev,
        nowSeed: prev.nowSeed + amount,
        participants: prev.participants + 1,
      }));

      setShowFundingModal(false);

      // 조건 분기 (프론트에서만 처리)
      if (amount >= 300) {
        setShowCompleteModal("reward"); // 30포인트 적립 모달
      } else {
        setShowCompleteModal("normal"); // 일반 완료 모달
      }

      setInputAmount("");
    } catch (err) {
      console.error("❌ 펀딩 참여 API 에러:", err);
      alert("펀딩 참여 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="funding-detail">
      <Header />
      <div className="header-wrap">
        <button className="back-btn" onClick={() => navigate("/funding")}>
          <img src={Previous} alt="이전" />
        </button>
        <p className="header-title">펀딩 세부 내용</p>
      </div>

      {/* 메인 이미지 */}
      <div className="funding-image">
        <img src={funding.image} alt={funding.title} />
      </div>

      {/* 정보 */}
      <div className="funding-info">
        <h2>{funding.title}</h2>
        <p className="organization">{funding.organizer}</p>

        <div className="funding-progress">
          <div className="progress-text">
            <span className="current">{funding.nowSeed.toLocaleString()} 씨앗</span>
            <span className="goal"> / {funding.goalSeed.toLocaleString()} 씨앗</span>
            <span className="percent">{percent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="extra-info">
            <span>{funding.participants.toLocaleString()}명 참여</span>
            <span>{daysLeft}일 뒤 마감</span>
          </div>
        </div>
      </div>

      {/* 설명 */}
      <div className="funding-description">
        <h3>펀딩 소개</h3>
        <p>{funding.introduction}</p>
      </div>

      {/* 버튼 */}
      <div className="funding-action">
        <button className="funding-btn" onClick={openFundingModal}>
          펀딩 하기
        </button>
      </div>

      {/* 펀딩 모달 */}
      {showFundingModal && fundingSeeds && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowFundingModal(false)}>
              <img src={Close} alt="닫기" />
            </button>
            <h3 className="modal-title">{fundingSeeds.nickname}님의 보유 씨앗</h3>
            <p className="modal-seeds">{fundingSeeds.seeds.toLocaleString()}</p>
            <input
              type="number"
              placeholder="펀딩에 사용할 씨앗 개수를 입력하세요."
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="modal-input"
            />
            <button className="modal-confirm-btn" onClick={handleConfirmFunding}>
              완료
            </button>
          </div>
        </div>
      )}

      {/* 완료 모달 */}
      {showCompleteModal === "normal" && (
        <div className="modal-overlay">
          <div className="modal complete-modal">
            <h3>펀딩 참여 완료!</h3>
            <button onClick={() => setShowCompleteModal(false)}>확인</button>
          </div>
        </div>
      )}

      {/* 리워드 모달 */}
      {showCompleteModal === "reward" && (
        <div className="modal-overlay">
          <div className="modal complete-modal">
            <div className="modal-bg">
              <img src={CoinImg} alt="coin background" />
            </div>
            <h3>펀딩 참여 리워드</h3>
            <p><strong>30 포인트</strong> 적립되었습니다!</p>
            <button onClick={() => setShowCompleteModal(false)}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
