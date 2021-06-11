import { Components } from "~/api/atlas/client";

export interface BaseAttributes {
  name?: string;
  description?: string;
  assetStatus?: string;
  createTime: Date
}

export interface AtlanTableAttributes extends BaseAttributes {
  rowCount?: number;
}

export interface AtlanConnectionAttributes extends BaseAttributes {
  integrationName?: string;
  allowQuery?: boolean;
  allowPreview?: boolean;
}
