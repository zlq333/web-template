import { reactive, ref, toRef } from 'vue';

/**
 * 时间范围控件绑定及赋值
 * @param tableOptions 列表查询条件对象
 * @param  startKey tableOptions中开始时间的key
 * @param endKey tableOptions中结束时间的key
 * @param changeCallback 可选 时间控件值变更的回调
 * @returns
 */
export default function useDate(
  tableOptions: TableOptions,
  startKey: string,
  endKey: string,
  changeCallback?: Function
) {
  const vModel = ref<any[]>();
  const startValue = toRef(tableOptions, startKey);
  const endValue = toRef(tableOptions, endKey);
  const handleValueChange = (val: any) => {
    if (val && val.length) {
      startValue.value = val[0];
      endValue.value = val[1];
    } else {
      startValue.value = '';
      endValue.value = '';
    }
    if (changeCallback && typeof changeCallback === 'function') changeCallback(val);
  };
  return reactive({
    vModel,
    handleValueChange
  });
}
