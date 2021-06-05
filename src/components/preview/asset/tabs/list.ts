import { MenuArray } from "~/types";

export const List: MenuArray = [
  {
    id: "overview",
    label: "Overview",
    description: "Overview",
    icon: "fal house-user",
    url: "/",
  },
  {
    id: "chat",
    label: "Chat",
    description: "Chat",
    icon: "fal search",
    url: "/assets",
  },
  {
    id: "audit",
    label: "Audit Logs",
    description: "Audit Logs",
    icon: "fal certificate",
    url: "/glossary",
  },
  {
    id: "Usage",
    label: "Usage",
    description: "Usage",
    icon: "fal browser",
    url: "/projects",
  },
  {
    id: "lineage",
    label: "Lineage",
    description: "Lineage",
    icon: "fal user-shield",
    url: "/admin",
  },
];
