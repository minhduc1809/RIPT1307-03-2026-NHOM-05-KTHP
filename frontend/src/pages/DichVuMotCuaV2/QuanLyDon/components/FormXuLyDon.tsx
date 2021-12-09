/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { checkFileSize, renderFileList, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormXuLyDon = (props: { type: string; onCancel: any }) => {
  const [form] = Form.useForm();
  const {
    loading,
    recordDonThaoTac,
    setLoading,
    chuyenVienDieuPhoiDuyetDonModel,
    chuyenVienXuLyDuyetDonModel,
  } = useModel('dichvumotcuav2');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  return (
    <Card title={props.type === 'ok' ? 'Duyệt' : 'Không duyệt'}>
      <Form
        onFinish={async (values) => {
          if (!recordDonThaoTac?._id) return;
          const checkSize = checkFileSize(values?.urlFileDinhKem?.fileList ?? []);
          if (!checkSize) return;
          setLoading(true);
          const urlFileDinhKem = await uploadMultiFile(values?.urlFileDinhKem?.fileList);
          const payload = {
            type: props.type,
            idDonThaoTac: recordDonThaoTac?._id,
            data: {
              urlFileDinhKem,
              info: {
                ghiChuXuLy: values?.ghiChuXuLy ?? '',
              },
            },
          };
          if (arrPathName?.includes('quanlydondieuphoi')) chuyenVienDieuPhoiDuyetDonModel(payload);
          else chuyenVienXuLyDuyetDonModel(payload);
          props?.onCancel();
        }}
        form={form}
      >
        <Form.Item
          initialValue={recordDonThaoTac?.info?.ghiChuXuLy}
          name="ghiChuXuLy"
          rules={[...rules.text]}
          label="Ghi chú xử lý (nếu có)"
        >
          <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
        </Form.Item>
        <Form.Item
          name="urlFileDinhKem"
          extra={
            <>
              <div>Định dạng file: pdf, doc, docx</div>
              <div>Tối đa 5 file, dung lượng mỗi file không quá 8Mb</div>
            </>
          }
          rules={[...rules.fileLimit(5)]}
          initialValue={renderFileList(recordDonThaoTac?.urlFileDinhKem ?? [])}
          label="Kết quả xử lý (nếu có)"
        >
          <Upload
            otherProps={{
              accept: '.pdf, .doc,.docx',
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            loading={loading}
            style={{
              backgroundColor: props.type === 'ok' ? '#007F3E' : '#CC0D00',
              border: `1px solid ${props.type === 'ok' ? '#007F3E' : '#CC0D00'}`,
              color: 'white',
              marginRight: 8,
            }}
            htmlType="submit"
            type="primary"
          >
            Gửi
          </Button>
          <Button
            onClick={() => {
              props?.onCancel();
            }}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormXuLyDon;
