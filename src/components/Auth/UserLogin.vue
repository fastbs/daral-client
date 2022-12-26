<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-sm-4">
        <div class="card mb-3 mt-3 shadow">
          <div class="card-header bg-primary text-light">Логин</div>
          <div class="card-body">
            <div class="form-group mb-4">
              <label for="email">Имя</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-account mdi-24px"
                /></span>
                <input
                  type="name"
                  v-model="state.name"
                  id="name"
                  name="name"
                  :class="{
                    'is-invalid': v$.name.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span v-if="v$.name.required.$invalid"
                    >Имя обязательно</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="password">Пароль</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-lock mdi-24px"
                /></span>
                <input
                  type="password"
                  v-model="state.password"
                  id="password"
                  name="password"
                  :class="{
                    'is-invalid': v$.password.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.password.$error" class="invalid-feedback">
                  <span v-if="v$.password.required.$invalid"
                    >Пароль обязателен</span
                  >
                  <span v-if="v$.password.minLength.$invalid"
                    >Минимальная длина пароля - 5 символов</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group">
              <button type="button" class="btn btn-primary" @click="onSubmit">
                Войти
              </button>
              <router-link
                class="btn btn-success ms-4"
                :to="{ name: 'UserRegistration' }"
                >Регистрация</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";

export default {
  name: "UserLogin",

  emits: ["update-menu"],

  setup(props, context) {
    const router = useRouter();

    const state = reactive({
      name: "",
      password: "",
    });

    const rules = computed(() => ({
      name: {
        required,
      },
      password: {
        required,
        minLength: minLength(5),
      },
    }));

    const v$ = useVuelidate(rules, state);

    const onSubmit = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        const user = {
          username: state.name,
          password: state.password,
        };

        AuthService.loginUser(user)
          .then((response) => {
            window.localStorage.setItem("auth", response.data.access_token);
            Swal.fire({
              title: "Успешный вход",
              icon: "success",
            }).then(() => {
              context.emit("update-menu");
              router.push({ name: "Home" });
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Прям беда!",
              text: err.response.data.message,
            });
          });
      }
    };

    return { router, state, v$, onSubmit };
  },
};
</script>
