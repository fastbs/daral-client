import MenuFetch from "@/components/Menu/MenuFetch";
import MenuView from "@/components/Menu/MenuView";
import MenuAdd from "@/components/Menu/MenuAdd";
import MenuEdit from "@/components/Menu/MenuEdit";

const routes = [
  {
    path: "/Menu",
    name: "MenuFetch",
    component: MenuFetch
  },
  {
    path: "/Menu/new",
    name: "MenuAdd",
    component: MenuAdd
  },
  {
    path: "/Menu/edit/:id",
    name: "MenuEdit",
    component: MenuEdit,
    props: true
  },
  {
    path: "/Menu/:id",
    name: "MenuView",
    component: MenuView,
    props: true
  },
];

export default routes;
