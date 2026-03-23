import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const selectedIcon = L.divIcon({
  className: 'selected-marker',
  html: `<div style="
    width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 12px rgba(99,102,241,0.5);
    display: flex; align-items: center; justify-content: center;
    animation: bounce 0.5s ease;
  "><div style="transform: rotate(45deg); color: white; font-size: 16px;">📍</div></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const venueIcon = (name) => L.divIcon({
  className: 'venue-label',
  html: `<div style="
    background: rgba(100,116,139,0.9); color: white;
    padding: 4px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 600;
    white-space: nowrap; width: max-content; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    cursor: pointer; transform: translate(-50%, -50%); text-align: center;
  ">${name}</div>`,
  iconSize: null,
  iconAnchor: [0, 0]
});

const campusVenues = [
  { name: 'Auditorium (LHC)', lat: 29.9468, lng: 76.8175 },
  { name: 'Lecture Hall Complex (LHC)', lat: 29.9472, lng: 76.8180 },
  { name: 'Computer Centre', lat: 29.9480, lng: 76.8190 },
  { name: 'Central Library', lat: 29.9485, lng: 76.8185 },
  { name: 'Sports Complex', lat: 29.9510, lng: 76.8170 },
  { name: 'Cricket Ground', lat: 29.9515, lng: 76.8160 },
  { name: 'Open Air Theatre (OAT)', lat: 29.9475, lng: 76.8195 },
  { name: 'Central Workshop', lat: 29.9460, lng: 76.8185 },
  { name: 'Admin Block', lat: 29.9490, lng: 76.8178 },
  { name: 'Cafeteria (Nescafe)', lat: 29.9478, lng: 76.8172 },
  { name: 'SAC (Student Activity Centre)', lat: 29.9482, lng: 76.8168 },
  { name: 'Techspardha Ground', lat: 29.9495, lng: 76.8195 },
];

const ClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        lat: e.latlng.lat.toFixed(6),
        lng: e.latlng.lng.toFixed(6),
        name: ''
      });
    }
  });
  return null;
};

const FlyTo = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 18, { duration: 0.8 });
  }, [center]);
  return null;
};

const LocationPicker = ({ lat, lng, locationName, onSelect }) => {
  const [position, setPosition] = useState(
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : null
  );
  const [flyTarget, setFlyTarget] = useState(null);

  const campusCenter = [29.9490, 76.8183];

  const handleLocationSelect = ({ lat, lng, name }) => {
    const newPos = [parseFloat(lat), parseFloat(lng)];
    setPosition(newPos);
    onSelect({ lat, lng, name });
  };

  const handleVenueClick = (venue) => {
    const newPos = [venue.lat, venue.lng];
    setPosition(newPos);
    setFlyTarget(newPos);
    onSelect({
      lat: venue.lat.toFixed(6),
      lng: venue.lng.toFixed(6),
      name: venue.name
    });
  };

  useEffect(() => {
    if (lat && lng) {
      setPosition([parseFloat(lat), parseFloat(lng)]);
    }
  }, [lat, lng]);

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
      {/* Quick venue selector */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-input)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          Quick select:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 }}>
          {campusVenues.slice(0, 6).map((venue, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleVenueClick(venue)}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 500,
                border: locationName === venue.name ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                background: locationName === venue.name ? 'var(--primary)' : 'var(--bg-card)',
                color: locationName === venue.name ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {venue.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '300px' }}>
        <MapContainer
          center={position || campusCenter}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler onLocationSelect={handleLocationSelect} />
          {flyTarget && <FlyTo center={flyTarget} />}

          {/* Venue reference labels */}
          {campusVenues.map((venue, i) => (
            <Marker
              key={`venue-${i}`}
              position={[venue.lat, venue.lng]}
              icon={venueIcon(venue.name)}
              eventHandlers={{
                click: () => handleVenueClick(venue)
              }}
            >
              <Popup>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{venue.name}</div>
                <button
                  type="button"
                  onClick={() => handleVenueClick(venue)}
                  style={{
                    marginTop: '0.4rem', padding: '0.3rem 0.75rem',
                    background: '#6366f1', color: 'white', border: 'none',
                    borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Select this venue
                </button>
              </Popup>
            </Marker>
          ))}

          {/* Selected position marker */}
          {position && (
            <Marker position={position} icon={selectedIcon}>
              <Popup>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>📍 Event Location</div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
                  Lat: {position[0].toFixed(6)}<br />
                  Lng: {position[1].toFixed(6)}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Info bar */}
      <div style={{
        padding: '0.6rem 1rem',
        background: 'var(--bg-input)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem'
      }}>
        {position ? (
          <>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>
              ✓ Location set: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Click map or venue to change
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>
            👆 Click on the map or select a venue above to set the event location
          </span>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
