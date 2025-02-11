/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable spellcheck/spell-checker */
import axios, { AxiosResponse } from "axios"
import { User } from "~/state/auth";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1"
})

client.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  return config;
})

client.interceptors.response.use(response => {
  const endTime = new Date();
  const duration = endTime - response.config.metadata.startTime;
  console.log(`Request took ${duration}ms`);
  return response;
})

client.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response) {
    // ステータスコードに応じたエラーハンドリング
    switch (error.response.status) {
      case 400:
        console.error('Bad Request: ', error.response.data);
        break;
      case 500:
        console.error('Server Error: ', error.response.data);
        break;
      default:
        console.error('Error: ', error.response.status, error.response.data);
    }
  } else if (error.request) {
    // リクエストが送信されたが、レスポンスがない場合
    console.error('No response received from server');
  } else {
    // リクエスト設定時にエラーが発生した場合
    console.error('Request setup error: ', error.message);
  }
  return Promise.reject(error);
});

export const Apis = {
  // GET
  get: async function (path: string, data: any, params?: any) {
    return await client.get(path, data)
      .then((res) => {
        // console.log(res.data)
        return res.data
      })
      .catch((error) => {
        return error.response
      })
  },
  getWithToken: async function (path: string, accessToken: string,  data?: any, params?: any) {
    return await client.get(path, {
      data: data,
      params: params,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      },
    })
      .then((res) => {
        // console.log(res.data)
        return res.data
      })
      .catch((error) => {
        return error.response
      })
  },
  // GET_USER_DETAIL
  getUserDetail: async function (path: string, data: any, params?: any) {
    return await client.get<User>(path, {
      data: data,
      params: params,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
      .then((res) => {
        // console.log(res.data)
        return res.data
      })
      .catch((error) => {
        return error.response
      })
  },
  // actionからのAPI通信は「aixos.post」を使用
  post: async function (path: string, data: any, params?: any) {
    return await client.post(path, data, {
      params: params,
    })
      .then((res) => {
        console.log(res.data)
        return res
      })
      .catch((error) => {
        return error.response
      })
  },
  postToken: async function (path: string, data: any, params?: any) {
    return await client.post(path, data, {
      params: params,
      headers: { 'Authorization': `Bearer ${data.access_token}` }
    })
      .then((res) => {
        console.log(res.data)
        return res
      })
      .catch((error) => {
        return error.response
      })
  },
  // カスタムメソッドからのAPI通信は「aixos.postForm」を使用
  postForm: async function (path: string, data: any, params?: any) {
    return await client.postForm(path, data, {
      params: params,
      headers: { 'content-type': 'application/json' },
    })
      .then((res) => {
        console.log(res.data)
        return res
      })
      .catch((error) => {
        console.log(error.response)
        return error.response
      })
  },
  // PUT
  put: async function (path: string, data: any, accessToken: string) {
    return await client.put(path, data, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then((res) => {
        console.log(res.data)
        return res
      })
      .catch((error) => {
        return error.response
      })
  }
}