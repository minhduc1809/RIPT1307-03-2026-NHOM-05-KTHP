import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const useInitService = (url: string) => {
  const getService = (payload: { page: number; limit: number; condition?: any }, path?: string) => {
    const finalPath = path ? `${ip3}/${url}/${path}` : `${ip3}/${url}`;
    return axios.get(finalPath, { params: payload });
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

  const getAllService = (payload?: { condition?: any }) => {
    return axios.get(`${ip3}/${url}/many`, { params: payload });
  };

  const getByIdService = (id: string | number) => {
    return axios.get(`${ip3}/${url}/${id}`);
  };

  return {
    getService,
    getByIdService,
    postService,
    putService,
    deleteService,
    getAllService,
  };
};

export default useInitService;
