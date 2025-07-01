export interface Amenity {
    name: string;
    distance: number; // in km
    type: 'hospital' | 'school' | 'market' | 'park' | 'transport';
  }
  
  export interface Transaction {
    id: string;
    date: string;
    area: number;
    price: number;
    distance: number; // in meters
    address: string;
  }
  
  export interface PriceEstimate {
    pricePerM2: number;
    totalValue: number;
    confidence: number; // percentage
  }
  
  export interface LandData {
    id: string;
    address: string;
    area: number;
    plotNumber: string;
    shape: 'rectangular' | 'square' | 'irregular' | 'triangular';
    frontDirection: string;
    fullAddress: string;
    landType: string;
    legalStatus: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    amenities: Amenity[];
    roadWidth: number; // in meters
    maxRooms: number;
    expansion: boolean; // Nở hậu
    priceEstimate: PriceEstimate;
    recentTransactions: Transaction[];
    liquidityDays: number; // Tốc độ thanh khoản (số ngày)
    averagePrice: number; // Giá trung bình khu vực
  }
  
  // Bổ sung lượng lớn dữ liệu mẫu
  export const mockLandDataList: LandData[] = [
    // --- Dữ liệu tại TP.HCM ---
    {
      id: "hcm001",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      area: 120,
      plotNumber: "254/3B",
      shape: "rectangular",
      frontDirection: "Đông Nam",
      fullAddress: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
      landType: "Đất ở đô thị",
      legalStatus: "Sổ đỏ chính chủ",
      coordinates: { lat: 10.7769, lng: 106.7009 },
      amenities: [
        { name: "Bệnh viện Nhi Đồng 2", distance: 1.5, type: "hospital" },
        { name: "Trường THPT Trưng Vương", distance: 1.2, type: "school" },
        { name: "Chợ Bến Thành", distance: 0.8, type: "market" }
      ],
      roadWidth: 20,
      maxRooms: 6,
      expansion: true,
      priceEstimate: {
        pricePerM2: 850000000,
        totalValue: 102000000000,
        confidence: 92
      },
      recentTransactions: [
        { id: "tx001", date: "2025-01-15", area: 115, price: 95000000000, distance: 150, address: "Số 12 Đồng Khởi" },
        { id: "tx002", date: "2025-02-20", area: 130, price: 112000000000, distance: 200, address: "Số 45 Hai Bà Trưng" }
      ],
      liquidityDays: 30,
      averagePrice: 845000000
    },
    {
      id: "hcm002",
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      area: 80,
      plotNumber: "88A/12",
      shape: "square",
      frontDirection: "Tây Bắc",
      fullAddress: "456 Lê Lợi, Phường 6, Quận 3, TP.HCM",
      landType: "Đất ở đô thị",
      legalStatus: "Sổ hồng",
      coordinates: { lat: 10.782, lng: 106.694 },
      amenities: [
        { name: "Bệnh viện Bình Dân", distance: 2.1, type: "hospital" },
        { name: "Trường THCS Lê Quý Đôn", distance: 0.5, type: "school" },
        { name: "Công viên Tao Đàn", distance: 1.0, type: "park" }
      ],
      roadWidth: 8,
      maxRooms: 4,
      expansion: false,
      priceEstimate: {
        pricePerM2: 350000000,
        totalValue: 28000000000,
        confidence: 88
      },
      recentTransactions: [
        { id: "tx003", date: "2025-03-10", area: 75, price: 25500000000, distance: 300, address: "Hẻm 120 Võ Văn Tần" }
      ],
      liquidityDays: 45,
      averagePrice: 340000000
    },
    {
      id: "hcm003",
      address: "789 Cách Mạng Tháng Tám, Quận 10, TP.HCM",
      area: 250,
      plotNumber: "12",
      shape: "irregular",
      frontDirection: "Nam",
      fullAddress: "789 Cách Mạng Tháng Tám, Phường 15, Quận 10, TP.HCM",
      landType: "Đất thương mại dịch vụ",
      legalStatus: "Giấy tờ tay",
      coordinates: { lat: 10.774, lng: 106.666 },
      amenities: [
        { name: "Bệnh viện 115", distance: 0.7, type: "hospital" },
        { name: "Siêu thị Big C Miền Đông", distance: 0.5, type: "market" },
        { name: "Ga Sài Gòn", distance: 2.0, type: "transport" }
      ],
      roadWidth: 15,
      maxRooms: 10,
      expansion: true,
      priceEstimate: {
        pricePerM2: 280000000,
        totalValue: 70000000000,
        confidence: 75
      },
      recentTransactions: [
          { id: "tx004", date: "2025-04-01", area: 240, price: 65000000000, distance: 50, address: "Mặt tiền Tô Hiến Thành" },
          { id: "tx005", date: "2025-05-22", area: 260, price: 72000000000, distance: 100, address: "Góc Sư Vạn Hạnh" }
      ],
      liquidityDays: 60,
      averagePrice: 275000000
    },
    // --- Dữ liệu tại Hà Nội ---
    {
      id: "hn001",
      address: "25 Phố Huế, Hai Bà Trưng, Hà Nội",
      area: 95,
      plotNumber: "55/HBT",
      shape: "rectangular",
      frontDirection: "Đông",
      fullAddress: "25 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
      landType: "Đất ở đô thị",
      legalStatus: "Sổ đỏ chính chủ",
      coordinates: { lat: 21.0165, lng: 105.8525 },
      amenities: [
        { name: "Bệnh viện Việt Đức", distance: 1.0, type: "hospital" },
        { name: "Trường THPT Việt Đức", distance: 0.8, type: "school" },
        { name: "Hồ Hoàn Kiếm", distance: 1.2, type: "park" }
      ],
      roadWidth: 12,
      maxRooms: 5,
      expansion: false,
      priceEstimate: {
        pricePerM2: 600000000,
        totalValue: 57000000000,
        confidence: 95
      },
      recentTransactions: [
        { id: "tx006", date: "2025-06-18", area: 100, price: 61000000000, distance: 100, address: "Số 10 Hàng Bài" }
      ],
      liquidityDays: 40,
      averagePrice: 590000000
    },
    {
      id: "hn002",
      address: "102 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      area: 150,
      plotNumber: "CG-88",
      shape: "square",
      frontDirection: "Tây",
      fullAddress: "102 Trần Duy Hưng, Phường Trung Hoà, Quận Cầu Giấy, Hà Nội",
      landType: "Đất dự án",
      legalStatus: "Đang chờ sổ",
      coordinates: { lat: 21.0076, lng: 105.8025 },
      amenities: [
        { name: "Bệnh viện Giao thông Vận tải", distance: 2.5, type: "hospital" },
        { name: "Trường THPT Chuyên Hà Nội - Amsterdam", distance: 1.0, type: "school" },
        { name: "Siêu thị Big C Thăng Long", distance: 0.5, type: "market" }
      ],
      roadWidth: 30,
      maxRooms: 8,
      expansion: true,
      priceEstimate: {
        pricePerM2: 450000000,
        totalValue: 67500000000,
        confidence: 85
      },
      recentTransactions: [
          { id: "tx007", date: "2025-02-11", area: 145, price: 64000000000, distance: 250, address: "Ngã tư Hoàng Đạo Thuý" },
          { id: "tx008", date: "2025-04-29", area: 160, price: 70000000000, distance: 300, address: "Đối diện Grand Plaza" }
      ],
      liquidityDays: 55,
      averagePrice: 440000000
    },
    // --- Dữ liệu tại Đà Nẵng ---
    {
      id: "dn001",
      address: "55 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
      area: 300,
      plotNumber: "ST-202",
      shape: "rectangular",
      frontDirection: "Đông",
      fullAddress: "55 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng",
      landType: "Đất thương mại dịch vụ",
      legalStatus: "Sổ hồng",
      coordinates: { lat: 16.064, lng: 108.243 },
      amenities: [
        { name: "Bệnh viện Đa khoa Đà Nẵng", distance: 4.0, type: "hospital" },
        { name: "Bãi biển Mỹ Khê", distance: 0.1, type: "park" },
        { name: "Chợ hải sản Phước Mỹ", distance: 1.0, type: "market" }
      ],
      roadWidth: 25,
      maxRooms: 15,
      expansion: false,
      priceEstimate: {
        pricePerM2: 300000000,
        totalValue: 90000000000,
        confidence: 90
      },
      recentTransactions: [
          { id: "tx009", date: "2025-03-03", area: 280, price: 82000000000, distance: 500, address: "Đường Hồ Nghinh" },
          { id: "tx010", date: "2025-05-19", area: 320, price: 95000000000, distance: 400, address: "Khách sạn gần cầu Rồng" }
      ],
      liquidityDays: 70,
      averagePrice: 295000000
    },
    {
      id: "dn002",
      address: "2 Bạch Đằng, Hải Châu, Đà Nẵng",
      area: 180,
      plotNumber: "HC-101",
      shape: "triangular",
      frontDirection: "Bắc",
      fullAddress: "2 Bạch Đằng, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng",
      landType: "Đất ở đô thị",
      legalStatus: "Sổ đỏ chính chủ",
      coordinates: { lat: 16.071, lng: 108.223 },
      amenities: [
          { name: "Bệnh viện C Đà Nẵng", distance: 0.8, type: "hospital" },
          { name: "Trường THPT Phan Châu Trinh", distance: 1.5, type: "school" },
          { name: "Chợ Cồn", distance: 1.2, type: "market" },
          { name: "Sân bay Quốc tế Đà Nẵng", distance: 3.0, type: "transport"}
      ],
      roadWidth: 18,
      maxRooms: 7,
      expansion: false,
      priceEstimate: {
          pricePerM2: 400000000,
          totalValue: 72000000000,
          confidence: 93
      },
      recentTransactions: [
          { id: "tx011", date: "2025-01-30", area: 170, price: 68000000000, distance: 200, address: "Đường Nguyễn Văn Linh" }
      ],
      liquidityDays: 50,
      averagePrice: 390000000
    }
  ];