import React, { useEffect, useState } from 'react'
import { UploadData } from './UploadFlow'

interface Props {
  data: UploadData
  onChange: (data: Partial<UploadData>) => void
  onTryNext: () => void
  registerValidator: (fn: () => boolean) => void
}

const FIELD_IDS = {
  price: 'field-price',
  rooms: 'field-rooms',
  floor: 'field-floor',
  availableFrom: 'field-date',
  location: 'field-location',
  phone: 'field-phone',
}

export function Step2Details({ data, onChange, registerValidator }: Props) {
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')
  const [addressMode, setAddressMode] = useState<'gps' | 'manual'>(
    data.lat !== 0 ? 'gps' : 'manual'
  )
  const [expanded, setExpanded] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { registerValidator(validate) })

  useEffect(() => {
    if (addressMode === 'gps' && data.lat === 0) locateMe()
  }, [addressMode])

  const locateMe = () => {
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => { onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false) },
      () => { setLocError('לא ניתן לאתר מיקום. בדקו הרשאות או הקלידו כתובת.'); setLocating(false); setAddressMode('manual') },
      { timeout: 8000 }
    )
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!data.price || data.price <= 0) e[FIELD_IDS.price] = 'נא להזין שכר דירה'
    if (!data.rooms) e[FIELD_IDS.rooms] = 'נא לבחור מספר חדרים'
    if (data.floor === undefined || data.floor === null || String(data.floor) === '') e[FIELD_IDS.floor] = 'נא להזין קומה'
    if (!data.availableFrom) e[FIELD_IDS.availableFrom] = 'נא לבחור תאריך כניסה'
    if (addressMode === 'manual' && !data.address.trim()) e[FIELD_IDS.location] = 'נא להזין כתובת'
    if (addressMode === 'gps' && data.lat === 0) e[FIELD_IDS.location] = 'נא לאתר מיקום או להחליף לכתובת ידנית'
    if (!data.phone.trim()) e[FIELD_IDS.phone] = 'נא להזין מספר טלפון'
    setErrors(e)
    if (Object.keys(e).length > 0) {
      document.getElementById(Object.keys(e)[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const clrErr = (id: string) => setErrors((prev) => { const n = { ...prev }; delete n[id]; return n })

  const totalBills =
    data.billElec + data.billWater + data.billArnona +
    data.billGas + data.billVaad + data.billInternet

  const addCustomField = () => onChange({ customFields: [...data.customFields, { label: '', value: '' }] })
  const updateCustomField = (i: number, key: 'label' | 'value', val: string) =>
    onChange({ customFields: data.customFields.map((f, idx) => idx === i ? { ...f, [key]: val } : f) })
  const removeCustomField = (i: number) =>
    onChange({ customFields: data.customFields.filter((_, idx) => idx !== i) })

  return (
    <div style={wrapper}>

      {/* ── Required fields ─────────────────────────── */}

      <Field id={FIELD_IDS.price} label="שכר דירה (₪ לחודש)" required error={errors[FIELD_IDS.price]}>
        <input
          style={iS(!!errors[FIELD_IDS.price])} type="number" inputMode="numeric" placeholder="6500"
          value={data.price || ''}
          onChange={(e) => { onChange({ price: Number(e.target.value) }); clrErr(FIELD_IDS.price) }}
        />
      </Field>

      <div style={threeCol}>
        <Field id={FIELD_IDS.rooms} label="חדרים" required error={errors[FIELD_IDS.rooms]}>
          <select style={iS(!!errors[FIELD_IDS.rooms])} value={data.rooms || ''}
            onChange={(e) => { onChange({ rooms: Number(e.target.value) }); clrErr(FIELD_IDS.rooms) }}>
            <option value="">-</option>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field id={FIELD_IDS.floor} label="קומה" required error={errors[FIELD_IDS.floor]}>
          <input style={iS(!!errors[FIELD_IDS.floor])} type="number" inputMode="numeric" placeholder="3"
            value={data.floor === 0 ? '' : (data.floor ?? '')}
            onChange={(e) => { onChange({ floor: e.target.value === '' ? 0 : Number(e.target.value) }); clrErr(FIELD_IDS.floor) }}
          />
        </Field>

        <Field label="מעלית">
          <YesNo value={data.elevator} onChange={(v) => onChange({ elevator: v })} />
        </Field>
      </div>

      <Field id={FIELD_IDS.availableFrom} label="תאריך כניסה" required error={errors[FIELD_IDS.availableFrom]}>
        <input style={iS(!!errors[FIELD_IDS.availableFrom])} type="date" value={data.availableFrom}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => { onChange({ availableFrom: e.target.value }); clrErr(FIELD_IDS.availableFrom) }}
        />
      </Field>

      <Field id={FIELD_IDS.location} label="מיקום" required error={errors[FIELD_IDS.location]}>
        <div style={toggleRow}>
          <button style={{ ...toggleBtn, ...(addressMode === 'gps' ? toggleActive : {}) }}
            onClick={() => { setAddressMode('gps'); clrErr(FIELD_IDS.location) }}>📍 GPS</button>
          <button style={{ ...toggleBtn, ...(addressMode === 'manual' ? toggleActive : {}) }}
            onClick={() => setAddressMode('manual')}>✏️ כתובת ידנית</button>
        </div>
        {addressMode === 'gps' && (
          <div style={{ ...gpsBox, ...(errors[FIELD_IDS.location] ? gpsBoxError : {}) }}>
            {locating && <span style={locatingText}>מאתר מיקום...</span>}
            {!locating && data.lat !== 0 && <span style={locOk}>✓ מיקום נמצא ({data.lat.toFixed(4)}, {data.lng.toFixed(4)})</span>}
            {locError && <span style={locErrTxt}>{locError}</span>}
            {!locating && (
              <button style={retryBtn} onClick={() => { locateMe(); clrErr(FIELD_IDS.location) }}>
                {data.lat !== 0 ? 'עדכן מיקום' : 'נסה שוב'}
              </button>
            )}
          </div>
        )}
        {addressMode === 'manual' && (
          <input style={{ ...iS(!!errors[FIELD_IDS.location]), marginTop: 8 }} type="text"
            placeholder="רחוב, מספר, עיר" value={data.address}
            onChange={(e) => { onChange({ address: e.target.value }); clrErr(FIELD_IDS.location) }}
          />
        )}
      </Field>

      {/* ── Optional expander — right before contact ─── */}
      <button style={expanderBtn} onClick={() => setExpanded((v) => !v)}>
        <span>פרטים נוספים (אופציונלי)</span>
        <span style={expanderArrow}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={optionalSection}>

          <Field label='שטח (מ"ר)'>
            <input style={inputStyle} type="number" inputMode="numeric" placeholder="75"
              value={data.size || ''} onChange={(e) => onChange({ size: Number(e.target.value) })} />
          </Field>

          {/* Per-bill rows */}
          <div style={billsSectionLabel}>חשבונות חודשיים (₪ + ספק)</div>

          <BillRow label="חשמל" amount={data.billElec} provider={data.billElecProvider}
            onAmount={(v) => onChange({ billElec: v })} onProvider={(v) => onChange({ billElecProvider: v })} />
          <BillRow label="מים" amount={data.billWater} provider={data.billWaterProvider}
            onAmount={(v) => onChange({ billWater: v })} onProvider={(v) => onChange({ billWaterProvider: v })} />
          <BillRow label="ארנונה" amount={data.billArnona} provider={data.billArnonaProvider}
            onAmount={(v) => onChange({ billArnona: v })} onProvider={(v) => onChange({ billArnonaProvider: v })} />
          <BillRow label="גז" amount={data.billGas} provider={data.billGasProvider}
            onAmount={(v) => onChange({ billGas: v })} onProvider={(v) => onChange({ billGasProvider: v })} />
          <BillRow label="ועד בית" amount={data.billVaad} provider={data.billVaadProvider}
            onAmount={(v) => onChange({ billVaad: v })} onProvider={(v) => onChange({ billVaadProvider: v })} />

          {/* Internet — extra toggle */}
          <div style={internetRow}>
            <div style={{ flex: 1 }}>
              <BillRow label="אינטרנט" amount={data.billInternet} provider={data.billInternetProvider}
                onAmount={(v) => onChange({ billInternet: v })} onProvider={(v) => onChange({ billInternetProvider: v })} />
            </div>
            <div style={fiberToggle}>
              <button style={{ ...fiberBtn, ...(data.internetType === 'fiber' ? fiberActive : {}) }}
                onClick={() => onChange({ internetType: data.internetType === 'fiber' ? null : 'fiber' })}>סיבים</button>
              <button style={{ ...fiberBtn, ...(data.internetType === 'cable' ? fiberActive : {}) }}
                onClick={() => onChange({ internetType: data.internetType === 'cable' ? null : 'cable' })}>רגיל</button>
            </div>
          </div>

          {totalBills > 0 && (
            <div style={billsTotal}>
              סה"כ חשבונות: ~₪{totalBills.toLocaleString('he-IL')} / חודש
              <span style={billsTotalPrice}> | כולל שכ"ד: ₪{(data.price + totalBills).toLocaleString('he-IL')}</span>
            </div>
          )}

          <div style={toggleGrid}>
            <ToggleField label="מיזוג" value={data.ac} onChange={(v) => onChange({ ac: v })} />
            <ToggleField label="חניה" value={data.parking} onChange={(v) => onChange({ parking: v })} />
            <ToggleField label="מחסן" value={data.storage} onChange={(v) => onChange({ storage: v })} />
          </div>

          <div style={twoCol}>
            <Field label="חיות מחמד">
              <AllowedForbidden value={data.pets} onChange={(v) => onChange({ pets: v })} />
            </Field>
            <Field label="עישון">
              <AllowedForbidden value={data.smoking} onChange={(v) => onChange({ smoking: v })} />
            </Field>
          </div>

          <div style={twoCol}>
            <Field label="ערבות (₪)">
              <input style={inputStyle} type="number" inputMode="numeric" placeholder="13000"
                value={data.guaranteeAmount || ''} onChange={(e) => onChange({ guaranteeAmount: Number(e.target.value) })} />
            </Field>
            <Field label="סוג ערבות">
              <input style={inputStyle} type="text" placeholder="בנקאית / שטר"
                value={data.guaranteeType} onChange={(e) => onChange({ guaranteeType: e.target.value })} />
            </Field>
          </div>

          <Field label="אורך חוזה מינימלי (חודשים)">
            <input style={inputStyle} type="number" inputMode="numeric" placeholder="12"
              value={data.minContractMonths || ''} onChange={(e) => onChange({ minContractMonths: Number(e.target.value) })} />
          </Field>

          <Field label="מה נשאר בדירה">
            <input style={inputStyle} type="text" placeholder="מדיח, מקרר, מכונת כביסה..."
              value={data.whatsLeft} onChange={(e) => onChange({ whatsLeft: e.target.value })} />
          </Field>

          <Field label="אופן תשלום מועדף">
            <input style={inputStyle} type="text" placeholder="צ'ק לשנה / העברה בנקאית"
              value={data.paymentMethod} onChange={(e) => onChange({ paymentMethod: e.target.value })} />
          </Field>

          {data.customFields.map((f, i) => (
            <div key={i} style={customFieldRow}>
              <input style={{ ...inputStyle, flex: 1 }} type="text" placeholder="שם שדה"
                value={f.label} onChange={(e) => updateCustomField(i, 'label', e.target.value)} />
              <input style={{ ...inputStyle, flex: 2 }} type="text" placeholder="ערך"
                value={f.value} onChange={(e) => updateCustomField(i, 'value', e.target.value)} />
              <button style={removeFieldBtn} onClick={() => removeCustomField(i)} aria-label="הסר">✕</button>
            </div>
          ))}

          <button style={addFieldBtn} onClick={addCustomField}>+ הוסף שדה חופשי</button>
        </div>
      )}

      {/* ── Contact fields ──────────────────────────── */}
      <Field id={FIELD_IDS.phone} label="טלפון ליצירת קשר" required error={errors[FIELD_IDS.phone]}>
        <input style={iS(!!errors[FIELD_IDS.phone])} type="tel" inputMode="tel" placeholder="05X-XXXXXXX"
          value={data.phone} onChange={(e) => { onChange({ phone: e.target.value }); clrErr(FIELD_IDS.phone) }}
        />
      </Field>

      <div style={waRow}>
        <label style={waLabel} htmlFor="wa-toggle">פתוח לפניות וואטסאפ</label>
        <input id="wa-toggle" type="checkbox" style={waCheckbox}
          checked={data.whatsappEnabled}
          onChange={(e) => onChange({ whatsappEnabled: e.target.checked })} />
      </div>

    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function BillRow({ label, amount, provider, onAmount, onProvider }: {
  label: string; amount: number; provider: string
  onAmount: (v: number) => void; onProvider: (v: string) => void
}) {
  return (
    <div style={billRow}>
      <span style={billLabel}>{label}</span>
      <input
        style={{ ...inputStyle, width: 80, flexShrink: 0, textAlign: 'center' }}
        type="number" inputMode="numeric" placeholder="₪"
        value={amount || ''} onChange={(e) => onAmount(Number(e.target.value))}
      />
      <input
        style={{ ...inputStyle, flex: 1, fontSize: 13 }}
        type="text" placeholder="ספק"
        value={provider} onChange={(e) => onProvider(e.target.value)}
      />
    </div>
  )
}

function Field({ id, label, required, error, children }: {
  id?: string; label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div id={id} style={fieldWrapper}>
      <label style={labelStyle}>{label}{required && <span style={asterisk}> *</span>}</label>
      {children}
      {error && <span style={errorMsg}>{error}</span>}
    </div>
  )
}

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean | null) => void }) {
  return (
    <div style={yesNoRow}>
      <Pill active={value === true} onClick={() => onChange(value === true ? null : true)}>כן</Pill>
      <Pill active={value === false} onClick={() => onChange(value === false ? null : false)}>לא</Pill>
    </div>
  )
}

function AllowedForbidden({ value, onChange }: { value: 'allowed' | 'forbidden' | null; onChange: (v: 'allowed' | 'forbidden' | null) => void }) {
  return (
    <div style={yesNoRow}>
      <Pill active={value === 'allowed'} onClick={() => onChange(value === 'allowed' ? null : 'allowed')}>✓</Pill>
      <Pill active={value === 'forbidden'} danger onClick={() => onChange(value === 'forbidden' ? null : 'forbidden')}>✕</Pill>
    </div>
  )
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean | null) => void }) {
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

function Pill({ active, danger, onClick, children }: { active: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ ...pillBase, ...(active ? (danger ? pillDanger : pillActive) : {}) }}>
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
  width: '100%', padding: '11px 12px', borderRadius: 10,
  border: '1.5px solid #DEE2E6', fontSize: 15, color: '#1B1B1B',
  background: '#fff', direction: 'rtl', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
}

const iS = (hasError: boolean): React.CSSProperties => ({
  ...inputStyle,
  ...(hasError ? { border: '1.5px solid #DC3545', background: '#FFF8F8' } : {}),
})

const errorMsg: React.CSSProperties = { fontSize: 12, color: '#DC3545', textAlign: 'right', marginTop: 2 }
const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }
const threeCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }

const toggleRow: React.CSSProperties = { display: 'flex', gap: 8, flexDirection: 'row-reverse', marginBottom: 4 }
const toggleBtn: React.CSSProperties = {
  flex: 1, padding: '9px 0', borderRadius: 10, border: '1.5px solid #DEE2E6',
  background: '#F8F9FA', fontSize: 13, color: '#6C757D', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
}
const toggleActive: React.CSSProperties = { border: '1.5px solid #2D6A4F', background: '#EAF2EE', color: '#2D6A4F' }

const gpsBox: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px',
  background: '#F8FCF9', borderRadius: 10, border: '1.5px solid #B7D5C8',
}
const gpsBoxError: React.CSSProperties = { border: '1.5px solid #DC3545', background: '#FFF8F8' }
const locatingText: React.CSSProperties = { fontSize: 13, color: '#6C757D' }
const locOk: React.CSSProperties = { fontSize: 13, color: '#2D6A4F', fontWeight: 600 }
const locErrTxt: React.CSSProperties = { fontSize: 12, color: '#DC3545' }
const retryBtn: React.CSSProperties = {
  alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: 12,
  color: '#2D6A4F', fontWeight: 600, cursor: 'pointer', padding: 0,
  fontFamily: 'inherit', textDecoration: 'underline',
}

const expanderBtn: React.CSSProperties = {
  display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between',
  alignItems: 'center', width: '100%', padding: '13px 14px',
  background: '#F0F4F2', border: '1.5px solid #B7D5C8', borderRadius: 12,
  fontSize: 14, fontWeight: 700, color: '#2D6A4F', cursor: 'pointer', fontFamily: 'inherit',
}
const expanderArrow: React.CSSProperties = { fontSize: 10, color: '#6C757D' }

const optionalSection: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }

const billsSectionLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: '#6C757D',
  textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5,
}

const billRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, direction: 'rtl',
}

const billLabel: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: '#1B1B1B',
  width: 52, flexShrink: 0, textAlign: 'right',
}

const internetRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 }

const fiberToggle: React.CSSProperties = {
  display: 'flex', gap: 6, paddingRight: 60,
}

const fiberBtn: React.CSSProperties = {
  flex: 1, padding: '6px 0', borderRadius: 8, border: '1.5px solid #DEE2E6',
  background: '#F8F9FA', fontSize: 12, fontWeight: 600, color: '#6C757D',
  cursor: 'pointer', fontFamily: 'inherit',
}
const fiberActive: React.CSSProperties = { background: '#EAF2EE', border: '1.5px solid #2D6A4F', color: '#2D6A4F' }

const billsTotal: React.CSSProperties = {
  fontSize: 12, color: '#6C757D', textAlign: 'right',
  padding: '8px 12px', background: '#F8FCF9',
  borderRadius: 8, border: '1px solid #B7D5C8',
}
const billsTotalPrice: React.CSSProperties = { fontWeight: 700, color: '#2D6A4F' }

const toggleGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }
const toggleFieldWrap: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px',
  background: '#F8F9FA', borderRadius: 10, border: '1.5px solid #DEE2E6',
}
const toggleFieldLabel: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#1B1B1B', textAlign: 'right' }
const yesNoRow: React.CSSProperties = { display: 'flex', gap: 6 }

const pillBase: React.CSSProperties = {
  flex: 1, padding: '7px 0', borderRadius: 8, border: '1.5px solid #DEE2E6',
  background: '#F8F9FA', fontSize: 13, fontWeight: 600, color: '#6C757D',
  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
}
const pillActive: React.CSSProperties = { background: '#EAF2EE', border: '1.5px solid #2D6A4F', color: '#2D6A4F' }
const pillDanger: React.CSSProperties = { background: '#FFF0F0', border: '1.5px solid #DC3545', color: '#DC3545' }

const waRow: React.CSSProperties = {
  display: 'flex', flexDirection: 'row-reverse', alignItems: 'center',
  justifyContent: 'space-between', padding: '12px 14px',
  background: '#F8FCF9', borderRadius: 10, border: '1.5px solid #B7D5C8',
}
const waLabel: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1B1B1B' }
const waCheckbox: React.CSSProperties = { width: 20, height: 20, accentColor: '#2D6A4F', cursor: 'pointer' }

const customFieldRow: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center' }
const removeFieldBtn: React.CSSProperties = {
  background: 'none', border: 'none', fontSize: 14, color: '#ADB5BD',
  cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit', flexShrink: 0,
}
const addFieldBtn: React.CSSProperties = {
  background: 'none', border: '1.5px dashed #B7D5C8', borderRadius: 10,
  padding: '10px 0', width: '100%', fontSize: 14, fontWeight: 600,
  color: '#2D6A4F', cursor: 'pointer', fontFamily: 'inherit',
}
