import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Typography, Space, Alert, Tag, List, message, Row, Col} from 'antd';
import { SendOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LichSuDoan {
  giaTri: number;
  nhanXet: string;
}

const GuessGame: React.FC = () => {
  const [soMucTieu, setSoMucTieu] = useState<number>(0);
  const [giaTriDoan, setGiaTriDoan] = useState<number | null>(null);
  const [cacLanDoan, setCacLanDoan] = useState<LichSuDoan[]>([]);
  const [trangThai, setTrangThai] = useState<'playing' | 'won' | 'lost'>('playing');
  const [phanHoi, setPhanHoi] = useState<{ type: 'success' | 'info' | 'warning' | 'error', msg: string } | null>(null);
  const soLuotToiDa = 10;
  const khoiTaoTroChoi = () => {
    const soNgauNhien = Math.floor(Math.random() * 100) + 1;
    setSoMucTieu(soNgauNhien);
    setCacLanDoan([]);
    setGiaTriDoan(null);
    setTrangThai('playing');
    setPhanHoi({ type: 'info', msg: 'Đoán số trong phạm vi 1-100 đi. Nhanh lên!' });
    console.log('Số mục tiêu (debug):', soNgauNhien);
  };

  useEffect(() => {
    khoiTaoTroChoi();
  }, []);

  const xuLyDoan = () => {
    if (giaTriDoan === null) {
      message.warning('Vui lòng nhập một con số!');
      return;
    }
    let ketQuaHienTai = '';
    if (giaTriDoan === soMucTieu) {
      ketQuaHienTai = 'Chính xác';
      setPhanHoi({ type: 'success', msg: 'Chúc mừng! Bạn đã đoán đúng!' });
      setTrangThai('won');
    } else {
      if (giaTriDoan < soMucTieu) {
        ketQuaHienTai = 'Quá thấp';
        setPhanHoi({ type: 'warning', msg: 'Bạn đoán quá thấp!' });
      } else {
        ketQuaHienTai = 'Quá cao';
        setPhanHoi({ type: 'warning', msg: 'Bạn đoán quá cao!' });
      }
    }
    const luotDoanMoi: LichSuDoan = { giaTri: giaTriDoan, nhanXet: ketQuaHienTai };
    const danhSachMoi = [luotDoanMoi, ...cacLanDoan];
    setCacLanDoan(danhSachMoi);
    if (giaTriDoan !== soMucTieu && danhSachMoi.length >= soLuotToiDa) {
      setPhanHoi({ type: 'error', msg: `Hết lượt! Số đúng là ${soMucTieu}.` });
      setTrangThai('lost');
    }
    setGiaTriDoan(null); 
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card 
        style={{ width: 800, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}> Trò chơi Đoán Số</Title>
        </div>
        <Row gutter={32}>
          <Col span={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {phanHoi && (
                <Alert message={phanHoi.msg} type={phanHoi.type} showIcon style={{ borderRadius: '8px' }} />
              )}
              <div style={{ textAlign: 'center', background: '#fff', border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px' }}>
                <Text strong style={{ fontSize: '16px' }}>Lượt còn lại</Text>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: soLuotToiDa - cacLanDoan.length > 3 ? '#52c41a' : '#ff4d4f' }}>
                  {soLuotToiDa - cacLanDoan.length}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <InputNumber
                  min={1}
                  max={100}
                  value={giaTriDoan}
                  onChange={(val) => setGiaTriDoan(val)}
                  onPressEnter={xuLyDoan}
                  disabled={trangThai !== 'playing'}
                  placeholder="Nhập 1-100"
                  style={{ flex: 1 }}
                  size="large"
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={xuLyDoan} 
                  disabled={trangThai !== 'playing'}
                  size="large"
                >
                  Đoán
                </Button>
              </div>

              {trangThai !== 'playing' && (
                <Button type="primary" danger block size="large" onClick={khoiTaoTroChoi}>
                  Bắt đầu ván mới
                </Button>
              )}
            </Space>
          </Col>

          <Col span={12} style={{ borderLeft: '1px solid #f0f0f0' }}>
            <div style={{ paddingLeft: '8px' }}>
              <Title level={4}><HistoryOutlined /> Lịch sử đoán</Title>
              <List
                size="small"
                locale={{ emptyText: 'Chưa có lượt đoán nào' }}
                dataSource={cacLanDoan}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <Text type="secondary">Lần {cacLanDoan.length - index}</Text>
                      <Text strong style={{ fontSize: '16px' }}>{item.giaTri}</Text>
                      <Tag color={
                        item.nhanXet === 'Chính xác' ? 'green' : 
                        item.nhanXet === 'Quá cao' ? 'volcano' : 'blue'
                      }>
                        {item.nhanXet}
                      </Tag>
                    </div>
                  </List.Item>
                )}
                style={{ 
                  maxHeight: '350px', 
                  overflowY: 'auto', 
                  paddingRight: '8px'
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GuessGame;