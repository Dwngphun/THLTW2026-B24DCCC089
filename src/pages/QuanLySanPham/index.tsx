import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, InputNumber, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';

const duLieuGoc = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const QuanLySanPham: React.FC = () => {
  const [danhSachSanPham, setDanhSachSanPham] = useState(duLieuGoc); 
  const [duLieuHienThi, setDuLieuHienThi] = useState(duLieuGoc);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [form] = Form.useForm();

  const xuLyTimKiem = (giaTri: string) => {
    const ketQua = danhSachSanPham.filter((sp) =>
      sp.name.toLowerCase().includes(giaTri.toLowerCase())
    );
    setDuLieuHienThi(ketQua);
  };

  const xuLyXoa = (id: number) => {
    const danhSachMoi = danhSachSanPham.filter((sp) => sp.id !== id);
    setDanhSachSanPham(danhSachMoi);
    setDuLieuHienThi(danhSachMoi);
    message.success('Xóa sản phẩm thành công!'); 
  };

  const xuLyThem = (values: any) => {
    const sanPhamMoi = {
      id: Date.now(), 
      ...values,
    };
    const danhSachMoi = [...danhSachSanPham, sanPhamMoi];
    setDanhSachSanPham(danhSachMoi);
    setDuLieuHienThi(danhSachMoi);
    setHienThiForm(false);
    form.resetFields();
    message.success('Thêm sản phẩm mới thành công!'); 
  };

  const cacCot = [
    { 
      title: 'STT',
      dataIndex: 'id', 
    },
    { 
      title: 'Tên sản phẩm', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Giá sản phẩm', 
      dataIndex: 'price', 
      key: 'price', 
    },
    { 
      title: 'Số lượng sản phẩm', 
      dataIndex: 'quantity', 
      key: 'quantity' 
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => xuLyXoa(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Quản lý Sản phẩm</h2>
      
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Tìm theo tên sản phẩm..."
          allowClear
          enterButton={<SearchOutlined />}
          onChange={(e) => xuLyTimKiem(e.target.value)}
          style={{ width: 350 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiForm(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table 
        dataSource={duLieuHienThi} 
        columns={cacCot} 
        rowKey="id" 
        bordered 
      />

      <Modal
        title="Thêm sản phẩm mới"
        visible={hienThiForm}
        onCancel={() => setHienThiForm(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={xuLyThem}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Ví dụ: iPhone 15" />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: 'Vui lòng nhập giá!' },
              { type: 'number', min: 1, message: 'Giá phải là số dương!' } 
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="25000000" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' } 
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="10" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLySanPham;