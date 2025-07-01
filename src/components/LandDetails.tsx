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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Home className="w-7 h-7" />
            Thông tin lô đất
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
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
                <Compass className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Hướng cửa chính</p>
                  <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700 border-purple-200">
                    {land.frontDirection}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Loại đất & Pháp lý</p>
                  <p className="text-gray-600">{land.landType}</p>
                  <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                    {land.legalStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
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
                <TrendingUp className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Khả năng mở rộng</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${land.expansion 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {land.expansion ? 'Có thể mở rộng' : 'Không thể mở rộng'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <MapIcon className="w-6 h-6" />
            Vị trí & Tiện ích xung quanh
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Map shape={land.shape} amenities={land.amenities} />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Tiện ích công cộng gần đây:</h3>
            <div className="space-y-3">
              {land.amenities.map((amenity, index) => (
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
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandDetails;
