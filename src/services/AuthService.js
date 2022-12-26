import api from "@/services/api";

export default {
  registerUser(params) {
    return api().post("users/register", params);
  },

  loginUser(params) {
    return api().post("auth/login", params);
  },

  checkPermissions(name) {
    return api().get(`users/permissions/${name}`);
  },

  getMenu() {
    return api().get("users/menu");
  },

  async checkAction(resource, name) {
    try {
      const resp = await api().post("users/permissions", { "resource": resource });
      if (resp.data.permissions.find((x) => x.name == name)) {
        return true;
      }
    }
    catch {
      return false;
    }
    return false;
  },


};
