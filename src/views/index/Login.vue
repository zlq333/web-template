<template>
  <div class="login-page">
    <div class="content-flex">
      <div class="login-header">
        <img class="login-logo" src="../../assets/logo.png" />
        <div class="header-title">{{ projectConfig.systemName }}</div>
      </div>
      <div class="login-panel">
        <el-alert class="account-tip" type="warning" :closable="false">
          <template #title>
            <el-icon :size="16" class="icon-t3 mr-5"><info-filled /></el-icon>请使用ldap账户登录
          </template>
        </el-alert>
        <el-form :model="loginForm" :rules="rules" size="large" ref="loginFormRef" class="login-form">
          <el-form-item label="" prop="account">
            <el-input
              type="text"
              v-model="loginForm.account"
              autocomplete="off"
              clearable
              placeholder="请输入ldap账户"
              :maxlength="20"
              style="width: 360px"
            >
              <template #prefix>
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon-username"></use>
                </svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              autocomplete="off"
              :maxlength="20"
              clearable
              placeholder="请输入密码"
              @keyup.enter="submitForm"
              style="width: 360px"
            >
              <template #prefix>
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon-mima"></use>
                </svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width: 100%">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="forget-link">
        <el-button type="text" @click="jumpForget">忘记密码</el-button>
      </div>
      <div class="login-footer">
        <span>客服电话：4001 256 256</span>
      </div>
    </div>
    <div class="footer-flex">&copy; 2022 武汉物易云通网络科技有限公司 版权所有</div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { InfoFilled } from '@element-plus/icons-vue';
import JSEncrypt from '@/utils/JSEncrypt';
import { openNewtab, setStorage } from '@fe/utils';
import { getPermission, getDict } from '@/utils/utils';
import api from '@/api/api';
import useAxios from '@/utils/useAxios';
import projectConfig from '@/config/config';
import { useGlobalStore } from '@/store/globalStore';

export default defineComponent({
  components: { InfoFilled },
  setup() {
    // 定义form数据
    const loginFormRef = ref();

    // 表单
    const loginForm = reactive({
      account: '',
      password: ''
    });
    // 校验规则
    const rules = reactive({
      account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
    });

    const router = useRouter();

    // 提交表单
    const submitForm = () => {
      // 校验表单
      loginFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          // 登录
          let userData = await useAxios.post(api.login, {
            loginIp: '0.0.0.0',
            loginCode: loginForm.account,
            password: JSEncrypt.encrypt(loginForm.password) // 密码rsa加密
          });
          // 存储用户信息 & 登录凭证
          setStorage('userData', userData);
          localStorage.setItem(projectConfig.tokenKey, userData.token);

          // 初始化身份权限
          await getPermission();
          // 查询字典数据 并存储
          await getDict('', true);

          const firstMenuPath = getFirstMenu();
          router.push({ path: firstMenuPath });
        }
      });
    };
    // 忘记密码
    const jumpForget = () => openNewtab('https://password.wyyt.cc/');

    // 获取菜单树上的第一个路由 找不到则返回404
    const getFirstMenu = function () {
      const menuTree = useGlobalStore().menuTree;
      if (menuTree.length === 0) return '/error/404';
      let redirect = '';
      function loopTree(list: MenuNode[]) {
        if (redirect) return;
        list.some(item => {
          if (redirect) return true;
          item.children = item.children || [];
          if (item.menuType === 0 && item.menuUrl.indexOf('/') === 0) {
            redirect = item.menuUrl;
            return true;
          } else {
            loopTree(item.children);
          }
        });
      }
      loopTree(menuTree);
      return redirect || '/error/404';
    };

    return { loginFormRef, loginForm, rules, submitForm, jumpForget, projectConfig };
  }
});
</script>
<style lang="postcss">
.login-page {
  flex: 1 1 auto;
  width: 100%;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  .content-flex {
    flex: 1 1 auto;
  }
  .footer-flex {
    flex: 0 0 auto;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: var(--base-darkgray-color);
  }
  .login-header {
    padding: 120px 0 80px;
    text-align: center;
    .login-logo {
      height: 80px;
    }
  }
  .header-title {
    font-size: 22px;
    margin-top: 20px;
    color: var(--base-color);
  }

  .login-footer {
    text-align: center;
    padding-top: 60px;
    .login-link {
      color: var(--base-darkgray-color);
      text-align: center;
      cursor: pointer;
      padding: 0 10px;
      transition: all 0.2s ease-in-out;
      text-decoration: none;
    }
    .login-link:hover {
      color: var(--base-color);
    }
  }
  .forget-link {
    text-align: center;
    margin-top: 20px;
  }
}

.login-panel {
  width: 360px;
  margin: 0 auto;
  height: auto;
  padding: 20px;
  border-radius: 5px;
  .login-form {
    margin-top: 20px;
  }
  .account-tip {
    margin-bottom: 20px;
    background-color: rgb(236 244 249);
    border: none;
    .ant-alert-message {
      color: var(--base-color);
    }
    .ant-alert-icon {
      color: var(--base-color);
      top: 11px;
      font-size: 16px;
    }
  }
}
</style>
