// src/components/ValuationNarrative.tsx

import { LandData } from "@/data/landData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, AlertTriangle, BarChart3, Star, Zap } from "lucide-react";

interface ValuationNarrativeProps {
  // Nhận toàn bộ dữ liệu của lô đất để phân tích
  land: LandData;
}

const ValuationNarrative = ({ land }: ValuationNarrativeProps) => {
  const positiveFactors: string[] = [];
  const considerationFactors: string[] = [];
  let marketAnalysis: string = '';
  
  // --- Bắt đầu phân tích dữ liệu từ `land` ---

  // Lấy các dữ liệu con để code gọn hơn
  const viTri = (land as any).viTriDat || (land as any).viTriNha || '';
  const dacDiem = (land as any).dacDiemDat || (land as any).dacDiemNha || [];
  const tiemNang = (land as any).tiemNangDat || (land as any).tiemNangNha || [];

  // 1. Phân tích Vị trí & Lợi thế Vật lý
  if (viTri.includes('Mặt phố') || viTri.includes('Mặt tiền')) {
    positiveFactors.push(`Sở hữu vị trí "vàng" mặt tiền đường lớn, mang lại giá trị thương mại và nhận diện thương hiệu vượt trội.`);
  } else if (viTri.includes('Hẻm xe hơi')) {
    positiveFactors.push(`Lối vào là hẻm xe hơi rộng rãi, đảm bảo sự thuận tiện cho việc di chuyển và sinh hoạt.`);
  }
  
  if (dacDiem.includes('Lô góc') || dacDiem.includes('Căn góc')) {
    positiveFactors.push("Là lô góc với 2 mặt thoáng, tối ưu hóa không gian, ánh sáng tự nhiên và tiềm năng quảng cáo.");
  }

  if (land.roadWidth >= 5) {
    positiveFactors.push(`Đường trước nhà rộng ${land.roadWidth}m, tạo điều kiện lý tưởng cho giao thông và các hoạt động kinh doanh.`);
  }

  // 2. Phân tích Pháp lý & Quy hoạch
  if (land.legalStatus === 'Sổ đỏ chính chủ' || dacDiem.includes('Full thổ cư')) {
    positiveFactors.push("Pháp lý minh bạch với sổ đỏ/hồng và full thổ cư là yếu tố đảm bảo an toàn tuyệt đối và tiềm năng tăng giá bền vững.");
  } else if (dacDiem.includes('Có thổ cư')) {
    positiveFactors.push("Đã có một phần đất thổ cư, cho phép xây dựng và khai thác ngay trên diện tích được cấp phép.");
  } else {
    considerationFactors.push(`Tình trạng pháp lý (${land.legalStatus}) cần được người mua thẩm định kỹ lưỡng để đảm bảo quyền lợi lâu dài.`);
  }

  // 3. Phân tích Tiềm năng & Tiện ích
  if (tiemNang.includes('Kinh doanh dòng tiền') || tiemNang.includes('Tiện cho thuê')) {
      positiveFactors.push("Cấu trúc và vị trí phù hợp để khai thác dòng tiền ổn định hàng tháng từ việc cho thuê.");
  }
  if (land.amenities?.some(a => a.distance < 1.5)) {
    positiveFactors.push("Hệ sinh thái tiện ích ngoại khu dày đặc trong bán kính gần, nâng cao chất lượng sống và sức hấp dẫn của bất động sản.");
  }

  // 4. Phân tích Thị trường (dựa trên dữ liệu từ PriceAnalysis)
  if (land.priceEstimate && land.averagePrice) {
    const priceRatio = land.priceEstimate.pricePerM2 / land.averagePrice;
    let comparisonText = '';
    if (priceRatio <= 1.05) {
      comparisonText = "Mức giá đề xuất rất cạnh tranh, ngang bằng hoặc thấp hơn giá trị trung bình trong khu vực.";
    } else {
      comparisonText = "Giá đề xuất cao hơn mặt bằng chung, phản ánh các ưu điểm độc tôn về vị trí và pháp lý của tài sản.";
    }
    
    let liquidityText = '';
    if (land.liquidityDays <= 45) {
      liquidityText = `Thanh khoản dự kiến rất tốt (${land.liquidityDays} ngày), cho thấy nhu cầu cao đối với các bất động sản tương tự.`;
    } else {
      liquidityText = `Thời gian thanh khoản dự kiến ở mức trung bình (${land.liquidityDays} ngày), phù hợp với phân khúc giá trị.`;
    }
    marketAnalysis = `${comparisonText} ${liquidityText}`;
  }

  return (
    <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6 space-y-6 text-base">
        <div>
          <h4 className="font-semibold text-blue-700 flex items-center gap-2 mb-2">
            <ThumbsUp className="w-5 h-5" />
            Các yếu tố làm tăng giá trị
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-gray-800 pl-2">
            {positiveFactors.length > 0 ? 
              positiveFactors.map((factor, index) => <li key={`pos-${index}`}>{factor}</li>) :
              <li>Không có yếu tố nổi bật đặc biệt.</li>
            }
          </ul>
        </div>

        {considerationFactors.length > 0 && (
          <div>
            <h4 className="font-semibold text-amber-700 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              Các yếu tố cần cân nhắc
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-gray-800 pl-2">
              {considerationFactors.map((factor, index) => <li key={`con-${index}`}>{factor}</li>)}
            </ul>
          </div>
        )}

        {marketAnalysis && (
          <div>
            <h4 className="font-semibold text-blue-700 flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5" />
              Phân tích Thị trường
            </h4>
            <p className="text-gray-800 pl-2">{marketAnalysis}</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-indigo-700 flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            Kết luận
          </h4>
          <p className="text-gray-800 pl-2">
            Tổng hợp các yếu tố trên, mức giá ước tính đã phản ánh toàn diện các giá trị nội tại và lợi thế cạnh tranh của bất động sản so với thị trường hiện tại.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationNarrative;