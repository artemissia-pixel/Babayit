import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { Apartment } from '@/constants/apartments'
import { Colors } from '@/constants/colors'

interface Props {
  apartment: Apartment
  isSelected: boolean
  onPress: (apt: Apartment) => void
}

export function ApartmentMarker({ apartment, isSelected, onPress }: Props) {
  const bg = apartment.isBrokerage
    ? Colors.markerBrokerage
    : isSelected
    ? Colors.markerSelected
    : Colors.markerDirect

  return (
    <AdvancedMarker
      position={{ lat: apartment.lat, lng: apartment.lng }}
      onClick={() => onPress(apartment)}
      zIndex={isSelected ? 10 : 1}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.15s ease, filter 0.15s ease',
        }}
      >
        <div
          style={{
            background: bg,
            color: '#fff',
            padding: '5px 10px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}
        >
          ₪{(apartment.price / 1000).toFixed(1)}k
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${bg}`,
          }}
        />
      </div>
    </AdvancedMarker>
  )
}
