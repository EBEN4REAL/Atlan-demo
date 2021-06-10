import Table from "~/assets/images/assetType/Table.svg";
import Column from "~/assets/images/assetType/Column.svg";
import Database from "~/assets/images/assetType/Database.svg";
import Schema from "~/assets/images/assetType/Schema.svg";
import { UserModule } from "~/types/vitessg";

export const install: UserModule = ({ app }) => {
  app.component("Table", Table);
  app.component("Column", Column);
  app.component("Database", Database);
  app.component("Schema", Schema);
};
