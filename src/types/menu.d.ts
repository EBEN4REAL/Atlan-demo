export type Menu = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  iconClass?: string;
  url?: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
};

export type MenuArray = Menu[];
