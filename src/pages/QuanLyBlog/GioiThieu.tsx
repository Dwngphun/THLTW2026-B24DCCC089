import React from 'react';
import { Card, Avatar, Typography, Row, Col, Tag } from 'antd';

const { Title, Paragraph } = Typography;

const GioiThieu: React.FC = () => {
  return (
    <Row justify="center">
      <Col span={12}>
        <Card style={{ textAlign: 'center' }}>
          <Avatar size={120} src="https://cdn-media.sforum.vn/storage/app/media/ctv_seo8/ctv_phung/avatar-vo-tri-nam/avatar-vo-tri-nam-4.jpg" />
          <Title level={3} style={{ marginTop: 20 }}>Phùng Đăng Dương</Title>
          <Paragraph>
            Xin chào, tôi là Dương và là một sinh viên của Học viện Công nghệ Bưu chính Viễn thông.
          </Paragraph>
          <div style={{ marginTop: 20 }}>
            <Title level={5}>Kỹ năng & Sở thích</Title>
            <Tag color="cyan">GPA 3.7</Tag>
            <Tag color="cyan">Rèn luyện thể chất</Tag>
            <Tag color="cyan">Phát Triển Bản Thân</Tag>
            <Tag color="cyan">Tự do</Tag>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default GioiThieu;