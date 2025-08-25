// src/utils/api.js
const BASE_URL = "https://api.flowalpha.store"

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken")   // 🔹 로그인 때 저장한 토큰 불러오기

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // 세션 쿠키도 쓰는 경우 유지
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "API 요청 실패")
  }

  return res.json()
}
