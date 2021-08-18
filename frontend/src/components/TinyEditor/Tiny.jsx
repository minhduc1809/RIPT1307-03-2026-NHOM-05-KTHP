import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import uuidv1 from 'uuid/v1';
// import lang from './vi';
import { uploadFile } from '@/services/uploadFile';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props?.value?.text ?? '',
    };
  }

  triggerChange = (changedValue) => {
    // console.log('Content was updated:', changedValue);

    this.setState({ text: changedValue }, () => {
      const { onChange } = this.props;
      if (onChange) {
        onChange({ text: this.state.text, ...changedValue });
      }
    });
  };

  // handleEditorChange = (content, editor) => {
  //   console.log('Content was updated:', content);
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  imageHandler = (callback, value, meta) => {
    const input = document.createElement('input');
    // Tạo input file và click luôn
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    // eslint-disable-next-line func-names
    input.onchange = async function () {
      const file = input.files[0];

      // Up ảnh lên và lấy url
      const response = await uploadFile(file);
      // Chèn ảnh vào dưới dạng url
      callback(response?.data?.data ?? '', {
        alt: 'image',
        uid: response?.data?.data,
        name: response?.data?.data.split('/').pop().substring(26),
        status: 'done',
        // response?.data?.data,
        key: uuidv1(),
      });
    };
  };

  render() {
    return (
      <>
        <Editor
          apiKey="rai2uglmfyaqnomirbfm4q7w3fvjmq47u39rwpg798cccvdc"
          value={this.state.text}
          init={{
            language_url: '/tiny/vi.js',
            language: 'vi',
            height: 500,
            menubar: 'file edit view insert format tools table help',
            plugins: [
              'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
            ],
            toolbar:
              'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            // toolbar_sticky: true,
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            image_caption: true,
            quickbars_selection_toolbar:
              'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            // content_css: '//www.tinymce.com/css/codepen.min.css',
            contextmenu: 'link image imagetools table',

            file_picker_callback: this.imageHandler,
            paste_data_images: true,
          }}
          onEditorChange={this.triggerChange}
        />
        <input id="my-file" type="file" name="my-file" style={{ display: 'none' }} onChange="" />
      </>
    );
  }
}

export default App;
