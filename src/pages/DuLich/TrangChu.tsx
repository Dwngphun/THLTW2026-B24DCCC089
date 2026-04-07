import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Rate, Typography, Space, Empty, Tag } from 'antd';
import { DiemDen } from './types';

const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;

const TrangChu: React.FC = () => {
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
  const [locLoaiHinh, setLocLoaiHinh] = useState<string>('tất cả');
  const [locDanhGia, setLocDanhGia] = useState<number>(0);

  useEffect(() => {
    const data = localStorage.getItem('dl_diem_den');
    if (data) setDanhSachDiemDen(JSON.parse(data));
  }, []);

  const tinhTongChiPhi = (diem: DiemDen) => diem.chiPhiAnUong + diem.chiPhiDiChuyen + diem.chiPhiLuuTru;

  const danhSachDaLoc = danhSachDiemDen.filter(diem => {
    const dungLoaiHinh = locLoaiHinh === 'tất cả' || diem.loaiHinh === locLoaiHinh;
    const dungDanhGia = diem.danhGia >= locDanhGia;
    return dungLoaiHinh && dungDanhGia;
  });

  return (
    <div>
      <Title level={3}>Khám phá Điểm đến</Title>
      <Card style={{ marginBottom: 24, background: '#fafafa' }}>
        <Space wrap>
          <Text strong>Loại hình:</Text>
          <Select value={locLoaiHinh} onChange={setLocLoaiHinh} style={{ width: 150 }}>
            <Option value="tất cả">Tất cả</Option>
            <Option value="biển">Biển</Option>
            <Option value="núi">Núi</Option>
            <Option value="thành phố">Thành phố</Option>
          </Select>
          <Text strong style={{ marginLeft: 16 }}>Đánh giá từ:</Text>
          <Rate value={locDanhGia} onChange={setLocDanhGia} />
        </Space>
      </Card>

      {danhSachDaLoc.length === 0 ? (
        <Empty description="Chưa có điểm đến nào. Vui lòng qua trang Quản trị để thêm dữ liệu!" />
      ) : (
        <Row gutter={[16, 16]}>
          {danhSachDaLoc.map(diem => (
            <Col xs={24} sm={12} md={8} lg={6} key={diem.id}>
              <Card
                hoverable
                cover={<img alt={diem.tenDiemDen} src={diem.hinhAnh} style={{ height: 180, objectFit: 'cover' }} />}
              >
                <Meta 
                  title={diem.tenDiemDen} 
                  description={<Tag color="blue">{diem.loaiHinh.toUpperCase()}</Tag>} 
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary" ellipsis>{diem.moTa}</Text><br/>
                  <Text strong>Chi phí: {tinhTongChiPhi(diem).toLocaleString()}đ</Text><br/>
                  <Rate disabled defaultValue={diem.danhGia} style={{ fontSize: 14 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TrangChu;