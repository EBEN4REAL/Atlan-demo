

import { Components } from "~/types/atlas/client";
import { BaseAttributes } from "../asset";

export interface CredentialAttributes extends BaseAttributes {
    authType?: string;

}

export interface CredentialType extends Components.Schemas.AtlasEntity {
    attributes: CredentialAttributes
}