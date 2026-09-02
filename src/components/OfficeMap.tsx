import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { contactContent, contactText } from '../lib/loadContact'
import { useI18n } from '../i18n'
import 'leaflet/dist/leaflet.css'

function officePinIcon() {
  const html = `
    <div class="office-pin">
      <span class="office-pin-dot"></span>
    </div>
  `
  return L.divIcon({
    className: 'office-pin-wrap',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

export function OfficeMap() {
  const { lang } = useI18n()
  const c = contactContent
  const center = useMemo<[number, number]>(() => [c.mapLat, c.mapLng], [c.mapLat, c.mapLng])
  const icon = useMemo(() => officePinIcon(), [])
  const line1 = contactText(c.addressLine1, lang)
  const line2 = contactText(c.addressLine2, lang)

  return (
    <div className="office-map">
      <MapContainer
        center={center}
        zoom={c.mapZoom}
        scrollWheelZoom={false}
        className="office-map-canvas"
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup>
            <strong>
              {line1}
              <br />
              {line2}
            </strong>
          </Popup>
        </Marker>
      </MapContainer>
      <p className="office-map-label" aria-hidden="true">
        {line1},
        <br />
        {line2}
      </p>
    </div>
  )
}
