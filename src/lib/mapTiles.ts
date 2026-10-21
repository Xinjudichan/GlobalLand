/**
 * Shared basemap for every Leaflet map on the site.
 * CARTO basemaps started requiring an API key (tiles render an "API KEY REQUIRED"
 * watermark without one), so we use the keyless OpenStreetMap standard tiles.
 */
export const mapTiles = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}

/** CMS projects default unset coordinates to 0/0; treat those (and out-of-range values) as missing. */
export function hasCoords(p: { lat: number; lng: number }) {
  return (
    Number.isFinite(p.lat) &&
    Number.isFinite(p.lng) &&
    Math.abs(p.lat) <= 90 &&
    Math.abs(p.lng) <= 180 &&
    !(p.lat === 0 && p.lng === 0)
  )
}
