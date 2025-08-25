import React, { useState, useEffect } from 'react'
import './RewardShop.scss'
import Header from '../../components/Header/Header'
import Search from '../../assets/Search.png'

const RewardShop = () => {
    const username = "아기사자"
    const [search, setSearch] = useState("")
    const [selectedId, setSelectedId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // API에서 데이터 불러오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("https://api.flowalpha.store/api/rewardShop", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                if (!res.ok) throw new Error("Failed to fetch coupons")
                const data = await res.json()

                // 백엔드 응답 구조: [{rewardCouponId, name, image, amount, shopName}, ...]
                const mapped = data.map(item => ({
                    id: item.rewardCouponId,
                    name: item.name,
                    store: item.shopName,
                    points: item.amount,
                    img: item.image,
                }))
                setProducts(mapped)
            } catch (e) {
                console.error(e)
                alert("쿠폰 목록을 불러오지 못했어요.")
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // 검색 필터
    const filtered = products.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    )

    // 버튼 클릭
    const handleCouponClick = () => {
        if (!selectedId) return alert("상품을 먼저 선택해주세요!")
        setIsModalOpen(true)
    }

    const selectedProduct = products.find(p => p.id === selectedId)

    return (
        <div className="rewardshop-container">
            <Header title="Flow" />

            <div className="rewardshop">리워드 샵</div>

            <div className="title">
                <h1>{username}님</h1>
                <p>지금까지 얻은 포인트를 쿠폰으로 변환해 보세요.</p>
            </div>

            {/* 검색창 */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="찾고 싶은 매장을 검색해 주세요."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <img src={Search} alt="검색" className="search-icon" />
            </div>

            {/* 상품 리스트 */}
            <div className="scroll-area">
                {loading ? (
                    <p>쿠폰 목록 불러오는 중...</p>
                ) : (
                    <div className="product-list">
                        {filtered.map(item => (
                            <div
                                className={`product-card ${selectedId === item.id ? "selected" : ""}`}
                                key={item.id}
                                onClick={() =>
                                    setSelectedId(selectedId === item.id ? null : item.id)
                                }
                            >
                                <img src={item.img} alt={item.name} className="thumb" />
                                <div className="info">
                                    <h4>{item.name}</h4>
                                    <p>{item.store}</p>
                                </div>
                                <span className="points">
                                    <span className="point-number">{item.points}</span>
                                    <span className="point-text"> 포인트</span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="footer-btn">
                <button className="coupon-btn" onClick={handleCouponClick}>
                    쿠폰 받기
                </button>
            </div>

            {/* 모달 */}
            {isModalOpen && selectedProduct && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h2>쿠폰 지급 완료!</h2>
                        <p>
                            {username}님, <b>{selectedProduct.points} 포인트</b>를 사용하여 <br />
                            <b>{selectedProduct.name}</b> 쿠폰을 받았어요.
                        </p>
                        <p>쿠폰을 지금 바로 확인해 보세요!</p>
                        <button className="go-coupon">쿠폰 확인하러 가기</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RewardShop
