import React, { useEffect, useState } from 'react'
import { UploadData } from './UploadFlow'

interface Props {
  data: UploadData
  onChange: (data: Partial<UploadData>) => void
}

export function Step2Details({ data, onChange }: Props) {
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')
  const [addressMode, setAddressMode] = useState<'gps' | 'manual'>(
    data.lat !== 0 ? 'gps' : 'manual'
  )

  useEffect(() => {
    if (addressMode === 'gps' && data.lat === 0) {
      locateMe()
    }
  }, [addressMode])

  const locateMe = () => {
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocError('לא ניתן לאתר מיקום. בדקו הרשאות או הקלידו כתובת.')
        setLocating(false)
        setAddressMode('manual')
      },
      { timeout: 8000 }
    )
  }

  return (
    <div style={wrapper}>
      {/* Price */}
      <Field label="שכר דירה (₪ לחודש)" required>
        <input
          style={inputStyle}
          type="number"
          inputMode="numeric"
          placeholder="6500"
          value={data.price || ''}
          onChange={(e) => onChange({ price: Number(e.target.value) })}
        />
      </Field>

      <Field label="הערכת חשבונות חודשית (₪)">
        <input
          style={inputStyle}
          type="number"
          inputMode="numeric"
          placeholder="450"
          value={data.bills || ''}
          onChange={(e) => onChange({ bills: Number(e.target.value) })}
        />
        <span style={fieldHint}>חשמל + מים + ועד בית — בערך</span>
      </Field>

      {/* Rooms + Floor */}
      <div style={twoCol}>
        <Field label="חדרים" required>
          <select
            style={inputStyle}
            value={data.rooms || ''}
            onChange={(e) => onChange({ rooms: Number(e.target.value) })}
          >
            <option value="">בחרו</option>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="קומה" required>
          <select
            style={inputStyle}
            value={data.floor ?? ''}
            onChange={(e) => onChange({ floor: Number(e.target.value) })}
          >
            <option value="">בחרו</option>
            {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((f) => (
              <option key={f} value={f}>{f === 0 ? 'קרקע' : f === -1 ? 'מרתף' : f}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Entry date */}
      <Field label="תאריך כניסה" required>
        <input
          style={inputStyle}
          type="date"
          value={data.availableFrom}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange({ availableFrom: e.target.value })}
        />
      </Field>

      {/* Location */}
      <Field label="מיקום" required>
        <div style={toggleRow}>
          <button
            style={{ ...toggleBtn, ...(addressMode === 'gps' ? toggleActive : {}) }}
            onClick={() => setAddressMode('gps')}
          >
            📍 GPS
          </button>
          <button
            style={{ ...toggleBtn, ...(addressMode === 'manual' ? toggleActive : {}) }}
            onClick={() => setAddressMode('manual')}
          >
            ✏️ כתובת ידנית
          </button>
        </div>

        {addressMode === 'gps' && (
          <div style={gpsBox}>
            {locating && <span style={locatingText}>מאתר מיקום...</span>}
            {!locating && data.lat !== 0 && (
              <span style={locOk}>
                ✓ מיקום נמצא ({data.lat.toFixed(4)}, {data.lng.toFixed(4)})
              </span>
            )}
            {locError && <span style={locErrStyle}>{locError}</span>}
            {!locating && (
              <button style={retryBtn} onClick={locateMe}>
                {data.lat !== 0 ? 'עדכן מיקום' : 'נסה שוב'}
              </button>
            )}
          </div>
        )}

        {addressMode === 'manual' && (
          <input
            style={{ ...inputStyle, marginTop: 8 }}
            type="text"
            placeholder="רחוב, מספר, עיר"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
          />
        )}
      </Field>

      {/* Phone */}
      <Field label="טלפון ליצירת קשר" required>
        <input
          style={inputStyle}
          type="tel"
          inputMode="tel"
          placeholder="05X-XXXXXXX"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </Field>

      {/* WhatsApp toggle */}
      <div style={waRow}>
        <label style={waLabel} htmlFor="wa-toggle">פתוח לפניות וואטסאפ</label>
        <input
          id="wa-toggle"
          type="checkbox"
          style={waCheckbox}
          checked={data.whatsappEnabled}
          onChange={(e) => onChange({ whatsappEnabled: e.target.checked })}
        />
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={fieldWrapper}>
      <label style={labelStyle}>
        {label}
        {required && <span style={asterisk}> *</span>}
      </label>
      {children}
    </div>
  )
}

const wrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const fieldWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1B1B1B',
  textAlign: 'right',
}

const asterisk: React.CSSProperties = {
  color: '#DC3545',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: '1.5px solid #DEE2E6',
  fontSize: 15,
  color: '#1B1B1B',
  background: '#fff',
  direction: 'rtl',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const fieldHint: React.CSSProperties = {
  fontSize: 11,
  color: '#ADB5BD',
  textAlign: 'right',
  marginTop: 2,
}

const twoCol: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
}

const toggleRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexDirection: 'row-reverse',
  marginBottom: 4,
}

const toggleBtn: React.CSSProperties = {
  flex: 1,
  padding: '9px 0',
  borderRadius: 10,
  border: '1.5px solid #DEE2E6',
  background: '#F8F9FA',
  fontSize: 13,
  color: '#6C757D',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const toggleActive: React.CSSProperties = {
  border: '1.5px solid #2D6A4F',
  background: '#EAF2EE',
  color: '#2D6A4F',
}

const gpsBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '10px 12px',
  background: '#F8FCF9',
  borderRadius: 10,
  border: '1.5px solid #B7D5C8',
}

const locatingText: React.CSSProperties = {
  fontSize: 13,
  color: '#6C757D',
}

const locOk: React.CSSProperties = {
  fontSize: 13,
  color: '#2D6A4F',
  fontWeight: 600,
}

const locErrStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#DC3545',
}

const retryBtn: React.CSSProperties = {
  alignSelf: 'flex-end',
  background: 'none',
  border: 'none',
  fontSize: 12,
  color: '#2D6A4F',
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'inherit',
  textDecoration: 'underline',
}

const waRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  background: '#F8FCF9',
  borderRadius: 10,
  border: '1.5px solid #B7D5C8',
}

const waLabel: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1B1B1B',
}

const waCheckbox: React.CSSProperties = {
  width: 20,
  height: 20,
  accentColor: '#2D6A4F',
  cursor: 'pointer',
}
