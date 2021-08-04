/*
ONLY include what is needed. 
Use fontawesome for Icon

*/

import {
  Button,
  Input,
  Spin,
  Layout,
  Menu,
  Tabs,
  Avatar,
  Dropdown,
  Collapse,
  Checkbox,
  Tooltip,
  Select,
  Tree,
  TreeSelect,
  Popover,
  Steps,
  message,
  Modal,
  Form,
  Radio,
  Divider,
  InputNumber,
  Switch,
  Alert,
  Progress,
  Table,
  Upload,
  Drawer,
  List,
  Cascader,
  Badge,
  Tag,
  Timeline,
  Pagination,
  DatePicker,
  Popconfirm,
  Empty
} from "ant-design-vue";
import { updater } from "../api/index";
import { UserModule } from "~/types/vitessg";

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ app }) => {
  app.use(Button);
  app.use(Input);
  app.use(Spin);
  app.use(Menu);
  app.use(Layout);
  app.use(Tabs);
  app.use(Avatar);
  app.use(Dropdown);
  app.use(Collapse);
  app.use(Checkbox);
  app.use(Tooltip);
  app.use(Tree);
  app.use(TreeSelect);
  app.use(Select);
  app.use(Popover);
  app.use(Steps);
  app.use(Form);
  app.use(Divider);
  app.use(Radio);
  app.use(InputNumber);
  app.use(Switch);
  app.use(Alert);
  app.use(Progress);
  app.use(Table);
  app.use(Modal);
  app.use(Upload);
  app.use(Drawer);
  app.use(List);
  app.use(Cascader);
  app.use(Timeline);
  app.use(Badge);
  app.use(Tag);
  app.use(Pagination);
  app.use(DatePicker);
  app.use(Popconfirm);
  app.use(Empty);


  app.config.globalProperties.$message = message;
  app.config.globalProperties.$error = Modal.error;
};
