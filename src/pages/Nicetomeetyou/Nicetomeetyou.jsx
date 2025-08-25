import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Nicetomeetyou.scss'

const Nicetomeetyou = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || { username: "사용자" }; // 기본값

    const handleNext = () => {
        navigate('/tutorial1');
    };

    const handleSkip = () => {
        navigate('/main');
    };

    return (
        <div className="Welcome_wrap">
            <div className="bg-layer"></div>

            <div className="welcome">
                <h1>반가워요 {username}님!</h1>
                <p>
                    {username}님만을 위한 플로의 <br />
                    소비 루틴과 혜택을 보여드릴게요!
                </p>
            </div>

            <div className="option">
                <div className="next" onClick={handleNext}>다음</div>
                <div className="skip" onClick={handleSkip}>건너뛰기</div>
            </div>
        </div>
    )
}

export default Nicetomeetyou
