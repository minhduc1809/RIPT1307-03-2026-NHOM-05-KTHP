import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useInitService = (url: string, ip?: string) => {
  const getService = (payload: { page: number; limit: number; condition?: any }, path?: string) => {
    const finalPath = path ? `${ip ?? ip3}/${url}/${path}` : `${ip ?? ip3}/${url}`;
    return axios.get(finalPath, { params: payload });
  };

  const postService = (payload: any) => {
    return axios.post(`${ip ?? ip3}/${url}`, payload);
  };

  const putService = (id: string | number, payload: any) => {
    return axios.put(`${ip ?? ip3}/${url}/${id}`, payload);
  };

  const deleteService = (id: string | number) => {
    return axios.delete(`${ip ?? ip3}/${url}/${id}`);
  };

  const getAllService = (payload?: { condition?: any; sort?: any }) => {
    return axios.get(`${ip ?? ip3}/${url}/many`, { params: payload });
  };

  const getByIdService = (id: string | number) => {
    return axios.get(`${ip ?? ip3}/${url}/${id}`);
  };

  const getImportHeaders = () => {
    return axios.get(`${ip ?? ip3}/${url}/import/definition`, { data: { silent: true } });
  };

  const getImportTemplate = () => {
    return axios.get(`${ip ?? ip3}/${url}/import/template/xlsx`, {
      responseType: 'arraybuffer',
    });
  };

  const postValidateImport = (payload: any) => {
    return axios.post(`${ip ?? ip3}/${url}/import/validate`, payload);
  };

  const postExecuteImport = (payload: any) => {
    return axios.post(`${ip ?? ip3}/${url}/import/insert`, payload);
  };

  return {
    getService,
    getByIdService,
    postService,
    putService,
    deleteService,
    getAllService,
    getImportHeaders,
    getImportTemplate,
    postValidateImport,
    postExecuteImport,
  };
};

export default useInitService;
