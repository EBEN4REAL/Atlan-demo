export type Menu = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  iconClass?: string;
  url?: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
  typeNames?: string[],
};

export type MenuArray = Menu[];
