import VueNumerals from 'vue-numerals';

import { UserModule } from "~/types";

export const install: UserModule = ({ app }) => {

    app.use(VueNumerals);

};
