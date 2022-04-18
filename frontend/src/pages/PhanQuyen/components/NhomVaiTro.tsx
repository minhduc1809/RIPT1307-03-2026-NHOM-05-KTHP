/* eslint-disable no-underscore-dangle */
import { Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const NhomVaiTro = () => {
  const {
    getAllNhomVaiTroModel,
    danhSachNhomVaiTro,
    recordNhomVaiTro,
    vaiTro,
    deleteNhomVaiTroModel,
  } = useModel('phanquyen');

  useEffect(() => {
    getAllNhomVaiTroModel();
  }, [vaiTro]);

  return (
    <>
      <div>
        <div>
          <b>Nhóm vai trò:</b>{' '}
        </div>
        <br />
        {danhSachNhomVaiTro?.map((item) => (
          <Tag
            // onClick={() => {
            //   setRecordNhomVaiTro(item);
            //   setVisibleForm(true);
            //   setEdit(true);
            // }}
            onClose={() => {
              deleteNhomVaiTroModel({ idNhomVaiTro: item._id });
            }}
            // closeIcon={
            //   <CloseOutlined
            //     style={{ color: recordNhomVaiTro?._id === item._id ? '#fff' : '#000' }}
            //   />
            // }
            style={{
              cursor: 'pointer',
              backgroundColor: recordNhomVaiTro?._id === item._id ? '#CC0D00' : '#fafafa',
              color: recordNhomVaiTro?._id === item._id ? '#fff' : '#000',
              fontSize: 13,
              padding: '4px 8px',
              borderRadius: 15,
              marginBottom: 8,
            }}
            // closable={item?.macDinh}
            key={item._id}
          >
            {item._id}
          </Tag>
        ))}
        {/* <Button
          onClick={() => {
            setEdit(false);
            setRecordNhomVaiTro(undefined);
            setVisibleForm(true);
          }}
          style={{ borderRadius: 15, marginBottom: 8 }}
          icon={<PlusOutlined />}
          type="primary"
        >
          Thêm nhóm
        </Button> */}
      </div>
      {/* <Modal
        destroyOnClose
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        footer={false}
        onCancel={() => {
          setVisibleForm(false);
        }}
      >
        <FormNhomVaiTro />
      </Modal> */}
    </>
  );
};

export default NhomVaiTro;
