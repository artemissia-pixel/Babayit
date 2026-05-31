import React from 'react'
import { useTranslation } from 'react-i18next'
import { Apartment } from '@/constants/apartments'

interface Props {
  apartment: Apartment
  onClose: () => void
}

export function ApartmentCard({ apartment, onClose }: Props) {
  const { t } = useTranslation()
  const totalPrice = apartment.price + apartment.bills

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={backdropStyle} />

      {/* Card */}
      <div style={cardStyle} role="dialog" aria-modal="true">
        {/* Drag handle */}
        <div style={handleStyle} />

        {/* Image placeholder */}
        <div style={imageStyle}>
          <span style={{ fontSize: 52, opacity: 0.4 }}>🏠</span>
          {apartment.isBrokerage && (
            <span style={brokerBadgeStyle}>{t('apartment.brokerageBadge')}</span>
          )}
          <button onClick={onClose} style={closeBtnStyle} aria-label={t('common.close')}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>

          {/* Total price — hero */}
          <div style={priceRowStyle}>
            <div>
              <div style={totalPriceStyle}>
                ₪{totalPrice.toLocaleString('he-IL')}
                <span style={perMonthStyle}> / חודש</span>
              </div>
              <div style={priceBreakdownStyle}>
                שכ"ד ₪{apartment.price.toLocaleString('he-IL')} + חשבונות ~₪{apartment.bills}
              </div>
            </div>
          </div>

          {/* Address */}
          <p style={addressStyle}>{apartment.address}</p>

          {/* Detail chips */}
          <div style={chipsStyle}>
            <Chip icon="🛏" label={`${apartment.rooms} ${t('apartment.rooms')}`} />
            <Chip icon="🏢" label={`${t('apartment.floor')} ${apartment.floor}`} />
            <Chip icon="📐" label={`${apartment.size} ${t('apartment.sqm')}`} />
            <Chip icon="📅" label={apartment.availableFrom} />
          </div>

          {/* Action buttons */}
          <div style={actionsStyle}>
            {/* Primary CTA */}
            <button style={knockBtnStyle}>
              🚪 {t('apartment.knocking')}
            </button>

            {/* Secondary row */}
            <div style={secondaryRowStyle}>
              <a
                href={`tel:${apartment.phone}`}
                style={{ ...secondaryBtnStyle, textDecoration: 'none' }}
              >
                📞 {t('apartment.call')}
              </a>

              {apartment.whatsapp ? (
                <a
                  href={`https://wa.me/${apartment.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...secondaryBtnStyle, textDecoration: 'none' }}
                >
                  💬 {t('apartment.message')}
                </a>
              ) : (
                <a
                  href={`sms:${apartment.phone}`}
                  style={{ ...secondaryBtnStyle, textDecoration: 'none' }}
                >
                  💬 {t('apartment.message')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={chipStyle}>
      <span style={{ marginLeft: 4 }}>{icon}</span>
      {label}
    </span>
  )
}

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 19,
}

const cardStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: '#fff',
  borderRadius: '20px 20px 0 0',
  boxShadow: '0 -4px 32px rgba(0,0,0,0.18)',
  zIndex: 20,
  direction: 'rtl',
  animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
  maxHeight: '90vh',
  overflowY: 'auto',
}

const handleStyle: React.CSSProperties = {
  width: 40,
  height: 4,
  background: '#DEE2E6',
  borderRadius: 2,
  margin: '12px auto 0',
}

const imageStyle: React.CSSProperties = {
  height: 180,
  background: '#F0F4F2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  marginTop: 8,
}

const brokerBadgeStyle: React.CSSProperties = {
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

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  left: 12,
  background: 'rgba(0,0,0,0.35)',
  color: '#fff',
  borderRadius: '50%',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  lineHeight: 1,
}

const bodyStyle: React.CSSProperties = {
  padding: '16px 16px 32px',
}

const priceRowStyle: React.CSSProperties = {
  marginBottom: 6,
}

const totalPriceStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: '#2D6A4F',
  lineHeight: 1.2,
}

const perMonthStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  color: '#6C757D',
}

const priceBreakdownStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#6C757D',
  marginTop: 2,
}

const addressStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6C757D',
  marginBottom: 14,
  marginTop: 6,
}

const chipsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 20,
}

const chipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: '#F0F4F2',
  borderRadius: 8,
  padding: '5px 10px',
  fontSize: 13,
  color: '#1B1B1B',
  fontWeight: 500,
}

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const knockBtnStyle: React.CSSProperties = {
  width: '100%',
  background: '#2D6A4F',
  color: '#fff',
  borderRadius: 14,
  padding: '16px 0',
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: 0.3,
  boxShadow: '0 4px 14px rgba(45,106,79,0.35)',
}

const secondaryRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
}

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  background: '#F0F4F2',
  color: '#2D6A4F',
  borderRadius: 12,
  padding: '12px 0',
  fontSize: 14,
  fontWeight: 600,
}
