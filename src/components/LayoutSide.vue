<template>
  <div class="layout-side-page">
    <section class="layout-side-menu">
      <div class="side-menu-ul">
        <el-popover
          v-for="el in menuTree"
          :key="el.menuId"
          :width="180"
          :show-arrow="false"
          v-model:disabled="popoverDisabled"
          trigger="hover"
          placement="right-start"
          :popper-class="`submenu-panel-popover ${layout.style} ${hasChildren(el) ? 'has-children' : 'no-children'}`"
        >
          <template #reference>
            <div :class="['side-menu-li', { active: navActive === el.menuUrl }]" @click="handleNavChange(el)">
              <svg v-if="el.menuIcon" class="iconfont font-size20 icon-t1" aria-hidden="true">
                <use :xlink:href="`#${el.menuIcon}`"></use>
              </svg>
              <div class="side-menu-li__title" :style="{ width: el.menuName.length === 4 ? '30px' : '42px' }">
                {{ el.menuName }}
              </div>
            </div>
          </template>
          <sub-menu-loop v-for="subNode in el.children" :key="subNode.menuId" :node="subNode"></sub-menu-loop>
        </el-popover>
      </div>
      <menu-trigger class="text-c mb-10"></menu-trigger>
    </section>

    <section v-if="showSubMenu" :class="['layout-side-submenu', layout.isCollapse ? 'aside-shrink' : 'aside-open']">
      <div class="submenu-panel">
        <sub-menu-loop v-for="el in sideData" :key="el.menuId" :node="el"></sub-menu-loop>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { ref, computed, defineComponent, watchEffect } from 'vue';
import SubMenuLoop from '@/components/SubMenuLoop.vue';
import { useGlobalStore } from '@/store/globalStore';
import { useRouter } from 'vue-router';
import MenuTrigger from './MenuTrigger.vue';

// 找到某路由节点的所有父节点
const getParentNodes = (menuTree: MenuNode[], path: string) => {
  if (!path) return [];
  let tempNodes: MenuNode[] = [];
  let parentNodes: MenuNode[] = [];
  let isOver = false;
  function loopTree(list: MenuNode[], level: number) {
    list.forEach((item, idx) => {
      item.menuLevel = level;
      item.children = item.children || [];
      tempNodes.splice(level - 1);

      tempNodes[level - 1] = item;
      if (item.menuUrl === path) {
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
  components: {
    SubMenuLoop,
    MenuTrigger
  },
  props: {
    layoutType: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props: any) {
    const router = useRouter();
    const globalStore = useGlobalStore();
    const menuTree = computed(() => globalStore.menuTree);
    const layout = computed(() => globalStore.layout);

    // 二级导航菜单数据
    const sideData = ref<MenuNode[]>([]);
    // 一级导航选择项目
    const navActive = computed(() => globalStore.navActive);
    // 二级导航选中项
    const sideActive = computed(() => globalStore.sideActive);
    // 如果没有二级菜单 则二级菜单区域不显示
    const showSubMenu = computed(() => sideData.value.length > 0);
    // 侧栏展开时 禁用menu的popover
    const popoverDisabled = computed(() => !layout.value.isCollapse);

    // 当navActive变更 需要修改sideData
    watchEffect(() => {
      const parentNodes = getParentNodes(menuTree.value, sideActive.value);
      if (parentNodes && parentNodes.length > 0) {
        const path = parentNodes[0].menuUrl;
        globalStore.setNavActive(path);

        const subMeneData = menuTree.value.find(el => el.menuUrl === path);
        if (subMeneData && hasChildren(subMeneData)) {
          sideData.value = subMeneData.children || [];
        } else {
          sideData.value = [];
        }
      } else {
        globalStore.setNavActive('');
      }
    });

    // 一级菜单点击
    const handleNavChange = (node: MenuNode) => {
      // 有子菜单跳第一个子菜单 无子菜单跳自身menuUrl
      const children = node.children || [];
      const index = children.findIndex(el => el.menuType === 0);
      if (index > -1) {
        router.push(children[index].menuUrl);
      } else {
        router.push(node.menuUrl);
      }
    };

    function hasChildren(node: MenuNode) {
      const children = node.children || [];
      if (children.length > 0) {
        return children.some(el => el.menuType === 0);
      } else {
        return false;
      }
    }

    return {
      menuTree,
      sideData,
      navActive,
      sideActive,
      showSubMenu,
      popoverDisabled,
      layout,
      handleNavChange,
      hasChildren
    };
  }
});
</script>
<style lang="postcss">
.layout-side-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  border-right: 1px solid #eef1f9;
  box-sizing: border-box;
  .layout-side-menu {
    width: 60px;
    padding-top: 20px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
  }
  .layout-side-submenu {
    flex: 1;
    width: 200px;
    padding-top: 10px;
    box-sizing: border-box;
    transition: width 0.3s;
    display: flex;
    flex-direction: column;
  }
  .layout-side-submenu.aside-open {
    width: 200px !important;
  }
  .layout-side-submenu.aside-shrink {
    width: 0 !important;
  }
}

.layout-side-menu {
  .side-menu-ul {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    .side-menu-li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 68px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      box-sizing: border-box;
    }
    .side-menu-li:hover {
      color: var(--base-color);
    }
    .side-menu-li.active {
      position: relative;
      color: var(--base-color);
    }
    .side-menu-li.active::before {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      top: 10px;
      width: 3px;
      height: 48px;
      background: var(--base-color);
    }
    .side-menu-li__title {
      margin-top: 8px;
      width: 30px;
      font-size: 12px;
      line-height: 1.1;
      letter-spacing: 1px;
      overflow: hidden;
      word-break: break-all;
      white-space: break-spaces;
    }
  }
}
.layout-side-submenu {
  .submenu-panel {
    width: 100%;
    flex: 1 1 auto;
    box-sizing: border-box;
    border-right: none;
    padding: 10px 15px 20px;

    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.layout.is-light.layout-LR {
  .layout-side-page {
    .layout-side-menu {
      background: var(--base-color);
    }
    .layout-side-submenu {
      background: #ffffff;
    }
    .side-menu-li {
      color: #ffffff;
    }
    .side-menu-li:hover {
      color: #ffffff;
      background: rgba(0, 0, 0, 0.1) !important;
    }
    .side-menu-li.active {
      position: relative;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.1) !important;
    }
    .side-menu-li.active::before {
      background: #ffffff;
    }
  }
}
.layout.is-light.layout-MIX {
  .layout-side-page {
    .layout-side-menu {
      background: #f0f3f9;
    }
    .layout-side-submenu {
      background: #ffffff;
    }
    .side-menu-li {
      color: #435179;
    }
    .side-menu-li:hover {
      color: var(--base-color);
    }
    .side-menu-li.active {
      position: relative;
      color: var(--base-color);
    }
    .side-menu-li.active::before {
      background: var(--base-color);
    }
  }
}

.layout.is-dark {
  .layout-side-page {
    color: #eeeeee;
    .layout-side-menu {
      background: #121c32;
    }
    .layout-side-submenu {
      background: #252f41;
    }
    .side-menu-li {
      color: #eeeeee;
    }
    .side-menu-li:hover {
      color: var(--base-color);
    }
    .side-menu-li.active {
      position: relative;
      color: var(--base-color);
    }
    .side-menu-li.active::before {
      background: var(--base-color);
    }
  }
}
</style>
