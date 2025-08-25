import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SeedProvider } from "./context/SeedContext";

// ✅ 일반 유저 화면
import Cover from './pages/Cover/Cover';
import Map01 from './pages/Map/Map01';
import Funding from './pages/Funding/Funding01';
import FundingDetail from './pages/Funding/FundingDetail';
import FundingHistory from './pages/Funding/FundingHistory';
import Mypage01 from './pages/Mypage/Mypage01';
import CouponPage from './pages/Mypage/CouponPage';
import ShopDetail from './pages/Map/ShopDetail';
import GeneralSignup from './pages/GeneralSignup/GeneralSignup'
import Tutorial1 from './pages/Tutorial1/Tutorial1'
import Tutorial2 from './pages/Tutorial2/Tutorial2'
import Tutorial3 from './pages/Tutorial3/Tutorial3'
import Success from './pages/Success/Success'
import Main from './pages/Main/Main'
import RewardShop from './pages/RewardShop/RewardShop'

// ✅ 사장님 화면
import OwnerHome from './pages/Owner/OwnerHome';
import OwnerPayment from './pages/Owner/OwnerPayment';
import OwnerCoupon from './pages/Owner/OwnerCoupon';
import StoreSignup from './pages/StoreSignup/StoreSignup'
import Information from './pages/Information/Information'

import Footer from './components/Footer/Footer';
import Select from './pages/Select/Select'
import Login from './pages/Login/Login'
import Nicetomeetyou from './pages/Nicetomeetyou/Nicetomeetyou'

function AppInner() {
  const location = useLocation();

  // ✅ 푸터 가려야 하는 경로들
  const hideFooterPaths = [
    "/", "/login", "/signup",
    "/funding-history", "/coupon",
    "/owner", "/owner/home", "/owner/payment", "/owner/coupon",
    "/signup/general", "/Nicetomeetyou", "/tutorial1", "/tutorial2", "/tutorial3",
    "/success", "/rewardshop", "/signup/store", "/information",
    '/select', 'login'
  ];

  // ✅ 동적 라우트(/shop/:id)도 포함되도록 처리
  const shouldHideFooter =
    hideFooterPaths.includes(location.pathname) ||
    location.pathname.startsWith("/shop/");

  return (
    <div className="app-root">
      <Routes>
        {/* 일반 사용자 */}
        <Route path="/" element={<Cover />} />
        <Route path="/map" element={<Map01 />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/funding/:id" element={<FundingDetail />} />
        <Route path="/funding-history" element={<FundingHistory />} />
        <Route path="/mypage" element={<Mypage01 />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/shop/:shopId" element={<ShopDetail />} />
        <Route path="/signup/general" element={<GeneralSignup />} />
        <Route path="/Nicetomeetyou" element={<Nicetomeetyou />} />
        <Route path="/tutorial1" element={<Tutorial1 />} />
        <Route path="/tutorial2" element={<Tutorial2 />} />
        <Route path="/tutorial3" element={<Tutorial3 />} />
        <Route path="/success" element={<Success />} />
        <Route path="/main" element={<Main />} />
        <Route path="/rewardshop" element={<RewardShop />} />

        {/* 사장님 전용 */}
        <Route path="/owner/home" element={<OwnerHome />} />
        <Route path="/owner/payment" element={<OwnerPayment />} />
        <Route path="/owner/coupon" element={<OwnerCoupon />} />
        <Route path="/signup/store" element={<StoreSignup />} />
        <Route path="/information" element={<Information />} />
        {/* 매장 정보 수정 페이지 추가 예정 */}

        <Route path='/select' element={<Select />} />
        <Route path='/login' element={<Login />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SeedProvider>
        <AppInner />
      </SeedProvider>
    </BrowserRouter>
  );
}
