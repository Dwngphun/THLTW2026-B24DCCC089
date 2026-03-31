import React, { useState, useEffect } from 'react';
import { 
  Card, Tabs, Table, Button, Modal, Form, Input, 
  Select, Space, Popconfirm, Typography, Row, Col, 
  message, Tag, DatePicker, Radio, Statistic, Tooltip 
} from 'antd';
import { 
  TeamOutlined, FormOutlined, SolutionOutlined, 
  BarChartOutlined, HistoryOutlined, PlusOutlined, 
  DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined, SwapOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// --- INTERFACES ---
interface CauLacBo {
  id: string; anhDaiDien: string; tenCauLacBo: string;
  ngayThanhLap: string; moTa: string; chuNhiem: string; hoatDong: boolean;
}

interface DonDangKy {
  id: string; hoTen: string; email: string; sdt: string;
  gioiTinh: string; diaChi: string; soTruong: string;
  idCauLacBo: string; lyDoDangKy: string;
  trangThai: 'Pending' | 'Approved' | 'Rejected';
  ghiChu: string; // Lý do từ chối
}

interface LichSuThaoTac {
  id: string; thoiGian: string; noiDung: string;
}

const HeThongCauLacBo: React.FC = () => {
  // --- STATES DỮ LIỆU ---
  const [danhSachCauLacBo, setDanhSachCauLacBo] = useState<CauLacBo[]>([]);
  const [danhSachDonDangKy, setDanhSachDonDangKy] = useState<DonDangKy[]>([]);
  const [lichSuThaoTac, setLichSuThaoTac] = useState<LichSuThaoTac[]>([]);

  // --- STATES UI & TÌM KIẾM ---
  const [tuKhoaClb, setTuKhoaClb] = useState('');
  const [boLocClbThanhVien, setBoLocClbThanhVien] = useState<string>('ALL');

  // --- STATES CHỌN NHIỀU (ROW SELECTION) ---
  const [donDangKyDuocChon, setDonDangKyDuocChon] = useState<React.Key[]>([]);
  const [thanhVienDuocChon, setThanhVienDuocChon] = useState<React.Key[]>([]);

  // --- STATES MODALS ---
  const [isModalClbVisible, setIsModalClbVisible] = useState(false);
  const [isModalDonVisible, setIsModalDonVisible] = useState(false);
  const [isModalTuChoiVisible, setIsModalTuChoiVisible] = useState(false);
  const [isModalChuyenClbVisible, setIsModalChuyenClbVisible] = useState(false);

  const [dangSuaClb, setDangSuaClb] = useState<CauLacBo | null>(null);
  const [dangSuaDon, setDangSuaDon] = useState<DonDangKy | null>(null);
  const [cheDoXemDon, setCheDoXemDon] = useState(false);

  const [formClb] = Form.useForm();
  const [formDon] = Form.useForm();
  const [formTuChoi] = Form.useForm();
  const [formChuyenClb] = Form.useForm();

  // --- LOCALSTORAGE LOGIC ---
  useEffect(() => {
    const dataClb = localStorage.getItem('club_clb');
    const dataDon = localStorage.getItem('club_don');
    const dataLs = localStorage.getItem('club_ls');

    if (dataClb) setDanhSachCauLacBo(JSON.parse(dataClb));
    else setDanhSachCauLacBo([
      { id: 'CLB1', anhDaiDien: '🎸', tenCauLacBo: 'CLB Âm Nhạc', ngayThanhLap: '2020-01-01', moTa: 'Nơi giao lưu âm nhạc', chuNhiem: 'Nguyễn Văn A', hoatDong: true },
      { id: 'CLB2', anhDaiDien: '💻', tenCauLacBo: 'CLB IT', ngayThanhLap: '2019-05-15', moTa: 'Code và Bug', chuNhiem: 'Trần Thị B', hoatDong: true }
    ]);

    if (dataDon) setDanhSachDonDangKy(JSON.parse(dataDon));
    if (dataLs) setLichSuThaoTac(JSON.parse(dataLs));
  }, []);

  useEffect(() => { localStorage.setItem('club_clb', JSON.stringify(danhSachCauLacBo)); }, [danhSachCauLacBo]);
  useEffect(() => { localStorage.setItem('club_don', JSON.stringify(danhSachDonDangKy)); }, [danhSachDonDangKy]);
  useEffect(() => { localStorage.setItem('club_ls', JSON.stringify(lichSuThaoTac)); }, [lichSuThaoTac]);

  // --- GHI NHẬN LỊCH SỬ ---
  const ghiLichSu = (noiDung: string) => {
    const lsMoi: LichSuThaoTac = {
      id: `LS${Date.now()}`,
      thoiGian: dayjs().format('HH:mm DD/MM/YYYY'),
      noiDung
    };
    setLichSuThaoTac(prev => [lsMoi, ...prev]);
  };

  // ==================== 1. QUẢN LÝ CÂU LẠC BỘ ====================
  const moModalClb = (record?: CauLacBo) => {
    if (record) {
      setDangSuaClb(record);
      formClb.setFieldsValue({ ...record, ngayThanhLap: dayjs(record.ngayThanhLap) });
    } else {
      setDangSuaClb(null);
      formClb.resetFields();
    }
    setIsModalClbVisible(true);
  };

  const luuCauLacBo = (values: any) => {
    const data = { ...values, ngayThanhLap: values.ngayThanhLap.format('YYYY-MM-DD') };
    if (dangSuaClb) {
      setDanhSachCauLacBo(danhSachCauLacBo.map(c => c.id === dangSuaClb.id ? { ...dangSuaClb, ...data } : c));
      message.success('Cập nhật CLB thành công');
    } else {
      setDanhSachCauLacBo([{ id: `CLB${Date.now()}`, ...data }, ...danhSachCauLacBo]);
      message.success('Thêm CLB thành công');
    }
    setIsModalClbVisible(false);
  };

  const xoaCauLacBo = (id: string) => {
    setDanhSachCauLacBo(danhSachCauLacBo.filter(c => c.id !== id));
    message.success('Đã xóa câu lạc bộ');
  };

  const dSCauLacBoLoc = danhSachCauLacBo.filter(c => c.tenCauLacBo.toLowerCase().includes(tuKhoaClb.toLowerCase()));

  // ==================== 2. QUẢN LÝ ĐƠN ĐĂNG KÝ ====================
  const moModalDon = (record?: DonDangKy, isView = false) => {
    setCheDoXemDon(isView);
    if (record) {
      setDangSuaDon(record);
      formDon.setFieldsValue(record);
    } else {
      setDangSuaDon(null);
      formDon.resetFields();
    }
    setIsModalDonVisible(true);
  };

  const luuDonDangKy = (values: any) => {
    if (dangSuaDon) {
      setDanhSachDonDangKy(danhSachDonDangKy.map(d => d.id === dangSuaDon.id ? { ...dangSuaDon, ...values } : d));
      message.success('Cập nhật đơn thành công');
    } else {
      setDanhSachDonDangKy([{ id: `DON${Date.now()}`, ...values, trangThai: 'Pending', ghiChu: '' }, ...danhSachDonDangKy]);
      message.success('Tạo đơn đăng ký thành công');
    }
    setIsModalDonVisible(false);
  };

  const xoaDonDangKy = (id: string) => {
    setDanhSachDonDangKy(danhSachDonDangKy.filter(d => d.id !== id));
    message.success('Đã xóa đơn');
  };

  // --- DUYỆT / TỪ CHỐI (HỖ TRỢ CHỌN NHIỀU) ---
  const xuLyDuyetDon = (ids: React.Key[]) => {
    setDanhSachDonDangKy(danhSachDonDangKy.map(d => ids.includes(d.id) ? { ...d, trangThai: 'Approved' } : d));
    setDonDangKyDuocChon([]);
    ghiLichSu(`Admin đã Approved ${ids.length} đơn đăng ký.`);
    message.success(`Đã duyệt ${ids.length} đơn!`);
  };

  const moModalTuChoi = () => {
    if (donDangKyDuocChon.length === 0) return message.warning('Vui lòng chọn ít nhất 1 đơn!');
    formTuChoi.resetFields();
    setIsModalTuChoiVisible(true);
  };

  const xuLyTuChoiDon = (values: any) => {
    setDanhSachDonDangKy(danhSachDonDangKy.map(d => 
      donDangKyDuocChon.includes(d.id) ? { ...d, trangThai: 'Rejected', ghiChu: values.lyDoTuChoi } : d
    ));
    ghiLichSu(`Admin đã Rejected ${donDangKyDuocChon.length} đơn với lý do: ${values.lyDoTuChoi}`);
    setIsModalTuChoiVisible(false);
    setDonDangKyDuocChon([]);
    message.success(`Đã từ chối ${donDangKyDuocChon.length} đơn!`);
  };

  // ==================== 3. QUẢN LÝ THÀNH VIÊN ====================
  const dsThanhVien = danhSachDonDangKy.filter(d => 
    d.trangThai === 'Approved' && (boLocClbThanhVien === 'ALL' || d.idCauLacBo === boLocClbThanhVien)
  );

  const xuLyChuyenClb = (values: any) => {
    const idClbMoi = values.idCauLacBoMoi;
    const tenClbMoi = danhSachCauLacBo.find(c => c.id === idClbMoi)?.tenCauLacBo;
    
    setDanhSachDonDangKy(danhSachDonDangKy.map(d => 
      thanhVienDuocChon.includes(d.id) ? { ...d, idCauLacBo: idClbMoi } : d
    ));
    
    ghiLichSu(`Chuyển ${thanhVienDuocChon.length} thành viên sang ${tenClbMoi}`);
    setIsModalChuyenClbVisible(false);
    setThanhVienDuocChon([]);
    message.success('Chuyển CLB thành công!');
  };

  // ==================== 4. THỐNG KÊ DATA ====================
  const tongPending = danhSachDonDangKy.filter(d => d.trangThai === 'Pending').length;
  const tongApproved = danhSachDonDangKy.filter(d => d.trangThai === 'Approved').length;
  const tongRejected = danhSachDonDangKy.filter(d => d.trangThai === 'Rejected').length;

  // Render Biểu đồ cột CSS Custom (An toàn, không cần thư viện ngoài)
  const renderBieuDoCot = () => {
    const maxVal = Math.max(tongPending, tongApproved, tongRejected, 1) + 2; // Tăng biên độ trục Y
    
    return (
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', height: '250px', padding: '20px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
        {danhSachCauLacBo.map(clb => {
          const p = danhSachDonDangKy.filter(d => d.idCauLacBo === clb.id && d.trangThai === 'Pending').length;
          const a = danhSachDonDangKy.filter(d => d.idCauLacBo === clb.id && d.trangThai === 'Approved').length;
          const r = danhSachDonDangKy.filter(d => d.idCauLacBo === clb.id && d.trangThai === 'Rejected').length;

          return (
            <div key={clb.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', height: '180px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                <Tooltip title={`Pending: ${p}`}><div style={{ height: `${(p/maxVal)*100}%`, width: '25px', background: '#faad14', borderRadius: '4px 4px 0 0', transition: '0.3s' }} /></Tooltip>
                <Tooltip title={`Approved: ${a}`}><div style={{ height: `${(a/maxVal)*100}%`, width: '25px', background: '#52c41a', borderRadius: '4px 4px 0 0', transition: '0.3s' }} /></Tooltip>
                <Tooltip title={`Rejected: ${r}`}><div style={{ height: `${(r/maxVal)*100}%`, width: '25px', background: '#ff4d4f', borderRadius: '4px 4px 0 0', transition: '0.3s' }} /></Tooltip>
              </div>
              <Text strong style={{ marginTop: '12px', textAlign: 'center', height: '40px', overflow: 'hidden' }}>{clb.tenCauLacBo}</Text>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title={<Title level={3} style={{ margin: 0 }}>Quản Lý Câu Lạc Bộ Sinh Viên</Title>}>
        <Tabs defaultActiveKey="1" destroyInactiveTabPane>
          
          {/* TAB 1: CÂU LẠC BỘ */}
          <TabPane tab={<span><TeamOutlined /> Câu lạc bộ</span>} key="1">
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalClb()}>Thêm CLB</Button>
              <Input.Search placeholder="Tìm tên CLB..." onChange={(e) => setTuKhoaClb(e.target.value)} style={{ width: 300 }} />
            </Row>
            <Table dataSource={dSCauLacBoLoc} rowKey="id"
              columns={[
                { title: 'Ảnh', dataIndex: 'anhDaiDien', render: (anh) => <div style={{ fontSize: 24 }}>{anh}</div> },
                { title: 'Tên CLB', dataIndex: 'tenCauLacBo', sorter: (a, b) => a.tenCauLacBo.localeCompare(b.tenCauLacBo) },
                { title: 'Ngày TL', dataIndex: 'ngayThanhLap', sorter: (a, b) => dayjs(a.ngayThanhLap).unix() - dayjs(b.ngayThanhLap).unix() },
                { title: 'Chủ nhiệm', dataIndex: 'chuNhiem' },
                { title: 'Mô tả', dataIndex: 'moTa', ellipsis: true },
                { title: 'Trạng thái', dataIndex: 'hoatDong', render: (hd) => <Tag color={hd ? 'green' : 'red'}>{hd ? 'Đang hoạt động' : 'Tạm dừng'}</Tag> },
                { title: 'Thao tác', align: 'center', render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => moModalClb(record)} />
                    <Popconfirm title="Xóa CLB?" onConfirm={() => xoaCauLacBo(record.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]}
            />
          </TabPane>

          {/* TAB 2: ĐƠN ĐĂNG KÝ */}
          <TabPane tab={<span><FormOutlined /> Đơn đăng ký</span>} key="2">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalDon()}>Thêm Đơn</Button>
              <Button type="primary" style={{ background: '#52c41a' }} icon={<CheckOutlined />} disabled={donDangKyDuocChon.length === 0} onClick={() => xuLyDuyetDon(donDangKyDuocChon)}>
                Duyệt {donDangKyDuocChon.length} đơn
              </Button>
              <Button type="primary" danger icon={<CloseOutlined />} disabled={donDangKyDuocChon.length === 0} onClick={moModalTuChoi}>
                Từ chối {donDangKyDuocChon.length} đơn
              </Button>
            </Space>
            <Table 
              dataSource={danhSachDonDangKy} 
              rowKey="id" 
              rowSelection={{ selectedRowKeys: donDangKyDuocChon, onChange: setDonDangKyDuocChon }}
              columns={[
                { title: 'Họ tên', dataIndex: 'hoTen' },
                { title: 'Email', dataIndex: 'email' },
                { title: 'SĐT', dataIndex: 'sdt' },
                { title: 'CLB Đăng ký', dataIndex: 'idCauLacBo', render: (id) => danhSachCauLacBo.find(c => c.id === id)?.tenCauLacBo },
                { title: 'Trạng thái', dataIndex: 'trangThai', render: (tt) => (
                  <Tag color={tt === 'Approved' ? 'green' : tt === 'Rejected' ? 'red' : 'orange'}>{tt}</Tag>
                )},
                { title: 'Thao tác', align: 'center', render: (_, record) => (
                  <Space>
                    <Button type="link" size="small" onClick={() => moModalDon(record, true)}>Xem</Button>
                    <Button type="text" icon={<EditOutlined />} onClick={() => moModalDon(record)} />
                    <Popconfirm title="Xóa?" onConfirm={() => xoaDonDangKy(record.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]}
            />
          </TabPane>

          {/* TAB 3: THÀNH VIÊN CLB */}
          <TabPane tab={<span><SolutionOutlined /> Thành viên CLB</span>} key="3">
            <Space style={{ marginBottom: 16 }}>
              <Select value={boLocClbThanhVien} onChange={setBoLocClbThanhVien} style={{ width: 250 }}>
                <Option value="ALL">-- Tất cả CLB --</Option>
                {danhSachCauLacBo.map(c => <Option key={c.id} value={c.id}>{c.tenCauLacBo}</Option>)}
              </Select>
              <Button type="primary" icon={<SwapOutlined />} disabled={thanhVienDuocChon.length === 0} onClick={() => setIsModalChuyenClbVisible(true)}>
                Đổi CLB cho {thanhVienDuocChon.length} thành viên
              </Button>
            </Space>
            <Table 
              dataSource={dsThanhVien} 
              rowKey="id"
              rowSelection={{ selectedRowKeys: thanhVienDuocChon, onChange: setThanhVienDuocChon }}
              columns={[
                { title: 'Họ tên', dataIndex: 'hoTen' },
                { title: 'Giới tính', dataIndex: 'gioiTinh' },
                { title: 'Sở trường', dataIndex: 'soTruong' },
                { title: 'Trực thuộc CLB', dataIndex: 'idCauLacBo', render: (id) => <Text strong style={{color:"blue"}}>{danhSachCauLacBo.find(c => c.id === id)?.tenCauLacBo}</Text> },
              ]}
            />
          </TabPane>

          {/* TAB 4: BÁO CÁO THỐNG KÊ */}
          <TabPane tab={<span><BarChartOutlined /> Báo cáo thống kê</span>} key="4">
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}><Card><Statistic title="Tổng CLB" value={danhSachCauLacBo.length} /></Card></Col>
              <Col span={6}><Card><Statistic title="Đơn Pending" value={tongPending} valueStyle={{ color: '#faad14' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="Đơn Approved" value={tongApproved} valueStyle={{ color: '#52c41a' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="Đơn Rejected" value={tongRejected} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
            </Row>
            
            <Card title="Biểu đồ số lượng đơn theo CLB (Pending / Approved / Rejected)" bordered={false}>
              {/* Box chú thích */}
              <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'center' }}>
                <Tag color="#faad14">Pending</Tag>
                <Tag color="#52c41a">Approved</Tag>
                <Tag color="#ff4d4f">Rejected</Tag>
              </Space>
              {renderBieuDoCot()}
            </Card>
          </TabPane>

          {/* TAB 5: LỊCH SỬ THAO TÁC */}
          <TabPane tab={<span><HistoryOutlined /> Lịch sử duyệt</span>} key="5">
            <Table dataSource={lichSuThaoTac} rowKey="id"
              columns={[
                { title: 'Thời gian', dataIndex: 'thoiGian', width: 200 },
                { title: 'Nội dung thao tác', dataIndex: 'noiDung' }
              ]}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* ==================== MODALS ==================== */}
      
      {/* Modal CLB */}
      <Modal title={dangSuaClb ? "Sửa CLB" : "Thêm CLB"} visible={isModalClbVisible} onCancel={() => setIsModalClbVisible(false)} onOk={() => formClb.submit()}>
        <Form form={formClb} onFinish={luuCauLacBo} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="tenCauLacBo" label="Tên CLB" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="chuNhiem" label="Chủ nhiệm" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="ngayThanhLap" label="Ngày TL" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="anhDaiDien" label="Icon/Ảnh"><Input placeholder="Nhập Emoji hoặc Link ảnh" /></Form.Item></Col>
          </Row>
          <Form.Item name="moTa" label="Mô tả (HTML)"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="hoatDong" label="Trạng thái" initialValue={true}>
            <Radio.Group><Radio value={true}>Đang hoạt động</Radio><Radio value={false}>Tạm dừng</Radio></Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Đơn Đăng Ký */}
      <Modal title={cheDoXemDon ? "Chi Tiết Đơn" : dangSuaDon ? "Sửa Đơn" : "Tạo Đơn"} visible={isModalDonVisible} onCancel={() => setIsModalDonVisible(false)} onOk={() => formDon.submit()} footer={cheDoXemDon ? null : undefined} width={700}>
        <Form form={formDon} onFinish={luuDonDangKy} layout="vertical" disabled={cheDoXemDon}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="idCauLacBo" label="Đăng ký vào CLB" rules={[{ required: true }]}>
              <Select>{danhSachCauLacBo.map(c => <Option key={c.id} value={c.id}>{c.tenCauLacBo}</Option>)}</Select>
            </Form.Item></Col>
            <Col span={8}><Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="sdt" label="SĐT" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true }]}>
              <Select><Option value="Nam">Nam</Option><Option value="Nữ">Nữ</Option></Select>
            </Form.Item></Col>
            <Col span={24}><Form.Item name="diaChi" label="Địa chỉ"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="soTruong" label="Sở trường"><Input.TextArea rows={2} /></Form.Item></Col>
            <Col span={12}><Form.Item name="lyDoDangKy" label="Lý do đăng ký"><Input.TextArea rows={2} /></Form.Item></Col>
            
            {/* Nếu bị từ chối thì hiện thêm box ghi chú */}
            {dangSuaDon?.trangThai === 'Rejected' && (
              <Col span={24}>
                <div style={{ padding: 10, background: '#fff1f0', border: '1px solid #ffa39e', color: '#cf1322' }}>
                  <Text strong type="danger">Lý do từ chối: </Text> {dangSuaDon.ghiChu}
                </div>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>

      {/* Modal Nhập lý do từ chối (Duyệt hàng loạt) */}
      <Modal title="Xác nhận Từ chối Đơn" visible={isModalTuChoiVisible} onCancel={() => setIsModalTuChoiVisible(false)} onOk={() => formTuChoi.submit()} okText="Xác nhận Từ chối" okButtonProps={{ danger: true }}>
        <Form form={formTuChoi} onFinish={xuLyTuChoiDon} layout="vertical">
          <Text type="secondary">Bạn đang từ chối {donDangKyDuocChon.length} đơn đăng ký.</Text>
          <Form.Item name="lyDoTuChoi" label="Lý do từ chối (Bắt buộc)" rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]} style={{ marginTop: 16 }}>
            <Input.TextArea rows={4} placeholder="VD: Không phù hợp với định hướng CLB..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chuyển CLB cho Thành viên */}
      <Modal title="Thay đổi Câu lạc bộ" visible={isModalChuyenClbVisible} onCancel={() => setIsModalChuyenClbVisible(false)} onOk={() => formChuyenClb.submit()}>
        <Form form={formChuyenClb} onFinish={xuLyChuyenClb} layout="vertical">
          <Text>Hệ thống sẽ chuyển <Text strong style={{color:"blue"}}>{thanhVienDuocChon.length}</Text> thành viên đã chọn sang CLB mới.</Text>
          <Form.Item name="idCauLacBoMoi" label="Chọn CLB chuyển đến" rules={[{ required: true }]} style={{ marginTop: 16 }}>
            <Select>{danhSachCauLacBo.map(c => <Option key={c.id} value={c.id}>{c.tenCauLacBo}</Option>)}</Select>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default HeThongCauLacBo;