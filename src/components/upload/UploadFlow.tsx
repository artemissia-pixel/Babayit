import React, { useRef, useState } from 'react'
import { Apartment } from '@/constants/apartments'
import { Step1Photos } from './Step1Photos'
import { Step2Details } from './Step2Details'
import { Step3Submit } from './Step3Submit'

export interface UploadData {
  photos: string[]
  price: number
  rooms: number
  floor: number
  availableFrom: string
  address: string
  lat: number
  lng: number
  phone: string
  whatsappEnabled: boolean
  // optional extras
  size: number
  billElec: number;    billElecProvider: string
  billWater: number;   billWaterProvider: string
  billArnona: number;  billArnonaProvider: string
  billGas: number;     billGasProvider: string
  billVaad: number;    billVaadProvider: string
  billInternet: number; billInternetProvider: string; internetType: 'fiber' | 'cable' | null
  ac: boolean | null
  elevator: boolean | null
  parking: boolean | null
  storage: boolean | null
  pets: 'allowed' | 'forbidden' | null
  smoking: 'allowed' | 'forbidden' | null
  guaranteeAmount: number
  guaranteeType: string
  minContractMonths: number
  whatsLeft: string
  paymentMethod: string
  customFields: { label: string; value: string }[]
}

const EMPTY: UploadData = {
  photos: [],
  price: 0,
  rooms: 0,
  floor: 0,
  availableFrom: '',
  address: '',
  lat: 0,
  lng: 0,
  phone: '',
  whatsappEnabled: false,
  size: 0,
  billElec: 0,    billElecProvider: '',
  billWater: 0,   billWaterProvider: '',
  billArnona: 0,  billArnonaProvider: '',
  billGas: 0,     billGasProvider: '',
  billVaad: 0,    billVaadProvider: '',
  billInternet: 0, billInternetProvider: '', internetType: null,
  ac: null,
  elevator: null,
  parking: null,
  storage: null,
  pets: null,
  smoking: null,
  guaranteeAmount: 0,
  guaranteeType: '',
  minContractMonths: 0,
  whatsLeft: '',
  paymentMethod: '',
  customFields: [],
}

/** Convert an existing Apartment back into UploadData for editing */
function apartmentToUploadData(apt: Apartment): UploadData {
  return {
    ...EMPTY,
    photos: apt.photos ?? [],
    price: apt.price,
    billVaad: apt.bills,   // best-effort: lump prior bills into ועד בית
    rooms: apt.rooms,
    floor: apt.floor,
    size: apt.size,
    availableFrom: isoFromDisplay(apt.availableFrom),
    address: apt.address,
    lat: apt.lat,
    lng: apt.lng,
    phone: apt.phone,
    whatsappEnabled: !!apt.whatsapp,
    elevator: apt.elevator ?? null,
    parking: apt.parking ?? null,
    pets: apt.pets ?? null,
    smoking: apt.smoking ?? null,
  }
}

function isoFromDisplay(display: string): string {
  // "DD/MM/YYYY" → "YYYY-MM-DD"
  const parts = display.split('/')
  if (parts.length !== 3) return ''
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

const STEPS = ['תמונות', 'פרטים', 'פרסום']

interface Props {
  onClose: () => void
  onPublish: (apt: Apartment) => void
  /** Pass an existing apartment to open the flow in edit mode */
  editApartment?: Apartment
}

export function UploadFlow({ onClose, onPublish, editApartment }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<UploadData>(
    editApartment ? apartmentToUploadData(editApartment) : EMPTY
  )
  const [submitting, setSubmitting] = useState(false)
  const validatorRef = useRef<(() => boolean) | null>(null)

  const update = (patch: Partial<UploadData>) =>
    setData((prev) => ({ ...prev, ...patch }))

  const handleNext = () => {
    if (step === 1 && validatorRef.current) {
      if (!validatorRef.current()) return   // validator scrolls to error
    }
    setStep((s) => s + 1)
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      const computedBills =
        data.billElec + data.billWater + data.billArnona +
        data.billGas + data.billVaad + data.billInternet
      const apt: Apartment = {
        id: editApartment?.id ?? `user-${Date.now()}`,
        lat: data.lat || 32.0853,
        lng: data.lng || 34.7818,
        price: data.price,
        bills: computedBills,
        rooms: data.rooms,
        floor: data.floor,
        size: data.size,
        address: data.address || `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`,
        availableFrom: formatDate(data.availableFrom),
        isBrokerage: editApartment?.isBrokerage ?? false,
        phone: data.phone,
        whatsapp: data.whatsappEnabled
          ? data.phone.replace(/\D/g, '').replace(/^0/, '972')
          : undefined,
        photos: data.photos.length > 0 ? data.photos : undefined,
        elevator: data.elevator,
        parking: data.parking,
        pets: data.pets,
        smoking: data.smoking,
      }
      onPublish(apt)
      setSubmitting(false)
    }, 600)
  }

  const isEdit = !!editApartment

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />

      <div style={sheetStyle}>
        <div style={handleStyle} />

        <div style={headerStyle}>
          <button onClick={onClose} style={closeBtnStyle} aria-label="סגור">✕</button>
          <span style={titleStyle}>{isEdit ? 'עריכת דירה' : 'פרסום דירה'}</span>
          <div style={{ width: 28 }} />
        </div>

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

        <div style={contentStyle}>
          {step === 0 && (
            <Step1Photos photos={data.photos} onChange={(photos) => update({ photos })} />
          )}
          {step === 1 && (
            <Step2Details
              data={data}
              onChange={update}
              onTryNext={handleNext}
              registerValidator={(fn) => { validatorRef.current = fn }}
            />
          )}
          {step === 2 && (
            <Step3Submit data={data} submitting={submitting} onSubmit={handleSubmit} />
          )}
        </div>

        {step < 2 && (
          <div style={footerStyle}>
            {step > 0 && (
              <button style={backBtn} onClick={() => setStep((s) => s - 1)}>חזור</button>
            )}
            <button style={nextBtn} onClick={handleNext}>
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
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 30,
}

const sheetStyle: React.CSSProperties = {
  position: 'fixed', bottom: 0, left: 0, right: 0,
  background: '#fff', borderRadius: '20px 20px 0 0',
  boxShadow: '0 -4px 32px rgba(0,0,0,0.18)',
  zIndex: 31, direction: 'rtl',
  animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
  maxHeight: '92vh', display: 'flex', flexDirection: 'column',
}

const handleStyle: React.CSSProperties = {
  width: 36, height: 4, background: '#DEE2E6',
  borderRadius: 2, margin: '10px auto 0', flexShrink: 0,
}

const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 16px 0', flexShrink: 0,
}

const closeBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', fontSize: 18, color: '#6C757D',
  cursor: 'pointer', padding: 4, lineHeight: 1, fontFamily: 'inherit',
}

const titleStyle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: '#1B1B1B' }

const stepsRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', padding: '14px 24px 8px', flexShrink: 0,
}

const stepItem: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }

const stepDot: React.CSSProperties = {
  width: 28, height: 28, borderRadius: '50%', background: '#DEE2E6',
  color: '#6C757D', fontSize: 12, fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
}
const stepDotActive: React.CSSProperties = { background: '#2D6A4F', color: '#fff' }
const stepLabel: React.CSSProperties = { fontSize: 11, color: '#ADB5BD', fontWeight: 600 }
const stepLabelActive: React.CSSProperties = { color: '#2D6A4F' }
const stepLine: React.CSSProperties = {
  flex: 1, height: 2, background: '#DEE2E6', marginBottom: 16, transition: 'background 0.2s',
}
const stepLineActive: React.CSSProperties = { background: '#2D6A4F' }

const contentStyle: React.CSSProperties = { padding: '16px 16px 8px', overflowY: 'auto', flex: 1 }

const footerStyle: React.CSSProperties = {
  display: 'flex', gap: 10, padding: '12px 16px 28px',
  flexShrink: 0, borderTop: '1px solid #F0F4F2',
}

const backBtn: React.CSSProperties = {
  flex: 1, background: '#F0F4F2', color: '#2D6A4F', borderRadius: 12,
  padding: '13px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
}

const nextBtn: React.CSSProperties = {
  flex: 2, background: '#2D6A4F', color: '#fff', borderRadius: 12,
  padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', border: 'none',
}
