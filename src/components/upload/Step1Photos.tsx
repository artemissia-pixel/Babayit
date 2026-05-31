import React, { useRef } from 'react'

interface Props {
  photos: string[]
  onChange: (photos: string[]) => void
}

export function Step1Photos({ photos, onChange }: Props) {
  const galleryRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const r = new FileReader()
          r.onload = (e) => resolve(e.target?.result as string)
          r.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((results) => onChange([...photos, ...results]))
  }

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div style={wrapper}>
      <p style={hint}>הוסיפו תמונות של הדירה</p>

      {/* Photo grid */}
      <div style={grid}>
        {photos.map((src, i) => (
          <div key={i} style={thumb}>
            <img src={src} alt="" style={thumbImg} />
            <button style={removeBtn} onClick={() => removePhoto(i)} aria-label="הסר תמונה">
              ✕
            </button>
          </div>
        ))}

        {/* Add buttons — always visible */}
        <div style={addCell} onClick={() => galleryRef.current?.click()}>
          <span style={addIcon}>🖼</span>
          <span style={addLabel}>גלריה</span>
        </div>
        <div style={addCell} onClick={() => cameraRef.current?.click()}>
          <span style={addIcon}>📷</span>
          <span style={addLabel}>צלם</span>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {photos.length === 0 && (
        <p style={emptyHint}>אפשר גם להמשיך בלי תמונות</p>
      )}
    </div>
  )
}

const wrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const hint: React.CSSProperties = {
  fontSize: 14,
  color: '#6C757D',
  textAlign: 'right',
}

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 8,
}

const thumb: React.CSSProperties = {
  position: 'relative',
  aspectRatio: '1',
  borderRadius: 10,
  overflow: 'hidden',
  background: '#F0F4F2',
}

const thumbImg: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const removeBtn: React.CSSProperties = {
  position: 'absolute',
  top: 4,
  right: 4,
  background: 'rgba(0,0,0,0.45)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: 22,
  height: 22,
  fontSize: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const addCell: React.CSSProperties = {
  aspectRatio: '1',
  borderRadius: 10,
  border: '2px dashed #B7D5C8',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  cursor: 'pointer',
  background: '#F8FCF9',
}

const addIcon: React.CSSProperties = {
  fontSize: 22,
}

const addLabel: React.CSSProperties = {
  fontSize: 11,
  color: '#2D6A4F',
  fontWeight: 600,
}

const emptyHint: React.CSSProperties = {
  fontSize: 12,
  color: '#ADB5BD',
  textAlign: 'center',
  marginTop: 4,
}
