import { useState } from "react";
import { MapPin, Square, Trash2, Save } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Point {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  onPlotSelected: (area: number, points: Point[]) => void;
  onCancel: () => void;
}

function AreaDrawer({ points, setPoints, isDrawing }: { points: Point[]; setPoints: (pts: Point[]) => void; isDrawing: boolean }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        setPoints([...points, { lat: e.latlng.lat, lng: e.latlng.lng }]);
      }
    }
  });
  return null;
}

function calculateArea(points: Point[]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].lat * points[j].lng;
    area -= points[j].lat * points[i].lng;
  }
  return Math.abs(area * 111139 * 111139 / 2); // 1 độ ~ 111139m
}

const InteractiveMap = ({ onPlotSelected, onCancel }: InteractiveMapProps) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const [planning, setPlanning] = useState(false);
  const center = { lat: 10.762622, lng: 106.660172 };

  const clearPoints = () => setPoints([]);
  const savePlot = () => {
    if (points.length >= 3) {
      const area = Math.round(calculateArea(points));
      onPlotSelected(area, points);
    }
  };
  const area = Math.round(calculateArea(points));

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <CardTitle className="flex items-center gap-3">
          <Square className="w-6 h-6" />
          Vẽ hình dạng mảnh đất
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={() => setIsDrawing(!isDrawing)} variant={isDrawing ? "destructive" : "default"} size="sm">
              {isDrawing ? "Dừng vẽ" : "Bắt đầu vẽ"}
            </Button>
            <Button onClick={clearPoints} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />Xóa
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {points.length >= 3 && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Diện tích: ~{area} m²
              </Badge>
            )}
            <Badge variant="outline">Điểm: {points.length}</Badge>
          </div>
        </div>
        <div className="relative w-full h-96 rounded-lg border-2 border-gray-200 overflow-hidden">
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
          <MapContainer center={center} zoom={satellite ? 18 : 16} maxZoom={satellite ? 20 : 19} style={{ height: '100%', width: '100%', borderRadius: 12 }}>
            <TileLayer
              url={satellite
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
              // @ts-expect-error: attribution is a valid prop at runtime
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
            <AreaDrawer points={points} setPoints={setPoints} isDrawing={isDrawing} />
            {points.length > 0 && points.map((pt, idx) => (
              <Marker key={idx} position={[pt.lat, pt.lng]} />
            ))}
            {points.length >= 3 && <Polygon positions={points.map(pt => [pt.lat, pt.lng])} pathOptions={{ color: 'red' }} />}
          </MapContainer>
        </div>
        <div className="mt-6 flex justify-between">
          <Button onClick={onCancel} variant="outline">Hủy</Button>
          <Button onClick={savePlot} disabled={points.length < 3} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            <Save className="w-4 h-4 mr-2" />Lưu mảnh đất ({points.length >= 3 ? `${area} m²` : `cần ${3 - points.length} điểm nữa`})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
