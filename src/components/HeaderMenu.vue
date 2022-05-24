<template>
  <div class="layout-header-logo">
    <img class="header-logo" :src="systemLogo" />
  </div>
  <div class="layout-header-name">{{ systemName }}</div>
  <div class="layout-header-menu">
    <el-menu
      v-if="layout.layout === 'TB'"
      mode="horizontal"
      :default-active="sideActive"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      @select="onMenuSelected"
    >
      <hander-loop-menu
        v-for="el in menuTree"
        :key="el.menuId"
        :node="el"
        :layoutStyle="layoutStyle"
      ></hander-loop-menu>
    </el-menu>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import HanderLoopMenu from './HanderLoopMenu.vue';
import { getStorage } from '@fe/utils';
import defaultLogoUrl from '@/assets/img/logo_default.png';
import { useRouter } from 'vue-router';
import projectConfig from '@/config/config';

// 找到sideActive节点的所有父节点
const getParentNodes = (menuTree: MenuNode[], active: string) => {
  if (!active) return [];
  let tempNodes: MenuNode[] = [];
  let parentNodes: MenuNode[] = [];
  let isOver = false;
  function loopTree(list: MenuNode[], level: number) {
    list.forEach((item, idx) => {
      item.menuLevel = level;
      item.children = item.children || [];
      tempNodes.splice(level - 1);

      tempNodes[level - 1] = item;
      if (item.menuUrl === active) {
        if (!isOver) {
          parentNodes = JSON.parse(JSON.stringify(tempNodes));
          isOver = true;
        }
      }
      if (item.children.length > 0) {
        loopTree(item.children, item.menuLevel + 1);
      }
    });
  }
  loopTree(menuTree, 1);
  return parentNodes;
};

export default defineComponent({
  components: { HanderLoopMenu },
  props: {
    layoutStyle: {
      type: String,
      required: true
    }
  },
  setup(props: any) {
    const router = useRouter();
    const globalStore = useGlobalStore();
    const layout = computed<Layout>(() => globalStore.layout);
    const menuTree = computed(() => globalStore.menuTree);

    // 一级导航选择项目
    const navActive = computed(() => globalStore.navActive);
    // 二级导航选中项
    const sideActive = computed(() => globalStore.sideActive);

    const onMenuSelected = (index: string, indexPath: string, item: MenuNode, routeResult: boolean) => {
      router.push(index);
    };

    const userData = getStorage('userData') || {};
    const systemName = userData.companyName ? userData.companyName : projectConfig.systemName;
    const systemLogo = userData.logo ? userData.logo : defaultLogoUrl;

    const backgroundColor = ref('');
    const textColor = ref('');
    const activeTextColor = ref('');
    watchEffect(() => {
      if (layout.value.style === 'is-dark') {
        backgroundColor.value = '#121C32  ';
        textColor.value = '#eeeeee';
        activeTextColor.value = layout.value.theme;
      } else {
        backgroundColor.value = layout.value.theme;
        textColor.value = '#ffffff';
        activeTextColor.value = layout.value.theme;
      }
    });

    return {
      menuTree,
      navActive,
      sideActive,
      systemName,
      layout,
      onMenuSelected,
      backgroundColor,
      textColor,
      activeTextColor,
      systemLogo
    };
  }
});
</script>
<style lang="postcss">
.layout-header-logo {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  overflow: hidden;
  margin-left: 16px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.layout-header-name {
  flex: 0 0 auto;
  margin-left: 15px;
}
.layout-header-menu {
  margin-left: 20px;
  flex: 1 1 auto;
  margin-right: 20px;
  border-bottom: none;
  box-sizing: border-box;
  .el-menu {
    width: 100%;

    .menu-title {
      margin-left: 5px;
      line-height: 1;
    }
    .el-menu-item,
    .el-sub-menu__title {
      height: 50px !important;
    }
  }
  .el-menu {
    .el-menu-item:hover,
    .el-sub-menu__title:hover,
    .el-menu-item:focus,
    .el-sub-menu__title:focus {
      color: var(--base-color) !important;
      background: transparent;
    }
  }
}

.layout.is-dark {
  .layout-header-menu {
    .el-menu {
      background-color: #121c32;
    }
  }
}
.layout.is-light {
  .el-menu-item:hover,
  .el-sub-menu__title:hover,
  .el-menu-item:focus,
  .el-sub-menu__title:focus {
    color: #ffffff !important;
    background: rgba(0, 0, 0, 0.1) !important;
  }

  .el-menu-item.is-active,
  .el-sub-menu.is-active .el-sub-menu__title {
    color: #ffffff !important;
    background: rgba(0, 0, 0, 0.1) !important;
  }
}

.popper-header-submenu-is-dark .el-menu {
  .menu-title {
    margin-left: 10px;
    line-height: 1;
  }
  .el-menu-item,
  .el-sub-menu__title {
    .submenu-icon {
      display: inline-block;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .el-menu-item:hover,
  .el-sub-menu__title:hover {
    color: var(--base-color) !important;
  }
}
.popper-header-submenu-is-light .el-menu {
  background: #ffffff !important;
  .el-menu-item,
  .el-sub-menu .el-sub-menu__title {
    color: #333333 !important;
    background: #ffffff !important;
  }

  .el-menu-item,
  .el-sub-menu__title {
    .submenu-icon {
      display: inline-block;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
      padding: 0 10px;
    }
  }

  .el-menu-item:hover,
  .el-sub-menu__title:hover {
    color: var(--base-color) !important;
  }
  .el-menu-item:hover {
    background: #ffffff !important;
  }
  .el-menu-item.is-active,
  .el-sub-menu__title.is-active {
    color: var(--base-color) !important;
  }
}
</style>
