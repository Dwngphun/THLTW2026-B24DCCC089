export interface KhoaHoc {
  idKhoaHoc: string;
  tenKhoaHoc: string;
  giangVien: string;
  soLuongHocVien: number;
  moTa: string; 
  trangThai: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
}

export interface BoLoc {
  giangVien?: string;
  trangThai?: string;
}

export const DANH_SACH_GIANG_VIEN = [
  'Lê Bá Long',
  'Nguyễn Văn Quân',
  'Ngô Xuân Phương',
  'Phan Lý Huỳnh',
  'Nguyễn Huy Trung',
  'Đặng Anh Tuấn',
  'Nguyễn Việt Dũng',
];

export const DANH_SACH_TRANG_THAI = ['Đang mở', 'Đã kết thúc', 'Tạm dừng'];