import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { layDuLieu, luuDuLieu, KHOA_THE_TAG, KHOA_BAI_VIET } from '../../utils/localStorage';

interface TheTag {
  id: string;
  tenThe: string;
}

interface BaiViet {
  id: string;
  danhSachThe: string[];
}

const QuanLyThe: React.FC = () => {
  const [danhSachTheTag, setDanhSachTheTag] = useState<TheTag[]>([]);
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<BaiViet[]>([]);
  const [hienThiModal, setHienThiModal] = useState<boolean>(false);
  const [theDangSua, setTheDangSua] = useState<TheTag | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setDanhSachTheTag(layDuLieu<TheTag>(KHOA_THE_TAG));
    setDanhSachBaiViet(layDuLieu<BaiViet>(KHOA_BAI_VIET));
  }, []);

  const demSoBaiViet = (tenThe: string) => {
    return danhSachBaiViet.filter((bv) => bv.danhSachThe && bv.danhSachThe.includes(tenThe)).length;
  };

  const xuLyLuuThe = (giaTri: { tenThe: string }) => {
    let danhSachMoi = [...danhSachTheTag];
    if (theDangSua) {
      danhSachMoi = danhSachMoi.map((the) => the.id === theDangSua.id ? { ...the, tenThe: giaTri.tenThe } : the);
      
      const tenTheCu = theDangSua.tenThe;
      const baiVietCapNhat = danhSachBaiViet.map((bv) => {
        if(bv.danhSachThe && bv.danhSachThe.includes(tenTheCu)) {
          return {...bv, danhSachThe: bv.danhSachThe.map((t) => t === tenTheCu ? giaTri.tenThe : t)}
        }
        return bv;
      });
      luuDuLieu(KHOA_BAI_VIET, baiVietCapNhat);
      setDanhSachBaiViet(baiVietCapNhat);
      
      message.success('Cập nhật thẻ thành công');
    } else {
      danhSachMoi.push({ id: Date.now().toString(), tenThe: giaTri.tenThe });
      message.success('Thêm thẻ thành công');
    }
    setDanhSachTheTag(danhSachMoi);
    luuDuLieu(KHOA_THE_TAG, danhSachMoi);
    setHienThiModal(false);
  };

  const xuLyXoa = (id: string, tenThe: string) => {
    if(demSoBaiViet(tenThe) > 0) {
      message.error('Không thể xóa thẻ đang được sử dụng trong bài viết!');
      return;
    }
    const danhSachMoi = danhSachTheTag.filter((t) => t.id !== id);
    setDanhSachTheTag(danhSachMoi);
    luuDuLieu(KHOA_THE_TAG, danhSachMoi);
    message.success('Xóa thẻ thành công');
  };

  const cotBang: ColumnsType<TheTag> = [
    { title: 'TT', key: 'stt', align: 'center', width: 60, render: (_, __, index) => index + 1 },
    { title: 'Tên thẻ', dataIndex: 'tenThe', key: 'tenThe', align: 'center' },
    { 
      title: 'Số bài viết đang dùng', 
      key: 'soBaiViet',
      align: 'center',
      render: (_, banGhi) => <>{demSoBaiViet(banGhi.tenThe)} bài viết</>
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      align: 'center',
      render: (_, banGhi) => (
        <Space size="middle">
          <Tooltip title="Sửa thẻ">
            <Button type="text" style={{ color: '#1890ff' }} icon={<EditOutlined />} onClick={() => { setTheDangSua(banGhi); form.setFieldsValue(banGhi); setHienThiModal(true); }} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc chắn muốn xóa thẻ này?" onConfirm={() => xuLyXoa(banGhi.id, banGhi.tenThe)}>
            <Tooltip title="Xóa thẻ">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" onClick={() => { setTheDangSua(null); form.resetFields(); setHienThiModal(true); }}>Thêm thẻ mới</Button>
      </div>
      
      <Table columns={cotBang} dataSource={danhSachTheTag} rowKey="id" bordered />

      <Modal
        title={theDangSua ? "Sửa thẻ" : "Thêm thẻ mới"}
        visible={hienThiModal}
        onCancel={() => setHienThiModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={xuLyLuuThe}>
          <Form.Item name="tenThe" label="Tên Thẻ" rules={[{ required: true, message: 'Vui lòng nhập tên thẻ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu Thẻ</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThe;