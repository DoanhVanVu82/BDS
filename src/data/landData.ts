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
    shape: { lat: number; lng: number }[];
    fullAddress: string;
    landType: string;
    legalStatus: string;
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
    // 1. Thửa 3 Tờ 82
  {
    id: "hn001",
    address: "Thửa 25 Tờ 83, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 225.8,
    plotNumber: "25/83",
    shape: [
      { lat: 20.980320789122, lng: 105.75531714916 },
      { lat: 20.980139879902, lng: 105.75517226993 },
      { lat: 20.980188961186, lng: 105.75510317632 },
      { lat: 20.980369870892, lng: 105.75524795935 },
      { lat: 20.980335513826, lng: 105.75529635375 },
      { lat: 20.980320789122, lng: 105.75531714916 },
    ],
    fullAddress: "Thửa 25 Tờ 83, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện Hà Đông", distance: 2.3, type: "hospital" },
      { name: "Trường THCS Dương Nội", distance: 1.6, type: "school" },
      { name: "Chợ Dương Nội", distance: 1.1, type: "market" }
    ],
    roadWidth: 12,
    maxRooms: 5,
    expansion: true,
    priceEstimate: {
      pricePerM2: 57000000,
      totalValue: 12441390000,
      confidence: 89
    },
    recentTransactions: [
      { id: "tx013", date: "2025-03-20", area: 220, price: 12500000000, distance: 150, address: "Thửa 1 Tờ 0" },
      { id: "tx014", date: "2025-04-10", area: 215, price: 12000000000, distance: 200, address: "Thửa 2 Tờ 0" }
    ],
    liquidityDays: 50,
    averagePrice: 56500000
  },
  {
    id: "hn002",
    address: "Thửa 3 Tờ 82, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 178.6,
    plotNumber: "3/82",
    shape: [
      { lat: 20.98055188515, lng: 105.75377704898 },
      { lat: 20.980500150636, lng: 105.75371100744 },
      { lat: 20.980636992587, lng: 105.75358830429 },
      { lat: 20.980689717288, lng: 105.75365512019 },
      { lat: 20.98055188515, lng: 105.75377704898 }
    ],
    fullAddress: "Thửa 3 Tờ 82, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện Hà Đông", distance: 2.0, type: "hospital" },
      { name: "Trường THPT Lê Lợi", distance: 1.5, type: "school" },
      { name: "Chợ Hà Đông", distance: 1.0, type: "market" }
    ],
    roadWidth: 15,
    maxRooms: 4,
    expansion: true,
    priceEstimate: {
      pricePerM2: 60000000,
      totalValue: 10716000000,
      confidence: 90
    },
    recentTransactions: [
      { id: "tx003", date: "2025-03-10", area: 180, price: 11000000000, distance: 200, address: "Thửa 5 Tờ 82" },
      { id: "tx004", date: "2025-04-15", area: 175, price: 10500000000, distance: 250, address: "Thửa 4 Tờ 82" }
    ],
    liquidityDays: 45,
    averagePrice: 59500000
  },

  // 2. Thửa 1 Tờ 89
  {
    id: "hn003",
    address: "Thửa 1 Tờ 89, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 6675.1,
    plotNumber: "1/89",
    shape: [
      { lat: 20.977598659932, lng: 105.75070525772 },
      { lat: 20.977678026056, lng: 105.75071180908 },
      { lat: 20.978477548447, lng: 105.75172185077 },
      { lat: 20.978455966288, lng: 105.7518025267 },
      { lat: 20.978215761425, lng: 105.75201463266 },
      { lat: 20.978170074946, lng: 105.75201065339 },
      { lat: 20.977370554223, lng: 105.75100061234 },
      { lat: 20.977358456395, lng: 105.75091736432 },
      { lat: 20.977598659932, lng: 105.75070525772 }
    ],
    fullAddress: "Thửa 1 Tờ 89, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện Hà Đông", distance: 2.5, type: "hospital" },
      { name: "Trường THCS Dương Nội", distance: 1.8, type: "school" },
      { name: "Chợ Dương Nội", distance: 1.2, type: "market" }
    ],
    roadWidth: 25,
    maxRooms: 8,
    expansion: true,
    priceEstimate: {
      pricePerM2: 55000000,
      totalValue: 367130500000,
      confidence: 88
    },
    recentTransactions: [
      { id: "tx005", date: "2025-02-25", area: 6700, price: 370000000000, distance: 300, address: "Thửa 2 Tờ 89" },
      { id: "tx006", date: "2025-05-10", area: 6650, price: 365000000000, distance: 350, address: "Thửa 3 Tờ 89" }
    ],
    liquidityDays: 60,
    averagePrice: 54500000
  },

  // 3. Thửa 63 Tờ 82
  {
    id: "hn004",
    address: "Thửa 63 Tờ 82, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 6659.7,
    plotNumber: "63/82",
    shape: [
      { lat: 20.979414677375, lng: 105.75294561315 },
      { lat: 20.979419754971, lng: 105.75302296078 },
      { lat: 20.979171840211, lng: 105.75324204795 },
      { lat: 20.979121278081, lng: 105.75323765914 },
      { lat: 20.978441998359, lng: 105.75236813623 },
      { lat: 20.978308800439, lng: 105.75219763112 },
      { lat: 20.978318434675, lng: 105.75214315027 },
      { lat: 20.978572600667, lng: 105.75191947749 },
      { lat: 20.978636439362, lng: 105.75192412461 },
      { lat: 20.979414677375, lng: 105.75294561315 }
    ],
    fullAddress: "Thửa 63 Tờ 82, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện 103", distance: 3.0, type: "hospital" },
      { name: "Trường Tiểu học Dương Nội", distance: 2.2, type: "school" },
      { name: "Chợ Hà Đông", distance: 1.5, type: "market" }
    ],
    roadWidth: 22,
    maxRooms: 7,
    expansion: true,
    priceEstimate: {
      pricePerM2: 58000000,
      totalValue: 386262600000,
      confidence: 89
    },
    recentTransactions: [
      { id: "tx007", date: "2025-01-20", area: 6600, price: 380000000000, distance: 250, address: "Thửa 62 Tờ 82" },
      { id: "tx008", date: "2025-03-05", area: 6700, price: 390000000000, distance: 300, address: "Thửa 64 Tờ 82" }
    ],
    liquidityDays: 55,
    averagePrice: 57500000
  },

  // 4. Thửa 39 Tờ 89
  {
    id: "hn005",
    address: "Thửa 39 Tờ 89, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 8100.9,
    plotNumber: "39/89",
    shape: [
      { lat: 20.977481287348, lng: 105.75042760373 },
      { lat: 20.977463948506, lng: 105.7505293619 },
      { lat: 20.976438380692, lng: 105.75143708639 },
      { lat: 20.976374638644, lng: 105.75143099752 },
      { lat: 20.976189079434, lng: 105.75119272267 },
      { lat: 20.976132046165, lng: 105.75111954092 },
      { lat: 20.976135710291, lng: 105.75106695435 },
      { lat: 20.976189844612, lng: 105.75101913993 },
      { lat: 20.977171060207, lng: 105.75015264209 },
      { lat: 20.977248674964, lng: 105.75014668222 },
      { lat: 20.977481287348, lng: 105.75042760373 }
    ],
    fullAddress: "Thửa 39 Tờ 89, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện Hà Đông", distance: 2.8, type: "hospital" },
      { name: "Trường THPT Nguyễn Huệ", distance: 2.0, type: "school" },
      { name: "Chợ Dương Nội", distance: 1.3, type: "market" }
    ],
    roadWidth: 30,
    maxRooms: 10,
    expansion: true,
    priceEstimate: {
      pricePerM2: 52000000,
      totalValue: 421246800000,
      confidence: 87
    },
    recentTransactions: [
      { id: "tx009", date: "2025-04-01", area: 8000, price: 415000000000, distance: 400, address: "Thửa 40 Tờ 89" },
      { id: "tx010", date: "2025-05-20", area: 8200, price: 430000000000, distance: 350, address: "Thửa 38 Tờ 89" }
    ],
    liquidityDays: 65,
    averagePrice: 51500000
  },

  // 5. Thửa 38 Tờ 89
  {
    id: "hn006",
    address: "Thửa 38 Tờ 89, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 3218.3,
    plotNumber: "38/89",
    shape: [
      { lat: 20.976328725565, lng: 105.74965345129 },
      { lat: 20.976330061581, lng: 105.74963720523 },
      { lat: 20.976852214603, lng: 105.74963980947 },
      { lat: 20.9771245473, lng: 105.74998757378 },
      { lat: 20.97711484137, lng: 105.75005849914 },
      { lat: 20.976861314662, lng: 105.75028111837 },
      { lat: 20.976812026238, lng: 105.75027462126 },
      { lat: 20.976328725565, lng: 105.74965345129 }
    ],
    fullAddress: "Thửa 38 Tờ 89, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện 103", distance: 3.2, type: "hospital" },
      { name: "Trường THCS Dương Nội", distance: 1.7, type: "school" },
      { name: "Chợ Hà Đông", distance: 1.4, type: "market" }
    ],
    roadWidth: 18,
    maxRooms: 6,
    expansion: true,
    priceEstimate: {
      pricePerM2: 54000000,
      totalValue: 173788200000,
      confidence: 88
    },
    recentTransactions: [
      { id: "tx011", date: "2025-03-15", area: 3200, price: 170000000000, distance: 200, address: "Thửa 37 Tờ 89" },
      { id: "tx012", date: "2025-04-25", area: 3250, price: 175000000000, distance: 250, address: "Thửa 39 Tờ 89" }
    ],
    liquidityDays: 50,
    averagePrice: 53500000
  },
  {
    id: "hn007",
    address: "Thửa 33 Tờ 83, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 271.1,
    plotNumber: "33/83",
    shape: [
      { lat: 20.980171914014, lng: 105.75552557567 },
      { lat: 20.980112196204, lng: 105.75561009939 },
      { lat: 20.979961352894, lng: 105.75548835631 },
      { lat: 20.97995373411, lng: 105.75543436542 },
      { lat: 20.979992726635, lng: 105.75537945476 },
      { lat: 20.980173095452, lng: 105.75552394668 },
      { lat: 20.980171914014, lng: 105.75552557567 }
    ],
    fullAddress: "Thửa 33 Tờ 83, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện Hà Đông", distance: 2.4, type: "hospital" },
      { name: "Trường THCS Dương Nội", distance: 1.5, type: "school" },
      { name: "Chợ Dương Nội", distance: 1.2, type: "market" }
    ],
    roadWidth: 10,
    maxRooms: 6,
    expansion: false,
    priceEstimate: {
      pricePerM2: 56500000,
      totalValue: 15306615000,
      confidence: 88
    },
    recentTransactions: [
      { id: "tx021", date: "2025-03-12", area: 270, price: 15200000000, distance: 130, address: "Thửa 4 Tờ 83" },
      { id: "tx022", date: "2025-04-02", area: 275, price: 15500000000, distance: 180, address: "Thửa 5 Tờ 83" }
    ],
    liquidityDays: 52,
    averagePrice: 56200000
  },
  {
    id: "hn008",
    address: "Thửa 34 Tờ 83, Phường Dương Nội, Hà Đông, Hà Nội",
    area: 226,
    plotNumber: "34/83",
    shape: [
      { lat: 20.980173095452, lng: 105.75552394668 },
      { lat: 20.979992726635, lng: 105.75537945476 },
      { lat: 20.980041989497, lng: 105.75531016986 },
      { lat: 20.980222718382, lng: 105.75545495208 },
      { lat: 20.980173095452, lng: 105.75552394668 }
    ],
    fullAddress: "Thửa 34 Tờ 83, Phường Dương Nội, Hà Đông, Hà Nội",
    landType: "Đất ở tại đô thị",
    legalStatus: "Sổ đỏ chính chủ",
    amenities: [
      { name: "Bệnh viện Hà Đông", distance: 2.2, type: "hospital" },
      { name: "Trường THCS Dương Nội", distance: 1.4, type: "school" },
      { name: "Chợ Dương Nội", distance: 1.0, type: "market" }
    ],
    roadWidth: 8,
    maxRooms: 5,
    expansion: true,
    priceEstimate: {
      pricePerM2: 57000000,
      totalValue: 12882000000,
      confidence: 90
    },
    recentTransactions: [
      { id: "tx023", date: "2025-03-25", area: 225, price: 12750000000, distance: 100, address: "Thửa 6 Tờ 83" },
      { id: "tx024", date: "2025-04-15", area: 230, price: 13100000000, distance: 160, address: "Thửa 7 Tờ 83" }
    ],
    liquidityDays: 48,
    averagePrice: 56800000
  }  
  ];