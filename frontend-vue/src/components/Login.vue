<template>
  <div class="container w-screen pt-20 flex items-center justify-center">
    <div class="w-full max-w-md">
      <formly-form
        ref="loginForm"
        :form="form"
        :model="model"
        :fields="fields"
        class="form-inputbg-white lg:shadow rounded px-8 pt-6 pb-8 mb-4"
      />
      <button
        class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        @click.prevent="submitForm('loginForm')"
      >
Login
</button>
    </div>
  </div>
</template>
<script>
import { loginMutation, storeQuery } from "@/api";
import router from "@/router";
import { hashString } from "@/utils";

export default {
  name: "Login",
  mounted() {
    this.$apollo.provider.defaultClient.clearStore();
  },
  apollo: {
    store: {
      query: storeQuery,
      result: res => console.log(res)
    }
  },
  data() {
    return {
      validateForm: {
        email: "",
        password: ""
      },
      model: {
        email: "",
        password: ""
      },
      form: {},
      fields: [
        {
          key: "email",
          type: "input",
          templateOptions: {
            label: "", // label: "Email",
            wrapperClasses: { "required-input": true },
            atts: { placeholder: "email" }
          },
          validators: {
            validEmail: {
              expression: (field, model, next) => {
                next(
                  model[field.key] === "rico" || model[field.key] === "george"
                );
              },
              message: 'Valid users: "rico", "george"'
            }
          }
        },
        {
          key: "password",
          type: "input",
          templateOptions: {
            inputType: "password",
            wrapperClasses: { "required-input": true },
            onKeyup: e => {
              if (e.keyCode === 13) this.submitForm("loginForm");
            },
            atts: { placeholder: "password" }
          },
          required: true
        }
      ]
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName]
        .validate()
        .then(() => {
          if (!this.form.$valid) {
            return null;
          }
          this.$apollo
            .mutate({
              // Query
              mutation: loginMutation,
              // Parameters
              variables: {
                userCredentials: {
                  username: this.model.email,
                  password: hashString(this.model.password).digest
                }
              }
            })
            .then(() => {
              this.$notify({
                group: "default",
                title: "WELCOME",
                text: `You've been logged in`,
                duration: 2000,
                type: "success"
              });
              router.push("/");
            })
            .catch(e => {
              console.log(e); // eslint-disable-line
              this.$notify({
                group: "errors",
                title: "Wrong credentials",
                text: "Cannot login. Try again",
                duration: 2000,
                type: "warn"
              });
            });
        })
        .catch(e => console.log(e));
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="postcss" scoped>
</style>
