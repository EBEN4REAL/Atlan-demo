import { MenuArray } from "~/types";

export const List: MenuArray = [
  {
    id: "home",
    label: "home",
    description: "Home",
    icon: "fal house-user",
    url: "/",
  },
  {
    id: "explore",
    label: "Discover",
    description: "Discover",
    icon: "fal search",
    url: "/assets",
  },
  {
    id: "glossary",
    label: "Glossary",
    description: "Glossary",
    icon: "fal certificate",
    url: "/glossary",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Projects",
    icon: "fal browser",
    url: "/projects",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Admin Centre",
    icon: "fal user-shield",
    url: "/admin",
  },
];
