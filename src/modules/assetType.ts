import AtlanTable from "~/assets/images/assetType/AtlanTable.svg";
import AtlanColumn from "~/assets/images/assetType/AtlanColumn.svg";
import AtlanDatabase from "~/assets/images/assetType/AtlanDatabase.svg";
import AtlanSchema from "~/assets/images/assetType/AtlanSchema.svg";
import { UserModule } from "~/types/vitessg";

export const install: UserModule = ({ app }) => {
  app.component("AtlanTable", AtlanTable);
  app.component("AtlanColumn", AtlanColumn);
  app.component("AtlanDatabase", AtlanDatabase);
  app.component("AtlanSchema", AtlanSchema);
};
