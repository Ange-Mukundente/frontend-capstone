'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const farmerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const vetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const selectedVetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Vet {
  id: number
  name: string
  specialty: string
  location: string
  rating: number
  lat: number
  lng: number
}

interface VetMapProps {
  vets: Vet[]
  farmerLocation: [number, number]
  onVetSelect: (vetId: number) => void
  selectedVetId: number | null
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export default function VetMap({ vets, farmerLocation, onVetSelect, selectedVetId }: VetMapProps) {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={farmerLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={farmerLocation} />
        
        {/* Farmer location marker */}
        <Marker position={farmerLocation} icon={farmerIcon}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
              <p className="text-sm text-gray-600">You are here</p>
            </div>
          </Popup>
        </Marker>

        {/* Vet markers */}
        {vets.map((vet) => {
          const distance = calculateDistance(
            farmerLocation[0],
            farmerLocation[1],
            vet.lat,
            vet.lng
          )
          const isSelected = selectedVetId === vet.id

          return (
            <Marker
              key={vet.id}
              position={[vet.lat, vet.lng]}
              icon={isSelected ? selectedVetIcon : vetIcon}
              eventHandlers={{
                click: () => onVetSelect(vet.id)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-lg">{vet.name}</h3>
                  <p className="text-sm text-gray-600">{vet.specialty}</p>
                  <p className="text-sm text-gray-500">{vet.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{vet.rating}</span>
                  </div>
                  <p className="text-sm font-medium text-green-600 mt-2">
                    {distance.toFixed(1)} km away
                  </p>
                  <button
                    onClick={() => onVetSelect(vet.id)}
                    className="mt-3 w-full bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                  >
                    Select This Vet
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

// Calculate distance
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}