import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Map01.scss";
import { useNavigate } from "react-router-dom";
import MapPin from "../../assets/map_pin.svg";
import MapLocation from "../../assets/map_location.svg";
import MapImg from "../../assets/map_img.png"

const { kakao } = window;

// ✅ 프론트에 직접 고정된 매장 데이터
const shopDetails = [
  {
    shop: {
      shopInfoId: 1,
      name: "놀랍",
      location: "서울특별시 성북구 동소문로15길 6 (동소문동6가, 미래하이츠) 2층",
      explanation: "감성적인 분위기의 디저트 카페",
    },
  },
  {
    shop: {
      shopInfoId: 2,
      name: "꿈의숲약국",
      location: "서울특별시 성북구 돌곶이로 183 (장위동) 1층 꿈의숲약국",
      explanation: "지역 주민을 위한 친절한 약국",
    },
    images: [],
  },
  {
    shop: {
      shopInfoId: 3,
      name: "가마치통닭 정릉역점",
      location: "서울특별시 성북구 정릉로 272 (정릉동)",
      explanation: "바삭한 후라이드 치킨 전문점",
    },
    images: [],
  },
  {
    shop: {
      shopInfoId: 4,
      name: "월곡튼튼정형외과의원",
      location: "서울특별시 성북구 화랑로 102 (하월곡동, 상상) 2층",
      explanation: "지역 주민 건강을 책임지는 정형외과",
    },
    images: [],
  },
  {
    shop: {
      shopInfoId: 5,
      name: "4번출구 텐텐하오",
      location: "서울특별시 성북구 숭인로 70-2 (길음동)",
      explanation: "중국 가정식을 즐길 수 있는 맛집",
    },
    images: [],
  },
];

export default function Map01() {
  const navigate = useNavigate();
  const myLocation = { lat: 37.5926, lng: 127.0166 }; // ✅ 성신여대역 고정

  // ✅ 지도 표시
  useEffect(() => {
    if (!kakao?.maps) return;

    kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new kakao.maps.LatLng(myLocation.lat, myLocation.lng),
        level: 4,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);

      // 내 위치 마커
      const myMarkerImage = new kakao.maps.MarkerImage(
        MapLocation,
        new kakao.maps.Size(35, 35),
        { offset: new kakao.maps.Point(16, 45) }
      );
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(myLocation.lat, myLocation.lng),
        map,
        image: myMarkerImage,
      });

      // 매장 마커 이미지
      const markerImage = new kakao.maps.MarkerImage(
        MapPin,
        new kakao.maps.Size(24, 35)
      );

      const geocoder = new kakao.maps.services.Geocoder();

      // ✅ 프론트 고정 데이터 → 주소로 좌표 변환 → 마커 표시
      shopDetails.forEach((detail) => {
        const shop = detail.shop;
        if (!shop.location) return;

        geocoder.addressSearch(shop.location, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            const marker = new kakao.maps.Marker({
              position: coords,
              map,
              image: markerImage,
            });

            const infoWindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${shop.name}</div>`,
            });

            kakao.maps.event.addListener(marker, "click", () =>
              infoWindow.open(map, marker)
            );
          }
        });
      });
    });
  }, []);

  return (
    <div className="map-page">
      <Header bgColor="#62E59B" />
      <header className="map-header">
        <h2>지역화폐 사용 가능 매장</h2>
      </header>
      <div id="map"></div>

      {/* ✅ 카드 리스트 */}
      <div className="shop-swiper">
        <Swiper
          spaceBetween={10}
          slidesPerView={1.2}
          grabCursor={true}
          touchEventsTarget="container"
        >
          {shopDetails.map((detail) => (
            <SwiperSlide key={detail.shop.shopInfoId}>
              <div
                className="shop-card"
                onClick={() => navigate(`/shop/${detail.shop.shopInfoId}`)}
              >
                <h3>{detail.shop.name}</h3>
                <p className="desc">{detail.shop.location}</p>
                <p className="explain">{detail.shop.explanation}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
