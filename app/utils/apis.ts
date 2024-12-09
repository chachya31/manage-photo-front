/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable spellcheck/spell-checker */
import axios from "axios"

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

client.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  return config;
})

client.interceptors.response.use(response => {
  console.log("time")
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
  /**
   * 
   * @param path 
   * @param data 
   * @param params 
   * @returns 
   */
  post: async function (path: string, data: any, params?: any) {
    return await client.post(path, data, {
      params: params
    })
      .then((res) => {
        console.log(res)
        return res
      })
      .catch((error) => {
        return error.response
      })
  }
}