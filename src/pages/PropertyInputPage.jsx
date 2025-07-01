import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRulerCombined, FaCompass, FaHome, FaSpinner } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const fetchAddressSuggestions = async (query) => {
  if (!query) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
  const res = await fetch(url);
  return res.json();
};

const DEFAULT_POSITION = { lat: 14.0583, lng: 108.2772 }; // Trung tâm VN

const PropertyInputPage = () => {
  const [form, setForm] = useState({
    address: '',
    area: '',
    door_orientation: '',
    land_type: '',
    lat: '',
    lng: ''
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === 'address') {
      setShowSuggestions(true);
      setAddressLoading(true);
      fetchAddressSuggestions(e.target.value).then(data => {
        setSuggestions(data);
        setAddressLoading(false);
      });
    }
  };

  const handleSuggestionClick = (sug) => {
    setForm(f => ({
      ...f,
      address: sug.display_name,
      lat: sug.lat,
      lng: sug.lon
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard', { state: { ...form } });
    }, 1200);
  };

  const hasLatLng = form.lat && form.lng;

  return (
    <div className="input-root">
      <form className="input-card" onSubmit={handleSubmit} autoComplete="off">
        <h1><FaHome style={{ color: 'var(--primary)', marginRight: 8 }} />Nhập thông tin bất động sản</h1>
        <div className="input-row"><FaMapMarkerAlt />
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ bất kỳ..."
              autoComplete="off"
              onFocus={() => form.address && setShowSuggestions(true)}
            />
            {addressLoading && <FaSpinner className="spin" style={{ position: 'absolute', right: 8, top: 12, color: '#1976d2' }} />}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map(sug => (
                  <li key={sug.place_id} onClick={() => handleSuggestionClick(sug)}>{sug.display_name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {hasLatLng && (
          <div style={{ margin: '16px 0', width: '100%' }}>
            <MapContainer center={[parseFloat(form.lat), parseFloat(form.lng)]} zoom={17} style={{ height: 220, width: '100%', borderRadius: 12 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[parseFloat(form.lat), parseFloat(form.lng)]}>
                <Popup>{form.address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
        <div className="input-row"><FaRulerCombined />
          <input name="area" value={form.area} onChange={handleChange} required placeholder="Diện tích (m²)" type="number" min={1} />
        </div>
        <div className="input-row"><FaCompass />
          <input name="door_orientation" value={form.door_orientation} onChange={handleChange} required placeholder="Hướng cửa chính" />
        </div>
        <div className="input-row"><FaHome />
          <input name="land_type" value={form.land_type} onChange={handleChange} required placeholder="Loại đất" />
        </div>
        <button className="submit-btn" type="submit" disabled={loading}>{loading ? 'Đang phân tích...' : 'Phân tích & Dự đoán giá'}</button>
      </form>
      <style>{`
        .input-root { display: flex; justify-content: center; align-items: flex-start; min-height: 60vh; }
        .input-card { background: var(--card-bg); border-radius: 12px; box-shadow: var(--card-shadow); padding: 32px; max-width: 500px; margin: 32px 0; width: 100%; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 18px; }
        h1 { font-size: 1.3rem; margin-bottom: 8px; }
        .input-row { display: flex; align-items: center; gap: 8px; }
        input { flex: 1; padding: 10px 12px; border-radius: 6px; border: 1px solid var(--border); font-size: 1rem; background: var(--tx-bg); color: var(--text); transition: border 0.2s; }
        input:focus { border: 1.5px solid var(--primary); outline: none; background: #e3f0ff22; }
        .submit-btn { background: var(--primary); color: #fff; border: none; border-radius: 6px; padding: 12px; font-size: 1.1rem; font-weight: 600; margin-top: 12px; cursor: pointer; transition: background 0.2s; }
        .submit-btn:hover { background: #125ea2; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .suggestion-list { position: absolute; left: 0; right: 0; top: 40px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 0 0 8px 8px; z-index: 10; max-height: 180px; overflow-y: auto; box-shadow: 0 4px 16px #0002; list-style: none; margin: 0; padding: 0; }
        .suggestion-list li { padding: 8px 12px; cursor: pointer; transition: background 0.15s; }
        .suggestion-list li:hover { background: #e3f0ff; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .input-card { padding: 16px; }
        }
      `}</style>
    </div>
  );
};

export default PropertyInputPage; 