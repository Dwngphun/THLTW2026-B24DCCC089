import React, { useState, useEffect } from 'react';
import { Select, Card, Typography, Alert, Statistic, Row, Col, Space,Tooltip } from 'antd';
import { DiemDen, LichTrinh } from './types';

const { Title, Text } = Typography;
const { Option } = Select;

const NganSach: React.FC = () => {
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
  const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<LichTrinh[]>([]);
  const [lichTrinhDangChonId, setLichTrinhDangChonId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const dlDiemDen = localStorage.getItem('dl_diem_den');
    const dlLichTrinh = localStorage.getItem('dl_lich_trinh');
    if (dlDiemDen) setDanhSachDiemDen(JSON.parse(dlDiemDen));
    if (dlLichTrinh) setDanhSachLichTrinh(JSON.parse(dlLichTrinh));
  }, []);

  const lichChon = danhSachLichTrinh.find(l => l.id === lichTrinhDangChonId);

  // Tính toán
  let tongAnUong = 0, tongLuuTru = 0, tongDiChuyen = 0;
  
  if (lichChon) {
    lichChon.chiTietNgay.forEach(ngay => {
      ngay.danhSachDiemDenId.forEach(idDiem => {
        const diem = danhSachDiemDen.find(d => d.id === idDiem);
        if (diem) {
          tongAnUong += Number(diem.chiPhiAnUong);
          tongLuuTru += Number(diem.chiPhiLuuTru);
          tongDiChuyen += Number(diem.chiPhiDiChuyen);
        }
      });
    });
  }

  const tongChiPhi = tongAnUong + tongLuuTru + tongDiChuyen;
  const nganSach = lichChon ? Number(lichChon.nganSachDuKien) : 0;
  const vuotNganSach = tongChiPhi > nganSach;

  return (
    <div>
      <Title level={3}>Quản lý Ngân sách</Title>
      <Card style={{ marginBottom: 24 }}>
        <Text strong>Chọn lịch trình: </Text>
        <Select style={{ width: 300 }} placeholder="Chọn lịch trình để xem" onChange={setLichTrinhDangChonId}>
          {danhSachLichTrinh.map(l => <Option key={l.id} value={l.id}>{l.tenLichTrinh}</Option>)}
        </Select>
      </Card>

      {lichChon && (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Tổng quan chi phí">
              {vuotNganSach ? (
                <Alert message="Cảnh báo!" description={`Bạn đã vượt ngân sách ${(tongChiPhi - nganSach).toLocaleString()} đ`} type="error" showIcon style={{ marginBottom: 16 }}/>
              ) : (
                <Alert message="Tuyệt vời!" description="Lịch trình của bạn đang nằm trong giới hạn ngân sách an toàn." type="success" showIcon style={{ marginBottom: 16 }}/>
              )}
              <Space size="large">
                <Statistic title="Ngân sách dự kiến" value={nganSach} suffix="VNĐ" />
                <Statistic title="Tổng chi phí thực tế" value={tongChiPhi} suffix="VNĐ" valueStyle={{ color: vuotNganSach ? 'red' : 'green' }} />
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Phân bổ ngân sách">
              <div style={{ display: 'flex', height: 30, borderRadius: 15, overflow: 'hidden', marginBottom: 16 }}>
                <Tooltip title={`Ăn uống: ${tongAnUong.toLocaleString()}`}><div style={{ width: `${(tongAnUong/tongChiPhi)*100 || 0}%`, background: '#ff4d4f' }} /></Tooltip>
                <Tooltip title={`Lưu trú: ${tongLuuTru.toLocaleString()}`}><div style={{ width: `${(tongLuuTru/tongChiPhi)*100 || 0}%`, background: '#1890ff' }} /></Tooltip>
                <Tooltip title={`Di chuyển: ${tongDiChuyen.toLocaleString()}`}><div style={{ width: `${(tongDiChuyen/tongChiPhi)*100 || 0}%`, background: '#faad14' }} /></Tooltip>
              </div>
              <Row>
                <Col span={8}><span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>● Ăn uống</span></Col>
                <Col span={8}><span style={{ color: '#1890ff', fontWeight: 'bold' }}>● Lưu trú</span></Col>
                <Col span={8}><span style={{ color: '#faad14', fontWeight: 'bold' }}>● Di chuyển</span></Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};
// Chú ý: Cần thêm import { Tooltip } từ 'antd' nếu lỗi ở trên
export default NganSach;