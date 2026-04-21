import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Input, Tag, Pagination, Typography } from 'antd';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { layDuLieu, KHOA_BAI_VIET, KHOA_THE_TAG } from '../../utils/localStorage';

const { Meta } = Card;
const { Title } = Typography;

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

const TrangChu: React.FC = () => {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState<BaiViet[]>([]);
  const [danhSachTheTag, setDanhSachTheTag] = useState<TheTag[]>([]);
  const [tuKhoa, setTuKhoa] = useState<string>('');
  const [theTagDangChon, setTheTagDangChon] = useState<string>('');
  const [trangHienTai, setTrangHienTai] = useState<number>(1);
  const soBaiTrenTrang = 9;

  useEffect(() => {
    const tatCaBaiViet = layDuLieu<BaiViet>(KHOA_BAI_VIET).filter((bv) => bv.trangThai === 'daDang');
    setDanhSachBaiViet(tatCaBaiViet);
    setDanhSachTheTag(layDuLieu<TheTag>(KHOA_THE_TAG));
  }, []);

  const xuLyTimKiem = useMemo(
    () => debounce((giaTri: string) => {
      setTuKhoa(giaTri.toLowerCase());
      setTrangHienTai(1);
    }, 300),
    []
  );

  const baiVietDaLoc = danhSachBaiViet.filter((baiViet) => {
    const khopTuKhoa = baiViet.tieuDe.toLowerCase().includes(tuKhoa);
    const khopTheTag = theTagDangChon ? baiViet.danhSachThe.includes(theTagDangChon) : true;
    return khopTuKhoa && khopTheTag;
  });

  const baiVietHienThi = baiVietDaLoc.slice((trangHienTai - 1) * soBaiTrenTrang, trangHienTai * soBaiTrenTrang);

  return (
    <div>
      <Title level={2}>Bài Viết Mới Nhất</Title>
      
      <div style={{ marginBottom: 20 }}>
        <Input.Search 
          placeholder="Tìm kiếm bài viết..." 
          onChange={(e) => xuLyTimKiem(e.target.value)} 
          style={{ width: 300, marginRight: 20 }}
        />
        {danhSachTheTag.map((the) => (
          <Tag.CheckableTag
            key={the.id}
            checked={theTagDangChon === the.tenThe}
            onChange={(checked) => {
              setTheTagDangChon(checked ? the.tenThe : '');
              setTrangHienTai(1);
            }}
          >
            {the.tenThe}
          </Tag.CheckableTag>
        ))}
      </div>

      <Row gutter={[16, 16]}>
        {baiVietHienThi.map((baiViet) => (
          <Col span={8} key={baiViet.id}>
            <Link to={`/quan-ly-blog/bai-viet/${baiViet.slug}`}>
              <Card
                hoverable
                cover={<img alt={baiViet.tieuDe} src={baiViet.anhDaiDien || 'https://via.placeholder.com/300x150'} style={{height: 150, objectFit: 'cover'}} />}
              >
                <Meta title={baiViet.tieuDe} description={baiViet.tomTat} />
                <div style={{ marginTop: 10 }}>
                  <small>{baiViet.ngayTao} - {baiViet.tacGia}</small>
                </div>
                <div style={{ marginTop: 10 }}>
                  {baiViet.danhSachThe.map((tag) => <Tag color="blue" key={tag}>{tag}</Tag>)}
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Pagination 
          current={trangHienTai} 
          pageSize={soBaiTrenTrang} 
          total={baiVietDaLoc.length} 
          onChange={setTrangHienTai} 
        />
      </div>
    </div>
  );
};

export default TrangChu;