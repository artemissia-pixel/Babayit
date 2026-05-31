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
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (addressMode === 'gps' && data.lat === 0) locateMe()
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

  const addCustomField = () => {
    onChange({ customFields: [...data.customFields, { label: '', value: '' }] })
  }

  const updateCustomField = (i: number, key: 'label' | 'value', val: string) => {
    const updated = data.customFields.map((f, idx) =>
      idx === i ? { ...f, [key]: val } : f
    )
    onChange({ customFields: updated })
  }

  const removeCustomField = (i: number) => {
    onChange({ customFields: data.customFields.filter((_, idx) => idx !== i) })
  }

  return (
    <div style={wrapper}>
      {/* ── Required fields ─────────────────────────────── */}

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

      {/* Rooms + Floor + Elevator */}
      <div style={threeCol}>
        <Field label="חדרים" required>
          <select
            style={inputStyle}
            value={data.rooms || ''}
            onChange={(e) => onChange({ rooms: Number(e.target.value) })}
          >
            <option value="">-</option>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

        <Field label="קומה" required>
          <div style={floorRow}>
            <input
              style={{ ...inputStyle, width: 60, flexShrink: 0 }}
              type="number"
              inputMode="numeric"
              placeholder="3"
              value={data.floor === 0 && data.floor !== undefined ? '' : (data.floor ?? '')}
              onChange={(e) => onChange({ floor: e.target.value === '' ? 0 : Number(e.target.value) })}
            />
          </div>
        </Field>

        <Field label="מעלית">
          <YesNo
            value={data.elevator}
            onChange={(v) => onChange({ elevator: v })}
          />
        </Field>
      </div>

      <Field label="תאריך כניסה" required>
        <input
          style={inputStyle}
          type="date"
          value={data.availableFrom}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onChange({ availableFrom: e.target.value })}
        />
      </Field>

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
              <span style={locOk}>✓ מיקום נמצא ({data.lat.toFixed(4)}, {data.lng.toFixed(4)})</span>
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

      {/* ── Optional section ─────────────────────────────── */}
      <button style={expanderBtn} onClick={() => setExpanded((v) => !v)}>
        <span>פרטים נוספים (אופציונלי)</span>
        <span style={expanderArrow}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={optionalSection}>

          <div style={twoCol}>
            <Field label='שטח (מ"ר)'>
              <input
                style={inputStyle}
                type="number"
                inputMode="numeric"
                placeholder="75"
                value={data.size || ''}
                onChange={(e) => onChange({ size: Number(e.target.value) })}
              />
            </Field>
            <Field label="ארנונה (₪/חודש)">
              <input
                style={inputStyle}
                type="number"
                inputMode="numeric"
                placeholder="350"
                value={data.arnona || ''}
                onChange={(e) => onChange({ arnona: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="חשמל + מים ממוצע (₪/חודש)">
            <input
              style={inputStyle}
              type="number"
              inputMode="numeric"
              placeholder="250"
              value={data.avgBills || ''}
              onChange={(e) => onChange({ avgBills: Number(e.target.value) })}
            />
          </Field>

          <Field label="ספקים (חשמל, גז, אינטרנט...)">
            <input
              style={inputStyle}
              type="text"
              placeholder="חברת חשמל, פרטנר..."
              value={data.suppliers}
              onChange={(e) => onChange({ suppliers: e.target.value })}
            />
          </Field>

          {/* Toggle row: ac / internet */}
          <div style={toggleGrid}>
            <ToggleField
              label="מיזוג"
              value={data.ac}
              onChange={(v) => onChange({ ac: v })}
            />
            <ToggleField
              label="אינטרנט"
              value={data.internet}
              onChange={(v) => onChange({ internet: v })}
            />
            <ToggleField
              label="חניה"
              value={data.parking}
              onChange={(v) => onChange({ parking: v })}
            />
            <ToggleField
              label="מחסן"
              value={data.storage}
              onChange={(v) => onChange({ storage: v })}
            />
          </div>

          {/* Pets + smoking — allowed/forbidden */}
          <div style={twoCol}>
            <Field label="חיות מחמד">
              <AllowedForbidden
                value={data.pets}
                onChange={(v) => onChange({ pets: v })}
              />
            </Field>
            <Field label="עישון">
              <AllowedForbidden
                value={data.smoking}
                onChange={(v) => onChange({ smoking: v })}
              />
            </Field>
          </div>

          {/* Guarantee */}
          <div style={twoCol}>
            <Field label="ערבות (₪)">
              <input
                style={inputStyle}
                type="number"
                inputMode="numeric"
                placeholder="13000"
                value={data.guaranteeAmount || ''}
                onChange={(e) => onChange({ guaranteeAmount: Number(e.target.value) })}
              />
            </Field>
            <Field label="סוג ערבות">
              <input
                style={inputStyle}
                type="text"
                placeholder="בנקאית / שטר"
                value={data.guaranteeType}
                onChange={(e) => onChange({ guaranteeType: e.target.value })}
              />
            </Field>
          </div>

          <Field label="אורך חוזה מינימלי (חודשים)">
            <input
              style={inputStyle}
              type="number"
              inputMode="numeric"
              placeholder="12"
              value={data.minContractMonths || ''}
              onChange={(e) => onChange({ minContractMonths: Number(e.target.value) })}
            />
          </Field>

          <Field label="מה נשאר בדירה">
            <input
              style={inputStyle}
              type="text"
              placeholder="מדיח, מקרר, מכונת כביסה..."
              value={data.whatsLeft}
              onChange={(e) => onChange({ whatsLeft: e.target.value })}
            />
          </Field>

          <Field label="אופן תשלום מועדף">
            <input
              style={inputStyle}
              type="text"
              placeholder="צ'ק לשנה / העברה בנקאית"
              value={data.paymentMethod}
              onChange={(e) => onChange({ paymentMethod: e.target.value })}
            />
          </Field>

          {/* Custom fields */}
          {data.customFields.map((f, i) => (
            <div key={i} style={customFieldRow}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="text"
                placeholder="שם שדה"
                value={f.label}
                onChange={(e) => updateCustomField(i, 'label', e.target.value)}
              />
              <input
                style={{ ...inputStyle, flex: 2 }}
                type="text"
                placeholder="ערך"
                value={f.value}
                onChange={(e) => updateCustomField(i, 'value', e.target.value)}
              />
              <button style={removeFieldBtn} onClick={() => removeCustomField(i)} aria-label="הסר">✕</button>
            </div>
          ))}

          <button style={addFieldBtn} onClick={addCustomField}>
            + הוסף שדה חופשי
          </button>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

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

function YesNo({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div style={yesNoRow}>
      <Pill active={value === true} onClick={() => onChange(value === true ? null : true)}>כן</Pill>
      <Pill active={value === false} onClick={() => onChange(value === false ? null : false)}>לא</Pill>
    </div>
  )
}

function AllowedForbidden({
  value,
  onChange,
}: {
  value: 'allowed' | 'forbidden' | null
  onChange: (v: 'allowed' | 'forbidden' | null) => void
}) {
  return (
    <div style={yesNoRow}>
      <Pill active={value === 'allowed'} onClick={() => onChange(value === 'allowed' ? null : 'allowed')}>✓</Pill>
      <Pill active={value === 'forbidden'} danger onClick={() => onChange(value === 'forbidden' ? null : 'forbidden')}>✕</Pill>
    </div>
  )
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div style={toggleFieldWrap}>
      <span style={toggleFieldLabel}>{label}</span>
      <div style={yesNoRow}>
        <Pill active={value === true} onClick={() => onChange(value === true ? null : true)}>כן</Pill>
        <Pill active={value === false} onClick={() => onChange(value === false ? null : false)}>לא</Pill>
      </div>
    </div>
  )
}

function Pill({
  active,
  danger,
  onClick,
  children,
}: {
  active: boolean
  danger?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...pillBase,
        ...(active
          ? danger
            ? pillDanger
            : pillActive
          : {}),
      }}
    >
      {children}
    </button>
  )
}

// ── Styles ─────────────────────────────────────────────────

const wrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 }

const fieldWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#1B1B1B', textAlign: 'right' }

const asterisk: React.CSSProperties = { color: '#DC3545' }

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

const fieldHint: React.CSSProperties = { fontSize: 11, color: '#ADB5BD', textAlign: 'right', marginTop: 2 }

const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }

const threeCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }

const floorRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6 }

const toggleRow: React.CSSProperties = { display: 'flex', gap: 8, flexDirection: 'row-reverse', marginBottom: 4 }

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

const toggleActive: React.CSSProperties = { border: '1.5px solid #2D6A4F', background: '#EAF2EE', color: '#2D6A4F' }

const gpsBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '10px 12px',
  background: '#F8FCF9',
  borderRadius: 10,
  border: '1.5px solid #B7D5C8',
}

const locatingText: React.CSSProperties = { fontSize: 13, color: '#6C757D' }
const locOk: React.CSSProperties = { fontSize: 13, color: '#2D6A4F', fontWeight: 600 }
const locErrStyle: React.CSSProperties = { fontSize: 12, color: '#DC3545' }

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

const waLabel: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1B1B1B' }

const waCheckbox: React.CSSProperties = { width: 20, height: 20, accentColor: '#2D6A4F', cursor: 'pointer' }

const expanderBtn: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '13px 14px',
  background: '#F0F4F2',
  border: '1.5px solid #B7D5C8',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 700,
  color: '#2D6A4F',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const expanderArrow: React.CSSProperties = { fontSize: 10, color: '#6C757D' }

const optionalSection: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: '4px 0',
}

const toggleGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
}

const toggleFieldWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '10px 12px',
  background: '#F8F9FA',
  borderRadius: 10,
  border: '1.5px solid #DEE2E6',
}

const toggleFieldLabel: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#1B1B1B', textAlign: 'right' }

const yesNoRow: React.CSSProperties = { display: 'flex', gap: 6 }

const pillBase: React.CSSProperties = {
  flex: 1,
  padding: '7px 0',
  borderRadius: 8,
  border: '1.5px solid #DEE2E6',
  background: '#F8F9FA',
  fontSize: 13,
  fontWeight: 600,
  color: '#6C757D',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.12s',
}

const pillActive: React.CSSProperties = { background: '#EAF2EE', border: '1.5px solid #2D6A4F', color: '#2D6A4F' }
const pillDanger: React.CSSProperties = { background: '#FFF0F0', border: '1.5px solid #DC3545', color: '#DC3545' }

const customFieldRow: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center' }

const removeFieldBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 14,
  color: '#ADB5BD',
  cursor: 'pointer',
  padding: '0 4px',
  fontFamily: 'inherit',
  flexShrink: 0,
}

const addFieldBtn: React.CSSProperties = {
  background: 'none',
  border: '1.5px dashed #B7D5C8',
  borderRadius: 10,
  padding: '10px 0',
  width: '100%',
  fontSize: 14,
  fontWeight: 600,
  color: '#2D6A4F',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
