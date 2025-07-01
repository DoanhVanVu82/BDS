import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import LandDetails from "@/components/LandDetails";
import PriceAnalysis from "@/components/PriceAnalysis";
import MapSelector from "@/components/MapSelector";
import InteractiveMap from "@/components/InteractiveMap";
import { LandData, mockLandDataList } from "@/data/landData";
import { Button } from "@/components/ui/button";
import { Map, Search } from "lucide-react";

type ViewMode = 'search' | 'map-select' | 'draw-plot' | 'results';

interface Point {
  x?: number;
  y?: number;
  lat: number;
  lng: number;
}

const Index = () => {
  const [selectedLand, setSelectedLand] = useState<LandData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('search');

  const handleSearch = async (address: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const land = mockLandDataList.find(l => l.address === address);
      setSelectedLand(land || null);
      setIsSearching(false);
      setViewMode('results');
    }, 800);
  };

  const handlePlotSelect = (plotId: string) => {
    const land = mockLandDataList.find(l => l.id === plotId);
    setSelectedLand(land || null);
    setViewMode('results');
  };

  const handleCustomPlotDraw = (area: number, points: Point[]) => {
    // Tạo dữ liệu LandData mới dựa trên plot vẽ custom
    const land: LandData = {
      id: "custom",
      address: "Mảnh đất tùy chỉnh",
      area: area,
      plotNumber: "VẼ/CUSTOM",
      shape: "irregular",
      frontDirection: "Đông Nam",
      fullAddress: "Mảnh đất do người dùng vẽ, Quận 1, TP.HCM",
      landType: "Đất ở đô thị",
      legalStatus: "Cần xác minh",
      coordinates: {
        lat: points[0]?.lat || 10.762622,
        lng: points[0]?.lng || 106.660172
      },
      amenities: [],
      roadWidth: 6,
      maxRooms: Math.floor(area / 30),
      expansion: area > 100,
      priceEstimate: {
        pricePerM2: 80000000,
        totalValue: area * 80000000,
        confidence: 70
      },
      recentTransactions: [],
      liquidityDays: 60,
      averagePrice: 78000000
    };
    setSelectedLand(land);
    setViewMode('results');
  };

  const handleReset = () => {
    setSelectedLand(null);
    setViewMode('search');
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'search':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Thông Tin & Định Giá Đất
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Tra cứu thông tin chi tiết và ước tính giá trị bất động sản tại Việt Nam
              </p>
              
              {/* Selection buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={() => setViewMode('map-select')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 text-lg"
                >
                  <Map className="w-5 h-5 mr-2" />
                  Chọn từ bản đồ
                </Button>
                <Button
                  onClick={() => setViewMode('search')}
                  variant="outline"
                  className="px-8 py-3 text-lg border-2 border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm địa chỉ
                </Button>
              </div>
            </div>
            
            <SearchForm onSearch={handleSearch} isSearching={isSearching} />
          </div>
        );

      case 'map-select':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Chọn thửa đất từ bản đồ
              </h2>
              <p className="text-gray-600">
                Chọn một thửa đất có sẵn hoặc vẽ mảnh đất tùy chỉnh
              </p>
            </div>
            
            <MapSelector
              onPlotSelect={handlePlotSelect}
              onDrawCustom={() => setViewMode('draw-plot')}
              onCancel={() => setViewMode('search')}
            />
          </div>
        );

      case 'draw-plot':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Vẽ hình dạng mảnh đất
              </h2>
              <p className="text-gray-600">
                Nhấp vào bản đồ để vẽ hình dạng mảnh đất và dự đoán thông tin
              </p>
            </div>
            
            <InteractiveMap
              onPlotSelected={handleCustomPlotDraw}
              onCancel={() => setViewMode('map-select')}
            />
          </div>
        );

      case 'results':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 text-center">
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ← Tìm kiếm mới
              </button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <LandDetails land={selectedLand!} />
              <PriceAnalysis land={selectedLand!} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {renderContent()}
    </div>
  );
};

export default Index;
