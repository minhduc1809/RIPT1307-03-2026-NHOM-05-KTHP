import Upload from '@/components/Upload/UploadFile';
import { postIssue } from '@/services/TechnicalSupport/technicalsupport';
import { uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { checkFileSize } from '@/utils/utils';
import { Button, Card, Form, Input, message } from 'antd';
import { useState } from 'react';

const FormPostIssue = (props: { onCancel: any }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	const onFinish = async (values: any) => {
		if (loading) return;
		setLoading(true);

		const checkSize = checkFileSize(values?.urlFile?.fileList ?? []);
		if (!checkSize) return;

		const urlFileDinhKem = await Promise.all(
			values?.urlFile?.fileList?.map(async (file: any) => {
				const res = await uploadFile({
					file: file?.originFileObj,
					public: '1',
				});
				return res?.data?.data?.url;
			}),
		);

		try {
			await postIssue({
				...values,
				imageUrlList: urlFileDinhKem,
				os: navigator.platform,
				osVersion: navigator.platform,
				appVersion: '',
			});
			message.success('Gửi thành công');
			setLoading(false);
			props.onCancel();
		} catch (err) {
			setLoading(false);
			message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
		}
	};

	return (
		<Card title='Phản hồi kĩ thuật'>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Form.Item rules={[...rules.required]} name='detail' label='Mô tả chi tiết'>
					<Input.TextArea rows={3} placeholder='Mô tả chi tiết' />
				</Form.Item>

				<Form.Item
					extra={<div>Tối đa 3 ảnh, dung lượng mỗi ảnh không quá 8Mb.</div>}
					name='imageUrlList'
					label='Ảnh đính kèm'
				>
					<Upload
						drag
						maxCount={3}
						accept='image/*'
						otherProps={{
							showUploadList: { showDownloadIcon: false },
						}}
					/>
				</Form.Item>

				<Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
					<Button loading={loading} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						Gửi
					</Button>
					<Button onClick={() => props.onCancel()}>Đóng</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormPostIssue;
