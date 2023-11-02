import { blobToBase64, getNameFile } from '@/utils/utils';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload, message, type UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile as UpFile } from 'antd/es/upload/interface';
import { type SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect, useState } from 'react';
import './UploadAvatar.less';

const UploadFile = (props: {
	fileList?: any;
	value?: string | string[] | null | { fileList: any; [key: string]: any };
	onChange?: (val: { fileList: any[] | null }) => void;
	maxCount?: number;
	drag?: boolean;
	accept?: string;
	buttonDescription?: string;
	buttonSize?: SizeType;
	otherProps?: UploadProps;
	isAvatar?: boolean;
	isAvatarSmall?: boolean;
}) => {
	const { value, onChange, otherProps, drag, buttonSize, buttonDescription, accept, isAvatar, isAvatarSmall } = props;
	const limit = props.maxCount || 1;
	const [fileList, setFileList] = useState<any[]>();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	useEffect(() => {
		let temp: any[] = [];
		// Single URL
		if (typeof value === 'string') {
			temp = [{ url: value, remote: true, name: getNameFile(value) }];
			setFileList(temp);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: temp });
		}
		// Array of URLs
		else if (Array.isArray(value)) {
			temp = value.map((url) => ({ url, remote: true, name: getNameFile(url) }));
			setFileList(temp);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: temp });
		}
		// Object of antd file upload
		else setFileList(props.fileList || (value && value.fileList) || []);
	}, [value, props.fileList]);

	const handleChange = (val: any) => {
		const fil = val.fileList;
		const findLargeFile = fil?.find((file: any) => file.size / 1024 / 1024 > 5);
		const findWrongTypeFile = fil?.find((file: any) => {
			const arrFileName = file.name.split('.');
			return file?.remote !== true && !otherProps?.accept?.includes(arrFileName?.[arrFileName.length - 1]);
		});

		if (findLargeFile) {
			message.error('Tập tin không được quá 5Mb');
			return;
		}
		if (findWrongTypeFile && otherProps?.accept) {
			message.error(`Chỉ được chọn các định dạng file sau ${otherProps.accept}`);
			return;
		}

		if (fil.length > limit) fil.splice(0, fil.length - limit);
		setFileList(fil);
		if (onChange) onChange({ fileList: fil });
	};

	const handlePreviewImage = async (file: UpFile) => {
		if (!file.url && !file.preview) file.preview = await blobToBase64(file.originFileObj as RcFile);

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const Extra = () =>
		otherProps?.disabled ? null : (
			<small style={{ color: '#999' }}>
				<i>Tối đa {limit} mục, dung lượng mỗi file không được quá 5Mb</i>
			</small>
		);

	// DRAGGER
	if (drag)
		return (
			<Upload.Dragger
				customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={limit > 1}
				accept={accept}
				{...otherProps}
			>
				{!otherProps || !otherProps.disabled ? (
					<>
						<p className='ant-upload-drag-icon'>
							<UploadOutlined />
						</p>
						<p className='ant-upload-text'>Nhấn chuột hoặc kéo thả tài liệu để tải lên</p>
						<p className='ant-upload-hint'>{buttonDescription}</p>
						<Extra />
					</>
				) : null}
			</Upload.Dragger>
		);
	else if (isAvatar || isAvatarSmall)
		return (
			<>
				<Upload
					customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
					listType='picture-card'
					className={`avatar-uploader ${isAvatarSmall ? 'avatar-small' : undefined}`}
					fileList={fileList}
					onChange={handleChange}
					style={{ width: '100%' }}
					multiple={false}
					accept='image/*'
					onPreview={handlePreviewImage}
					{...otherProps}
				>
					{(!otherProps || !otherProps.disabled) && !fileList?.length ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<PlusOutlined />
							<div className='ant-upload-text'>{buttonDescription || 'Thêm ảnh đại diện'}</div>
						</div>
					) : null}
				</Upload>
				<Extra />

				<Image
					style={{ display: 'none' }}
					preview={{
						visible: previewOpen,
						src: previewImage,
						onVisibleChange: (val) => setPreviewOpen(val),
					}}
				/>
			</>
		);

	// UPLOAD BUTTON
	return (
		<>
			<Upload
				customRequest={({ onSuccess }) => {
					setTimeout(() => onSuccess && onSuccess('ok'), 0);
				}}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={limit > 1}
				accept={accept}
				{...otherProps}
			>
				{!otherProps || !otherProps.disabled ? (
					<Button size={buttonSize || 'small'} icon={<UploadOutlined />}>
						{buttonDescription || 'Chọn tệp'}
					</Button>
				) : null}
			</Upload>
			<Extra />
		</>
	);
};

export default UploadFile;
