// auto-focus directive use it as v-focus
export function inputFocusDirective(app: any) {
  app.directive("input-focus", {
    mounted(el: any) {
      el.focus();
    },
  });
}
