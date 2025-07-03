import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { Loader2 } from "lucide-react";

const LAND_TYPES = [
  { value: "dat-ban", label: "Đất bán" },
  { value: "nha-ban", label: "Nhà bán" },
];
const HUONG_DAT = ["Đông", "Tây", "Nam", "Bắc", "Đông Bắc", "Tây Bắc", "Đông Nam", "Tây Nam"];
const HUONG_CUA = HUONG_DAT;
const LOAI_DAT = ["Đất ở", "Đất thương mại", "Đất nông nghiệp"];
const LOAI_NHA = ["Nhà cấp 4", "Nhà vườn", "Nhà biệt thự", "Nhà liền kề", "Shophouse", "Officetel"];
const NOI_THAT = ["Đủ nội thất", "Nhà trống"];
const LOAI_DUONG = ["Đường nhựa", "Đường bê tông", "Đường đất"];
const VI_TRI = ["Mặt phố/Mặt tiền đường", "Hẻm xe hơi", "Hẻm ba gác", "Hẻm xe máy"];
const VI_TRI_DAT = ["Mặt phố / Mặt tiền đường", "Hẻm xe hơi", "Hẻm ba gác", "Hẻm xe máy"];
const DAC_DIEM_NHA = ["Căn góc", "Nhà mới xây", "Có thang máy", "Có sân vườn", "Có hồ bơi", "Có tầng hầm"];
const VIEW = ["View công viên", "View hồ", "View sông", "View chợ", "View biển"];
const TIEM_NANG_NHA = ["Tiệm kinh doanh", "Làm văn phòng", "Bán thời trang", "Làm nhà hàng", "Làm quán ăn", "Làm cửa hàng", "Làm kho xưởng", "Làm nhà trọ", "Kinh doanh dòng tiền", "Tiện cho thuê", "Homestay", "Farmstay"];
const TIEM_NANG_DAT = ["Tiệm kinh doanh", "Làm văn phòng", "Bán thời trang", "Làm nhà hàng", "Làm quán ăn", "Làm cửa hàng", "Làm kho xưởng", "Làm nhà trọ", "Kinh doanh dòng tiền", "Tiện cho thuê"];
const DAC_DIEM_DAT = ["Lô góc", "Đất nền (chưa có công trình)", "Đất thổ vườn (kết hợp đất ở và đất vườn)", "Có thổ cư", "Full thổ cư"];

function MultiChoice({ label, options, value, onChange }: { label: string, options: string[], value: string[], onChange: (v: string[]) => void }) {
  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <Button
            key={opt}
            type="button"
            variant={value.includes(opt) ? "default" : "outline"}
            className="rounded-full px-4 py-2 text-sm"
            onClick={() => value.includes(opt) ? onChange(value.filter(v => v !== opt)) : onChange([...value, opt])}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SingleSelect({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <label className="font-semibold mb-2 block">{label}</label>
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Chọn {label.toLowerCase()}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function PropertyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy dữ liệu truyền sang (nếu có)
  const state = location.state as any || {};
  const [address, setAddress] = useState(state.address || "");
  const [lat, setLat] = useState(state.lat || "");
  const [lng, setLng] = useState(state.lng || "");
  const [type, setType] = useState("dat-ban");
  const [area, setArea] = useState(state.area || "");
  const [width, setWidth] = useState(state.roadWidth || "");
  // Đất bán
  const [huongDat, setHuongDat] = useState("");
  const [loaiDat, setLoaiDat] = useState("");
  const [dacDiemDat, setDacDiemDat] = useState<string[]>([]);
  const [viewDat, setViewDat] = useState<string[]>([]);
  const [tiemNangDat, setTiemNangDat] = useState<string[]>([]);
  const [loaiDuongDat, setLoaiDuongDat] = useState<string[]>([]);
  const [viTriDat, setViTriDat] = useState("");
  // Nhà bán
  const [soPhongNgu, setSoPhongNgu] = useState("");
  const [huongCua, setHuongCua] = useState("");
  const [soTang, setSoTang] = useState("");
  const [viTriNha, setViTriNha] = useState("");
  const [loaiNha, setLoaiNha] = useState("");
  const [noiThat, setNoiThat] = useState("");
  const [dacDiemNha, setDacDiemNha] = useState<string[]>([]);
  const [viewNha, setViewNha] = useState<string[]>([]);
  const [tiemNangNha, setTiemNangNha] = useState<string[]>([]);
  const [loaiDuongNha, setLoaiDuongNha] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Polygon giả lập (nếu có)
  const polygon = state.shape || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Gom dữ liệu form và toàn bộ state (object polygon)
    const formData = {
      ...state, // giữ lại toàn bộ dữ liệu polygon từ state
      address, lat, lng, area, roadwidth: width, // các trường user có thể sửa
      type,
      loaiDat,
      huongDat,
      viTriDat,
      dacDiemDat,
      viewDat,
      tiemNangDat,
      loaiDuongDat,
      soPhongNgu,
      soTang,
      huongCua,
      viTriNha,
      loaiNha,
      noiThat,
      dacDiemNha,
      viewNha,
      tiemNangNha,
      loaiDuongNha
    };
    setTimeout(() => {
      setIsLoading(false);
      navigate("/results", { state: { formData } });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto py-8 px-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Overlay loading */}
      {isLoading && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <div className="text-xl font-semibold text-blue-700">Đang định giá...</div>
        </div>
      )}
      {/* Cột 1: Thông tin cơ bản + bản đồ */}
      <div className="space-y-4">
        <Card className="p-6 space-y-4">
          <div className="font-bold text-xl mb-2">Thông tin cơ bản</div>
          <div className="mb-4">
            <label className="font-semibold mb-2 block">Địa chỉ</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nhập địa chỉ" required />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="font-semibold mb-2 block">Vĩ độ (lat)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={lat} onChange={e => setLat(e.target.value)} placeholder="Lat" required />
            </div>
            <div className="w-1/2">
              <label className="font-semibold mb-2 block">Kinh độ (lng)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={lng} onChange={e => setLng(e.target.value)} placeholder="Lng" required />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="font-semibold mb-2 block">Diện tích (m²)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={area} onChange={e => setArea(e.target.value)} placeholder="Diện tích" required />
            </div>
            <div className="w-1/2">
              <label className="font-semibold mb-2 block">Chiều ngang (m)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={width} onChange={e => setWidth(e.target.value)} placeholder="Chiều ngang" required />
            </div>
          </div>
          <SingleSelect label="Loại" options={LAND_TYPES.map(l => l.label)} value={LAND_TYPES.find(l => l.value === type)?.label || ""} onChange={val => setType(LAND_TYPES.find(l => l.label === val)?.value || "dat-ban")} />
        </Card>
        <Card className="p-4">
          <div className="font-bold mb-2">Vị trí trên bản đồ</div>
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <MapContainer center={lat && lng ? [parseFloat(lat), parseFloat(lng)] : [10.762622, 106.660172]} zoom={17} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {polygon.length > 2 && (
                <Polygon positions={polygon.map((pt: any) => [pt.lat, pt.lng])} pathOptions={{ color: 'red', weight: 2, fillOpacity: 0.2 }} />
              )}
            </MapContainer>
          </div>
        </Card>
      </div>
      {/* Cột 2: Các lựa chọn */}
      <div className="space-y-4">
        {type === "dat-ban" && (
          <Card className="p-6 space-y-4">
            <SingleSelect label="Hướng đất" options={HUONG_DAT} value={huongDat} onChange={setHuongDat} />
            <SingleSelect label="Vị trí / Lối vào" options={VI_TRI_DAT} value={viTriDat} onChange={setViTriDat} />
            <SingleSelect label="Loại đất" options={LOAI_DAT} value={loaiDat} onChange={setLoaiDat} />
            <MultiChoice label="Đặc điểm & Pháp lý" options={DAC_DIEM_DAT} value={dacDiemDat} onChange={setDacDiemDat} />
            <MultiChoice label="View / Hướng nhìn" options={VIEW} value={viewDat} onChange={setViewDat} />
            <MultiChoice label="Mục đích sử dụng / Tiềm năng" options={TIEM_NANG_DAT} value={tiemNangDat} onChange={setTiemNangDat} />
            <MultiChoice label="Loại đường" options={LOAI_DUONG} value={loaiDuongDat} onChange={setLoaiDuongDat} />
          </Card>
        )}
        {type === "nha-ban" && (
          <Card className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="font-semibold mb-2 block">Số phòng ngủ</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={soPhongNgu} onChange={e => setSoPhongNgu(e.target.value)} placeholder="Số phòng ngủ" required />
              </div>
              <div className="w-1/2">
                <label className="font-semibold mb-2 block">Số tầng</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" value={soTang} onChange={e => setSoTang(e.target.value)} placeholder="Số tầng" required />
              </div>
            </div>
            <SingleSelect label="Hướng cửa chính" options={HUONG_CUA} value={huongCua} onChange={setHuongCua} />
            <SingleSelect label="Vị trí / Lối vào" options={VI_TRI} value={viTriNha} onChange={setViTriNha} />
            <SingleSelect label="Loại hình nhà đất" options={LOAI_NHA} value={loaiNha} onChange={setLoaiNha} />
            <SingleSelect label="Tình trạng nội thất" options={NOI_THAT} value={noiThat} onChange={setNoiThat} />
            <MultiChoice label="Đặc điểm & Tiện ích" options={DAC_DIEM_NHA} value={dacDiemNha} onChange={setDacDiemNha} />
            <MultiChoice label="View / Hướng nhìn" options={VIEW} value={viewNha} onChange={setViewNha} />
            <MultiChoice label="Mục đích sử dụng / Tiềm năng" options={TIEM_NANG_NHA} value={tiemNangNha} onChange={setTiemNangNha} />
            <MultiChoice label="Loại đường" options={LOAI_DUONG} value={loaiDuongNha} onChange={setLoaiDuongNha} />
          </Card>
        )}
      </div>
      {/* Nút định giá full width, căn giữa, cuối trang */}
      <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
        <Button type="submit" className="w-full max-w-md h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl text-white">Định giá</Button>
      </div>
    </form>
  );
} 