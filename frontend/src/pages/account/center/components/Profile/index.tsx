import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getInfo, putInfo } from '@/services/ant-design-pro/api';
// import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { renderFileListUrl, toISOString } from '@/utils/utils';
import { Button, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import { Component } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import mm from 'moment-timezone';
import moment from 'moment';
import type { Login } from '@/services/ant-design-pro/typings';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

interface BaseViewProps {
  dispatch: Dispatch;
  currentUser?: Login.Profile;
  loading: boolean;
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.anhDaiDien) {
        return currentUser.anhDaiDien;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleFinish = async (val: any) => {
    const { dispatch } = this.props;

    // let avatar_path = '';
    // if (val.avatar_path.fileList?.[0]?.originFileObj) {
    //   // const responseUpload = await getURLImg({
    //   //   filename: 'url1',
    //   //   public: true,
    //   //   file: val?.avatar_path.fileList?.[0].originFileObj,
    //   // });
    //   // avatar_path = responseUpload?.data?.data?.url;
    // } else avatar_path = val.avatar_path.fileList?.[0]?.url;
    const response = await putInfo({
      ...val,
      // avatar_path,
      ngaySinh: toISOString(val?.ngaySinh),
    });
    getInfo();

    dispatch({
      type: 'accountAndcenter/fetchCurrent',
    });
    dispatch({
      type: 'accountAndcenter/fetch',
    });

    if (response?.data?.data?.success) message.success('Cập nhật thành công');
  };

  render() {
    const { currentUser } = this.props;

    return currentUser ? (
      <div ref={this.getViewDom}>
        <Form layout="vertical" onFinish={this.handleFinish}>
          <Row gutter={[50, 0]}>
            <Col xl={12}>
              <Row gutter={[20, 0]}>
                <Col xs={24} lg={12}>
                  {' '}
                  <Form.Item
                    initialValue={currentUser?.hoDem}
                    name="hoDem"
                    label="Họ đệm"
                    rules={[...rules.required, ...rules.ten]}
                  >
                    <Input placeholder="Họ đệm" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    initialValue={currentUser?.ten}
                    name="ten"
                    label="Tên"
                    rules={[...rules.required, ...rules.ten]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="ngaySinh"
                    label="Ngày sinh"
                    rules={[...rules.required]}
                    initialValue={currentUser?.ngaySinh ? moment(currentUser?.ngaySinh) : undefined}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={(cur) => moment(cur).isAfter(moment())}
                      placeholder="Ngày sinh"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item
                    style={{ marginBottom: 8 }}
                    name="gioiTinh"
                    label="Giới tính"
                    initialValue={currentUser?.gioiTinh}
                    rules={[...rules.required]}
                  >
                    <Select
                      placeholder="Giới tính"
                      options={[
                        { value: 'NAM', label: 'Nam' },
                        { value: 'NU', label: 'Nữ' },
                        { value: 'KHAC', label: 'Khác' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                initialValue={currentUser?.soDienThoai}
                name="soDienThoai"
                label="Email"
                rules={[...rules.soDienThoai]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>

              <Form.Item initialValue={currentUser?.diaChi} name="diaChi" label="Địa chỉ hiện nay">
                <Input.TextArea rows={3} placeholder="Địa chỉ hiện nay" />
              </Form.Item>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button htmlType="submit" type="primary">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item
                name="anhDaiDien"
                label="Ảnh đại diện"
                initialValue={renderFileListUrl(currentUser?.anhDaiDien ?? '')}
                rules={[...rules.fileRequired]}
              >
                <UploadAvatar
                  style={{
                    width: 102,
                    maxWidth: 102,
                    height: 102,
                    maxHeight: 102,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    ) : (
      <div />
    );
  }
}

export default connect(
  ({
    accountAndcenter,
    loading,
  }: {
    accountAndcenter: { currentUser: Login.Profile };
    loading: { effects: Record<string, boolean> };
  }) => ({
    currentUser: accountAndcenter.currentUser,
    currentUserLoading: loading.effects['accountAndcenter/fetchCurrent'],
  }),
)(BaseView);
