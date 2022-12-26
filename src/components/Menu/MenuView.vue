<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading">
        <div class="mb-3"><h1>Меню - Просмотр блюда</h1></div>
        <div class="card mb-3 shadow">
          <img v-if="menu.imagefile" :src="menu.imagefile" class="card-img-top" alt="Menu image">
          <div class="card-body">
            <h4 class="card-title">{{ menu.name }}</h4>
            <hr />
            <p class="card-text text-truncate">{{ menu.description }}</p>
            <small class="d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">Категория: {{ menu.category.name }}</small>
            <div class="d-flex justify-content-end">
              <router-link
                class="btn btn-success me-2"
                v-if="permissions.find((x) => x.name == 'put')"
                :to="{ name: 'MenuEdit', params: { id: menu.id } }"
                >Изменить</router-link
              >
              <button
                type="button"
                class="btn btn-danger me-2"
                v-if="permissions.find((x) => x.name == 'delete')"
                @click="deleteMenu(menu.id)"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2">
          <router-link
            class="btn btn-primary mb-4"
            v-if="!loading && permissions.find((x) => x.name == 'post')"
            :to="{ name: 'MenuAdd' }"
            >Добавить</router-link
          >
        </div>
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
  name: "MenuView",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();

    const menu = ref({});
    const loading = ref(true);
    const permissions = ref({});

    const getMenu = async () => {
      try {
        const response = await MenuService.get({ id: props.id });
        menu.value = response.data.menu;
        if (menu.value.filename) {
          menu.value.imagefile = MenuService.getImagePath(props.id);
        }
        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuView - getMenu!!!",
          text: err.response.data.message,
        });
      }
    };

    const deleteMenu = async () => {
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
            await MenuService.delete(menu.value.id);
            router.push({ name: "MenuFetch" });
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Беда в MenuView - deleteMenu!!!",
              text: err.response.data.message,
            });
          }
        }
      });
    };

    onMounted(async () => {
      const response = await AuthService.checkPermissions("menu");
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.name == "get")) {
        getMenu();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в MenuView - mounted!!!",
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
