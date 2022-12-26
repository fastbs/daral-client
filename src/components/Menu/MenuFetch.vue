<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading && menu.length > 0">
        <div class="mb-3">
          <h1>Меню</h1>
        </div>
        <div class="d-grid gap-2">
          <router-link class="btn btn-primary mb-4" v-if="!loading && permissions.find((x) => x.name == 'post')"
            :to="{ name: 'MenuAdd' }">Добавить</router-link>
        </div>
        <div class="" v-for="item in menu" :key="item.title">
          <div class="card mb-3 shadow">
            <div class="card-body">
              <img v-if="item.imagefile" :src="item.imagefile" class="card-img-top" alt="Menu image">
              <h4 class="card-title">{{ item.name }}</h4>
              <hr />
              <p class="card-text text-truncate">{{ item.description }}</p>
              <small
                class="d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">Категория:
                {{ item.category.name }}</small>
              <div class="d-flex justify-content-end">
                <router-link class="btn btn-primary me-2" v-if="permissions.find((x) => x.name == 'get')"
                  :to="{ name: 'MenuView', params: { id: item.id } }">Просмотр</router-link>
                <router-link class="btn btn-success me-2" v-if="permissions.find((x) => x.name == 'put')"
                  :to="{ name: 'MenuEdit', params: { id: item.id } }">Изменить</router-link>
                <button type="button" class="btn btn-danger me-2" v-if="permissions.find((x) => x.name == 'delete')"
                  @click="deleteMenu(item.id)">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2">
          <router-link class="btn btn-primary mb-4" v-if="!loading && permissions.find((x) => x.name == 'post')"
            :to="{ name: 'MenuAdd' }">Добавить</router-link>
        </div>
      </div>
      <div v-else-if="!loading">
        <h2 class="mb-3 mt-8">В меню пока ничего нет...</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import MenuService from "@/services/MenuService";

export default {
  name: "MenuFetch",

  setup() {
    const router = useRouter();

    const menu = ref([]);
    const loading = ref(true);
    const permissions = ref({});

    const fetchMenu = async () => {
      try {
        const response = await MenuService.fetch();
        menu.value = response.data.menu;
        menu.value.forEach(item => {
          if (item.filename) {
            item.imagefile = MenuService.getImagePath(item.id);
          }
        });
        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuFetch - getMenu!!!",
          text: err.response.data.message,
        });
      }
    };

    const deleteMenu = async (value) => {
      Swal.fire({
        icon: "question",
        title: "Удалить блюдо из меню?",
        showDenyButton: true,
        confirmButtonText: "Удалить",
        denyButtonText: "Оставить",
        confirmButtonColor: "#dc3545",
        denyButtonColor: "#0d6efd",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await MenuService.delete(value);
            fetchMenu();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Беда в MenuFetch - deleteMenu!!!",
              text: err.response.data.message,
            });
          }
        }
      });
    };

    onMounted(async () => {
      const response = await AuthService.checkPermissions("menu");
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.name == "fetch")) {
        fetchMenu();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuFetch - mounted!!!",
          text: "Доступ запрещен!",
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    });

    return { router, menu, loading, permissions, deleteMenu };
  },
};
</script>

<style scoped>
@import "bootstrap/dist/css/bootstrap.css";
</style>
