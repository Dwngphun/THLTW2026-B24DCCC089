import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Card, Typography, Row, Col, Statistic, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DiemDen, LichTrinh } from './types';

const { Title, Text } = Typography;
const { Option } = Select;

const QuanTri: React.FC = () => {
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
  const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<LichTrinh[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [diemDangSua, setDiemDangSua] = useState<DiemDen | null>(null);
  const [formQuanTri] = Form.useForm();

  useEffect(() => {
    const dlDiemDen = localStorage.getItem('dl_diem_den');
    const dlLichTrinh = localStorage.getItem('dl_lich_trinh');
    if (dlDiemDen) setDanhSachDiemDen(JSON.parse(dlDiemDen));
    if (dlLichTrinh) setDanhSachLichTrinh(JSON.parse(dlLichTrinh));
  }, []);

  const moModal = (record?: DiemDen) => {
    if (record) {
      setDiemDangSua(record);
      formQuanTri.setFieldsValue(record);
    } else {
      setDiemDangSua(null);
      formQuanTri.resetFields();
    }
    setIsModalVisible(true);
  };

  const luuDiemDen = (values: any) => {
    let danhSachMoi;
    if (diemDangSua) {
      danhSachMoi = danhSachDiemDen.map(d => d.id === diemDangSua.id ? { ...diemDangSua, ...values } : d);
      message.success('Cập nhật thành công');
    } else {
      const diemMoi: DiemDen = { id: `DD${Date.now()}`, ...values };
      danhSachMoi = [diemMoi, ...danhSachDiemDen];
      message.success('Thêm điểm đến thành công');
    }
    setDanhSachDiemDen(danhSachMoi);
    localStorage.setItem('dl_diem_den', JSON.stringify(danhSachMoi));
    setIsModalVisible(false);
  };

  const xoaDiemDen = (id: string) => {
    const dsMoi = danhSachDiemDen.filter(d => d.id !== id);
    setDanhSachDiemDen(dsMoi);
    localStorage.setItem('dl_diem_den', JSON.stringify(dsMoi));
    message.success('Đã xóa điểm đến');
  };

  // Tính Thống kê
  let tongThuVe = 0;
  const demThang: Record<string, number> = {};
  
  danhSachLichTrinh.forEach(lt => {
    // Số lịch theo tháng
    demThang[lt.thangTao] = (demThang[lt.thangTao] || 0) + 1;
    // Tính tổng tiền dựa trên các điểm đến đã chọn trong lịch trình
    lt.chiTietNgay.forEach(ngay => {
      ngay.danhSachDiemDenId.forEach(idDiem => {
        const d = danhSachDiemDen.find(diem => diem.id === idDiem);
        if (d) tongThuVe += Number(d.chiPhiAnUong) + Number(d.chiPhiLuuTru) + Number(d.chiPhiDiChuyen);
      });
    });
  });

  return (
    <div>
      <Title level={3}>Thống kê Quản trị</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Tổng số Điểm đến" value={danhSachDiemDen.length} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Lịch trình đã tạo" value={danhSachLichTrinh.length} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Tổng doanh thu luân chuyển" value={tongThuVe} suffix="VNĐ" /></Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>Quản lý Điểm đến</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>Thêm Địa Điểm</Button>
      </div>

      <Table dataSource={danhSachDiemDen} rowKey="id" scroll={{ x: 800 }}
        columns={[
          { title: 'Tên địa điểm', dataIndex: 'tenDiemDen' },
          { title: 'Loại hình', dataIndex: 'loaiHinh', render: (l) => <Text style={{ textTransform: 'capitalize' }}>{l}</Text> },
          { title: 'Thời gian (Giờ)', dataIndex: 'thoiGianThamQuan' },
          { title: 'Đánh giá', dataIndex: 'danhGia', render: (dg) => `${dg} ⭐` },
          { title: 'Thao tác', render: (_, record) => (
            <Space>
              <Button type="text" icon={<EditOutlined />} onClick={() => moModal(record)} />
              <Popconfirm title="Xóa địa điểm này?" onConfirm={() => xoaDiemDen(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )}
        ]}
      />

      <Modal title={diemDangSua ? "Sửa Điểm Đến" : "Thêm Điểm Đến"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => formQuanTri.submit()} width={700}>
        <Form form={formQuanTri} layout="vertical" onFinish={luuDiemDen}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="tenDiemDen" label="Tên điểm đến" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="loaiHinh" label="Loại hình" rules={[{ required: true }]}>
              <Select><Option value="biển">Biển</Option><Option value="núi">Núi</Option><Option value="thành phố">Thành phố</Option></Select>
            </Form.Item></Col>
            <Col span={24}><Form.Item name="hinhAnh" label="URL Hình ảnh" rules={[{ required: true }]}><Input placeholder="Nhập Link ảnh trực tuyến" /></Form.Item></Col>
            <Col span={8}><Form.Item name="chiPhiAnUong" label="Phí Ăn uống" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="chiPhiLuuTru" label="Phí Lưu trú" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="chiPhiDiChuyen" label="Phí Di chuyển" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="thoiGianThamQuan" label="Thời gian tham quan (Giờ)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="danhGia" label="Đánh giá (1-5)" rules={[{ required: true }]}><InputNumber min={1} max={5} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={24}><Form.Item name="moTa" label="Mô tả"><Input.TextArea rows={3} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanTri;