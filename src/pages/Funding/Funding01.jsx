import React, { useState, useEffect } from 'react';
import './Funding01.scss';
import Header from '../../components/Header/Header';
import Next from '../../assets/next_icon.svg';
import Seed from '../../assets/funding_img2.svg';
import { useNavigate } from 'react-router-dom';
import { useSeeds } from '../../context/SeedContext';

export default function FundingPage() {
    const navigate = useNavigate();
    const { seeds } = useSeeds();

    const [nickname, setNickname] = useState("");
    const [fundingList, setFundingList] = useState([]);
    const [loading, setLoading] = useState(true);

    //  API 호출
    useEffect(() => {
        const fetchFunding = async () => {
            try {
                const res = await fetch("https://api.flowalpha.store/api/funding", {
                    method: "GET",
                    credentials: "include", // 로그인 세션/쿠키 필요 시
                });

                const data = await res.json().catch(() => null);

                console.log("펀딩 API 상태:", res.status);
                console.log("펀딩 API 응답:", data);

                if (!res.ok || !data) {
                    throw new Error(`펀딩 데이터 불러오기 실패 (status: ${res.status})`);
                }

                setNickname(data.nickname || "");
                setFundingList(data.fundingList || []);
            } catch (err) {
                console.error("❌ 펀딩 API 에러:", err);
                setFundingList([]); // 에러 시 빈 배열 유지
            } finally {
                setLoading(false);
            }
        };

        fetchFunding();
    }, []);

    // 날짜 차이 계산
    const getDeadlineDays = (endDate) => {
        if (!endDate) return 0;
        const today = new Date();
        const end = new Date(endDate);
        return Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
    };

    return (
        <div className='funding-wrap'>
            <Header bgColor="#62E59B" />

            <div className='section01'>
                <div className="funding-page">
                    {/* 씨앗 보유량 카드 */}
                    <div className="seed-card">
                        <div className="seed-info">
                            <p className="seed-label">{nickname}님의 보유 씨앗</p>
                            <p className="seed-count">
                                <span className="count">{seeds.toLocaleString()}</span>
                                <span className="unit"> 씨앗</span>
                            </p>
                        </div>
                        <button
                            className="my-funding-btn"
                            onClick={() => navigate("/funding-history")}
                        >
                            나의 펀딩 내역
                        </button>
                        <img src={Seed} alt="새싹 이미지" className='funding-img' />
                    </div>

                    {/* 안내 문구 */}
                    <p className="seed-guide">
                        당신의 작은 소비가 지역을 바꿉니다. <br />
                        오늘, 어떤 변화에 씨앗을 심어볼까요?
                    </p>
                </div>
            </div>

            <div className='section02'>
                {/* 배너 */}
                <div className="promo-banner">
                    <p className="banner-text">여러분의 씨앗, <br />이렇게 자랐어요!</p>
                    <button className="banner-btn">
                        자세히 보기 <img src={Next} alt="" />
                    </button>
                </div>

                {/* 카테고리 탭 */}
                <div className="category-tabs">
                    <button className="tab active">전체</button>
                    <button className="tab">환경</button>
                    <button className="tab">아동청소년</button>
                    <button className="tab">노인복지</button>
                    <button className="tab">안전개선</button>
                </div>

                {/* 펀딩 카드 리스트 */}
                {loading ? (
                    <p>로딩 중...</p>
                ) : fundingList.length === 0 ? (
                    <p>펀딩 데이터가 없습니다.</p>
                ) : (
                    fundingList.map((funding) => {
                        const percent = Math.floor((funding.nowSeed / funding.goalSeed) * 100);
                        const deadline = getDeadlineDays(funding.endDate);
                        const deadlineClass = deadline <= 5 ? "deadline urgent" : "deadline";

                        return (
                            <div
                                key={funding.fundingId}
                                className="funding-card"
                                onClick={() => navigate(`/funding/${funding.fundingId}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={funding.image} alt={funding.title} className="funding-img" />
                                <div className="funding-content">
                                    <h3 className="funding-title">{funding.title}</h3>
                                    <p className="funding-org">{funding.organizer}</p>

                                    <p className="funding-progress">
                                        <span className="current">{funding.nowSeed.toLocaleString()}</span>
                                        <span className="unit"> 씨앗</span>
                                        <span className="total">/{funding.goalSeed.toLocaleString()}</span>
                                    </p>

                                    <div className="progress-wrapper">
                                        <div className="progress-bar">
                                            <div className="progress" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <div className="progress-text">
                                            <span className="percent">{percent}%</span>
                                            <span className={deadlineClass}>{deadline}일 뒤 마감</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
