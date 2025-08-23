import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./ShopDetail.scss";
import Previous from "../../assets/previous_black.svg";
import Gift_img from "../../assets/gift.png";
import Ring_img from "../../assets/ring.png";
import Del from "../../assets/del_icon.svg";
import MapImg from "../../assets/map_img.png"; // ✅ 고정 이미지

// ✅ 프론트 고정 데이터
const shopDetails = [
    {
        shop: {
            shopInfoId: 1,
            name: "놀랍",
            location: "서울특별시 성북구 동소문로15길 6 (동소문동6가, 미래하이츠) 2층",
            explanation: "감성적인 분위기의 디저트 카페",
        },
        images: [{ shopImageId: 101, imageUrl: MapImg }],
        rewardCoupons: [
            { rewardCouponId: 201, name: "아메리카노 쿠폰", amount: 3, condition: "3회 방문 시 지급" },
        ],
        benefitRequirements: [
            { pointReqId: 301, seedDetail: "리뷰 작성 시 씨앗 적립" },
        ],
    },
    {
        shop: {
            shopInfoId: 2,
            name: "꿈의숲약국",
            location: "서울특별시 성북구 돌곶이로 183 (장위동) 1층 꿈의숲약국",
            explanation: "지역 주민을 위한 친절한 약국",
        },
        images: [{ shopImageId: 102, imageUrl: MapImg }],
        rewardCoupons: [
            { rewardCouponId: 202, name: "비타민 음료 쿠폰", amount: 1, condition: "2회 방문 시 지급" },
        ],
        benefitRequirements: [
            { pointReqId: 302, seedDetail: "처방 조제 시 씨앗 적립" },
        ],
    },
    {
        shop: {
            shopInfoId: 3,
            name: "가마치통닭 정릉역점",
            location: "서울특별시 성북구 정릉로 272 (정릉동)",
            explanation: "바삭한 후라이드 치킨 전문점",
        },
        images: [{ shopImageId: 103, imageUrl: MapImg }],
        rewardCoupons: [
            { rewardCouponId: 203, name: "콜라 1.25L 쿠폰", amount: 1, condition: "5회 방문 시 지급" },
        ],
        benefitRequirements: [
            { pointReqId: 303, seedDetail: "치킨 주문 시 씨앗 적립" },
        ],
    },
    {
        shop: {
            shopInfoId: 4,
            name: "월곡튼튼정형외과의원",
            location: "서울특별시 성북구 화랑로 102 (하월곡동, 상상) 2층",
            explanation: "지역 주민 건강을 책임지는 정형외과",
        },
        images: [{ shopImageId: 104, imageUrl: MapImg }],
        rewardCoupons: [],
        benefitRequirements: [],
    },
    {
        shop: {
            shopInfoId: 5,
            name: "4번출구 텐텐하오",
            location: "서울특별시 성북구 숭인로 70-2 (길음동)",
            explanation: "중국 가정식을 즐길 수 있는 맛집",
        },
        images: [{ shopImageId: 105, imageUrl: MapImg }],
        rewardCoupons: [
            { rewardCouponId: 205, name: "탕수육 쿠폰", amount: 1, condition: "4회 방문 시 지급" },
        ],
        benefitRequirements: [
            { pointReqId: 305, seedDetail: "식사 시 씨앗 적립" },
        ],
    },
];

export default function ShopDetail() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [visitCounts, setVisitCounts] = useState({});
    const [showVisitPopup, setShowVisitPopup] = useState(null);
    const [showRewardPopup, setShowRewardPopup] = useState(false);
    const [showSeedPopup, setShowSeedPopup] = useState(false);

    // ✅ 프론트 데이터에서 shopId 찾아오기
    useEffect(() => {
        const found = shopDetails.find((s) => s.shop.shopInfoId === Number(shopId));
        setDetail(found);
    }, [shopId]);

    if (!detail) return <div>가게 정보를 불러오는 중...</div>;

    const { shop, images, rewardCoupons, benefitRequirements } = detail;
    const { name, location, explanation } = shop;

    // ✅ 스탬프 클릭
    const handleVisitClick = (coupon) => {
        const visited = (visitCounts[coupon.rewardCouponId] || 0) + 1;
        const remain = coupon.amount - visited;

        setVisitCounts((prev) => ({
            ...prev,
            [coupon.rewardCouponId]: Math.min(visited, coupon.amount),
        }));

        // 방문 팝업
        setShowVisitPopup({ visited, remain });

        if (visited === coupon.amount) {
            setShowRewardPopup(true);
        }
    };

    return (
        <div className="shop-detail-page">
            <Header />

            {/* 상단 가게 제목 영역 */}
            <div className="shop-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <img src={Previous} alt="이전" />
                </button>
                <h2>{name}</h2>
                <span className="status">영업중</span>
            </div>

            {/* 주소 */}
            <div className="shop-info">
                <p className="address">{location}</p>
            </div>

            {/* 이미지 영역 */}
            <div className="shop-images">
                {images.map((img) => (
                    <img key={img.shopImageId} src={img.imageUrl} alt={name} />
                ))}
            </div>

            {/* 가게 소개 */}
            {explanation && (
                <div className="shop-description">
                    <h3>가게 소개</h3>
                    <p>{explanation}</p>
                </div>
            )}

            {/* 리워드 쿠폰 */}
            {rewardCoupons.length > 0 && (
                <div className="coupon-section">
                    {rewardCoupons.map((coupon) => {
                        const visited = visitCounts[coupon.rewardCouponId] || 0;

                        return (
                            <div key={coupon.rewardCouponId} className="coupon-block">
                                <p className="coupon-title">
                                    {coupon.amount}회 방문 시 {coupon.name} 지급
                                </p>

                                <div className="stamp-list">
                                    {Array.from({ length: coupon.amount }).map((_, idx) => {
                                        const active = idx < visited;
                                        return (
                                            <div
                                                key={idx}
                                                className={`stamp ${active ? "active" : ""}`}
                                                onClick={() => handleVisitClick(coupon)}
                                            >
                                                {idx + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ 적립 조건 (본문 고정 표시) */}
            {benefitRequirements.length > 0 && (
                <div className="benefit-section">
                    <h3>적립 조건</h3>
                    <ul className="benefit-cards">
                        {benefitRequirements.map((req) => (
                            <li key={req.pointReqId} className="benefit-card">
                                {req.seedDetail}
                            </li>
                        ))}
                    </ul>

                    {/* ✅ 적립 조건 밑에 씨앗 받기 버튼 추가 */}
                    <button
                        className="seed-btn"
                        onClick={() => setShowSeedPopup(true)}
                    >
                        씨앗 받기
                    </button>
                </div>
            )}

            {/* 방문 확인 팝업 */}
            {showVisitPopup && (
                <div className="popup-overlay" onClick={() => setShowVisitPopup(null)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowVisitPopup(null)}>
                            <img src={Del} alt="닫기" />
                        </button>
                        <h3>방문 확인</h3>
                        <p>해당 매장에 {showVisitPopup.visited}번 방문했어요.</p>
                        <p>남은 방문 횟수 {showVisitPopup.remain}회</p>
                        <button
                            className="confirm-btn"
                            onClick={() => setShowVisitPopup(null)}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* 쿠폰 지급 팝업 */}
            {showRewardPopup && (
                <div className="popup-overlay" onClick={() => setShowRewardPopup(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowRewardPopup(false)}>
                            <img src={Del} alt="닫기" />
                        </button>
                        <img src={Gift_img} alt="gift" className="gift-img" />
                        <h3>쿠폰 지급 완료!</h3>
                        <p>쿠폰함에서 확인해 보세요.</p>
                        <button
                            className="confirm-btn"
                            onClick={() => {
                                setShowRewardPopup(false);
                                navigate("/coupon");
                            }}
                        >
                            쿠폰함으로 이동
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ 씨앗 받기 팝업 */}
            {showSeedPopup && (
                <div className="popup-overlay" onClick={() => setShowSeedPopup(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setShowSeedPopup(false)}>
                            <img src={Del} alt="닫기" />
                        </button>
                        <img src={Ring_img} alt="씨앗" className="seed-img" />
                        <h3>{name}</h3>
                        <p className="seed-title">씨앗 받기</p>

                        {/* ✅ JSON의 seedDetail 출력 */}
                        {benefitRequirements.map((req) => (
                            <p key={req.pointReqId} className="seed-desc">
                                적립 조건 : {req.seedDetail}
                            </p>
                        ))}

                        <p className="seed-sub">
                            매장 확인 후 씨앗이 적립됩니다. <br />
                            (펀딩페이지에서 보유 씨앗 확인 가능)
                        </p>
                        <button
                            className="confirm-btn"
                            onClick={() => setShowSeedPopup(false)}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
