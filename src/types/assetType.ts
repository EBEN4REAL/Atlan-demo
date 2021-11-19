import { Components } from "~/types/atlas/client";

export interface AtlanTableAttributes extends Components.Schemas.AtlasTypesDef {
  rowCount?: number;
}
