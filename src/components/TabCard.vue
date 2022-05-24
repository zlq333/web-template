<template>
  <el-tabs
    v-model="tabActive"
    type="card"
    class="layout-tab-card"
    :closable="tabList.length > 1"
    @tab-remove="onRemoveTab"
    @tab-click="onClickTab"
  >
    <el-tab-pane v-for="(item, index) in tabList" :key="item.name" :name="item.name">
      <template #label>
        <el-dropdown trigger="contextmenu" @command="(command:string) => contextMenuClick(command, item, index)">
          <span>{{ item.meta.title }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="current">关闭当前</el-dropdown-item>
              <el-dropdown-item command="left">关闭左侧</el-dropdown-item>
              <el-dropdown-item command="right">关闭右侧</el-dropdown-item>
              <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { computed, defineComponent, unref } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const globalStore = useGlobalStore();
    const router = useRouter();

    // 计算属性默认是只读的 当使用写入操作是 要set
    const tabActive = computed({
      get: () => globalStore.tabActive,
      set: val => (globalStore.tabActive = val)
    });

    const tabList = computed<any[]>(() => globalStore.tabList);
    const keepAliveRouter = computed<any[]>(() => globalStore.keepAliveRouter);

    // 点击tab
    const onClickTab = (tab: any) => {
      const selected = tabList.value.find((item: any) => item.name === tab.props.name);
      selected && router.push(selected);
    };

    // 点击X删除tab
    const onRemoveTab = async (tabName: string) => {
      if (tabList.value.length === 1) return;

      let jumpTab = null;
      // 如果删除的是当前tab 记录删除后要跳转的tab(有右边跳右边 没右边跳左边 )
      if (tabActive.value === tabName) {
        const tabs = unref(tabList);
        const index = tabs.findIndex(item => item.name === tabName);
        if (index === 0) {
          // 当前tab第一个
          jumpTab = tabs[index + 1];
        } else if (index === tabs.length - 1) {
          // 当前tab最后一个
          jumpTab = tabs[index - 1];
        } else {
          // 当前tab在中间
          jumpTab = tabs[index + 1];
        }
      }

      globalStore.removeTab(tabName);
      // 移除缓存
      globalStore.removeKeepAlive(tabName);
      // 当前tab被删除
      if (tabActive.value === tabName) {
        router.push(jumpTab.path)
      }
    };

    // 右键菜单项点击
    const contextMenuClick = async (command: any, tab: any, idx: number) => {
      command = command as string;
      if (tabList.value.length === 1) return;

      const tabs = unref(tabList);
      let removeTabs: any[] = [];
      let newTabs: any[] = [];

      if (command === 'current') {
        // 关闭当前
        onRemoveTab(tab.name);
        return;
      } else if (command === 'left') {
        // 关闭左侧
        if (idx === 0) return;
        removeTabs = tabs.slice(0, idx);
        newTabs = tabs.slice(idx);
      } else if (command === 'right') {
        // 关闭右侧
        if (idx === tabs.length - 1) return;
        removeTabs = tabs.slice(idx + 1);
        newTabs = tabs.slice(0, idx + 1);
      } else {
        // 关闭其他
        removeTabs = tabs.filter(el => el.name !== tab.name);
        newTabs = tabs.slice(idx, idx + 1);
      }

      // 更新tab
      globalStore.clearTabView(newTabs);
      // 去除缓存
      const newKeepAlive = keepAliveRouter.value.filter(rname => {
        return !(removeTabs.findIndex(item => item.name === rname) > -1);
      });
      globalStore.clearKeepAlive(newKeepAlive);

      // 更新tab后 判断如果当前tab被删除
      if (removeTabs.findIndex(item => item.name === tabActive.value) > -1) {
        if (command === 'left') {
          const path = tabList.value[0].href;
          history.pushState(null, path, path);
        }
        if (command === 'right') {
          const path = tabList.value[tabList.value.length - 1].href;
          history.pushState(null, path, path);
        }
        if (command === 'other') {
          const path = tabList.value[0].href;
          history.pushState(null, path, path);
        }
      }
    };

    return {
      tabActive,
      tabList,
      onClickTab,
      onRemoveTab,
      contextMenuClick
    };
  }
});
</script>
<style lang="postcss">
.layout-tab-card {
  margin-top: 5px;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__item {
    position: relative;
    height: 34px;
    line-height: 34px;
  }
  .el-tabs__item:focus,
  .el-tabs__item.is-focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .el-tabs__item:hover,
  .el-tabs__item.is-active {
    .el-dropdown {
      color: var(--base-color);
    }
  }
  .el-tabs__item.is-active {
    border-bottom-color: #f5f7fb !important;
  }
}
.layout-tab-card.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border-radius: 2px 2px 0 0;
}
</style>
