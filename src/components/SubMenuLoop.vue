<template>
  <div v-if="hasChildren" :class="['submenu-group', 'menu-level' + node.menuLevel]">
    <div
      class="menu-title is-parent"
      :class="{ active: isActive }"
      :style="{ paddingLeft: (node.menuLevel - 1) * 15 + 'px' }"
      @click="handleMenuClick(node)"
    >
      <div class="menu-title-submenu" @click.stop="handleExpandMenu">
        <span>
          <svg v-if="node.menuIcon" class="iconfont font-size18 mr-5" aria-hidden="true">
            <use :xlink:href="`#${node.menuIcon}`"></use>
          </svg>
          <span>{{ node.menuName }}</span>
        </span>
        <el-icon :class="expandSubMenu ? 'submenu-open' : 'submenu-close'"><arrow-down /></el-icon>
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <div v-if="expandSubMenu">
        <sub-menu-loop v-for="subMenu in node.children" :key="subMenu.menuId" :node="subMenu"></sub-menu-loop>
      </div>
    </transition>
  </div>
  <template v-else>
    <template v-if="node.menuType === 0">
      <div :class="['submenu', 'menu-level' + node.menuLevel]">
        <div
          class="menu-title"
          :class="{ active: isActive }"
          :style="{ paddingLeft: (node.menuLevel - 1) * 15 + 'px' }"
          @click="handleMenuClick(node)"
        >
          <svg v-if="node.menuIcon" class="iconfont font-size18 mr-5" aria-hidden="true">
            <use :xlink:href="`#${node.menuIcon}`"></use>
          </svg>
          <span>{{ node.menuName }}</span>
        </div>
      </div>
    </template>
  </template>
</template>
<script lang="ts">
import { computed, PropType, ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/store/globalStore';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
export default defineComponent({
  name: 'SubMenuLoop',
  components: { ArrowDown, ArrowUp },
  props: {
    node: {
      type: Object as PropType<MenuNode>,
      required: true
    }
  },
  setup(props: any) {
    const router = useRouter();
    const globalStore = useGlobalStore();
    const sideActive = computed(() => globalStore.sideActive);
    const isActive = computed(() => sideActive.value === props.node.menuUrl);

    const hasChildren = computed(() => {
      const children: MenuNode[] = props.node.children || [];
      if (children.length > 0) {
        return children.some(el => el.menuType === 0);
      } else {
        return false;
      }
    });

    const handleMenuClick = (node: MenuNode) => {
      router.push(node.menuUrl);
    };

    let expandSubMenu = ref(true);
    const handleExpandMenu = () => {
      expandSubMenu.value = !expandSubMenu.value;
    };
    return { sideActive, hasChildren, isActive, handleMenuClick, expandSubMenu, handleExpandMenu };
  }
});
</script>
<style lang="postcss">
.submenu-panel,
.submenu-panel-popover {
  .submenu-group.menu-level2 {
    cursor: pointer;
  }
  .menu-title {
    height: 40px;
    line-height: 40px;
    padding-right: 15px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 6px;
  }
  .menu-title-submenu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .el-icon {
      transition: all 0.3s;
    }
    .submenu-close {
      transform: rotate(180deg);
    }
  }
  /* 二级菜单 */
  .menu-level2 {
    > .menu-title {
      height: 40px;
      line-height: 40px;
    }
  }

  /* 三级菜单 */
  .menu-level3 {
    > .menu-title {
      height: 38px;
      line-height: 38px;
    }
  }
}
/* 浅色模式 */
.layout.is-light {
  .submenu-panel {
    .menu-title {
      color: var(--body-font-color);
    }
    .menu-title:hover {
      color: var(--base-color);
    }
    .menu-title.active {
      color: #ffffff;
      background: var(--base-color);
    }
  }
}
/* 深色模式 */
.layout.is-dark {
  .submenu-panel {
    .menu-title {
      color: #ffffff;
    }
    .menu-title:hover {
      color: var(--base-color);
    }
    .menu-title.active {
      color: #ffffff;
      background: var(--base-color);
    }
  }
}

.submenu-panel-popover.is-light {
  background: #ffffff !important;
  .menu-title:hover {
    color: var(--base-color);
  }
  .menu-title.active {
    background: var(--base-color);
    color: #ffffff;
  }
}
.submenu-panel-popover.is-dark {
  background: #121c32 !important;
  .menu-title:hover {
    color: var(--base-color);
  }
  .menu-title.active {
    background: var(--base-color);
    color: #ffffff;
  }
}

.submenu-panel-popover.no-children {
  display: none !important;
}
</style>
