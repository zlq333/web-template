<template>
  <div class="menu-trigger-box">
    <span :title="layout.isCollapse ? '展开' : '收起'">
      <svg
        class="menu-trigger iconfont font-size24"
        :class="[layout.isCollapse ? 'icon-zhankai' : 'icon-shouqi']"
        aria-hidden="true"
        @click="changeCollapse"
      >
        <use :xlink:href="`#${layout.isCollapse ? 'icon-zhankai' : 'icon-shouqi'}`"></use>
      </svg>
    </span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { setStorage } from '@fe/utils';
export default defineComponent({
  setup() {
    // store映射
    const globalStore = useGlobalStore();
    const layout = computed(() => globalStore.layout);

    const changeCollapse = () => {
      globalStore.editLayout('isCollapse', !layout.value.isCollapse);
    };
    return {
      layout,
      changeCollapse
    };
  }
});
</script>
<style lang="postcss">
.menu-trigger-box {
  flex: 0 0 auto;
  .menu-trigger {
    cursor: pointer;
    transition: color 0.3s;
  }
  .menu-trigger:hover {
    color: var(--base-color);
  }
}

.layout.is-light.layout-LR {
  .menu-trigger-box {
    .menu-trigger {
      color: #ffffff;
    }
    .menu-trigger:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
