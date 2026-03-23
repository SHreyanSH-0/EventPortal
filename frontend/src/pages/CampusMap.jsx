import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import { formatDate, getCategoryColor } from '../utils/helpers';

// Fix default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    "><div style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">📍</div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Campus venue markers
const campusVenues = [
  { name: 'Auditorium (LHC)', lat: 29.9468, lng: 76.8175, type: 'Auditorium' },
  { name: 'Lecture Hall Complex (LHC)', lat: 29.9472, lng: 76.8180, type: 'Academic' },
  { name: 'Computer Centre', lat: 29.9480, lng: 76.8190, type: 'Lab' },
  { name: 'Central Library', lat: 29.9485, lng: 76.8185, type: 'Library' },
  { name: 'Sports Complex', lat: 29.9510, lng: 76.8170, type: 'Sports' },
  { name: 'Cricket Ground', lat: 29.9515, lng: 76.8160, type: 'Sports' },
  { name: 'Open Air Theatre (OAT)', lat: 29.9475, lng: 76.8195, type: 'Theatre' },
  { name: 'Central Workshop', lat: 29.9460, lng: 76.8185, type: 'Workshop' },
  { name: 'Admin Block', lat: 29.9490, lng: 76.8178, type: 'Admin' },
  { name: 'Cafeteria (Nescafe)', lat: 29.9478, lng: 76.8172, type: 'Food' },
  { name: 'SAC (Student Activity Centre)', lat: 29.9482, lng: 76.8168, type: 'Activity' },
  { name: 'Techspardha Ground', lat: 29.9495, lng: 76.8195, type: 'Fest' },
];

const FlyToEvent = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 17, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const CampusMap = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [loading, setLoading] = useState(true);

  const campusCenter = [29.9490, 76.8183];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events?upcoming=true');
        setEvents(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event._id);
    if (event.coordinates) {
      setFlyTo([event.coordinates.lat, event.coordinates.lng]);
    }
  };

  return (
    <div className="map-page">
      <div className="map-container">
        <MapContainer center={campusCenter} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {flyTo && <FlyToEvent center={flyTo} />}

          {/* Venue markers */}
          {campusVenues.map((venue, i) => (
            <Marker key={`venue-${i}`} position={[venue.lat, venue.lng]}
              icon={L.divIcon({
                className: 'venue-marker',
                html: `<div style="background: rgba(100,116,139,0.9); color: white; padding: 4px 10px; border-radius: 6px; transform: translate(-50%, -50%); font-size: 11px; font-weight: 600; white-space: nowrap; width: max-content; box-shadow: 0 2px 4px rgba(0,0,0,0.3); text-align: center;">${venue.name}</div>`,
                iconSize: null,
                iconAnchor: [0, 0]
              })}
            >
              <Popup>
                <div className="map-popup">
                  <h4>🏛️ {venue.name}</h4>
                  <p>Type: {venue.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Event markers */}
          {events.map(event => (
            event.coordinates && (
              <Marker
                key={event._id}
                position={[event.coordinates.lat, event.coordinates.lng]}
                icon={createCustomIcon(getCategoryColor(event.category))}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{event.title}</h4>
                    <p>📅 {formatDate(event.date)} · {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.attendees || 0} attending</p>
                    <Link to={`/events/${event._id}`} style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.85rem' }}>
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

        {/* Sidebar */}
        <div className="map-sidebar glass">
          <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: '1rem', fontSize: '1.1rem' }}>
            📍 Events on Campus
          </h3>
          {loading ? <div className="spinner"></div> : (
            events.map(event => (
              <div
                key={event._id}
                className={`map-event-item ${selectedEvent === event._id ? 'active' : ''}`}
                onClick={() => handleEventClick(event)}
                style={selectedEvent === event._id ? { background: 'var(--bg-hover)', borderColor: 'var(--primary)' } : {}}
              >
                <div style={{ fontSize: '0.75rem', color: getCategoryColor(event.category), fontWeight: 600, textTransform: 'uppercase' }}>
                  {event.club?.name}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0.2rem 0' }}>{event.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatDate(event.date)} · {event.location}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
