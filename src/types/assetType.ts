import { Components } from "~/api/atlas/client";

export interface AtlanTableAttributes extends Components.Schemas.AtlasTypesDef {
  rowCount?: number;
}
