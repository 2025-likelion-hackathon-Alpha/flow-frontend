import React, { createContext, useContext, useState } from "react";

const SeedContext = createContext();

export function SeedProvider({ children }) {
  const [seeds, setSeeds] = useState(300);   // 보유 씨앗
  const [planted, setPlanted] = useState(0); // 심은 씨앗
  const [fundCount, setFundCount] = useState(0); // 펀딩 횟수

  // 펀딩 시 씨앗 차감 + 심은 씨앗 증가
  const fundSeeds = (amount) => {
    if (amount <= seeds) {
      setSeeds((prev) => prev - amount);
      setPlanted((prev) => prev + amount);
      setFundCount((prev) => prev + 1); 
      return true;   // 성공 시 true 반환
    } else {
      alert("씨앗이 부족합니다!");
      return false;  // 실패 시 false 반환
    }
  };

  return (
    <SeedContext.Provider value={{ seeds, planted, fundCount, fundSeeds }}>
      {children}
    </SeedContext.Provider>
  );
}

export const useSeeds = () => useContext(SeedContext);