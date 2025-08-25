import React, { useState, useEffect } from "react";
import "./OwnerPayment.scss";
import Header from "../../components/Header/Header";
import ringIcon from "../../assets/ring.png";
import CheckIcon from "../../assets/check.png";
import Del from "../../assets/del_icon.svg";
import Previous from "../../assets/previous_btn.svg";
import { useLocation } from "react-router-dom"

export default function OwnerPayment() {
    const location = useLocation();
    const shopInfoId = location.state?.shopInfoId;

    const [requests, setRequests] = useState([]);
    const [selected, setSelected] = useState(null);
    const [amount, setAmount] = useState("");

    // ✅ 결제 요청 리스트 불러오기
    useEffect(() => {
        if (!shopInfoId) return;

        const fetchRequests = async () => {
            try {
                const res = await fetch(
                    `http://54.180.244.106:8080/api/shopMypage/paymentCheck?status=WAITING&shopInfoId=${shopInfoId}&sort=createdAt,desc`
                );
                if (!res.ok) throw new Error("리스트 불러오기 실패");
                const data = await res.json();
                setRequests(data.content);
            } catch (err) {
                console.error("❌ 요청 불러오기 에러:", err);
            }
        };

        fetchRequests();
    }, [shopInfoId]);

    // ✅ 결제 요청 승인
    const handleConfirm = async () => {
        if (!selected) return;
        if (!amount) return alert("결제 금액을 입력해주세요.");

        try {
            const res = await fetch(
                `https://api.flowalpha.store/api/shopMypage/paymentCheck/${selected.paymentCheckId}/accept`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: parseInt(amount, 10) }),
                }
            );

            if (!res.ok) throw new Error("승인 실패");
            const result = await res.json();

            console.log("✅ 승인 성공:", result);
            alert(`결제 요청 승인 완료! 금액: ${result.amount.toLocaleString()}원`);

            // 승인된 요청은 리스트에서 제거
            setRequests((prev) =>
                prev.filter((r) => r.paymentCheckId !== selected.paymentCheckId)
            );
        } catch (err) {
            console.error("승인 에러:", err);
            alert("승인 처리 중 오류가 발생했습니다.");
        }

        setSelected(null);
        setAmount("");
    };

    return (
        <div className="payment-wrap">
            {/* ✅ 커스텀 헤더 */}
            <Header bgColor="#62E59B"></Header>
            <div className="custom-header">
                <img
                    src={Previous}
                    alt="뒤로가기"
                    className="back-icon"
                    onClick={() => window.history.back()}
                />
                <h2 className="page-title">결제 인증하기</h2>
            </div>

            <ul className="request-list">
                {requests.map((req) => (
                    <li
                        key={req.paymentCheckId}
                        className="request-item"
                        onClick={() => setSelected(req)}
                    >
                        <img src={ringIcon} alt="알림" className="ring-icon" />
                        <span>{req.userName} 님의 요청</span>
                    </li>
                ))}
            </ul>

            {/* 팝업 */}
            {selected && (
                <div className="modal-overlay">
                    <div className="modal">
                        {/* ✅ 닫기 버튼 */}
                        <button
                            className="close-btn"
                            onClick={() => setSelected(null)}
                        >
                            <img src={Del} alt="닫기" />
                        </button>

                        <div className="modal-header">
                            <img
                                src={CheckIcon}
                                alt="결제 아이콘"
                                className="modal-icon"
                            />
                            <h3>{selected.userName}</h3>
                        </div>

                        <input
                            type="number"
                            placeholder="결제 금액을 입력하세요."
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="amount-input"
                        />

                        <button className="btn confirm" onClick={handleConfirm}>
                            완료
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

