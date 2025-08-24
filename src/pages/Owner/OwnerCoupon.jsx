import React, { useState } from "react";
import "./OwnerCoupon.scss";
import Previous from "../../assets/previous_btn.svg";
import Header from "../../components/Header/Header";
import { useLocation } from "react-router-dom";

export default function OwnerCoupon() {
    const location = useLocation();
    const shopInfoId = location.state?.shopInfoId;

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [image, setImage] = useState(null);

    // 파일 선택 시 상태에 저장
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // 등록하기
    const handleSubmit = async () => {
        if (!name || !amount || !image) {
            alert("모든 항목을 입력해주세요!");
            return;
        }
        if (!shopInfoId) {
            alert("매장 정보가 없습니다. 다시 로그인해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("amount", amount);
        formData.append("shopInfoId", shopInfoId);
        formData.append("image", image);

        try {
            const response = await fetch(
                "http://54.180.244.106:8080/api/shopMypage/addrewardCoupon",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

            if (!response.ok) {
                throw new Error("쿠폰 등록 실패");
            }

            const result = await response.json();
            console.log("쿠폰 등록 성공:", result);
            alert("쿠폰이 성공적으로 등록되었습니다!");

            // 입력값 초기화
            setName("");
            setAmount("");
            setImage(null);
        } catch (err) {
            console.error("쿠폰 등록 에러:",err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="coupon-wrap">
            {/* 헤더 */}
            <Header bgColor="#62E59B"></Header>
            <div className="custom-header">
                <img
                    src={Previous}
                    alt="뒤로가기"
                    className="back-icon"
                    onClick={() => window.history.back()}
                />
                <h2 className="page-title">쿠폰 등록하기</h2>
            </div>
            <div className="coupon-section">
                {/* 안내문 */}
                <div className="info-text">
                    <h3 className="info-title">리워드샵 쿠폰 등록</h3>
                    <p className="highlight">* 사용자들이 Flow 포인트로 쿠폰을 교환할 수 있습니다.</p>
                    <p>해당 금액만큼 파트너님 비용이 차감됩니다.</p>
                </div>

                {/* 입력 폼 */}
                <div className="form">
                    <label>
                        쿠폰 종류 <span className="example">* 예시) 아메리카노</span>
                    </label>
                    <input
                        type="text"
                        placeholder="쿠폰 종류를 입력해 주세요."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>쿠폰 금액</label>
                    <input
                        type="number"
                        placeholder="쿠폰 금액을 입력해 주세요."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                {/* 이미지 업로드 */}
                <div className="image-upload">
                    <label className="label">쿠폰 사진 등록</label>
                    <label htmlFor="file-upload" className="upload-label">
                        {image ? (
                            <span className="file-name">{image.name}</span>
                        ) : (
                            <span className="plus">+</span>
                        )}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </div>

                {/* 버튼 */}
                <button className="btn confirm" onClick={handleSubmit}>
                    등록하기
                </button>
            </div>
        </div>

    );
}