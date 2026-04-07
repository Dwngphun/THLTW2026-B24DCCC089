export interface DiemDen {
  id: string;
  tenDiemDen: string;
  hinhAnh: string;
  loaiHinh: 'biển' | 'núi' | 'thành phố';
  moTa: string;
  thoiGianThamQuan: number; // Giờ
  chiPhiAnUong: number;
  chiPhiLuuTru: number;
  chiPhiDiChuyen: number;
  danhGia: number;
}

export interface NgayLichTrinh {
  ngayThu: number;
  danhSachDiemDenId: string[];
}

export interface LichTrinh {
  id: string;
  tenLichTrinh: string;
  nganSachDuKien: number;
  thangTao: string; // YYYY-MM
  chiTietNgay: NgayLichTrinh[];
}