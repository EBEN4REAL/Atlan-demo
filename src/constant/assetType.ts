import snowflake from "~/assets/images/source/snowflake.png";
import tableau from "~/assets/images/assetType/tableau.png";

export const AssetTypeList = [
  {
    id: "AtlanConnection",
    label: "Connection",
    nameAttribute: "connectionName",
    qualifiedNameAttribute: "connectionQualifiedName",
    parents: [],
    children: ["AtlanColumns"],
  },
  {
    id: "AtlanDatabase",
    label: "Database",
    nameAttribute: "databaseName",
    qualifiedNameAttribute: "databaseQualifiedName",
    parents: ["AtlanConnection"],
    children: ["AtlanColumns"],
  },
  {
    id: "AtlanSchema",
    label: "Schema",
    nameAttribute: "schemaName",
    qualifiedNameAttribute: "schemaQualifiedName",
    parents: ["AtlanConnection", "AtlanDatabase"],
    children: ["AtlanColumns"],
  },
  {
    id: "AtlanTable",
    label: "Table",
    nameAttribute: "tableName",
    qualifiedNameAttribute: "tableQualifiedName",
    parents: ["AtlanConnection", "AtlanDatabase", "AtlanSchema"],
    children: ["AtlanColumns"],
  },
  {
    id: "AtlanColumns",
    label: "Columns",
    nameAttributeattribute: "",
    qualifiedNameAttribute: "databaseQualifiedName",
    parents: ["AtlanConnection", "AtlanDatabase", "AtlanSchema", "AtlanTable"],
    children: ["AtlanColumns"],
  },
];
