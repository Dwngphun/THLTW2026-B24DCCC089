import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import { 
  Card, Col, Row, Statistic, Timeline, Table, Button, Space, Input, DatePicker, 
  Select, Modal, Form, InputNumber, Popconfirm, Tag, Drawer, Progress, Segmented, message 
} from 'antd';
import { 
  FireOutlined, CalendarOutlined, TrophyOutlined, LineChartOutlined, 
  PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const duLieuTapLuyenGoc = [
  { id: '1', ngayTap: '2023-10-01', loaiBaiTap: 'Cardio', thoiLuong: 45, caloDot: 400, ghiChu: 'Chạy bộ công viên', trangThai: 'Hoàn thành' },
  { id: '2', ngayTap: '2023-10-03', loaiBaiTap: 'Strength', thoiLuong: 60, caloDot: 500, ghiChu: 'Đẩy ngực, kéo xô', trangThai: 'Hoàn thành' },
  { id: '3', ngayTap: '2023-10-05', loaiBaiTap: 'Yoga', thoiLuong: 30, caloDot: 150, ghiChu: 'Giãn cơ', trangThai: 'Bỏ lỡ' },
];

const duLieuChiSoGoc = [
  { id: '1', ngay: '2023-10-01', canNang: 70, chieuCao: 175, nhipTim: 72, gioNgu: 8 },
  { id: '2', ngay: '2023-10-07', canNang: 69.5, chieuCao: 175, nhipTim: 70, gioNgu: 7 },
];

const duLieuMucTieuGoc = [
  { id: '1', tenMucTieu: 'Giảm mỡ bụng', loai: 'Giảm cân', giaTriMucTieu: 65, giaTriHienTai: 69.5, deadline: '2023-12-31', trangThai: 'Đang thực hiện' },
  { id: '2', tenMucTieu: 'Chạy 10km', loai: 'Cải thiện sức bền', giaTriMucTieu: 10, giaTriHienTai: 5, deadline: '2023-11-15', trangThai: 'Đang thực hiện' },
];

const duLieuBaiTapGoc = [
  { id: '1', tenBaiTap: 'Push Up', nhomCo: 'Chest', mucDo: 'Trung bình', moTa: 'Chống đẩy cơ bản', caloGio: 300 },
  { id: '2', tenBaiTap: 'Squat', nhomCo: 'Legs', mucDo: 'Dễ', moTa: 'Gập gối mông', caloGio: 400 },
  { id: '3', tenBaiTap: 'Plank', nhomCo: 'Core', mucDo: 'Trung bình', moTa: 'Giữ tư thế thẳng lưng', caloGio: 250 },
];

// Dashboard
const TrangChu = ({ danhSachTapLuyen, danhSachChiSo }) => {
  const tongBuoiTap = danhSachTapLuyen.filter(t => t.trangThai === 'Hoàn thành').length;
  const tongCalo = danhSachTapLuyen.reduce((sum, t) => sum + (t.trangThai === 'Hoàn thành' ? t.caloDot : 0), 0);
  
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="Tổng buổi tập (tháng)" value={tongBuoiTap} prefix={<CalendarOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Calo đã đốt" value={tongCalo} suffix="kcal" prefix={<FireOutlined style={{color: 'red'}}/>} /></Card></Col>
        <Col span={6}><Card><Statistic title="Streak hiện tại" value={3} suffix="ngày" prefix={<TrophyOutlined style={{color: 'gold'}}/>} /></Card></Col>
        <Col span={6}><Card><Statistic title="Hoàn thành mục tiêu" value={65} suffix="%" prefix={<LineChartOutlined style={{color: 'green'}}/>} /></Card></Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Biểu đồ cân nặng & Số buổi tập">
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 20, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
              {danhSachTapLuyen.map((bt, i) => (
                <div key={i} style={{ width: 40, height: `${(bt.caloDot / 500) * 100}%`, background: '#1890ff', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: -20, left: 5, fontSize: 10 }}>{bt.caloDot}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}><i>Biểu đồ Calo theo buổi tập</i></div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="5 buổi tập gần nhất">
            <Timeline>
              {danhSachTapLuyen.slice(0, 5).map(bt => (
                <Timeline.Item key={bt.id} color={bt.trangThai === 'Hoàn thành' ? 'green' : 'red'}>
                  <strong>{bt.loaiBaiTap}</strong> - {bt.ngayTap} <br/> {bt.caloDot} kcal ({bt.thoiLuong} phút)
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Nhật ký tập luyện
const NhatKyTapLuyen = ({ danhSachTapLuyen, setDanhSachTapLuyen }) => {
  const [form] = Form.useForm();
  const [hienThiModal, setHienThiModal] = useState(false);
  const [idSua, setIdSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  const moModal = (record = null) => {
    setIdSua(record ? record.id : null);
    if (record) form.setFieldsValue({ ...record, ngayTap: moment(record.ngayTap) });
    else form.resetFields();
    setHienThiModal(true);
  };

  const xuLyLuu = (values) => {
    const dataLuu = { ...values, ngayTap: values.ngayTap.format('YYYY-MM-DD') };
    if (idSua) {
      setDanhSachTapLuyen(danhSachTapLuyen.map(t => t.id === idSua ? { ...t, ...dataLuu } : t));
      message.success('Sửa thành công!');
    } else {
      setDanhSachTapLuyen([...danhSachTapLuyen, { ...dataLuu, id: Date.now().toString() }]);
      message.success('Thêm thành công!');
    }
    setHienThiModal(false);
  };

  const xoaTapLuyen = (id) => {
    setDanhSachTapLuyen(danhSachTapLuyen.filter(t => t.id !== id));
    message.success('Đã xóa buổi tập!');
  };

  const dataHienThi = danhSachTapLuyen.filter(t => t.loaiBaiTap.toLowerCase().includes(tuKhoa.toLowerCase()));

  return (
    <Card title="Nhật ký tập luyện">
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="Tìm loại bài tập..." prefix={<SearchOutlined />} onChange={e => setTuKhoa(e.target.value)} />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>Thêm buổi tập</Button>
      </Space>
      <Table 
        dataSource={dataHienThi} rowKey="id"
        columns={[
          { title: 'Ngày', dataIndex: 'ngayTap' },
          { title: 'Loại bài tập', dataIndex: 'loaiBaiTap' },
          { title: 'Thời lượng (ph)', dataIndex: 'thoiLuong' },
          { title: 'Calo đốt', dataIndex: 'caloDot' },
          { title: 'Ghi chú', dataIndex: 'ghiChu' },
          { title: 'Trạng thái', dataIndex: 'trangThai', render: t => <Tag color={t === 'Hoàn thành' ? 'green' : 'red'}>{t}</Tag> },
          { title: 'Thao tác', render: (_, record) => (
            <Space>
              <Button type="text" icon={<EditOutlined />} onClick={() => moModal(record)} />
              <Popconfirm title="Bạn có muốn xóa buổi tập?" onConfirm={() => xoaTapLuyen(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )}
        ]}
      />
      <Modal title={idSua ? "Sửa buổi tập" : "Thêm buổi tập"} visible={hienThiModal} onCancel={() => setHienThiModal(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={xuLyLuu}>
          <Form.Item name="ngayTap" label="Ngày tập" rules={[{ required: true }]}><DatePicker style={{width: '100%'}} /></Form.Item>
          <Form.Item name="loaiBaiTap" label="Loại bài tập" rules={[{ required: true }]}>
            <Select><Option value="Cardio">Cardio</Option><Option value="Strength">Strength</Option><Option value="Yoga">Yoga</Option><Option value="HIIT">HIIT</Option><Option value="Other">Other</Option></Select>
          </Form.Item>
          <Form.Item name="thoiLuong" label="Thời lượng (phút)"><InputNumber min={1} style={{width: '100%'}} /></Form.Item>
          <Form.Item name="caloDot" label="Calo đốt"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú"><Input.TextArea /></Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" initialValue="Hoàn thành">
            <Select><Option value="Hoàn thành">Hoàn thành</Option><Option value="Bỏ lỡ">Bỏ lỡ</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// Nhật ký chỉ số
const NhatKyChiSo = ({ danhSachChiSo, setDanhSachChiSo }) => {
  const [form] = Form.useForm();
  const [hienThiModal, setHienThiModal] = useState(false);

  const tinhBMI = (canNang, chieuCao) => {
    const chieuCaoM = chieuCao / 100;
    return (canNang / (chieuCaoM * chieuCaoM)).toFixed(1);
  };

  const hienThiTagBMI = (bmiVal) => {
    const bmi = parseFloat(bmiVal);
    if (bmi < 18.5) return <Tag color="blue">{bmi} (Thiểu cân)</Tag>;
    if (bmi <= 24.9) return <Tag color="green">{bmi} (Bình thường)</Tag>;
    if (bmi <= 29.9) return <Tag color="gold">{bmi} (Thừa cân)</Tag>;
    return <Tag color="red">{bmi} (Béo phì)</Tag>;
  };

  return (
    <Card title="Chỉ số sức khỏe">
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiModal(true)} style={{ marginBottom: 16 }}>Thêm chỉ số</Button>
      <Table 
        dataSource={danhSachChiSo} rowKey="id"
        columns={[
          { title: 'Ngày', dataIndex: 'ngay' },
          { title: 'Cân nặng (kg)', dataIndex: 'canNang' },
          { title: 'Chiều cao (cm)', dataIndex: 'chieuCao' },
          { title: 'BMI', render: (_, record) => hienThiTagBMI(tinhBMI(record.canNang, record.chieuCao)) },
          { title: 'Nhịp tim (bpm)', dataIndex: 'nhipTim' },
          { title: 'Giờ ngủ', dataIndex: 'gioNgu' },
          { title: 'Thao tác', render: (_, record) => (
            <Popconfirm title="Bạn có muốn xóa chỉ số này?" onConfirm={() => setDanhSachChiSo(danhSachChiSo.filter(c => c.id !== record.id))}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        ]}
      />
      <Modal title="Thêm chỉ số" visible={hienThiModal} onCancel={() => setHienThiModal(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={(val) => {
          setDanhSachChiSo([{ ...val, ngay: val.ngay.format('YYYY-MM-DD'), id: Date.now().toString() }, ...danhSachChiSo]);
          setHienThiModal(false); form.resetFields();
        }}>
          <Form.Item name="ngay" label="Ngày" rules={[{ required: true }]}><DatePicker style={{width: '100%'}} /></Form.Item>
          <Form.Item name="canNang" label="Cân nặng (kg)"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
          <Form.Item name="chieuCao" label="Chiều cao (cm)"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
          <Form.Item name="nhipTim" label="Nhịp tim"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
          <Form.Item name="gioNgu" label="Giờ ngủ"><InputNumber min={0} style={{width: '100%'}} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// Quản lý mục tiêu
const QuanLyMucTieu = ({ danhSachMucTieu, setDanhSachMucTieu }) => {
  const [form] = Form.useForm();
  const [hienThiDrawer, setHienThiDrawer] = useState(false);
  const [trangThaiLoc, setTrangThaiLoc] = useState('Tất cả');

  const capNhatTienDo = (id, giaTriMoi) => {
    setDanhSachMucTieu(danhSachMucTieu.map(m => m.id === id ? { ...m, giaTriHienTai: giaTriMoi } : m));
  };

  const dataHienThi = trangThaiLoc === 'Tất cả' ? danhSachMucTieu : danhSachMucTieu.filter(m => m.trangThai === trangThaiLoc);

  return (
    <Card title="Quản lý mục tiêu">
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Segmented options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']} onChange={setTrangThaiLoc} />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiDrawer(true)}>Thêm mục tiêu</Button>
      </Space>
      <Row gutter={[16, 16]}>
        {dataHienThi.map(mt => (
          <Col span={8} key={mt.id}>
            <Card title={mt.tenMucTieu} extra={
              <Popconfirm title="Bạn có muốn xóa mục tiêu?" onConfirm={() => setDanhSachMucTieu(danhSachMucTieu.filter(m => m.id !== mt.id))}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            }>
              <p>Loại: <b>{mt.loai}</b> | Deadline: {mt.deadline}</p>
              <div style={{ marginBottom: 10 }}>
                Cập nhật hiện tại: <InputNumber value={mt.giaTriHienTai} onChange={val => capNhatTienDo(mt.id, val)} /> / {mt.giaTriMucTieu}
              </div>
              <Progress percent={Math.round((mt.giaTriHienTai / mt.giaTriMucTieu) * 100)} status={mt.giaTriHienTai >= mt.giaTriMucTieu ? "success" : "active"} />
              <Tag color="blue" style={{ marginTop: 10 }}>{mt.trangThai}</Tag>
            </Card>
          </Col>
        ))}
      </Row>
      <Drawer title="Thêm mục tiêu" visible={hienThiDrawer} onClose={() => setHienThiDrawer(false)} width={400}
        extra={<Button type="primary" onClick={() => form.submit()}>Lưu</Button>}
      >
        <Form form={form} layout="vertical" onFinish={(val) => {
          setDanhSachMucTieu([{ ...val, deadline: val.deadline.format('YYYY-MM-DD'), id: Date.now().toString(), giaTriHienTai: 0 }, ...danhSachMucTieu]);
          setHienThiDrawer(false); form.resetFields();
        }}>
          <Form.Item name="tenMucTieu" label="Tên mục tiêu" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="loai" label="Loại" rules={[{ required: true }]}>
            <Select><Option value="Giảm cân">Giảm cân</Option><Option value="Tăng cơ">Tăng cơ</Option><Option value="Khác">Khác</Option></Select>
          </Form.Item>
          <Form.Item name="giaTriMucTieu" label="Giá trị mục tiêu"><InputNumber style={{width: '100%'}} /></Form.Item>
          <Form.Item name="deadline" label="Deadline"><DatePicker style={{width: '100%'}} /></Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" initialValue="Đang thực hiện">
            <Select><Option value="Đang thực hiện">Đang thực hiện</Option><Option value="Đã đạt">Đã đạt</Option></Select>
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  );
};

// Thư viện bài tập
const ThuVienBaiTap = ({ danhSachBaiTap, setDanhSachBaiTap }) => {
  const [tuKhoa, setTuKhoa] = useState('');
  
  const dataHienThi = danhSachBaiTap.filter(b => b.tenBaiTap.toLowerCase().includes(tuKhoa.toLowerCase()));

  return (
    <Card title="Thư viện bài tập">
      <Input placeholder="Tìm bài tập..." prefix={<SearchOutlined />} onChange={e => setTuKhoa(e.target.value)} style={{ width: 300, marginBottom: 16 }} />
      <Row gutter={[16, 16]}>
        {dataHienThi.map(bt => (
          <Col span={8} key={bt.id}>
            <Card hoverable title={bt.tenBaiTap} extra={<Tag color={bt.mucDo === 'Dễ' ? 'green' : bt.mucDo === 'Khó' ? 'red' : 'gold'}>{bt.mucDo}</Tag>}>
              <p><b>Nhóm cơ:</b> {bt.nhomCo}</p>
              <p><b>Mô tả:</b> {bt.moTa}</p>
              <p><b>Calo đốt:</b> ~{bt.caloGio} kcal/h</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

const AppTheDuc = () => {
  const location = useLocation();

  const [danhSachTapLuyen, setDanhSachTapLuyen] = useState(() => JSON.parse(localStorage.getItem('danhSachTapLuyen')) || duLieuTapLuyenGoc);
  const [danhSachChiSo, setDanhSachChiSo] = useState(() => JSON.parse(localStorage.getItem('danhSachChiSo')) || duLieuChiSoGoc);
  const [danhSachMucTieu, setDanhSachMucTieu] = useState(() => JSON.parse(localStorage.getItem('danhSachMucTieu')) || duLieuMucTieuGoc);
  const [danhSachBaiTap, setDanhSachBaiTap] = useState(() => JSON.parse(localStorage.getItem('danhSachBaiTap')) || duLieuBaiTapGoc);

  useEffect(() => { localStorage.setItem('danhSachTapLuyen', JSON.stringify(danhSachTapLuyen)); }, [danhSachTapLuyen]);
  useEffect(() => { localStorage.setItem('danhSachChiSo', JSON.stringify(danhSachChiSo)); }, [danhSachChiSo]);
  useEffect(() => { localStorage.setItem('danhSachMucTieu', JSON.stringify(danhSachMucTieu)); }, [danhSachMucTieu]);
  useEffect(() => { localStorage.setItem('danhSachBaiTap', JSON.stringify(danhSachBaiTap)); }, [danhSachBaiTap]);

  const renderContent = () => {
    switch (location.pathname) {
      case '/the-duc/trang-chu':
        return <TrangChu danhSachTapLuyen={danhSachTapLuyen} danhSachChiSo={danhSachChiSo} />;
      case '/the-duc/nhat-ky-tap-luyen':
        return <NhatKyTapLuyen danhSachTapLuyen={danhSachTapLuyen} setDanhSachTapLuyen={setDanhSachTapLuyen} />;
      case '/the-duc/nhat-ky-chi-so':
        return <NhatKyChiSo danhSachChiSo={danhSachChiSo} setDanhSachChiSo={setDanhSachChiSo} />;
      case '/the-duc/muc-tieu':
        return <QuanLyMucTieu danhSachMucTieu={danhSachMucTieu} setDanhSachMucTieu={setDanhSachMucTieu} />;
      case '/the-duc/thu-vien':
        return <ThuVienBaiTap danhSachBaiTap={danhSachBaiTap} setDanhSachBaiTap={setDanhSachBaiTap} />;
      default:
        return <TrangChu danhSachTapLuyen={danhSachTapLuyen} danhSachChiSo={danhSachChiSo} />;
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {renderContent()}
    </div>
  );
};

export default AppTheDuc;