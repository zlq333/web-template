import { AxiosRequestConfig } from 'axios';
declare global {
  // 表格请求参数
  interface TableOptions {
    [prop: string]: any;
  }
  // 表格返回的数据结构
  interface AxiosTableResponse<T> {
    count: number;
    data: T[];
    [prop: string]: any;
  }
  // 分页对象
  interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    layout: string;
  }
  // 加载方式 none表示table数据不请求接口 外部传入 once表示一次性请求完所有数据 always表示常规分页
  type LoadType = 'none' | 'once' | 'always';

  // useTable的config
  interface TableHookConfig<T extends TableOptions> {
    tableOptions?: T; // 表格查询条件
    axiosConfig?: AxiosRequestConfig; // 表格发送请求的配置(同axios配置)
    tableData?: any; // LoadType为none时 需要传入表格数据
    loadType?: LoadType; // 加载方式
    beforeSearch?: () => boolean | Promise<boolean>; // 查询前拦截器 可用于校验参数 校验不通过请返回false
    beforeFetch?: (options: any) => beforeHookRes | Promise<beforeHookRes>; // 发送请求前钩子 可用于处理send参数 不通过请返回{status:false}
    beforeResolve?: (options: any) => beforeHookRes | Promise<beforeHookRes>; // 请求完成后钩子 可对源数据进行处理 不通过请返回{status:false}
  }
  // useTable的返回结构
  interface TableHookRes<T = any, S extends TableOptions> {
    tableOptions: S; // 列表查询条件
    axiosConfig: AxiosRequestConfig; // axios请求配置
    loadType: LoadType; // 加载方式
    beforeSearch: () => boolean | Promise<boolean>; // 查询按钮触发前的回调
    beforeFetch: (options: any) => beforeHookRes | Promise<beforeHookRes>; // 查询按钮触发后请求发出前的回调
    beforeResolve: (options: any) => beforeHookRes | Promise<beforeHookRes>; // 请求发出且城后的回调
    sendOptions: S; // 列表查询条件(实际请求发送的参数)
    oldOptions: S; // 原生参数 用于重置查询条件
    data: T[]; // 处理后的表格数据源
    extendData: any; // 请求返回的原始数据或者传入的原始数据
    pagination: Pagination; // 分页对象
    search: () => Promise<void>; // 列表接口查询方法
    reset: (reload: boolean = true) => Promise<void>; // 列表请求参数重置方法
    pageCurrentChange: (val: number) => Promise<void>; // 列表分页变更方法
    pageSizeChange: (val: number) => Promise<void>; // 列表分页数码变更方法
    fetchData: () => Promise<void>; // 列表请求方法
  }
  // before回调的返回结构
  interface beforeHookRes {
    status: boolean;
    data?: any;
  }
}
