import React, { useState } from 'react'
import { Apartment } from '@/constants/apartments'
import { Step1Photos } from './Step1Photos'
import { Step2Details } from './Step2Details'
import { Step3Submit } from './Step3Submit'

export interface UploadData {
  photos: string[]
  price: number
  bills: number
  rooms: number
  floor: number
  availableFrom: string
  address: string
  lat: number
  lng: number
  phone: string
  whatsappEnabled: boolean
}

const EMPTY: UploadData = {
  photos: [],
  price: 0,
  bills: 0,
  rooms: 0,
  floor: 0,
  availableFrom: '',
  address: '',
  lat: 0,
  lng: 0,
  phone: '',
  whatsappEnabled: false,
}

const STEPS = ['תמונות', 'פרטים', 'פרסום']

interface Props {
  onClose: () => void
  onPublish: (apt: Apartment) => void
}

export function UploadFlow({ onClose, onPublish }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<UploadData>(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  const update = (patch: Partial<UploadData>) =>
    setData((prev) => ({ ...prev, ...patch }))

  const canNext = (): boolean => {
    if (step === 0) return true // photos optional
    if (step === 1) {
      return (
        data.price > 0 &&
        data.rooms > 0 &&
        data.floor !== undefined &&
        !!data.availableFrom &&
        (data.lat !== 0 || data.address.trim().length > 0) &&
        data.phone.trim().length > 0
      )
    }
    return true
  }

  const handleSubmit = () => {
    setSubmitting(true)
    // Simulate async (Firebase write will go here later)
    setTimeout(() => {
      const apt: Apartment = {
        id: `user-${Date.now()}`,
        lat: data.lat || 32.0853,
        lng: data.lng || 34.7818,
        price: data.price,
        bills: data.bills,
        rooms: data.rooms,
        floor: data.floor,
        size: 0,
        address: data.address || `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`,
        availableFrom: formatDate(data.availableFrom),
        isBrokerage: false,
        phone: data.phone,
        whatsapp: data.whatsappEnabled
          ? data.phone.replace(/\D/g, '').replace(/^0/, '972')
          : undefined,
      }
      onPublish(apt)
      setSubmitting(false)
    }, 600)
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={backdropStyle} />

      {/* Sheet */}
      <div style={sheetStyle}>
        {/* Handle */}
        <div style={handleStyle} />

        {/* Header */}
        <div style={headerStyle}>
          <button onClick={onClose} style={closeBtnStyle} aria-label="סגור">✕</button>
          <span style={titleStyle}>פרסום דירה</span>
          <div style={{ width: 28 }} /> {/* spacer */}
        </div>

        {/* Step indicator */}
        <div style={stepsRow}>
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div style={stepItem}>
                <div style={{ ...stepDot, ...(i <= step ? stepDotActive : {}) }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ ...stepLabel, ...(i === step ? stepLabelActive : {}) }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ ...stepLine, ...(i < step ? stepLineActive : {}) }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div style={contentStyle}>
          {step === 0 && (
            <Step1Photos
              photos={data.photos}
              onChange={(photos) => update({ photos })}
            />
          )}
          {step === 1 && (
            <Step2Details data={data} onChange={update} />
          )}
          {step === 2 && (
            <Step3Submit data={data} submitting={submitting} onSubmit={handleSubmit} />
          )}
        </div>

        {/* Footer nav */}
        {step < 2 && (
          <div style={footerStyle}>
            {step > 0 && (
              <button style={backBtn} onClick={() => setStep((s) => s - 1)}>
                חזור
              </button>
            )}
            <button
              style={{ ...nextBtn, opacity: canNext() ? 1 : 0.45 }}
              onClick={() => canNext() && setStep((s) => s + 1)}
            >
              {step === 1 ? 'לסיכום ←' : 'הבא ←'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.3)',
  zIndex: 30,
}

const sheetStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: '#fff',
  borderRadius: '20px 20px 0 0',
  boxShadow: '0 -4px 32px rgba(0,0,0,0.18)',
  zIndex: 31,
  direction: 'rtl',
  animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
  maxHeight: '92vh',
  display: 'flex',
  flexDirection: 'column',
}

const handleStyle: React.CSSProperties = {
  width: 36,
  height: 4,
  background: '#DEE2E6',
  borderRadius: 2,
  margin: '10px auto 0',
  flexShrink: 0,
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px 0',
  flexShrink: 0,
}

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 18,
  color: '#6C757D',
  cursor: 'pointer',
  padding: 4,
  lineHeight: 1,
  fontFamily: 'inherit',
}

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#1B1B1B',
}

const stepsRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '14px 24px 8px',
  flexShrink: 0,
}

const stepItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
}

const stepDot: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#DEE2E6',
  color: '#6C757D',
  fontSize: 12,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
}

const stepDotActive: React.CSSProperties = {
  background: '#2D6A4F',
  color: '#fff',
}

const stepLabel: React.CSSProperties = {
  fontSize: 11,
  color: '#ADB5BD',
  fontWeight: 600,
}

const stepLabelActive: React.CSSProperties = {
  color: '#2D6A4F',
}

const stepLine: React.CSSProperties = {
  flex: 1,
  height: 2,
  background: '#DEE2E6',
  marginBottom: 16,
  transition: 'background 0.2s',
}

const stepLineActive: React.CSSProperties = {
  background: '#2D6A4F',
}

const contentStyle: React.CSSProperties = {
  padding: '16px 16px 8px',
  overflowY: 'auto',
  flex: 1,
}

const footerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  padding: '12px 16px 28px',
  flexShrink: 0,
  borderTop: '1px solid #F0F4F2',
}

const backBtn: React.CSSProperties = {
  flex: 1,
  background: '#F0F4F2',
  color: '#2D6A4F',
  borderRadius: 12,
  padding: '13px 0',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const nextBtn: React.CSSProperties = {
  flex: 2,
  background: '#2D6A4F',
  color: '#fff',
  borderRadius: 12,
  padding: '13px 0',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'opacity 0.15s',
}
