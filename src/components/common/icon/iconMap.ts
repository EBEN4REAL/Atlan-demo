import { defineAsyncComponent } from 'vue'

// source list
import Snowflake from '~/assets/images/source/svg/Snowflake.svg'
import Tableau from '~/assets/images/source/svg/Tableau.svg'
import Redshift from '~/assets/images/source/svg/Redshift.svg'
import Postgres from '~/assets/images/source/svg/postgres.svg'
import Athena from '~/assets/images/source/svg/Athena.svg'
import Databricks from '~/assets/images/source/svg/Databricks.svg'
import PowerBI from '~/assets/images/source/svg/PowerBI.svg'
import BigQuery from '~/assets/images/source/svg/Bigquery.svg'
import Looker from '~/assets/images/source/svg/Looker.svg'
import Salesforce from '~/assets/images/source/svg/Salesforce.svg'
import MySQL from '~/assets/images/source/svg/MySQL.svg'
import Glue from '~/assets/images/source/svg/glue.svg'
import Netsuite from '~/assets/images/source/svg/netsuite.svg'
import S3 from '~/assets/images/source/svg/s3.svg'
import GDS from '~/assets/images/source/svg/gds.svg'
//

import Legend from '~/assets/images/lineage/legend.svg'
import LegendProcess from '~/assets/images/lineage/legendProcess.svg'
import LegendProcessDefault from '~/assets/images/lineage/legendProcessDefault.svg'
import LegendProcessHighlighted from '~/assets/images/lineage/legendProcessHighlighted.svg'
import LegendProcessAnomaly from '~/assets/images/lineage/legendProcessAnomaly.svg'
import LegendCalculatedField from '~/assets/images/lineage/legendCalculatedField.svg'
import LegendField from '~/assets/images/lineage/legendField.svg'
import LegendMeasures from '~/assets/images/lineage/legendMeasures.svg'
import LegendDimension from '~/assets/images/lineage/legendDimension.svg'
import LegendDimensionGroups from '~/assets/images/lineage/legendDimensionGroups.svg'
import AssociatedTerm from '~/assets/images/icons/associated-term-blue.svg'

import LegendExpand from '~/assets/images/lineage/legendExpand.svg'
import LegendCollapse from '~/assets/images/lineage/legendCollapse.svg'
import LegendAnomaly from '~/assets/images/lineage/legendAnomaly.svg'
import LegendSelected from '~/assets/images/lineage/legendSelected.svg'
import LegendHighlighted from '~/assets/images/lineage/legendHighlighted.svg'
import Time from '~/assets/images/icons/time.svg'
import BookmarkFilled from '~/assets/images/icons/bookmark-filled.svg'
import Bookmark from '~/assets/images/icons/bookmark.svg'
import BookmarkOutlined from '~/assets/images/icons/bookmark-outline.svg'
import CopyOutlined from '~/assets/images/icons/copy.svg'
import ChevronDown from '~/assets/images/icons/chevron-down.svg'
import ChevronLeft from '~/assets/images/icons/chevron-left.svg'
import ChevronUp from '~/assets/images/icons/chevron-up.svg'
import Retry from '~/assets/images/icons/retry.svg'
import NoAccess from '~/assets/images/icons/no-access.svg'
import ForeignKey from '~/assets/images/icons/foreign.svg'
import partitionKey from '~/assets/images/icons/partitionKey.svg'
import AssetIcon from '~/assets/images/home/asset.svg'
import InsightsIcon from '~/assets/images/home/Insights.svg'
import MorningIcon from '~/assets/images/home/Morning.svg'
import EveningIcon from '~/assets/images/home/Evening.svg'
import AfternoonIcon from '~/assets/images/home/Afternoon.svg'
import WorkflowsIcon from '~/assets/images/home/Workflows.svg'
import AdminCenterIcon from '~/assets/images/home/AdminCenter.svg'
import AtlanIcon from '~/assets/images/home/help/atlan.svg'
import AtlanBot from '~/assets/images/icons/atlan-bot.svg'
import CallIcon from '~/assets/images/home/help/call.svg'
import FeedbackIcon from '~/assets/images/home/help/feedback.svg'
import GlossaryIcon from '~/assets/images/home/Glossary.svg'
import Lock from '~/assets/images/icons/lock.svg'
import Lock2 from '~/assets/images/icons/lock2.svg'
import NoRelevantAsset from '~/assets/images/icons/no-relevant-assets.svg'
import NoAssetOrganization from '~/assets/images/icons/no-assets-organization.svg'

import Share from '~/assets/images/icons/share.svg'
import Filter from '~/assets/images/icons/filter.svg'
import FilterDot from '~/assets/images/icons/filter-dot.svg'
import ArrowRight from '~/assets/images/icons/arrow-right.svg'
import ArrowUpDown from '~/assets/images/icons/arrow_up_down.svg'
import Cancel from '~/assets/images/icons/cancel.svg'
import Notification from '~/assets/images/icons/notification.svg'
import NotificationDot from '~/assets/images/icons/notification-dot.svg'
import Search from '~/assets/images/icons/search.svg'

import Hash from '~/assets/images/icons/hash.svg'
import ArrowDown from '~/assets/images/icons/arrow-down.svg'
import Expand from '~/assets/images/icons/expand.svg'
import Variant from '~/assets/images/dataType/variant.svg'
import Database from '~/assets/images/icons/database.svg'
import DatabaseVerified from '~/assets/images/icons/database_verified.svg'
import DatabaseDeprecated from '~/assets/images/icons/database_deprecated.svg'
import DatabaseDraft from '~/assets/images/icons/database_draft.svg'
import DatabaseGray from '~/assets/images/icons/database-gray.svg'
import Schema from '~/assets/images/icons/schema.svg'
import SchemaVerified from '~/assets/images/icons/schema_verified.svg'
import SchemaDeprecated from '~/assets/images/icons/schema_deprecated.svg'
import SchemaDraft from '~/assets/images/icons/schema_draft.svg'
import SchemaGray from '~/assets/images/icons/schema-gray.svg'
import Table from '~/assets/images/icons/table.svg'
import TableGray from '~/assets/images/icons/table-gray.svg'
import TableBlack from '~/assets/images/icons/table-black.svg'
import View from '~/assets/images/icons/view.svg'
import ViewDeprecated from '~/assets/images/icons/view_deprecated.svg'
import ViewDraft from '~/assets/images/icons/view_draft.svg'
import ViewVerified from '~/assets/images/icons/view_verified.svg'
import ViewGray from '~/assets/images/icons/view-gray.svg'
import Connection from '~/assets/images/icons/connection.svg'
import Process from '~/assets/images/icons/process.svg'
import ChevronRight from '~/assets/images/icons/chevron-right.svg'
import Union from '~/assets/images/icons/union.svg'
import AddUser from '~/assets/images/icons/add-user.svg'
import RemoveUser from '~/assets/images/icons/remove-user.svg'
import Link from '~/assets/images/icons/link.svg'
import Add from '~/assets/images/icons/add.svg'
import CircleLoader from '~/assets/images/icons/circle-loader.svg'
import Term from '~/assets/images/icons/term.svg'
import TermDeprecated from '~/assets/images/icons/term-deprecated.svg'
import TermIssue from '~/assets/images/icons/term-issue.svg'
import TermVerified from '~/assets/images/icons/term-verified.svg'
import TermDraft from '~/assets/images/icons/term-wip.svg'
import Category from '~/assets/images/icons/category.svg'
import CategoryShaded from '~/assets/images/icons/category-shaded.svg'
import CategoryDeprecated from '~/assets/images/icons/category-deprecated.svg'
import CategoryIssue from '~/assets/images/icons/category-issue.svg'
import CategoryVerified from '~/assets/images/icons/category-verified.svg'
import CategoryDraft from '~/assets/images/icons/category-wip.svg'
import Shield from '~/assets/images/icons/shield.svg'
import ShieldFilled from '~/assets/images/icons/shield-filled.svg'
import Edit from '~/assets/images/icons/edit.svg'
import EmptySavedFilter from '~/assets/images/icons/empty_saved_filters.svg'
import Decline from '~/assets/images/icons/decline.svg'
import Approve from '~/assets/images/icons/approve.svg'
import EmptyGlossary from '~/assets/images/icons/empty-glossary.svg'
import Glossary from '~/assets/images/icons/glossary.svg'
import GlossaryInactive from '~/assets/images/icons/glossary_inactive.svg'
import GlossaryDeprecated from '~/assets/images/icons/glossary-deprecated.svg'
import GlossaryVerified from '~/assets/images/icons/glossary-verified.svg'
import GlossaryDraft from '~/assets/images/icons/glossary-wip.svg'
import GlossaryGray from '~/assets/images/icons/glossary-gray.svg'
import KebabMenu from '~/assets/images/icons/kebab-menu-new.svg'
import KebabMenuHorizontal from '~/assets/images/icons/kebab-menu.svg'
import Overview from '~/assets/images/icons/overview.svg'
import OverviewActive from '~/assets/images/icons/overview_active.svg'
import Lineage from '~/assets/images/icons/lineage.svg'
import LineageNew from '~/assets/images/icons/lineage-new.svg'
import LineageSmall from '~/assets/images/icons/lineage-small.svg'
import Activity from '~/assets/images/icons/activity.svg'
import Columns from '~/assets/images/icons/columns.svg'
import Relation from '~/assets/images/icons/relation.svg'
import RelationActive from '~/assets/images/icons/relations-active.svg'
import S3Object from '~/assets/images/icons/s3object.svg'
import S3Bucket from '~/assets/images/icons/s3bucket.svg'
import User from '~/assets/images/icons/user.svg'
import Chats from '~/assets/images/icons/chats.svg'
import OpenTermProfile from '~/assets/images/icons/openTermProfile.svg'
import OpenCategoryProfile from '~/assets/images/icons/open-category-profile.svg'
import Metadata from '~/assets/images/icons/metadata.svg'
import Group from '~/assets/images/icons/group.svg'
import GroupStatic from '~/assets/images/icons/group-static.svg'
import External from '~/assets/images/icons/external.svg'
import NewFolder from '~/assets/images/icons/new-folder.svg'
import NewQuery from '~/assets/images/icons/new-query.svg'
import PublicFolder from '~/assets/images/icons/public-folder.svg'
import PrivateFolder from '~/assets/images/icons/private-folder.svg'
import TreeCollapseAll from '~/assets/images/icons/tree-collapse-all.svg'
import FilterFunnel from '~/assets/images/icons/filterFunnel.svg'
import FolderOpen from '~/assets/images/icons/folder-open.svg'
import FolderClosed from '~/assets/images/icons/folder-closed.svg'
import Schema2 from '~/assets/images/icons/schema2.svg'
import History from '~/assets/images/icons/history.svg'
import Queries from '~/assets/images/icons/queries.svg'
import Play from '~/assets/images/icons/play.svg'
import Pin from '~/assets/images/icons/pin.svg'
import Save from '~/assets/images/icons/save.svg'
import Globe from '~/assets/images/icons/globe.svg'
import Info from '~/assets/images/icons/info.svg'
import AddAssetName from '~/assets/images/icons/add-table.svg'
import Trash from '~/assets/images/icons/trash.svg'
import Widgets from '~/assets/images/icons/widgets.svg'
import Megaphone from '~/assets/images/icons/megaphone.svg'
import Readme from '~/assets/images/icons/readme.svg'
import Resources from '~/assets/images/icons/resources.svg'
import FAQS from '~/assets/images/icons/faqs.svg'
import TableSummary from '~/assets/images/icons/tableSummary.svg'
import VariableTrigger from '~/assets/images/icons/variable-trigger.svg'
import Home from '~/assets/images/icons/home.svg'
import MultipleStatus from '~/assets/images/icons/multiple-status.svg'
import Pencil from '~/assets/images/icons/pencil.svg'
import Check from '~/assets/images/icons/check.svg'
import CheckCircled from '~/assets/images/icons/check-circled.svg'
import Dots from '~/assets/images/icons/dots.svg'
import Sort from '~/assets/images/icons/sort.svg'
import BuilderGroup from '~/assets/images/icons/builder-group.svg'
import Cross from '~/assets/images/icons/cross.svg'
import FullScreen from '~/assets/images/icons/fullscreen.svg'
import ExitFullScreen from '~/assets/images/icons/exit-fullscreen.svg'
import SidebarTrigger from '~/assets/images/icons/sidebar-trigger.svg'
import SidebarTriggerFilled from '~/assets/images/icons/sidebar-trigger-filled.svg'
import OutputpaneTrigger from '~/assets/images/icons/output-pane-trigger.svg'
import OutputpaneTriggerFilled from '~/assets/images/icons/output-pane-trigger-filled.svg'

import RunSuccess from '~/assets/images/icons/run-success.svg'
import RunProgress from '~/assets/images/icons/run-progress.svg'
import RunFailed from '~/assets/images/icons/run-failed.svg'
import WorkflowsActive from '~/assets/images/icons/workflows_active.svg'
import WorkflowsInactive from '~/assets/images/icons/workflows_inactive.svg'
import InsightsActive from '~/assets/images/icons/insights_active.svg'
import InsightsInactive from '~/assets/images/icons/insights_inactive.svg'
import AssetsActive from '~/assets/images/icons/assets_active.svg'
import AssetsInactive from '~/assets/images/icons/assets_inactive.svg'
import RunHistory from '~/assets/images/icons/run-history.svg'
import CaretLeft from '~/assets/images/icons/caret-left.svg'
import CaretRight from '~/assets/images/icons/caret-right.svg'
import CaretDown from '~/assets/images/icons/caret-down.svg'
import Settings from '~/assets/images/icons/setings.svg'
import SettingsOutlined from '~/assets/images/icons/settings_outlined.svg'
import IssuesAnnouncement from '~/assets/images/status/issues.svg'
import InformationAnnouncement from '~/assets/images/status/information.svg'
import WarningAnnouncement from '~/assets/images/status/warning.svg'
import EmptyResource from '~/assets/images/icons/empty-resources.svg'
import EmptyResource2 from '~/assets/images/icons/empty-resource-2.svg'
import EmptyClassifications from '~/assets/images/icons/empty-classifications.svg'
import Delete from '~/assets/images/icons/delete.svg'
import NoDataInsights from '~/assets/images/icons/results.svg'
import SomethingWrong from '~/assets/images/icons/something-wrong.svg'
import NoSavedQueriesPersonal from '~/assets/images/icons/saved-queries-personal.svg'
import NoSchema from '~/assets/images/icons/no-schema.svg'
import IssuesFilled from '~/assets/images/icons/issues-filled.svg'

import NoSavedQueriesAll from '~/assets/images/icons/saved-queries-all.svg'

import Slack from '~/assets/images/admin/integrations/slack.svg'
import Jira from '~/assets/images/admin/integrations/jira.svg'
import Gift from '~/assets/images/admin/integrations/gift.svg'

import ExplorerTrigger from '~/assets/images/icons/explorer-panel-trigger-outline.svg'
import ExplorerTriggerFilled from '~/assets/images/icons/explorer-trigger-filled.svg'
import EmptySearchQuery from '~/assets/images/icons/empty_search_query.svg'
import EmptyResult from '~/assets/images/icons/empty_result.svg'
import Schedule from '~/assets/images/icons/schedule.svg'
import Unscheduled from '~/assets/images/icons/unscheduled.svg'
import Minimap from '~/assets/images/icons/minimap.svg'
import FullScreenBoth from '~/assets/images/icons/fullscreen-both.svg'
import Minus from '~/assets/images/icons/minus.svg'
import Recenter from '~/assets/images/icons/recenter.svg'
import Refocus from '~/assets/images/icons/refocus.svg'
import AssetsInactiveLight from '~/assets/images/icons/assets-inactive-light.svg'
import AssetsActiveLight from '~/assets/images/icons/assets-active-light.svg'
import Hourglass from '~/assets/images/icons/hourglass.svg'
import HourglassActive from '~/assets/images/icons/hourglass-active.svg'
import GroupActive from '~/assets/images/icons/group-light-active.svg'
import GroupLight from '~/assets/images/icons/group-light.svg'
import AccessLogs from '~/assets/images/icons/access-logs.svg'
import AccessLogsActive from '~/assets/images/icons/access-logs-active.svg'
import InfoActive from '~/assets/images/icons/info-active.svg'
import UserLight from '~/assets/images/icons/user-light.svg'
import UserLightActive from '~/assets/images/icons/user-light-active.svg'
import Support from '~/assets/images/icons/support.svg'
import Report from '~/assets/images/icons/report.svg'
import Platform from '~/assets/images/icons/platform.svg'
import Feedback from '~/assets/images/icons/feedback.svg'
import Admin from '~/assets/images/icons/admin.svg'
import ActivityLogs from '~/assets/images/icons/activity-logs.svg'
import TableDeprecated from '~/assets/images/icons/table_deprecated.svg'
import TableDraft from '~/assets/images/icons/table_draft.svg'
import TableVerified from '~/assets/images/icons/table_verified.svg'
import Policy from '~/assets/images/icons/policy.svg'
import PolicyAlt from '~/assets/images/icons/policy-alt.svg'
import Key from '~/assets/images/icons/key.svg'

import EmptyAssetProfile from '~/assets/images/icons/empty_asset_profile.svg'

import Property from '~/assets/images/icons/property.svg'
import PropertyActive from '~/assets/images/icons/property_active.svg'
import Query from '~/assets/images/icons/query.svg'
import Trigger from '~/assets/images/icons/trigger.svg'
import QueryVerified from '~/assets/images/icons/query-verified.svg'
import QueryDeprecated from '~/assets/images/icons/query-deprecated.svg'
import QueryDraft from '~/assets/images/icons/query-draft.svg'
import CollapseControl from '~/assets/images/icons/collapse-control.svg'
import ColumnGray from '~/assets/images/icons/column-gray.svg'
import MaterialisedView from '~/assets/images/icons/materialised-view.svg'
import TablePartition from '~/assets/images/icons/table-partition.svg'

// autosuggetions
import Function from '~/assets/images/insights/autocomplete/function.svg'
import Nut from '~/assets/images/insights/autocomplete/nut.svg'
import Snippet from '~/assets/images/insights/autocomplete/snippet.svg'

import NoResultsFound from '~/assets/images/icons/no-results-found.svg'
import StarCircled from '~/assets/images/icons/star-circled.svg'
import ResendInvite from '~/assets/images/icons/invite.svg'
import Flash from '~/assets/images/icons/flash.svg'
import FlashColor from '~/assets/images/icons/flash-color.svg'
import DisableUser from '~/assets/images/icons/disabled-user.svg'
import ImpactedAssets from '~/assets/images/icons/impacted-assets.svg'

import Code from '~/assets/images/readme/code.svg'
import Underline from '~/assets/images/readme/text-underline.svg'
import Bold from '~/assets/images/readme/text-bold.svg'
import Italic from '~/assets/images/readme/text-italic.svg'
import Strike from '~/assets/images/readme/text-strike.svg'
import Undo from '~/assets/images/readme/undo.svg'
import Redo from '~/assets/images/readme/redo.svg'
import ReadmeImage from '~/assets/images/readme/ImageSquare.svg'
import BulletList from '~/assets/images/readme/ListBullets.svg'
import NumberedList from '~/assets/images/readme/ListNumbers.svg'
import Quotes from '~/assets/images/readme/Quotes.svg'
import HOne from '~/assets/images/readme/TextHOne.svg'
import HTwo from '~/assets/images/readme/TextHTwo.svg'
import HThree from '~/assets/images/readme/TextHThree.svg'
import TextCenter from '~/assets/images/readme/TextAlignCenter.svg'
import TextLeft from '~/assets/images/readme/TextAlignLeft.svg'
import TextRight from '~/assets/images/readme/TextAlignRight.svg'
import JustifyText from '~/assets/images/readme/TextAlignJustify.svg'
import TaskList from '~/assets/images/readme/TaskList.svg'
import GoogleDoc from '~/assets/images/readme/googleDocs.svg'
import GoogleSheet from '~/assets/images/readme/googleSheets.svg'
import GoogleSlide from '~/assets/images/readme/googleSlides.svg'
import GoogleDrive from '~/assets/images/readme/googleDrive.svg'
import GoogleDataStudio from '~/assets/images/readme/googleDataStudio.svg'
import Confluence from '~/assets/images/readme/confluence.svg'
import Miro from '~/assets/images/readme/miro.svg'
import Figma from '~/assets/images/readme/Figma.svg'
import Lucid from '~/assets/images/readme/lucid.svg'
import Mention from '~/assets/images/readme/mention.svg'
import DBDiagram from '~/assets/images/readme/dbdiagram.svg'
import MicrosoftWord from '~/assets/images/readme/microsoftWord.svg'
import MicrosoftExcel from '~/assets/images/readme/microsoftExcel.svg'
import MicrosoftPowerpoint from '~/assets/images/readme/microsoftPowerpoint.svg'
import Equation from '~/assets/images/readme/equation.svg'

import Running from '~/assets/images/icons/running.svg'
import ExclaimCircle from '~/assets/images/icons/exclaimCircle.svg'
import Refresh from '~/assets/images/icons/Refresh.svg'
import PlusWhite from '~/assets/images/icons/plus-white.svg'

import Error from '~/assets/images/error.svg'
import Warning from '~/assets/images/warning.svg'
import WarningIcon from '~/assets/images/icons/warning.svg'

import Download from '~/assets/images/icons/download.svg'
import Upload from '~/assets/images/icons/upload2.svg'
import Enum from '~/assets/images/icons/label.svg'
import Boolean from '~/assets/images/dataType/boolean.svg'
import String from '~/assets/images/dataType/string.svg'
import MoveItem from '~/assets/images/icons/move-item.svg'
import DateTime from '~/assets/images/icons/datetime.svg'
import Number from '~/assets/images/dataType/number.svg'
import Struct from '~/assets/images/dataType/struct.svg'
import Geography from '~/assets/images/dataType/geography.svg'

import NoAvatar from '~/assets/images/icons/no-avatar.svg'
import Enter from '~/assets/images/icons/enter.svg'
import EnterProfile from '~/assets/images/icons/enter_profile.svg'
import Times from '~/assets/images/icons/times.svg'
import NoLinkedAssets from '~/assets/images/icons/no-linked-assets.svg'
import NoRequestFound from '~/assets/images/icons/no-request-found.svg'
import GlossaryGettingStarted from '~/assets/images/icons/glossary-getting-started.svg'
import BulkUpload from '~/assets/images/icons/bulk-upload.svg'
import SSO from '~/assets/images/icons/sso.svg'
import SMTP from '~/assets/images/icons/smtp.svg'
import APIKey from '~/assets/images/icons/apikey.svg'
import Camera from '~/assets/images/icons/camera.svg'
import Image from '~/assets/images/icons/image.svg'
import FormatText from '~/assets/images/icons/formatText.svg'
import BeautifySql from '~/assets/images/icons/beautifySql.svg'

import CustomSaml from '~/assets/images/icons/customSaml.svg'
import GlowFlash from '~/assets/images/icons/glow-flash.svg'
import CheckCurrentColor from '~/assets/images/icons/check-current-color.svg'
import AddColumn from '~/assets/images/icons/add-column.svg'

import ClassificationShield from '~/assets/images/classifications/shield.svg'
import ClassificationAtlan from '~/assets/images/classifications/atlan.svg'
import ClassificationPropagated from '~/assets/images/classifications/propagated.svg'

// source list
import NoWf from '~/assets/images/icons/no-wf.svg'
import Column from '~/assets/images/icons/column.svg'
import GovernanceCenter from '~/assets/images/icons/governance-center.svg'

import Schema2Active from '~/assets/images/icons/schema2Active.svg'
import QueriesActive from '~/assets/images/icons/queriesActive.svg'
import Close from '~/assets/images/icons/close.svg'

import ShieldCheck from '~/assets/images/icons/shield-check.svg'
import CustomVariable from '~/assets/images/icons/customVariable.svg'

import FolderSearch from '~/assets/images/icons/folder-search.svg'
import FolderNav24 from '~/assets/images/icons/folder_closed_24.svg'
import FolderNav24Active from '~/assets/images/icons/folder_open_24.svg'
import Verified from '~/assets/images/status/verified.svg'
import Draft from '~/assets/images/status/draft.svg'
import Deprecated from '~/assets/images/status/deprecated.svg'
import Nostatus from '~/assets/images/status/nostatus.svg'
import ShieldBlank from '~/assets/images/icons/ShieldBlank.svg'
import Compass from '~/assets/images/icons/Compass.svg'
import Policies from '~/assets/images/icons/Policies.svg'

import InnerJoin from '~/assets/images/icons/InnerJoin.svg'
import LeftJoin from '~/assets/images/icons/LeftJoin.svg'
import RightJoin from '~/assets/images/icons/RightJoin.svg'
import OuterJoin from '~/assets/images/icons/OuterJoin.svg'
import TableSwap from '~/assets/images/icons/swapTable.svg'
import JoinHeader from '~/assets/images/icons/JoinHeader.svg'
import PublicCollection from '~/assets/images/icons/publicCollection.svg'
import PrivateCollection from '~/assets/images/icons/privateCollection.svg'
import NoSelectedAsset from '~/assets/images/icons/noSelectedAsset.svg'
import QueryGrey from '~/assets/images/icons/query-grey.svg'
import QueryDiscovery from '~/assets/images/icons/query_discovery.svg'

import SetContext from '~/assets/images/icons/setContext.svg'
import CollectionIconSmall from '~/assets/images/icons/collections_16.svg'
import CollectionIconLargeActive from '~/assets/images/icons/collections_24.svg'
import CollectionIconSmallGray from '~/assets/images/icons/collections_gray_16.svg'
import CollectionIconLarge from '~/assets/images/icons/collections_gray_24.svg'
import EnumType from '~/assets/images/dataType/enum.svg'
import Float from '~/assets/images/dataType/float.svg'
import Array from '~/assets/images/dataType/array.svg'
import primaryKey from '~/assets/images/icons/primaryKey.svg'
import Revoke from '~/assets/images/icons/Revoke.svg'
import Query24 from '~/assets/images/icons/query_24.svg'
import Vqb24 from '~/assets/images/icons/vqb_24.svg'
import SidebarSwitch from '~/assets/images/icons/sidebar.svg'

import Vqb from '~/assets/images/icons/Vqb.svg'
import VqbVerified from '~/assets/images/icons/VqbVerified.svg'
import VqbDeprecated from '~/assets/images/icons/VqbDeprecated.svg'
import VqbDraft from '~/assets/images/icons/VqbDraft.svg'
import Clock from '~/assets/images/icons/clock.svg'
import ClockStart from '~/assets/images/icons/clock-start.svg'
import ClockStop from '~/assets/images/icons/clock-stop.svg'
import Mail from '~/assets/images/icons/mail.svg'
import Collapsed from '~/assets/images/icons/Collapsed.svg'

import Quotes2 from '~/assets/images/icons/Quotes.svg'
import OpenPreview from '~/assets/images/icons/open-preview.svg'
import Message from '~/assets/images/icons/message.svg'
import MessageSuccess from '~/assets/images/icons/MessageSuccess.svg'
import CrossCircle from '~/assets/images/icons/CrossCircle.svg'
import MessageCross from '~/assets/images/icons/MessageCross.svg'
import Atlan from '~/assets/images/icons/atlan.svg'
import Gear from '~/assets/images/icons/gear.svg'
import SafariLock from '~/assets/images/icons/safari-lock.svg'

import Integrations from '~/assets/images/icons/integrations.svg'
import IntegrationsActive from '~/assets/images/icons/integrations-active.svg'
import QueryTime from '~/assets/images/icons/query_time.svg'
import ThreeDots from '~/assets/images/icons/ThreeDots.svg'
import Request from '~/assets/images/icons/Request.svg'
import RequestActive from '~/assets/images/icons/RequestActive.svg'
import FilterFunnelDot from '~/assets/images/icons/filterFunnelDot.svg'
import Comment from '~/assets/images/icons/Comment.svg'

import RunningQuery from '~/assets/images/icons/tabs/Running.svg'
import FailedQuery from '~/assets/images/icons/tabs/Error.svg'

import SuccessQuery from '~/assets/images/icons/tabs/success-check.svg'
import QuestionRound from '~/assets/images/icons/question-round.svg'
import QuestionRoundSmall from '~/assets/images/icons/question-round-small.svg'
import Documentation from '~/assets/images/icons/documentation.svg'
import Logout from '~/assets/images/icons/logout.svg'
import TrendUp from '~/assets/images/icons/trendUp.svg'
import NoAllow from '~/assets/images/icons/no-allow.svg'

import ThreeDotsAlt from '~/assets/images/icons/3-dots-alt.svg'
import TrashAlt from '~/assets/images/icons/Trash-alt.svg'
import Schedule24 from '~/assets/images/icons/schedule-24.svg'

import Chat from '~/assets/images/icons/chat.svg'
import NotificationNoDot from '~/assets/images/icons/notification-no-dot.svg'
import Workflow from '~/assets/images/icons/workflows.svg'
import Package from '~/assets/images/icons/package.svg'

import Display from '~/assets/images/icons/display.svg'
import FullScreenSquare from '~/assets/images/icons/full_screen_sqaure.svg'
import QueryOutputSuccess from '~/assets/images/icons/query_output_success.svg'
import QueryMetadata from '~/assets/images/icons/query_metadata.svg'
import QueryOutputFail from '~/assets/images/icons/query_output_fail.svg'
import QueryOutputNeutral from '~/assets/images/icons/query_output_neutral.svg'
import PreviewQuery from '~/assets/images/icons/preview.svg'
import Trident from '~/assets/images/icons/trident.svg'
import EmptyUploads from '~/assets/images/icons/empty-uploads.svg'

import CSVLogo from '~/assets/images/icons/csv-logo.svg'
import PaperClip from '~/assets/images/icons/paper-clip.svg'
import FlaskIcon from '~/assets/images/icons/flask.svg'

import Disable from '~/assets/images/icons/disable.svg'
import CheckFailed from '~/assets/images/icons/check-failed.svg'
import CheckProgress from '~/assets/images/icons/check-in-progress.svg'
import CheckPending from '~/assets/images/icons/check-pending.svg'

// Illustrations - keeping them Async
const NoAssetsFound = defineAsyncComponent(
    () => import('~/assets/images/illustrations/no_assets_to_show.svg')
)
const InteractiveVariableIllustration = defineAsyncComponent(
    () =>
        import(
            '~/assets/images/illustrations/illustration-interactive-param.svg'
        )
)
const EmptyRequest = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty-request.svg')
)
const IllustrationPersonaDemo = defineAsyncComponent(
    () => import('~/assets/images/illustrations/illustration-persona-demo.svg')
)
const IllustrationPurposeDemo = defineAsyncComponent(
    () => import('~/assets/images/illustrations/illustration-purpose-demo.svg')
)
const InnerJoinInfo = defineAsyncComponent(
    () => import('~/assets/images/illustrations/InnerJoinInfo.svg')
)
const LeftJoinInfo = defineAsyncComponent(
    () => import('~/assets/images/illustrations/LeftJoinInfo.svg')
)
const RightJoinInfo = defineAsyncComponent(
    () => import('~/assets/images/illustrations/RightJoinInfo.svg')
)
const OuterJoinInfo = defineAsyncComponent(
    () => import('~/assets/images/illustrations/OuterJoinInfo.svg')
)

const LockedFile = defineAsyncComponent(
    () => import('~/assets/images/illustrations/lockedFile.svg')
)
const Resources2 = defineAsyncComponent(
    () => import('~/assets/images/illustrations/resources/resources.svg')
)
const SlackTabEmpty = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_slack_tab.svg')
)
const EmptyLineage = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_lineage.svg')
)
const EmptyLineageTab = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_lineage_tab.svg')
)
const NoUsers = defineAsyncComponent(
    () => import('~/assets/images/illustrations/no-users.svg')
)
const NoGroups = defineAsyncComponent(
    () => import('~/assets/images/illustrations/no-groups.svg')
)
const CreateGroups = defineAsyncComponent(
    () => import('~/assets/images/illustrations/create-groups.svg')
)
const EmptyCollections = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty-collections.svg')
)
const NoResultIllustration = defineAsyncComponent(
    () =>
        import(
            '~/assets/images/illustrations/Illustration_no_search_results.svg'
        )
)
const NoSearchResultsQuery = defineAsyncComponent(
    () =>
        import(
            '~/assets/images/illustrations/Illustration_no_search_results_query.svg'
        )
)
const EmptyCM = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty-custom-metadata.svg')
)
const EmptySampleData = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_sample_data.svg')
)
const ErrorSampleData = defineAsyncComponent(
    () => import('~/assets/images/illustrations/error_sample_data.svg')
)
const EmptyQueriesTab = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_queries_tab.svg')
)
const EmptyDiscover = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_discover.svg')
)

// Error States
const queryErorrIllus = defineAsyncComponent(
    () => import('~/assets/images/icons/queryError.svg')
)
const ErrorLogs = defineAsyncComponent(
    () => import('~/assets/images/workflows/error-logs-state.svg')
)
const CommonError1 = defineAsyncComponent(
    () => import('~/assets/images/icons/common-error-1.svg')
)
const CommonError2 = defineAsyncComponent(
    () => import('~/assets/images/icons/common-error-2.svg')
)
const CommonError3 = defineAsyncComponent(
    () => import('~/assets/images/icons/common-error-3.svg')
)
const CommonError4 = defineAsyncComponent(
    () => import('~/assets/images/icons/common-error-4.svg')
)
const CollectionHeader = defineAsyncComponent(
    () => import('~/assets/images/insights/collection/header.svg')
)
const CollectionBody = defineAsyncComponent(
    () => import('~/assets/images/insights/collection/body.svg')
)
const CollectionFooter = defineAsyncComponent(
    () => import('~/assets/images/insights/collection/footer.svg')
)
const EmptyResultJira = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/emptyResultJira.svg')
)
const EmptyJira = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/emptyJira.svg')
)
const Teams = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/teams.svg')
)
const Gdoc = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/gDoc.svg')
)
const SlackToken = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/slackToken.svg')
)
const SlackAddApp = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/SlackAddApp.svg')
)
const NoProperty = defineAsyncComponent(
    () => import('~/assets/images/admin/customMetadata/empty-property.svg')
)
const AddQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/add-query.svg')
)
const WFEmptyTab = defineAsyncComponent(
    () => import('~/assets/images/workflows/empty-tab.svg')
)
const CreateWF = defineAsyncComponent(
    () => import('~/assets/images/workflows/createWF.svg')
)
const NoRuns = defineAsyncComponent(
    () => import('~/assets/images/workflows/noRuns.svg')
)
const EmptyLogs = defineAsyncComponent(
    () => import('~/assets/images/workflows/empty-logs-state.svg')
)

export default {
    Function,
    Nut,
    Snippet,
    Gift,
    NoSearchResultsQuery,
    SlackTabEmpty,
    PreviewQuery,
    QueryOutputFail,
    QueryOutputNeutral,
    QueryMetadata,
    QueryOutputSuccess,
    FullScreenSquare,
    Legend,
    LegendExpand,
    LegendCollapse,
    LegendAnomaly,
    LegendSelected,
    LegendHighlighted,
    LegendProcess,
    LegendProcessDefault,
    LegendProcessHighlighted,
    LegendProcessAnomaly,
    LegendCalculatedField,
    LegendField,
    LegendMeasures,
    LegendDimension,
    LegendDimensionGroups,
    Schedule24,
    Mail,
    Collapsed,
    EmptyJira,
    TrashAlt,
    NoProperty,
    ThreeDotsAlt,
    Resources2,
    RunningQuery,
    FailedQuery,
    Chat,
    NotificationNoDot,
    SuccessQuery,
    IntegrationsActive,
    Integrations,
    Jira,
    SlackToken,
    SlackAddApp,
    SafariLock,
    Gear,
    Atlan,
    GlowFlash,
    Query24,
    Vqb24,
    partitionKey,
    primaryKey,
    Array,
    Float,
    EnumType,
    EmptyCM,
    PolicyAlt,
    FlashColor,
    BuilderGroup,
    Trigger,
    LeftJoin,
    RightJoin,
    InnerJoin,
    TableSwap,
    JoinHeader,
    Sort,
    Union,
    ShieldCheck,
    Hash,
    Column,
    RelationActive,
    S3Object,
    S3Bucket,
    CreateGroups,
    NoGroups,
    NoUsers,
    Times,
    ExclaimCircle,
    Expand,
    RemoveUser,
    NoRuns,
    CreateWF,
    Warning,
    Error,
    Variant,
    WFEmptyTab,
    QueryVerified,
    QueryDeprecated,
    QueryDiscovery,
    QueryDraft,
    CollapseControl,
    NoAssetsFound,
    ChevronLeft,
    CheckCircled,
    DisableUser,
    ResendInvite,
    StarCircled,
    EmptyLineage,
    EmptyLineageTab,
    EmptyResource,
    EmptyResource2,
    IssuesFilled,
    ExplorerTrigger,
    MaterialisedView,
    TablePartition,
    queryErorrIllus,
    NoSavedQueriesAll,
    NoSchema,
    NoDataInsights,
    SomethingWrong,
    NoSavedQueriesPersonal,
    EmptyQueriesTab,
    EmptyCollections,
    AddQuery,
    RunHistory,
    RunSuccess,
    RunProgress,
    RunFailed,
    Metadata,
    ColumnGray,
    Relation,
    MorningIcon,
    AfternoonIcon,
    EmptySampleData,
    ErrorSampleData,
    Resources,
    FAQS,
    TableSummary,
    EveningIcon,
    Overview,
    Pin,
    Lineage,
    LineageNew,
    LineageSmall,
    Activity,
    Columns,
    BookmarkFilled,
    CopyOutlined,
    EmptySavedFilter,
    Bookmark,
    IssuesAnnouncement,
    InformationAnnouncement,
    WarningAnnouncement,
    BookmarkOutlined,
    ChevronDown,
    ChevronUp,
    AtlanIcon,
    CallIcon,
    EmptyResultJira,
    FeedbackIcon,
    AdminCenterIcon,
    InsightsIcon,
    WorkflowsIcon,
    GlossaryIcon,
    ForeignKey,
    Share,
    NoAccess,
    Cancel,
    Filter,
    Retry,
    FilterDot,
    ArrowRight,
    ArrowUpDown,
    Search,
    Database,
    Schema,
    Table,
    TableGray,
    TableBlack,
    View,
    ViewGray,
    Notification,
    NotificationDot,
    ArrowDown,
    Connection,
    Process,
    ChevronRight,
    NoRelevantAsset,
    NoAssetOrganization,
    AddUser,
    Link,
    AssetIcon,
    Add,
    CircleLoader,
    Term,
    TermDeprecated,
    TermIssue,
    TermVerified,
    TermDraft,
    Category,
    CategoryShaded,
    CategoryDeprecated,
    CategoryIssue,
    CategoryVerified,
    CategoryDraft,
    Shield,
    Edit,
    Approve,
    Decline,
    Lock,
    Lock2,
    EmptyGlossary,
    Glossary,
    GlossaryInactive,
    KebabMenu,
    KebabMenuHorizontal,
    User,
    Chats,
    OpenTermProfile,
    Group,
    GroupStatic,
    External,
    NewFolder,
    NewQuery,
    PublicFolder,
    PrivateFolder,
    TreeCollapseAll,
    FilterFunnel,
    FolderOpen,
    FolderClosed,
    Schema2,
    History,
    Queries,
    Play,
    Save,
    Globe,
    Info,
    AddAssetName,
    VariableTrigger,
    OpenCategoryProfile,
    Trash,
    Widgets,
    Megaphone,
    Readme,
    Home,
    GlossaryDeprecated,
    GlossaryVerified,
    GlossaryDraft,
    MultipleStatus,
    Pencil,
    CaretRight,
    Check,
    Dots,
    Cross,
    SidebarTrigger,
    OutputpaneTrigger,
    FullScreen,
    ExitFullScreen,
    WorkflowsActive,
    WorkflowsInactive,
    InsightsActive,
    InsightsInactive,
    AssetsActive,
    AssetsInactive,
    CaretLeft,
    Settings,
    SettingsOutlined,
    Delete,
    Slack,
    EmptySearchQuery,
    EmptyResult,
    Flash,
    Schedule,
    Unscheduled,
    Minimap,
    FullScreenBoth,
    Minus,
    Recenter,
    Refocus,
    AssetsInactiveLight,
    AssetsActiveLight,
    Hourglass,
    HourglassActive,
    GroupActive,
    GroupLight,
    AccessLogs,
    AccessLogsActive,
    InfoActive,
    UserLight,
    UserLightActive,
    Support,
    Report,
    Platform,
    Feedback,
    Admin,
    ActivityLogs,
    TableDeprecated,
    TableDraft,
    TableVerified,
    Policy,
    Key,
    EmptyDiscover,
    EmptyAssetProfile,
    Property,
    PropertyActive,
    OverviewActive,
    Query,
    ShieldFilled,
    DatabaseGray,
    SchemaGray,
    NoResultsFound,
    ImpactedAssets,
    Code,
    Underline,
    Bold,
    Italic,
    Strike,
    Undo,
    Redo,
    ReadmeImage,
    BulletList,
    NumberedList,
    Quotes,
    HOne,
    HTwo,
    HThree,
    TextCenter,
    TextLeft,
    TextRight,
    JustifyText,
    GoogleDoc,
    GoogleSheet,
    GoogleSlide,
    GoogleDrive,
    GoogleDataStudio,
    Confluence,
    Figma,
    Lucid,
    Mention,
    Miro,
    DBDiagram,
    MicrosoftWord,
    MicrosoftExcel,
    MicrosoftPowerpoint,
    Equation,
    Running,
    Refresh,
    ErrorLogs,
    EmptyLogs,
    Download,
    Upload,
    Enum,
    Boolean,
    String,
    MoveItem,
    DateTime,
    Number,
    NoAvatar,
    Enter,
    EnterProfile,
    NoRequestFound,
    NoLinkedAssets,
    FormatText,
    Snowflake,
    Athena,
    PowerBI,
    Tableau,
    Postgres,
    Redshift,
    BigQuery,
    Looker,
    Salesforce,
    S3,
    GDS,
    SSO,
    SMTP,
    APIKey,
    Camera,
    Image,
    CustomSaml,
    Struct,
    Geography,
    NoWf,
    Schema2Active,
    QueriesActive,
    CaretDown,
    GovernanceCenter,
    Close,
    CheckCurrentColor,
    DatabaseVerified,
    DatabaseDeprecated,
    DatabaseDraft,

    SchemaVerified,
    SchemaDeprecated,
    SchemaDraft,
    ViewDeprecated,
    ViewDraft,
    ViewVerified,
    Gdoc,
    CustomVariable,
    AtlanBot,
    EmptyClassifications,
    FolderSearch,
    FolderNav24,
    FolderNav24Active,
    BulkUpload,
    GlossaryGettingStarted,
    Verified,
    ShieldBlank,
    Compass,
    Teams,
    Policies,
    PublicCollection,
    PrivateCollection,
    NoSelectedAsset,
    QueryGrey,
    NoResultIllustration,
    SetContext,
    CollectionHeader,
    CollectionBody,
    CollectionFooter,
    CollectionIconSmall,
    CollectionIconLarge,
    CollectionIconSmallGray,
    CollectionIconLargeActive,
    InteractiveVariableIllustration,
    Revoke,
    WarningIcon,
    SidebarSwitch,
    Vqb,
    VqbVerified,
    VqbDeprecated,
    VqbDraft,
    Clock,
    ClockStart,
    ClockStop,
    ClassificationShield,
    ClassificationAtlan,
    ClassificationPropagated,
    OuterJoin,
    InnerJoinInfo,
    LeftJoinInfo,
    RightJoinInfo,
    OuterJoinInfo,
    TaskList,
    LockedFile,
    Databricks,
    Quotes2,
    OpenPreview,
    Message,
    MessageSuccess,
    CrossCircle,
    Time,
    MessageCross,
    AddColumn,
    QueryTime,
    ThreeDots,
    Request,
    RequestActive,
    GlossaryGray,
    FilterFunnelDot,
    Comment,
    EmptyRequest,
    PlusWhite,
    QuestionRound,
    QuestionRoundSmall,
    Documentation,
    Logout,
    ExplorerTriggerFilled,
    OutputpaneTriggerFilled,
    SidebarTriggerFilled,
    BeautifySql,
    TrendUp,
    Draft,
    Deprecated,
    Nostatus,
    MySQL,
    Mysql: MySQL,
    NoAllow,
    Glue,
    Netsuite,
    Bigquery: BigQuery,
    Workflow,
    Package,
    Display,
    Trident,
    EmptyUploads,
    CommonError1,
    CommonError2,
    CommonError3,
    CommonError4,
    CSVLogo,
    PaperClip,
    IllustrationPersonaDemo,
    IllustrationPurposeDemo,
    FlaskIcon,
    AssociatedTerm,
    Disable,
    CheckFailed,
    CheckProgress,
    CheckPending,
}
