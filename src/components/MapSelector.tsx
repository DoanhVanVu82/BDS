import { useState, useEffect, useRef } from "react";
import { MapPin, Layers, Search, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockLandDataList } from "@/data/landData";
import ScrollToTopButton from "./ScrollToTopButton";
import Fuse from "fuse.js";

const GEOAPIFY_API_KEY = "c50f34a02d844479ba7f566f1f178a31";

interface MapSelectorProps {}

const MapSelector = () => {
  const [satellite, setSatellite] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 21.028511, lng: 105.804817 });
  const [shouldMoveMap, setShouldMoveMap] = useState(false);

  const getCentroid = (shape) => {
    if (Array.isArray(shape) && shape.length > 0) {
      let latSum = 0, lngSum = 0;
      for (const pt of shape) {
        latSum += pt.lat;
        lngSum += pt.lng;
      }
      return { lat: latSum / shape.length, lng: lngSum / shape.length };
    }
    return { lat: 10.762622, lng: 106.660172 };
  };

  const fetchSuggestions = async (value: string) => {
    if (value.trim().length > 2) {
      setSearchLoading(true);
      setShowSuggestions(true);
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&lang=vi&limit=5&filter=countrycode:vn&apiKey=${GEOAPIFY_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        let apiSuggestions = data.features || [];
        // Fuzzy search với fuse.js
        const fuse = new Fuse(mockLandDataList, {
          keys: ["address"],
          threshold: 0.4,
          distance: 100,
        });
        const mockSuggestions = fuse.search(value.trim()).map(result => ({
          properties: {
            formatted: result.item.address,
            lat: result.item.shape[0]?.lat,
            lon: result.item.shape[0]?.lng,
            place_id: `mock-${result.item.id}`
          }
        }));
        // Gộp, loại trùng (theo formatted)
        const allSuggestions = [...mockSuggestions, ...apiSuggestions.filter(apiSug =>
          !mockSuggestions.some(mock => mock.properties.formatted === apiSug.properties.formatted)
        )];
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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchAddress(value);
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout for 500ms - giới hạn request
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  const handleSuggestionClick = (sug: any) => {
    // Remove postal code and 'Việt Nam' from formatted address
    const cleanAddress = sug.properties.formatted.replace(/,? ?\d{5},? ?Việt Nam$/, '').replace(/,? ?Việt Nam$/, '');
    setSearchAddress(cleanAddress);
    setShowSuggestions(false);
    // Clear any pending debounce - giới hạn request
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    // Move map to the selected location
    setMapCenter({ lat: sug.properties.lat, lng: sug.properties.lon });
    setShouldMoveMap(true); // Trigger map movement
  };

  // Move map only when shouldMoveMap is true
  useEffect(() => {
    if (shouldMoveMap && mapRef.current && mapRef.current.setView) {
      mapRef.current.setView([mapCenter.lat, mapCenter.lng], 16, {
        animate: true,
        duration: 1
      });
      setShouldMoveMap(false); // Reset flag after moving
    }
  }, [shouldMoveMap, mapCenter]);

  // Hide suggestions when clicking outside
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

  // Hàm xác định URL lớp quy hoạch
  function getPlanningLayerUrl(lat, lng) {
    if (lat >= 20.8 && lat <= 21.2 && lng >= 105.7 && lng <= 106.1) {
      return 'https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png';
    }
    if (lat >= 10.6 && lat <= 11.2 && lng >= 106.3 && lng <= 107.0) {
      return 'https://sqhkt-qlqh.tphcm.gov.vn/api/tiles/bandoso/{z}/{x}/{y}.png';
    }
    return 'https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png';
  }

  // Component to track map center
  function CenterTracker() {
    useMapEvents({
      moveend: (e) => {
        const center = e.target.getCenter();
        setMapCenter({ lat: center.lat, lng: center.lng });
      }
    });
    return null;
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50" style={{zIndex: 0}}>
      {/* Search Box */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1001] search-container" style={{ width: '100%', maxWidth: '520px' }}>
        <div className="relative shadow-lg rounded-full bg-white/95 backdrop-blur border border-gray-200">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm địa chỉ..."
            value={searchAddress}
            onChange={handleSearchInputChange}
            className="pl-12 h-12 text-base border-0 focus:ring-2 focus:ring-green-400 rounded-full bg-transparent w-full shadow-none"
            autoComplete="off"
            onFocus={() => searchAddress.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
          />
          {searchLoading && <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 animate-spin w-5 h-5" />}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto mt-1">
              {suggestions.map((sug, idx) => (
                <li
                  key={sug.properties.place_id || idx}
                  className="p-3 hover:bg-green-50 cursor-pointer text-base border-b border-gray-100 last:border-b-0 rounded-xl"
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
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white border-0 transition hover:bg-green-50 ${satellite ? 'ring-2 ring-green-400' : ''}`}
          title="Chế độ vệ tinh"
        >
          <Layers className={`w-6 h-6 ${satellite ? 'text-green-600' : 'text-gray-500'}`} />
        </button>
        <button
          onClick={() => setPlanning(p => !p)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-white border-0 transition hover:bg-blue-50 ${planning ? 'ring-2 ring-blue-400' : ''}`}
          title="Lớp quy hoạch"
        >
          <span className={`w-6 h-6 block rounded bg-gradient-to-br from-blue-400 to-green-400 opacity-80 ${planning ? '' : 'grayscale'}`}></span>
        </button>
      </div>
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={satellite ? 18 : 15} 
        maxZoom={20} 
        style={{ height: '100vh', width: '100vw', borderRadius: 0 }}
      >
        <TileLayer url={satellite
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'http://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
        }
        // @ts-expect-error: attribution is a valid prop at runtime
        attribution={satellite
          ? 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          : undefined
        }
        subdomains={satellite ? undefined : ['mt0','mt1','mt2','mt3']}
        maxZoom={20}
        />
        <CenterTracker />
        {planning && (
          <TileLayer
            url={getPlanningLayerUrl(mapCenter.lat, mapCenter.lng)}
            maxZoom={20}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapSelector;
