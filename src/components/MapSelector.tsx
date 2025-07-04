import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Layers, Search, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Polygon, Popup, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockLandDataList, LandData } from "@/data/landData";
import ScrollToTopButton from "./ScrollToTopButton";
import Fuse from "fuse.js";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const GEOAPIFY_API_KEY = "c50f34a02d844479ba7f566f1f178a31";

interface MapSelectorProps {
  onPlotSelect?: (plotId: string) => void;
  onDrawCustom?: () => void;
  onCancel?: () => void;
}

const MapSelector = ({ onPlotSelect = () => {}, onDrawCustom = () => {}, onCancel = () => {} }: MapSelectorProps) => {
  const navigate = useNavigate();
  const [satellite, setSatellite] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState<LandData | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 21.028511, lng: 105.804817 });
  const [shouldMoveMap, setShouldMoveMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Tính centroid cho bản đồ
  const getCentroid = (shape: { lat: number; lng: number }[] | null | undefined) => {
    if (Array.isArray(shape) && shape.length >= 3 && shape.every(pt => typeof pt.lat === 'number' && typeof pt.lng === 'number')) {
      let latSum = 0, lngSum = 0;
      for (const pt of shape) {
        latSum += pt.lat;
        lngSum += pt.lng;
      }
      return { lat: latSum / shape.length, lng: lngSum / shape.length };
    }
    console.warn("Invalid shape for centroid calculation, returning default center");
    return { lat: 10.762622, lng: 106.660172 };
  };

  // Tìm kiếm địa chỉ
  const fetchSuggestions = async (value: string) => {
    if (value.trim().length > 2) {
      setSearchLoading(true);
      setShowSuggestions(true);
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&lang=vi&limit=5&filter=countrycode:vn&apiKey=${GEOAPIFY_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        let apiSuggestions = data.features || [];
        const fuse = new Fuse(mockLandDataList, {
          keys: ["address", "fullAddress"],
          threshold: 0.4,
          distance: 100,
        });
        const mockSuggestions = fuse.search(value.trim()).map(result => ({
          properties: {
            formatted: result.item.fullAddress,
            lat: result.item.shape?.[0]?.lat,
            lon: result.item.shape?.[0]?.lng,
            place_id: `mock-${result.item.id}`,
          },
        }));
        const allSuggestions = [
          ...mockSuggestions.filter(sug => sug.properties.lat && sug.properties.lon),
          ...apiSuggestions.filter(apiSug =>
            !mockSuggestions.some(mock => mock.properties.formatted === apiSug.properties.formatted)
          ),
        ];
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Xử lý thay đổi input tìm kiếm
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchAddress(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  // Xử lý click vào gợi ý tìm kiếm
  const handleSuggestionClick = (sug: any) => {
    const cleanAddress = sug.properties.formatted.replace(/,? ?\d{5},? ?Việt Nam$/, '').replace(/,? ?Việt Nam$/, '');
    setSearchAddress(cleanAddress);
    setShowSuggestions(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (sug.properties.lat && sug.properties.lon) {
      setMapCenter({ lat: sug.properties.lat, lng: sug.properties.lon });
      setShouldMoveMap(true);
      setMarkerPosition({ lat: sug.properties.lat, lng: sug.properties.lon });
    } else {
      console.warn("Invalid coordinates in suggestion:", sug);
    }
  };

  // Di chuyển bản đồ khi chọn gợi ý
  useEffect(() => {
    if (shouldMoveMap && mapRef.current && mapRef.current.setView) {
      mapRef.current.setView([mapCenter.lat, mapCenter.lng], 16, {
        animate: true,
        duration: 1,
      });
      setShouldMoveMap(false);
    }
  }, [shouldMoveMap, mapCenter]);

  // Ẩn gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSuggestions && !target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Xử lý click vào Polygon
  const handlePolygonClick = (plotId: string) => {
    console.log("Polygon clicked, plotId:", plotId);
    setSelectedPlot(plotId);
    const plotData = mockLandDataList.find(plot => plot.id === plotId);
    if (plotData && Array.isArray(plotData.shape) && plotData.shape.length >= 3) {
      console.log("Found plot data:", plotData);
      setDetailsData(plotData);
      setShowDetails(true);
    } else {
      console.warn("No valid plot data or shape for plotId:", plotId, plotData);
      setShowDetails(false);
      setDetailsData(null);
    }
  };

  // Thuật toán kiểm tra điểm có nằm trong polygon không (ray-casting)
  function isPointInPolygon(point: {lat: number, lng: number}, polygon: {lat: number, lng: number}[]) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;
      const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
        (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi + 0.0000001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Xử lý click ra ngoài Polygon
  const handleMapClick = (e: any) => {
    console.log("Map clicked at:", e.latlng);
    let clickedInsideAnyPolygon = false;
    mockLandDataList.forEach(plot => {
      if (Array.isArray(plot.shape) && plot.shape.length >= 3 && plot.shape.every(pt => typeof pt.lat === 'number' && typeof pt.lng === 'number')) {
        if (isPointInPolygon({ lat: e.latlng.lat, lng: e.latlng.lng }, plot.shape)) {
          console.log("Click inside polygon:", plot.id);
          clickedInsideAnyPolygon = true;
        }
      } else {
        console.warn("Invalid shape for plot:", plot.id);
      }
    });
    if (!clickedInsideAnyPolygon) {
      console.log("Click outside all polygons, resetting selection");
      setSelectedPlot(null);
      setShowDetails(false);
      setDetailsData(null);
    }
    setMarkerPosition(e.latlng);
  };

  // Xác nhận chọn mảnh đất và chuyển trang
  const handleConfirmSelection = () => {
    if (selectedPlot && detailsData) {
      console.log("Confirm selection, plotId:", selectedPlot);
      onPlotSelect(selectedPlot);
      const centroid = getCentroid(detailsData.shape);
      navigate("/property-form", {
        state: {
          ...detailsData,
          lat: centroid.lat.toString(),
          lng: centroid.lng.toString(),
        },
      });
      setShowDetails(false);
      setSelectedPlot(null);
      setDetailsData(null);
    }
  };

  // Hàm xác định URL lớp quy hoạch
  function getPlanningLayerUrl(lat: number, lng: number) {
    if (lat >= 20.8 && lat <= 21.2 && lng >= 105.7 && lng <= 106.1) {
      return 'https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png';
    }
    if (lat >= 10.6 && lat <= 11.2 && lng >= 106.3 && lng <= 107.0) {
      return 'https://sqhkt-qlqh.tphcm.gov.vn/api/tiles/bandoso/{z}/{x}/{y}.png';
    }
    return 'https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png';
  }

  // Component để track trung tâm bản đồ
  function CenterTracker() {
    useMapEvents({
      moveend: (e) => {
        const center = e.target.getCenter();
        setMapCenter({ lat: center.lat, lng: center.lng });
      },
      click: handleMapClick,
    });
    return null;
  }

  // Quản lý body overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50" style={{ zIndex: 0 }}>
      {/* Search Box */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1001] search-container" style={{ width: '100%', maxWidth: '520px' }}>
        <div className="relative shadow-lg rounded-full bg-white/95 backdrop-blur border border-gray-200">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm địa chỉ..."
            value={searchAddress}
            onChange={handleSearchInputChange}
            className="pl-12 h-12 text-base border-0 focus:ring-2 focus:ring-blue-400 rounded-full bg-transparent w-full shadow-none"
            autoComplete="off"
            onFocus={() => searchAddress.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
          />
          {searchLoading && <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 animate-spin w-5 h-5" />}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto mt-1">
              {suggestions.map((sug, idx) => (
                <li
                  key={sug.properties.place_id || idx}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-base border-b border-gray-100 last:border-b-0 rounded-xl"
                  onClick={() => handleSuggestionClick(sug)}
                >
                  {sug.properties.formatted.replace(/,? ?\d{5},? ?Việt Nam$/, '').replace(/,? ?Việt Nam$/, '')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Nút vệ tinh và quy hoạch */}
      <div className="absolute right-6 top-24 flex flex-col gap-4 z-[1002]">
        <button
          onClick={() => setSatellite(s => !s)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white border-0 transition hover:bg-blue-50 ${satellite ? 'ring-2 ring-blue-400' : ''}`}
          title="Chế độ vệ tinh"
        >
          <Layers className={`w-6 h-6 ${satellite ? 'text-blue-600' : 'text-gray-500'}`} />
        </button>
        <button
          onClick={() => setPlanning(p => !p)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white border-0 transition hover:bg-blue-50 ${planning ? 'ring-2 ring-blue-400' : ''}`}
          title="Lớp quy hoạch"
        >
          <span className={`w-6 h-6 block rounded bg-blue-400 opacity-80 ${planning ? '' : 'grayscale'}`}></span>
        </button>
      </div>
      {/* Details panel overlay */}
      {showDetails && detailsData && (
        <div className="fixed left-1/2 bottom-6 transform -translate-x-1/2 z-[1002] w-[28rem] max-w-[95vw] max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-600">Thông tin cơ bản</h2>
            <button
              onClick={() => {
                console.log("Closing details panel");
                setShowDetails(false);
                setSelectedPlot(null);
                setDetailsData(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2 text-sm">
              <div><strong>Diện tích:</strong> {detailsData.area ? `${detailsData.area} m²` : 'Không xác định'}</div>
              <div><strong>Số thửa đất:</strong> {detailsData.plotNumber || 'Không xác định'}</div>
              <div><strong>Địa chỉ đầy đủ:</strong> {detailsData.fullAddress || 'Không xác định'}</div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t bg-white sticky bottom-0">
              <div className="w-full flex justify-center">
                <Button 
                  onClick={handleConfirmSelection} 
                  disabled={!selectedPlot} 
                  className="bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen map */}
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={satellite ? 18 : 15} 
        maxZoom={20} 
        style={{ height: '100vh', width: '100vw', borderRadius: 0 }}
        ref={mapRef}
      >
        <TileLayer 
          url={satellite
            ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            : 'http://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
          }
          attribution={satellite
            ? 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            : undefined
          }
          subdomains={satellite ? undefined : ['mt0','mt1','mt2','mt3']}
          maxZoom={20}
        />
        <CenterTracker />
        {planning && (         
          <TileLayer
            url={getPlanningLayerUrl(mapCenter.lat, mapCenter.lng)}
            maxNativeZoom={18}
            maxZoom={20}
            opacity={1.0}
          />
        )}
        
        {/* Hiển thị tất cả các Polygon từ mockLandDataList */}
        {mockLandDataList
          .filter(plot => Array.isArray(plot.shape) && plot.shape.length >= 3 && plot.shape.every(pt => typeof pt.lat === 'number' && typeof pt.lng === 'number'))
          .map((plot) => {
            const isSelected = selectedPlot === plot.id;
            return (
              <Polygon
                key={plot.id}
                positions={plot.shape.map(coord => [coord.lat, coord.lng])}
                pathOptions={{
                  color: isSelected ? '#ff0000' : 'transparent',
                  weight: isSelected ? 4 : 0,
                  fillColor: isSelected ? '#ff0000' : 'transparent',
                  fillOpacity: isSelected ? 0.2 : 0,
                }}
                eventHandlers={{
                  click: () => handlePolygonClick(plot.id),
                }}
              />
            );
          })}
        {/* Marker khi click vào bản đồ */}
        {markerPosition && (
          <Marker position={[markerPosition.lat, markerPosition.lng]} icon={L.divIcon({
            className: 'custom-mappin-marker',
            html: `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" viewBox=\"0 0 24 24\"><path d=\"M12 21c-4.8-4.8-7.2-8-7.2-11.2A7.2 7.2 0 0 1 12 2.6a7.2 7.2 0 0 1 7.2 7.2c0 3.2-2.4 6.4-7.2 11.2Z\"/><circle cx=\"12\" cy=\"9.8\" r=\"2.2\"/></svg>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          })} />
        )}
      </MapContainer>

      <ScrollToTopButton />
    </div>
  );
};

export default MapSelector;