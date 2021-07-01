import { Components } from "~/api/auth/atlas";

export interface BaseAttributes {
    name?: string;
    description?: string;
    [key: string]: any
}

export interface SearchParameters extends Components.Schemas.SearchParameters {
    [key: string]: any;
    minScore?: number;
}
