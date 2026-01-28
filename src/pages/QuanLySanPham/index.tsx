import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, Button, Input, Modal, Form, InputNumber, message, 
  Popconfirm, Space, Tag, Tabs, Select, Card, Statistic, 
  DatePicker, Row, Col, Badge 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, DeleteOutlined, 
  EditOutlined, EyeOutlined, ShoppingCartOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const sanPhamMau = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const donHangMau = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15'
  }
];

const QuanLyCuaHang: React.FC = () => {
  const [danhSachSanPham, setDanhSachSanPham] = useState(() => {
    const saved = localStorage.getItem('danhSachSanPham');
    return saved ? JSON.parse(saved) : sanPhamMau;
  });

  const [danhSachDonHang, setDanhSachDonHang] = useState(() => {
    const saved = localStorage.getItem('danhSachDonHang');
    return saved ? JSON.parse(saved) : donHangMau;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [tuKhoaSP, setTuKhoaSP] = useState('');
  const [locDanhMuc, setLocDanhMuc] = useState<string | null>(null);
  const [locTrangThaiSP, setLocTrangThaiSP] = useState<string | null>(null); 
  const [modalSP, setModalSP] = useState(false);
  const [spDangSua, setSpDangSua] = useState<any>(null);

  const [tuKhoaDH, setTuKhoaDH] = useState('');
  const [locTrangThaiDH, setLocTrangThaiDH] = useState<string | null>(null);
  const [modalDH, setModalDH] = useState(false);
  const [chiTietDH, setChiTietDH] = useState<any>(null); 
  const [modalChiTiet, setModalChiTiet] = useState(false);

  const [formSP] = Form.useForm();
  const [formDH] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('danhSachSanPham', JSON.stringify(danhSachSanPham));
  }, [danhSachSanPham]);

  useEffect(() => {
    localStorage.setItem('danhSachDonHang', JSON.stringify(danhSachDonHang));
  }, [danhSachDonHang]);

  const getTrangThaiSP = (qty: number) => {
    if (qty === 0) return { label: 'Hết hàng', color: 'red', value: 'out' };
    if (qty <= 10) return { label: 'Sắp hết', color: 'orange', value: 'low' };
    return { label: 'Còn hàng', color: 'green', value: 'stock' };
  };

  const duLieuSPHienThi = useMemo(() => {
    return danhSachSanPham.filter((sp: any) => {
      const matchName = sp.name.toLowerCase().includes(tuKhoaSP.toLowerCase());
      const matchCat = locDanhMuc ? sp.category === locDanhMuc : true;
      
      let matchStatus = true;
      if (locTrangThaiSP) {
        const status = getTrangThaiSP(sp.quantity).value;
        matchStatus = status === locTrangThaiSP;
      }

      return matchName && matchCat && matchStatus;
    });
  }, [danhSachSanPham, tuKhoaSP, locDanhMuc, locTrangThaiSP]);

  const xuLyLuuSP = (values: any) => {
    if (spDangSua) {
      const danhSachMoi = danhSachSanPham.map((sp: any) => 
        sp.id === spDangSua.id ? { ...sp, ...values } : sp
      );
      setDanhSachSanPham(danhSachMoi);
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      const sanPhamMoi = { id: Date.now(), ...values };
      setDanhSachSanPham([...danhSachSanPham, sanPhamMoi]);
      message.success('Thêm sản phẩm mới thành công!');
    }
    setModalSP(false);
    formSP.resetFields();
    setSpDangSua(null);
  };

  const xuLyXoaSP = (id: number) => {
    setDanhSachSanPham(danhSachSanPham.filter((sp: any) => sp.id !== id));
    message.success('Đã xóa sản phẩm');
  };

  const duLieuDHHienThi = useMemo(() => {
    return danhSachDonHang.filter((dh: any) => {
      const matchText = dh.customerName.toLowerCase().includes(tuKhoaDH.toLowerCase()) || 
                        dh.id.toLowerCase().includes(tuKhoaDH.toLowerCase());
      const matchStatus = locTrangThaiDH ? dh.status === locTrangThaiDH : true;
      return matchText && matchStatus;
    });
  }, [danhSachDonHang, tuKhoaDH, locTrangThaiDH]);

  const xuLyTaoDonHang = (values: any) => {
    const chiTietDonHang = values.products.map((item: any) => {
      const spKho = danhSachSanPham.find((s: any) => s.id === item.productId);
      return {
        productId: item.productId,
        productName: spKho?.name,
        price: spKho?.price,
        quantity: item.quantity
      };
    });

    for (let item of chiTietDonHang) {
      const spKho = danhSachSanPham.find((s: any) => s.id === item.productId);
      if (item.quantity > spKho.quantity) {
        message.error(`Sản phẩm ${spKho.name} chỉ còn ${spKho.quantity}!`);
        return;
      }
    }

    const tongTien = chiTietDonHang.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const donHangMoi = {
      id: `DH${Date.now()}`, 
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: chiTietDonHang,
      totalAmount: tongTien,
      status: 'Chờ xử lý', 
      createdAt: dayjs().format('YYYY-MM-DD')
    };

    setDanhSachDonHang([donHangMoi, ...danhSachDonHang]);
    setModalDH(false);
    formDH.resetFields();
    message.success('Tạo đơn hàng thành công!');
  };

  const capNhatTrangThaiDH = (maDonHang: string, trangThaiMoi: string) => {
    const donHangCu = danhSachDonHang.find((dh: any) => dh.id === maDonHang);
    if (!donHangCu) return;

    const trangThaiCu = donHangCu.status;
    
    let danhSachSPMoi = [...danhSachSanPham];
    
    if (trangThaiMoi === 'Hoàn thành' && trangThaiCu !== 'Hoàn thành') {
      donHangCu.products.forEach((item: any) => {
        const index = danhSachSPMoi.findIndex(sp => sp.id === item.productId);
        if (index > -1) {
          danhSachSPMoi[index].quantity -= item.quantity;
        }
      });
    } 
    else if (trangThaiCu === 'Hoàn thành' && trangThaiMoi === 'Đã hủy') {
      donHangCu.products.forEach((item: any) => {
        const index = danhSachSPMoi.findIndex(sp => sp.id === item.productId);
        if (index > -1) {
          danhSachSPMoi[index].quantity += item.quantity;
        }
      });
    }

    setDanhSachSanPham(danhSachSPMoi);
    
    const danhSachDHMoi = danhSachDonHang.map((dh: any) => 
      dh.id === maDonHang ? { ...dh, status: trangThaiMoi } : dh
    );
    setDanhSachDonHang(danhSachDHMoi);
    message.success(`Đã cập nhật trạng thái đơn ${maDonHang}`);
  };
  
  const cotSanPham = [
    { title: 'STT', key: 'stt', render: (_:any, __:any, i:number) => i + 1, width: 50 },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', sorter: (a:any, b:any) => a.name.localeCompare(b.name) }, // [cite: 53]
    { title: 'Danh mục', dataIndex: 'category', key: 'category', 
      filters: Array.from(new Set(danhSachSanPham.map((s:any) => s.category))).map(c => ({ text: c, value: c })),
      onFilter: (value: any, record: any) => record.category === value, // [cite: 37]
    },
    { title: 'Giá', dataIndex: 'price', key: 'price', sorter: (a:any, b:any) => a.price - b.price,
      render: (val: number) => val.toLocaleString('vi-VN') + ' đ' },
    { title: 'Kho', dataIndex: 'quantity', key: 'quantity', sorter: (a:any, b:any) => a.quantity - b.quantity },
    { title: 'Trạng thái', key: 'status', 
      render: (_:any, record:any) => {
        const { label, color } = getTrangThaiSP(record.quantity);
        return <Tag color={color}>{label}</Tag>; // [cite: 14]
      }
    },
    { title: 'Thao tác', key: 'action', render: (_:any, record:any) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => {
          setSpDangSua(record);
          formSP.setFieldsValue(record);
          setModalSP(true);
        }} />
        <Popconfirm title="Xóa?" onConfirm={() => xuLyXoaSP(record.id)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )}
  ];

  const cotDonHang = [
    { title: 'Mã ĐH', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', sorter: (a:any, b:any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix() },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', sorter: (a:any, b:any) => a.totalAmount - b.totalAmount,
      render: (val: number) => <b style={{color: 'red'}}>{val.toLocaleString('vi-VN')} đ</b> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status: string, record: any) => (
        <Select 
          value={status} 
          style={{ width: 120 }} 
          onChange={(val) => capNhatTrangThaiDH(record.id, val)} 
        >
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành" disabled={status === 'Đã hủy'}>Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy" disabled={status === 'Hoàn thành'}>Đã hủy</Select.Option>
        </Select>
      )
    },
    { title: 'Thao tác', key: 'action', render: (_:any, record:any) => (
      <Button icon={<EyeOutlined />} onClick={() => {
        setChiTietDH(record);
        setModalChiTiet(true);
      }}>Chi tiết</Button> 
    )}
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card title="HỆ THỐNG QUẢN LÝ CỬA HÀNG" bordered={false}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Thống kê Tổng quan" key="dashboard">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="Tổng sản phẩm" value={danhSachSanPham.length} prefix={<Badge status="processing" />} />
              </Col>
              <Col span={6}>
                <Statistic title="Tổng giá trị tồn kho" value={danhSachSanPham.reduce((sum:number, sp:any) => sum + (sp.price * sp.quantity), 0)} suffix="đ" /> 
              </Col>
              <Col span={6}>
                <Statistic title="Tổng đơn hàng" value={danhSachDonHang.length} prefix={<ShoppingCartOutlined />} />
              </Col>
              <Col span={6}>
                <Statistic title="Doanh thu thực tế" valueStyle={{ color: '#3f8600' }}
                  value={danhSachDonHang.filter((dh:any) => dh.status === 'Hoàn thành').reduce((sum:number, dh:any) => sum + dh.totalAmount, 0)} suffix="đ" 
                />
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Quản lý Sản phẩm" key="products">
            <Space style={{ marginBottom: 16 }}>
              <Input placeholder="Tìm tên sản phẩm" prefix={<SearchOutlined />} onChange={e => setTuKhoaSP(e.target.value)} />
              <Select placeholder="Lọc danh mục" allowClear style={{ width: 150 }} onChange={setLocDanhMuc}>
                {Array.from(new Set(danhSachSanPham.map((s:any) => s.category))).map((c:any) => <Select.Option key={c} value={c}>{c}</Select.Option>)}
              </Select>
              <Select placeholder="Trạng thái kho" allowClear style={{ width: 150 }} onChange={setLocTrangThaiSP}>
                <Select.Option value="stock">Còn hàng</Select.Option>
                <Select.Option value="low">Sắp hết</Select.Option>
                <Select.Option value="out">Hết hàng</Select.Option>
              </Select>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalSP(true)}>Thêm mới</Button>
            </Space>
            <Table dataSource={duLieuSPHienThi} columns={cotSanPham as any} rowKey="id" pagination={{ pageSize: 5 }} /> 
          </Tabs.TabPane>

          <Tabs.TabPane tab="Quản lý Đơn hàng" key="orders">
            <Space style={{ marginBottom: 16 }}>
              <Input placeholder="Tìm khách hàng / Mã ĐH" prefix={<SearchOutlined />} onChange={e => setTuKhoaDH(e.target.value)} />
              <Select placeholder="Trạng thái" allowClear style={{ width: 150 }} onChange={setLocTrangThaiDH}>
                <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
                <Select.Option value="Đang giao">Đang giao</Select.Option>
                <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                <Select.Option value="Đã hủy">Đã hủy</Select.Option>
              </Select>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalDH(true)}>Tạo đơn hàng</Button>
            </Space>
            <Table dataSource={duLieuDHHienThi} columns={cotDonHang} rowKey="id" />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal title={spDangSua ? "Sửa sản phẩm" : "Thêm sản phẩm"} visible={modalSP} onCancel={() => setModalSP(false)} onOk={() => formSP.submit()}>
        <Form form={formSP} layout="vertical" onFinish={xuLyLuuSP}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
             <Select>
               <Select.Option value="Laptop">Laptop</Select.Option>
               <Select.Option value="Điện thoại">Điện thoại</Select.Option>
               <Select.Option value="Máy tính bảng">Máy tính bảng</Select.Option>
               <Select.Option value="Phụ kiện">Phụ kiện</Select.Option>
             </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Tạo đơn hàng mới" visible={modalDH} onCancel={() => setModalDH(false)} onOk={() => formDH.submit()} width={700}>
        <Form form={formDH} layout="vertical" onFinish={xuLyTaoDonHang}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, pattern: /^\d{10,11}$/, message: 'SĐT không hợp lệ' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.List name="products" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'productId']}
                      rules={[{ required: true, message: 'Chọn SP' }]}
                      style={{ width: 300 }}
                    >
                      <Select placeholder="Chọn sản phẩm" showSearch optionFilterProp="label">
                         {danhSachSanPham.map((sp:any) => (
                           <Select.Option key={sp.id} value={sp.id} label={sp.name} disabled={sp.quantity <= 0}>
                             {sp.name} (Kho: {sp.quantity}) - {sp.price.toLocaleString()}đ
                           </Select.Option>
                         ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Nhập SL' }]}
                    >
                      <InputNumber min={1} placeholder="SL" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm sản phẩm vào đơn
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal title="Chi tiết đơn hàng" visible={modalChiTiet} onCancel={() => setModalChiTiet(false)} footer={null}>
        {chiTietDH && (
          <div>
            <p><b>Mã ĐH:</b> {chiTietDH.id}</p>
            <p><b>Khách hàng:</b> {chiTietDH.customerName} - {chiTietDH.phone}</p>
            <p><b>Địa chỉ:</b> {chiTietDH.address}</p>
            <Table 
              dataSource={chiTietDH.products} 
              pagination={false}
              rowKey="productId"
              columns={[
                { title: 'Sản phẩm', dataIndex: 'productName' },
                { title: 'SL', dataIndex: 'quantity' },
                { title: 'Đơn giá', dataIndex: 'price', render: (val:number) => val.toLocaleString() },
                { title: 'Thành tiền', render: (_:any, r:any) => (r.price * r.quantity).toLocaleString() }
              ]}
              summary={(pageData) => {
                const total = pageData.reduce((sum, current) => sum + (current.price * current.quantity), 0);
                return <Table.Summary.Row><Table.Summary.Cell index={0} colSpan={3}><b>Tổng cộng</b></Table.Summary.Cell><Table.Summary.Cell index={1}><b>{total.toLocaleString()} đ</b></Table.Summary.Cell></Table.Summary.Row>
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const MinusCircleOutlined = (props: any) => <span {...props} style={{cursor: 'pointer', color: 'red'}}><DeleteOutlined /></span>;

export default QuanLyCuaHang;