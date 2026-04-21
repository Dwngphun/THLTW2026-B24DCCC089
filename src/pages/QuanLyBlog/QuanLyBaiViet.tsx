import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Select, Tag, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { layDuLieu, luuDuLieu, KHOA_BAI_VIET, KHOA_THE_TAG } from '../../utils/localStorage';

const { Option } = Select;

interface BaiViet {
  id: string;
  tieuDe: string;
  slug: string;
  anhDaiDien?: string;
  danhSachThe: string[];
  trangThai: string;
  noiDung: string;
  tomTat: string;
  tacGia: string;
  ngayTao: string;
  luotXem: number;
}

interface TheTag {
  id: string;
  tenThe: string;
}

const QuanLyBaiViet: React.FC = () => {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<BaiViet[]>([]);
  const [danhSachTheTag, setDanhSachTheTag] = useState<TheTag[]>([]);
  const [hienThiModal, setHienThiModal] = useState<boolean>(false);
  const [baiVietDangSua, setBaiVietDangSua] = useState<BaiViet | null>(null);
  const [form] = Form.useForm();
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [locTrangThai, setLocTrangThai] = useState<string>('');

  useEffect(() => {
    setDanhSachBaiViet(layDuLieu<BaiViet>(KHOA_BAI_VIET));
    setDanhSachTheTag(layDuLieu<TheTag>(KHOA_THE_TAG));
  }, []);

  const moModalThemMoi = () => {
    setBaiVietDangSua(null);
    form.resetFields();
    setHienThiModal(true);
  };

  const moModalSua = (baiViet: BaiViet) => {
    setBaiVietDangSua(baiViet);
    form.setFieldsValue(baiViet);
    setHienThiModal(true);
  };

  const xuLyXoa = (id: string) => {
    const danhSachMoi = danhSachBaiViet.filter((bv) => bv.id !== id);
    setDanhSachBaiViet(danhSachMoi);
    luuDuLieu(KHOA_BAI_VIET, danhSachMoi);
    message.success('Xóa bài viết thành công');
  };

  const xuLyLuuBaiViet = (giaTriForm: any) => {
    let danhSachMoi = [...danhSachBaiViet];
    if (baiVietDangSua) {
      danhSachMoi = danhSachMoi.map((bv) => 
        bv.id === baiVietDangSua.id ? { ...bv, ...giaTriForm, tomTat: giaTriForm.noiDung.substring(0, 100) + '...' } : bv
      );
      message.success('Cập nhật thành công');
    } else {
      const baiVietMoi: BaiViet = {
        ...giaTriForm,
        id: Date.now().toString(),
        luotXem: 0,
        ngayTao: new Date().toLocaleDateString('vi-VN'),
        tacGia: 'Admin',
        tomTat: giaTriForm.noiDung.substring(0, 100) + '...'
      };
      danhSachMoi.unshift(baiVietMoi);
      message.success('Thêm mới thành công');
    }
    setDanhSachBaiViet(danhSachMoi);
    luuDuLieu(KHOA_BAI_VIET, danhSachMoi);
    setHienThiModal(false);
  };

  const cotBang: ColumnsType<BaiViet> = [
    { title: 'TT', key: 'stt', align: 'center', width: 60, render: (_, __, index) => index + 1 },
    { title: 'Tiêu đề', dataIndex: 'tieuDe', key: 'tieuDe', align: 'center' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      key: 'trangThai',
      align: 'center',
      render: (trangThai: string) => <Tag color={trangThai === 'daDang' ? 'green' : 'orange'}>{trangThai === 'daDang' ? 'Đã đăng' : 'Nháp'}</Tag>
    },
    { 
      title: 'Thẻ (Tags)', 
      dataIndex: 'danhSachThe', 
      key: 'danhSachThe',
      align: 'center',
      render: (thes: string[]) => thes.map((t) => <Tag key={t}>{t}</Tag>)
    },
    { title: 'Lượt xem', dataIndex: 'luotXem', key: 'luotXem', align: 'center' },
    { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', align: 'center' },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      align: 'center',
      render: (_, banGhi) => (
        <Space size="middle">
          <Tooltip title="Sửa bài viết">
            <Button type="text" style={{ color: '#1890ff' }} icon={<EditOutlined />} onClick={() => moModalSua(banGhi)} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc chắn muốn xóa bài viết này không?" onConfirm={() => xuLyXoa(banGhi.id)}>
            <Tooltip title="Xóa bài viết">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const danhSachHienThi = danhSachBaiViet.filter((bv) => {
    return bv.tieuDe.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) &&
           (locTrangThai ? bv.trangThai === locTrangThai : true);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input.Search placeholder="Tìm theo tiêu đề" onSearch={setTuKhoaTimKiem} style={{ width: 250 }} />
          <Select placeholder="Lọc trạng thái" allowClear style={{ width: 150 }} onChange={setLocTrangThai}>
            <Option value="daDang">Đã đăng</Option>
            <Option value="nhap">Bản nháp</Option>
          </Select>
        </Space>
        <Button type="primary" onClick={moModalThemMoi}>Thêm mới bài viết</Button>
      </div>

      <Table columns={cotBang} dataSource={danhSachHienThi} rowKey="id" bordered />

      <Modal
        title={baiVietDangSua ? "Sửa bài viết" : "Thêm bài viết mới"}
        visible={hienThiModal}
        onCancel={() => setHienThiModal(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={xuLyLuuBaiViet}>
          <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="anhDaiDien" label="Ảnh đại diện (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="danhSachThe" label="Thẻ (Tags)" rules={[
            { required: true, message: 'Chọn ít nhất 1 thẻ!' },
            { type: 'array', max: 3, message: 'Chọn tối đa 3 thẻ!' }
          ]}>
            <Select mode="multiple" placeholder="Chọn thẻ">
              {danhSachTheTag.map((the) => <Option key={the.id} value={the.tenThe}>{the.tenThe}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Select>
              <Option value="daDang">Đã đăng</Option>
              <Option value="nhap">Lưu nháp</Option>
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung (Markdown)" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Lưu Bài Viết</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyBaiViet;