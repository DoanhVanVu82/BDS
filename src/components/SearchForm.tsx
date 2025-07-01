import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockLandDataList } from "@/data/landData";

interface SearchFormProps {
  onSearch: (address: string) => void;
  isSearching: boolean;
}

const SearchForm = ({ onSearch, isSearching }: SearchFormProps) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  const suggestedAddresses = mockLandDataList.map(l => l.address);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Nhập địa chỉ</h2>
              <p className="text-gray-600">Tìm hiểu thông tin chi tiết về lô đất</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Nhập địa chỉ đất (VD: 123 Nguyễn Huệ, Quận 1, TP.HCM)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
                disabled={isSearching}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={!address.trim() || isSearching}
              className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang tìm kiếm...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm thông tin
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Gợi ý địa chỉ:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedAddresses.map((addr, index) => (
              <button
                key={index}
                onClick={() => setAddress(addr)}
                className="text-left text-sm p-3 rounded-lg bg-white hover:bg-green-50 hover:text-green-700 transition-colors duration-200 border border-gray-200 hover:border-green-300"
                disabled={isSearching}
              >
                {addr}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
