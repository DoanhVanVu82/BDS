import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onSearch: (address: string, lat?: number, lng?: number) => void;
  isSearching: boolean;
}

const SearchForm = ({ onSearch, isSearching }: SearchFormProps) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value.trim().length > 2) {
      setLoading(true);
      setShowSuggestions(true);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5&accept-language=vi`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data);
      setLoading(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (sug: any) => {
    setAddress(sug.display_name);
    setShowSuggestions(false);
    onSearch(sug.display_name, parseFloat(sug.lat), parseFloat(sug.lon));
  };

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
                onChange={handleInputChange}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
                disabled={isSearching}
                autoComplete="off"
                onFocus={() => address.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
              />
              {loading && <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 animate-spin w-5 h-5" />}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-b-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                  {suggestions.map((sug, idx) => (
                    <li
                      key={sug.place_id}
                      className="p-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      {sug.display_name}
                    </li>
                  ))}
                </ul>
              )}
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
      </div>
    </div>
  );
};

export default SearchForm;
