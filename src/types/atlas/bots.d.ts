

import { Components } from "~/api/atlas/client";
import { SourceList } from "~/constant/source";
import { BaseAttributes } from "../asset";

export interface BotsAttributes extends BaseAttributes {
    integrationName?: string;

    [key: string]: any
}

export interface BotsType extends Components.Schemas.AtlasEntity {
    attributes: BotsAttributes,
}

