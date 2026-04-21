export const KHOA_BAI_VIET = 'danhSachBaiViet';
export const KHOA_THE_TAG = 'danhSachTheTag';

// --- DỮ LIỆU MẪU BAN ĐẦU ---
const dataTheBanDau = [
  { id: 'tag1', tenThe: 'Công Nghệ' },
  { id: 'tag2', tenThe: 'Du Lịch' },
  { id: 'tag3', tenThe: 'Ẩm Thực' },
  { id: 'tag4', tenThe: 'Học Tập' },
  { id: 'tag5', tenThe: 'Lập Trình' },
];

const dataBaiVietBanDau = [
  {
    id: 'bv1',
    tieuDe: 'Khám phá thế giới AI năm 2026',
    slug: 'kham-pha-the-gioi-ai',
    anhDaiDien: 'https://picsum.photos/id/0/300/150',
    danhSachThe: ['Công Nghệ', 'Lập Trình'],
    trangThai: 'daDang',
    noiDung: 'Trí tuệ nhân tạo đang thay đổi cách chúng ta viết code và làm việc mỗi ngày...',
    tomTat: 'Trí tuệ nhân tạo đang thay đổi cách chúng ta viết code và làm việc mỗi ngày...',
    tacGia: 'Admin',
    ngayTao: '21/04/2026',
    luotXem: 1540
  },
  {
    id: 'bv2',
    tieuDe: 'Kinh nghiệm du lịch Đà Lạt tự túc 3 ngày 2 đêm',
    slug: 'kinh-nghiem-du-lich-da-lat',
    anhDaiDien: 'https://picsum.photos/id/10/300/150',
    danhSachThe: ['Du Lịch', 'Ẩm Thực'],
    trangThai: 'daDang',
    noiDung: 'Đà Lạt tháng 4 mang một vẻ đẹp rất riêng. Dưới đây là lịch trình chi tiết...',
    tomTat: 'Đà Lạt tháng 4 mang một vẻ đẹp rất riêng. Dưới đây là lịch trình chi tiết...',
    tacGia: 'Admin',
    ngayTao: '20/04/2026',
    luotXem: 890
  },
  {
    id: 'bv3',
    tieuDe: 'Cách nấu Phở Bò ngon chuẩn vị Bắc',
    slug: 'cach-nau-pho-bo',
    anhDaiDien: 'https://picsum.photos/id/42/300/150',
    danhSachThe: ['Ẩm Thực'],
    trangThai: 'daDang',
    noiDung: 'Bí quyết để có một nồi nước dùng phở ngọt thanh, trong vắt nằm ở khâu hầm xương...',
    tomTat: 'Bí quyết để có một nồi nước dùng phở ngọt thanh, trong vắt nằm ở khâu hầm xương...',
    tacGia: 'Admin',
    ngayTao: '18/04/2026',
    luotXem: 2100
  },
  {
    id: 'bv4',
    tieuDe: 'Phương pháp học Pomodoro giúp tăng sự tập trung',
    slug: 'phuong-phap-hoc-pomodoro',
    anhDaiDien: 'https://picsum.photos/id/60/300/150',
    danhSachThe: ['Học Tập'],
    trangThai: 'daDang',
    noiDung: 'Chia nhỏ thời gian làm việc thành các phiên 25 phút sẽ giúp não bộ không bị quá tải...',
    tomTat: 'Chia nhỏ thời gian làm việc thành các phiên 25 phút sẽ giúp não bộ không bị quá tải...',
    tacGia: 'Admin',
    ngayTao: '15/04/2026',
    luotXem: 450
  },
  {
    id: 'bv5',
    tieuDe: 'Lộ trình trở thành Frontend Developer cho người mới',
    slug: 'lo-trinh-frontend-developer',
    anhDaiDien: 'https://picsum.photos/id/48/300/150',
    danhSachThe: ['Lập Trình', 'Học Tập'],
    trangThai: 'daDang',
    noiDung: 'Bắt đầu từ HTML, CSS đến JavaScript cơ bản, sau đó chọn một framework như ReactJS...',
    tomTat: 'Bắt đầu từ HTML, CSS đến JavaScript cơ bản, sau đó chọn một framework như ReactJS...',
    tacGia: 'Admin',
    ngayTao: '10/04/2026',
    luotXem: 3200
  }
];
// ----------------------------

export const layDuLieu = <T>(khoa: string): T[] => {
  const duLieu = localStorage.getItem(khoa);
  
  if (duLieu) {
    return JSON.parse(duLieu);
  }

  // Nếu localStorage trống, tự động nạp dữ liệu mẫu
  if (khoa === KHOA_THE_TAG) {
    luuDuLieu(KHOA_THE_TAG, dataTheBanDau);
    return dataTheBanDau as unknown as T[];
  }
  
  if (khoa === KHOA_BAI_VIET) {
    luuDuLieu(KHOA_BAI_VIET, dataBaiVietBanDau);
    return dataBaiVietBanDau as unknown as T[];
  }

  return [];
};

export const luuDuLieu = <T>(khoa: string, duLieu: T[]): void => {
  localStorage.setItem(khoa, JSON.stringify(duLieu));
};