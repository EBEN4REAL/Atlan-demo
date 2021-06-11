export const AssetTypeList = [
  {
    id: "Connection",
    label: "Connection",
    nameAttribute: "connectionName",
    qualifiedNameAttribute: "connectionQualifiedName",
    parents: [],
    children: ["Columns"],
  },
  {
    id: "Database",
    label: "Database",
    nameAttribute: "databaseName",
    qualifiedNameAttribute: "databaseQualifiedName",
    parents: ["AtlanConnection"],
    children: ["Columns"],
  },
  {
    id: "Schema",
    label: "Schema",
    nameAttribute: "schemaName",
    qualifiedNameAttribute: "schemaQualifiedName",
    parents: ["AtlanConnection", "AtlanDatabase"],
    children: ["Columns"],
  },
  {
    id: "Table",
    label: "Table",
    nameAttribute: "tableName",
    qualifiedNameAttribute: "tableQualifiedName",
    parents: ["Connection", "Database", "Schema"],
    children: ["Columns"],
  },
  {
    id: "Columns",
    label: "Columns",
    nameAttributeattribute: "",
    qualifiedNameAttribute: "databaseQualifiedName",
    parents: ["Connection", "Database", "Schema"],
    children: ["Columns"],
  },
];
