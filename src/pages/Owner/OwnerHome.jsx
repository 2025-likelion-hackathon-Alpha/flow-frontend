import React, { useState, useEffect } from "react";
import "./OwnerHome.scss";
import Header from "../../components/Header/Header";
import Logo from "../../assets/flow_logo.svg";
import { useNavigate } from "react-router-dom";

export default function OwnerHome() {
    const [shopData, setShopData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                // 로그인 시 저장한 shopInfoId 불러오기
                const shopInfoId = localStorage.getItem("shopInfoId");
                if (!shopInfoId) {
                    console.error("❌ shopInfoId 없음. 로그인 후 접근해주세요.");
                    return;
                }

                const res = await fetch(
                    `https://api.flowalpha.store/api/shopMypage/summaryShopInfo?shopInfoId=${shopInfoId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!res.ok) throw new Error("매장 요약 불러오기 실패");

                const data = await res.json();
                setShopData(data);
            } catch (err) {
                console.error("매장 데이터 불러오기 에러:", err);
            }
        };

        fetchShopData();
    }, []);

    if (!shopData) return <div>로딩 중...</div>;

    return (
        <div className="owner-wrap">
            <Header bgColor="#62E59B" />
            <div className="owner-hero">
                <div className="greeting">
                    <span className="nick">{shopData.shopName || "매장명"}</span> 님이 만든 변화,
                    <img src={Logo} alt="Flow 로고" className="brand-logo" />
                </div>
            </div>

            <div className="backgroud_design">
                <div className="owner-content">
                    <div className="cards-wrapper">
                        <section className="owner-cards">
                            <div className="card">
                                <p className="title">이번 달 Flow 고객 결제 금액</p>
                                <p className="value right">
                                    {shopData.monthPayment.toLocaleString()}
                                    <span className="unit">원</span>
                                </p>
                            </div>

                            <div className="card">
                                <p className="title">Flow와 함께하는 성장 파트너십 비용</p>
                                <p className="value right">
                                    {shopData.partnershipCost.toLocaleString()}
                                    <span className="unit">원</span>
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="actions-box">
                        <section className="owner-actions">
                            <button className="btn secondary">매장 정보 변경 (수정 예정)</button>
                            <button
                                className="btn secondary"
                                onClick={() =>
                                    navigate("/owner/payment", {
                                        state: { shopInfoId: shopData.shopInfoId },
                                    })
                                }
                            >
                                결제 인증하기
                            </button>
                            <button
                                className="btn secondary"
                                onClick={() => navigate("/owner/coupon")}
                            >
                                쿠폰 등록하기
                            </button>
                            <button
                                className="btn text danger"
                                onClick={() => navigate("/")}
                            >
                                로그아웃
                            </button>
                        </section>
                    </div>
                </div>
            </div>
            <div className="bottom-space" />
        </div>
    );
}
