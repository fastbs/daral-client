<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading">
        <div class="card mb-3 mt-3 shadow">
          <div class="card-header bg-primary text-light">Добавление блюда в меню</div>
          <div class="card-body">
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
                  :class="{ 'is-invalid': v$.categoryId.$error, 'form-select': true, }">
                  <option value="">Выберите категорию</option>
                  <option v-for="item in categories" :value="item.id" :key="item.name">
                    {{ item.name }}
                  </option>
                </select>
                <div v-if="v$.categoryId.$error" class="invalid-feedback">
                  <span v-if="v$.categoryId.required.$invalid">Категория обязательна</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <button type="button" class="btn btn-secondary" @click.prevent="handleAttachment($event)">
                Добавить изображение
              </button>
              <span v-if="menu.file" class="ms-4">Имя: {{ menu.file.name }}</span><span v-if="menu.file" class="ms-4">Размер:  {{ menu.file.size }} байт</span>
            </div>

            <input id="hiddenAttachment" class="hide" type="file" @change.prevent="fileChange($event)" />
            <a id="attachmentAnchor" class="hide" />

            <div class="form-group">
              <button type="button" class="btn btn-primary" @click="addMenu">
                Добавить блюдо
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import MenuService from "@/services/MenuService";

export default {
  name: "MenuAdd",

  setup() {
    const router = useRouter();

    const menu = reactive({ name: "", description: "", categoryId: "", file: "" });
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
      categoryId: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, menu);

    const addMenu = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        let formData = new FormData();
        formData.append("name", menu.name);
        formData.append("description", menu.description);
        formData.append("categoryId", menu.categoryId);
        //formData.append("filename", menu.file.name);
        formData.append("attachment", menu.file);

        await MenuService.add(formData);
/*           {
          name: menu.name,
          description: menu.description,
        });
 */        router.push({ name: "MenuFetch" });
      }
    };

    const handleAttachment = () => {
      document.getElementById("hiddenAttachment").click();
    };

    const fileChange = async (event) => {
      menu.file = event.target.files[0];
    }

    onMounted(async () => {
      let response = await AuthService.checkPermissions("menu");
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.name == "post")) {
        response = await MenuService.getCategories();
        categories.value = response.data.categories;
        loading.value = false;
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuAdd - mounted!!!",
          text: "Доступ запрещен!",
        });
        router.push({ name: "Home" });
      }
    });

    return { menu, categories, loading, addMenu, fileChange, handleAttachment, v$ };
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