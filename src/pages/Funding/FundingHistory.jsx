import React, { useState, useEffect } from "react";
import './FundingHistory.scss';
import Header from '../../components/Header/Header';
import Previous from '../../assets/previous_btn.svg';
import { useNavigate } from "react-router-dom";

export default function FundingHistory() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("progress");
    const [fundingList, setFundingList] = useState([]);

    // ✅ API 호출
    useEffect(() => {
        const fetchMyFunding = async () => {
            try {
                const res = await fetch("https://api.flowalpha.store/api/funding/myfunding", {
                    method: "GET",
                    credentials: "include", // 세션/쿠키 필요 시
                });
                if (!res.ok) throw new Error("펀딩 내역 불러오기 실패");
                const data = await res.json();
                setFundingList(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("❌ 펀딩 내역 API 에러:", err);
            }
        };

        fetchMyFunding();
    }, []);

    // ✅ 진행중 / 마감 구분
    const filteredList =
        tab === "progress"
            ? fundingList.filter((f) => f.status === "INPROGRESS")
            : fundingList.filter((f) => f.status === "FINISHED");

    return (
        <div className="funding-history">
            <Header bgColor="#62E59B" />
            <div className="header-wrap">
                <button onClick={() => navigate('/funding')}>
                    <img src={Previous} alt="이전 버튼" />
                </button>
                <p>나의 펀딩 내역</p>
            </div>

            {/* 탭 버튼 */}
            <div className="tabs">
                <button
                    className={`tab ${tab === "progress" ? "active" : ""}`}
                    onClick={() => setTab("progress")}
                >
                    진행중
                </button>
                <button
                    className={`tab ${tab === "done" ? "active" : ""}`}
                    onClick={() => setTab("done")}
                >
                    마감
                </button>
            </div>

            {/* 카드 리스트 */}
            <div className="history-list">
                {filteredList.length === 0 ? (
                    <p className="empty">참여한 펀딩이 없습니다.</p>
                ) : (
                    filteredList.map((item) => {
                        const percent = Math.min(
                            100,
                            Math.floor((item.nowSeed / item.goalSeed) * 100)
                        );
                        // 남은 일수 계산
                        const getDeadlineDays = (endDate) => {
                            const today = new Date();
                            const end = new Date(endDate);
                            return Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
                        };
                        const daysLeft = getDeadlineDays(item.endDate);

                        return (
                            <div key={item.fundingId} className="history-card">
                                <img
                                    src={item.image || "/default_funding.png"}
                                    alt={item.title}
                                    className="card-img"
                                />
                                <div className="card-content">
                                    <h3 className="title">{item.title}</h3>
                                    <p className="org">{item.organizer}</p>
                                    <p className="total">
                                        <strong>{item.goalSeed.toLocaleString()}</strong> 씨앗{" "}
                                        <span className="my-seed">{item.mySeed} 씨앗 펀딩</span>
                                    </p>
                                    <div className="progress-bar">
                                        <div
                                            className="progress"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-info">
                                        <span className="percent">{percent}%</span>
                                        {tab === "progress" && (
                                            <span className="deadline">{daysLeft}일 뒤 마감</span>
                                        )}
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
