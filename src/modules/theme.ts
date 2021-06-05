import { UserModule } from "~/types/vitessg";

// const themeToggle = function () {
//   const htmlTag = document.querySelector("html");
//   if (htmlTag.classList.contains("dark")) {
//     htmlTag.className = "light";
//   } else {
//     htmlTag.className = "dark";
//   }
// };

// const getCurrentTheme = function (): any {
//   const htmlTag = document.querySelector("html");
//   return htmlTag?.classList;
// };

// const getDarkTheme = () => import("~/styles/dark.less");
// const getLightTheme = () => import("~/styles/light.less");

export const install: UserModule = ({ app }) => {
  // console.log(getCurrentTheme());
  // getCurrentTheme().forEach((element: string) => {
  //   console.log(element);
  //   if (element === "dark") {
  //     import("~/styles/dark.less");
  //   } else {
  //     import("~/styles/light.less");
  //   }
  // });
};
