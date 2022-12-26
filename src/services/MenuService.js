import api from "@/services/api";

export default {
  fetch() {
    return api().get('resource/menu')
  },

  add(params) {
    return api().post('resource/menu', params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  get(params) {
    return api().get(`resource/menu/${params.id}`)
  },

  update(id, params) {
    return api().patch(`resource/menu/${id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  delete(id) {
    return api().delete(`resource/menu/${id}`)
  },

  getCategories() {
    return api().get('resource/menu/categories');
  },

  getImagePath(id) {
    const imagePath = `http://localhost:3000/resource/menu/image/${id}`;
    return imagePath;
  }
};
