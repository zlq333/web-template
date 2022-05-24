<template>
  <el-sub-menu
    v-if="hasChildren"
    :index="node.menuUrl || node.menuId"
    :class="'parent-level' + node.menuLevel"
    :popper-class="'popper-header-submenu-' + layoutStyle"
  >
    <template #title>
      <svg v-if="node.menuIcon" class="iconfont submenu-icon" aria-hidden="true">
        <use :xlink:href="`#${node.menuIcon}`"></use>
      </svg>
      <span class="menu-title">{{ node.menuName }}</span>
    </template>
    <loop-menu
      v-for="subMenu in node.children"
      :key="subMenu.menuId"
      :node="subMenu"
      :layoutStyle="layoutStyle"
    ></loop-menu>
  </el-sub-menu>
  <template v-else>
    <template v-if="node.menuType === 0">
      <el-menu-item :index="node.menuUrl || node.menuId" :class="'parent-level' + node.menuLevel">
        <svg v-if="node.menuIcon" class="iconfont submenu-icon" aria-hidden="true">
          <use :xlink:href="`#${node.menuIcon}`"></use>
        </svg>
        <template #title>
          <span class="menu-title">{{ node.menuName }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  name: 'LoopMenu',
  props: {
    node: {
      type: Object,
      required: true
    },
    layoutStyle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const hasChildren = computed(() => {
      const children: MenuNode[] = props.node.children || [];
      if (children.length > 0) {
        return children.some(el => el.menuType === 0);
      } else {
        return false;
      }
    });
    return { hasChildren };
  }
});
</script>
<style lang="postcss"></style>
