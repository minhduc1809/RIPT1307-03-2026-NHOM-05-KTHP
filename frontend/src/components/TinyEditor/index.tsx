import { EFileScope, uploadFile } from '@/services/uploadFile';
import { Editor } from '@tinymce/tinymce-react';
import './style.less';

const TinyEditor = (props: {
	value?: string;
	onChange?: (val: string) => void;
	height?: number;
	hideMenubar?: boolean;
	miniToolbar?: boolean;
	disabled?: boolean;
}) => {
	const { value, onChange, height, hideMenubar, miniToolbar, disabled } = props;

	const triggerChange = (changedValue: string) => {
		if (onChange) {
			onChange(changedValue);
		}
	};

	const imageHandler = (callback: any) => {
		const input = document.createElement('input');
		// Tạo input file và click luôn
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();
		// eslint-disable-next-line func-names
		input.onchange = async function () {
			const file = input.files?.[0] ?? '';

			// Up ảnh lên và lấy url
			const response = await uploadFile({
				file,
				scope: EFileScope.PUBLIC,
			});
			// Chèn ảnh vào dưới dạng url
			callback(response?.data?.data?.url ?? '', {
				alt: 'image',
				uid: response?.data?.data,
				name: response?.data?.data?.file?.name,
				status: 'done',
				// response?.data?.data,
			});
		};
	};

	return (
		<>
			<Editor
				// apiKey='ihu6rlypska4k9h96g5x752rocpj133f20q41afy85shcrc5'
				apiKey='vrh3rpim05kai51zg4tcenfbzwhl243use11yolfq6d9ufvw'
				value={value}
				disabled={disabled}
				init={{
					language_url: '/lang/vi_VN.js',
					language: 'vi_VN',
					height: height ?? 500,
					menubar: hideMenubar || disabled ? false : 'file edit view insert table format tools',
					plugins: [
						// 'advlist',
						'autolink',
						'lists',
						'link',
						'image',
						'charmap',
						// 'anchor',
						'searchreplace',
						'visualblocks',
						'code',
						'fullscreen',
						'insertdatetime',
						'media',
						'table',
						'preview',
						// 'help',
						'wordcount',
						// 'print',
						// 'paste',
						// 'importcss',
						// 'autosave',
						// 'save',
						'directionality',
						'visualchars',
						// 'template',
						// 'codesample',
						// 'hr',
						// 'pagebreak',
						'nonbreaking',
						// 'toc',
						// 'imagetools',
						// 'textpattern',
						// 'noneditable',
						'quickbars',
						'emoticons',
						// "editimage"
					],
					toolbar: disabled
						? ''
						: miniToolbar
						? 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify |  numlist bullist | forecolor backcolor removeformat'
						: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat |  table image media link | charmap emoticons | fullscreen  preview  print',
					// toolbar_sticky: true,
					autosave_ask_before_unload: true,
					image_advtab: true,
					image_caption: true,
					quickbars_selection_toolbar: 'bold italic | forecolor backcolor | quicklink h2 h3 blockquote',
					quickbars_insert_toolbar: false,
					noneditable_noneditable_class: 'mceNonEditable',
					toolbar_mode: 'sliding',
					contextmenu: 'link image imagetools table',
					file_picker_callback: imageHandler,
					paste_data_images: true,
				}}
				onEditorChange={triggerChange}
			/>
			<input id='my-file' type='file' name='my-file' style={{ display: 'none' }} />
		</>
	);
};

export default TinyEditor;
