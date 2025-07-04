import { 
  Home, 
  MapPin, 
  Compass, 
  FileText, 
  Map as MapIcon,
  Building,
  Car,
  Users,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Map from "./Map";
import { LandData } from "@/data/landData";

interface LandDetailsProps {
  land: LandData;
}

const LandDetails = ({ land }: LandDetailsProps) => {
  if (!land) {
    return <div className="text-red-500 p-4">Không có dữ liệu lô đất.</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Home className="w-7 h-7" />
            Thông tin lô đất
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Địa chỉ đầy đủ</p>
                  <p className="text-gray-600">{land.fullAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Diện tích & Số thửa</p>
                  <p className="text-gray-600">{land.area} m² - Thửa số {land.plotNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Đường trước nhà</p>
                  <p className="text-gray-600">{land.roadWidth}m</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Số phòng tối đa</p>
                  <p className="text-gray-600">{land.maxRooms} phòng</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Nở hậu</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${land.expansion 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {land.expansion ? 'Có' : 'Không'}
                  </Badge>
                </div>
              </div>         
            </div>

            <div className="space-y-4">
            <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Thông tin & Pháp lý</p>
                  <p className="text-gray-600">{land.landType}</p>
                  <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                    {land.legalStatus}
                  </Badge>
                  {/* Thông tin loại bất động sản và chi tiết loại đó từ PropertyForm (làm thông tin con) */}
                  {((land as any).type === 'dat-ban' || (land as any).type === 'nha-ban') && (
                    <div className="mt-2 text-sm bg-blue-50/60 rounded-lg p-3 border border-blue-100">
                      <div className="font-semibold text-blue-700 mb-1">Loại bất động sản: <span className="font-normal text-gray-700">{(land as any).type === 'dat-ban' ? 'Đất bán' : (land as any).type === 'nha-ban' ? 'Nhà bán' : '-'}</span></div>
                      {(land as any).type === 'dat-ban' && (
                        <ul className="space-y-1">
                          <li><span className="font-medium">Loại đất:</span> {(land as any).loaiDat || '-'}</li>
                          {(land as any).huongDat && (<li><span className="font-medium">Hướng đất:</span> {(land as any).huongDat}</li>)}
                          {(land as any).viTriDat && (<li><span className="font-medium">Vị trí/Lối vào:</span> {(land as any).viTriDat}</li>)}
                          {Array.isArray((land as any).dacDiemDat) && (land as any).dacDiemDat.length > 0 && (
                            <li><span className="font-medium">Đặc điểm & Pháp lý:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).dacDiemDat.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                          {Array.isArray((land as any).viewDat) && (land as any).viewDat.length > 0 && (
                            <li><span className="font-medium">View/Hướng nhìn:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).viewDat.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                          {Array.isArray((land as any).tiemNangDat) && (land as any).tiemNangDat.length > 0 && (
                            <li><span className="font-medium">Mục đích sử dụng/Tiềm năng:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).tiemNangDat.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                          {Array.isArray((land as any).loaiDuongDat) && (land as any).loaiDuongDat.length > 0 && (
                            <li><span className="font-medium">Loại đường:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).loaiDuongDat.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                        </ul>
                      )}
                      {(land as any).type === 'nha-ban' && (
                        <ul className="space-y-1">
                          <li><span className="font-medium">Loại hình nhà đất:</span> {(land as any).loaiNha || '-'}</li>
                          {(land as any).soPhongNgu && (<li><span className="font-medium">Số phòng ngủ:</span> {(land as any).soPhongNgu}</li>)}
                          {(land as any).soTang && (<li><span className="font-medium">Số tầng:</span> {(land as any).soTang}</li>)}
                          {(land as any).huongCua && (<li><span className="font-medium">Hướng cửa chính:</span> {(land as any).huongCua}</li>)}
                          {(land as any).viTriNha && (<li><span className="font-medium">Vị trí/Lối vào:</span> {(land as any).viTriNha}</li>)}
                          {(land as any).noiThat && (<li><span className="font-medium">Tình trạng nội thất:</span> {(land as any).noiThat}</li>)}
                          {Array.isArray((land as any).dacDiemNha) && (land as any).dacDiemNha.length > 0 && (
                            <li><span className="font-medium">Đặc điểm & Tiện ích:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).dacDiemNha.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                          {Array.isArray((land as any).viewNha) && (land as any).viewNha.length > 0 && (
                            <li><span className="font-medium">View/Hướng nhìn:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).viewNha.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                          {Array.isArray((land as any).tiemNangNha) && (land as any).tiemNangNha.length > 0 && (
                            <li><span className="font-medium">Mục đích sử dụng/Tiềm năng:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).tiemNangNha.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                          {Array.isArray((land as any).loaiDuongNha) && (land as any).loaiDuongNha.length > 0 && (
                            <li><span className="font-medium">Loại đường:</span> <span className="flex flex-wrap gap-1 mt-1">{(land as any).loaiDuongNha.map((d: string, i: number) => <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)}</span></li>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <MapIcon className="w-6 h-6" />
            Vị trí & Tiện ích xung quanh
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <Map shape={land.shape} amenities={land.amenities} />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Tiện ích công cộng gần đây:</h3>
            <div className="space-y-3">
              {Array.isArray(land.amenities) && land.amenities.length > 0 ? (
                land.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        amenity.type === 'hospital' ? 'bg-red-500' :
                        amenity.type === 'school' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium text-gray-800">{amenity.name}</span>
                    </div>
                    <Badge variant="secondary">{amenity.distance} km</Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">Không có tiện ích</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandDetails;
