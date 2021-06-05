import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { UserModule } from "~/types/vitessg";

export const install: UserModule = ({ app }) => {
  app.component("Splitpanes", Splitpanes);
  app.component("Pane", Pane);
};
