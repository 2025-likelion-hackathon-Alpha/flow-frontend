import React from 'react'
import './Header.scss'
import Cellular from '../../assets/Cellular.svg'
import Wifi from '../../assets/Wifi.svg'
import Battery from '../../assets/Battery.svg'

const Header = ({bgColor = "#fff"}) => {
    return (
        <div>
            <div className="Header_wrap" style={{backgroundColor: bgColor}}>
                <div className="time">9:41</div>
                <div className="icons">
                    <div className="cellular">
                        <img src={Cellular} alt="" />
                    </div>
                    <div className="wifi">
                        <img src={Wifi} alt="" />
                    </div>
                    <div className="battery">
                        <img src={Battery} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header