import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { KhoaHoc, DANH_SACH_GIANG_VIEN, DANH_SACH_TRANG_THAI } from '../types';

const { Option } = Select;

interface ModalKhoaHocProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (khoaHoc: KhoaHoc) => void;
  khoaHocDangSua: KhoaHoc | null;
  danhSachKhoaHoc: KhoaHoc[];
}

const ModalKhoaHoc: React.FC<ModalKhoaHocProps> = ({ isVisible, onClose, onSave, khoaHocDangSua, danhSachKhoaHoc }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isVisible) {
      if (khoaHocDangSua) {
        form.setFieldsValue(khoaHocDangSua);
      } else {
        form.resetFields();
      }
    }
  }, [isVisible, khoaHocDangSua, form]);

  const taoIdTuDong = () => {
    if (danhSachKhoaHoc.length === 0) return 'KH01';
    const danhSachIdSo = danhSachKhoaHoc.map((kh) => parseInt(kh.idKhoaHoc.replace('KH', ''), 10));
    const idMax = Math.max(...danhSachIdSo);
    return `KH${String(idMax + 1).padStart(2, '0')}`;
  };

  const xuLyLuu = () => {
    form.validateFields().then((values) => {
      const duLieuLuu: KhoaHoc = {
        ...values,
        idKhoaHoc: khoaHocDangSua ? khoaHocDangSua.idKhoaHoc : taoIdTuDong(),
      };
      onSave(duLieuLuu);
      form.resetFields();
    }).catch(() => {
      message.error('Vui lòng kiểm tra lại thông tin nhập!');
    });
  };

  return (
    <Modal
      title={khoaHocDangSua ? 'Chỉnh sửa Khóa học' : 'Thêm mới Khóa học'}
      visible={isVisible}
      onCancel={onClose}
      onOk={xuLyLuu}
      okText="Lưu lại"
      cancelText="Hủy bỏ"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tenKhoaHoc"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Không được để trống tên khóa học!' },
            { max: 100, message: 'Tên khóa học tối đa 100 ký tự!' },
            {
              validator: (_, value) => {
                const biTrung = danhSachKhoaHoc.some(
                  (kh) => kh.tenKhoaHoc.trim().toLowerCase() === value?.trim().toLowerCase() && 
                  kh.idKhoaHoc !== khoaHocDangSua?.idKhoaHoc
                );
                if (biTrung) return Promise.reject('Tên khóa học đã tồn tại!');
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="giangVien"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {DANH_SACH_GIANG_VIEN.map((gv) => (
              <Option key={gv} value={gv}>{gv}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="soLuongHocVien"
          label="Số lượng học viên"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
        >
          <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="Nhập số lượng học viên" />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {DANH_SACH_TRANG_THAI.map((tt) => (
              <Option key={tt} value={tt}>{tt}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả khóa học"
          rules={[{ required: true, message: 'Không được để trống mô tả!' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả " />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalKhoaHoc;