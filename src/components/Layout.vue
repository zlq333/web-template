<template>
  <div class="layout" :class="[`layout-${layoutType}`, layout.style, 'in-main']">
    <div v-if="layoutType === 'TB' || layoutType === 'MIX'" class="layout-header">
      <header-menu :layoutStyle="layout.style"></header-menu>
      <header-shortcut></header-shortcut>
    </div>
    <div class="layout-container">
      <div
        v-if="layoutType === 'LR' || layoutType === 'MIX'"
        :class="['layout-aside', layout.isCollapse ? 'aside-shrink' : 'aside-open', layout.style]"
      >
        <!-- <div class="layout-aside-logo">
          <img :class="['aside-logo', layout.isCollapse ? 'logo-close' : 'logo-open']" src="../assets/logo.png" />
        </div> -->
        <layout-side :layoutType="layoutType"></layout-side>
      </div>

      <div class="layout-body">
        <template v-if="layoutType !== 'none'">
          <div v-if="layoutType === 'LR'" class="layout-body-header">
            <div class="body-header-title">
              <img class="body-header-logo" :src="systemLogo" />
              <span class="body-header-name">{{ systemName }}</span>
            </div>
            <header-shortcut></header-shortcut>
          </div>
          <tab-card v-if="layout.showTabs"></tab-card>
          <div class="body-header-btn-group">
            <el-icon
              v-if="layout.showRefresh"
              class="refresh-page-btn font-size20"
              title="刷新当前页面"
              @click="handleRefreshRouter"
            >
              <refresh-right />
            </el-icon>
            <breadcrumb v-if="layout.showBreadcrumd"></breadcrumb>
          </div>
        </template>

        <div class="layout-body-view">
          <slot><!-- 内容区插槽 --></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { getStorage } from '@fe/utils';
import { RefreshRight } from '@element-plus/icons-vue';

import HeaderMenu from '@/components/HeaderMenu.vue';
import HeaderShortcut from '@/components/HeaderShortcut.vue';
import LayoutSide from '@/components/LayoutSide.vue';
import MenuTrigger from '@/components/MenuTrigger.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import TabCard from '@/components/TabCard.vue';
import defaultLogoUrl from '@/assets/img/logo_default.png';
import { refreshRouter,throttle } from '@/utils/utils';
import projectConfig from '@/config/config';

export default defineComponent({
  components: {
    HeaderMenu,
    HeaderShortcut,
    LayoutSide,
    MenuTrigger,
    Breadcrumb,
    TabCard,
    RefreshRight
  },
  props: {
    layoutType: {
      type: String,
      required: true
    }
  },
  setup(props: any) {
    const globalStore = useGlobalStore();

    const layout = computed<Layout>(() => globalStore.layout);

    // 刷新当前路由
    const handleRefreshRouter = throttle(function () {
      refreshRouter();
    }, 500);

    // 系统及用户数据
    const userData = getStorage('userData') || {};
    const systemName = userData.companyName ? userData.companyName : projectConfig.systemName;
    const systemLogo = userData.logo ? userData.logo : defaultLogoUrl;
    return {
      layout,
      systemName,
      systemLogo,
      userData,
      handleRefreshRouter
    };
  }
});
</script>
<style lang="postcss">
.layout {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
  min-width: 1200px;
  box-sizing: border-box;
  .layout-header {
    display: flex;
    height: 50px;
    align-items: center;
    z-index: 4;
  }
  .layout-aside {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    width: auto;
    overflow: hidden;
    z-index: 3;
  }

  .layout-container {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
  }
  .layout-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 0;
    background: #f5f8fb;
    .layout-tab-card {
      padding: 0 10px;
    }
    .body-header-btn-group {
      padding: 0 10px 10px;
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
      align-items: center;
      z-index: 2;
      .refresh-page-btn {
        margin-right: 2px;
        cursor: pointer;
        transition: color 0.3s;
      }
      .refresh-page-btn:hover {
        color: var(--base-color);
      }
    }
  }
  .layout-body-view {
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.layout.in-main {
  .layout-body-view {
    padding: 0 10px 10px 10px;
  }
}
.layout.in-micro {
  .layout-body-view {
    padding: 0 0 10px 10px;
  }
}
.layout.layout-none {
  .layout-body-view {
    padding: 0;
  }
}
.layout.is-dark {
  .layout-header {
    color: #ffffff;
    background: #121c32;
    border-bottom: 1px solid #252f41;
    box-sizing: border-box;
  }
}
.layout.is-light {
  .layout-header {
    color: #ffffff;
    background: var(--base-color);
    box-shadow: 0 8px 8px -8px rgb(219 219 219);
  }
}

.layout-aside {
  .el-menu {
    border-right: 0;
  }
  .layout-aside-logo {
    transition: width 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    flex: 0 0 auto;
    .aside-logo {
      transition: all 0.3s;
    }
    .aside-logo.logo-open {
      width: auto;
      height: 32px;
    }
    .aside-logo.logo-close {
      width: auto;
      height: 32px;
    }
  }
}

.layout.is-dark {
  .layout-aside {
    .layout-aside-menu::-webkit-scrollbar-track-piece {
      background-color: #304156;
    }
    .layout-aside-menu::-webkit-scrollbar-thumb {
      background-color: rgba(158, 166, 175, 0.6);
      background-clip: padding-box;
      min-height: 20px;
      border-radius: 3px;
    }
    .layout-aside-menu::-webkit-scrollbar {
      width: 6px;
      height: auto;
    }
  }
}
.layout.is-light {
  .layout-aside {
    .layout-aside-menu::-webkit-scrollbar-track-piece {
      background-color: #fff;
    }
    .layout-aside-menu::-webkit-scrollbar-thumb {
      background-color: #c2c2c2;
      background-clip: padding-box;
      min-height: 20px;
      border-radius: 3px;
    }
    .layout-aside-menu::-webkit-scrollbar {
      width: 6px;
      height: auto;
    }
    ::-webkit-scrollbar-track-piece {
      background-color: #fff;
    }
  }
}

.layout-body {
  height: 100vh;
  overflow-y: auto;
  .layout-body-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    flex: 0 0 auto;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 8px 8px -8px rgb(219 219 219);
    z-index: 2;
    .body-header-title {
      display: flex;
      align-items: center;
      .body-header-logo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-left: 15px;
      }
      .body-header-name {
        font-size: 16px;
        margin-left: 15px;
      }
    }
  }
}

/* 不同布局 高度计算 */
.layout-LR {
  .layout-container {
    height: 100vh;
  }
}
.layout-TB {
  .layout-body {
    height: calc(100vh - 50px);
  }
}
.layout-MIX {
  .layout-body {
    height: calc(100vh - 50px);
  }
  .layout-aside {
    height: calc(100vh - 50px);
  }
}
</style>
