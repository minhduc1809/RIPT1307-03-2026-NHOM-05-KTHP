import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useInitService = (url: string) => {
  const getPageableService = (payload: { page: number; limit: number; condition?: any }) => {
    return axios.get(`${ip3}/${url}/pageable`, { params: payload });
  };

  const getService = (payload: { page: number; limit: number; condition?: any }) => {
    return axios.get(`${ip3}/${url}`, { params: payload });
  };

  const postService = (payload: any) => {
    return axios.post(`${ip3}/${url}`, payload);
  };

  const putService = (id: string | number, payload: any) => {
    return axios.put(`${ip3}/${url}/${id}`, payload);
  };

  const deleteService = (id: string | number) => {
    return axios.delete(`${ip3}/${url}/${id}`);
  };

  const getAllService = () => {
    return axios.get(`${ip3}/${url}/all`);
  };

  const getByIdService = (id: string) => {
    return axios.get(`${ip3}/${url}/${id}`);
  };

  return {
    getService,
    getByIdService,
    getPageableService,
    postService,
    putService,
    deleteService,
    getAllService,
  };
};

export default useInitService;
