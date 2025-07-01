import { useState } from "react";
import { MapPin, Layers } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLandDataList } from "@/data/landData";

interface MapSelectorProps {
  onPlotSelect: (plotId: string) => void;
  onDrawCustom: () => void;
  onCancel: () => void;
}

const MapSelector = ({ onPlotSelect, onDrawCustom, onCancel }: MapSelectorProps) => {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [satellite, setSatellite] = useState(false);
  const [planning, setPlanning] = useState(false);

  const availablePlots = mockLandDataList.map(l => {
    let centroid = { lat: 10.762622, lng: 106.660172 };
    if (Array.isArray(l.shape) && l.shape.length > 0) {
      centroid = {
        lat: l.shape.reduce((sum, p) => sum + p.lat, 0) / l.shape.length,
        lng: l.shape.reduce((sum, p) => sum + p.lng, 0) / l.shape.length,
      };
    }
    return {
      id: l.id,
      address: l.address,
      area: l.area,
      plotNumber: l.plotNumber,
      centroid,
      available: true
    };
  });

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

  const handlePlotClick = (plotId: string) => {
    setSelectedPlot(plotId);
  };

  const handleConfirmSelection = () => {
    if (selectedPlot) {
      onPlotSelect(selectedPlot);
    }
  };

  const selected = availablePlots.find(p => p.id === selectedPlot) || availablePlots[0];
  const selectedCentroid = getCentroid(selected.shape);

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
      {/* Map View */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            Bản đồ khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-96">
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
            <MapContainer center={[selected.centroid.lat, selected.centroid.lng]} zoom={satellite ? 18 : 15} maxZoom={satellite ? 20 : 19} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
              <TileLayer url={satellite
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
              attribution={satellite
                ? 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                : undefined
              }
              maxZoom={satellite ? 20 : 19}
              />
              {planning && (
                <TileLayer
                  url="https://l5cfglaebpobj.vcdn.cloud/ha-noi-2030-2/{z}/{x}/{y}.png"
                  opacity={0.5}
                />
              )}
              {availablePlots.map((plot, index) => (
                <Marker
                  key={plot.id}
                  position={[plot.centroid.lat, plot.centroid.lng]}
                  eventHandlers={{ click: () => handlePlotClick(plot.id) }}
                >
                  <Popup>
                    <b>{plot.address}</b><br />Thửa số: {plot.plotNumber}<br />Diện tích: {plot.area} m²<br />{plot.available ? 'Có sẵn' : 'Không có'}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
      {/* Plot List giữ nguyên */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-3">
            <Layers className="w-6 h-6" />
            Danh sách mảnh đất
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 mb-6">
            {availablePlots.map((plot, index) => (
              <div
                key={plot.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlot === plot.id
                    ? 'border-green-500 bg-green-50'
                    : plot.available
                    ? 'border-gray-200 bg-white hover:border-gray-300'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                onClick={() => plot.available && handlePlotClick(plot.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          plot.available ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-800">{plot.address}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Thửa số: {plot.plotNumber} • Diện tích: {plot.area} m²
                    </p>
                  </div>
                  <Badge
                    variant={plot.available ? "default" : "secondary"}
                    className={plot.available ? "bg-green-500" : ""}
                  >
                    {plot.available ? "Có sẵn" : "Không có"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 space-y-4">
            <Button onClick={onDrawCustom} variant="outline" className="w-full">
              Vẽ mảnh đất tùy chỉnh
            </Button>
            <Button onClick={handleConfirmSelection} disabled={!selectedPlot} className="w-full bg-green-500 text-white">
              Xác nhận chọn mảnh đất
            </Button>
            <Button onClick={onCancel} variant="ghost" className="w-full">
              Hủy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSelector;
