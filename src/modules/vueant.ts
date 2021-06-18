/*
ONLY include what is needed. 
Use fontawesome for Icon

*/

import { updater } from './../api/index';
import { UserModule } from "~/types/vitessg";
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
  List,
  Cascader,
  Timeline,
} from "ant-design-vue";

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
  app.use(List);
  app.use(Cascader);
  app.use(Timeline);

  app.config.globalProperties.$message = message;
  app.config.globalProperties.$error = Modal.error;
};
