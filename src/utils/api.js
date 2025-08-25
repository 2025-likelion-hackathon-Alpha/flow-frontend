// src/utils/api.js

const BASE_URL = "https://api.flowalpha.store"

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있으면 자동 추가
    ...options.headers, // 기존 헤더 병합
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // 세션 쿠키도 필요하면 유지
  })

  // 공통 에러 처리
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "API 요청 실패")
  }

  return res.json()
}
