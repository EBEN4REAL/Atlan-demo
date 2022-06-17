import { defineAsyncComponent } from 'vue'

const LegendExpand = defineAsyncComponent(
    () => import('~/assets/images/lineage/legendExpand.svg')
)
const LegendCollapse = defineAsyncComponent(
    () => import('~/assets/images/lineage/legendCollapse.svg')
)
const LegendAnomaly = defineAsyncComponent(
    () => import('~/assets/images/lineage/legendAnomaly.svg')
)
const LegendSelected = defineAsyncComponent(
    () => import('~/assets/images/lineage/legendSelected.svg')
)
const LegendHighlighted = defineAsyncComponent(
    () => import('~/assets/images/lineage/legendHighlighted.svg')
)
const Time = defineAsyncComponent(
    () => import('~/assets/images/icons/time.svg')
)
const BookmarkFilled = defineAsyncComponent(
    () => import('~/assets/images/icons/bookmark-filled.svg')
)
const Bookmark = defineAsyncComponent(
    () => import('~/assets/images/icons/bookmark.svg')
)
const BookmarkOutlined = defineAsyncComponent(
    () => import('~/assets/images/icons/bookmark-outline.svg')
)
const CopyOutlined = defineAsyncComponent(
    () => import('~/assets/images/icons/copy.svg')
)
const ChevronDown = defineAsyncComponent(
    () => import('~/assets/images/icons/chevron-down.svg')
)
const ChevronLeft = defineAsyncComponent(
    () => import('~/assets/images/icons/chevron-left.svg')
)
const ChevronUp = defineAsyncComponent(
    () => import('~/assets/images/icons/chevron-up.svg')
)
const Retry = defineAsyncComponent(
    () => import('~/assets/images/icons/retry.svg')
)
const NoAccess = defineAsyncComponent(
    () => import('~/assets/images/icons/no-access.svg')
)
const ForeignKey = defineAsyncComponent(
    () => import('~/assets/images/icons/foreign.svg')
)
const partitionKey = defineAsyncComponent(
    () => import('~/assets/images/icons/partitionKey.svg')
)
const AssetIcon = defineAsyncComponent(
    () => import('~/assets/images/home/asset.svg')
)
const InsightsIcon = defineAsyncComponent(
    () => import('~/assets/images/home/Insights.svg')
)
const MorningIcon = defineAsyncComponent(
    () => import('~/assets/images/home/Morning.svg')
)
const EveningIcon = defineAsyncComponent(
    () => import('~/assets/images/home/Evening.svg')
)
const AfternoonIcon = defineAsyncComponent(
    () => import('~/assets/images/home/Afternoon.svg')
)
const WorkflowsIcon = defineAsyncComponent(
    () => import('~/assets/images/home/Workflows.svg')
)
const AdminCenterIcon = defineAsyncComponent(
    () => import('~/assets/images/home/AdminCenter.svg')
)
const AtlanIcon = defineAsyncComponent(
    () => import('~/assets/images/home/help/atlan.svg')
)
const AtlanBot = defineAsyncComponent(
    () => import('~/assets/images/icons/atlan-bot.svg')
)
const CallIcon = defineAsyncComponent(
    () => import('~/assets/images/home/help/call.svg')
)
const FeedbackIcon = defineAsyncComponent(
    () => import('~/assets/images/home/help/feedback.svg')
)
const GlossaryIcon = defineAsyncComponent(
    () => import('~/assets/images/home/Glossary.svg')
)
const Lock = defineAsyncComponent(
    () => import('~/assets/images/icons/lock.svg')
)
const Lock2 = defineAsyncComponent(
    () => import('~/assets/images/icons/lock2.svg')
)
const NoRelevantAsset = defineAsyncComponent(
    () => import('~/assets/images/icons/no-relevant-assets.svg')
)
const NoAssetOrganization = defineAsyncComponent(
    () => import('~/assets/images/icons/no-assets-organization.svg')
)
const NoAssetsFound = defineAsyncComponent(
    () => import('~/assets/images/illustrations/no_assets_to_show.svg')
)
const Share = defineAsyncComponent(
    () => import('~/assets/images/icons/share.svg')
)
const Filter = defineAsyncComponent(
    () => import('~/assets/images/icons/filter.svg')
)
const FilterDot = defineAsyncComponent(
    () => import('~/assets/images/icons/filter-dot.svg')
)
const ArrowRight = defineAsyncComponent(
    () => import('~/assets/images/icons/arrow-right.svg')
)
const ArrowUpDown = defineAsyncComponent(
    () => import('~/assets/images/icons/arrow_up_down.svg')
)
const Cancel = defineAsyncComponent(
    () => import('~/assets/images/icons/cancel.svg')
)
const Notification = defineAsyncComponent(
    () => import('~/assets/images/icons/notification.svg')
)
const NotificationDot = defineAsyncComponent(
    () => import('~/assets/images/icons/notification-dot.svg')
)
const Search = defineAsyncComponent(
    () => import('~/assets/images/icons/search.svg')
)
const EmptySampleData = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_sample_data.svg')
)
const ErrorSampleData = defineAsyncComponent(
    () => import('~/assets/images/illustrations/error_sample_data.svg')
)
const Hash = defineAsyncComponent(
    () => import('~/assets/images/icons/hash.svg')
)
const ArrowDown = defineAsyncComponent(
    () => import('~/assets/images/icons/arrow-down.svg')
)
const Expand = defineAsyncComponent(
    () => import('~/assets/images/icons/expand.svg')
)
const Variant = defineAsyncComponent(
    () => import('~/assets/images/dataType/variant.svg')
)
const Database = defineAsyncComponent(
    () => import('~/assets/images/icons/database.svg')
)
const DatabaseVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/database_verified.svg')
)
const DatabaseDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/database_deprecated.svg')
)
const DatabaseDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/database_draft.svg')
)
const DatabaseGray = defineAsyncComponent(
    () => import('~/assets/images/icons/database-gray.svg')
)
const Schema = defineAsyncComponent(
    () => import('~/assets/images/icons/schema.svg')
)
const SchemaVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/schema_verified.svg')
)
const SchemaDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/schema_deprecated.svg')
)
const SchemaDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/schema_draft.svg')
)
const SchemaGray = defineAsyncComponent(
    () => import('~/assets/images/icons/schema-gray.svg')
)
const Table = defineAsyncComponent(
    () => import('~/assets/images/icons/table.svg')
)
const TableGray = defineAsyncComponent(
    () => import('~/assets/images/icons/table-gray.svg')
)
const TableBlack = defineAsyncComponent(
    () => import('~/assets/images/icons/table-black.svg')
)
const View = defineAsyncComponent(
    () => import('~/assets/images/icons/view.svg')
)
const ViewDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/view_deprecated.svg')
)
const ViewDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/view_draft.svg')
)
const ViewVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/view_verified.svg')
)
const ViewGray = defineAsyncComponent(
    () => import('~/assets/images/icons/view-gray.svg')
)
const Connection = defineAsyncComponent(
    () => import('~/assets/images/icons/connection.svg')
)
const Process = defineAsyncComponent(
    () => import('~/assets/images/icons/process.svg')
)
const ChevronRight = defineAsyncComponent(
    () => import('~/assets/images/icons/chevron-right.svg')
)
const Union = defineAsyncComponent(
    () => import('~/assets/images/icons/union.svg')
)
const AddUser = defineAsyncComponent(
    () => import('~/assets/images/icons/add-user.svg')
)
const RemoveUser = defineAsyncComponent(
    () => import('~/assets/images/icons/remove-user.svg')
)
const Link = defineAsyncComponent(
    () => import('~/assets/images/icons/link.svg')
)
const Add = defineAsyncComponent(() => import('~/assets/images/icons/add.svg'))
const CircleLoader = defineAsyncComponent(
    () => import('~/assets/images/icons/circle-loader.svg')
)
const Term = defineAsyncComponent(
    () => import('~/assets/images/icons/term.svg')
)
const TermDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/term-deprecated.svg')
)
const TermIssue = defineAsyncComponent(
    () => import('~/assets/images/icons/term-issue.svg')
)
const TermVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/term-verified.svg')
)
const TermDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/term-wip.svg')
)
const Category = defineAsyncComponent(
    () => import('~/assets/images/icons/category.svg')
)
const CategoryShaded = defineAsyncComponent(
    () => import('~/assets/images/icons/category-shaded.svg')
)
const CategoryDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/category-deprecated.svg')
)
const CategoryIssue = defineAsyncComponent(
    () => import('~/assets/images/icons/category-issue.svg')
)
const CategoryVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/category-verified.svg')
)
const CategoryDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/category-wip.svg')
)
const Shield = defineAsyncComponent(
    () => import('~/assets/images/icons/shield.svg')
)
const ShieldFilled = defineAsyncComponent(
    () => import('~/assets/images/icons/shield-filled.svg')
)
const Edit = defineAsyncComponent(
    () => import('~/assets/images/icons/edit.svg')
)
const EmptySavedFilter = defineAsyncComponent(
    () => import('~/assets/images/icons/empty_saved_filters.svg')
)
const Decline = defineAsyncComponent(
    () => import('~/assets/images/icons/decline.svg')
)
const Approve = defineAsyncComponent(
    () => import('~/assets/images/icons/approve.svg')
)
const EmptyGlossary = defineAsyncComponent(
    () => import('~/assets/images/icons/empty-glossary.svg')
)
const Glossary = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary.svg')
)
const GlossaryInactive = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary_inactive.svg')
)
const GlossaryDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary-deprecated.svg')
)
const GlossaryVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary-verified.svg')
)
const GlossaryDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary-wip.svg')
)
const GlossaryGray = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary-gray.svg')
)
const KebabMenu = defineAsyncComponent(
    () => import('~/assets/images/icons/kebab-menu-new.svg')
)
const KebabMenuHorizontal = defineAsyncComponent(
    () => import('~/assets/images/icons/kebab-menu.svg')
)
const Overview = defineAsyncComponent(
    () => import('~/assets/images/icons/overview.svg')
)
const OverviewActive = defineAsyncComponent(
    () => import('~/assets/images/icons/overview_active.svg')
)
const Lineage = defineAsyncComponent(
    () => import('~/assets/images/icons/lineage.svg')
)
const LineageNew = defineAsyncComponent(
    () => import('~/assets/images/icons/lineage-new.svg')
)
const LineageSmall = defineAsyncComponent(
    () => import('~/assets/images/icons/lineage-small.svg')
)
const Activity = defineAsyncComponent(
    () => import('~/assets/images/icons/activity.svg')
)
const Columns = defineAsyncComponent(
    () => import('~/assets/images/icons/columns.svg')
)
const Relation = defineAsyncComponent(
    () => import('~/assets/images/icons/relation.svg')
)
const RelationActive = defineAsyncComponent(
    () => import('~/assets/images/icons/relations-active.svg')
)
const S3Object = defineAsyncComponent(
    () => import('~/assets/images/icons/s3object.svg')
)
const S3Bucket = defineAsyncComponent(
    () => import('~/assets/images/icons/s3bucket.svg')
)
const User = defineAsyncComponent(
    () => import('~/assets/images/icons/user.svg')
)
const Chats = defineAsyncComponent(
    () => import('~/assets/images/icons/chats.svg')
)
const OpenTermProfile = defineAsyncComponent(
    () => import('~/assets/images/icons/openTermProfile.svg')
)
const OpenCategoryProfile = defineAsyncComponent(
    () => import('~/assets/images/icons/open-category-profile.svg')
)
const Metadata = defineAsyncComponent(
    () => import('~/assets/images/icons/metadata.svg')
)
const Group = defineAsyncComponent(
    () => import('~/assets/images/icons/group.svg')
)
const GroupStatic = defineAsyncComponent(
    () => import('~/assets/images/icons/group-static.svg')
)
const External = defineAsyncComponent(
    () => import('~/assets/images/icons/external.svg')
)
const NewFolder = defineAsyncComponent(
    () => import('~/assets/images/icons/new-folder.svg')
)
const NewQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/new-query.svg')
)
const PublicFolder = defineAsyncComponent(
    () => import('~/assets/images/icons/public-folder.svg')
)
const PrivateFolder = defineAsyncComponent(
    () => import('~/assets/images/icons/private-folder.svg')
)
const TreeCollapseAll = defineAsyncComponent(
    () => import('~/assets/images/icons/tree-collapse-all.svg')
)
const FilterFunnel = defineAsyncComponent(
    () => import('~/assets/images/icons/filterFunnel.svg')
)
const FolderOpen = defineAsyncComponent(
    () => import('~/assets/images/icons/folder-open.svg')
)
const FolderClosed = defineAsyncComponent(
    () => import('~/assets/images/icons/folder-closed.svg')
)
const Schema2 = defineAsyncComponent(
    () => import('~/assets/images/icons/schema2.svg')
)
const History = defineAsyncComponent(
    () => import('~/assets/images/icons/history.svg')
)
const Queries = defineAsyncComponent(
    () => import('~/assets/images/icons/queries.svg')
)
const Play = defineAsyncComponent(
    () => import('~/assets/images/icons/play.svg')
)
const Pin = defineAsyncComponent(() => import('~/assets/images/icons/pin.svg'))
const Save = defineAsyncComponent(
    () => import('~/assets/images/icons/save.svg')
)
const Globe = defineAsyncComponent(
    () => import('~/assets/images/icons/globe.svg')
)
const Info = defineAsyncComponent(
    () => import('~/assets/images/icons/info.svg')
)
const AddAssetName = defineAsyncComponent(
    () => import('~/assets/images/icons/add-table.svg')
)
const Trash = defineAsyncComponent(
    () => import('~/assets/images/icons/trash.svg')
)
const Widgets = defineAsyncComponent(
    () => import('~/assets/images/icons/widgets.svg')
)
const Megaphone = defineAsyncComponent(
    () => import('~/assets/images/icons/megaphone.svg')
)
const Readme = defineAsyncComponent(
    () => import('~/assets/images/icons/readme.svg')
)
const Resources = defineAsyncComponent(
    () => import('~/assets/images/icons/resources.svg')
)
const FAQS = defineAsyncComponent(
    () => import('~/assets/images/icons/faqs.svg')
)
const TableSummary = defineAsyncComponent(
    () => import('~/assets/images/icons/tableSummary.svg')
)
const VariableTrigger = defineAsyncComponent(
    () => import('~/assets/images/icons/variable-trigger.svg')
)
const Home = defineAsyncComponent(
    () => import('~/assets/images/icons/home.svg')
)
const MultipleStatus = defineAsyncComponent(
    () => import('~/assets/images/icons/multiple-status.svg')
)
const Pencil = defineAsyncComponent(
    () => import('~/assets/images/icons/pencil.svg')
)
const Check = defineAsyncComponent(
    () => import('~/assets/images/icons/check.svg')
)
const CheckCircled = defineAsyncComponent(
    () => import('~/assets/images/icons/check-circled.svg')
)
const Dots = defineAsyncComponent(
    () => import('~/assets/images/icons/dots.svg')
)
const Sort = defineAsyncComponent(
    () => import('~/assets/images/icons/sort.svg')
)
const BuilderGroup = defineAsyncComponent(
    () => import('~/assets/images/icons/builder-group.svg')
)
const Cross = defineAsyncComponent(
    () => import('~/assets/images/icons/cross.svg')
)
const FullScreen = defineAsyncComponent(
    () => import('~/assets/images/icons/fullscreen.svg')
)
const ExitFullScreen = defineAsyncComponent(
    () => import('~/assets/images/icons/exit-fullscreen.svg')
)
const SidebarTrigger = defineAsyncComponent(
    () => import('~/assets/images/icons/sidebar-trigger.svg')
)
const SidebarTriggerFilled = defineAsyncComponent(
    () => import('~/assets/images/icons/sidebar-trigger-filled.svg')
)
const OutputpaneTrigger = defineAsyncComponent(
    () => import('~/assets/images/icons/output-pane-trigger.svg')
)
const OutputpaneTriggerFilled = defineAsyncComponent(
    () => import('~/assets/images/icons/output-pane-trigger-filled.svg')
)

const RunSuccess = defineAsyncComponent(
    () => import('~/assets/images/icons/run-success.svg')
)
const RunProgress = defineAsyncComponent(
    () => import('~/assets/images/icons/run-progress.svg')
)
const RunFailed = defineAsyncComponent(
    () => import('~/assets/images/icons/run-failed.svg')
)
const WorkflowsActive = defineAsyncComponent(
    () => import('~/assets/images/icons/workflows_active.svg')
)
const WorkflowsInactive = defineAsyncComponent(
    () => import('~/assets/images/icons/workflows_inactive.svg')
)
const InsightsActive = defineAsyncComponent(
    () => import('~/assets/images/icons/insights_active.svg')
)
const InsightsInactive = defineAsyncComponent(
    () => import('~/assets/images/icons/insights_inactive.svg')
)
const AssetsActive = defineAsyncComponent(
    () => import('~/assets/images/icons/assets_active.svg')
)
const AssetsInactive = defineAsyncComponent(
    () => import('~/assets/images/icons/assets_inactive.svg')
)
const RunHistory = defineAsyncComponent(
    () => import('~/assets/images/icons/run-history.svg')
)
const CaretLeft = defineAsyncComponent(
    () => import('~/assets/images/icons/caret-left.svg')
)
const CaretRight = defineAsyncComponent(
    () => import('~/assets/images/icons/caret-right.svg')
)
const CaretDown = defineAsyncComponent(
    () => import('~/assets/images/icons/caret-down.svg')
)
const Settings = defineAsyncComponent(
    () => import('~/assets/images/icons/setings.svg')
)
const SettingsOutlined = defineAsyncComponent(
    () => import('~/assets/images/icons/settings_outlined.svg')
)
const IssuesAnnouncement = defineAsyncComponent(
    () => import('~/assets/images/status/issues.svg')
)
const InformationAnnouncement = defineAsyncComponent(
    () => import('~/assets/images/status/information.svg')
)
const WarningAnnouncement = defineAsyncComponent(
    () => import('~/assets/images/status/warning.svg')
)
const EmptyResource = defineAsyncComponent(
    () => import('~/assets/images/icons/empty-resources.svg')
)
const EmptyResource2 = defineAsyncComponent(
    () => import('~/assets/images/icons/empty-resource-2.svg')
)
const EmptyClassifications = defineAsyncComponent(
    () => import('~/assets/images/icons/empty-classifications.svg')
)
const Delete = defineAsyncComponent(
    () => import('~/assets/images/icons/delete.svg')
)
const NoDataInsights = defineAsyncComponent(
    () => import('~/assets/images/icons/results.svg')
)
const SomethingWrong = defineAsyncComponent(
    () => import('~/assets/images/icons/something-wrong.svg')
)
const NoSavedQueriesPersonal = defineAsyncComponent(
    () => import('~/assets/images/icons/saved-queries-personal.svg')
)
const AddQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/add-query.svg')
)
const NoSchema = defineAsyncComponent(
    () => import('~/assets/images/icons/no-schema.svg')
)
const IssuesFilled = defineAsyncComponent(
    () => import('~/assets/images/icons/issues-filled.svg')
)
const queryErorrIllus = defineAsyncComponent(
    () => import('~/assets/images/icons/queryError.svg')
)
const NoSavedQueriesAll = defineAsyncComponent(
    () => import('~/assets/images/icons/saved-queries-all.svg')
)
const EmptyQueriesTab = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_queries_tab.svg')
)
const Slack = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/slack.svg')
)
const Jira = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/jira.svg')
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
const ExplorerTrigger = defineAsyncComponent(
    () => import('~/assets/images/icons/explorer-panel-trigger-outline.svg')
)
const ExplorerTriggerFilled = defineAsyncComponent(
    () => import('~/assets/images/icons/explorer-trigger-filled.svg')
)
const EmptySearchQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/empty_search_query.svg')
)
const EmptyResult = defineAsyncComponent(
    () => import('~/assets/images/icons/empty_result.svg')
)
const Schedule = defineAsyncComponent(
    () => import('~/assets/images/icons/schedule.svg')
)
const Unscheduled = defineAsyncComponent(
    () => import('~/assets/images/icons/unscheduled.svg')
)
const Minimap = defineAsyncComponent(
    () => import('~/assets/images/icons/minimap.svg')
)
const FullScreenBoth = defineAsyncComponent(
    () => import('~/assets/images/icons/fullscreen-both.svg')
)
const Minus = defineAsyncComponent(
    () => import('~/assets/images/icons/minus.svg')
)
const Recenter = defineAsyncComponent(
    () => import('~/assets/images/icons/recenter.svg')
)
const Refocus = defineAsyncComponent(
    () => import('~/assets/images/icons/refocus.svg')
)
const AssetsInactiveLight = defineAsyncComponent(
    () => import('~/assets/images/icons/assets-inactive-light.svg')
)
const AssetsActiveLight = defineAsyncComponent(
    () => import('~/assets/images/icons/assets-active-light.svg')
)
const Hourglass = defineAsyncComponent(
    () => import('~/assets/images/icons/hourglass.svg')
)
const HourglassActive = defineAsyncComponent(
    () => import('~/assets/images/icons/hourglass-active.svg')
)
const GroupActive = defineAsyncComponent(
    () => import('~/assets/images/icons/group-light-active.svg')
)
const GroupLight = defineAsyncComponent(
    () => import('~/assets/images/icons/group-light.svg')
)
const AccessLogs = defineAsyncComponent(
    () => import('~/assets/images/icons/access-logs.svg')
)
const AccessLogsActive = defineAsyncComponent(
    () => import('~/assets/images/icons/access-logs-active.svg')
)
const InfoActive = defineAsyncComponent(
    () => import('~/assets/images/icons/info-active.svg')
)
const UserLight = defineAsyncComponent(
    () => import('~/assets/images/icons/user-light.svg')
)
const UserLightActive = defineAsyncComponent(
    () => import('~/assets/images/icons/user-light-active.svg')
)
const Support = defineAsyncComponent(
    () => import('~/assets/images/icons/support.svg')
)
const Report = defineAsyncComponent(
    () => import('~/assets/images/icons/report.svg')
)
const Platform = defineAsyncComponent(
    () => import('~/assets/images/icons/platform.svg')
)
const Feedback = defineAsyncComponent(
    () => import('~/assets/images/icons/feedback.svg')
)
const Admin = defineAsyncComponent(
    () => import('~/assets/images/icons/admin.svg')
)
const ActivityLogs = defineAsyncComponent(
    () => import('~/assets/images/icons/activity-logs.svg')
)
const TableDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/table_deprecated.svg')
)
const TableDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/table_draft.svg')
)
const TableVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/table_verified.svg')
)
const Policy = defineAsyncComponent(
    () => import('~/assets/images/icons/policy.svg')
)
const PolicyAlt = defineAsyncComponent(
    () => import('~/assets/images/icons/policy-alt.svg')
)
const Key = defineAsyncComponent(() => import('~/assets/images/icons/key.svg'))
const EmptyDiscover = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_discover.svg')
)
const EmptyAssetProfile = defineAsyncComponent(
    () => import('~/assets/images/icons/empty_asset_profile.svg')
)
const EmptyLineage = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_lineage.svg')
)
const EmptyLineageTab = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_lineage_tab.svg')
)
const Property = defineAsyncComponent(
    () => import('~/assets/images/icons/property.svg')
)
const PropertyActive = defineAsyncComponent(
    () => import('~/assets/images/icons/property_active.svg')
)
const Query = defineAsyncComponent(
    () => import('~/assets/images/icons/query.svg')
)
const Trigger = defineAsyncComponent(
    () => import('~/assets/images/icons/trigger.svg')
)
const QueryVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/query-verified.svg')
)
const QueryDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/query-deprecated.svg')
)
const QueryDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/query-draft.svg')
)
const CollapseControl = defineAsyncComponent(
    () => import('~/assets/images/icons/collapse-control.svg')
)
const ColumnGray = defineAsyncComponent(
    () => import('~/assets/images/icons/column-gray.svg')
)
const MaterialisedView = defineAsyncComponent(
    () => import('~/assets/images/icons/materialised-view.svg')
)
const TablePartition = defineAsyncComponent(
    () => import('~/assets/images/icons/table-partition.svg')
)

// autosuggetions
const Function = defineAsyncComponent(
    () => import('~/assets/images/insights/autocomplete/function.svg')
)
const Nut = defineAsyncComponent(
    () => import('~/assets/images/insights/autocomplete/nut.svg')
)
const Snippet = defineAsyncComponent(
    () => import('~/assets/images/insights/autocomplete/snippet.svg')
)

const Gdoc = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/gDoc.svg')
)

const NoResultsFound = defineAsyncComponent(
    () => import('~/assets/images/icons/no-results-found.svg')
)
const StarCircled = defineAsyncComponent(
    () => import('~/assets/images/icons/star-circled.svg')
)
const ResendInvite = defineAsyncComponent(
    () => import('~/assets/images/icons/invite.svg')
)
const Flash = defineAsyncComponent(
    () => import('~/assets/images/icons/flash.svg')
)
const FlashColor = defineAsyncComponent(
    () => import('~/assets/images/icons/flash-color.svg')
)
const DisableUser = defineAsyncComponent(
    () => import('~/assets/images/icons/disabled-user.svg')
)
const ImpactedAssets = defineAsyncComponent(
    () => import('~/assets/images/icons/impacted-assets.svg')
)
const Gift = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/gift.svg')
)

const Code = defineAsyncComponent(
    () => import('~/assets/images/readme/code.svg')
)
const Underline = defineAsyncComponent(
    () => import('~/assets/images/readme/text-underline.svg')
)
const Bold = defineAsyncComponent(
    () => import('~/assets/images/readme/text-bold.svg')
)
const Italic = defineAsyncComponent(
    () => import('~/assets/images/readme/text-italic.svg')
)
const Strike = defineAsyncComponent(
    () => import('~/assets/images/readme/text-strike.svg')
)
const Undo = defineAsyncComponent(
    () => import('~/assets/images/readme/undo.svg')
)
const Redo = defineAsyncComponent(
    () => import('~/assets/images/readme/redo.svg')
)
const ReadmeImage = defineAsyncComponent(
    () => import('~/assets/images/readme/ImageSquare.svg')
)
const BulletList = defineAsyncComponent(
    () => import('~/assets/images/readme/ListBullets.svg')
)
const NumberedList = defineAsyncComponent(
    () => import('~/assets/images/readme/ListNumbers.svg')
)
const Quotes = defineAsyncComponent(
    () => import('~/assets/images/readme/Quotes.svg')
)
const HOne = defineAsyncComponent(
    () => import('~/assets/images/readme/TextHOne.svg')
)
const HTwo = defineAsyncComponent(
    () => import('~/assets/images/readme/TextHTwo.svg')
)
const HThree = defineAsyncComponent(
    () => import('~/assets/images/readme/TextHThree.svg')
)
const TextCenter = defineAsyncComponent(
    () => import('~/assets/images/readme/TextAlignCenter.svg')
)
const TextLeft = defineAsyncComponent(
    () => import('~/assets/images/readme/TextAlignLeft.svg')
)
const TextRight = defineAsyncComponent(
    () => import('~/assets/images/readme/TextAlignRight.svg')
)
const JustifyText = defineAsyncComponent(
    () => import('~/assets/images/readme/TextAlignJustify.svg')
)
const TaskList = defineAsyncComponent(
    () => import('~/assets/images/readme/TaskList.svg')
)
const GoogleDoc = defineAsyncComponent(
    () => import('~/assets/images/readme/googleDocs.svg')
)
const GoogleSheet = defineAsyncComponent(
    () => import('~/assets/images/readme/googleSheets.svg')
)
const GoogleSlide = defineAsyncComponent(
    () => import('~/assets/images/readme/googleSlides.svg')
)
const GoogleDrive = defineAsyncComponent(
    () => import('~/assets/images/readme/googleDrive.svg')
)
const GoogleDataStudio = defineAsyncComponent(
    () => import('~/assets/images/readme/googleDataStudio.svg')
)
const Confluence = defineAsyncComponent(
    () => import('~/assets/images/readme/confluence.svg')
)
const Miro = defineAsyncComponent(
    () => import('~/assets/images/readme/miro.svg')
)
const Figma = defineAsyncComponent(
    () => import('~/assets/images/readme/Figma.svg')
)
const Lucid = defineAsyncComponent(
    () => import('~/assets/images/readme/lucid.svg')
)
const Mention = defineAsyncComponent(
    () => import('~/assets/images/readme/mention.svg')
)
const DBDiagram = defineAsyncComponent(
    () => import('~/assets/images/readme/dbdiagram.svg')
)
const MicrosoftWord = defineAsyncComponent(
    () => import('~/assets/images/readme/microsoftWord.svg')
)
const MicrosoftExcel = defineAsyncComponent(
    () => import('~/assets/images/readme/microsoftExcel.svg')
)
const MicrosoftPowerpoint = defineAsyncComponent(
    () => import('~/assets/images/readme/microsoftPowerpoint.svg')
)
const Equation = defineAsyncComponent(
    () => import('~/assets/images/readme/equation.svg')
)

const Running = defineAsyncComponent(
    () => import('~/assets/images/icons/running.svg')
)
const ExclaimCircle = defineAsyncComponent(
    () => import('~/assets/images/icons/exclaimCircle.svg')
)
const Refresh = defineAsyncComponent(
    () => import('~/assets/images/icons/Refresh.svg')
)
const PlusWhite = defineAsyncComponent(
    () => import('~/assets/images/icons/plus-white.svg')
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

const Error = defineAsyncComponent(() => import('~/assets/images/error.svg'))
const Warning = defineAsyncComponent(
    () => import('~/assets/images/warning.svg')
)
const ErrorLogs = defineAsyncComponent(
    () => import('~/assets/images/workflows/error-logs-state.svg')
)
const EmptyLogs = defineAsyncComponent(
    () => import('~/assets/images/workflows/empty-logs-state.svg')
)
const WarningIcon = defineAsyncComponent(
    () => import('~/assets/images/icons/warning.svg')
)

const Download = defineAsyncComponent(
    () => import('~/assets/images/icons/download.svg')
)
const Upload = defineAsyncComponent(
    () => import('~/assets/images/icons/upload2.svg')
)
const Enum = defineAsyncComponent(
    () => import('~/assets/images/icons/label.svg')
)
const Boolean = defineAsyncComponent(
    () => import('~/assets/images/dataType/boolean.svg')
)
const String = defineAsyncComponent(
    () => import('~/assets/images/dataType/string.svg')
)
const MoveItem = defineAsyncComponent(
    () => import('~/assets/images/icons/move-item.svg')
)
const DateTime = defineAsyncComponent(
    () => import('~/assets/images/icons/datetime.svg')
)
const Number = defineAsyncComponent(
    () => import('~/assets/images/dataType/number.svg')
)
const Struct = defineAsyncComponent(
    () => import('~/assets/images/dataType/struct.svg')
)
const Geography = defineAsyncComponent(
    () => import('~/assets/images/dataType/geography.svg')
)

const NoAvatar = defineAsyncComponent(
    () => import('~/assets/images/icons/no-avatar.svg')
)
const Enter = defineAsyncComponent(
    () => import('~/assets/images/icons/enter.svg')
)
const EnterProfile = defineAsyncComponent(
    () => import('~/assets/images/icons/enter_profile.svg')
)
const Times = defineAsyncComponent(
    () => import('~/assets/images/icons/times.svg')
)
const NoLinkedAssets = defineAsyncComponent(
    () => import('~/assets/images/icons/no-linked-assets.svg')
)
const NoRequestFound = defineAsyncComponent(
    () => import('~/assets/images/icons/no-request-found.svg')
)
const GlossaryGettingStarted = defineAsyncComponent(
    () => import('~/assets/images/icons/glossary-getting-started.svg')
)
const BulkUpload = defineAsyncComponent(
    () => import('~/assets/images/icons/bulk-upload.svg')
)
const SSO = defineAsyncComponent(() => import('~/assets/images/icons/sso.svg'))
const SMTP = defineAsyncComponent(
    () => import('~/assets/images/icons/smtp.svg')
)
const APIKey = defineAsyncComponent(
    () => import('~/assets/images/icons/apikey.svg')
)
const Camera = defineAsyncComponent(
    () => import('~/assets/images/icons/camera.svg')
)
const Image = defineAsyncComponent(
    () => import('~/assets/images/icons/image.svg')
)
const FormatText = defineAsyncComponent(
    () => import('~/assets/images/icons/formatText.svg')
)
const BeautifySql = defineAsyncComponent(
    () => import('~/assets/images/icons/beautifySql.svg')
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
const CustomSaml = defineAsyncComponent(
    () => import('~/assets/images/icons/customSaml.svg')
)
const GlowFlash = defineAsyncComponent(
    () => import('~/assets/images/icons/glow-flash.svg')
)
const CheckCurrentColor = defineAsyncComponent(
    () => import('~/assets/images/icons/check-current-color.svg')
)
const AddColumn = defineAsyncComponent(
    () => import('~/assets/images/icons/add-column.svg')
)

const ClassificationShield = defineAsyncComponent(
    () => import('~/assets/images/classifications/shield.svg')
)
const ClassificationAtlan = defineAsyncComponent(
    () => import('~/assets/images/classifications/atlan.svg')
)
const ClassificationPropagated = defineAsyncComponent(
    () => import('~/assets/images/classifications/propagated.svg')
)

// source list
const NoWf = defineAsyncComponent(
    () => import('~/assets/images/icons/no-wf.svg')
)
const Column = defineAsyncComponent(
    () => import('~/assets/images/icons/column.svg')
)
const GovernanceCenter = defineAsyncComponent(
    () => import('~/assets/images/icons/governance-center.svg')
)

// source list
const Snowflake = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Snowflake.svg')
)
const Tableau = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Tableau.svg')
)
const Redshift = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Redshift.svg')
)
const Postgres = defineAsyncComponent(
    () => import('~/assets/images/source/svg/postgres.svg')
)
const Athena = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Athena.svg')
)
const Databricks = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Databricks.svg')
)
const PowerBI = defineAsyncComponent(
    () => import('~/assets/images/source/svg/PowerBI.svg')
)
const BigQuery = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Bigquery.svg')
)
const Looker = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Looker.svg')
)
const Salesforce = defineAsyncComponent(
    () => import('~/assets/images/source/svg/Salesforce.svg')
)
const MySQL = defineAsyncComponent(
    () => import('~/assets/images/source/svg/MySQL.svg')
)
const Glue = defineAsyncComponent(
    () => import('~/assets/images/source/svg/glue.svg')
)
const S3 = defineAsyncComponent(
    () => import('~/assets/images/source/svg/s3.svg')
)
const GDS = defineAsyncComponent(
    () => import('~/assets/images/source/svg/gds.svg')
)

const Schema2Active = defineAsyncComponent(
    () => import('~/assets/images/icons/schema2Active.svg')
)
const QueriesActive = defineAsyncComponent(
    () => import('~/assets/images/icons/queriesActive.svg')
)
const Close = defineAsyncComponent(
    () => import('~/assets/images/icons/close.svg')
)

const ShieldCheck = defineAsyncComponent(
    () => import('~/assets/images/icons/shield-check.svg')
)
const CustomVariable = defineAsyncComponent(
    () => import('~/assets/images/icons/customVariable.svg')
)

const FolderSearch = defineAsyncComponent(
    () => import('~/assets/images/icons/folder-search.svg')
)
const FolderNav24 = defineAsyncComponent(
    () => import('~/assets/images/icons/folder_closed_24.svg')
)
const FolderNav24Active = defineAsyncComponent(
    () => import('~/assets/images/icons/folder_open_24.svg')
)
const Verified = defineAsyncComponent(
    () => import('~/assets/images/status/verified.svg')
)
const Draft = defineAsyncComponent(
    () => import('~/assets/images/status/draft.svg')
)
const Deprecated = defineAsyncComponent(
    () => import('~/assets/images/status/deprecated.svg')
)
const Nostatus = defineAsyncComponent(
    () => import('~/assets/images/status/nostatus.svg')
)
const ShieldBlank = defineAsyncComponent(
    () => import('~/assets/images/icons/ShieldBlank.svg')
)
const Compass = defineAsyncComponent(
    () => import('~/assets/images/icons/Compass.svg')
)
const Policies = defineAsyncComponent(
    () => import('~/assets/images/icons/Policies.svg')
)

const InnerJoin = defineAsyncComponent(
    () => import('~/assets/images/icons/InnerJoin.svg')
)
const LeftJoin = defineAsyncComponent(
    () => import('~/assets/images/icons/LeftJoin.svg')
)
const RightJoin = defineAsyncComponent(
    () => import('~/assets/images/icons/RightJoin.svg')
)
const OuterJoin = defineAsyncComponent(
    () => import('~/assets/images/icons/OuterJoin.svg')
)
const TableSwap = defineAsyncComponent(
    () => import('~/assets/images/icons/swapTable.svg')
)
const JoinHeader = defineAsyncComponent(
    () => import('~/assets/images/icons/JoinHeader.svg')
)
const PublicCollection = defineAsyncComponent(
    () => import('~/assets/images/icons/publicCollection.svg')
)
const PrivateCollection = defineAsyncComponent(
    () => import('~/assets/images/icons/privateCollection.svg')
)
const NoSelectedAsset = defineAsyncComponent(
    () => import('~/assets/images/icons/noSelectedAsset.svg')
)
const QueryGrey = defineAsyncComponent(
    () => import('~/assets/images/icons/query-grey.svg')
)
const QueryDiscovery = defineAsyncComponent(
    () => import('~/assets/images/icons/query_discovery.svg')
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
const SetContext = defineAsyncComponent(
    () => import('~/assets/images/icons/setContext.svg')
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
const CollectionIconSmall = defineAsyncComponent(
    () => import('~/assets/images/icons/collections_16.svg')
)
const CollectionIconLargeActive = defineAsyncComponent(
    () => import('~/assets/images/icons/collections_24.svg')
)
const CollectionIconSmallGray = defineAsyncComponent(
    () => import('~/assets/images/icons/collections_gray_16.svg')
)
const CollectionIconLarge = defineAsyncComponent(
    () => import('~/assets/images/icons/collections_gray_24.svg')
)
const EmptyCM = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty-custom-metadata.svg')
)
const EnumType = defineAsyncComponent(
    () => import('~/assets/images/dataType/enum.svg')
)
const Float = defineAsyncComponent(
    () => import('~/assets/images/dataType/float.svg')
)
const Array = defineAsyncComponent(
    () => import('~/assets/images/dataType/array.svg')
)
const primaryKey = defineAsyncComponent(
    () => import('~/assets/images/icons/primaryKey.svg')
)
const Revoke = defineAsyncComponent(
    () => import('~/assets/images/icons/Revoke.svg')
)
const Query24 = defineAsyncComponent(
    () => import('~/assets/images/icons/query_24.svg')
)
const Vqb24 = defineAsyncComponent(
    () => import('~/assets/images/icons/vqb_24.svg')
)
const SidebarSwitch = defineAsyncComponent(
    () => import('~/assets/images/icons/sidebar.svg')
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
const Vqb = defineAsyncComponent(() => import('~/assets/images/icons/Vqb.svg'))
const VqbVerified = defineAsyncComponent(
    () => import('~/assets/images/icons/VqbVerified.svg')
)
const VqbDeprecated = defineAsyncComponent(
    () => import('~/assets/images/icons/VqbDeprecated.svg')
)
const VqbDraft = defineAsyncComponent(
    () => import('~/assets/images/icons/VqbDraft.svg')
)
const Clock = defineAsyncComponent(
    () => import('~/assets/images/icons/clock.svg')
)
const ClockStart = defineAsyncComponent(
    () => import('~/assets/images/icons/clock-start.svg')
)
const ClockStop = defineAsyncComponent(
    () => import('~/assets/images/icons/clock-stop.svg')
)
const Mail = defineAsyncComponent(
    () => import('~/assets/images/icons/mail.svg')
)
const Collapsed = defineAsyncComponent(
    () => import('~/assets/images/icons/Collapsed.svg')
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
const Quotes2 = defineAsyncComponent(
    () => import('~/assets/images/icons/Quotes.svg')
)
const OpenPreview = defineAsyncComponent(
    () => import('~/assets/images/icons/open-preview.svg')
)
const Message = defineAsyncComponent(
    () => import('~/assets/images/icons/message.svg')
)
const MessageSuccess = defineAsyncComponent(
    () => import('~/assets/images/icons/MessageSuccess.svg')
)
const CrossCircle = defineAsyncComponent(
    () => import('~/assets/images/icons/CrossCircle.svg')
)
const MessageCross = defineAsyncComponent(
    () => import('~/assets/images/icons/MessageCross.svg')
)
const Atlan = defineAsyncComponent(
    () => import('~/assets/images/icons/atlan.svg')
)
const Gear = defineAsyncComponent(
    () => import('~/assets/images/icons/gear.svg')
)
const SafariLock = defineAsyncComponent(
    () => import('~/assets/images/icons/safari-lock.svg')
)
const SlackToken = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/slackToken.svg')
)
const SlackAddApp = defineAsyncComponent(
    () => import('~/assets/images/admin/integrations/SlackAddApp.svg')
)
const Integrations = defineAsyncComponent(
    () => import('~/assets/images/icons/integrations.svg')
)
const IntegrationsActive = defineAsyncComponent(
    () => import('~/assets/images/icons/integrations-active.svg')
)
const QueryTime = defineAsyncComponent(
    () => import('~/assets/images/icons/query_time.svg')
)
const ThreeDots = defineAsyncComponent(
    () => import('~/assets/images/icons/ThreeDots.svg')
)
const Request = defineAsyncComponent(
    () => import('~/assets/images/icons/Request.svg')
)
const RequestActive = defineAsyncComponent(
    () => import('~/assets/images/icons/RequestActive.svg')
)
const FilterFunnelDot = defineAsyncComponent(
    () => import('~/assets/images/icons/filterFunnelDot.svg')
)
const Comment = defineAsyncComponent(
    () => import('~/assets/images/icons/Comment.svg')
)
const Resources2 = defineAsyncComponent(
    () => import('~/assets/images/illustrations/resources/resources.svg')
)
const RunningQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/tabs/Running.svg')
)
const FailedQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/tabs/Error.svg')
)
const SlackTabEmpty = defineAsyncComponent(
    () => import('~/assets/images/illustrations/empty_slack_tab.svg')
)
const SuccessQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/tabs/success-check.svg')
)
const QuestionRound = defineAsyncComponent(
    () => import('~/assets/images/icons/question-round.svg')
)
const QuestionRoundSmall = defineAsyncComponent(
    () => import('~/assets/images/icons/question-round-small.svg')
)
const Documentation = defineAsyncComponent(
    () => import('~/assets/images/icons/documentation.svg')
)
const Logout = defineAsyncComponent(
    () => import('~/assets/images/icons/logout.svg')
)
const TrendUp = defineAsyncComponent(
    () => import('~/assets/images/icons/trendUp.svg')
)
const NoAllow = defineAsyncComponent(
    () => import('~/assets/images/icons/no-allow.svg')
)

const ThreeDotsAlt = defineAsyncComponent(
    () => import('~/assets/images/icons/3-dots-alt.svg')
)
const NoProperty = defineAsyncComponent(
    () => import('~/assets/images/admin/customMetadata/empty-property.svg')
)
const TrashAlt = defineAsyncComponent(
    () => import('~/assets/images/icons/Trash-alt.svg')
)
const Schedule24 = defineAsyncComponent(
    () => import('~/assets/images/icons/schedule-24.svg')
)

const Chat = defineAsyncComponent(
    () => import('~/assets/images/icons/chat.svg')
)
const NotificationNoDot = defineAsyncComponent(
    () => import('~/assets/images/icons/notification-no-dot.svg')
)
const Workflow = defineAsyncComponent(
    () => import('~/assets/images/icons/workflows.svg')
)
const Package = defineAsyncComponent(
    () => import('~/assets/images/icons/package.svg')
)

const Display = defineAsyncComponent(
    () => import('~/assets/images/icons/display.svg')
)
const FullScreenSquare = defineAsyncComponent(
    () => import('~/assets/images/icons/full_screen_sqaure.svg')
)
const QueryOutputSuccess = defineAsyncComponent(
    () => import('~/assets/images/icons/query_output_success.svg')
)
const QueryMetadata = defineAsyncComponent(
    () => import('~/assets/images/icons/query_metadata.svg')
)
const QueryOutputFail = defineAsyncComponent(
    () => import('~/assets/images/icons/query_output_fail.svg')
)
const QueryOutputNeutral = defineAsyncComponent(
    () => import('~/assets/images/icons/query_output_neutral.svg')
)
const PreviewQuery = defineAsyncComponent(
    () => import('~/assets/images/icons/preview.svg')
)
const Trident = defineAsyncComponent(
    () => import('~/assets/images/icons/trident.svg')
)
const EmptyUploads = defineAsyncComponent(
    () => import('~/assets/images/icons/empty-uploads.svg')
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
const CSVLogo = defineAsyncComponent(
    () => import('~/assets/images/icons/csv-logo.svg')
)
const PaperClip = defineAsyncComponent(
    () => import('~/assets/images/icons/paper-clip.svg')
)
const FlaskIcon = defineAsyncComponent(
    () => import('~/assets/images/icons/flask.svg')
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
    LegendExpand,
    LegendCollapse,
    LegendAnomaly,
    LegendSelected,
    LegendHighlighted,
    Schedule24,
    Mail,
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
}
