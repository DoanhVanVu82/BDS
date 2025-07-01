import { useLocation } from 'react-router-dom';
import { FaChartBar, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockLandDataList } from '../data/landData';
import 'leaflet/dist/leaflet.css';

const DashboardPage = () => {
  const location = useLocation();
  const input = location.state || {};
  // Tìm lô đất trong mockLandDataList theo địa chỉ gần đúng
  const lot = mockLandDataList.find(l => l.address.toLowerCase().includes((input.address || '').toLowerCase()));

  return (
    <div className="dashboard-root">
      <div className="dashboard-card">
        <h1><FaChartBar style={{ color: 'var(--primary)', marginRight: 8 }} />Kết quả phân tích & dự đoán giá trị</h1>
        <div style={{ marginBottom: 24 }}>
          <b>Địa chỉ:</b> {input.address}
        </div>
        <div style={{ marginBottom: 24 }}>
          <MapContainer center={[parseFloat(input.lat), parseFloat(input.lng)]} zoom={17} style={{ height: 220, width: '100%', borderRadius: 12 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[parseFloat(input.lat), parseFloat(input.lng)]}>
              <Popup>{input.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {lot ? (
          <>
            <div className="result-row">
              <div className="result-main">
                <div className="result-title">Giá trị dự đoán:</div>
                <div className="result-value">{lot.priceEstimate.totalValue.toLocaleString()} VNĐ</div>
                <div className="result-sub">({lot.priceEstimate.pricePerM2.toLocaleString()} VNĐ/m²)</div>
                <div className="result-confidence">Độ tin cậy mô hình: <b>{lot.priceEstimate.confidence}%</b></div>
                <div className="result-liquidity">Tốc độ thanh khoản: {lot.liquidityDays} ngày</div>
                <div className="result-avg">Giá trung bình khu vực: {lot.averagePrice.toLocaleString()} VNĐ/m²</div>
              </div>
              <div className="result-trend">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={[
                    { month: 'T6', price: lot.priceEstimate.pricePerM2 * 0.95 },
                    { month: 'T7', price: lot.priceEstimate.pricePerM2 * 0.97 },
                    { month: 'T8', price: lot.priceEstimate.pricePerM2 * 1.01 },
                    { month: 'T9', price: lot.priceEstimate.pricePerM2 * 1.03 },
                    { month: 'T10', price: lot.priceEstimate.pricePerM2 * 1.05 },
                    { month: 'T11', price: lot.priceEstimate.pricePerM2 },
                  ]}>
                    <XAxis dataKey="month" />
                    <YAxis hide />
                    <Tooltip formatter={v => v.toLocaleString()} />
                    <Line type="monotone" dataKey="price" stroke="#1976d2" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="result-recommend"><FaCheckCircle style={{ color: '#43a047', marginRight: 6 }} />{lot.priceEstimate.confidence > 85 ? 'Giá thị trường ổn định, có thể cân nhắc mua/bán.' : 'Cần cân nhắc thêm, thị trường biến động.'}</div>
            <div style={{ marginTop: 24 }}>
              <b>Tiện ích xung quanh:</b>
              <ul>
                {lot.amenities.map(a => <li key={a.name}>{a.name} ({a.type}) - {a.distance}km</li>)}
              </ul>
            </div>
            <div style={{ marginTop: 24 }}>
              <b>Giao dịch gần đây:</b>
              <ul>
                {lot.recentTransactions.map(tx => <li key={tx.id}>{tx.address} - {tx.area}m² - {tx.price.toLocaleString()} VNĐ - {tx.date} - {tx.distance}m</li>)}
              </ul>
            </div>
          </>
        ) : (
          <div style={{ color: '#d32f2f', fontWeight: 500, marginTop: 24 }}>
            <FaMapMarkerAlt style={{ marginRight: 6 }} />Chưa có dữ liệu phân tích chi tiết cho địa chỉ này.<br />Bạn vẫn có thể xem vị trí trên bản đồ.
          </div>
        )}
      </div>
      <style>{`
        .dashboard-root { display: flex; justify-content: center; align-items: flex-start; min-height: 60vh; }
        .dashboard-card { background: var(--card-bg); border-radius: 12px; box-shadow: var(--card-shadow); padding: 32px; max-width: 700px; margin: 32px 0; width: 100%; border: 1px solid var(--border); }
        h1 { font-size: 1.5rem; margin-bottom: 24px; }
        .result-row { display: flex; gap: 32px; align-items: flex-start; }
        .result-main { flex: 1; }
        .result-title { font-size: 1.1rem; color: var(--primary); margin-bottom: 4px; }
        .result-value { font-size: 2.1rem; font-weight: 700; color: #2e7d32; }
        .result-sub { color: var(--primary); font-size: 1.1rem; margin-bottom: 8px; }
        .result-confidence { color: #888; font-size: 0.98rem; margin-bottom: 8px; }
        .result-liquidity, .result-avg { color: #1976d2; font-size: 1rem; margin-bottom: 4px; }
        .result-trend { flex: 1; min-width: 180px; }
        .result-recommend { margin-top: 24px; background: #e3f0ff55; border-radius: 8px; padding: 12px 16px; color: #1976d2; font-weight: 500; display: flex; align-items: center; }
        @media (max-width: 700px) {
          .result-row { flex-direction: column; gap: 0; }
          .dashboard-card { padding: 16px; }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage; 