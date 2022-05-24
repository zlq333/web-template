<template>
  <div class="header-shortcut-panel">
    <div class="header-shortcut-item" title="设置">
      <svg class="iconfont font-size18" aria-hidden="true" @click="layoutVisible = true">
        <use xlink:href="#icon-xitongpeizhi"></use>
      </svg>
    </div>
    <div class="header-shortcut-item" :title="fullScreen ? '取消全屏' : '全屏'">
      <svg class="iconfont font-size20" aria-hidden="true" @click="toggleFullScreen">
        <use :xlink:href="`#icon-${fullScreen ? 'quxiaoquanping' : 'quanping'}`"></use>
      </svg>
    </div>
    <!--
    <div class="header-shortcut-item">
      <svg class="iconfont font-size20" aria-hidden="true" title="主页" @click="onJumpPath('/welcome')">
        <use xlink:href="#icon-home"></use>
      </svg>
    </div>
    <div class="header-shortcut-item">
      <svg class="iconfont font-size24" aria-hidden="true" title="布局设置" @click="layoutVisible = true">
        <use xlink:href="#icon-buju"></use>
      </svg>
    </div>
    <div class="header-shortcut-item">
      <svg class="iconfont font-size21" aria-hidden="true" title="退出登录" @click="onLogout">
        <use xlink:href="#icon-tuichu"></use>
      </svg>
    </div> -->
    <div class="header-shortcut-item mr-20">
      <div class="user-shortcut">
        <span v-if="userAvatar" :style="userAvatarBg" class="user-avatar"></span>
        <span v-else class="user-avatar-default">
          <span class="user-avatar-letter" v-if="avatarLetter">{{ avatarLetter }}</span>
          <svg v-else class="iconfont" aria-hidden="true">
            <use xlink:href="#icon-username"></use>
          </svg>
        </span>
        <el-dropdown v-if="showPopper" @command="handleCommand">
          <span class="user-display-name">
            {{ userName }}<el-icon class="icon-t2"><caret-bottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-panel">
              <!-- <el-dropdown-item command="mycenter">
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon-username"></use>
                </svg>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item command="buju">
                <svg class="iconfont font-size20" aria-hidden="true">
                  <use xlink:href="#icon-buju"></use>
                </svg>
                <span>布局设置</span>
              </el-dropdown-item> -->
              <el-dropdown-item command="editpassword">
                <svg class="iconfont font-size18" aria-hidden="true">
                  <use xlink:href="#icon-xiugaimima"></use>
                </svg>
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <svg class="iconfont font-size18" aria-hidden="true">
                  <use xlink:href="#icon-tuichu"></use>
                </svg>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span v-else class="user-display-name">{{ userName }}</span>
      </div>
    </div>
  </div>

  <el-dialog title="修改密码" v-model="passwordVisible" width="460px" center>
    <edit-password @close="passwordVisible = false"></edit-password>
  </el-dialog>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, computed, nextTick } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { useRouter } from 'vue-router';
import { getStorage } from '@fe/utils';
import { clearLocalStorage } from '@/utils/utils';
import EditPassword from './EditPassword.vue';
import { CaretBottom } from '@element-plus/icons-vue';
export default defineComponent({
  components: { EditPassword, CaretBottom },
  setup() {
    const globalStore = useGlobalStore();
    const router = useRouter();

    const userName = ref('');
    const userAvatar = ref('');
    const avatarLetter = ref('');

    let userAvatarBg = reactive({
      backgroundImage: ''
    });
    const userData = getStorage('userData') || {};
    userName.value = userData.userName || '';
    userAvatar.value = userData.filePath || '';

    userAvatarBg.backgroundImage = 'url(' + userData.filePath + ')';

    if (userData.userCode) {
      avatarLetter.value = userData.userCode.substring(0, 1).toUpperCase();
    }

    const layoutVisible = computed<boolean>({
      get: () => globalStore.layoutVisible,
      set: val => (globalStore.layoutVisible = val)
    });
    const showPopper = true; // 用户头像是否启用popper

    // 点击头部下拉列表
    const handleCommand = (command: string) => {
      switch (command) {
        case 'buju':
          globalStore.showLayout();
          break;
        case 'editpassword':
          passwordVisible.value = true;
          break;
        case 'logout':
          onLogout();
          break;
        case 'mycenter':
          console.log('个人中心');
          break;
        default:
          break;
      }
    };

    const onJumpPath = (path: string) => {
      router.push({ path: path });
    };

    const onLogout = () => {
      clearLocalStorage();
      router.push({ path: '/login' });
    };

    const passwordVisible = ref(false);

    // 全屏切换

    const fullScreen = ref(false);
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        fullScreen.value = true;
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          fullScreen.value = false;
          document.exitFullscreen();
        }
      }
    };

    return {
      userName,
      userAvatar,
      avatarLetter,
      userAvatarBg,
      layoutVisible,
      showPopper,
      onJumpPath,
      onLogout,
      handleCommand,
      passwordVisible,
      fullScreen,
      toggleFullScreen
    };
  }
});
</script>
<style lang="postcss">
.header-shortcut-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .header-shortcut-item {
    box-sizing: border-box;
    flex: 0 0 auto;
    cursor: pointer;
    padding: 0 5px;
    transition: all 0.3s;
  }
  .header-shortcut-item:hover {
    color: var(--base-color);
  }
  /* 用户下拉popper */
  .user-shortcut {
    .user-avatar {
      margin-right: 6px;
      display: inline-block;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-size: 35px 35px;
    }
    .user-avatar-default {
      margin-right: 6px;
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 32px;
      text-align: center;
      border-radius: 50%;
      background-size: 35px 35px;
      background: var(--base-color);
      .user-avatar-letter {
        font-size: 18px;
      }
    }
    .user-avatar-default .iconfont {
      font-size: 18px;
    }

    .user-display-name {
      margin-left: 5px;
      margin-right: 3px;
      transition: all 0.3s;
      .el-icon {
        transition: all 0.3s;
      }
    }
    .user-display-name:hover {
      color: var(--base-color);
      .el-icon {
        transform: rotate(180deg);
      }
    }
  }
}

.layout.is-dark.layout-TB,
.layout.is-dark.layout-MIX {
  .user-shortcut .user-display-name {
    color: #ffffff;
  }
  .user-avatar-default {
    color: #ffffff !important;
  }
}
.layout.is-dark.layout-LR {
  .user-avatar-default {
    color: #ffffff !important;
  }
}
.layout.is-light.layout-LR {
  .user-avatar-default {
    color: #ffffff !important;
  }
}

.layout.is-light.layout-TB,
.layout.is-light.layout-MIX {
  .header-shortcut-item {
    color: #ffffff;
  }
  .header-shortcut-item:hover {
    color: rgba(255, 255, 255, 0.7);
  }
  .user-shortcut .user-display-name {
    color: #ffffff;
  }
  .user-display-name:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .user-avatar-default {
    background: #ffffff !important;
    color: var(--base-color) !important;
  }
}

.user-dropdown-panel {
  .el-dropdown-menu__item {
    min-width: 160px;
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    .iconfont {
      display: inline-block;
      width: 28px;
      text-align: center;
    }
  }
}
.layout-set-dialog {
  line-height: 1;
  .layout-dialog-item {
    text-align: center;
    .layout-dialog-label {
      width: 120px;
      display: inline-block;
      text-align: right;
      margin-left: -76px;
    }
    .el-radio-group {
      display: inline-block;
    }
  }
}
</style>
