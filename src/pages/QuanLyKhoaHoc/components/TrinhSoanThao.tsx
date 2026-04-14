import React, { useRef, useEffect } from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  ClearOutlined,
} from '@ant-design/icons';

interface TrinhSoanThaoProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TrinhSoanThao: React.FC<TrinhSoanThaoProps> = ({ value, onChange }) => {
  const vungSoanThaoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vungSoanThaoRef.current && value !== vungSoanThaoRef.current.innerHTML) {
      vungSoanThaoRef.current.innerHTML = value || '';
    }
  }, [value]);

  const xuLyNhapLieu = () => {
    if (onChange && vungSoanThaoRef.current) {
      onChange(vungSoanThaoRef.current.innerHTML);
    }
  };

  const dinhDangVanBan = (lenh: string, giaTriKhoiTao?: string) => {
    document.execCommand(lenh, false, giaTriKhoiTao);
    vungSoanThaoRef.current?.focus(); 
    xuLyNhapLieu();
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
      <div style={{ padding: '8px', borderBottom: '1px solid #d9d9d9', background: '#fafafa' }}>
        <Space>
          <Tooltip title="In đậm">
            <Button type="text" icon={<BoldOutlined />} onMouseDown={(e) => { e.preventDefault(); dinhDangVanBan('bold'); }} />
          </Tooltip>
          <Tooltip title="In nghiêng">
            <Button type="text" icon={<ItalicOutlined />} onMouseDown={(e) => { e.preventDefault(); dinhDangVanBan('italic'); }} />
          </Tooltip>
          <Tooltip title="Gạch chân">
            <Button type="text" icon={<UnderlineOutlined />} onMouseDown={(e) => { e.preventDefault(); dinhDangVanBan('underline'); }} />
          </Tooltip>
          <Tooltip title="Gạch ngang">
            <Button type="text" icon={<StrikethroughOutlined />} onMouseDown={(e) => { e.preventDefault(); dinhDangVanBan('strikeThrough'); }} />
          </Tooltip>
          <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 8px' }} /> {/* Vạch ngăn cách */}
          <Tooltip title="Tiêu đề lớn">
            <Button type="text" onMouseDown={(e) => { e.preventDefault(); dinhDangVanBan('formatBlock', 'H3'); }}><b>H1</b></Button>
          </Tooltip>
          <Tooltip title="Xóa định dạng">
            <Button type="text" icon={<ClearOutlined />} onMouseDown={(e) => { e.preventDefault(); dinhDangVanBan('removeFormat'); }} />
          </Tooltip>
        </Space>
      </div>

      <div
        ref={vungSoanThaoRef}
        contentEditable
        onInput={xuLyNhapLieu}
        onBlur={xuLyNhapLieu}
        style={{
          minHeight: '150px',
          padding: '12px',
          outline: 'none',
          background: '#fff',
        }}
      />
    </div>
  );
};

export default TrinhSoanThao;