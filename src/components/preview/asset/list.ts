import { MenuArray } from "~/types";

export const List: MenuArray = [
  {
    id: "overview",
    label: "Information",
    description: "Information",
    icon: "fal info-circle",
    url: "/",
  },
  {
    id: "chat",
    label: "Chat",
    description: "Chat",
    icon: "fal comments-alt",
    url: "",
  },
  {
    id: "audit",
    label: "Audit Logs",
    description: "Audit Logs",
    icon: "fal history",
    url: "",
  },
  {
    id: "column",
    label: "Columns",
    description: "Columns",
    icon: "fal columns",
  },
  {
    id: "Usage",
    label: "Usage",
    description: "Usage",
    icon: "fal analytics",
    url: "/projects",
  },
  {
    id: "lineage",
    label: "Lineage",
    description: "Lineage",
    icon: "fal project-diagram",
    url: "/admin",
  },
  {
    id: "actions",
    label: "Actions",
    description: "Actions",
    icon: "fal bolt",
    url: "/admin",
  },
];
