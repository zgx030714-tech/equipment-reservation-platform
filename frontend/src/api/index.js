import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '', // 因为我们在 Vite 里配了代理，这里留空即可
  timeout: 10000,
});

// 响应拦截器：精准对接 Java 后端的 Result<T>
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果后端状态码为 200，说明业务成功，直接返回 data 里的内容
    if (res.code === 200) {
      return res.data; 
    }
    return Promise.reject(new Error(res.msg || '服务器异常'));
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 具体的业务接口 API ---

// 1. 分页查询科研设备列表
export const queryEquipmentPage = (data) => {
  return request.post('/api/v1/equipment/page', data); // 对应你写好的 Controller 路径
};
// 查询所有实验室
export const getOrganizationList = () => {
  return request.get('/api/v1/organization/list');
};

// 2. 录入新设备
export const addEquipment = (data) => {
  return request.post('/api/v1/equipment/add', data); 
};

// 3. 下架（逻辑删除）设备
export const deleteEquipment = (id) => {
  return request.delete(`/api/v1/equipment/${id}`);
};

// 4. 提交设备预约订单
export const submitReservation = (data) => {
  return request.post('/api/v1/reservation/submit', data);
};