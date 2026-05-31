import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  APIProvider,
  Map,
} from '@vis.gl/react-google-maps'
import { ApartmentMarker } from './ApartmentMarker'
import { ApartmentCard } from './ApartmentCard'
import { APARTMENTS, TEL_AVIV_CENTER, Apartment } from '@/constants/apartments'
import { Colors } from '@/constants/colors'

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

if (!GOOGLE_MAPS_KEY) {
  console.warn('[BaBayit] VITE_GOOGLE_MAPS_API_KEY is not set. Map will not load.')
}

export function MapScreen() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Apartment | null>(null)

  const handleMarkerPress = (apt: Apartment) => {
    setSelected(apt)
  }

  const handleMapClick = () => {
    setSelected(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
          <h1 style={titleStyle}>{t('map.title')}</h1>
          <span style={subtitleStyle}>{t('map.subtitle')}</span>
        </div>
        <div style={legendStyle}>
          <LegendDot color={Colors.markerDirect} label={t('map.direct')} />
          <LegendDot color={Colors.markerBrokerage} label={t('map.brokerage')} />
        </div>
      </header>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <APIProvider apiKey={GOOGLE_MAPS_KEY}>
          <Map
            defaultCenter={TEL_AVIV_CENTER}
            defaultZoom={14}
            mapId="DEMO_MAP_ID"
            onClick={handleMapClick}
            disableDefaultUI={false}
            gestureHandling="greedy"
            style={{ width: '100%', height: '100%' }}
          >
            {APARTMENTS.map((apt) => (
              <ApartmentMarker
                key={apt.id}
                apartment={apt}
                isSelected={selected?.id === apt.id}
                onPress={handleMarkerPress}
              />
            ))}
          </Map>
        </APIProvider>

        {/* Count badge */}
        <div style={countBadgeStyle}>
          {t('map.apartmentsInArea', { count: APARTMENTS.length })}
        </div>

        {/* Apartment card */}
        {selected && (
          <ApartmentCard
            apartment={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 12, color: '#6C757D' }}>{label}</span>
    </div>
  )
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  background: '#fff',
  borderBottom: '1px solid #DEE2E6',
  zIndex: 10,
  flexShrink: 0,
}

const titleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#2D6A4F',
  margin: 0,
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#6C757D',
}

const legendStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  gap: 12,
}

const countBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#2D6A4F',
  color: '#fff',
  borderRadius: 20,
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  zIndex: 10,
}
