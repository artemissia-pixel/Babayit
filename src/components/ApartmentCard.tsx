import { useTranslation } from 'react-i18next'
import { Apartment } from '@/constants/apartments'

interface Props {
  apartment: Apartment
  onClose: () => void
}

export function ApartmentCard({ apartment, onClose }: Props) {
  const { t } = useTranslation()

  return (
    <div style={card}>
      {/* Image placeholder */}
      <div style={imagePlaceholder}>
        <span style={{ fontSize: 48 }}>📷</span>
        {apartment.isBrokerage && (
          <div style={brokerageBadge}>{t('apartment.brokerageBadge')}</div>
        )}
      </div>

      <div style={body}>
        {/* Header row */}
        <div style={headerRow}>
          <span style={price}>
            {t('apartment.price', { amount: apartment.price.toLocaleString('he-IL') })}
          </span>
          <button onClick={onClose} style={closeBtn} aria-label="סגור">
            {t('common.close')}
          </button>
        </div>

        <p style={address}>{apartment.address}</p>

        {/* Chips */}
        <div style={chips}>
          <Chip label={`${apartment.rooms} ${t('apartment.rooms')}`} />
          <Chip label={`${t('apartment.floor')} ${apartment.floor}`} />
          <Chip label={`${apartment.size} ${t('apartment.sqm')}`} />
        </div>

        <p style={available}>
          {t('apartment.available', { date: apartment.availableFrom })}
        </p>

        <button style={knockBtn}>
          {t('apartment.knocking')}
        </button>
      </div>
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{
      background: '#F8F9FA',
      border: '1px solid #DEE2E6',
      borderRadius: 8,
      padding: '4px 10px',
      fontSize: 13,
      color: '#1B1B1B',
    }}>
      {label}
    </span>
  )
}

// Inline styles (no CSS module deps, keeps it self-contained)
const card: React.CSSProperties = {
  position: 'absolute',
  bottom: 32,
  right: 16,
  left: 16,
  maxWidth: 420,
  margin: '0 auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  overflow: 'hidden',
  zIndex: 20,
  direction: 'rtl',
}

const imagePlaceholder: React.CSSProperties = {
  height: 160,
  background: '#F8F9FA',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}

const brokerageBadge: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: '#F4A261',
  color: '#fff',
  borderRadius: 6,
  padding: '3px 10px',
  fontSize: 12,
  fontWeight: 600,
}

const body: React.CSSProperties = {
  padding: 16,
}

const headerRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
}

const price: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#2D6A4F',
}

const closeBtn: React.CSSProperties = {
  background: 'none',
  fontSize: 16,
  color: '#6C757D',
  padding: 4,
  lineHeight: 1,
}

const address: React.CSSProperties = {
  fontSize: 14,
  color: '#6C757D',
  marginBottom: 10,
}

const chips: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 10,
}

const available: React.CSSProperties = {
  fontSize: 13,
  color: '#6C757D',
  marginBottom: 14,
}

const knockBtn: React.CSSProperties = {
  width: '100%',
  background: '#2D6A4F',
  color: '#fff',
  borderRadius: 12,
  padding: '14px 0',
  fontSize: 16,
  fontWeight: 700,
}
