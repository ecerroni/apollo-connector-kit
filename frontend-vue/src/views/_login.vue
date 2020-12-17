<template>
  <div class="w-full max-w-xs">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      @submit.prevent
    >
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          Username
        </label>
        <input
          id="username"
          v-model.trim="$v.email.$model"
          :class="`shadow appearance-none border rounded ${ errors.email.hasError ? 'border-red-500' : ''} w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`"
          type="text"
          placeholder="Username"
        >
        <p
          class="text-red-500 text-xs italic h-4"
        >
          {{ errors.email.hasError ? errors.email.errorMessage : '' }}
        </p>
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Password
        </label>
        <input
          id="password"
          v-model.trim="$v.password.$model"
          :class="`shadow appearance-none border ${ $v.password.$error ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`"
          type="password"
          placeholder="******************"
          @keyup.enter="submitForm"
        >
        <p
          class="text-red-500 text-xs italic h-4"
        >
          {{ errors.password.hasError ? errors.password.errorMessage : '' }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="submitForm"
        >
          Sign In
        </button>
        <div
          v-if="forgetPassword"
          class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          Forgot Password?
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { Notyf } from 'notyf';
import { required, minLength, email, sameAs, url } from 'vuelidate/lib/validators'
import errorValidations from 'vuelidate-errors'
import { LOGIN_MUTATION, storeQuery } from "@/api";
import { base64String } from "@/utils";

export default {
  name: "Login",
  mixins: [validationMixin],
  props: {
    forgetPassword: {
      type: Boolean,
      default: false,
    }
  },
  validations: {
    email: {
      required,
      minLength: minLength(4),
    },
    password: {
      required,
      minLength: minLength(6),
    }
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    errors() {
      const errorMsg = {
        password: {
          minLength: "The password length should be 6",
        },
      }
      return errorValidations({
        useFieldNames: false, // default true
        customErrorMessages: errorMsg, // default {}
        v: this.$v // required
      })
    }
  },
  mounted() {
    this.$fsm.logout()
    this.$apollo.provider.defaultClient.clearStore();
  },
  apollo: {
    store: {
      query: storeQuery,
      result: res => console.log(res)
    }
  },
  methods: {
    submitForm() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('form not valid')
      } else {
        this.$apollo
            .mutate({
              // Query
              mutation: LOGIN_MUTATION,
              // Parameters
              variables: {
                userCredentials: {
                  username: this.email,
                  password: base64String(this.password)
                }
              }
            })
            .then(res => {
              if (res) this.$fsm.login()
            })
            .catch(e => {
              console.log(e); // eslint-disable-line
              let notyf = new Notyf()
              notyf.error('Wrong credentials')
            });        
      }
    }
  }
};
</script>
<style lang="postcss" scoped>
</style>
