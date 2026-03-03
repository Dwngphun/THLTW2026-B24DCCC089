import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Space, Popconfirm, Tag, Progress, Typography, message, Row, Col} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined,} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface MonHoc {
  id: string;
  tenMon: string;
}
interface TienDo {
  id: string;
  idMonHoc: string;
  ngayGio: string;
  thoiLuong: number; 
  noiDung: string;
  ghiChu: string;
}
interface MucTieu {
  idMonHoc: string;
  thoiLuongMucTieu: number; 
}

const QuanLyHocTap: React.FC = () => {
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
  const [danhSachTienDo, setDanhSachTienDo] = useState<TienDo[]>([]);
  const [danhSachMucTieu, setDanhSachMucTieu] = useState<MucTieu[]>([]);
  const [isModalMonHocOpen, setIsModalMonHocOpen] = useState(false);
  const [isModalTienDoOpen, setIsModalTienDoOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [formMonHoc] = Form.useForm();
  const [formTienDo] = Form.useForm();
  useEffect(() => {
    const duLieuMonHoc = localStorage.getItem('ql_mon_hoc');
    const duLieuTienDo = localStorage.getItem('ql_tien_do');
    const duLieuMucTieu = localStorage.getItem('ql_muc_tieu');
    if (duLieuMonHoc) setDanhSachMonHoc(JSON.parse(duLieuMonHoc));
    else setDanhSachMonHoc([{ id: '1', tenMon: 'TOEIC' }, { id: '2', tenMon: 'Thực hành Lập trình Web' }]);
    if (duLieuTienDo) setDanhSachTienDo(JSON.parse(duLieuTienDo));
    if (duLieuMucTieu) setDanhSachMucTieu(JSON.parse(duLieuMucTieu));
  }, []);

  useEffect(() => {
    localStorage.setItem('ql_mon_hoc', JSON.stringify(danhSachMonHoc));
    localStorage.setItem('ql_tien_do', JSON.stringify(danhSachTienDo));
    localStorage.setItem('ql_muc_tieu', JSON.stringify(danhSachMucTieu));
  }, [danhSachMonHoc, danhSachTienDo, danhSachMucTieu]);

  const luuMonHoc = (values: any) => {
    if (selectedRecord) {
      setDanhSachMonHoc(danhSachMonHoc.map(m => m.id === selectedRecord.id ? { ...m, tenMon: values.tenMon } : m));
      message.success('Cập nhật môn học thành công');
    } else {
      const monHocMoi = { id: Date.now().toString(), tenMon: values.tenMon };
      setDanhSachMonHoc([...danhSachMonHoc, monHocMoi]);
      message.success('Thêm môn học thành công');
    }
    setIsModalMonHocOpen(false);
    setSelectedRecord(null);
  };

  const xoaMonHoc = (id: string) => {
    setDanhSachMonHoc(danhSachMonHoc.filter(m => m.id !== id));
    message.success('Đã xóa môn học');
  };

  const handleSuaTienDo = (record: TienDo) => {
    setSelectedRecord(record);
    setIsModalTienDoOpen(true);
    formTienDo.setFieldsValue({
      ...record,
      ngayGio: dayjs(record.ngayGio)
    });
  };

  const luuTienDo = (values: any) => {
    const duLieuSauChinhSua = {
      ...values,
      id: selectedRecord?.id || Date.now().toString(),
      ngayGio: values.ngayGio.format('YYYY-MM-DD HH:mm'),
    };

    if (selectedRecord) {
      setDanhSachTienDo(danhSachTienDo.map(t => t.id === selectedRecord.id ? duLieuSauChinhSua : t));
      message.success('Cập nhật tiến độ thành công');
    } else {
      setDanhSachTienDo([duLieuSauChinhSua, ...danhSachTienDo]);
      message.success('Ghi nhật ký thành công');
    }

    setIsModalTienDoOpen(false);
    setSelectedRecord(null);
    formTienDo.resetFields();
  };

  const capNhatMucTieu = (idMonHoc: string, gio: number) => {
    const tonTai = danhSachMucTieu.find(mt => mt.idMonHoc === idMonHoc);
    if (tonTai) {
      setDanhSachMucTieu(danhSachMucTieu.map(mt => mt.idMonHoc === idMonHoc ? { ...mt, thoiLuongMucTieu: gio } : mt));
    } else {
      setDanhSachMucTieu([...danhSachMucTieu, { idMonHoc, thoiLuongMucTieu: gio }]);
    }
  };

  const tinhTongThoiGianThangNay = (idMonHoc: string) => {
    const thangNay = dayjs().format('YYYY-MM');
    const tongPhut = danhSachTienDo
      .filter(t => t.idMonHoc === idMonHoc && t.ngayGio.startsWith(thangNay))
      .reduce((tong, hienTai) => tong + hienTai.thoiLuong, 0);
    return tongPhut / 60;
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title={<Title level={3} style={{ margin: 0 }}>Quản Lý Học Tập</Title>}
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span> Danh mục</span>} key="1">
            <Button 
              type="primary" icon={<PlusOutlined />} 
              onClick={() => { setSelectedRecord(null); setIsModalMonHocOpen(true); formMonHoc.resetFields(); }}
            >
              Thêm môn học
            </Button>
            <Table 
              dataSource={danhSachMonHoc} rowKey="id" style={{ marginTop: 16 }}
              columns={[
                { title: 'Tên môn học', dataIndex: 'tenMon', key: 'tenMon' },
                { 
                  title: 'Thao tác', 
                  key: 'action',
                  align: 'center', 
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="text" icon={<EditOutlined />} onClick={() => { setSelectedRecord(record); setIsModalMonHocOpen(true); formMonHoc.setFieldsValue(record); }} />
                      <Popconfirm title="Xóa môn này?" onConfirm={() => xoaMonHoc(record.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
          </TabPane>

          <TabPane tab={<span> Tiến độ</span>} key="2">
            <Button 
              type="primary" icon={<PlusOutlined />} 
              onClick={() => { setSelectedRecord(null); setIsModalTienDoOpen(true); formTienDo.resetFields(); }}
            >
              Ghi nhật ký học
            </Button>
            <Table 
              dataSource={danhSachTienDo} rowKey="id" style={{ marginTop: 16 }}
              columns={[
                { title: 'Ngày giờ', dataIndex: 'ngayGio', key: 'ngayGio' },
                { 
                  title: 'Môn học', dataIndex: 'idMonHoc', 
                  render: (id) => danhSachMonHoc.find(m => m.id === id)?.tenMon || 'N/A' 
                },
                { title: 'Thời lượng', dataIndex: 'thoiLuong', render: (val) => `${val} phút` },
                { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung', ellipsis: true },
                { 
                  title: 'Thao tác', 
                  align: 'center', 
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="text" icon={<EditOutlined />} onClick={() => handleSuaTienDo(record)} />
                      <Popconfirm title="Xóa bản ghi này?" onConfirm={() => setDanhSachTienDo(danhSachTienDo.filter(t => t.id !== record.id))}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
          </TabPane>

          <TabPane tab={<span> Mục tiêu tháng</span>} key="3">
            <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
              {danhSachMonHoc.map(mon => {
                const mucTieu = danhSachMucTieu.find(mt => mt.idMonHoc === mon.id)?.thoiLuongMucTieu || 0;
                const thucTe = tinhTongThoiGianThangNay(mon.id);
                const phanTram = mucTieu > 0 ? Math.min(Math.round((thucTe / mucTieu) * 100), 100) : 0;
                return (
                  <Col span={8} key={mon.id}>
                    <Card size="small" title={mon.tenMon}>
                      <Text type="secondary">Mục tiêu (giờ/tháng):</Text>
                      <InputNumber 
                        min={0} value={mucTieu} 
                        onChange={(val) => capNhatMucTieu(mon.id, val || 0)} 
                        style={{ width: '100%', marginBottom: 12 }}
                      />
                      <Progress percent={phanTram} />
                      <div style={{ marginTop: 8 }}>
                        {thucTe >= mucTieu && mucTieu > 0 ? <Tag color="green">Đạt mục tiêu</Tag> : <Tag color="orange">Đang học ({thucTe.toFixed(1)}h)</Tag>}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      <Modal 
        title={selectedRecord ? "Sửa môn học" : "Thêm môn học"} 
        visible={isModalMonHocOpen} 
        onCancel={() => setIsModalMonHocOpen(false)}
        onOk={() => formMonHoc.submit()}
      >
        <Form form={formMonHoc} onFinish={luuMonHoc} layout="vertical">
          <Form.Item name="tenMon" label="Tên môn học" rules={[{ required: true, message: 'Nhập tên môn' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title={selectedRecord ? "Sửa nhật ký học tập" : "Ghi nhật ký học tập"} 
        visible={isModalTienDoOpen} 
        onCancel={() => { setIsModalTienDoOpen(false); setSelectedRecord(null); }}
        onOk={() => formTienDo.submit()}
        width={600}
      >
        <Form form={formTienDo} onFinish={luuTienDo} layout="vertical">
          <Form.Item name="idMonHoc" label="Môn học" rules={[{ required: true }]}>
            <Select>
              {danhSachMonHoc.map(m => <Select.Option key={m.id} value={m.id}>{m.tenMon}</Select.Option>)}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ngayGio" label="Thời gian" rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="thoiLuong" label="Thời lượng (phút)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="noiDung" label="Nội dung bài học">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú thêm">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyHocTap;