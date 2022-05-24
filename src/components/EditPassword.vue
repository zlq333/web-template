<template>
  <div class="role-edit-page">
    <el-form :model="formData" :rules="rules" label-width="80px" ref="formDataRef">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model.trim="formData.oldPassword"
          v-allow.en.number.float.underline.minus.symbol
          type="password"
          autocomplete="off"
          placeholder="请输入原密码"
          style="width: 300px"
          clearable
          :maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model.trim="formData.newPassword"
          v-allow.en.number.float.underline.minus.symbol
          type="password"
          autocomplete="off"
          placeholder="请输入新密码"
          style="width: 300px"
          :maxlength="20"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="text-c mt-30">
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import useAxios from '@/utils/useAxios';
import api from '@/api/api';
import JSEncrypt from '@/utils/JSEncrypt';
import { clearLocalStorage } from '@/utils/utils';

const router = useRouter();

// form数据
const formDataRef = ref();
const formData = reactive({
  oldPassword: '',
  newPassword: ''
});
const rules = reactive({
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '请输入6-20位密码', trigger: 'blur' }
  ]
});

const emit = defineEmits(['close']);

const handleSubmit = () => {
  // 校验表单
  formDataRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await useAxios.post(api.editPassword, {
        oldPassword: JSEncrypt.encrypt(formData.oldPassword),
        newPassword: JSEncrypt.encrypt(formData.newPassword)
      });
      ElMessage.success('密码修改成功，请使用新密码登录');
      handleClose();
      clearLocalStorage();
      router.push({ path: '/login' });
    }
  });
};

const handleClose = () => {
  emit('close');
};
</script>
<style lang="postcss">
.role-edit-page {
  .role-tree {
    padding: 15px;
  }
  .role-tree .el-tree-node__content {
    height: 32px;
    line-height: 32px;
  }
  .ant-tree li.filter-node > span {
    color: inherit !important;
    font-weight: inherit !important;
  }
}
</style>
