const Footer = () => {
  return (
    <footer className="w-full bg-blue-50 border-t border-blue-100 py-8 mt-12 text-center text-sm text-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        {/* Thông tin liên hệ */}
        <div className="flex flex-col gap-1 text-left">
          <div><span className="font-semibold text-gray-700">Hotline:</span> <a href="tel:18001234" className="text-blue-700 hover:underline ml-1">1800 1234</a></div>
          <div><span className="font-semibold text-gray-700">Email:</span> <a href="mailto:support@bds.vn" className="text-blue-700 hover:underline ml-1">support@bds.vn</a></div>
          <div><span className="font-semibold text-gray-700">Địa chỉ:</span> 24 Galaxy 6, Vạn Phúc, Hà Đông, Hà Nội</div>
        </div>
        {/* Liên kết mạng xã hội và chính sách */}
        <div className="flex flex-col gap-2 items-center md:items-end">
          <div className="flex gap-3">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-700"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
            <a href="https://zalo.me/" target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="hover:text-blue-700"><svg width="20" height="20" fill="currentColor" viewBox="0 0 48 48"><path d="M24 4C12.954 4 4 12.954 4 24c0 11.046 8.954 20 20 20s20-8.954 20-20C44 12.954 35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16-7.163 16-16 16zm-2-24h-4v12h4V16zm8 0h-4v12h4V16z"/></svg></a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="Github" className="hover:text-blue-700"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
          </div>
          <div className="flex gap-3 text-xs mt-2">
            <a href="/privacy-policy" className="hover:underline">Chính sách bảo mật</a>
            <span>|</span>
            <a href="/terms" className="hover:underline">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-400">&copy; {new Date().getFullYear()} Định giá bất động sản Việt Nam. Made with ❤️.</div>
    </footer>
  );
};

export default Footer; 