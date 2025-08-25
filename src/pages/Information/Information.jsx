import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Information.scss'
import Header from '../../components/Header/Header'
import Back from '../../assets/Back.svg'
import Footer from '../../components/FooterBtn/FooterBtn'
import Back2 from '../../assets/Back2.svg'
import Delete from '../../assets/Delete.svg'
import More from '../../assets/More.svg'

// 숫자만 받아서 HH:MM로 마스킹하는 인풋
const TimeInput = ({ value, onChange, placeholder = "00:00" }) => {
  const format = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4); // 최대 4자리(HHMM)
    let h = digits.slice(0, 2);
    let m = digits.slice(2, 4);

    // 범위 보정 (00–23, 00–59)
    if (h.length === 2) h = String(Math.min(parseInt(h || "0", 10), 23)).padStart(2, "0");
    if (m.length === 2) m = String(Math.min(parseInt(m || "0", 10), 59)).padStart(2, "0");

    if (digits.length <= 2) return h;
    return `${h}:${m}`;
  };

  const handleChange = (e) => onChange(format(e.target.value));

  const handleBlur = () => {
    if (!value) return;
    const [hh = "0", mm = "0"] = value.split(":");
    const h = String(Math.min(+hh || 0, 23)).padStart(2, "0");
    const m = String(Math.min(+mm || 0, 59)).padStart(2, "0");
    onChange(`${h}:${m}`);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={5}
      inputMode="numeric"
      pattern="[0-9]*"
      className="time-text-input"
    />
  );
};

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

const Information = () => {
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState([])
  const [loading, setLoading] = useState(false)
  const [intro, setIntro] = useState('')
  const [timeByDay, setTimeByDay] = useState({})

  const [photos, setPhotos] = useState([])         // File[]
  const fileInputRef = useRef(null)
  const MAX = 6
  const openPicker = () => fileInputRef.current?.click()
  const onPick = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remain = Math.max(0, MAX - photos.length)
    setPhotos(prev => [...prev, ...files.slice(0, remain)])
    e.target.value = ''
  }
  const removePhoto = (idx) => setPhotos(prev => prev.filter((_, i) => i !== idx))

  const toggleDay = (d) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const handleSave = async () => {
    if (selectedDays.length === 0) return alert('운영 요일을 선택해 주세요.')
    try {
      setLoading(true)
      const res = await fetch('https://api.flowalpha.store/api/store/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: selectedDays,
          timeByDay: timeByDay,
          description: intro,
          photos: photos,           // 실제는 FormData 써야 파일 업로드 가능
          benefits: benefits
        }),
      })
      if (!res.ok) throw new Error('save failed')
      navigate('/login')
    } catch (e) {
      alert('저장 실패. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }


  const [sheet, setSheet] = useState({
    open: false,
    day: null,
    openTime: '',
    closeTime: '',
  })

  const openDaySheet = (d) => {
    const t = timeByDay[d] || { open: '', close: '' }
    setSheet({ open: true, day: d, openTime: t.open, closeTime: t.close })
  }

  const closeDaySheet = () => setSheet((s) => ({ ...s, open: false }))

  const saveDayTime = () => {
    if (!sheet.day) return
    setTimeByDay((prev) => ({
      ...prev,
      [sheet.day]: { open: sheet.openTime, close: sheet.closeTime },
    }))
    // 선택 표시
    setSelectedDays((prev) => (prev.includes(sheet.day) ? prev : [...prev, sheet.day]))
    closeDaySheet()
  }

  // === 혜택 저장 상태 (서버 전송용)
  const [benefits, setBenefits] = useState({
    seed: { enabled: false, note: '' },                 // 씨앗 적립 조건
    visit: { enabled: false, times: [], couponType: '', images: [] }, // 방문 N회 쿠폰
  });

  // === 혜택 모달 상태
  const [benefitSheet, setBenefitSheet] = useState({
    open: false,
    tab: 'seed',          // (안 써도 되지만 하위 호환 위해 남겨둠)
    active: 'seed',       // << 추가: 'seed' | 'visit'
    seedNote: '',
    vvisitTimes: [],
    visitCouponType: '',
    visitImages: [],
  });

  // 모달 열기
  const openBenefitSheet = (tab) => {
    setBenefitSheet({
      open: true,
      tab,
      active: tab,
      seedNote: benefits.seed.note || '',
      visitTimes: Array.isArray(benefits.visit.times) ? benefits.visit.times : [],
      visitCouponType: benefits.visit.couponType || '',
      visitImages: benefits.visit.images || [],
    });
  };

  // 모달 닫기
  const closeBenefitSheet = () => {
    setBenefitSheet((s) => ({ ...s, open: false }));
  };


  // 방문 쿠폰 사진 업로더
  const visitImgInputRef = useRef(null);
  const onPickVisitImg = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBenefitSheet((s) => ({ ...s, visitImages: [...s.visitImages, ...files].slice(0, 6) }));
    e.target.value = '';
  };

  // 저장
  const saveBenefit = () => {
    setBenefits((prev) => {
      const next = { ...prev };
      if (benefitSheet.tab === 'seed') {
        next.seed = { enabled: true, note: benefitSheet.seedNote };
      } else {
        next.visit = {
          enabled: true,
          times: benefitSheet.visitTimes,
          couponType: benefitSheet.visitCouponType,
          images: benefitSheet.visitImages,
        };
      }
      return next;
    });
    closeBenefitSheet();
  };


  return (
    <>
      <Header title='Flow' />
      <div className="back" onClick={() => navigate(-1)}>
        <img src={Back} alt="뒤로가기" />
      </div>

      <div className="Information_wrap">
        <div className="title"><h1>매장 정보를 등록해 주세요.</h1></div>

        <div className="time">
          <div className="txt">
            <h1>운영 시간</h1>
            <p>요일을 선택해 매장 운영 시간을 설정해 주세요.</p>
          </div>

          <div className="week">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                className={`day-chip ${timeByDay[d] ? 'active' : ''}`}
                onClick={() => openDaySheet(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="intro">
          <p>매장 설명</p>
          <div className="intro_wrap">
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value.slice(0, 500))} // 500자 제한
              placeholder="매장에 대한 설명글을 입력해 주세요."
              maxLength={500}
            />
            <span className="char-count">{intro.length}/500</span>
          </div>
        </div>


        <div className="photo">
          <p>매장 사진</p>

          <div className="photo_grid">
            {photos.map((file, i) => (
              <div className="thumb" key={i}>
                <img src={URL.createObjectURL(file)} alt="" />
                <button type="button" className="del" onClick={() => removePhoto(i)}>✕</button>
              </div>
            ))}

            {photos.length < MAX && (
              <button type="button" className="add" onClick={openPicker}></button>
            )}
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onPick}
          />
        </div>


        <div className="benefit">
          <p>혜택 조건</p>
          <div className="point">
            <div className="review" onClick={() => openBenefitSheet('seed')}>
              <h3>리뷰 작성 시 씨앗 적립{benefits.seed.enabled && ' (설정됨)'}</h3>
            </div>
            <div className="money" onClick={() => openBenefitSheet('visit')}>
              <h3>매장 방문 시 쿠폰 지급{benefits.visit.enabled && ` (${benefits.visit.times}회)`}</h3>
            </div>
          </div>
        </div>


      </div>

      <div className="next">매장 정보는 마이페이지에서 수정할 수 있어요.</div>
      <Footer label={loading ? '저장 중...' : '확인'} onClick={handleSave} disabled={loading} />


      {sheet.open && (
        <div className="daySheet_overlay" onClick={closeDaySheet}>
          <div className="daySheet" onClick={(e) => e.stopPropagation()}>
            <div className="content">
              <div className="sheet_header">
                <button className="back_btn" onClick={closeDaySheet}>
                  <img src={Back2} alt="뒤로가기" />
                </button>
                <h3>운영 시간</h3>
                <button className="out_btn" onClick={closeDaySheet}>
                  <img src={Delete} alt="나가기" />
                </button>
              </div>

              <p className="sheet_sub">요일을 선택해 매장 운영 시간을 설정해 주세요.</p>

              <div className="sheet_days">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`chip ${sheet.day === d ? 'on' : ''}`}
                    onClick={() =>
                      setSheet((s) => ({
                        ...s,
                        day: d,
                        openTime: timeByDay[d]?.open || '',
                        closeTime: timeByDay[d]?.close || '',
                      }))
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="divider" />

              <div className="sheet_row">
                <span className="day_label">{sheet.day}요일</span>
                <div className="time_inputs">
                  <TimeInput
                    value={sheet.openTime}
                    onChange={(v) => setSheet((s) => ({ ...s, openTime: v }))}
                  />
                  <span className="tilde">~</span>
                  <TimeInput
                    value={sheet.closeTime}
                    onChange={(v) => setSheet((s) => ({ ...s, closeTime: v }))}
                  />
                </div>
                <div className="hint_row">
                  <small>오픈 시간</small>
                  <small>마감 시간</small>
                </div>
              </div>

              <button className="sheet_confirm" onClick={saveDayTime}>확인</button>
            </div>
          </div>
        </div>
      )}

      {benefitSheet.open && (
        <div className="daySheet_overlay" onClick={closeBenefitSheet}>
          <div className="daySheet" onClick={(e) => e.stopPropagation()}>

            {/* 헤더 */}
            <div className="sheet_header">
              <button className="back_btn" onClick={closeBenefitSheet}>
                <img src={Back2} alt="뒤로가기" />
              </button>
              <h3>혜택 설정</h3>
              <button className="out_btn" onClick={closeBenefitSheet}>
                <img src={Delete} alt="나가기" />
              </button>
            </div>

            <p className="sheet_benefit">혜택 조건</p>
            <p className="benefit_sheet_sub">혜택 조건은 중복 선택이 가능합니다.</p>

            {/* 씨앗 적립 조건 */}
            <section className={`benefit_section ${benefitSheet.active === 'seed' ? 'active' : ''}`}>
              <button
                type="button"
                className="section_header"
                onClick={() => setBenefitSheet(s => ({ ...s, active: s.active === 'seed' ? null : 'seed' }))}
              >
                <span>씨앗 적립 조건</span>
                <img className="chev" src={More} alt="" />
              </button>

              {benefitSheet.active === 'seed' && (
                <div className="section_body">
                  <small className="hint">* 예시) 리뷰 작성 시 씨앗 적립</small>
                  <textarea
                    className="field"
                    value={benefitSheet.seedNote}
                    onChange={(e) => setBenefitSheet(s => ({ ...s, seedNote: e.target.value }))}
                    placeholder="씨앗 적립 조건을 입력해 주세요."
                  />
                </div>
              )}
            </section>

            {/* 매장 방문 시 쿠폰 지급 */}
            <section className={`benefit_section ${benefitSheet.active === 'visit' ? 'active' : ''}`}>
              <button
                type="button"
                className="section_header"
                onClick={() => setBenefitSheet(s => ({ ...s, active: s.active === 'visit' ? null : 'visit' }))}
              >
                <span>매장 방문 시 쿠폰 지급</span>
                <img className="chev" src={More} alt="" />
              </button>

              {benefitSheet.active === 'visit' && (
                <div className="section_body">
                  <small className="hint">
                    * 매장 방문 시 쿠폰 적립에 동의한 매장만 AI 추천 매장으로<br />
                    &nbsp;&nbsp;소개될 수 있습니다.
                  </small>

                  <div className="visit_times_row">
                    {[1, 2, 3, 4, 5].map(n => (
                      <label key={n} className={`checkbox ${benefitSheet.visitTimes?.includes?.(n) ? 'on' : ''}`}>
                        {n}회 방문
                        <input
                          type="checkbox"
                          checked={benefitSheet.visitTimes?.includes?.(n)}
                          onChange={(e) => {
                            setBenefitSheet(s => {
                              let next = s.visitTimes || [];
                              if (e.target.checked) {
                                next = [...next, n];
                              } else {
                                next = next.filter(x => x !== n);
                              }
                              return { ...s, visitTimes: next };
                            });
                          }}
                        />
                      </label>
                    ))}
                  </div>

                  <label className="field_label">쿠폰 종류</label>
                  <p className='example'>* 예시) 아메리카노</p>
                  <input
                    className="field"
                    type="text"
                    value={benefitSheet.visitCouponType}
                    onChange={(e) => setBenefitSheet(s => ({ ...s, visitCouponType: e.target.value }))}
                    placeholder="쿠폰 종류를 입력해 주세요."
                  />

                  <label className="field_label">쿠폰 사진 등록</label>
                  <div className="visit_photos">
                    {(benefitSheet.visitImages || []).map((file, i) => (
                      <div key={i} className="thumb">
                        <img src={URL.createObjectURL(file)} alt="" />
                        <button
                          type="button"
                          className="del"
                          onClick={() =>
                            setBenefitSheet(s => ({
                              ...s,
                              visitImages: s.visitImages.filter((_, idx) => idx !== i),
                            }))
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(benefitSheet.visitImages?.length || 0) < 6 && (
                      <button type="button" className="add" onClick={() => visitImgInputRef.current?.click()} />
                    )}
                    <input
                      ref={visitImgInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={onPickVisitImg}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* === 모달 푸터: 공통 확인 버튼 === */}
            <div className="modal_footer">
              <button className="modal_footer_btn" onClick={saveBenefit}>확인</button>
            </div>


          </div>
        </div>
      )}



    </>
  )
}

export default Information
