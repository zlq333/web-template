// 配置文件
import publicKey from './publicKey';
const NODE_ENV = process.env.NODE_ENV;
console.log('this node_env is ' + NODE_ENV);

const VITE_BUILDENV = import.meta.env.VITE_BUILDENV;
console.log('this vite_build_env is ' + VITE_BUILDENV);

const VITE_SYSTEM_NAME = import.meta.env.VITE_SYSTEM_NAME; // 项目名称

const defaultConfig = {
  env: VITE_BUILDENV,
  tokenKey: 'Authorization',
  systemName: VITE_SYSTEM_NAME,
  keepAlive: true,
  checkPermession: true
};

const config = {
  // 内网配置
  dev: {
    publicKey: publicKey.dev,
    baseURL: 'http://192.168.5.189:9902/mp-api-running',
    uploadURL: 'http://192.168.6.12:8155',
    checkPermession: true
  },
  // 测试配置
  test: {
    publicKey: publicKey.test,
    baseURL: 'http://running-mp-mls.test027.com/mp-api-running',
    uploadURL: 'http://boot-service.test.wyyt.cc',
    checkPermession: true
  },
  // 生产配置
  prod: {
    publicKey: publicKey.prod,
    baseURL: 'http://mpt.coalscc.com/mp-api-trade',
    uploadURL: 'https://boot-service.sijibao.com',
    checkPermession: true
  }
};

// 根据环境变量 导出对应配置
let projectConfig: Config;
if (NODE_ENV === 'development' || VITE_BUILDENV === 'dev') {
  /**
   * debug_server -> 调试服务器
   * 在开发模式下 为方便调试  开发者可自行修改debug_server 用本地项目连接不同的目标服务器
   * debug_server：dev  开发服务器(默认)
   * debug_server：test 测试服务器
   * debug_server：prod 生产服务器
   */

  let envkey = localStorage.getItem('debug_server') || 'dev';
  if (envkey != 'dev' && envkey != 'test' && envkey != 'prod') envkey = 'dev';

  projectConfig = { ...defaultConfig, ...config[envkey] };

  if (envkey === 'dev') {
    // 本机开发模式默认连接内网服务器
    // 若本地localStorage存在dev_host 则覆盖默认目标
    const dev_host = localStorage.getItem('dev_host') || '';

    if (dev_host) projectConfig.baseURL = dev_host;
  }
} else {
  projectConfig = { ...defaultConfig, ...config[VITE_BUILDENV as string] };
}
export default projectConfig;
