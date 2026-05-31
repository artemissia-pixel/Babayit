import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Apartment } from '@/constants/apartments'

interface Props {
  apartment: Apartment
  onClose: () => void
  onEdit?: () => void   // only shown when caller provides it (i.e. the landlord)
}

export function ApartmentCard({ apartment, onClose, onEdit }: Props) {
  const { t } = useTranslation()
  const totalPrice = apartment.price + apartment.bills
  const photos = apartment.photos ?? []
  const [photoIndex, setPhotoIndex] = useState(0)

  const hasPhoto = photos.length > 0

  // Build optional info chips only for fields that are set
  const optionalChips: { icon: string; label: string }[] = []
  if (apartment.elevator === true)  optionalChips.push({ icon: '🛗', label: 'מעלית' })
  if (apartment.elevator === false) optionalChips.push({ icon: '🚶', label: 'אין מעלית' })
  if (apartment.parking === true)   optionalChips.push({ icon: '🅿️', label: 'חניה' })
  if (apartment.parking === false)  optionalChips.push({ icon: '🚫', label: 'אין חניה' })
  if (apartment.pets === 'allowed')   optionalChips.push({ icon: '🐾', label: 'חיות מחמד' })
  if (apartment.pets === 'forbidden') optionalChips.push({ icon: '🚫', label: 'אין חיות' })
  if (apartment.smoking === 'allowed')   optionalChips.push({ icon: '🚬', label: 'מותר לעשן' })
  if (apartment.smoking === 'forbidden') optionalChips.push({ icon: '🚭', label: 'אסור לעשן' })

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={backdropStyle} />

      {/* Card */}
      <div style={cardStyle} role="dialog" aria-modal="true">
        {/* Drag handle */}
        <div style={handleStyle} />

        {/* Image area */}
        <div style={imageWrapStyle}>
          {hasPhoto ? (
            <>
              <img
                src={photos[photoIndex]}
                alt=""
                style={photoImgStyle}
              />
              {photos.length > 1 && (
                <>
                  <button
                    style={{ ...navBtn, right: 8 }}
                    onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                    aria-label="הבא"
                  >›</button>
                  <button
                    style={{ ...navBtn, left: 8 }}
                    onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                    aria-label="הקודם"
                  >‹</button>
                  <div style={dotRow}>
                    {photos.map((_, i) => (
                      <div
                        key={i}
                        style={{ ...dot, ...(i === photoIndex ? dotActive : {}) }}
                        onClick={() => setPhotoIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={placeholderStyle}>
              <span style={{ fontSize: 28, opacity: 0.35 }}>🏠</span>
            </div>
          )}

          {apartment.isBrokerage && (
            <span style={brokerBadgeStyle}>{t('apartment.brokerageBadge')}</span>
          )}
          <button onClick={onClose} style={closeBtnStyle} aria-label={t('common.close')}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>

          {/* Total price */}
          <div style={priceRowStyle}>
            <div style={totalPriceStyle}>
              ₪{totalPrice.toLocaleString('he-IL')}
              <span style={perMonthStyle}> / חודש</span>
            </div>
            {apartment.bills > 0 && (
              <div style={priceBreakdownStyle}>
                שכ"ד ₪{apartment.price.toLocaleString('he-IL')} + חשבונות ~₪{apartment.bills}
              </div>
            )}
          </div>

          {/* Address */}
          <p style={addressStyle}>📍 {apartment.address}</p>

          {/* Core chips */}
          <div style={chipsStyle}>
            <Chip icon="🛏" label={`${apartment.rooms} ${t('apartment.rooms')}`} />
            <Chip icon="🏢" label={`${t('apartment.floor')} ${apartment.floor}`} />
            {apartment.size > 0 && (
              <Chip icon="📐" label={`${apartment.size} ${t('apartment.sqm')}`} />
            )}
            <Chip icon="📅" label={apartment.availableFrom} />
            {optionalChips.map((c, i) => (
              <Chip key={i} icon={c.icon} label={c.label} />
            ))}
          </div>

          {/* Edit button — landlord only */}
          {onEdit && (
            <button style={editBtnStyle} onClick={onEdit}>
              ✏️ עריכת פרטים
            </button>
          )}

          {/* Actions */}
          <div style={actionsStyle}>
            <button style={knockBtnStyle}>
              🚪 {t('apartment.knocking')}
            </button>
            <div style={secondaryRowStyle}>
              <a
                href={`tel:${apartment.phone}`}
                style={{ ...secondaryBtnStyle, textDecoration: 'none' }}
              >
                📞 {t('apartment.call')}
              </a>
              <a
                href={apartment.whatsapp
                  ? `https://wa.me/${apartment.whatsapp}`
                  : `sms:${apartment.phone}`}
                target={apartment.whatsapp ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{ ...secondaryBtnStyle, textDecoration: 'none' }}
              >
                💬 {t('apartment.message')}
              </a>
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
  maxHeight: '58vh',
  overflowY: 'auto',
}

const handleStyle: React.CSSProperties = {
  width: 36,
  height: 4,
  background: '#DEE2E6',
  borderRadius: 2,
  margin: '10px auto 0',
}

const imageWrapStyle: React.CSSProperties = {
  height: 90,
  position: 'relative',
  marginTop: 6,
  overflow: 'hidden',
}

const photoImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const placeholderStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #EAF2EE 0%, #D8EBE4 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const navBtn: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.4)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: 28,
  height: 28,
  fontSize: 18,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 2,
  fontFamily: 'inherit',
}

const dotRow: React.CSSProperties = {
  position: 'absolute',
  bottom: 6,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 4,
}

const dot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.55)',
  cursor: 'pointer',
}

const dotActive: React.CSSProperties = {
  background: '#fff',
}

const brokerBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  background: '#F4A261',
  color: '#fff',
  borderRadius: 6,
  padding: '3px 10px',
  fontSize: 12,
  fontWeight: 600,
  zIndex: 2,
}

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  left: 8,
  background: 'rgba(0,0,0,0.35)',
  color: '#fff',
  borderRadius: '50%',
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  lineHeight: 1,
  border: 'none',
  cursor: 'pointer',
  zIndex: 2,
  fontFamily: 'inherit',
}

const bodyStyle: React.CSSProperties = {
  padding: '12px 16px 24px',
}

const priceRowStyle: React.CSSProperties = {
  marginBottom: 4,
}

const totalPriceStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#2D6A4F',
  lineHeight: 1.2,
}

const perMonthStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#6C757D',
}

const priceBreakdownStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#6C757D',
  marginTop: 1,
}

const addressStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#6C757D',
  marginBottom: 10,
  marginTop: 4,
}

const chipsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 14,
}

const chipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: '#F0F4F2',
  borderRadius: 8,
  padding: '4px 9px',
  fontSize: 12,
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
  borderRadius: 12,
  padding: '13px 0',
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: 0.3,
  boxShadow: '0 3px 10px rgba(45,106,79,0.3)',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const secondaryRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
}

const editBtnStyle: React.CSSProperties = {
  width: '100%',
  background: 'none',
  border: '1.5px solid #DEE2E6',
  borderRadius: 10,
  padding: '10px 0',
  fontSize: 13,
  fontWeight: 600,
  color: '#6C757D',
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginBottom: 10,
}

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  background: '#F0F4F2',
  color: '#2D6A4F',
  borderRadius: 10,
  padding: '10px 0',
  fontSize: 13,
  fontWeight: 600,
}
