import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

interface Amenity {
  name: string;
  distance: number; // in km
  type: 'hospital' | 'school' | 'market' | 'park' | 'transport';
}

interface MapProps {
  shape?: { lat: number; lng: number }[];
  amenities?: Amenity[];
}

const Map = ({ shape, amenities }: MapProps) => {
  const [satellite, setSatellite] = useState(false);
  const [planning, setPlanning] = useState(false);
  // Tính centroid
  let centroid = { lat: 0, lng: 0 };
  if (Array.isArray(shape) && shape.length > 0) {
    let latSum = 0, lngSum = 0;
    for (const pt of shape) {
      latSum += pt.lat;
      lngSum += pt.lng;
    }
    centroid.lat = latSum / shape.length;
    centroid.lng = lngSum / shape.length;
  } else {
    centroid = { lat: 10.762622, lng: 106.660172 };
  }
  // State for map center
  const [mapCenter, setMapCenter] = useState(centroid);
  // Component to track map center
  function CenterTracker() {
    useMapEvents({
      moveend: (e) => {
        const c = e.target.getCenter();
        setMapCenter({ lat: c.lat, lng: c.lng });
      }
    });
    return null;
  }

  // Xác định thành phố dựa trên centroid
  function getPlanningLayerUrl(lat: number, lng: number) {
    // Hà Nội: lat 20.8–21.2, lng 105.7–106.1
    if (lat >= 20.8 && lat <= 21.2 && lng >= 105.7 && lng <= 106.1) {
      return 'https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png';
    }
    // Hồ Chí Minh: lat 10.6–11.2, lng 106.3–107.0
    if (lat >= 10.6 && lat <= 11.2 && lng >= 106.3 && lng <= 107.0) {
      return 'https://sqhkt-qlqh.tphcm.gov.vn/api/tiles/bandoso/{z}/{x}/{y}.png';
    }
    // Default: Hà Nội
    return 'https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png';
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setSatellite(s => !s)}
        style={{ position: 'absolute', zIndex: 1000, right: 16, top: 16, background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '6px 12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}
      >
        {satellite ? 'Bản đồ thường' : 'Vệ tinh'}
      </button>
      <button
        onClick={() => setPlanning(p => !p)}
        style={{ position: 'absolute', zIndex: 1000, right: 16, top: 60, background: planning ? '#e0e7ff' : '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '6px 12px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}
      >
        {planning ? 'Tắt quy hoạch' : 'Quy hoạch'}
      </button>
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={satellite ? 18 : 17} maxZoom={20} style={{ height: 250, width: '100%', borderRadius: 12 }}>
        <TileLayer
          url={satellite
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            : 'http://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
          }
          // @ts-ignore
          attribution={satellite
            ? 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            : undefined
          }
          maxNativeZoom={satellite ? 19 : 19}
          maxZoom={20}
        />
        <CenterTracker />
        {planning && (
          <TileLayer
            url={getPlanningLayerUrl(mapCenter.lat, mapCenter.lng)}
            maxNativeZoom={18}
            maxZoom={20}
            opacity={0.5}
          />
        )}
        {Array.isArray(shape) && shape.length >= 3 && (
          <Polygon
            positions={shape.map(p => [p.lat, p.lng])}
            pathOptions={{ color: 'red', weight: 2, fillOpacity: 0.2 }}
          />
        )}
        {Array.isArray(shape) && shape.length > 0 && (
          <Marker position={[centroid.lat, centroid.lng]}>
            <Popup>
              {centroid.lat.toFixed(6)}, {centroid.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
        {amenities && amenities.map((amenity, idx) => {
          // Ước lượng vị trí tiện ích dựa trên khoảng cách và loại (giả lập hướng)
          const angle = (idx / amenities.length) * 2 * Math.PI;
          const dLat = (amenity.distance / 111) * Math.cos(angle); // 1 độ lat ~ 111km
          const dLng = (amenity.distance / (111 * Math.cos(centroid.lat * Math.PI / 180))) * Math.sin(angle);
          const lat = centroid.lat + dLat;
          const lng = centroid.lng + dLng;
          return (
            <Marker key={amenity.name} position={[lat, lng]}>
              <Popup>
                <b>{amenity.name}</b><br />Cách: {amenity.distance} km<br />Loại: {amenity.type}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
