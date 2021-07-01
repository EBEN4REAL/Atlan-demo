

import { createPinia } from "pinia";



import { UserModule } from "~/types";
export const install: UserModule = ({ app }) => {
    app.use(createPinia());
};
