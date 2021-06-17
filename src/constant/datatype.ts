


import number from "~/assets/images/dataType/number.svg";

export const dataTypeList = [
  {
    id: "number",
    label: "Number",
    type: [
      "NUMBER",
      "NUMERIC",
      "INT",
      "INTEGER",
      "BIGINT",
      "SMALLINT",
      "DECIMAL",
      "FLOAT4",
      "FLOAT8",
      "DOUBLE",
      "DOUBLE PRECISION",
      "REAL",
    ],
    image: number,
  },
  {
    id: "integer",
    label: "Integer",
    type: ["INT", "INTEGER", "BIGINT", "SMALLINT"],
    image: number,
  },
  {
    id: "decimal",
    label: "Decimal",
    type: [
      "NUMBER",
      "NUMERIC",
      "DECIMAL",
      "FLOAT4",
      "FLOAT8",
      "DOUBLE",
      "DOUBLE PRECISION",
      "REAL",
    ],
    image: number,
  },
  {
    id: "text",
    label: "Text",
    type: [
      "VARCHAR",
      "CHAR",
      "CHARACTER",
      "STRING",
      "TEXT",
      "BINARY",
      "VARBINARY",
    ],
    image: number,
  },
  {
    id: "boolean",
    label: "Boolean",
    type: ["BOOLEAN"],
    image: number,
  },
  {
    id: "date",
    label: "Date/Timestamp",
    type: [
      "DATE",
      "TIME",
      "TIMESTAMP",
      "TIMESTAMP_LTZ",
      "TIMESTAMP_NTZ",
      "IMESTAMP_TZ",
    ],
    image: number,
  },
  {
    id: "array",
    label: "Array",
    type: ["ARRAY"],
    image: number,
  },
  {
    id: "object",
    label: "Object",
    type: ["VARIANT", "OBJECT"],
    image: number,
  },
  {
    id: "geography",
    label: "Geography",
    type: ["GEOGRAPHY", "OBJECT"],
    image: number,
  },
];