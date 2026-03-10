import React, { useState } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Tag, Typography, Row, Col, message, Divider, List, Empty } from 'antd';
import { PlusOutlined, BookOutlined, DatabaseOutlined, FileTextOutlined, SettingOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface MonHoc {
  maMon: string;
  tenMon: string;
  soTinChi: number;
}

interface CauHoi {
  id: string;
  maMon: string;
  noiDung: string;
  mucDo: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  khoiKienThuc: string;
}

interface DeThi {
  id: string;
  tenDe: string;
  maMon: string;
  dsCauHoi: CauHoi[];
  ngayTao: string;
}

const QuanLyNganHangCauHoi: React.FC = () => {
  const danhSachKhoiKienThuc = ['Tổng quan', 'Cơ bản', 'Vận dụng', 'Chuyên sâu'];
  const danhSachMucDo = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
  
  const [danhSachMonHoc] = useState<MonHoc[]>([
    { maMon: 'BAS1201', tenMon: 'Đại số', soTinChi: 3 },
    { maMon: 'BAS1221', tenMon: 'Giải tích 1', soTinChi: 3 },
  ]);

  const [nganHangCauHoi, setNganHangCauHoi] = useState<CauHoi[]>([]);
  const [danhSachDeThi, setDanhSachDeThi] = useState<DeThi[]>([]);

  const [isModalCauHoiVisible, setIsModalCauHoiVisible] = useState(false);
  const [isModalDeThiVisible, setIsModalDeThiVisible] = useState(false);
  const [isModalSuaDeVisible, setIsModalSuaDeVisible] = useState(false);
  const [deDangSua, setDeDangSua] = useState<DeThi | null>(null);

  const [formCauHoi] = Form.useForm();
  const [formDeThi] = Form.useForm();
  const [formSuaDe] = Form.useForm();

  const taoMaCauHoiMoi = () => {
    if (nganHangCauHoi.length === 0) return 'CH001';
    const danhSachSo = nganHangCauHoi.map(ch => {
      const soTrichXuat = ch.id.replace('CH', ''); 
      return parseInt(soTrichXuat, 10);
    });
    const soTiepTheo = Math.max(...danhSachSo) + 1;
    return `CH${String(soTiepTheo).padStart(3, '0')}`;
  };

  const luuCauHoi = (values: any) => {
    const maTuTang = taoMaCauHoiMoi();
    const cauHoiMoi: CauHoi = { ...values, id: maTuTang };
    setNganHangCauHoi([cauHoiMoi, ...nganHangCauHoi]);
    setIsModalCauHoiVisible(false);
    formCauHoi.resetFields();
    message.success(`Đã thêm câu hỏi mã ${maTuTang}`);
  };

  const taoDeThiTuDong = (values: any) => {
    const { tenDe, maMon, cauTruc } = values; 
    let deThiTam: CauHoi[] = [];
    let loiHeThong = false;

    cauTruc?.forEach((yc: any) => {
      const dsPhuHop = nganHangCauHoi.filter(ch => 
        ch.maMon === maMon && ch.mucDo === yc.mucDo && ch.khoiKienThuc === yc.khoiKienThuc
      );

      if (dsPhuHop.length < yc.soLuong) {
        message.error(`Không đủ câu hỏi: ${yc.mucDo} - ${yc.khoiKienThuc} (Cần ${yc.soLuong}, có ${dsPhuHop.length})`);
        loiHeThong = true;
      } else {
        const xaoTron = [...dsPhuHop].sort(() => 0.5 - Math.random());
        deThiTam = [...deThiTam, ...xaoTron.slice(0, yc.soLuong)];
      }
    });

    if (!loiHeThong && deThiTam.length > 0) {
      const deThiMoi: DeThi = {
        id: `DT-${Date.now()}`,
        tenDe,
        maMon,
        dsCauHoi: deThiTam,
        ngayTao: new Date().toLocaleString(),
      };
      setDanhSachDeThi([deThiMoi, ...danhSachDeThi]);
      setIsModalDeThiVisible(false);
      formDeThi.resetFields();
      message.success('Tạo đề thi thành công!');
    }
  };

  const handleMoSuaDe = (de: DeThi) => {
    setDeDangSua(de);
    formSuaDe.setFieldsValue({
      tenDe: de.tenDe,
      dsIdCauHoi: de.dsCauHoi.map(c => c.id)
    });
    setIsModalSuaDeVisible(true);
  };

  const luuChinhSuaDe = (values: any) => {
    if (!deDangSua) return;
    const dsCauHoiMoi = nganHangCauHoi.filter(ch => values.dsIdCauHoi.includes(ch.id));
    
    const danhSachMoi = danhSachDeThi.map(de => 
      de.id === deDangSua.id ? { ...de, tenDe: values.tenDe, dsCauHoi: dsCauHoiMoi } : de
    );

    setDanhSachDeThi(danhSachMoi);
    setIsModalSuaDeVisible(false);
    message.success('Cập nhật đề thi thành công');
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title={<Title level={3} style={{ margin: 0 }}>🏛️ Hệ Thống Ngân Hàng Đề Thi Tự Luận</Title>}>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><BookOutlined /> Danh mục chung</span>} key="1">
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Divider orientation="left">Môn học </Divider>
                <Table 
                  dataSource={danhSachMonHoc} 
                  rowKey="maMon" 
                  pagination={false} 
                  bordered
                  columns={[
                    { title: 'Mã môn', dataIndex: 'maMon' },
                    { title: 'Tên môn', dataIndex: 'tenMon' },
                    { title: 'Tín chỉ', dataIndex: 'soTinChi', align: 'center' }
                  ]}
                />
              </Col>
              <Col span={12}>
                <Divider orientation="left">Khối kiến thức</Divider>
                <Row gutter={[16, 16]}>
                  {danhSachKhoiKienThuc.map((khoi) => (
                    <Col span={12} key={khoi}>
                      <Card 
                        size="small" 
                        style={{ textAlign: 'center', background: '#fafafa', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>{khoi}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><DatabaseOutlined /> Ngân hàng câu hỏi</span>} key="2">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalCauHoiVisible(true)}>
              Thêm câu hỏi mới
            </Button>
            <Table 
              dataSource={nganHangCauHoi} 
              rowKey="id" 
              style={{ marginTop: 16 }}
              columns={[
                { title: 'Mã CH', dataIndex: 'id', width: 100 },
                { title: 'Nội dung', dataIndex: 'noiDung', ellipsis: true },
                { title: 'Môn học', dataIndex: 'maMon' },
                { 
                  title: 'Mức độ', 
                  dataIndex: 'mucDo',
                  render: (m) => <Tag color={m === 'Rất khó' ? 'red' : 'green'}>{m}</Tag>
                },
                { title: 'Khối kiến thức', dataIndex: 'khoiKienThuc' },
                {
                  title: 'Thao tác',
                  align: 'center',
                  render: (_, record) => (
                    <Popconfirm title="Xóa?" onConfirm={() => setNganHangCauHoi(nganHangCauHoi.filter(c => c.id !== record.id))}>
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  )
                }
              ]}
            />
          </TabPane>

          <TabPane tab={<span><FileTextOutlined /> Quản lý đề thi</span>} key="3">
            <Button type="primary" icon={<SettingOutlined />} onClick={() => setIsModalDeThiVisible(true)}>
              Thiết lập & Tạo đề thi
            </Button>
            <Divider orientation="left">Danh sách đề thi đã tạo</Divider>
            <Row gutter={[16, 16]}>
              {danhSachDeThi.length === 0 && <Empty description="Chưa có đề thi nào" />}
              {danhSachDeThi.map(de => (
                <Col span={12} key={de.id}>
                  <Card 
                    size="small" 
                    title={de.tenDe} 
                    extra={
                      <Space>
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleMoSuaDe(de)}>Sửa</Button>
                        <Popconfirm title="Xóa đề này?" onConfirm={() => setDanhSachDeThi(danhSachDeThi.filter(d => d.id !== de.id))}>
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    }
                  >
                    <Text italic type="secondary">Môn: {de.maMon} - {de.ngayTao}</Text>
                    <List
                      size="small"
                      dataSource={de.dsCauHoi}
                      renderItem={(ch, idx) => <List.Item>{idx + 1}. {ch.noiDung} ({ch.mucDo})</List.Item>}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      <Modal 
        title="Thêm câu hỏi mới" 
        visible={isModalCauHoiVisible} 
        onCancel={() => setIsModalCauHoiVisible(false)}
        onOk={() => formCauHoi.submit()}
      >
        <Form form={formCauHoi} onFinish={luuCauHoi} layout="vertical">
          <Form.Item name="maMon" label="Môn học" rules={[{ required: true }]}>
            <Select>{danhSachMonHoc.map(m => <Option key={m.maMon} value={m.maMon}>{m.tenMon}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true }]}>
                <Select>{danhSachMucDo.map(m => <Option key={m} value={m}>{m}</Option>)}</Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="khoiKienThuc" label="Khối kiến thức" rules={[{ required: true }]}>
                <Select>{danhSachKhoiKienThuc.map(k => <Option key={k} value={k}>{k}</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal 
        title="Tạo đề thi tự động" 
        visible={isModalDeThiVisible} 
        onCancel={() => setIsModalDeThiVisible(false)}
        onOk={() => formDeThi.submit()}
        width={700}
      >
        <Form form={formDeThi} onFinish={taoDeThiTuDong} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="tenDe" label="Tên đề" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}>
              <Form.Item name="maMon" label="Môn thi" rules={[{ required: true }]}>
                <Select>{danhSachMonHoc.map(m => <Option key={m.maMon} value={m.maMon}>{m.tenMon}</Option>)}</Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="cauTruc">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'mucDo']} rules={[{ required: true }]} style={{ width: 150 }}>
                      <Select placeholder="Mức độ">{danhSachMucDo.map(m => <Option key={m} value={m}>{m}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'khoiKienThuc']} rules={[{ required: true }]} style={{ width: 150 }}>
                      <Select placeholder="Khối">{danhSachKhoiKienThuc.map(k => <Option key={k} value={k}>{k}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'soLuong']} rules={[{ required: true }]} style={{ width: 100 }}>
                      <InputNumber min={1} placeholder="Số lượng" />
                    </Form.Item>
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm cấu trúc</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal 
        title="Chỉnh sửa đề thi" 
        visible={isModalSuaDeVisible} 
        onCancel={() => setIsModalSuaDeVisible(false)}
        onOk={() => formSuaDe.submit()}
        width={600}
      >
        <Form form={formSuaDe} onFinish={luuChinhSuaDe} layout="vertical">
          <Form.Item name="tenDe" label="Tên đề thi" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dsIdCauHoi" label="Danh sách câu hỏi trong đề">
            <Select mode="multiple" placeholder="Chọn câu hỏi từ ngân hàng" style={{ width: '100%' }}>
              {nganHangCauHoi
                .filter(ch => ch.maMon === deDangSua?.maMon)
                .map(ch => (
                  <Option key={ch.id} value={ch.id}>[{ch.id}] {ch.noiDung.substring(0, 50)}...</Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyNganHangCauHoi;