import Table from "~/assets/images/assetType/Table.svg";
import Column from "~/assets/images/assetType/Column.svg";
import Database from "~/assets/images/assetType/Database.svg";
import Schema from "~/assets/images/assetType/Schema.svg";
import View from "~/assets/images/assetType/View.svg";
import TablePartition from "~/assets/images/assetType/TablePartition.svg";
import MaterialisedView from "~/assets/images/assetType/MaterialisedView.svg";

import { UserModule } from "~/types/vitessg";




// import Snowflake from "~/assets/images/source/snowflake.png";
// import tableau from "~/assets/images/source/tableau.png";
// import redshift from "~/assets/images/source/redshift.png";

export const install: UserModule = ({ app }) => {
  app.component("Table", Table);
  app.component("Column", Column);
  app.component("Database", Database);
  app.component("Schema", Schema);
  app.component("View", View);
  app.component("TablePartition", TablePartition);
  app.component("MaterialisedView", MaterialisedView);

  // app.component("number", number);
};
