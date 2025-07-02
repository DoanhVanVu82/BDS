import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { mockLandDataList } from "@/data/landData";
import { useNavigate } from "react-router-dom";

const GEOAPIFY_API_KEY = "c50f34a02d844479ba7f566f1f178a31"; // <-- Thay bằng API key Geoapify của bạn

interface SearchFormProps {
  onSearch: (address: string, lat?: number, lng?: number) => void;
  isSearching: boolean;
}

const SearchForm = ({ onSearch, isSearching }: SearchFormProps) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedLat, setSelectedLat] = useState<number | undefined>(undefined);
  const [selectedLng, setSelectedLng] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      // Gọi onSearch nếu cần, hoặc chỉ chuyển trang
      // onSearch(address.trim());
      navigate('/property-form', { state: { address: address.trim(), lat: selectedLat, lng: selectedLng } });
    }
  };

  const fetchSuggestions = async (value: string) => {
    if (value.trim().length > 2) {
      setLoading(true);
      setShowSuggestions(true);
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&lang=vi&limit=5&filter=countrycode:vn&apiKey=${GEOAPIFY_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        let apiSuggestions = data.features || [];
        // Fuzzy search với fuse.js
        const fuse = new Fuse(mockLandDataList, {
          keys: ["address"],
          threshold: 0.4,
          distance: 100,
        });
        const mockSuggestions = fuse.search(value.trim()).map(result => ({
          properties: {
            formatted: result.item.address,
            lat: result.item.shape[0]?.lat,
            lon: result.item.shape[0]?.lng,
            place_id: `mock-${result.item.id}`
          }
        }));
        // Gộp, loại trùng (theo formatted)
        const allSuggestions = [...mockSuggestions, ...apiSuggestions.filter(apiSug =>
          !mockSuggestions.some(mock => mock.properties.formatted === apiSug.properties.formatted)
        )];
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout for 500ms
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  const handleSuggestionClick = (sug: any) => {
    const cleanAddress = sug.properties.formatted.replace(/,? ?\d{5},? ?Việt Nam$/, '').replace(/,? ?Việt Nam$/, '');
    setAddress(cleanAddress);
    setShowSuggestions(false);
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (sug.properties.lat && sug.properties.lon) {
      setSelectedLat(sug.properties.lat);
      setSelectedLng(sug.properties.lon);
    } else {
      setSelectedLat(undefined);
      setSelectedLng(undefined);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Ẩn suggestions khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSuggestions &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className="max-w-2xl mx-auto overflow-visible" ref={containerRef}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-visible">
        <div className="p-8 overflow-visible">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Nhập địa chỉ</h2>
              <p className="text-gray-600">Tìm hiểu thông tin chi tiết về lô đất</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
            <div className="relative overflow-visible">
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
                <ul className="absolute left-0 right-0 top-14 bg-white border border-gray-200 rounded-b-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  {suggestions.map((sug, idx) => (
                    <li
                      key={sug.properties.place_id || idx}
                      className="p-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      {sug.properties.formatted.replace(/,? ?\d{5},? ?Việt Nam$/, '').replace(/,? ?Việt Nam$/, '')}
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
