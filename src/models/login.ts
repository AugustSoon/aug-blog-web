import { Reducer } from 'redux';
import { Effect } from 'dva';
import router from 'umi/router';

import { accountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority, setToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  message?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: { ...response, type: payload.type },
      });
      // Login successfully
      if (response.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/admin';
            return;
          }
        }
        router.replace(redirect || '/admin');
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      // 删除token
      setToken('');
      // 跳转地址
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.data.currentAuthority) setAuthority(payload.data.currentAuthority);

      const status = payload.code > 0 ? 'error' : 'ok';

      if (status === 'ok' && payload.data.token) setToken(payload.data.token);

      return {
        ...state,
        status,
        type: payload.type,
        message: payload.message || '',
      };
    },
  },
};

export default Model;
