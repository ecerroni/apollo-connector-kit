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
import axios from 'axios';
import { login } from '../api';
import router from '../router';
import { AUTH } from '../environment';

export default {
  name: 'login',
  mounted() {
    localStorage.removeItem('askerikToken');
  },
  data() {
    return {
      validateForm: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    /* eslint consistent-return: 0 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const params = new URLSearchParams();
        params.append('username', this.validateForm.email);
        params.append('password', this.validateForm.password);
        if (valid) {
          if (AUTH.STRATEGIES.HTTP_ONLY) {
            axios.post('/handle-login', params,
              {
                withCredentials: true,
              })
            // .then((respohnse) => {
            .then(() => {
              // JSON responses are automatically parsed.
              console.log('Logged in');
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
          } else {
            this.$apollo.mutate({
              // Query
              mutation: login,
              // Parameters
              variables: {
                userCredentials: {
                  username: this.validateForm.email,
                  password: this.validateForm.password,
                },
              },
            })
          .then((res) => {
            console.log(res);
            localStorage.setItem('askerikToken', res.data.login);
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
        } else {
          // console.log('error submit!!');
          return false;
        }
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
