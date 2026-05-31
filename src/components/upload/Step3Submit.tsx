import React from 'react'
import { UploadData } from './UploadFlow'

interface Props {
  data: UploadData
  submitting: boolean
  onSubmit: () => void
}

export function Step3Submit({ data, submitting, onSubmit }: Props) {
  const computedBills =
    data.billElec + data.billWater + data.billArnona +
    data.billGas + data.billVaad + data.billInternet
  const totalPrice = (data.price || 0) + computedBills

  return (
    <div style={wrapper}>
      <p style={heading}>הכל נראה טוב?</p>

      {/* Photo preview strip */}
      {data.photos.length > 0 && (
        <div style={photoStrip}>
          {data.photos.slice(0, 4).map((src, i) => (
            <img key={i} src={src} alt="" style={photoThumb} />
          ))}
          {data.photos.length > 4 && (
            <div style={morePhotos}>+{data.photos.length - 4}</div>
          )}
        </div>
      )}

      {/* Summary card */}
      <div style={summaryCard}>
        <Row label="מחיר כולל" value={`₪${totalPrice.toLocaleString('he-IL')} / חודש`} bold />
        {computedBills > 0 && (
          <Row label="פירוט" value={`שכ"ד ₪${data.price.toLocaleString()} + חשבונות ~₪${computedBills}`} />
        )}
        <Divider />
        <Row label="חדרים" value={String(data.rooms)} />
        <Row label="קומה" value={data.floor === 0 ? 'קרקע' : data.floor === -1 ? 'מרתף' : String(data.floor)} />
        <Row label="כניסה" value={formatDate(data.availableFrom)} />
        <Divider />
        <Row label="כתובת / מיקום" value={data.address || `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`} />
        <Row label="טלפון" value={data.phone} />
        {data.whatsappEnabled && <Row label="וואטסאפ" value="✓ פעיל" />}
      </div>

      <button style={submitBtn} onClick={onSubmit} disabled={submitting}>
        {submitting ? 'מפרסם...' : '🏠 פרסם דירה'}
      </button>

      <p style={disclaimer}>הדירה תופיע מיד על המפה</p>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={rowStyle}>
      <span style={rowLabel}>{label}</span>
      <span style={{ ...rowValue, fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid #F0F0F0', margin: '4px 0' }} />
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const wrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const heading: React.CSSProperties = {
  fontSize: 15,
  color: '#6C757D',
  textAlign: 'right',
}

const photoStrip: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
}

const photoThumb: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 8,
  objectFit: 'cover',
  flexShrink: 0,
}

const morePhotos: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 8,
  background: '#F0F4F2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  fontWeight: 700,
  color: '#2D6A4F',
  flexShrink: 0,
}

const summaryCard: React.CSSProperties = {
  background: '#F8FCF9',
  borderRadius: 12,
  border: '1px solid #B7D5C8',
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const rowLabel: React.CSSProperties = {
  fontSize: 13,
  color: '#6C757D',
}

const rowValue: React.CSSProperties = {
  fontSize: 14,
  color: '#1B1B1B',
  textAlign: 'left',
}

const submitBtn: React.CSSProperties = {
  width: '100%',
  background: '#2D6A4F',
  color: '#fff',
  borderRadius: 12,
  padding: '15px 0',
  fontSize: 17,
  fontWeight: 800,
  boxShadow: '0 3px 10px rgba(45,106,79,0.3)',
  cursor: 'pointer',
}

const disclaimer: React.CSSProperties = {
  fontSize: 12,
  color: '#ADB5BD',
  textAlign: 'center',
}
