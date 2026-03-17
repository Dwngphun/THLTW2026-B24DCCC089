import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Tag, Typography, Row, Col, message, Divider, DatePicker, TimePicker, Rate, Statistic } from 'antd';
import { UserOutlined, ScissorOutlined, CalendarOutlined, BarChartOutlined, StarOutlined, CheckCircleOutlined ,ControlOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Interfaces
interface DichVu { id: string; tenDichVu: string; giaTien: number; thoiGian: number; }
interface NhanVien { id: string; tenNhanVien: string; caLamViec: string; }
interface DanhGia { diem: number; nhanXet: string; phanHoiNhanVien?: string; }
interface LichHen {
  id: string; tenKhachHang: string; sdt: string;
  idDichVu: string; idNhanVien: string;
  ngayHen: string; gioHen: string;
  trangThai: 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
  danhGia?: DanhGia;
}

const QuanLySpa: React.FC = () => {
  const [danhSachDichVu, setDanhSachDichVu] = useState<DichVu[]>([]);
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
  const [isModalDatLichVisible, setIsModalDatLichVisible] = useState(false);
  const [isModalNhanVienVisible, setIsModalNhanVienVisible] = useState(false);
  const [isModalDanhGiaVisible, setIsModalDanhGiaVisible] = useState(false);
  const [isModalPhanHoiVisible, setIsModalPhanHoiVisible] = useState(false);
  const [lichHenDangChon, setLichHenDangChon] = useState<LichHen | null>(null);
  const [formDatLich] = Form.useForm();
  const [formNhanVien] = Form.useForm();
  const [formDanhGia] = Form.useForm();
  const [formPhanHoi] = Form.useForm();

  // Lưu localStorage
  useEffect(() => {
    const dataDichVu = localStorage.getItem('spa_dich_vu');
    const dataNhanVien = localStorage.getItem('spa_nhan_vien');
    const dataLichHen = localStorage.getItem('spa_lich_hen');

    if (dataDichVu) setDanhSachDichVu(JSON.parse(dataDichVu));
    else setDanhSachDichVu([
      { id: 'DV1', tenDichVu: 'Cắt tóc nam', giaTien: 50000, thoiGian: 20 },
      { id: 'DV2', tenDichVu: 'Cắt tóc nữ', giaTien: 80000, thoiGian: 30 },
      { id: 'DV3', tenDichVu: 'Chăm sóc da mặt', giaTien: 150000, thoiGian: 60 },
      { id: 'DV4', tenDichVu: 'Gội đầu', giaTien: 20000, thoiGian: 10 },
      { id: 'DV5', tenDichVu: 'Chăm sóc da body', giaTien: 120000, thoiGian: 60 },
    ]);

    if (dataNhanVien) setDanhSachNhanVien(JSON.parse(dataNhanVien));
    else setDanhSachNhanVien([{ id: 'NV1', tenNhanVien: 'Nguyễn Văn A', caLamViec: '09:00 - 17:00' }]);

    if (dataLichHen) setDanhSachLichHen(JSON.parse(dataLichHen));
  }, []);

  useEffect(() => { localStorage.setItem('spa_dich_vu', JSON.stringify(danhSachDichVu)); }, [danhSachDichVu]);
  useEffect(() => { localStorage.setItem('spa_nhan_vien', JSON.stringify(danhSachNhanVien)); }, [danhSachNhanVien]);
  useEffect(() => { localStorage.setItem('spa_lich_hen', JSON.stringify(danhSachLichHen)); }, [danhSachLichHen]);

  // Khách hàng đặt lịch
  const xuLyDatLich = (values: any) => {
    const ngayChon = values.ngayHen.format('YYYY-MM-DD');
    const gioChon = values.gioHen.format('HH:mm');
    const nvId = values.idNhanVien;
    const soKhachTrongNgay = danhSachLichHen.filter(l => l.idNhanVien === nvId && l.ngayHen === ngayChon && l.trangThai !== 'Hủy').length;
    if (soKhachTrongNgay >= 8) {
      return message.error('Nhân viên này đã kín lịch (8 khách) trong ngày hôm nay!');
    }
    const biTrungLich = danhSachLichHen.some(l => l.idNhanVien === nvId && l.ngayHen === ngayChon && l.gioHen === gioChon && l.trangThai !== 'Hủy');
    if (biTrungLich) {
      return message.error('Nhân viên đã có lịch bận vào khung giờ này!');
    }

    const lichMoi: LichHen = {
      id: `LH${Date.now()}`,
      tenKhachHang: values.tenKhachHang,
      sdt: values.sdt,
      idDichVu: values.idDichVu,
      idNhanVien: nvId,
      ngayHen: ngayChon,
      gioHen: gioChon,
      trangThai: 'Chờ duyệt',
    };

    setDanhSachLichHen([lichMoi, ...danhSachLichHen]);
    setIsModalDatLichVisible(false);
    formDatLich.resetFields();
    message.success('Đặt lịch thành công, vui lòng chờ xác nhận!');
  };

  const xuLyDanhGia = (values: any) => {
    if (!lichHenDangChon) return;
    const lichCapNhat = danhSachLichHen.map(l => 
      l.id === lichHenDangChon.id ? { ...l, danhGia: { diem: values.diem, nhanXet: values.nhanXet } } : l
    );
    setDanhSachLichHen(lichCapNhat);
    setIsModalDanhGiaVisible(false);
    message.success('Cảm ơn bạn đã đánh giá dịch vụ!');
  };

  const luuNhanVien = (values: any) => {
    let maMoi = 'NV1';
    if (danhSachNhanVien.length > 0) {
      const danhSachSo = danhSachNhanVien.map(nv => {
        const soTrichXuat = nv.id.replace('NV', ''); 
        return parseInt(soTrichXuat, 10);
      });
      const soLonNhat = Math.max(...danhSachSo);
      maMoi = `NV${soLonNhat + 1}`;
    }
    const nvMoi: NhanVien = { id: maMoi, ...values };
    setDanhSachNhanVien([...danhSachNhanVien, nvMoi]);
    setIsModalNhanVienVisible(false);
    formNhanVien.resetFields();
    message.success(`Thêm nhân viên ${maMoi} thành công!`);
  };

  const capNhatTrangThaiLich = (id: string, trangThaiMoi: LichHen['trangThai']) => {
    setDanhSachLichHen(danhSachLichHen.map(l => l.id === id ? { ...l, trangThai: trangThaiMoi } : l));
    message.success(`Đã chuyển lịch sang: ${trangThaiMoi}`);
  };

  const xuLyPhanHoi = (values: any) => {
    if (!lichHenDangChon || !lichHenDangChon.danhGia) return;
    const lichCapNhat = danhSachLichHen.map(l => 
      l.id === lichHenDangChon.id ? { ...l, danhGia: { ...l.danhGia!, phanHoiNhanVien: values.phanHoiNhanVien } } : l
    );
    setDanhSachLichHen(lichCapNhat);
    setIsModalPhanHoiVisible(false);
    message.success('Đã gửi phản hồi cho khách hàng!');
  };

  const tongDoanhThu = danhSachLichHen
    .filter(l => l.trangThai === 'Hoàn thành')
    .reduce((tong, lich) => {
      const dv = danhSachDichVu.find(d => d.id === lich.idDichVu);
      return tong + (dv?.giaTien || 0);
    }, 0);

  const tinhSaoTrungBinh = (idNv: string) => {
    const cacDanhGia = danhSachLichHen.filter(l => l.idNhanVien === idNv && l.danhGia).map(l => l.danhGia!.diem);
    if (cacDanhGia.length === 0) return 0;
    return (cacDanhGia.reduce((a, b) => a + b, 0) / cacDanhGia.length).toFixed(1);
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title={<Title level={2} style={{ textAlign: 'center', margin: 0 }}> Hệ Thống Quản Lý Spa & Salon</Title>} bodyStyle={{ padding: 0 }}>
        <Tabs defaultActiveKey="khach-hang" centered size="large" type="card">
          {/* Giao diện khách hàng*/}
          <TabPane tab={<span><UserOutlined /> Giao diện Khách hàng</span>} key="khach-hang">
            <div style={{ padding: '24px' }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Card title="Đặt lịch ngay" bordered={false} style={{ background: '#e6f7ff' }}>
                    <Form form={formDatLich} onFinish={xuLyDatLich} layout="vertical">
                      <Form.Item name="tenKhachHang" label="Tên của bạn" rules={[{ required: true }]}><Input /></Form.Item>
                      <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
                      <Form.Item name="idDichVu" label="Chọn dịch vụ" rules={[{ required: true }]}>
                        <Select>
                          {danhSachDichVu.map(dv => <Option key={dv.id} value={dv.id}>{dv.tenDichVu} - {dv.giaTien.toLocaleString()}đ ({dv.thoiGian}p)</Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item name="idNhanVien" label="Nhân viên phục vụ" rules={[{ required: true }]}>
                        <Select>
                          {danhSachNhanVien.map(nv => <Option key={nv.id} value={nv.id}>{nv.tenNhanVien} (Ca: {nv.caLamViec}) - ⭐ {tinhSaoTrungBinh(nv.id)}</Option>)}
                        </Select>
                      </Form.Item>
                      <Row gutter={16}>
                        <Col span={12}><Form.Item name="ngayHen" label="Ngày hẹn" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                        <Col span={12}><Form.Item name="gioHen" label="Giờ hẹn" rules={[{ required: true }]}><TimePicker format="HH:mm" style={{ width: '100%' }} /></Form.Item></Col>
                      </Row>
                      <Button type="primary" htmlType="submit" block size="large">Xác nhận đặt lịch</Button>
                    </Form>
                  </Card>
                </Col>

                <Col span={16}>
                  <Card title="Danh sách lịch hẹn của bạn" bordered={false}>
                    <Table 
                      dataSource={danhSachLichHen} 
                      rowKey="id" 
                      pagination={{ pageSize: 5 }}
                      columns={[
                        { title: 'Ngày giờ', render: (_, r) => <Text strong>{r.ngayHen} {r.gioHen}</Text> },
                        { title: 'Dịch vụ', dataIndex: 'idDichVu', render: (id) => danhSachDichVu.find(d => d.id === id)?.tenDichVu },
                        { title: 'Nhân viên', dataIndex: 'idNhanVien', render: (id) => danhSachNhanVien.find(n => n.id === id)?.tenNhanVien },
                        { title: 'Trạng thái', dataIndex: 'trangThai', render: (tt) => (
                          <Tag color={tt === 'Hoàn thành' ? 'green' : tt === 'Hủy' ? 'red' : tt === 'Xác nhận' ? 'blue' : 'orange'}>{tt}</Tag>
                        )},
                        { title: 'Thao tác', align: 'center', render: (_, record) => (
                          <Space>
                            {record.trangThai === 'Chờ duyệt' && (
                              <Popconfirm title="Hủy lịch này?" onConfirm={() => capNhatTrangThaiLich(record.id, 'Hủy')}>
                                <Button type="text" danger>Hủy</Button>
                              </Popconfirm>
                            )}
                            {record.trangThai === 'Hoàn thành' && !record.danhGia && (
                              <Button type="link" onClick={() => { setLichHenDangChon(record); setIsModalDanhGiaVisible(true); }}>Đánh giá</Button>
                            )}
                            {record.danhGia && <Text type="success"><StarOutlined /> Đã đánh giá</Text>}
                          </Space>
                        )}
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          {/* Giao diện quản lý*/}
          <TabPane tab={<span><ControlOutlined /> Giao diện Quản lý</span>} key="quan-ly">
            <div style={{ padding: '24px' }}>
              <Tabs tabPosition="left">
                <TabPane tab={<span><CalendarOutlined /> Quản lý Lịch hẹn</span>} key="m-lich">
                  <Title level={4}>Danh sách đặt lịch từ khách hàng</Title>
                  <Table dataSource={danhSachLichHen} rowKey="id" 
                    columns={[
                      { title: 'Khách hàng', dataIndex: 'tenKhachHang' },
                      { title: 'SĐT', dataIndex: 'sdt' },
                      { title: 'Thời gian', render: (_, r) => `${r.ngayHen} lúc ${r.gioHen}` },
                      { title: 'Dịch vụ', dataIndex: 'idDichVu', render: (id) => danhSachDichVu.find(d => d.id === id)?.tenDichVu },
                      { title: 'Nhân viên', dataIndex: 'idNhanVien', render: (id) => danhSachNhanVien.find(n => n.id === id)?.tenNhanVien },
                      { title: 'Trạng thái', dataIndex: 'trangThai', render: (tt) => <Tag color={tt === 'Hoàn thành' ? 'green' : tt === 'Hủy' ? 'red' : 'blue'}>{tt}</Tag> },
                      { title: 'Đánh giá', render: (_, r) => r.danhGia ? (
                        <Space direction="vertical" size={0}>
                          <Rate disabled defaultValue={r.danhGia.diem} style={{ fontSize: 12 }} />
                          {r.danhGia.nhanXet && <Text type="secondary" style={{ fontSize: 12 }}>"{r.danhGia.nhanXet}"</Text>}
                          {!r.danhGia.phanHoiNhanVien ? (
                            <Button type="link" size="small" onClick={() => { setLichHenDangChon(r); setIsModalPhanHoiVisible(true); }}>Phản hồi</Button>
                          ) : <Text type="success" style={{ fontSize: 12 }}>Đã phản hồi</Text>}
                        </Space>
                      ) : <Text type="secondary">Chưa có</Text>},
                      { title: 'Duyệt / Cập nhật', align: 'center', render: (_, record) => (
                        <Select 
                          value={record.trangThai} 
                          style={{ width: 120 }} 
                          onChange={(val) => capNhatTrangThaiLich(record.id, val)}
                        >
                          <Option value="Chờ duyệt">Chờ duyệt</Option>
                          <Option value="Xác nhận">Xác nhận</Option>
                          <Option value="Hoàn thành">Hoàn thành</Option>
                          <Option value="Hủy">Hủy</Option>
                        </Select>
                      )}
                    ]}
                  />
                </TabPane>
                <TabPane tab={<span><UserOutlined /> Quản lý Nhân viên</span>} key="m-nv">
                  <Button type="primary" onClick={() => setIsModalNhanVienVisible(true)} style={{ marginBottom: 16 }}>Thêm nhân viên</Button>
                  <Table dataSource={danhSachNhanVien} rowKey="id" 
                    columns={[
                      { title: 'Mã NV', dataIndex: 'id' },
                      { title: 'Tên nhân viên', dataIndex: 'tenNhanVien' },
                      { title: 'Ca làm việc', dataIndex: 'caLamViec' },
                      { title: 'Sao trung bình', align: 'center', render: (_, r) => <Text strong><StarOutlined style={{color: '#faad14'}}/> {tinhSaoTrungBinh(r.id)}</Text> },
                      { title: 'Thao tác', render: (_, r) => (
                        <Popconfirm title="Xóa?" onConfirm={() => setDanhSachNhanVien(danhSachNhanVien.filter(n => n.id !== r.id))}>
                          <Button type="text" danger>Xóa</Button>
                        </Popconfirm>
                      )}
                    ]}
                  />
                </TabPane>
                <TabPane tab={<span><ScissorOutlined /> Quản lý Dịch vụ</span>} key="m-dv">
                  <Table dataSource={danhSachDichVu} rowKey="id" 
                    columns={[
                      { title: 'Tên dịch vụ', dataIndex: 'tenDichVu' },
                      { title: 'Giá tiền', dataIndex: 'giaTien', render: (gia) => `${gia.toLocaleString()} VNĐ` },
                      { title: 'Thời gian thực hiện', dataIndex: 'thoiGian', render: (tg) => `${tg} phút` },
                    ]}
                  />
                </TabPane>
                <TabPane tab={<span><BarChartOutlined /> Thống kê & Báo cáo</span>} key="m-tk">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card><Statistic title="Tổng doanh thu" value={tongDoanhThu} suffix="VNĐ" valueStyle={{ color: '#3f8600' }} /></Card>
                    </Col>
                    <Col span={8}>
                      <Card><Statistic title="Lịch đã hoàn thành" value={danhSachLichHen.filter(l => l.trangThai === 'Hoàn thành').length} prefix={<CheckCircleOutlined />} /></Card>
                    </Col>
                    <Col span={8}>
                      <Card><Statistic title="Lịch bị hủy" value={danhSachLichHen.filter(l => l.trangThai === 'Hủy').length} valueStyle={{ color: '#cf1322' }} /></Card>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal title="Thêm Nhân viên" visible={isModalNhanVienVisible} onCancel={() => setIsModalNhanVienVisible(false)} onOk={() => formNhanVien.submit()}>
        <Form form={formNhanVien} onFinish={luuNhanVien} layout="vertical">
          <Form.Item name="tenNhanVien" label="Tên nhân viên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="caLamViec" label="Ca làm việc (VD: 09:00 - 17:00 Thứ 2-6)" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Đánh giá Dịch vụ" visible={isModalDanhGiaVisible} onCancel={() => setIsModalDanhGiaVisible(false)} onOk={() => formDanhGia.submit()}>
        <Form form={formDanhGia} onFinish={xuLyDanhGia} layout="vertical">
          <Form.Item name="diem" label="Chất lượng phục vụ" rules={[{ required: true }]}><Rate /></Form.Item>
          <Form.Item name="nhanXet" label="Nhận xét của bạn" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Phản hồi đánh giá khách hàng" visible={isModalPhanHoiVisible} onCancel={() => setIsModalPhanHoiVisible(false)} onOk={() => formPhanHoi.submit()}>
        <div style={{ marginBottom: 16, padding: 10, background: '#f5f5f5' }}>
          <Text strong>Khách hàng nhận xét:</Text> <br/> <Text italic>"{lichHenDangChon?.danhGia?.nhanXet}"</Text>
        </div>
        <Form form={formPhanHoi} onFinish={xuLyPhanHoi} layout="vertical">
          <Form.Item name="phanHoiNhanVien" label="Nội dung phản hồi" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLySpa;