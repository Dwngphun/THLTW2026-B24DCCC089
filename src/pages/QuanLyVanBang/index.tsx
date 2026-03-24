import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Typography, Row, Col, message, Divider, DatePicker, Descriptions, Tag } from 'antd';
import { BookOutlined, FileProtectOutlined, FormOutlined, IdcardOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface SoVanBang { id: string; nam: number; tenSo: string; soHienTai: number; }
interface QuyetDinh { id: string; soQuyetDinh: string; ngayBanHanh: string; trichYeu: string; idSoVanBang: string; luotTraCuu: number; }
interface TruongThongTin { id: string; maTruong: string; tenTruong: string; kieuDuLieu: 'String' | 'Number' | 'Date'; }
interface VanBang {
  id: string; idQuyetDinh: string; soVaoSo: number; soHieu: string;
  maSinhVien: string; hoTen: string; ngaySinh: string;
  duLieuDong: Record<string, any>;
}

const QuanLyVanBangTH03: React.FC = () => {
  const [danhSachSoVanBang, setDanhSachSoVanBang] = useState<SoVanBang[]>([]);
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinh[]>([]);
  const [cauHinhBieuMau, setCauHinhBieuMau] = useState<TruongThongTin[]>([]);
  const [danhSachVanBang, setDanhSachVanBang] = useState<VanBang[]>([]);
  const [ketQuaTraCuu, setKetQuaTraCuu] = useState<VanBang | null>(null);
  
  const [isModalSoVisible, setIsModalSoVisible] = useState(false);
  const [isModalQdVisible, setIsModalQdVisible] = useState(false);
  const [isModalTruongVisible, setIsModalTruongVisible] = useState(false);
  const [isModalVbVisible, setIsModalVbVisible] = useState(false);

  const [dangSuaSo, setDangSuaSo] = useState<SoVanBang | null>(null);
  const [dangSuaQd, setDangSuaQd] = useState<QuyetDinh | null>(null);
  const [dangSuaTruong, setDangSuaTruong] = useState<TruongThongTin | null>(null);
  const [dangSuaVb, setDangSuaVb] = useState<VanBang | null>(null);

  const [formSo] = Form.useForm();
  const [formQd] = Form.useForm();
  const [formTruong] = Form.useForm();
  const [formVb] = Form.useForm();
  const [formTraCuu] = Form.useForm();

  // LocalStorage
  useEffect(() => {
    const dataSo = localStorage.getItem('th03_so');
    const dataQd = localStorage.getItem('th03_qd');
    const dataTruong = localStorage.getItem('th03_truong');
    const dataVb = localStorage.getItem('th03_vb');

    if (dataSo) setDanhSachSoVanBang(JSON.parse(dataSo));
    if (dataQd) setDanhSachQuyetDinh(JSON.parse(dataQd));
    if (dataTruong) setCauHinhBieuMau(JSON.parse(dataTruong));
    else setCauHinhBieuMau([
      { id: '1', maTruong: 'danToc', tenTruong: 'Dân tộc', kieuDuLieu: 'String' },
      { id: '2', maTruong: 'diemTB', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number' }
    ]);
    if (dataVb) setDanhSachVanBang(JSON.parse(dataVb));
  }, []);

  useEffect(() => { localStorage.setItem('th03_so', JSON.stringify(danhSachSoVanBang)); }, [danhSachSoVanBang]);
  useEffect(() => { localStorage.setItem('th03_qd', JSON.stringify(danhSachQuyetDinh)); }, [danhSachQuyetDinh]);
  useEffect(() => { localStorage.setItem('th03_truong', JSON.stringify(cauHinhBieuMau)); }, [cauHinhBieuMau]);
  useEffect(() => { localStorage.setItem('th03_vb', JSON.stringify(danhSachVanBang)); }, [danhSachVanBang]);

  // CRUD sổ văn bằng
  const moModalSo = (record?: SoVanBang) => {
    if (record) { setDangSuaSo(record); formSo.setFieldsValue(record); } 
    else { setDangSuaSo(null); formSo.resetFields(); }
    setIsModalSoVisible(true);
  };

  const luuSoVanBang = (values: any) => {
    if (dangSuaSo) {
      setDanhSachSoVanBang(danhSachSoVanBang.map(s => s.id === dangSuaSo.id ? { ...dangSuaSo, ...values } : s));
      message.success('Cập nhật sổ thành công');
    } else {
      if (danhSachSoVanBang.find(s => s.nam === values.nam)) return message.error(`Sổ năm ${values.nam} đã tồn tại!`);
      const soMoi: SoVanBang = { id: `SO${Date.now()}`, ...values, soHienTai: 0 };
      setDanhSachSoVanBang([soMoi, ...danhSachSoVanBang]);
      message.success('Tạo sổ thành công');
    }
    setIsModalSoVisible(false);
  };

  const xoaSoVanBang = (id: string) => {
    if (danhSachQuyetDinh.some(q => q.idSoVanBang === id)) return message.error('Không thể xóa sổ đã có Quyết định!');
    setDanhSachSoVanBang(danhSachSoVanBang.filter(s => s.id !== id));
    message.success('Đã xóa sổ');
  };

  // CRUD quyết định
  const moModalQd = (record?: QuyetDinh) => {
    if (record) { 
      setDangSuaQd(record); 
      formQd.setFieldsValue({ ...record, ngayBanHanh: dayjs(record.ngayBanHanh) }); 
    } else { setDangSuaQd(null); formQd.resetFields(); }
    setIsModalQdVisible(true);
  };

  const luuQuyetDinh = (values: any) => {
    const data = { ...values, ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD') };
    if (dangSuaQd) {
      setDanhSachQuyetDinh(danhSachQuyetDinh.map(q => q.id === dangSuaQd.id ? { ...dangSuaQd, ...data } : q));
      message.success('Cập nhật quyết định thành công');
    } else {
      const qdMoi: QuyetDinh = { id: `QD${Date.now()}`, ...data, luotTraCuu: 0 };
      setDanhSachQuyetDinh([qdMoi, ...danhSachQuyetDinh]);
      message.success('Thêm quyết định thành công');
    }
    setIsModalQdVisible(false);
  };

  const xoaQuyetDinh = (id: string) => {
    if (danhSachVanBang.some(v => v.idQuyetDinh === id)) return message.error('Không thể xóa QĐ đã cấp văn bằng!');
    setDanhSachQuyetDinh(danhSachQuyetDinh.filter(q => q.id !== id));
    message.success('Đã xóa quyết định');
  };

  // CRUD cấu hình biểu mẫu
  const moModalTruong = (record?: TruongThongTin) => {
    if (record) { setDangSuaTruong(record); formTruong.setFieldsValue(record); } 
    else { setDangSuaTruong(null); formTruong.resetFields(); }
    setIsModalTruongVisible(true);
  };

  const luuTruongThongTin = (values: any) => {
    if (dangSuaTruong) {
      setCauHinhBieuMau(cauHinhBieuMau.map(t => t.id === dangSuaTruong.id ? { ...dangSuaTruong, ...values } : t));
      message.success('Cập nhật trường cấu hình thành công');
    } else {
      const truongMoi: TruongThongTin = { id: `TR${Date.now()}`, ...values };
      setCauHinhBieuMau([...cauHinhBieuMau, truongMoi]);
      message.success('Đã thêm trường cấu hình');
    }
    setIsModalTruongVisible(false);
  };

  const xoaTruongThongTin = (id: string) => {
    setCauHinhBieuMau(cauHinhBieuMau.filter(t => t.id !== id));
    message.success('Đã xóa trường dữ liệu');
  };

  // CRUD văn bằng
  const hienThiSoVaoSo = (idQd: string) => {
    if (dangSuaVb) return; 
    const qd = danhSachQuyetDinh.find(q => q.id === idQd);
    if (!qd) return;
    const so = danhSachSoVanBang.find(s => s.id === qd.idSoVanBang);
    if (so) formVb.setFieldsValue({ soVaoSo: so.soHienTai + 1 });
  };

  const moModalVb = (record?: VanBang) => {
    if (record) {
      setDangSuaVb(record);
      const formattedData = { ...record, ngaySinh: dayjs(record.ngaySinh), duLieuDong: { ...record.duLieuDong } };
      cauHinhBieuMau.forEach(t => {
        if (t.kieuDuLieu === 'Date' && formattedData.duLieuDong[t.maTruong]) {
          formattedData.duLieuDong[t.maTruong] = dayjs(formattedData.duLieuDong[t.maTruong]);
        }
      });
      formVb.setFieldsValue(formattedData);
    } else {
      setDangSuaVb(null);
      formVb.resetFields();
    }
    setIsModalVbVisible(true);
  };

  const luuVanBang = (values: any) => {
    const duLieuDongFormatted = { ...(values.duLieuDong || {}) };
    cauHinhBieuMau.forEach(t => {
      if (t.kieuDuLieu === 'Date' && duLieuDongFormatted[t.maTruong]) {
        duLieuDongFormatted[t.maTruong] = duLieuDongFormatted[t.maTruong].format('YYYY-MM-DD');
      }
    });

    const data = {
      ...values,
      ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
      duLieuDong: duLieuDongFormatted
    };

    if (dangSuaVb) {
      setDanhSachVanBang(danhSachVanBang.map(v => v.id === dangSuaVb.id ? { ...dangSuaVb, ...data } : v));
      message.success('Cập nhật thông tin văn bằng thành công');
    } else {
      const qd = danhSachQuyetDinh.find(q => q.id === values.idQuyetDinh);
      if (!qd) return message.error('Không tìm thấy quyết định');
      
      const soMoiNhat = danhSachSoVanBang.map(s => s.id === qd.idSoVanBang ? { ...s, soHienTai: s.soHienTai + 1 } : s);
      const vbMoi: VanBang = { id: `VB${Date.now()}`, ...data };

      setDanhSachSoVanBang(soMoiNhat);
      setDanhSachVanBang([vbMoi, ...danhSachVanBang]);
      message.success('Đã cấp phát văn bằng thành công!');
    }
    setIsModalVbVisible(false);
  };

  const xoaVanBang = (id: string) => {
    setDanhSachVanBang(danhSachVanBang.filter(v => v.id !== id));
    message.success('Đã xóa thông tin văn bằng');
  };

  // Tra cứu
  const xuLyTraCuu = (values: any) => {
    const thamSoDaNhap = Object.values(values).filter(v => v !== undefined && v !== '' && v !== null);
    if (thamSoDaNhap.length < 2) return message.error('Yêu cầu nhập ít nhất 2 tham số để tìm kiếm!');

    const ketQua = danhSachVanBang.find(vb => {
      let khop = true;
      if (values.soHieu && vb.soHieu !== values.soHieu) khop = false;
      if (values.soVaoSo && vb.soVaoSo !== Number(values.soVaoSo)) khop = false;
      if (values.maSinhVien && vb.maSinhVien !== values.maSinhVien) khop = false;
      if (values.hoTen && !vb.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) khop = false;
      if (values.ngaySinh && vb.ngaySinh !== values.ngaySinh.format('YYYY-MM-DD')) khop = false;
      return khop;
    });

    if (ketQua) {
      setKetQuaTraCuu(ketQua);
      const qdMoiCapNhat = danhSachQuyetDinh.map(qd => qd.id === ketQua.idQuyetDinh ? { ...qd, luotTraCuu: qd.luotTraCuu + 1 } : qd);
      setDanhSachQuyetDinh(qdMoiCapNhat);
      message.success('Đã tìm thấy văn bằng!');
    } else {
      setKetQuaTraCuu(null);
      message.error('Không tìm thấy văn bằng khớp với thông tin!');
    }
  };

  const renderControlTruongDong = (truong: TruongThongTin) => {
    if (truong.kieuDuLieu === 'Number') return <InputNumber style={{ width: '100%' }} />;
    if (truong.kieuDuLieu === 'Date') return <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />;
    return <Input />;
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title={<Title level={3} style={{ margin: 0 }}>Quản Lý & Tra Cứu Số Văn Bằng</Title>}>
        <Tabs defaultActiveKey="so-van-bang" destroyInactiveTabPane>
          {/* TAB 1: Sổ văn bằng*/}
          <TabPane tab={<span><BookOutlined /> Sổ văn bằng</span>} key="so-van-bang">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalSo()}>Mở sổ mới</Button>
            <Table dataSource={danhSachSoVanBang} rowKey="id" style={{ marginTop: 16 }}
              columns={[
                { title: 'Năm', dataIndex: 'nam' },
                { title: 'Tên sổ', dataIndex: 'tenSo' },
                { title: 'Số hiện tại', dataIndex: 'soHienTai', render: (so) => <Text strong style={{color: '#1890ff'}}>{so}</Text> },
                { title: 'Thao tác', align: 'center', render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => moModalSo(record)} />
                    <Popconfirm title="Xóa sổ này?" onConfirm={() => xoaSoVanBang(record.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]}
            />
          </TabPane>

          {/* TAB 2: Quyết định tốt nghiệp*/}
          <TabPane tab={<span><FileProtectOutlined /> Quyết định tốt nghiệp</span>} key="quyet-dinh">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalQd()}>Thêm Quyết định</Button>
            <Table dataSource={danhSachQuyetDinh} rowKey="id" style={{ marginTop: 16 }}
              columns={[
                { title: 'Số QĐ', dataIndex: 'soQuyetDinh' },
                { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh' },
                { title: 'Trích yếu', dataIndex: 'trichYeu', ellipsis: true },
                { title: 'Thuộc sổ năm', dataIndex: 'idSoVanBang', render: (id) => danhSachSoVanBang.find(s => s.id === id)?.nam },
                { title: 'Thao tác', align: 'center', render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => moModalQd(record)} />
                    <Popconfirm title="Xóa quyết định này?" onConfirm={() => xoaQuyetDinh(record.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]}
            />
          </TabPane>

          {/* TAB 3: Cấu hình biểu mẫu */}
          <TabPane tab={<span><FormOutlined /> Cấu hình phụ lục</span>} key="cau-hinh">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalTruong()}>Thêm trường dữ liệu</Button>
            <Table dataSource={cauHinhBieuMau} rowKey="id" style={{ marginTop: 16 }}
              columns={[
                { title: 'Mã trường', dataIndex: 'maTruong' },
                { title: 'Tên hiển thị', dataIndex: 'tenTruong' },
                { title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', render: (k) => <Tag color="blue">{k}</Tag> },
                { title: 'Thao tác', align: 'center', render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => moModalTruong(record)} />
                    <Popconfirm title="Xóa trường này?" onConfirm={() => xoaTruongThongTin(record.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]}
            />
          </TabPane>

          {/* TAB 4: Thông tin văn bằng*/}
          <TabPane tab={<span><IdcardOutlined /> Thông tin văn bằng</span>} key="van-bang">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalVb()}>Cấp phát văn bằng</Button>
            <Table dataSource={danhSachVanBang} rowKey="id" style={{ marginTop: 16 }}
              columns={[
                { title: 'Số hiệu', dataIndex: 'soHieu' },
                { title: 'Số vào sổ', dataIndex: 'soVaoSo', render: (so) => <Text strong>{so}</Text> },
                { title: 'Mã SV', dataIndex: 'maSinhVien' },
                { title: 'Họ tên', dataIndex: 'hoTen' },
                { title: 'Quyết định', dataIndex: 'idQuyetDinh', render: (id) => danhSachQuyetDinh.find(q => q.id === id)?.soQuyetDinh },
                { title: 'Thao tác', align: 'center', render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => moModalVb(record)} />
                    <Popconfirm title="Xóa văn bằng?" onConfirm={() => xoaVanBang(record.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]}
            />
          </TabPane>

          {/* TAB 5: Tra cứu*/}
          <TabPane tab={<span><SearchOutlined /> Tra cứu (Public)</span>} key="tra-cuu">
            <div style={{ padding: '8px 0', maxWidth: 1200, margin: '0 auto' }}>
              <Text type="danger" italic>* Vui lòng nhập ít nhất 2 tham số để tra cứu</Text>
              
              <Form form={formTraCuu} onFinish={xuLyTraCuu} layout="vertical" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={4}><Form.Item name="soHieu" label="Số hiệu văn bằng"><Input placeholder="VD: VB01" /></Form.Item></Col>
                  <Col span={4}><Form.Item name="soVaoSo" label="Số vào sổ"><InputNumber style={{ width: '100%' }} placeholder="VD: 1" /></Form.Item></Col>
                  <Col span={5}><Form.Item name="maSinhVien" label="Mã Sinh Viên"><Input placeholder="VD: B24DCCC089" /></Form.Item></Col>
                  <Col span={6}><Form.Item name="hoTen" label="Họ và tên"><Input placeholder="VD: Phùng Đăng Dương" /></Form.Item></Col>
                  <Col span={5}><Form.Item name="ngaySinh" label="Ngày sinh"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày" /></Form.Item></Col>
                </Row>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tra cứu thông tin</Button>
              </Form>

              {ketQuaTraCuu && (
                <div style={{ marginTop: 32 }}>
                  <Divider orientation="left">
                    <Title level={5} style={{ margin: 0, color: '#1890ff' }}>Thông tin chi tiết văn bằng</Title>
                  </Divider>
                  
                  <Descriptions bordered size="small" column={2} style={{ background: '#fff' }}>
                    <Descriptions.Item label="Họ và tên"><Text strong>{ketQuaTraCuu.hoTen}</Text></Descriptions.Item>
                    <Descriptions.Item label="Mã sinh viên"><Text strong>{ketQuaTraCuu.maSinhVien}</Text></Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">{ketQuaTraCuu.ngaySinh}</Descriptions.Item>
                    <Descriptions.Item label="Số hiệu văn bằng"><Text type="danger" strong>{ketQuaTraCuu.soHieu}</Text></Descriptions.Item>
                    <Descriptions.Item label="Số vào sổ"><Text strong>{ketQuaTraCuu.soVaoSo}</Text></Descriptions.Item>
                    <Descriptions.Item label="Quyết định TN">
                      {danhSachQuyetDinh.find(q => q.id === ketQuaTraCuu.idQuyetDinh)?.soQuyetDinh} 
                    </Descriptions.Item>
                    
                    {cauHinhBieuMau.map(truong => {
                      const giaTri = ketQuaTraCuu.duLieuDong?.[truong.maTruong];
                      const hienThi = truong.kieuDuLieu === 'Date' && giaTri ? dayjs(giaTri).format('YYYY-MM-DD') : giaTri;
                      return (
                        <Descriptions.Item key={truong.id} label={truong.tenTruong}>
                          {hienThi || '---'}
                        </Descriptions.Item>
                      );
                    })}
                  </Descriptions>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal*/}
      <Modal title={dangSuaSo ? "Sửa Sổ Văn Bằng" : "Mở Sổ Mới"} visible={isModalSoVisible} onCancel={() => setIsModalSoVisible(false)} onOk={() => formSo.submit()}>
        <Form form={formSo} onFinish={luuSoVanBang} layout="vertical">
          <Form.Item name="nam" label="Năm phát hành" rules={[{ required: true }]}><InputNumber disabled={!!dangSuaSo} min={2000} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="tenSo" label="Tên sổ" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>

      <Modal title={dangSuaQd ? "Sửa Quyết Định" : "Thêm Quyết Định"} visible={isModalQdVisible} onCancel={() => setIsModalQdVisible(false)} onOk={() => formQd.submit()}>
        <Form form={formQd} onFinish={luuQuyetDinh} layout="vertical">
          <Form.Item name="idSoVanBang" label="Thuộc sổ văn bằng" rules={[{ required: true }]}>
            <Select>{danhSachSoVanBang.map(s => <Option key={s.id} value={s.id}>{s.tenSo}</Option>)}</Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="soQuyetDinh" label="Số QĐ" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item name="trichYeu" label="Trích yếu" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      <Modal title={dangSuaTruong ? "Sửa Cấu Hình" : "Thêm Cấu Hình"} visible={isModalTruongVisible} onCancel={() => setIsModalTruongVisible(false)} onOk={() => formTruong.submit()}>
        <Form form={formTruong} onFinish={luuTruongThongTin} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="maTruong" label="Mã trường" rules={[{ required: true }]}><Input disabled={!!dangSuaTruong} /></Form.Item></Col>
            <Col span={12}><Form.Item name="tenTruong" label="Tên hiển thị" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={24}>
              <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu" rules={[{ required: true }]}>
                <Select disabled={!!dangSuaTruong}>
                  <Option value="String">Văn bản</Option>
                  <Option value="Number">Số</Option>
                  <Option value="Date">Ngày tháng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal title={dangSuaVb ? "Sửa Thông Tin Văn Bằng" : "Cấp Phát Văn Bằng Mới"} visible={isModalVbVisible} onCancel={() => setIsModalVbVisible(false)} onOk={() => formVb.submit()} width={700}>
        <Form form={formVb} onFinish={luuVanBang} layout="vertical" onValuesChange={(changed) => { if (changed.idQuyetDinh) hienThiSoVaoSo(changed.idQuyetDinh); }}>
          <Form.Item name="idQuyetDinh" label="Quyết định tốt nghiệp" rules={[{ required: true }]}>
            <Select disabled={!!dangSuaVb}>{danhSachQuyetDinh.map(q => <Option key={q.id} value={q.id}>{q.soQuyetDinh}</Option>)}</Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soVaoSo" label="Số vào sổ (Hệ thống cấp tự động)">
                <InputNumber disabled style={{ width: '100%', fontWeight: 'bold', color: 'blue' }} />
              </Form.Item>
            </Col>
            <Col span={12}><Form.Item name="soHieu" label="Số hiệu văn bằng" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="maSinhVien" label="Mã SV" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item></Col>
          </Row>
          
          <Divider orientation="left">Phụ lục (Động)</Divider>
          <Row gutter={16}>
            {cauHinhBieuMau.map(truong => (
              <Col span={12} key={truong.maTruong}>
                <Form.Item name={['duLieuDong', truong.maTruong]} label={truong.tenTruong} rules={[{ required: true }]}>
                  {renderControlTruongDong(truong)}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyVanBangTH03;