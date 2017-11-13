<template>
  <div class="form">
      <el-row type="flex" justify="center">
        <el-col :span="6" :offset="0">
          <div>
            <el-form :model="validateForm" ref="validateForm" label-width="120px" class="demo-dynamic">
              <el-form-item
                prop="email"
                label="User"
                :rules="[
          { required: true, message: 'Please input your username', trigger: 'blur' },
          { message: 'Please input correct email address', trigger: 'blur,change' }
        ]"
              >
                <el-input @keyup.13.native="submitForm('validateForm')" v-model="validateForm.email"></el-input>
              </el-form-item>
              <el-form-item
                prop="password"
                label="Password"
                :rules="[
          { required: true, message: 'Please input your password', trigger: 'blur' },
        ]"
              >
                <el-input @keyup.enter.native="submitForm('validateForm')"  type="password" v-model="validateForm.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('validateForm')">Submit</el-button>
                <el-button @click="resetForm('validateForm')">Reset</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import { login } from '@/api';
import router from '@/router';
import { hashString } from '@/utils';


export default {
  name: 'login',
  data() {
    return {
      validateForm: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const params = new URLSearchParams();
        params.append('username', this.validateForm.email);
        params.append('password', this.validateForm.password);
        if (valid) {
          this.$apollo.mutate({
            // Query
            mutation: login,
            // Parameters
            variables: {
              userCredentials: {
                username: this.validateForm.email,
                password: hashString(this.validateForm.password).digest,
              },
            },
          })
          .then(() => {
            router.push('/');
          })
          .catch((e) => {
            console.log(e);
            this.$notify({
              title: 'Wrong credentials',
              message: 'Cannot login. Try again',
              duration: 2000,
            });
          });
        }
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style scoped>
  .form {
    width: 100%;
    margin-top: 30px;
  }
  .el-row--flex.is-justify-center {
    margin-left: -150px;
  }
</style>
