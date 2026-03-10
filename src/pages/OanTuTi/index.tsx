import React, { useState } from 'react';
import { Card, Button, Typography, Space, Row, Col, List, Tag, Empty, Statistic } from 'antd';
import { HistoryOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LichSuVanDau {
  lanChoi: number;
  nguoiChon: string;
  mayChon: string;
  ketQua: 'Thắng' | 'Thua' | 'Hòa';
}

const OanTuTi: React.FC = () => {
  const [lichSuChoi, setLichSuChoi] = useState<LichSuVanDau[]>([]);
  const [luaChonHienTai, setLuaChonHienTai] = useState<{ nguoi: string; may: string; ketQua: string } | null>(null);

  const danhSachLuaChon = [
    { ten: 'Búa', icon: '✊' },
    { ten: 'Bao', icon: '✋' },
    { ten: 'Kéo', icon: '✌️' },
  ];

  const xuLyChoi = (nguoiChon: string) => {
    const chiSoNgauNhien = Math.floor(Math.random() * 3);
    const mayChon = danhSachLuaChon[chiSoNgauNhien].ten;

    let ketQuaVuaRoi: 'Thắng' | 'Thua' | 'Hòa';
    if (nguoiChon === mayChon) {
      ketQuaVuaRoi = 'Hòa';
    } else if (
      (nguoiChon === 'Búa' && mayChon === 'Kéo') ||
      (nguoiChon === 'Bao' && mayChon === 'Búa') ||
      (nguoiChon === 'Kéo' && mayChon === 'Bao')
    ) {
      ketQuaVuaRoi = 'Thắng';
    } else {
      ketQuaVuaRoi = 'Thua';
    }

    setLuaChonHienTai({ nguoi: nguoiChon, may: mayChon, ketQua: ketQuaVuaRoi });

    const vanMoi: LichSuVanDau = {
      lanChoi: lichSuChoi.length + 1,
      nguoiChon,
      mayChon,
      ketQua: ketQuaVuaRoi,
    };
    setLichSuChoi([vanMoi, ...lichSuChoi]);
  };

  const xoaLichSu = () => {
    setLichSuChoi([]);
    setLuaChonHienTai(null);
  };

  const tongThang = lichSuChoi.filter((v) => v.ketQua === 'Thắng').length;

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card 
        style={{ width: 850, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        bodyStyle={{ height: '550px', overflow: 'hidden' }} 
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Title level={2}> Trò chơi Oẳn Tù Tì</Title>
        </div>

        <Row gutter={32} style={{ height: '80%' }}>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Statistic title="Số ván" value={lichSuChoi.length} prefix={<FireOutlined />} />
                <Statistic title="Thắng" value={tongThang} valueStyle={{ color: '#3f8600' }} prefix={<TrophyOutlined />} />
              </Space>
            </div>

            <div style={{ textAlign: 'center', padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
              {luaChonHienTai ? (
                <Row align="middle" justify="center">
                  <Col span={10}>
                    <div style={{ fontSize: '40px' }}>{danhSachLuaChon.find(i => i.ten === luaChonHienTai.nguoi)?.icon}</div>
                    <Text strong>Bạn</Text>
                  </Col>
                  <Col span={4}><Text type="secondary">VS</Text></Col>
                  <Col span={10}>
                    <div style={{ fontSize: '40px' }}>{danhSachLuaChon.find(i => i.ten === luaChonHienTai.may)?.icon}</div>
                    <Text strong>Máy</Text>
                  </Col>
                  <Col span={24} style={{ marginTop: '15px' }}>
                    <Tag color={luaChonHienTai.ketQua === 'Thắng' ? 'green' : luaChonHienTai.ketQua === 'Thua' ? 'red' : 'blue'} style={{ fontSize: '18px', padding: '5px 15px' }}>
                      {luaChonHienTai.ketQua.toUpperCase()}
                    </Tag>
                  </Col>
                </Row>
              ) : (
                <div style={{ padding: '20px' }}>
                  <Text type="secondary">Mời bạn chọn một quân bài!</Text>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <Space size="middle">
                {danhSachLuaChon.map((item) => (
                  <Button 
                    key={item.ten} 
                    type="primary" 
                    size="large" 
                    shape="round"
                    style={{ height: '60px', width: '80px', fontSize: '24px' }}
                    onClick={() => xuLyChoi(item.ten)}
                  >
                    {item.icon}
                  </Button>
                ))}
              </Space>
              <div style={{ marginTop: '15px' }}>
                <Button type="link" onClick={xoaLichSu} disabled={lichSuChoi.length === 0}>Xóa lịch sử</Button>
              </div>
            </div>
          </Col>

          <Col span={12} style={{ borderLeft: '1px solid #f0f0f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Title level={4}><HistoryOutlined /> Lịch sử kết quả</Title>
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                paddingRight: '10px',
                maxHeight: '400px' 
              }}>
                <List
                  size="small"
                  dataSource={lichSuChoi}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có ván đấu" /> }}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Text type="secondary" style={{ width: '50px' }}>Ván {item.lanChoi}</Text>
                        <Space style={{ flex: 1, justifyContent: 'center' }}>
                          <Text strong>{item.nguoiChon}</Text>
                          <Text type="secondary">vs</Text>
                          <Text strong>{item.mayChon}</Text>
                        </Space>
                        <div style={{ width: '80px', textAlign: 'center' }}>
                          <Tag color={item.ketQua === 'Thắng' ? 'green' : item.ketQua === 'Thua' ? 'red' : 'blue'} style={{ margin: 0, minWidth: '65px' }}>
                            {item.ketQua}
                          </Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OanTuTi;