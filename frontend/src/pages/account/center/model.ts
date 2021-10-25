import { getInfo } from '@/services/ant-design-pro/api';

import type { Effect, Reducer } from 'umi';
import type { ListItemDataType } from './data.d';
import { queryFakeList } from './service';

export interface ModalState {
  currentUser: Partial<Login.Profile>;
  list: ListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchCurrent: Effect;
    fetch: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
    queryList: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountAndcenter',

  state: {
    currentUser: {},
    list: [],
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response?.data?.data ?? {},
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...(state as ModalState),
        currentUser: action.payload || {},
      };
    },
    queryList(state, action) {
      return {
        ...(state as ModalState),
        list: action.payload,
      };
    },
  },
};

export default Model;
