<template>
  <el-config-provider :locale="locale">
    <layout :layout-type="layoutType">
      <router-view v-slot="{ Component, route }">
        <template v-if="Component">
          <transition
            :name="layoutConfig.animation"
            :css="layoutConfig.enableAnimation"
            :duration="300"
            mode="out-in"
            appear
            @before-leave="handleBeforeLeave"
            @after-enter="handleAfterEnter"
          >
            <keep-alive :max="10" :include="keepAliveRouter">
              <suspense>
                <component :is="Component" :key="route.name"></component>
              </suspense>
            </keep-alive>
          </transition>
        </template>
      </router-view>
    </layout>
    <!-- image viewer -->
    <ul id="viewerDom">
      <li v-for="(img, index) in viewerData" :key="index">
        <img :src="img.url" :alt="img.title || '预览图片'" style="display: none" />
      </li>
    </ul>
    <!-- 项目设置 -->
    <project-setting size="300px" v-model="layoutVisible"></project-setting>
  </el-config-provider>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { useRoute } from 'vue-router';
import locale from 'element-plus/es/locale/lang/zh-cn';
import ProjectSetting from '@/components/ProjectSetting.vue';

export default defineComponent({
  name: 'App',
  components: { ProjectSetting },
  setup() {
    console.log('1-------')
    console.log('2-------')
    const globalStore = useGlobalStore();

    const menuTree = computed(() => globalStore.menuTree);
    const keepAliveRouter = computed(() => globalStore.keepAliveRouter);
    const viewerData = computed<ImageViewer[]>(() => globalStore.viewerData);
    const layoutConfig = computed<Layout>(() => globalStore.layout);
    const layoutVisible = computed<boolean>({
      get: () => globalStore.layoutVisible,
      set: val => (globalStore.layoutVisible = val)
    });

    const route = useRoute();
    const layoutType = ref('none');

    // layout设置 和 路由变更 设置layoutType
    watch(
      () => [route.path, layoutConfig.value],
      (newVal, oldVal) => {
        layoutType.value = (route.meta.layoutType || layoutConfig.value.layout) as string;
      }
    );

    const handleBeforeLeave = () => {
      globalStore.setAnimateShow(true);
      window.animateState = true;
    };

    const handleAfterEnter = () => {
      globalStore.setAnimateShow(false);
      window.animateState = false;
    };
    return { keepAliveRouter, viewerData, layoutType, layoutConfig, layoutVisible, locale, handleBeforeLeave, handleAfterEnter };
  }
});
</script>

<style lang="postcss">
@import './assets/css/reset.css';
@import './assets/css/common.css';

/* ------路由过度动画------ */

/* 从左边出来 */
.fade-left-leave-active,
.fade-left-enter-active {
  transition: all 0.3s;
}
.fade-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* 从右边出来 */
.fade-right-leave-active,
.fade-right-enter-active {
  transition: all 0.3s;
}
.fade-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
/* 从上边出来 */
.fade-top-enter-active,
.fade-top-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-top-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}
.fade-top-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
/* 从下边出来 */
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition: opacity 0.25s, transform 0.3s;
}
.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(10%);
}
.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}
/* 缩放-缩小效果 */
.zoom-enlarge-leave-active,
.zoom-enlarge-enter-active {
  transition: transform 0.35s, opacity 0.28s ease-in-out;
}
.zoom-enlarge-enter-from {
  opacity: 0;
  transform: scale(1.03);
}
.zoom-enlarge-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
/* 缩放-放大效果 */
.zoom-narrow-enter-active,
.zoom-narrow-leave-active {
  transition: transform 0.35s, opacity 0.28s ease-in-out;
}
.zoom-narrow-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.zoom-narrow-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
