import React, { useState, useEffect } from 'react';
import { useLocation } from 'umi';
import { 
  Card, Col, Row, Statistic, Table, Button, Space, Input, DatePicker, 
  Select, Modal, Form, Tag, Popconfirm, message 
} from 'antd';
import { 
  ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined 
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';

const { Option } = Select;

// ======================= DỮ LIỆU BAN ĐẦU =======================
const duLieuBanDau = [
  { id: 't1', tenTask: 'Phân tích yêu cầu', moTa: 'Đọc spec dự án mới', deadline: '2026-05-15', uuTien: 'Cao', tag: ['Dự án', 'Công ty'], trangThai: 'Cần làm' },
  { id: 't2', tenTask: 'Học React DnD', moTa: 'Nghiên cứu kéo thả', deadline: '2026-05-10', uuTien: 'Trung bình', tag: ['Học tập'], trangThai: 'Đang làm' },
  { id: 't3', tenTask: 'Báo cáo tuần', moTa: 'Tổng hợp chi phí', deadline: '2026-04-01', uuTien: 'Cao', tag: ['Công ty'], trangThai: 'Hoàn thành' },
];

const DANH_SACH_TRANG_THAI = ['Cần làm', 'Đang làm', 'Hoàn thành'];
const MAU_UU_TIEN = { 'Cao': 'red', 'Trung bình': 'orange', 'Thấp': 'blue' };

export default function QuanLyCongViec() {
  const location = useLocation();
  const [danhSachTask, setDanhSachTask] = useState(() => JSON.parse(localStorage.getItem('danhSachTask') || 'null') || duLieuBanDau);
  
  // Quản lý trạng thái Modal Form
  const [form] = Form.useForm();
  const [hienThiModal, setHienThiModal] = useState(false);
  const [taskDangSua, setTaskDangSua] = useState(null);

  // Lưu xuống localStorage mỗi khi danhSachTask thay đổi
  useEffect(() => {
    localStorage.setItem('danhSachTask', JSON.stringify(danhSachTask));
  }, [danhSachTask]);

  // ======================= XỬ LÝ FORM THÊM/SỬA =======================
  const moModalTask = (record = null) => {
    setTaskDangSua(record);
    if (record) {
      form.setFieldsValue({ ...record, deadline: moment(record.deadline) });
    } else {
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const xuLyLuuTask = (values) => {
    const dataLuu = { 
      ...values, 
      deadline: values.deadline.format('YYYY-MM-DD'),
      id: taskDangSua ? taskDangSua.id : `t${Date.now()}`
    };

    if (taskDangSua) {
      setDanhSachTask(danhSachTask.map(t => t.id === taskDangSua.id ? dataLuu : t));
      message.success('Cập nhật task thành công!');
    } else {
      setDanhSachTask([...danhSachTask, dataLuu]);
      message.success('Thêm task mới thành công!');
    }
    setHienThiModal(false);
  };

  const xoaTask = (id) => {
    setDanhSachTask(danhSachTask.filter(t => t.id !== id));
    message.success('Đã xóa task!');
  };

  // ======================= RENDER COMPONENT 1: DASHBOARD =======================
  const renderDashboard = () => {
    const tongSo = danhSachTask.length;
    const hoanThanh = danhSachTask.filter(t => t.trangThai === 'Hoàn thành').length;
    const quaHan = danhSachTask.filter(t => t.trangThai !== 'Hoàn thành' && moment(t.deadline).isBefore(moment(), 'day')).length;

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số Task" value={tongSo} prefix={<ProjectOutlined style={{ color: '#1890ff' }} />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đã hoàn thành" value={hoanThanh} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Quá hạn" value={quaHan} valueStyle={{ color: '#cf1322' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
      </Row>
    );
  };

  // ======================= RENDER COMPONENT 2: KANBAN BOARD =======================
  const onDragEnd = (result) => {
    if (!result.destination) return; // Kéo ra ngoài vùng
    const dsMoi = Array.from(danhSachTask);
    const taskIndex = dsMoi.findIndex(t => t.id === result.draggableId);
    
    // Cập nhật trạng thái mới cho task dựa vào ID của cột thả xuống
    dsMoi[taskIndex].trangThai = result.destination.droppableId;
    setDanhSachTask(dsMoi);
  };

  const renderKanban = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {DANH_SACH_TRANG_THAI.map(cot => (
          <Droppable droppableId={cot} key={cot}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1, background: '#f0f2f5', padding: 16, borderRadius: 8, minHeight: 400 }}>
                <h3 style={{ borderBottom: '2px solid #d9d9d9', paddingBottom: 8, marginBottom: 16 }}>{cot}</h3>
                {danhSachTask.filter(t => t.trangThai === cot).map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, marginBottom: 16 }}>
                        <Card size="small" hoverable title={task.tenTask} extra={<Tag color={MAU_UU_TIEN[task.uuTien]}>{task.uuTien}</Tag>}>
                          <p style={{ color: '#8c8c8c', marginBottom: 8 }}>{task.moTa}</p>
                          <small><ClockCircleOutlined /> {task.deadline}</small>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );

  // ======================= RENDER COMPONENT 3: DANH SÁCH TASK =======================
  const [tuKhoa, setTuKhoa] = useState('');
  const renderDanhSach = () => {
    const dataHienThi = danhSachTask.filter(t => t.tenTask.toLowerCase().includes(tuKhoa.toLowerCase()));

    return (
      <Card>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Input placeholder="Tìm kiếm tên task..." prefix={<SearchOutlined />} style={{ width: 300 }} onChange={e => setTuKhoa(e.target.value)} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => moModalTask()}>Thêm Task</Button>
        </Space>
        <Table 
          dataSource={dataHienThi} rowKey="id"
          columns={[
            { title: 'Tên Task', dataIndex: 'tenTask', width: '20%' },
            { title: 'Mô tả', dataIndex: 'moTa', width: '25%' },
            { title: 'Mức ưu tiên', dataIndex: 'uuTien', align: 'center', render: ut => <Tag color={MAU_UU_TIEN[ut]}>{ut}</Tag> },
            { title: 'Deadline', dataIndex: 'deadline', sorter: (a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf() },
            { 
              title: 'Trạng thái', dataIndex: 'trangThai',
              filters: DANH_SACH_TRANG_THAI.map(tt => ({ text: tt, value: tt })),
              onFilter: (value, record) => record.trangThai === value,
              render: tt => <Tag color={tt === 'Hoàn thành' ? 'green' : tt === 'Đang làm' ? 'blue' : 'default'}>{tt}</Tag>
            },
            { title: 'Thao tác', align: 'center', render: (_, record) => (
              <Space>
                <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => moModalTask(record)} />
                <Popconfirm title="Xóa task này?" onConfirm={() => xoaTask(record.id)}>
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            )}
          ]}
        />
      </Card>
    );
  };

  // ======================= MAIN RENDER DỰA THEO ROUTE =======================
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 24 }}>Quản lý Công việc Cá nhân</h2>
      
      {/* Điều hướng nội dung hiển thị */}
      {location.pathname.includes('/dashboard') && renderDashboard()}
      {location.pathname.includes('/kanban') && renderKanban()}
      {location.pathname.includes('/danh-sach') && renderDanhSach()}

      {/* MODAL THÊM/SỬA DÙNG CHUNG */}
      <Modal title={taskDangSua ? "Chỉnh sửa Task" : "Thêm Task mới"} visible={hienThiModal} onCancel={() => setHienThiModal(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={xuLyLuuTask}>
          <Form.Item name="tenTask" label="Tên Task" rules={[{ required: true, message: 'Nhập tên task!' }]}><Input /></Form.Item>
          <Form.Item name="moTa" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn deadline!' }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item>
          <Form.Item name="uuTien" label="Mức độ ưu tiên" rules={[{ required: true }]} initialValue="Trung bình">
            <Select><Option value="Cao">Cao</Option><Option value="Trung bình">Trung bình</Option><Option value="Thấp">Thấp</Option></Select>
          </Form.Item>
          <Form.Item name="tag" label="Tags">
            <Select mode="tags" placeholder="Nhập tag (VD: Công ty, Dự án...)" />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" initialValue="Cần làm">
            <Select><Option value="Cần làm">Cần làm</Option><Option value="Đang làm">Đang làm</Option><Option value="Hoàn thành">Hoàn thành</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}