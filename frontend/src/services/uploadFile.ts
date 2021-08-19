// import axios from 'axios';

export async function uploadFile(file: string | Blob) {
  const form = new FormData();
  form.append('fileUpload', file);
  //  return axios.post(`${ip3}/upload-chung/general`, form);
}
