export type Select = {
  id: string;
  label: string;
  list?: Select[];
  icon?: string;
  iconClass?: string;
  description?: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
};

export type SelectArray = Select[];
