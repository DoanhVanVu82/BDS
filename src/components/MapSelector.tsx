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

  const availablePlots = mockLandDataList.map(l => ({
    id: l.id,
    address: l.address,
    area: l.area,
    plotNumber: l.plotNumber,
    coordinates: l.coordinates,
    available: true // hoặc logic khác nếu muốn
  }));

  const handlePlotClick = (plotId: string) => {
    setSelectedPlot(plotId);
  };

  const handleConfirmSelection = () => {
    if (selectedPlot) {
      onPlotSelect(selectedPlot);
    }
  };

  const selected = availablePlots.find(p => p.id === selectedPlot) || availablePlots[0];

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
            <MapContainer center={[selected.coordinates.lat, selected.coordinates.lng]} zoom={15} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {availablePlots.map((plot, index) => (
                <Marker
                  key={plot.id}
                  position={[plot.coordinates.lat, plot.coordinates.lng]}
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
            Danh sách thửa đất
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
              Xác nhận chọn thửa đất
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
