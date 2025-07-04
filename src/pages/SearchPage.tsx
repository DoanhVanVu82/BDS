import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import { mockLandDataList, LandData } from "@/data/landData";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (address: string, lat?: number, lng?: number) => {
    setIsSearching(true);
    setTimeout(() => {
      const land = mockLandDataList.find(l => l.address === address);
      if (land) {
        navigate('/property-form', { state: { ...land } });
      } else {
        // Nếu không có trong mock, tạo LandData tạm và truyền qua state
        const tempLand: LandData = {
          id: 'custom-search',
          address: address,
          area: 0,
          plotNumber: '',
          shape: lat && lng ? [{ lat, lng }] : [],
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
        navigate('/property-form', { state: { ...tempLand } });
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold leading-normal bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Định Giá Bất Động Sản
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Tra cứu thông tin và ước tính giá trị bất động sản tại Việt Nam
        </p>           
      </div>
      <SearchForm onSearch={handleSearch} isSearching={isSearching} />
    </div>
  );
};

export default SearchPage; 