const TieuDeBieuMau = (props: { title: string }) => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '-7px', fontWeight: 650, fontSize: '20px' }}>
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        </p>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          <u>Độc lập - Tự do - Hạnh phúc</u>
        </p>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontWeight: 650,
          fontSize: '22px',
          textTransform: 'uppercase',
        }}
      >
        {props.title}
      </p>
      <p style={{ textAlign: 'center', fontSize: '16px' }}>
        <i>
          <u>Kính gửi:</u>
        </i>{' '}
        <b>HIỆU TRƯỞNG TRƯỜNG ĐẠI HỌC CÔNG NGHỆ - ĐHQGHN</b>
      </p>
    </>
  );
};

export default TieuDeBieuMau;
