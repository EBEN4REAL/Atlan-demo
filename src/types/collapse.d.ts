import { Components } from "~/api/atlas/client";

export type Collapse = {
  id: string;
  label: string;
  icon?: string;
  iconClass?: string;
  description?: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
  component?: string;
  panelClass?: string;
  overallCondition?: Components.Schemas.Condition;
  filters?: {
    attributeName: string;
    condition: Components.Schemas.Condition;
    isMultiple?: boolean;
    operator: string;
  }[];
};

export type CollapseArray = Collapse[];
