<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading">
        <div class="card mb-3 mt-3 shadow">
          <div class="card-header bg-primary text-light">Изменение блюда в меню</div>
          <div class="card-body">
            <img v-if="menu.imagefile" :src="menu.imagefile" class="card-img-top" alt="Menu image">
            <div class="form-group mb-4">
              <label for="title">Наименование</label>
              <div class="input-group">
                <span class="input-group-text"><span class="mdi mdi-message mdi-24px" /></span>
                <input type="text" v-model="menu.name" id="name" name="name" :class="{
                  'is-invalid': v$.name.$error,
                  'form-control': true,
                }" />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span v-if="v$.name.required.$invalid">Наименование обязательно</span>
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="description">Описание</label>
              <div class="input-group">
                <span class="input-group-text"><span class="mdi mdi-message-text mdi-24px" /></span>
                <input type="text" v-model="menu.description" id="description" name="description" :class="{
                  'is-invalid': v$.description.$error,
                  'form-control': true,
                }" />
                <div v-if="v$.description.$error" class="invalid-feedback">
                  <span v-if="v$.description.required.$invalid">Описание обязательно</span>
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="description">Категория</label>
              <div class="input-group">
                <span class="input-group-text"><span class="mdi mdi-menu-open mdi-24px" /></span>
                <select v-model="menu.categoryId" id="category" name="category"
                  :class="{ 'is-invalid': v$.category.$error, 'form-select': true, }">
                  <option disabled value="">Выберите категорию</option>
                  <option v-for="item in categories" :value="item.id" :key="item.name">
                    {{ item.name }}
                  </option>
                </select>
                <div v-if="v$.category.$error" class="invalid-feedback">
                  <span v-if="v$.category.required.$invalid">Категория обязательна</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <button type="button" class="btn btn-secondary" @click.prevent="handleAttachment($event)">
                Изменить изображение
              </button>
              <span v-if="menu.file" class="ms-4">Имя: {{ menu.file.name }}</span><span v-if="menu.file"
                class="ms-4">Размер: {{ menu.file.size }} байт</span>
            </div>

            <input id="hiddenAttachment" class="hide" type="file" @change.prevent="fileChange($event)" />
            <a id="attachmentAnchor" class="hide" />

            <div class="form-group">
              <button type="button" class="btn btn-primary" @click="updateMenu">
                Изменить блюдо
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import MenuService from "@/services/MenuService";

export default {
  name: "MenuEdit",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();

    const menu = ref({});
    const categories = ref({});
    const loading = ref(true);
    const permissions = ref({});

    const rules = computed(() => ({
      name: {
        required,
      },
      description: {
        required,
      },
      category: {
        required,
      }
    }));

    const v$ = useVuelidate(rules, menu);

    const getMenu = async () => {
      try {
        let response = await MenuService.get({ id: props.id });
        menu.value = response.data.menu;
        if (menu.value.filename) {
          menu.value.imagefile = MenuService.getImagePath(props.id);
        }
        response = await MenuService.getCategories();
        categories.value = response.data.categories;
        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuEdit - getMenu!!!",
          //text: err.response.data.message,
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    };

    const updateMenu = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        let formData = new FormData();
        formData.append("id", menu.value.id);
        formData.append("name", menu.value.name);
        formData.append("description", menu.value.description);
        formData.append("categoryId", menu.value.categoryId);
        formData.append("attachment", menu.value.file);
        try {
          await MenuService.update(menu.value.id, formData);
          router.push({ name: "MenuFetch" });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Беда в MenuEdit - updateMenu!!!",
            text: err.response.data.message,
          }).then(() => {
            router.push({ name: "Home" });
          });
        }
      }
    };

    const handleAttachment = () => {
      document.getElementById("hiddenAttachment").click();
    };

    const fileChange = async (event) => {
      menu.value.file = event.target.files[0];
    }

    onBeforeMount(async () => {
      const response = await AuthService.checkPermissions("menu");
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.name == "put")) {
        getMenu();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuEdit - onBeforeMount!!!",
          text: "Доступ запрещен!",
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    });

    return { menu, categories, v$, loading, permissions, fileChange, handleAttachment, updateMenu };
  },
};
</script>

<style scoped>
.hide {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>