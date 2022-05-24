import { nextTick, reactive, UnwrapRef } from 'vue';
import useAxios from '@/utils/useAxios';
import { isObject } from '@fe/utils';
import { AxiosRequestConfig } from 'axios';

/**
 * table表格use
 * @param config 请求配置 TableHookConfig
 * @param T 泛型参数T 列表数据行的类型
 * @param S 泛型参数S 列表查询条件对象的类型
 * @returns TableHookRes
 */
export default function useTable<T = any, S = TableOptions>(config: TableHookConfig<S>): TableHookRes<T, S> {
  const defaultBeforeSearch = () => true;
  const defaultValidFun = () => {
    return { status: true } as beforeHookRes;
  };

  let sourceData: T[] = [];
  if (config.tableData) {
    sourceData = JSON.parse(JSON.stringify(config.tableData));
  }

  let hookRes = reactive({
    loadType: config.loadType ? config.loadType : 'always',
    tableOptions: JSON.parse(JSON.stringify(config.tableOptions || {})) as S,
    oldOptions: JSON.parse(JSON.stringify(config.tableOptions || {})) as S,
    sendOptions: {} as S,
    axiosConfig: JSON.parse(JSON.stringify(config.axiosConfig || {})) as AxiosRequestConfig,
    data: sourceData,
    extendData: config.loadType === 'none' ? sourceData : null,
    pagination: { page: 1, pageSize: 10, total: sourceData.length, layout: 'total,sizes, prev, pager, next, jumper' },
    beforeSearch: config.beforeSearch || defaultBeforeSearch,
    beforeFetch: config.beforeFetch || defaultValidFun,
    beforeResolve: config.beforeResolve || defaultValidFun,
    search: () => {
      return new Promise<void>(async (resolve, reject) => {
        // 查询前 校验参数
        if (typeof hookRes.beforeSearch === 'function') {
          const valid = await hookRes.beforeSearch();
          if (!valid) return resolve();
        }

        // 记录请求参数
        Object.keys(hookRes.tableOptions as S).forEach(key => {
          hookRes.sendOptions[key] = hookRes.tableOptions[key];
        });
        hookRes.pagination.page === 1;
        await hookRes.fetchData();
        resolve();
      });
    },
    pageCurrentChange: (val: number) => {
      return new Promise<void>(async (resolve, reject) => {
        hookRes.pagination.page = val;
        await hookRes.fetchData();
        resolve();
      });
    },
    pageSizeChange: async (val: number) => {
      return new Promise<void>(async (resolve, reject) => {
        hookRes.pagination.pageSize = val;
        if (Math.ceil(hookRes.pagination.total / val) >= hookRes.pagination.page) {
          await nextTick();
          await hookRes.fetchData();
        }
        resolve();
      });
    },
    reset: (reload = true) => {
      return new Promise<void>(async (resolve, reject) => {
        Object.keys(hookRes.tableOptions as S).forEach(key => {
          hookRes.tableOptions[key] = hookRes.oldOptions[key];
        });
        if (reload) {
          await hookRes.search();
        }
        resolve();
      });
    },
    fetchData: () => {
      return new Promise<void>(async (resolve, reject) => {
        let options = JSON.parse(
          JSON.stringify({
            page: hookRes.pagination.page,
            pageSize: hookRes.pagination.pageSize,
            ...(hookRes.sendOptions as S)
          })
        );

        // 发送请求前 可以执行beforeFetch钩子 可对请求参数修改处理
        if (typeof hookRes.beforeFetch === 'function') {
          const valid = await hookRes.beforeFetch(options);
          if (valid.status === true) {
            if (valid.data) options = valid.data;
          } else {
            return resolve();
          }
        }

        // 处理请求参数
        hookRes.axiosConfig.method = hookRes.axiosConfig.method || 'post';
        const method = hookRes.axiosConfig.method.toLowerCase();

        let sendConfig = JSON.parse(JSON.stringify(hookRes.axiosConfig));
        // 合并请求参数 仅支持get、delete、post、put
        // axiosConfig.params、axiosConfig.data仅支持{} 其他格式将被忽略

        if (method === 'get' || method === 'delete') {
          if (isObject(hookRes.axiosConfig.params)) {
            sendConfig.params = { ...hookRes.axiosConfig.params, ...options };
          } else {
            sendConfig.params = options;
          }
        }
        if (method === 'post' || method === 'put') {
          if (isObject(hookRes.axiosConfig.data)) {
            sendConfig.data = { ...hookRes.axiosConfig.data, ...options };
          } else {
            sendConfig.data = options;
          }
        }

        // 发送请求
        let result: any;

        if (hookRes.loadType === 'none') {
          // none表示表格数据从外部传入 不需要请求接口
          result = sourceData;
        } else if (hookRes.loadType === 'once') {
          // once一次性请求完列表所有数据 不需要动态分页
          if (!hookRes.extendData) {
            // extendData记录的是原始数据
            result = await useAxios<AxiosTableResponse<T>>(sendConfig);
            hookRes.extendData = JSON.parse(JSON.stringify(result));
          } else {
            result = hookRes.extendData;
          }
        } else {
          // 否则 loadType==="always"表示每次都请求接口
          result = await useAxios<AxiosTableResponse<T>>(sendConfig);
          hookRes.extendData = JSON.parse(JSON.stringify(result));
        }

        // 请求完成后 在返回数据前 执行beforeResolve  可对axios返回的数据做修改
        // 对于一次性加载的数据 如果需要分页 需要页面自己在beforeResolve里进行数据过滤
        if (typeof hookRes.beforeResolve === 'function') {
          const valid = await hookRes.beforeResolve(result);
          if (valid.status === true) {
            if (valid.data) result = valid.data;
          } else {
            return resolve();
          }
        }

        if (result) {
          hookRes.pagination.total = result.count || 0;
          hookRes.data = result.data || [];
        } else {
          hookRes.pagination.total = 0;
          hookRes.data = [];
        }
        resolve();
      });
    }
  });
  return hookRes as TableHookRes<T, S>;
}
