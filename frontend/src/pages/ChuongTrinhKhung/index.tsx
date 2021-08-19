import { get as getNganh } from '@/services/nganh/nganh';
import { Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import Block from './components/block';

const ChuongTrinhKhung = () => {
  const [dataNganh, dataNganhSet] = useState<IRecordCTK.RootObject>({});

  const [loading, setLoading] = useState<boolean>(true);

  const [nganh_dsMonHocDieuKien, setnganh_dsMonHocDieuKien] = useState<
    IRecordCTK.MonHocDieuKienId[] | undefined
  >([]);

  useEffect(() => {
    const getChuongTrinhKhung = async () => {
      const responseNganh = await getNganh();
      dataNganhSet(responseNganh);
      // danh sach mon dieu kien chung cua nganh
      setnganh_dsMonHocDieuKien(responseNganh?.data?.nganh?.mon_hoc_dieu_kien_ids ?? []);

      setLoading(false);
    };
    getChuongTrinhKhung();
  }, []);

  // thêm tên chuyên ngành đi kèm vs ds môn
  const dsMonHocDKTheoChuyenNganh = dataNganh.data?.chuyenNganh?.map((item) => ({
    tenChuyenNganh: item.chuyen_nganh_id?.[1],
    mon_hoc_dieu_kien_ids: item.mon_hoc_dieu_kien_ids,
  }));

  // sắp xếp ds môn theo kỳ
  const dsMonHocDKTheoChuyenNganhSapXepKy = dsMonHocDKTheoChuyenNganh?.map((item) => {
    return {
      ...item,
      mon_hoc_dieu_kien_ids: item.mon_hoc_dieu_kien_ids?.sort((a, b) => {
        return Number(a.hoc_ky) - Number(b.hoc_ky);
      }),
    };
  });

  // bổ sung ds kỳ đi kèm để khởi tạo
  const dsMonHocDKTheoChuyenNganhSapXepKyBoSungSoKy = dsMonHocDKTheoChuyenNganhSapXepKy?.map(
    (item) => {
      // lấy gtri của kì cuối để khởi tạo mảng
      const kiCuoiChuyenNganh: number = Number(
        item.mon_hoc_dieu_kien_ids?.[item.mon_hoc_dieu_kien_ids?.length - 1]?.hoc_ky ?? 1,
      );
      const dsKy = [];
      for (let i = 0; i < kiCuoiChuyenNganh; i += 1) {
        dsKy.push(i + 1);
      }

      return {
        ...item,
        dsKy,
      };
    },
  );

  // nganh chi co 1 ds môn thôi
  nganh_dsMonHocDieuKien?.sort((a, b) => {
    return Number(a.hoc_ky) - Number(b.hoc_ky);
  });
  const dsnganh = [];
  const kiCuoinganh: number = Number(
    nganh_dsMonHocDieuKien?.[nganh_dsMonHocDieuKien?.length - 1]?.hoc_ky ?? 1,
  );

  for (let i = 0; i < kiCuoinganh; i += 1) {
    dsnganh.push(i + 1);
  }

  return (
    <Card title="Cấu trúc chương trình các ngành">
      <Spin spinning={loading}>
        <div
          style={{ marginTop: 10 }}
          dangerouslySetInnerHTML={{
            __html:
              "<iframe src='https://dhs.aisenote.com/website_scorm_elearning/static/media/scorm/b1/res/index.html' allowFullScreen='true' width='100%' height='500px' frameborder='0'></iframe>",
          }}
        />
        <b>
          Ngành: {dataNganh?.data?.nganh?.nganh_id?.[1]} - Chuyên ngành:{` `}
          {dataNganh?.data?.chuyenNganh?.[0]?.chuyen_nganh_id?.[1]}
        </b>
        <ul>
          <li>
            <br />
            <b> I. Học phần chung của ngành:</b>
            <div style={{ overflowX: 'auto' }}>
              {dsnganh?.map((item: number, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div style={{ display: 'flex' }} key={`${index} + ${item}`}>
                    <Block
                      hocphantruoc={[]}
                      hocphantienquyet={[]}
                      type="hocky"
                      title={`Học kỳ ${item}`}
                      number={0}
                    />
                    {nganh_dsMonHocDieuKien?.map((mon) => {
                      if (Number(mon?.hoc_ky) === item) {
                        return (
                          <Block
                            // hocphantruoc={hocphan.hoc_phan.hoc_phan_truoc}
                            // hocphantienquyet={hocphan.hoc_phan.hoc_phan_tien_quyet}
                            type="hocphan"
                            title={mon?.display_name}
                            maHocPhan={mon?.ma_hoc_phan}
                            number={mon?.soTinChi ?? 0}
                          />
                        );
                      }
                      return '';
                    })}
                  </div>
                );
              })}
            </div>
          </li>
          <li>
            <br />
            <b> II. Học phần riêng của chuyên ngành:</b>
            <div style={{ overflowX: 'auto' }}>
              {dsMonHocDKTheoChuyenNganhSapXepKyBoSungSoKy?.map((chuyenNganh, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <ul key={index + chuyenNganh.tenChuyenNganh}>
                    <li>
                      <br />
                      <b>
                        {dsMonHocDKTheoChuyenNganhSapXepKyBoSungSoKy?.length > 1
                          ? `${index + 1}.`
                          : ''}{' '}
                        {chuyenNganh?.tenChuyenNganh}:
                      </b>
                      {chuyenNganh?.dsKy?.map((item: number) => {
                        return (
                          <div style={{ display: 'flex' }}>
                            <Block
                              hocphantruoc={[]}
                              hocphantienquyet={[]}
                              type="hocky"
                              title={`Học kỳ ${item}`}
                              number={0}
                            />
                            {chuyenNganh?.mon_hoc_dieu_kien_ids?.map((mon) => {
                              if (Number(mon?.hoc_ky) === item) {
                                return (
                                  <Block
                                    // hocphantruoc={hocphan.hoc_phan.hoc_phan_truoc}
                                    // hocphantienquyet={hocphan.hoc_phan.hoc_phan_tien_quyet}
                                    type="hocphan"
                                    title={mon?.display_name}
                                    maHocPhan={mon?.ma_hoc_phan}
                                    number={mon?.soTinChi ?? 0}
                                  />
                                );
                              }
                              return '';
                            })}
                          </div>
                        );
                      })}
                    </li>
                  </ul>
                );
              })}
            </div>
          </li>
        </ul>
        <br />
        <br />
      </Spin>
    </Card>
  );
};

export default ChuongTrinhKhung;
