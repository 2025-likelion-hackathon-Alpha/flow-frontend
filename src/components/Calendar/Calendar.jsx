import React, { useState } from 'react'
import './Calendar.scss'

const Calendar = ({ year, month, today, pointDays }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 이번 달의 총 일 수
  const daysInMonth = new Date(year, month, 0).getDate()
  // 이번 달 1일의 요일 (0=일, 1=월, …)
  const firstDay = new Date(year, month - 1, 1).getDay()
  // 보정: 0=일 → 6, 나머지 -1
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

  // 날짜 배열
  const allDates = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // 앞뒤 빈칸 채우기
  const paddedDates = [
    ...Array(adjustedFirstDay).fill(null),
    ...allDates
  ]
  while (paddedDates.length % 7 !== 0) {
    paddedDates.push(null)
  }

  // 오늘 index 찾기 (paddedDates에서)
  const todayIndex = paddedDates.findIndex(d => d === today)
  const weekStart = Math.floor(todayIndex / 7) * 7
  const weekDates = paddedDates.slice(weekStart, weekStart + 7)

  // 최종 표시할 날짜
  const visibleDates = isExpanded ? paddedDates : weekDates

  // 오늘 요일 계산
  const todayObj = new Date(year, month - 1, today)
  const todayWeekday = todayObj.getDay()
  const adjustedToday = todayWeekday === 0 ? 6 : todayWeekday - 1

  return (
    <div className="calendar-card">
      {/* 상단 */}
      <div className="calendar-header">
        <span>{year}년 {month}월</span>
        <button
          className="dropdown"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* 요일 */}
      <div className="calendar-weekdays">
        {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => (
          <span
            key={idx}
            style={{ color: idx === adjustedToday ? '#000' : '#999' }}
          >
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 */}
      <div className="calendar-dates">
        {visibleDates.map((date, idx) => {
          if (!date) return <div key={idx} className="empty"></div>
          const isToday = date === today
          const isPoint = pointDays.includes(date)
          return (
            <div
              key={idx}
              className={`date-item ${isToday ? 'today' : ''} ${isPoint ? 'point' : ''}`}
            >
              {date}
              {isPoint && !isToday && <span className="dot"></span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
