import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'

export default function Select() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        // 첫 렌더 다음 프레임에 활성화 후 자연스런 페이드인
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])
    return (
        <>
            <Header title='Flow' />
            <main style={{ padding: 16, opacity: mounted ? 1 : 0, transition: 'opacity 250ms ease' }}>
                Select 페이지
            </main>
        </>
    )
}
