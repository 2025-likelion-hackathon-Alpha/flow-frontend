import React from 'react'
import './Recommend.scss'
import Cafe from '../../assets/Cafe.png' // 예시 이미지

const Recommend = ({
  user = "아기사자",
  storeName = "선잠",
  status = "영업중",
  description = "숨겨진 공간의 아늑한 카페",
  image,
  onOpen // 모달 열기
}) => {
  return (
    <div className="Recommend_wrap">
      {/* 헤더 */}
      <div className="recommend-header">
        <span className="title">
          {user}님<br />
          오늘은 이곳 어때요?
        </span>

        {/* 클릭 시 모달 열림 */}
        <span className="link" onClick={onOpen}>
          AI 소비 추천 매장 →
        </span>
      </div>

      {/* 본문 */}
      <div className="recommend-body">
        <div className="image">
          <img src={image || Cafe} alt={storeName} />
        </div>
        <div className="info">
          <div className="store">
            <span className="name">{storeName}</span>
            <span className="status">{status}</span>
          </div>
          <p className="desc">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default Recommend
