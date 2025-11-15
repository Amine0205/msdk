'use client'
import { useEffect } from 'react'

export default function ChatWidget() {
  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://nordan-backend-production.up.railway.app/public/widget.js'
    s.defer = true
    s.setAttribute('nordankey', 'jSgcxmAkUf7bO')
    document.body.appendChild(s)
    return () => { s.remove() }
  }, [])

  return <div id="nordan-widget-root" />
}