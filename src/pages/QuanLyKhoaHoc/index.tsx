import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Popconfirm, message, Tag, Popover, Select, Form, Tooltip } from 'antd';
import { PlusCircleOutlined, SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { KhoaHoc, BoLoc, DANH_SACH_GIANG_VIEN, DANH_SACH_TRANG_THAI } from './types';
import ModalKhoaHoc from './components/ModalKhoaHoc';
import './QuanLyKhoaHoc.css';

const { Option } = Select;

const QuanLyKhoaHoc: React.FC = () => {
  const [danhSachKhoaHoc, setDanhSachKhoaHoc] = useState<KhoaHoc[]>([]);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState<string>('');
  const [boLoc, setBoLoc] = useState<BoLoc>({});
  
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [khoaHocDangSua, setKhoaHocDangSua] = useState<KhoaHoc | null>(null);

  // Khởi tạo và Lưu localstorage
  useEffect(() => {
    const duLieuLuuTru = localStorage.getItem('ql_khoa_hoc_data');
    if (duLieuLuuTru) {
      setDanhSachKhoaHoc(JSON.parse(duLieuLuuTru));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ql_khoa_hoc_data', JSON.stringify(danhSachKhoaHoc));
  }, [danhSachKhoaHoc]);

  // Xử lý xóa
  const xuLyXoaKhoaHoc = (khoaHoc: KhoaHoc) => {
    if (khoaHoc.soLuongHocVien > 0) {
      message.error('Chỉ được xóa khóa học chưa có học viên!');
      return;
    }
    const danhSachMoi = danhSachKhoaHoc.filter((kh) => kh.idKhoaHoc !== khoaHoc.idKhoaHoc);
    setDanhSachKhoaHoc(danhSachMoi);
    message.success('Đã xóa khóa học thành công!');
  };

  // Xử lý lưu, thêm, sửa
  const xuLyLuuKhoaHoc = (khoaHocLuu: KhoaHoc) => {
    if (khoaHocDangSua) {
      const danhSachMoi = danhSachKhoaHoc.map((kh) => kh.idKhoaHoc === khoaHocLuu.idKhoaHoc ? khoaHocLuu : kh);
      setDanhSachKhoaHoc(danhSachMoi);
      message.success('Cập nhật khóa học thành công!');
    } else {
      setDanhSachKhoaHoc([khoaHocLuu, ...danhSachKhoaHoc]);
      message.success('Thêm mới khóa học thành công!');
    }
    setIsModalVisible(false);
  };

  // Tìm kiếm và lọc
  const danhSachHienThi = danhSachKhoaHoc.filter((kh) => {
    const khopTuKhoa = kh.tenKhoaHoc.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
    const khopGiangVien = boLoc.giangVien ? kh.giangVien === boLoc.giangVien : true;
    const khopTrangThai = boLoc.trangThai ? kh.trangThai === boLoc.trangThai : true;
    return khopTuKhoa && khopGiangVien && khopTrangThai;
  });

  // Bộ lọc
  const noiDungBoLoc = (
    <Form layout="vertical" style={{ width: 250 }}>
      <Form.Item label="Giảng viên">
        <Select allowClear placeholder="Chọn giảng viên" onChange={(val) => setBoLoc({ ...boLoc, giangVien: val })}>
          {DANH_SACH_GIANG_VIEN.map((gv) => <Option key={gv} value={gv}>{gv}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item label="Trạng thái">
        <Select allowClear placeholder="Chọn trạng thái" onChange={(val) => setBoLoc({ ...boLoc, trangThai: val })}>
          {DANH_SACH_TRANG_THAI.map((tt) => <Option key={tt} value={tt}>{tt}</Option>)}
        </Select>
      </Form.Item>
    </Form>
  );

  return (
    <Card style={{ margin: 24, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Popover content={noiDungBoLoc} title="Bộ lọc khóa học" trigger="click" placement="bottomLeft">
            <Tooltip title="Lọc dữ liệu">
              <Button icon={<FilterOutlined />} />
            </Tooltip>
          </Popover>
          
          <Input 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Tìm kiếm theo Tên khóa học" 
            style={{ width: 300 }}
            allowClear
            onChange={(e) => setTuKhoaTimKiem(e.target.value)}
          />
          
          <span style={{ marginLeft: 8 }}>
            Tổng số: <strong style={{ color: 'red' }}>{danhSachHienThi.length}</strong>
          </span>
        </Space>

        <Button 
            className="nut-them-moi-do" 
            icon={<PlusCircleOutlined />} 
            size="large"
            onClick={() => { 
                setKhoaHocDangSua(null); 
                setIsModalVisible(true); 
            }}
        >
          THÊM MỚI
        </Button>
      </div>

      <Table
        dataSource={danhSachHienThi}
        rowKey="idKhoaHoc"
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
        columns={[
          { title: 'ID Khóa học', dataIndex: 'idKhoaHoc', width: 120 },
          { title: 'Tên khóa học', dataIndex: 'tenKhoaHoc' },
          { title: 'Giảng viên', dataIndex: 'giangVien' },
          { 
            title: 'Số lượng học viên', 
            dataIndex: 'soLuongHocVien', 
            align: 'center',
            sorter: (a, b) => a.soLuongHocVien - b.soLuongHocVien 
          },
          { 
            title: 'Trạng thái', 
            dataIndex: 'trangThai',
            align: 'center',
            render: (tt) => (
              <Tag color={tt === 'Đang mở' ? 'green' : tt === 'Tạm dừng' ? 'orange' : 'red'}>
                {tt}
              </Tag>
            )
          },
          {
            title: 'Thao tác',
            align: 'center',
            width: 120,
            render: (_, record) => (
              <Space>
                <Tooltip title="Chỉnh sửa">
                  <Button 
                    type="text" 
                    icon={<EditOutlined style={{ color: '#1890ff' }} />} 
                    onClick={() => { setKhoaHocDangSua(record); setIsModalVisible(true); }}
                  />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa Khóa học này?"
                    onConfirm={() => xuLyXoaKhoaHoc(record)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                    disabled={record.soLuongHocVien > 0} 
                  >
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      disabled={record.soLuongHocVien > 0} 
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            )
          }
        ]}
      />

      <ModalKhoaHoc 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={xuLyLuuKhoaHoc}
        khoaHocDangSua={khoaHocDangSua}
        danhSachKhoaHoc={danhSachKhoaHoc}
      />
    </Card>
  );
};

export default QuanLyKhoaHoc;