import React, { useState, useEffect } from 'react';
import { useParams, Link, history } from 'umi';
import { Button, Typography, Tag, Divider, Row, Col, Card } from 'antd';
import ReactMarkdown from 'react-markdown';
import { layDuLieu, luuDuLieu, KHOA_BAI_VIET } from '../../utils/localStorage';

const { Title, Paragraph } = Typography;

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

const ChiTietBaiViet: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // ĐÃ XÓA useNavigate Ở ĐÂY
  const [baiViet, setBaiViet] = useState<BaiViet | null>(null);
  const [baiVietLienQuan, setBaiVietLienQuan] = useState<BaiViet[]>([]);

  useEffect(() => {
    let tatCaBaiViet = layDuLieu<BaiViet>(KHOA_BAI_VIET);
    const viTriBaiViet = tatCaBaiViet.findIndex((bv) => bv.slug === slug);
    
    if (viTriBaiViet !== -1) {
      tatCaBaiViet[viTriBaiViet].luotXem = (tatCaBaiViet[viTriBaiViet].luotXem || 0) + 1;
      luuDuLieu(KHOA_BAI_VIET, tatCaBaiViet);
      
      const baiVietHienTai = tatCaBaiViet[viTriBaiViet];
      setBaiViet(baiVietHienTai);

      const lienQuan = tatCaBaiViet.filter((bv) => 
        bv.id !== baiVietHienTai.id && 
        bv.trangThai === 'daDang' &&
        bv.danhSachThe.some((the) => baiVietHienTai.danhSachThe.includes(the))
      ).slice(0, 3);
      
      setBaiVietLienQuan(lienQuan);
    }
  }, [slug]);

  if (!baiViet) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* ĐÃ SỬA THÀNH history.back() Ở ĐÂY */}
      <Button onClick={() => history.goBack()} style={{ marginBottom: 20 }}>Quay lại</Button>
      
      <Title>{baiViet.tieuDe}</Title>
      <Paragraph type="secondary">
        Đăng bởi: {baiViet.tacGia} | Ngày: {baiViet.ngayTao} | Lượt xem: {baiViet.luotXem}
      </Paragraph>
      <div>
        {baiViet.danhSachThe.map((the) => <Tag color="blue" key={the}>{the}</Tag>)}
      </div>
      <Divider />
      
      {baiViet.anhDaiDien && (
        <img src={baiViet.anhDaiDien} alt="cover" style={{width: '100%', marginBottom: 20, borderRadius: 8}} />
      )}
      <div className="noi-dung-markdown">
        <ReactMarkdown>{baiViet.noiDung}</ReactMarkdown>
      </div>
      
      <Divider />
      <Title level={4}>Bài viết liên quan</Title>
      <Row gutter={16}>
        {baiVietLienQuan.map((bv) => (
          <Col span={8} key={bv.id}>
            <Link to={`/quan-ly-blog/bai-viet/${bv.slug}`}>
              <Card size="small" title={bv.tieuDe} cover={<img alt="cover" src={bv.anhDaiDien || 'https://via.placeholder.com/150'} style={{height: 100, objectFit:'cover'}}/>}>
                Xem chi tiết
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ChiTietBaiViet;