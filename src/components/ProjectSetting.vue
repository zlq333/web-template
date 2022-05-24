<template>
  <el-drawer
    v-bind="$attrs"
    :model-value="modelValue"
    @close="onClose"
    title="布局设置"
    :show-close="false"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-scrollbar>
      <div class="project-setting-container">
        <el-divider>主题色</el-divider>
        <div class="text-c">
          <el-color-picker
            ref="themePickerRef"
            popper-class="theme-picker-dropdown"
            v-model="themeValue"
            :show-alpha="false"
            color-format="hex"
            :predefine="predefineColors"
            @change="handleThemeChange"
          ></el-color-picker>
        </div>

        <el-divider>布局设置</el-divider>
        <div class="layout-image-box">
          <div class="layout-image-item" title="左侧菜单">
            <img src="@/assets/img/layout-LR.svg" @click="handleLayoutChange('layout', 'LR')" />
            <div v-if="layout.layout === 'LR'" class="setting-selected-dot"></div>
          </div>
          <div class="layout-image-item" title="顶部菜单">
            <img src="@/assets/img/layout-TB.svg" @click="handleLayoutChange('layout', 'TB')" />
            <div v-if="layout.layout === 'TB'" class="setting-selected-dot"></div>
          </div>
          <div class="layout-image-item" title="顶部+左侧菜单">
            <img src="@/assets/img/layout-MIX.svg" @click="handleLayoutChange('layout', 'MIX')" />
            <div v-if="layout.layout === 'MIX'" class="setting-selected-dot"></div>
          </div>
        </div>

        <el-divider>风格设置</el-divider>
        <div class="layout-image-box">
          <el-radio-group
            v-model="layout.style"
            class="layout-style-radio"
            @change="handleLayoutChange('style', layout.style)"
          >
            <el-radio-button label="is-light">
              <svg class="iconfont icon-t2 mr-5" aria-hidden="true">
                <use xlink:href="#icon-light"></use>
              </svg>
              <span>Light</span>
            </el-radio-button>
            <el-radio-button label="is-dark">
              <svg class="iconfont icon-t1 mr-5" aria-hidden="true">
                <use xlink:href="#icon-dark"></use>
              </svg>
              <span>Dark</span>
            </el-radio-button>
          </el-radio-group>
        </div>

        <el-divider>界面显示</el-divider>
        <div class="layout-setting-item">
          <span class="layout-setting-label">左侧菜单折叠</span>
          <el-switch
            class="layout-setting-input"
            v-model="layout.isCollapse"
            @change="handleLayoutChange('isCollapse', layout.isCollapse)"
          />
        </div>
        <div class="layout-setting-item">
          <span class="layout-setting-label">显示面包屑导航</span>
          <el-switch
            class="layout-setting-input"
            v-model="layout.showBreadcrumd"
            @change="handleLayoutChange('showBreadcrumd', layout.showBreadcrumd)"
          />
        </div>
        <div class="layout-setting-item">
          <span class="layout-setting-label">显示页签</span>
          <el-switch
            class="layout-setting-input"
            v-model="layout.showTabs"
            @change="handleLayoutChange('showTabs', layout.showTabs)"
          />
        </div>
        <!-- <div class="layout-setting-item">
          <span class="layout-setting-label">显示页面刷新按钮</span>
          <el-switch
            class="layout-setting-input"
            v-model="layout.showRefresh"
            @change="handleLayoutChange('showRefresh', layout.showRefresh)"
          />
        </div> -->
      </div>
      <el-divider>页面跳转动画</el-divider>
      <div class="layout-setting-item">
        <span class="layout-setting-label">动画类型</span>
        <el-select
          v-model="layout.animation"
          placeholder="请选择"
          @change="handleLayoutChange('animation', layout.animation)"
        >
          <el-option label="左侧划入" value="fade-left"></el-option>
          <el-option label="右侧划入" value="fade-right"></el-option>
          <el-option label="顶部划入" value="fade-top"></el-option>
          <el-option label="底部划入" value="fade-bottom"></el-option>
          <el-option label="缩小淡出" value="zoom-enlarge"></el-option>
          <el-option label="放大淡出" value="zoom-narrow"></el-option>
          <el-option label="禁用动画" value=""></el-option>
        </el-select>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import theme from '@/utils/theme';
import { useGlobalStore } from '@/store/globalStore';
import { setStorage } from '@fe/utils';

const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue']);
const globalStore = useGlobalStore();

// 关闭弹窗
const onClose = () => {
  emit('update:modelValue', false);
};

const myForm = ref();
const submit = async () => {
  let rtn = await myForm.value.submit();
  console.log(rtn, 'rtn');
};

const themeValue = ref(theme.userTheme);
// 预设颜色
const predefineColors = ref([theme.defaultTheme, '#409EFF', '#17cb9f', '#F56C6C', '#e6a23c']);
const handleThemeChange = async (val: string) => {
  await theme.setTheme(val);
  globalStore.editLayout('theme', val);
};

const layout = computed<Layout>(() => globalStore.layout);
const handleLayoutChange = (key: string, value: string | boolean) => {
  let options = { ...layout.value };
  options[key] = value;
  globalStore.setLayout(options);
};
</script>

<style lang="postcss">
.project-setting-container {
  .form-preview-panel {
    .action-bar {
      height: 34px;
      line-height: 34px;
      background: #f2fafb;
      padding: 0 15px;
      box-sizing: border-box;
      text-align: left;
      border: 1px solid #f1e8e8;
      display: flex;
      flex-direction: row;
      justify-content: right;
      align-items: center;
      .el-button--text {
        min-height: 0;
        padding: 0;
      }
      .close-btn {
        color: #f56c6c;
      }
      .close-btn:hover {
        color: #ea0b30;
      }
    }
  }
  .preview-scrollbar {
    height: calc(100vh - 34px);
  }
  .code-editor-panel {
    height: 100vh;
    overflow: auto;
    background: #2d2d2d;
    color: #ccc;
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.3;
    padding: 5px;
    box-sizing: border-box;
    .prism-editor__textarea:focus {
      outline: none;
    }
  }
  .code-editor-panel::-webkit-scrollbar-track-piece {
    background-color: #2d2d2d;
  }
}
.layout-image-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  .layout-image-item {
    flex: 0 0 auto;
    width: 52px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .setting-selected-dot {
    width: 8px;
    height: 8px;
    background-color: var(--base-color);
    border-radius: 50%;
    margin: 2px auto 0;
  }
  .layout-image-item + .layout-image-item {
    margin-left: 10px;
  }
  .layout-style-radio {
    background: var(--el-color-primary-light-9);
    border-radius: 20px;
    .el-radio-button__inner {
      padding: 0 15px;
      line-height: 36px;
      background: transparent;
      border: 1px solid transparent !important;
      border-radius: 20px !important;
    }
  }
}
.layout-setting-item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
