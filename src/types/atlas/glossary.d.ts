

import { Components } from "~/types/atlas/client";
import { BaseAttributes } from "../asset";

export interface GlossaryAttributes extends BaseAttributes {

}



export interface GlossaryType extends Components.Schemas.AtlasGlossary {
    attributes: GlossaryAttributes
}