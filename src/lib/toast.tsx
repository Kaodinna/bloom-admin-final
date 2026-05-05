'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Toast, ToastType } from '@/types'

interface ToastCtx { toast: (msg: string, type?: ToastType) => void }
const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800)
  }, [])

  const bgMap: Record<ToastType, string> = {
    success: 'bg-sage',
    warning: 'bg-gold',
    error:   'bg-rust',
    info:    'bg-ink',
  }
  const icons: Record<ToastType, string> = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`${bgMap[t.type]} text-white px-4 py-2.5 rounded-[9px] text-[.78rem] font-medium flex items-center gap-2 pointer-events-auto shadow-md animate-slide-in max-w-[270px]`}
          >
            <span>{icons[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
