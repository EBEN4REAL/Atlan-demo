import { UserModule } from "~/types";
import { library, dom, config } from "@fortawesome/fontawesome-svg-core";

// Light Icons
import { faCircle } from "@fortawesome/pro-light-svg-icons";
import { faPlus } from "@fortawesome/pro-light-svg-icons/faPlus";
import { faSearch } from "@fortawesome/pro-light-svg-icons/faSearch";
import { faUser } from "@fortawesome/pro-light-svg-icons/faUser";
import { faUsers } from "@fortawesome/pro-light-svg-icons/faUsers";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons/faCheckCircle";
import { faCircleNotch } from "@fortawesome/pro-light-svg-icons/faCircleNotch";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes";
import { faTimesCircle } from "@fortawesome/pro-light-svg-icons/faTimesCircle";
import { faSort } from "@fortawesome/pro-light-svg-icons/faSort";
import { faHome } from "@fortawesome/pro-light-svg-icons/faHome";
import { faLink } from "@fortawesome/pro-light-svg-icons/faLink";
import { faTrash } from "@fortawesome/pro-light-svg-icons/faTrash";
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons/faQuestionCircle";
import { faInfo } from "@fortawesome/pro-light-svg-icons/faInfo";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons/faChevronLeft";
import { faChevronDown } from "@fortawesome/pro-light-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/pro-light-svg-icons/faChevronUp";
import { faCommentsAlt } from "@fortawesome/pro-light-svg-icons/faCommentsAlt";
import { faShare } from "@fortawesome/pro-light-svg-icons/faShare";
import { faComment } from "@fortawesome/pro-light-svg-icons/faComment";
import { faListAlt } from "@fortawesome/pro-light-svg-icons/faListAlt";
import { faPlug } from "@fortawesome/pro-light-svg-icons/faPlug";
import { faFilter } from "@fortawesome/pro-light-svg-icons/faFilter";
import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faCog } from "@fortawesome/pro-light-svg-icons/faCog";
import { faUserCog } from "@fortawesome/pro-light-svg-icons/faUserCog";
import { faClock } from "@fortawesome/pro-light-svg-icons/faClock";
import { faUsersCog } from "@fortawesome/pro-light-svg-icons/faUsersCog";
import { faEllipsisV } from "@fortawesome/pro-light-svg-icons/faEllipsisV";
import { faEllipsisH } from "@fortawesome/pro-light-svg-icons/faEllipsisH";
import { faLock } from "@fortawesome/pro-light-svg-icons/faLock";
import { faBrowser } from "@fortawesome/pro-light-svg-icons/faBrowser";
import { faHouseUser } from "@fortawesome/pro-light-svg-icons/faHouseUser";
import { faBan } from "@fortawesome/pro-light-svg-icons/faBan";
import { faCertificate } from "@fortawesome/pro-light-svg-icons/faCertificate";
import { faUserShield } from "@fortawesome/pro-light-svg-icons/faUserShield";
import { faShield } from "@fortawesome/pro-light-svg-icons/faShield";
import { faUserEdit } from "@fortawesome/pro-light-svg-icons/faUserEdit";
import { faSync } from "@fortawesome/pro-light-svg-icons/faSync";
import { faChevronDoubleLeft } from "@fortawesome/pro-light-svg-icons/faChevronDoubleLeft";

import { faGlobe } from "@fortawesome/pro-light-svg-icons/faGlobe";
import { faHistory } from "@fortawesome/pro-light-svg-icons/faHistory";
import { faColumns } from "@fortawesome/pro-light-svg-icons/faColumns";
import { faAnalytics } from "@fortawesome/pro-light-svg-icons/faAnalytics";
import { faProjectDiagram } from "@fortawesome/pro-light-svg-icons/faProjectDiagram";
import { faBolt } from "@fortawesome/pro-light-svg-icons/faBolt";
import { faPlusCircle } from "@fortawesome/pro-light-svg-icons/faPlusCircle";
import { faPen } from "@fortawesome/pro-light-svg-icons/faPen";
import { faPencil } from "@fortawesome/pro-light-svg-icons/faPencil";
import { faEnvelope } from "@fortawesome/pro-light-svg-icons/faEnvelope";
import { faArrowCircleRight } from "@fortawesome/pro-light-svg-icons/faArrowCircleRight";

import { faUserTag } from "@fortawesome/pro-light-svg-icons/faUserTag";

import { faBell } from "@fortawesome/pro-light-svg-icons/faBell";

import { faGift } from "@fortawesome/pro-light-svg-icons/faGift";

import { faTag } from "@fortawesome/pro-light-svg-icons/faTag";
import { faRobot } from "@fortawesome/pro-light-svg-icons/faRobot";
import { faChartNetwork } from "@fortawesome/pro-light-svg-icons/faChartNetwork";

import { faTrashAlt } from "@fortawesome/pro-light-svg-icons/faTrashAlt";
import { faTabletAlt } from "@fortawesome/pro-light-svg-icons/faTabletAlt";
import { faArrowDown } from "@fortawesome/pro-light-svg-icons/faArrowDown";
import { faArrowUp } from "@fortawesome/pro-light-svg-icons/faArrowUp";

import { faExclamationCircle } from "@fortawesome/pro-light-svg-icons/faExclamationCircle";

import { faUserFriends } from "@fortawesome/pro-light-svg-icons/faUserFriends";

import { faCopy } from "@fortawesome/pro-light-svg-icons/faCopy";

import { faUserSlash } from "@fortawesome/pro-light-svg-icons/faUserSlash";
import { faUserCheck } from "@fortawesome/pro-light-svg-icons/faUserCheck";
import { faSlidersHSquare } from "@fortawesome/pro-light-svg-icons/faSlidersHSquare";
import { faSignOut } from "@fortawesome/pro-light-svg-icons/faSignOut";
import { faFont } from "@fortawesome/pro-light-svg-icons/faFont";

library.add(
  faArrowUp,
  faPlus,
  faPlusCircle,
  faSearch,
  faEnvelope,
  faUser,
  faUsers,
  faCheckCircle,
  faCheck,
  faCircleNotch,
  faTrash,
  faTimes,
  faSort,
  faHome,
  faLink,
  faQuestionCircle,
  faInfo,
  faPencil,
  faInfoCircle,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faExclamationCircle,
  faListAlt,
  faPlug,
  faShare,
  faComment,
  faCommentsAlt,
  faFilter,
  faEye,
  faCog,
  faUserCog,
  faClock,
  faUsersCog,
  faTimesCircle,
  faEllipsisV,
  faEllipsisH,
  faLock,
  faBrowser,
  faHouseUser,
  faBan,
  faCircle,
  faCertificate,
  faUserShield,
  faShield,
  faPlug,
  faUserEdit,
  faSync,
  faGlobe,
  faHistory,
  faColumns,
  faAnalytics,
  faProjectDiagram,
  faBolt,
  faPen,
  faArrowCircleRight,
  faTabletAlt,
  faTrashAlt,
  faArrowDown,
  faChevronDoubleLeft,
  faUserFriends,
  faCopy,
  faUserTag,
  faBell,
  faGift,
  faTag,
  faRobot,
  faChartNetwork,
  faUserSlash,
  faUserCheck,
  faUserShield,
  faSlidersHSquare,
  faSignOut,
  faFont
);

// Solid Icons
import { faBadgeCheck } from "@fortawesome/pro-solid-svg-icons/faBadgeCheck";
import { faBadge as faBadgeSolid } from "@fortawesome/pro-solid-svg-icons/faBadge";
import { faTrash as faTrashSolid } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons/faMinusCircle";
import { faCheckCircle as faSolidCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faKey } from "@fortawesome/pro-solid-svg-icons/faKey";
import { faLock as faSolidLock } from "@fortawesome/pro-solid-svg-icons/faLock";

import { faBold } from "@fortawesome/pro-solid-svg-icons/faBold";
import { faItalic } from "@fortawesome/pro-solid-svg-icons/faItalic";
import { faStrikethrough } from "@fortawesome/pro-solid-svg-icons/faStrikethrough";
import { faParagraph } from "@fortawesome/pro-solid-svg-icons/faParagraph";
import { faUnderline } from "@fortawesome/pro-solid-svg-icons/faUnderline";
import { faListOl } from "@fortawesome/pro-solid-svg-icons/faListOl";
import { faListUl } from "@fortawesome/pro-solid-svg-icons/faListUl";
import { faCode } from "@fortawesome/pro-solid-svg-icons/faCode";
import { faQuoteLeft } from "@fortawesome/pro-solid-svg-icons/faQuoteLeft";
import { faUndo } from "@fortawesome/pro-solid-svg-icons/faUndo";
import { faRedo } from "@fortawesome/pro-solid-svg-icons/faRedo";
import { faLink as faSolidLink } from "@fortawesome/pro-solid-svg-icons/faLink";
// import { faPencil as faPencilDark} from "@fortawesome/pro-solid-svg-icons/faPencil";
import { faSquare } from "@fortawesome/pro-solid-svg-icons/faSquare";
import { faAlignLeft } from "@fortawesome/pro-solid-svg-icons/faAlignLeft";
import { faAlignCenter } from "@fortawesome/pro-solid-svg-icons/faAlignCenter";
import { faAlignRight } from "@fortawesome/pro-solid-svg-icons/faAlignRight";
import { faFileImage } from "@fortawesome/pro-solid-svg-icons/faFileImage";
import { faSpinner } from "@fortawesome/pro-light-svg-icons/faSpinner";
library.add(
  faBadgeCheck,
  faBadgeSolid,
  faTrashSolid,
  faExclamationTriangle,
  faMinusCircle,
  faSolidCheckCircle,
  faKey,
  faSolidLock,
  faBold,
  faItalic,
  faStrikethrough,
  faParagraph,
  faUnderline,
  faListOl,
  faListUl,
  faCode,
  faQuoteLeft,
  faUndo,
  faRedo,
  faSolidLink,
  // faPencil,
  faSquare,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faFileImage,
  faSpinner
);

// import { far } from "@fortawesome/pro-regular-svg-icons";

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = false;

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.

// library.add(fal);
// library.add(far);

// import { faCoffee } from '@fortawesome/free-solid-svg-icons/faCoffee'
// import { faSpinner } from '@fortawesome/pro-light-svg-icons/faSpinner'
import Icon from "~/components/common/icon/index.vue";

// dom.watch();
// // Register the component globally
export const install: UserModule = ({ app }) => {
  app.component("Fa", Icon);
};
