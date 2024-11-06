import axios from "axios";

axios.defaults.baseURL ="https://apirecognitionrn-fyfgbdh0bch5e5ek.mexicocentral-01.azurewebsites.net"


axios.interceptors.request.use(
  async (config) => {
   
      config.headers["Content-Type"] = "multipart/form-data"
      return config;

  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.request.use(request => {
    return request;
});


export const methods = {
    get : (url:string)=>axios.get(url),
    post : (url:string, body : any)=>axios.post(url,body),
}


export default methods;
