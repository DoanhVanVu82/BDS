import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import LandDetails from "@/components/LandDetails";
import PriceAnalysis from "@/components/PriceAnalysis";
import MapSelector from "@/components/MapSelector";
import { LandData, mockLandDataList } from "@/data/landData";
import { Button } from "@/components/ui/button";
import { Map, Search } from "lucide-react";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useNavigate, useLocation } from "react-router-dom";

type ViewMode = 'search' | 'map-select' | 'results';

interface Point {
  x?: number;
  y?: number;
  lat: number;
  lng: number;
}

const Index = () => {
  const [selectedLand, setSelectedLand] = useState<LandData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine viewMode from URL
  let viewMode: ViewMode = 'search';
  if (location.pathname === '/map-select') viewMode = 'map-select';
  else if (location.pathname === '/results') viewMode = 'results';

  const handleSearch = async (address: string, lat?: number, lng?: number) => {
    setIsSearching(true);
    setTimeout(() => {
      const land = mockLandDataList.find(l => l.address === address);
      if (land) {
        setSelectedLand(land);
      } else {
        // Nếu không có trong mock, tạo LandData tạm
        const tempLand: LandData = {
          id: 'custom-search',
          address: address,
          area: 0,
          plotNumber: '',
          shape: lat && lng ? [{ lat, lng }] : [],
          frontDirection: '',
          fullAddress: address,
          landType: '',
          legalStatus: '',
          amenities: [],
          roadWidth: 0,
          maxRooms: 0,
          expansion: false,
          priceEstimate: {
            pricePerM2: 0,
            totalValue: 0,
            confidence: 0
          },
          recentTransactions: [],
          liquidityDays: 0,
          averagePrice: 0
        };
        setSelectedLand(tempLand);
      }
      setIsSearching(false);
      navigate('/results');
    }, 800);
  };

  const handlePlotSelect = (plotId: string) => {
    const land = mockLandDataList.find(l => l.id === plotId);
    setSelectedLand(land || null);
    navigate('/results');
  };

  const handleReset = () => {
    setSelectedLand(null);
    navigate('/');
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'search':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold leading-normal bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Định Giá Bất Động Sản
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Tra cứu thông tin chi tiết và ước tính giá trị bất động sản tại Việt Nam
              </p>           
            </div>
            
            <SearchForm onSearch={handleSearch} isSearching={isSearching} />
          </div>
        );

      case 'map-select':
        return (
          <div className="container mx-auto px-4 py-8">          
            <MapSelector />
          </div>
        );

      case 'results':
        return (
          <div className="container mx-auto px-4 py-8">          
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
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {renderContent()}
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
