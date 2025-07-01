import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
}

const Map = ({ coordinates }: MapProps) => (
  <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={17} style={{ height: 250, width: '100%', borderRadius: 12 }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[coordinates.lat, coordinates.lng]}>
      <Popup>
        {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
      </Popup>
    </Marker>
  </MapContainer>
);

export default Map;
