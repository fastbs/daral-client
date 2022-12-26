<template>
  <div class="container-sm">
    <div class="row m-3 justify-content-md-center">
      <div class="col-6">
        <div id="carouselExampleCaptions" class="carousel slide mb-3 carousel-dark" data-bs-ride="carousel"
          v-if="!loading && permissions.find((x) => x.name == 'fetch')">
          <div class="carousel-indicators">
            <button v-for="(item, index)  in menu" :key="item.title" type="button"
              data-bs-target="#carouselExampleCaptions" :data-bs-slide-to="index" :class="{ 'active': index == 0 }"
              aria-current="true"></button>
          </div>
          <div class="carousel-inner">

            <div :class="{ 'carousel-item': true, 'active': index == 0 }" v-for="(item, index)  in menu"
              :key="item.title">
              <img v-if="item.imagefile" :src="item.imagefile" class="d-block w-100" alt="...">
              <div class="carousel-caption d-none d-md-block">
                <h5>{{ item.name }}</h5>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Предыдущий</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Следующий</span>
          </button>
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
  name: "HomePage",

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

    onMounted(async () => {
      const response = await AuthService.checkPermissions("menu");
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.name == "fetch")) {
        fetchMenu();
      }
    });

    return { router, menu, loading, permissions };
  },
};


</script>

