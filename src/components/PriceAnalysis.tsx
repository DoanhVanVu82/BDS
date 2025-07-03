import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  BarChart3,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LandData } from "@/data/landData";
import { useState } from "react";
import ValuationNarrative from "./ValuationNarrative";

interface PriceAnalysisProps {
  land: LandData;
}

const PriceAnalysis = ({ land }: PriceAnalysisProps) => {
  const [showValuationNarrative, setShowValuationNarrative] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} tr`;
    }
    return formatCurrency(amount);
  };

  // Mock price trend data
  const priceHistory = [
    { month: 'T1', price: 78 },
    { month: 'T2', price: 82 },
    { month: 'T3', price: 79 },
    { month: 'T4', price: 85 },
    { month: 'T5', price: 88 },
    { month: 'T6', price: 85 },
  ];

  const currentPrice = land.priceEstimate.pricePerM2;
  const previousPrice = 55000000; // Mock previous price
  const priceChange = ((currentPrice - previousPrice) / previousPrice * 100);

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white pb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <DollarSign className="w-7 h-7" />
            Ước tính giá trị
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-blue-100 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-2">Giá / m²</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(land.priceEstimate.pricePerM2)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {priceChange > 0 ? (
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  priceChange > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {Math.abs(priceChange).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-2">Tổng giá trị</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(land.priceEstimate.totalValue)}
              </p>
              <Badge 
                variant="outline" 
                className="mt-2 bg-blue-50 text-blue-700 border-blue-200"
              >
                Độ tin cậy: {land.priceEstimate.confidence}%
              </Badge>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Thời gian thanh khoản</p>
              <p className="text-lg font-semibold text-gray-800">{land.liquidityDays} ngày</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Giá TB khu vực</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatCurrency(land.averagePrice)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            Xu hướng giá đất (triệu VNĐ/m²)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => [`${value} triệu VNĐ`, 'Giá / m²']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Narrative với toggle */}
      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              Phân tích chi tiết định giá
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowValuationNarrative(!showValuationNarrative)}
              className="text-white hover:bg-white/20"
            >
              {showValuationNarrative ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        {showValuationNarrative && (
          <CardContent className="p-0">
            <ValuationNarrative land={land} />
          </CardContent>
        )}
      </Card>

      <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-cyan-600 text-white">
          <CardTitle className="text-xl font-bold">Giao dịch gần đây</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {land.recentTransactions.map((transaction, index) => (
              <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{transaction.address}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Diện tích: {transaction.area} m² • Cách: {transaction.distance}m
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      {formatCurrency(transaction.price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(transaction.price / transaction.area)}/m²
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default PriceAnalysis;
