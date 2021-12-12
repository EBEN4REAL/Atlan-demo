/* eslint-disable import/prefer-default-export */
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
    TimePicker,
    Popconfirm,
    Empty,
    Typography,
    Image,
    Row,
    Col,
    Result,
} from 'ant-design-vue'
import { UserModule } from '~/types/vitessg'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ app }) => {
    app.use(Alert)
    app.use(Avatar)
    app.use(Badge)
    app.use(Button)
    app.use(Cascader)
    app.use(Checkbox)
    app.use(Collapse)
    app.use(DatePicker)
    app.use(Divider)
    app.use(Drawer)
    app.use(Dropdown)
    app.use(Empty)
    app.use(Form)
    app.use(Image)
    app.use(Input)
    app.use(InputNumber)
    app.use(Layout)
    app.use(List)
    app.use(Menu)
    app.use(Modal)
    app.use(Pagination)
    app.use(Popconfirm)
    app.use(Popover)
    app.use(Progress)
    app.use(Radio)
    app.use(Select)
    app.use(Spin)
    app.use(Steps)
    app.use(Switch)
    app.use(Table)
    app.use(Tabs)
    app.use(Tag)
    app.use(TimePicker)
    app.use(Timeline)
    app.use(Tooltip)
    app.use(Tree)
    app.use(TreeSelect)
    app.use(Typography)
    app.use(Upload)
    app.use(Row)
    app.use(Col)
    app.use(Result)

    app.config.globalProperties.$message = message
    app.config.globalProperties.$error = Modal.error
    app.config.globalProperties.$confirm = Modal.confirm
}
