import config from '@/config/config';

/**=================S api集合=================**/

/**=================E api集合=================**/

/**=================S baseApi集合=================**/
const baseURL = config.baseURL;

let baseApi: ApiUrl = {};
baseApi.baseURL = baseURL;
// 图片上传
baseApi.upload = config.uploadURL + '/common/api/file/upload';
// 登录
baseApi.login = baseURL + '/admin/login';
// 获取当前用户菜单
baseApi.getUserMenuTree = baseURL + '/v1/menu/tree/list';
// 获取所有字典 Map
baseApi.queryDictAll = baseURL + '/v1/dict/map';
// 获取当前登录用户信息
baseApi.getUserInfo = baseURL + '/getUserInfo';

/**=================E baseApi集合=================**/

// 导出全部api
let api: ApiUrl = {
  ...baseApi
};
export default api;
