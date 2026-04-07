import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, Row, Col, message, List} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { DiemDen, LichTrinh } from './types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const LapKeHoach: React.FC = () => {
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
  const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<LichTrinh[]>([]);
  const [formLapLich] = Form.useForm();

  useEffect(() => {
    const dlDiemDen = localStorage.getItem('dl_diem_den');
    const dlLichTrinh = localStorage.getItem('dl_lich_trinh');
    if (dlDiemDen) setDanhSachDiemDen(JSON.parse(dlDiemDen));
    if (dlLichTrinh) setDanhSachLichTrinh(JSON.parse(dlLichTrinh));
  }, []);

  const luuLichTrinh = (values: any) => {
    const lichMoi: LichTrinh = {
      id: `LT${Date.now()}`,
      tenLichTrinh: values.tenLichTrinh,
      nganSachDuKien: values.nganSachDuKien,
      thangTao: dayjs().format('YYYY-MM'),
      chiTietNgay: values.chiTietNgay || []
    };
    
    const danhSachMoi = [lichMoi, ...danhSachLichTrinh];
    setDanhSachLichTrinh(danhSachMoi);
    localStorage.setItem('dl_lich_trinh', JSON.stringify(danhSachMoi));
    formLapLich.resetFields();
    message.success('Tạo lịch trình thành công!');
  };

  const xoaLichTrinh = (id: string) => {
    const ds = danhSachLichTrinh.filter(l => l.id !== id);
    setDanhSachLichTrinh(ds);
    localStorage.setItem('dl_lich_trinh', JSON.stringify(ds));
    message.success('Đã xóa lịch trình');
  };

  return (
    <Row gutter={24}>
      <Col xs={24} lg={12}>
        <Title level={3}>Tạo Lịch Trình Mới</Title>
        <Card>
          <Form form={formLapLich} layout="vertical" onFinish={luuLichTrinh}>
            <Form.Item name="tenLichTrinh" label="Tên lịch trình" rules={[{ required: true }]}>
              <Input placeholder="VD: Du lịch Phú Quốc 3N2Đ" />
            </Form.Item>
            <Form.Item name="nganSachDuKien" label="Ngân sách dự kiến (VND)" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            
            <Form.List name="chiTietNgay">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card size="small" title={`Ngày thứ ${index + 1}`} key={key} style={{ marginBottom: 16 }} extra={<DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}>
                      <Form.Item {...restField} name={[name, 'ngayThu']} initialValue={index + 1} hidden><Input /></Form.Item>
                      <Form.Item {...restField} name={[name, 'danhSachDiemDenId']} label="Chọn điểm đến" rules={[{ required: true }]}>
                        <Select mode="multiple" placeholder="Chọn các điểm tham quan">
                          {danhSachDiemDen.map(d => <Option key={d.id} value={d.id}>{d.tenDiemDen}</Option>)}
                        </Select>
                      </Form.Item>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm ngày</Button>
                </>
              )}
            </Form.List>
            <Button type="primary" htmlType="submit" style={{ marginTop: 16 }} block>Lưu Lịch Trình</Button>
          </Form>
        </Card>
      </Col>
      
      <Col xs={24} lg={12}>
        <Title level={3}>Lịch Trình Đã Tạo</Title>
        <List
          itemLayout="vertical"
          dataSource={danhSachLichTrinh}
          renderItem={lich => (
            <Card style={{ marginBottom: 16 }} title={lich.tenLichTrinh} extra={<Button type="text" danger icon={<DeleteOutlined />} onClick={() => xoaLichTrinh(lich.id)} />}>
              <Text strong>Ngân sách: </Text> <Text type="success">{Number(lich.nganSachDuKien).toLocaleString()} đ</Text>
              <List
                size="small"
                dataSource={lich.chiTietNgay}
                renderItem={ngay => (
                  <List.Item>
                    <Text strong>Ngày {ngay.ngayThu}:</Text> {ngay.danhSachDiemDenId.map(id => danhSachDiemDen.find(d => d.id === id)?.tenDiemDen).join(' ➡ ')}
                  </List.Item>
                )}
              />
            </Card>
          )}
        />
      </Col>
    </Row>
  );
};

export default LapKeHoach;