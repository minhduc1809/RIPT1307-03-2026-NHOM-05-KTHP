import { ArrowLeftOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Popconfirm, Row, Space, Spin, Tag } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import { type TImportRowResponse, type IColumn, type TImportResponse } from '../typing';

const ValidateDataImport = (props: { onOk: () => void; onCancel: () => void; onBack: any; modelName: any }) => {
	const { onOk, onCancel, onBack, modelName } = props;
	const { dataImport, startLine } = useModel('import');
	const { postValidateModel, postExecuteImpotModel, formSubmiting } = useModel(modelName);
	const [importResponses, setImportResponses] = useState<TImportRowResponse[]>([]);
	const [errorCount, setErrorCount] = useState<number>();
	const [isError, setIsError] = useState<boolean>();
	const [step, setStep] = useState(0);

	const columns: IColumn<TImportRowResponse>[] = [
		{
			dataIndex: 'index',
			title: 'Thứ tự hàng',
			width: 80,
			align: 'center',
		},
		{
			title: 'Trạng thái',
			width: 100,
			align: 'center',
			render: (val, rec) =>
				!!rec.rowErrors?.length ? (
					<Tag color='red'>{step === 0 ? 'Không hợp lệ' : 'Không thành công'}</Tag>
				) : (
					<Tag color='green'>{step === 0 ? 'Hợp lệ' : 'Thành công'}</Tag>
				),
		},
		{
			dataIndex: 'rowErrors',
			title: 'Thông tin lỗi',
			width: 300,
			render: (val) => val?.join(', '),
		},
	];

	const validateData = async () => {
		if (postValidateModel)
			postValidateModel(dataImport)
				.then((res: TImportResponse) => {
					setErrorCount(res.validate?.filter((item) => !!item.rowErrors?.length).length);
					setIsError(res.error);
					const temp = res.validate?.map((item) => ({ ...item, index: item.index + startLine }));
					setImportResponses(temp ?? []);
				})
				.catch((err: any) => console.log(err));
	};

	useEffect(() => {
		validateData();
	}, []);

	const onExecute = () => {
		postExecuteImpotModel(dataImport)
			.then((res: TImportResponse) => {
				setStep(1);
				setErrorCount(res.validate?.filter((item) => !!item.rowErrors?.length).length);
				setIsError(res.error);
				const temp = res.validate?.map((item) => ({ ...item, index: item.index + startLine }));
				setImportResponses(temp ?? []);

				onOk(); // Get data
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<div className='fw500'>Kết quả kiểm tra</div>
				<i>Dữ liệu đã được kiểm tra trên hệ thống. Vui lòng xem danh sách chi tiết dưới đây.</i>
			</Col>

			{!formSubmiting ? (
				errorCount ? (
					<Col span={24}>
						{step === 0 ? (
							<>
								<span className='fw500'>Hiện tại có </span>
								<Tag color='red'>{errorCount} dòng không hợp lệ</Tag>
								<br />
								Bạn hãy kiểm tra lại dữ liệu hoặc loại bỏ những dòng không hợp lệ để có thể Lưu dữ liệu vào hệ thống.
								{/* Bạn có thể kiểm tra lại trước khi Lưu dữ liệu vào hệ thống! */}
							</>
						) : (
							<>
								<span className='fw500'>Thực hiện lưu </span>
								<Tag color='red'>{errorCount} dòng không thành công</Tag>
							</>
						)}
					</Col>
				) : !isError ? (
					<Col span={24}>
						<Space style={{ marginTop: 12, marginBottom: 12, justifyContent: 'center', width: '100%' }} align='center'>
							<CheckCircleOutlined style={{ fontSize: 24, color: '#08b34f' }} />
							<span className='fw500' style={{ fontSize: 18, color: '#08b34f' }}>
								Tất cả dữ liệu {importResponses.length} hàng đã được {step === 0 ? 'kiểm tra hợp lệ' : 'lưu thành công'}
							</span>
						</Space>
					</Col>
				) : (
					<Col span={24}>
						<div style={{ color: 'red' }}>Có lỗi xảy ra!</div>
					</Col>
				)
			) : (
				<div style={{ width: '100%', textAlign: 'center', marginTop: 12, marginBottom: 12 }}>
					<Spin spinning />
				</div>
			)}

			{importResponses.length ? (
				<Col span={24}>
					<Collapse defaultActiveKey={errorCount ? 0 : undefined}>
						<Collapse.Panel key={0} header='Danh sách chi tiết'>
							<TableStaticData
								columns={columns}
								data={importResponses}
								loading={formSubmiting}
								size='small'
								otherProps={{ bordered: true }}
								hasTotal
							/>
						</Collapse.Panel>
					</Collapse>
				</Col>
			) : null}

			<Col span={24}>
				<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
					<Button onClick={() => onBack()} icon={<ArrowLeftOutlined />}>
						Quay lại
					</Button>

					{step === 0 ? (
						<Popconfirm
							title={
								errorCount ? (
									<>
										Tồn tại dữ liệu không hợp lệ
										<br />
										Vẫn xác nhận Lưu dữ liệu?
									</>
								) : (
									'Xác nhận lưu dữ liệu vào hệ thống?'
								)
							}
							onConfirm={onExecute}
							disabled={isError || !!errorCount}
						>
							<Button
								htmlType='submit'
								type='primary'
								loading={formSubmiting}
								icon={<SaveOutlined />}
								disabled={isError || !!errorCount}
							>
								Lưu dữ liệu
							</Button>
						</Popconfirm>
					) : (
						<Button onClick={onCancel}>Hoàn thành</Button>
					)}
				</Space>
			</Col>
		</Row>
	);
};

export default ValidateDataImport;
