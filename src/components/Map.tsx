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
      {/* Nút vệ tinh và quy hoạch */}
      <div style={{ position: 'absolute', zIndex: 1000, right: 16, top: 16 }} className="flex flex-col gap-4">
        <button
          onClick={() => setSatellite(s => !s)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white border-0 transition hover:bg-blue-50 ${satellite ? 'ring-2 ring-blue-400' : ''}`}
          title="Chế độ vệ tinh"
        >
          <span className="sr-only">Chế độ vệ tinh</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${satellite ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
        </button>
        <button
          onClick={() => setPlanning(p => !p)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white border-0 transition hover:bg-blue-50 ${planning ? 'ring-2 ring-blue-400' : ''}`}
          title="Lớp quy hoạch"
        >
          <span className={`w-6 h-6 block rounded bg-blue-400 opacity-80 ${planning ? '' : 'grayscale'}`}></span>
        </button>
      </div>
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
            // opacity={1.0}
          />
        )}
        {Array.isArray(shape) && shape.length >= 3 && (
          <Polygon
            positions={shape.map(p => [p.lat, p.lng])}
            pathOptions={{ color: 'red', weight: 2, fillOpacity: 0.2 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
