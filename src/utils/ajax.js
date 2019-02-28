import axios from 'axios'
axios.defaults.timeout = 50000;                      //响应时间
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.headers['Content-Type'] = "application/json";
axios.defaults.baseURL = config.interfaceUrl[0];   //配置接口地址

axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method == 'get') {//axios中设置Content-Type不生效的问题
        config.data = true
    }
    let url = config.url;
    if (url.indexOf('?') > -1) {
        url += '&access_token=' + user.accessToken
    } else {
        url += '?access_token=' + user.accessToken
    }
    config.url = url;
    return config;
},(error) =>{
    return Promise.reject(error);
});
 
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.status==200){
        return Promise.reject(res);
    }
    return res;
}, (error) => {
    return Promise.reject(instance);
});
export default axios;