import UploadAvatar from '@/components/Upload/UploadAvatar';
import { getInfo, putInfo } from '@/services/ant-design-pro/api';
import { getURLImg } from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { Button, Col, Form, Input, message, Row } from 'antd';
import mm from 'moment-timezone';
import { Component } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';

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
      if (currentUser.avatar_path) {
        return currentUser.avatar_path;
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

    let avatar_path = '';
    if (val.avatar_path.fileList?.[0]?.originFileObj) {
      const responseUpload = await getURLImg({
        filename: 'url1',
        public: true,
        file: val?.avatar_path.fileList?.[0].originFileObj,
      });
      avatar_path = responseUpload?.data?.data?.url;
    } else avatar_path = val.avatar_path.fileList?.[0]?.url;
    const response = await putInfo({
      ...val,
      avatar_path,
      ngay_sinh: val?.ngay_sinh?.format('YYYY-MM-DD'),
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

    return currentUser?.id ? (
      <div ref={this.getViewDom}>
        <Form layout="vertical" onFinish={this.handleFinish}>
          <Row gutter={[50, 0]}>
            <Col xl={12}>
              {/* <Form.Item
                initialValue={currentUser?.TenDayDu}
                name="TenDayDu"
                label="Họ và tên"
                rules={[...rules.required, ...rules.ten]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item> */}

              {/* <Row gutter={[20, 0]}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="ngay_sinh"
                    label="Ngày sinh"
                    rules={[...rules.required]}
                    initialValue={
                      currentUser?.ngay_sinh ? moment(currentUser?.ngay_sinh) : undefined
                    }
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
                    initialValue={currentUser?.gioi_tinh || '0'}
                    name="gioi_tinh"
                    label="Giới tính"
                    rules={[...rules.required]}
                  >
                    <Select>
                      <Select.Option value="0">Nam</Select.Option>
                      <Select.Option value="1">Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row> */}
              <Form.Item
                initialValue={currentUser?.email || ''}
                name="email"
                label="Email"
                rules={[...rules.email]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                initialValue={currentUser?.so_dien_thoai || ''}
                name="so_dien_thoai"
                label="Số điện thoại"
                rules={[...rules.soDienThoai]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item
                initialValue={currentUser?.so_nha_ten_duong_no || ''}
                name="so_nha_ten_duong_no"
                label="Địa chỉ hiện nay"
              >
                <Input.TextArea rows={3} placeholder="Địa chỉ hiện nay" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item
                name="avatar_path"
                label="Ảnh đại diện"
                initialValue={renderFileListUrl(currentUser?.avatar_path ?? '')}
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
      <div></div>
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
