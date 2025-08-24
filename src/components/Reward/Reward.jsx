import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Reward.scss'
import Coin from '../../assets/Coin.png'

const Reward = ({ user, points }) => {
    const navigate = useNavigate()

    return (
        <div className="Reward_wrap">
            {/* 상단 */}
            <div className="reward_header">
                <div className="header_txt">
                    <p className="user">
                        <span className="username">{user}</span> 님
                    </p>

                    <p className="points">
                        <span className="number">{points}</span> 포인트
                    </p>
                </div>
                <div className="header_img">
                    <img src={Coin} alt="coin" />
                </div>
            </div>

            {/* 하단 */}
            <div className="reward_footer">
                <p>
                    리워드 샵에 방문하여 지금까지 얻은 포인트를<br />
                    원하는 쿠폰으로 변환해 보세요.
                </p>

                <button
                    className="link"
                    onClick={() => navigate('/rewardshop')}
                >
                    리워드 샵 방문 →
                </button>
            </div>
        </div>
    )
}

export default Reward
