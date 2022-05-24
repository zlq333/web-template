<template>
  <div></div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '@/store/globalStore';
const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();

const refreshRouter = computed(() => globalStore.refreshRouter);

onMounted(() => {
  nextTick(() => {
    if (refreshRouter.value) {
      // 刷新过后启用路由动画
      globalStore.editLayout('enableAnimation', true);

      // 如果存在reload参数 在重新进入路由时会重新获取权限
      if (route.params.reload) globalStore.setAcquired(false);

      nextTick(async () => {
        setTimeout(async () => {
          const res = await router.replace({ ...refreshRouter.value });
          if (res) history.replaceState(null, refreshRouter.value.href, refreshRouter.value.href);
        }, 100);
      });
    } else {
      history.go(-1);
    }
  });
});
onBeforeRouteLeave(() => {
  // globalStore.setRefreshRouter(null);
});
</script>
