<template>
  <div class="breadcrumb-box">
    <el-breadcrumb v-if="breadcrumb && breadcrumb.length > 0">
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
        <span @click.stop="linkTo(item)">{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const globalStore = useGlobalStore();
    const router = useRouter();
    const breadcrumb = computed<Breadcrumb[]>(() => globalStore.breadcrumb);

    const linkTo = (item: Breadcrumb) => {
      if (item.name) {
        router.push({ name: item.name, params: item.params || '', query: item.query || '' });
      } else if (item.path) {
        router.push({ path: item.path, params: item.params || '', query: item.query || '' });
      } else {
        console.log('router null');
      }
    };
    return { breadcrumb, linkTo };
  }
});
</script>
<style lang="postcss">
.breadcrumb-box {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  .el-breadcrumb {
    padding-left: 10px;
    box-sizing: border-box;
    line-height: inherit;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #909399;
  }
  .el-breadcrumb__inner {
    cursor: pointer;
  }

  .el-breadcrumb__inner:hover {
    color: var(--base-color);
  }
}
</style>
