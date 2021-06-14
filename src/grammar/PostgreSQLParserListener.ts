// Generated from ./src/grammar/PostgreSQLParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { RootContext } from "./PostgreSQLParserParser";
import { StmtContext } from "./PostgreSQLParserParser";
import { Abort_stmtContext } from "./PostgreSQLParserParser";
import { Alter_stmtContext } from "./PostgreSQLParserParser";
import { Alter_aggregate_stmtContext } from "./PostgreSQLParserParser";
import { Alter_collation_stmtContext } from "./PostgreSQLParserParser";
import { Alter_conversion_stmtContext } from "./PostgreSQLParserParser";
import { Alter_database_stmtContext } from "./PostgreSQLParserParser";
import { Alter_default_privileges_stmtContext } from "./PostgreSQLParserParser";
import { Alter_domain_stmtContext } from "./PostgreSQLParserParser";
import { Alter_event_trigger_stmtContext } from "./PostgreSQLParserParser";
import { Alter_extension_stmtContext } from "./PostgreSQLParserParser";
import { Alter_foreign_data_wrapper_stmtContext } from "./PostgreSQLParserParser";
import { Alter_foreign_table_actionContext } from "./PostgreSQLParserParser";
import { Alter_foreign_table_action_listContext } from "./PostgreSQLParserParser";
import { Alter_foreign_table_stmtContext } from "./PostgreSQLParserParser";
import { Alter_function_stmtContext } from "./PostgreSQLParserParser";
import { Alter_group_stmtContext } from "./PostgreSQLParserParser";
import { Alter_index_stmtContext } from "./PostgreSQLParserParser";
import { Alter_language_stmtContext } from "./PostgreSQLParserParser";
import { Alter_large_object_stmtContext } from "./PostgreSQLParserParser";
import { Alter_materialize_view_stmtContext } from "./PostgreSQLParserParser";
import { Alter_operator_stmtContext } from "./PostgreSQLParserParser";
import { Alter_operator_class_stmtContext } from "./PostgreSQLParserParser";
import { Alter_operator_family_stmtContext } from "./PostgreSQLParserParser";
import { Alter_policy_stmtContext } from "./PostgreSQLParserParser";
import { Alter_publication_stmtContext } from "./PostgreSQLParserParser";
import { Alter_role_optionsContext } from "./PostgreSQLParserParser";
import { Alter_role_stmtContext } from "./PostgreSQLParserParser";
import { Alter_rule_stmtContext } from "./PostgreSQLParserParser";
import { Alter_schema_stmtContext } from "./PostgreSQLParserParser";
import { Alter_sequence_stmtContext } from "./PostgreSQLParserParser";
import { Alter_server_options_listContext } from "./PostgreSQLParserParser";
import { Alter_server_stmtContext } from "./PostgreSQLParserParser";
import { Alter_statistics_stmtContext } from "./PostgreSQLParserParser";
import { Alter_subscription_stmtContext } from "./PostgreSQLParserParser";
import { Alter_system_stmtContext } from "./PostgreSQLParserParser";
import { Alter_table_stmtContext } from "./PostgreSQLParserParser";
import { Alter_tablespace_stmtContext } from "./PostgreSQLParserParser";
import { Alter_text_search_config_stmtContext } from "./PostgreSQLParserParser";
import { Alter_text_search_dict_stmtContext } from "./PostgreSQLParserParser";
import { Alter_text_search_parser_stmtContext } from "./PostgreSQLParserParser";
import { Alter_text_search_template_stmtContext } from "./PostgreSQLParserParser";
import { Alter_trigger_stmtContext } from "./PostgreSQLParserParser";
import { Alter_type_stmtContext } from "./PostgreSQLParserParser";
import { Alter_user_stmtContext } from "./PostgreSQLParserParser";
import { Alter_user_mapping_stmtContext } from "./PostgreSQLParserParser";
import { Alter_view_stmtContext } from "./PostgreSQLParserParser";
import { Analyze_stmtContext } from "./PostgreSQLParserParser";
import { Close_stmtContext } from "./PostgreSQLParserParser";
import { Cluster_stmtContext } from "./PostgreSQLParserParser";
import { Comment_stmtContext } from "./PostgreSQLParserParser";
import { Commit_stmtContext } from "./PostgreSQLParserParser";
import { Commit_prepared_stmtContext } from "./PostgreSQLParserParser";
import { Copy_stmtContext } from "./PostgreSQLParserParser";
import { Create_stmtContext } from "./PostgreSQLParserParser";
import { Create_access_method_stmtContext } from "./PostgreSQLParserParser";
import { Create_aggregate_stmtContext } from "./PostgreSQLParserParser";
import { Create_cast_stmtContext } from "./PostgreSQLParserParser";
import { Create_collation_optContext } from "./PostgreSQLParserParser";
import { Create_collation_opt_listContext } from "./PostgreSQLParserParser";
import { Create_collation_stmtContext } from "./PostgreSQLParserParser";
import { Create_conversion_stmtContext } from "./PostgreSQLParserParser";
import { Create_database_stmtContext } from "./PostgreSQLParserParser";
import { Domain_constraintContext } from "./PostgreSQLParserParser";
import { Create_domain_stmtContext } from "./PostgreSQLParserParser";
import { Create_event_trigger_condContext } from "./PostgreSQLParserParser";
import { Create_event_trigger_stmtContext } from "./PostgreSQLParserParser";
import { Create_foreign_data_optionsContext } from "./PostgreSQLParserParser";
import { Create_foreign_data_stmtContext } from "./PostgreSQLParserParser";
import { Create_foreign_table_stmtContext } from "./PostgreSQLParserParser";
import { Create_function_stmtContext } from "./PostgreSQLParserParser";
import { Create_group_stmtContext } from "./PostgreSQLParserParser";
import { Create_index_stmtContext } from "./PostgreSQLParserParser";
import { Create_language_stmtContext } from "./PostgreSQLParserParser";
import { Create_materialized_view_stmtContext } from "./PostgreSQLParserParser";
import { Create_operator_stmtContext } from "./PostgreSQLParserParser";
import { Create_operator_class_optContext } from "./PostgreSQLParserParser";
import { Create_operator_class_stmtContext } from "./PostgreSQLParserParser";
import { Create_operator_family_stmtContext } from "./PostgreSQLParserParser";
import { Create_policy_stmtContext } from "./PostgreSQLParserParser";
import { Create_role_stmtContext } from "./PostgreSQLParserParser";
import { Create_rule_eventContext } from "./PostgreSQLParserParser";
import { Create_rule_stmtContext } from "./PostgreSQLParserParser";
import { Create_schema_stmtContext } from "./PostgreSQLParserParser";
import { Create_sequence_stmtContext } from "./PostgreSQLParserParser";
import { Create_server_stmtContext } from "./PostgreSQLParserParser";
import { Create_statistics_stmtContext } from "./PostgreSQLParserParser";
import { Create_subscription_stmtContext } from "./PostgreSQLParserParser";
import { Create_table_stmtContext } from "./PostgreSQLParserParser";
import { Create_table_as_stmtContext } from "./PostgreSQLParserParser";
import { Create_tablespace_stmtContext } from "./PostgreSQLParserParser";
import { Create_text_search_config_stmtContext } from "./PostgreSQLParserParser";
import { Create_text_search_dict_stmtContext } from "./PostgreSQLParserParser";
import { Create_text_search_parser_stmtContext } from "./PostgreSQLParserParser";
import { Create_text_search_template_stmtContext } from "./PostgreSQLParserParser";
import { Create_transform_stmtContext } from "./PostgreSQLParserParser";
import { Create_trigger_stmtContext } from "./PostgreSQLParserParser";
import { Create_type_stmtContext } from "./PostgreSQLParserParser";
import { Create_user_stmtContext } from "./PostgreSQLParserParser";
import { Create_user_mapping_stmtContext } from "./PostgreSQLParserParser";
import { Create_view_stmtContext } from "./PostgreSQLParserParser";
import { Deallocate_stmtContext } from "./PostgreSQLParserParser";
import { Declare_stmtContext } from "./PostgreSQLParserParser";
import { Delete_stmtContext } from "./PostgreSQLParserParser";
import { Discard_stmtContext } from "./PostgreSQLParserParser";
import { Drop_stmtContext } from "./PostgreSQLParserParser";
import { Drop_access_method_stmtContext } from "./PostgreSQLParserParser";
import { Drop_aggregate_stmtContext } from "./PostgreSQLParserParser";
import { Drop_cast_stmtContext } from "./PostgreSQLParserParser";
import { Drop_collation_stmtContext } from "./PostgreSQLParserParser";
import { Drop_conversion_stmtContext } from "./PostgreSQLParserParser";
import { Drop_database_stmtContext } from "./PostgreSQLParserParser";
import { Drop_domain_stmtContext } from "./PostgreSQLParserParser";
import { Drop_event_trigger_stmtContext } from "./PostgreSQLParserParser";
import { Drop_extension_stmtContext } from "./PostgreSQLParserParser";
import { Drop_foreign_data_wrapper_stmtContext } from "./PostgreSQLParserParser";
import { Drop_foreign_table_stmtContext } from "./PostgreSQLParserParser";
import { Drop_function_stmtContext } from "./PostgreSQLParserParser";
import { Drop_group_stmtContext } from "./PostgreSQLParserParser";
import { Drop_index_stmtContext } from "./PostgreSQLParserParser";
import { Drop_language_stmtContext } from "./PostgreSQLParserParser";
import { Drop_materialized_view_stmtContext } from "./PostgreSQLParserParser";
import { Drop_operator_stmtContext } from "./PostgreSQLParserParser";
import { Drop_operator_class_stmtContext } from "./PostgreSQLParserParser";
import { Drop_operator_family_stmtContext } from "./PostgreSQLParserParser";
import { Drop_owned_stmtContext } from "./PostgreSQLParserParser";
import { Drop_policy_stmtContext } from "./PostgreSQLParserParser";
import { Drop_publication_stmtContext } from "./PostgreSQLParserParser";
import { Drop_role_stmtContext } from "./PostgreSQLParserParser";
import { Drop_rule_stmtContext } from "./PostgreSQLParserParser";
import { Drop_schema_stmtContext } from "./PostgreSQLParserParser";
import { Drop_sequence_stmtContext } from "./PostgreSQLParserParser";
import { Drop_server_stmtContext } from "./PostgreSQLParserParser";
import { Drop_statistics_stmtContext } from "./PostgreSQLParserParser";
import { Drop_subscription_stmtContext } from "./PostgreSQLParserParser";
import { Drop_table_stmtContext } from "./PostgreSQLParserParser";
import { Drop_tablespace_stmtContext } from "./PostgreSQLParserParser";
import { Drop_text_search_config_stmtContext } from "./PostgreSQLParserParser";
import { Drop_text_search_dict_stmtContext } from "./PostgreSQLParserParser";
import { Drop_text_search_parser_stmtContext } from "./PostgreSQLParserParser";
import { Drop_text_search_template_stmtContext } from "./PostgreSQLParserParser";
import { Drop_transform_stmtContext } from "./PostgreSQLParserParser";
import { Drop_trigger_stmtContext } from "./PostgreSQLParserParser";
import { Drop_type_stmtContext } from "./PostgreSQLParserParser";
import { Drop_user_stmtContext } from "./PostgreSQLParserParser";
import { Drop_user_mapping_stmtContext } from "./PostgreSQLParserParser";
import { Drop_view_stmtContext } from "./PostgreSQLParserParser";
import { Execute_stmtContext } from "./PostgreSQLParserParser";
import { Explain_stmtContext } from "./PostgreSQLParserParser";
import { Fetch_stmtContext } from "./PostgreSQLParserParser";
import { Grant_stmtContext } from "./PostgreSQLParserParser";
import { Import_foreign_schema_stmtContext } from "./PostgreSQLParserParser";
import { Insert_stmtContext } from "./PostgreSQLParserParser";
import { Listen_stmtContext } from "./PostgreSQLParserParser";
import { Load_stmtContext } from "./PostgreSQLParserParser";
import { Lock_stmtContext } from "./PostgreSQLParserParser";
import { Move_stmtContext } from "./PostgreSQLParserParser";
import { Notify_stmtContext } from "./PostgreSQLParserParser";
import { Prepare_stmtContext } from "./PostgreSQLParserParser";
import { Prepare_transaction_stmtContext } from "./PostgreSQLParserParser";
import { Reassign_owned_stmtContext } from "./PostgreSQLParserParser";
import { Refresh_materialized_view_stmtContext } from "./PostgreSQLParserParser";
import { Reindex_stmtContext } from "./PostgreSQLParserParser";
import { Release_savepoint_stmtContext } from "./PostgreSQLParserParser";
import { Reset_stmtContext } from "./PostgreSQLParserParser";
import { Revoke_stmtContext } from "./PostgreSQLParserParser";
import { Rollback_stmtContext } from "./PostgreSQLParserParser";
import { Rollback_prepared_stmtContext } from "./PostgreSQLParserParser";
import { Rollback_to_savepoint_stmtContext } from "./PostgreSQLParserParser";
import { Savepoint_stmtContext } from "./PostgreSQLParserParser";
import { Security_label_stmtContext } from "./PostgreSQLParserParser";
import { Select_stmtContext } from "./PostgreSQLParserParser";
import { Select_into_stmtContext } from "./PostgreSQLParserParser";
import { With_clauseContext } from "./PostgreSQLParserParser";
import { With_exprContext } from "./PostgreSQLParserParser";
import { Set_stmtContext } from "./PostgreSQLParserParser";
import { Set_constraints_stmtContext } from "./PostgreSQLParserParser";
import { Set_role_stmtContext } from "./PostgreSQLParserParser";
import { Set_session_authorization_stmtContext } from "./PostgreSQLParserParser";
import { Transaction_modeContext } from "./PostgreSQLParserParser";
import { Transaction_mode_listContext } from "./PostgreSQLParserParser";
import { Set_transaction_stmtContext } from "./PostgreSQLParserParser";
import { Show_stmtContext } from "./PostgreSQLParserParser";
import { Truncate_stmtContext } from "./PostgreSQLParserParser";
import { Unlisten_stmtContext } from "./PostgreSQLParserParser";
import { Update_stmtContext } from "./PostgreSQLParserParser";
import { Vacuum_optContext } from "./PostgreSQLParserParser";
import { Vacuum_opt_listContext } from "./PostgreSQLParserParser";
import { Vacuum_stmtContext } from "./PostgreSQLParserParser";
import { Values_stmtContext } from "./PostgreSQLParserParser";
import { Selector_clauseContext } from "./PostgreSQLParserParser";
import { From_clauseContext } from "./PostgreSQLParserParser";
import { Where_clauseContext } from "./PostgreSQLParserParser";
import { Group_by_clauseContext } from "./PostgreSQLParserParser";
import { Grouping_elemContext } from "./PostgreSQLParserParser";
import { Grouping_elem_listContext } from "./PostgreSQLParserParser";
import { Having_clauseContext } from "./PostgreSQLParserParser";
import { Column_listContext } from "./PostgreSQLParserParser";
import { Explain_parameterContext } from "./PostgreSQLParserParser";
import { FrameContext } from "./PostgreSQLParserParser";
import { Frame_startContext } from "./PostgreSQLParserParser";
import { Frame_endContext } from "./PostgreSQLParserParser";
import { Frame_clauseContext } from "./PostgreSQLParserParser";
import { Window_definitionContext } from "./PostgreSQLParserParser";
import { Window_clauseContext } from "./PostgreSQLParserParser";
import { Combine_clauseContext } from "./PostgreSQLParserParser";
import { Order_by_clauseContext } from "./PostgreSQLParserParser";
import { Order_by_itemContext } from "./PostgreSQLParserParser";
import { Limit_clauseContext } from "./PostgreSQLParserParser";
import { Offset_clauseContext } from "./PostgreSQLParserParser";
import { Fetch_clauseContext } from "./PostgreSQLParserParser";
import { For_clauseContext } from "./PostgreSQLParserParser";
import { Updater_clauseContext } from "./PostgreSQLParserParser";
import { Updater_exprContext } from "./PostgreSQLParserParser";
import { Returning_clauseContext } from "./PostgreSQLParserParser";
import { ExprContext } from "./PostgreSQLParserParser";
import { Bool_exprContext } from "./PostgreSQLParserParser";
import { Case_exprContext } from "./PostgreSQLParserParser";
import { Expr_listContext } from "./PostgreSQLParserParser";
import { Expr_list_listContext } from "./PostgreSQLParserParser";
import { Func_sig_argContext } from "./PostgreSQLParserParser";
import { Func_sig_arg_listContext } from "./PostgreSQLParserParser";
import { Func_sigContext } from "./PostgreSQLParserParser";
import { Func_sig_listContext } from "./PostgreSQLParserParser";
import { Type_nameContext } from "./PostgreSQLParserParser";
import { TimezoneContext } from "./PostgreSQLParserParser";
import { OperContext } from "./PostgreSQLParserParser";
import { AggregateContext } from "./PostgreSQLParserParser";
import { Name_Context } from "./PostgreSQLParserParser";
import { Name_listContext } from "./PostgreSQLParserParser";
import { Identifier_listContext } from "./PostgreSQLParserParser";
import { Option_exprContext } from "./PostgreSQLParserParser";
import { Option_listContext } from "./PostgreSQLParserParser";
import { Table_name_Context } from "./PostgreSQLParserParser";
import { Data_typeContext } from "./PostgreSQLParserParser";
import { Data_type_listContext } from "./PostgreSQLParserParser";
import { Index_methodContext } from "./PostgreSQLParserParser";
import { Func_nameContext } from "./PostgreSQLParserParser";
import { Func_callContext } from "./PostgreSQLParserParser";
import { Array_cons_exprContext } from "./PostgreSQLParserParser";
import { From_itemContext } from "./PostgreSQLParserParser";
import { With_column_aliasContext } from "./PostgreSQLParserParser";
import { Join_typeContext } from "./PostgreSQLParserParser";
import { Join_clauseContext } from "./PostgreSQLParserParser";
import { PredicateContext } from "./PostgreSQLParserParser";
import { Aggregate_signatureContext } from "./PostgreSQLParserParser";
import { Column_constraintContext } from "./PostgreSQLParserParser";
import { Column_constraintsContext } from "./PostgreSQLParserParser";
import { Index_parametersContext } from "./PostgreSQLParserParser";
import { Exclude_elementContext } from "./PostgreSQLParserParser";
import { Table_constraintContext } from "./PostgreSQLParserParser";
import { Role_nameContext } from "./PostgreSQLParserParser";
import { Role_name_listContext } from "./PostgreSQLParserParser";
import { Param_valueContext } from "./PostgreSQLParserParser";
import { Non_reserved_keywordContext } from "./PostgreSQLParserParser";
import { IdentifierContext } from "./PostgreSQLParserParser";
import { Todo_fill_inContext } from "./PostgreSQLParserParser";
import { Todo_implementContext } from "./PostgreSQLParserParser";
import { Correlation_nameContext } from "./PostgreSQLParserParser";
import { Column_nameContext } from "./PostgreSQLParserParser";
import { AliasContext } from "./PostgreSQLParserParser";
import { Column_aliasContext } from "./PostgreSQLParserParser";
import { Column_definitionContext } from "./PostgreSQLParserParser";
import { Window_nameContext } from "./PostgreSQLParserParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `PostgreSQLParserParser`.
 */
export interface PostgreSQLParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.root`.
	 * @param ctx the parse tree
	 */
	enterRoot?: (ctx: RootContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.root`.
	 * @param ctx the parse tree
	 */
	exitRoot?: (ctx: RootContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.stmt`.
	 * @param ctx the parse tree
	 */
	enterStmt?: (ctx: StmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.stmt`.
	 * @param ctx the parse tree
	 */
	exitStmt?: (ctx: StmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.abort_stmt`.
	 * @param ctx the parse tree
	 */
	enterAbort_stmt?: (ctx: Abort_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.abort_stmt`.
	 * @param ctx the parse tree
	 */
	exitAbort_stmt?: (ctx: Abort_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_stmt?: (ctx: Alter_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_stmt?: (ctx: Alter_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_aggregate_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_aggregate_stmt?: (ctx: Alter_aggregate_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_aggregate_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_aggregate_stmt?: (ctx: Alter_aggregate_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_collation_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_collation_stmt?: (ctx: Alter_collation_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_collation_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_collation_stmt?: (ctx: Alter_collation_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_conversion_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_conversion_stmt?: (ctx: Alter_conversion_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_conversion_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_conversion_stmt?: (ctx: Alter_conversion_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_database_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_database_stmt?: (ctx: Alter_database_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_database_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_database_stmt?: (ctx: Alter_database_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_default_privileges_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_default_privileges_stmt?: (ctx: Alter_default_privileges_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_default_privileges_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_default_privileges_stmt?: (ctx: Alter_default_privileges_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_domain_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_domain_stmt?: (ctx: Alter_domain_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_domain_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_domain_stmt?: (ctx: Alter_domain_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_event_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_event_trigger_stmt?: (ctx: Alter_event_trigger_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_event_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_event_trigger_stmt?: (ctx: Alter_event_trigger_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_extension_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_extension_stmt?: (ctx: Alter_extension_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_extension_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_extension_stmt?: (ctx: Alter_extension_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_foreign_data_wrapper_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_foreign_data_wrapper_stmt?: (ctx: Alter_foreign_data_wrapper_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_foreign_data_wrapper_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_foreign_data_wrapper_stmt?: (ctx: Alter_foreign_data_wrapper_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_action`.
	 * @param ctx the parse tree
	 */
	enterAlter_foreign_table_action?: (ctx: Alter_foreign_table_actionContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_action`.
	 * @param ctx the parse tree
	 */
	exitAlter_foreign_table_action?: (ctx: Alter_foreign_table_actionContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_action_list`.
	 * @param ctx the parse tree
	 */
	enterAlter_foreign_table_action_list?: (ctx: Alter_foreign_table_action_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_action_list`.
	 * @param ctx the parse tree
	 */
	exitAlter_foreign_table_action_list?: (ctx: Alter_foreign_table_action_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_foreign_table_stmt?: (ctx: Alter_foreign_table_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_foreign_table_stmt?: (ctx: Alter_foreign_table_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_function_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_function_stmt?: (ctx: Alter_function_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_function_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_function_stmt?: (ctx: Alter_function_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_group_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_group_stmt?: (ctx: Alter_group_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_group_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_group_stmt?: (ctx: Alter_group_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_index_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_index_stmt?: (ctx: Alter_index_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_index_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_index_stmt?: (ctx: Alter_index_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_language_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_language_stmt?: (ctx: Alter_language_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_language_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_language_stmt?: (ctx: Alter_language_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_large_object_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_large_object_stmt?: (ctx: Alter_large_object_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_large_object_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_large_object_stmt?: (ctx: Alter_large_object_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_materialize_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_materialize_view_stmt?: (ctx: Alter_materialize_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_materialize_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_materialize_view_stmt?: (ctx: Alter_materialize_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_operator_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_operator_stmt?: (ctx: Alter_operator_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_operator_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_operator_stmt?: (ctx: Alter_operator_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_operator_class_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_operator_class_stmt?: (ctx: Alter_operator_class_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_operator_class_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_operator_class_stmt?: (ctx: Alter_operator_class_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_operator_family_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_operator_family_stmt?: (ctx: Alter_operator_family_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_operator_family_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_operator_family_stmt?: (ctx: Alter_operator_family_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_policy_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_policy_stmt?: (ctx: Alter_policy_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_policy_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_policy_stmt?: (ctx: Alter_policy_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_publication_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_publication_stmt?: (ctx: Alter_publication_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_publication_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_publication_stmt?: (ctx: Alter_publication_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_role_options`.
	 * @param ctx the parse tree
	 */
	enterAlter_role_options?: (ctx: Alter_role_optionsContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_role_options`.
	 * @param ctx the parse tree
	 */
	exitAlter_role_options?: (ctx: Alter_role_optionsContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_role_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_role_stmt?: (ctx: Alter_role_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_role_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_role_stmt?: (ctx: Alter_role_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_rule_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_rule_stmt?: (ctx: Alter_rule_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_rule_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_rule_stmt?: (ctx: Alter_rule_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_schema_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_schema_stmt?: (ctx: Alter_schema_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_schema_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_schema_stmt?: (ctx: Alter_schema_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_sequence_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_sequence_stmt?: (ctx: Alter_sequence_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_sequence_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_sequence_stmt?: (ctx: Alter_sequence_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_server_options_list`.
	 * @param ctx the parse tree
	 */
	enterAlter_server_options_list?: (ctx: Alter_server_options_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_server_options_list`.
	 * @param ctx the parse tree
	 */
	exitAlter_server_options_list?: (ctx: Alter_server_options_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_server_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_server_stmt?: (ctx: Alter_server_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_server_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_server_stmt?: (ctx: Alter_server_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_statistics_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_statistics_stmt?: (ctx: Alter_statistics_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_statistics_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_statistics_stmt?: (ctx: Alter_statistics_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_subscription_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_subscription_stmt?: (ctx: Alter_subscription_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_subscription_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_subscription_stmt?: (ctx: Alter_subscription_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_system_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_system_stmt?: (ctx: Alter_system_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_system_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_system_stmt?: (ctx: Alter_system_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_table_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_table_stmt?: (ctx: Alter_table_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_table_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_table_stmt?: (ctx: Alter_table_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_tablespace_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_tablespace_stmt?: (ctx: Alter_tablespace_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_tablespace_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_tablespace_stmt?: (ctx: Alter_tablespace_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_text_search_config_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_text_search_config_stmt?: (ctx: Alter_text_search_config_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_text_search_config_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_text_search_config_stmt?: (ctx: Alter_text_search_config_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_text_search_dict_stmt?: (ctx: Alter_text_search_dict_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_text_search_dict_stmt?: (ctx: Alter_text_search_dict_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_text_search_parser_stmt?: (ctx: Alter_text_search_parser_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_text_search_parser_stmt?: (ctx: Alter_text_search_parser_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_text_search_template_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_text_search_template_stmt?: (ctx: Alter_text_search_template_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_text_search_template_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_text_search_template_stmt?: (ctx: Alter_text_search_template_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_trigger_stmt?: (ctx: Alter_trigger_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_trigger_stmt?: (ctx: Alter_trigger_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_type_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_type_stmt?: (ctx: Alter_type_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_type_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_type_stmt?: (ctx: Alter_type_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_user_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_user_stmt?: (ctx: Alter_user_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_user_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_user_stmt?: (ctx: Alter_user_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_user_mapping_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_user_mapping_stmt?: (ctx: Alter_user_mapping_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_user_mapping_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_user_mapping_stmt?: (ctx: Alter_user_mapping_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alter_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterAlter_view_stmt?: (ctx: Alter_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alter_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitAlter_view_stmt?: (ctx: Alter_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.analyze_stmt`.
	 * @param ctx the parse tree
	 */
	enterAnalyze_stmt?: (ctx: Analyze_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.analyze_stmt`.
	 * @param ctx the parse tree
	 */
	exitAnalyze_stmt?: (ctx: Analyze_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.close_stmt`.
	 * @param ctx the parse tree
	 */
	enterClose_stmt?: (ctx: Close_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.close_stmt`.
	 * @param ctx the parse tree
	 */
	exitClose_stmt?: (ctx: Close_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.cluster_stmt`.
	 * @param ctx the parse tree
	 */
	enterCluster_stmt?: (ctx: Cluster_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.cluster_stmt`.
	 * @param ctx the parse tree
	 */
	exitCluster_stmt?: (ctx: Cluster_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.comment_stmt`.
	 * @param ctx the parse tree
	 */
	enterComment_stmt?: (ctx: Comment_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.comment_stmt`.
	 * @param ctx the parse tree
	 */
	exitComment_stmt?: (ctx: Comment_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.commit_stmt`.
	 * @param ctx the parse tree
	 */
	enterCommit_stmt?: (ctx: Commit_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.commit_stmt`.
	 * @param ctx the parse tree
	 */
	exitCommit_stmt?: (ctx: Commit_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.commit_prepared_stmt`.
	 * @param ctx the parse tree
	 */
	enterCommit_prepared_stmt?: (ctx: Commit_prepared_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.commit_prepared_stmt`.
	 * @param ctx the parse tree
	 */
	exitCommit_prepared_stmt?: (ctx: Commit_prepared_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.copy_stmt`.
	 * @param ctx the parse tree
	 */
	enterCopy_stmt?: (ctx: Copy_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.copy_stmt`.
	 * @param ctx the parse tree
	 */
	exitCopy_stmt?: (ctx: Copy_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_stmt?: (ctx: Create_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_stmt?: (ctx: Create_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_access_method_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_access_method_stmt?: (ctx: Create_access_method_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_access_method_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_access_method_stmt?: (ctx: Create_access_method_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_aggregate_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_aggregate_stmt?: (ctx: Create_aggregate_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_aggregate_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_aggregate_stmt?: (ctx: Create_aggregate_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_cast_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_cast_stmt?: (ctx: Create_cast_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_cast_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_cast_stmt?: (ctx: Create_cast_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_collation_opt`.
	 * @param ctx the parse tree
	 */
	enterCreate_collation_opt?: (ctx: Create_collation_optContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_collation_opt`.
	 * @param ctx the parse tree
	 */
	exitCreate_collation_opt?: (ctx: Create_collation_optContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_collation_opt_list`.
	 * @param ctx the parse tree
	 */
	enterCreate_collation_opt_list?: (ctx: Create_collation_opt_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_collation_opt_list`.
	 * @param ctx the parse tree
	 */
	exitCreate_collation_opt_list?: (ctx: Create_collation_opt_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_collation_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_collation_stmt?: (ctx: Create_collation_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_collation_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_collation_stmt?: (ctx: Create_collation_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_conversion_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_conversion_stmt?: (ctx: Create_conversion_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_conversion_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_conversion_stmt?: (ctx: Create_conversion_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_database_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_database_stmt?: (ctx: Create_database_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_database_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_database_stmt?: (ctx: Create_database_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.domain_constraint`.
	 * @param ctx the parse tree
	 */
	enterDomain_constraint?: (ctx: Domain_constraintContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.domain_constraint`.
	 * @param ctx the parse tree
	 */
	exitDomain_constraint?: (ctx: Domain_constraintContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_domain_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_domain_stmt?: (ctx: Create_domain_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_domain_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_domain_stmt?: (ctx: Create_domain_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_event_trigger_cond`.
	 * @param ctx the parse tree
	 */
	enterCreate_event_trigger_cond?: (ctx: Create_event_trigger_condContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_event_trigger_cond`.
	 * @param ctx the parse tree
	 */
	exitCreate_event_trigger_cond?: (ctx: Create_event_trigger_condContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_event_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_event_trigger_stmt?: (ctx: Create_event_trigger_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_event_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_event_trigger_stmt?: (ctx: Create_event_trigger_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_foreign_data_options`.
	 * @param ctx the parse tree
	 */
	enterCreate_foreign_data_options?: (ctx: Create_foreign_data_optionsContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_foreign_data_options`.
	 * @param ctx the parse tree
	 */
	exitCreate_foreign_data_options?: (ctx: Create_foreign_data_optionsContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_foreign_data_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_foreign_data_stmt?: (ctx: Create_foreign_data_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_foreign_data_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_foreign_data_stmt?: (ctx: Create_foreign_data_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_foreign_table_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_foreign_table_stmt?: (ctx: Create_foreign_table_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_foreign_table_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_foreign_table_stmt?: (ctx: Create_foreign_table_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_function_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_function_stmt?: (ctx: Create_function_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_function_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_function_stmt?: (ctx: Create_function_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_group_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_group_stmt?: (ctx: Create_group_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_group_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_group_stmt?: (ctx: Create_group_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_index_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_index_stmt?: (ctx: Create_index_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_index_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_index_stmt?: (ctx: Create_index_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_language_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_language_stmt?: (ctx: Create_language_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_language_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_language_stmt?: (ctx: Create_language_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_materialized_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_materialized_view_stmt?: (ctx: Create_materialized_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_materialized_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_materialized_view_stmt?: (ctx: Create_materialized_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_operator_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_operator_stmt?: (ctx: Create_operator_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_operator_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_operator_stmt?: (ctx: Create_operator_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_operator_class_opt`.
	 * @param ctx the parse tree
	 */
	enterCreate_operator_class_opt?: (ctx: Create_operator_class_optContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_operator_class_opt`.
	 * @param ctx the parse tree
	 */
	exitCreate_operator_class_opt?: (ctx: Create_operator_class_optContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_operator_class_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_operator_class_stmt?: (ctx: Create_operator_class_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_operator_class_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_operator_class_stmt?: (ctx: Create_operator_class_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_operator_family_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_operator_family_stmt?: (ctx: Create_operator_family_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_operator_family_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_operator_family_stmt?: (ctx: Create_operator_family_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_policy_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_policy_stmt?: (ctx: Create_policy_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_policy_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_policy_stmt?: (ctx: Create_policy_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_role_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_role_stmt?: (ctx: Create_role_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_role_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_role_stmt?: (ctx: Create_role_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_rule_event`.
	 * @param ctx the parse tree
	 */
	enterCreate_rule_event?: (ctx: Create_rule_eventContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_rule_event`.
	 * @param ctx the parse tree
	 */
	exitCreate_rule_event?: (ctx: Create_rule_eventContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_rule_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_rule_stmt?: (ctx: Create_rule_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_rule_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_rule_stmt?: (ctx: Create_rule_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_schema_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_schema_stmt?: (ctx: Create_schema_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_schema_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_schema_stmt?: (ctx: Create_schema_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_sequence_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_sequence_stmt?: (ctx: Create_sequence_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_sequence_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_sequence_stmt?: (ctx: Create_sequence_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_server_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_server_stmt?: (ctx: Create_server_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_server_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_server_stmt?: (ctx: Create_server_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_statistics_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_statistics_stmt?: (ctx: Create_statistics_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_statistics_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_statistics_stmt?: (ctx: Create_statistics_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_subscription_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_subscription_stmt?: (ctx: Create_subscription_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_subscription_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_subscription_stmt?: (ctx: Create_subscription_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_table_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_table_stmt?: (ctx: Create_table_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_table_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_table_stmt?: (ctx: Create_table_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_table_as_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_table_as_stmt?: (ctx: Create_table_as_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_table_as_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_table_as_stmt?: (ctx: Create_table_as_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_tablespace_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_tablespace_stmt?: (ctx: Create_tablespace_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_tablespace_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_tablespace_stmt?: (ctx: Create_tablespace_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_text_search_config_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_text_search_config_stmt?: (ctx: Create_text_search_config_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_text_search_config_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_text_search_config_stmt?: (ctx: Create_text_search_config_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_text_search_dict_stmt?: (ctx: Create_text_search_dict_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_text_search_dict_stmt?: (ctx: Create_text_search_dict_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_text_search_parser_stmt?: (ctx: Create_text_search_parser_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_text_search_parser_stmt?: (ctx: Create_text_search_parser_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_text_search_template_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_text_search_template_stmt?: (ctx: Create_text_search_template_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_text_search_template_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_text_search_template_stmt?: (ctx: Create_text_search_template_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_transform_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_transform_stmt?: (ctx: Create_transform_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_transform_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_transform_stmt?: (ctx: Create_transform_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_trigger_stmt?: (ctx: Create_trigger_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_trigger_stmt?: (ctx: Create_trigger_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_type_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_type_stmt?: (ctx: Create_type_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_type_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_type_stmt?: (ctx: Create_type_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_user_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_user_stmt?: (ctx: Create_user_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_user_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_user_stmt?: (ctx: Create_user_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_user_mapping_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_user_mapping_stmt?: (ctx: Create_user_mapping_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_user_mapping_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_user_mapping_stmt?: (ctx: Create_user_mapping_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.create_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterCreate_view_stmt?: (ctx: Create_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.create_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitCreate_view_stmt?: (ctx: Create_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.deallocate_stmt`.
	 * @param ctx the parse tree
	 */
	enterDeallocate_stmt?: (ctx: Deallocate_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.deallocate_stmt`.
	 * @param ctx the parse tree
	 */
	exitDeallocate_stmt?: (ctx: Deallocate_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.declare_stmt`.
	 * @param ctx the parse tree
	 */
	enterDeclare_stmt?: (ctx: Declare_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.declare_stmt`.
	 * @param ctx the parse tree
	 */
	exitDeclare_stmt?: (ctx: Declare_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.delete_stmt`.
	 * @param ctx the parse tree
	 */
	enterDelete_stmt?: (ctx: Delete_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.delete_stmt`.
	 * @param ctx the parse tree
	 */
	exitDelete_stmt?: (ctx: Delete_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.discard_stmt`.
	 * @param ctx the parse tree
	 */
	enterDiscard_stmt?: (ctx: Discard_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.discard_stmt`.
	 * @param ctx the parse tree
	 */
	exitDiscard_stmt?: (ctx: Discard_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_stmt?: (ctx: Drop_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_stmt?: (ctx: Drop_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_access_method_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_access_method_stmt?: (ctx: Drop_access_method_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_access_method_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_access_method_stmt?: (ctx: Drop_access_method_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_aggregate_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_aggregate_stmt?: (ctx: Drop_aggregate_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_aggregate_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_aggregate_stmt?: (ctx: Drop_aggregate_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_cast_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_cast_stmt?: (ctx: Drop_cast_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_cast_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_cast_stmt?: (ctx: Drop_cast_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_collation_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_collation_stmt?: (ctx: Drop_collation_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_collation_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_collation_stmt?: (ctx: Drop_collation_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_conversion_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_conversion_stmt?: (ctx: Drop_conversion_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_conversion_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_conversion_stmt?: (ctx: Drop_conversion_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_database_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_database_stmt?: (ctx: Drop_database_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_database_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_database_stmt?: (ctx: Drop_database_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_domain_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_domain_stmt?: (ctx: Drop_domain_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_domain_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_domain_stmt?: (ctx: Drop_domain_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_event_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_event_trigger_stmt?: (ctx: Drop_event_trigger_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_event_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_event_trigger_stmt?: (ctx: Drop_event_trigger_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_extension_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_extension_stmt?: (ctx: Drop_extension_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_extension_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_extension_stmt?: (ctx: Drop_extension_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_foreign_data_wrapper_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_foreign_data_wrapper_stmt?: (ctx: Drop_foreign_data_wrapper_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_foreign_data_wrapper_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_foreign_data_wrapper_stmt?: (ctx: Drop_foreign_data_wrapper_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_foreign_table_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_foreign_table_stmt?: (ctx: Drop_foreign_table_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_foreign_table_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_foreign_table_stmt?: (ctx: Drop_foreign_table_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_function_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_function_stmt?: (ctx: Drop_function_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_function_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_function_stmt?: (ctx: Drop_function_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_group_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_group_stmt?: (ctx: Drop_group_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_group_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_group_stmt?: (ctx: Drop_group_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_index_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_index_stmt?: (ctx: Drop_index_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_index_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_index_stmt?: (ctx: Drop_index_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_language_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_language_stmt?: (ctx: Drop_language_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_language_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_language_stmt?: (ctx: Drop_language_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_materialized_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_materialized_view_stmt?: (ctx: Drop_materialized_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_materialized_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_materialized_view_stmt?: (ctx: Drop_materialized_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_operator_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_operator_stmt?: (ctx: Drop_operator_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_operator_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_operator_stmt?: (ctx: Drop_operator_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_operator_class_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_operator_class_stmt?: (ctx: Drop_operator_class_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_operator_class_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_operator_class_stmt?: (ctx: Drop_operator_class_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_operator_family_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_operator_family_stmt?: (ctx: Drop_operator_family_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_operator_family_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_operator_family_stmt?: (ctx: Drop_operator_family_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_owned_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_owned_stmt?: (ctx: Drop_owned_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_owned_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_owned_stmt?: (ctx: Drop_owned_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_policy_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_policy_stmt?: (ctx: Drop_policy_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_policy_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_policy_stmt?: (ctx: Drop_policy_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_publication_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_publication_stmt?: (ctx: Drop_publication_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_publication_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_publication_stmt?: (ctx: Drop_publication_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_role_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_role_stmt?: (ctx: Drop_role_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_role_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_role_stmt?: (ctx: Drop_role_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_rule_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_rule_stmt?: (ctx: Drop_rule_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_rule_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_rule_stmt?: (ctx: Drop_rule_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_schema_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_schema_stmt?: (ctx: Drop_schema_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_schema_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_schema_stmt?: (ctx: Drop_schema_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_sequence_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_sequence_stmt?: (ctx: Drop_sequence_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_sequence_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_sequence_stmt?: (ctx: Drop_sequence_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_server_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_server_stmt?: (ctx: Drop_server_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_server_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_server_stmt?: (ctx: Drop_server_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_statistics_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_statistics_stmt?: (ctx: Drop_statistics_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_statistics_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_statistics_stmt?: (ctx: Drop_statistics_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_subscription_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_subscription_stmt?: (ctx: Drop_subscription_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_subscription_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_subscription_stmt?: (ctx: Drop_subscription_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_table_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_table_stmt?: (ctx: Drop_table_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_table_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_table_stmt?: (ctx: Drop_table_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_tablespace_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_tablespace_stmt?: (ctx: Drop_tablespace_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_tablespace_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_tablespace_stmt?: (ctx: Drop_tablespace_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_text_search_config_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_text_search_config_stmt?: (ctx: Drop_text_search_config_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_text_search_config_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_text_search_config_stmt?: (ctx: Drop_text_search_config_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_text_search_dict_stmt?: (ctx: Drop_text_search_dict_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_text_search_dict_stmt?: (ctx: Drop_text_search_dict_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_text_search_parser_stmt?: (ctx: Drop_text_search_parser_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_text_search_parser_stmt?: (ctx: Drop_text_search_parser_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_text_search_template_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_text_search_template_stmt?: (ctx: Drop_text_search_template_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_text_search_template_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_text_search_template_stmt?: (ctx: Drop_text_search_template_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_transform_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_transform_stmt?: (ctx: Drop_transform_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_transform_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_transform_stmt?: (ctx: Drop_transform_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_trigger_stmt?: (ctx: Drop_trigger_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_trigger_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_trigger_stmt?: (ctx: Drop_trigger_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_type_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_type_stmt?: (ctx: Drop_type_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_type_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_type_stmt?: (ctx: Drop_type_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_user_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_user_stmt?: (ctx: Drop_user_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_user_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_user_stmt?: (ctx: Drop_user_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_user_mapping_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_user_mapping_stmt?: (ctx: Drop_user_mapping_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_user_mapping_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_user_mapping_stmt?: (ctx: Drop_user_mapping_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.drop_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterDrop_view_stmt?: (ctx: Drop_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.drop_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitDrop_view_stmt?: (ctx: Drop_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.execute_stmt`.
	 * @param ctx the parse tree
	 */
	enterExecute_stmt?: (ctx: Execute_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.execute_stmt`.
	 * @param ctx the parse tree
	 */
	exitExecute_stmt?: (ctx: Execute_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.explain_stmt`.
	 * @param ctx the parse tree
	 */
	enterExplain_stmt?: (ctx: Explain_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.explain_stmt`.
	 * @param ctx the parse tree
	 */
	exitExplain_stmt?: (ctx: Explain_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.fetch_stmt`.
	 * @param ctx the parse tree
	 */
	enterFetch_stmt?: (ctx: Fetch_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.fetch_stmt`.
	 * @param ctx the parse tree
	 */
	exitFetch_stmt?: (ctx: Fetch_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.grant_stmt`.
	 * @param ctx the parse tree
	 */
	enterGrant_stmt?: (ctx: Grant_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.grant_stmt`.
	 * @param ctx the parse tree
	 */
	exitGrant_stmt?: (ctx: Grant_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.import_foreign_schema_stmt`.
	 * @param ctx the parse tree
	 */
	enterImport_foreign_schema_stmt?: (ctx: Import_foreign_schema_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.import_foreign_schema_stmt`.
	 * @param ctx the parse tree
	 */
	exitImport_foreign_schema_stmt?: (ctx: Import_foreign_schema_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.insert_stmt`.
	 * @param ctx the parse tree
	 */
	enterInsert_stmt?: (ctx: Insert_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.insert_stmt`.
	 * @param ctx the parse tree
	 */
	exitInsert_stmt?: (ctx: Insert_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.listen_stmt`.
	 * @param ctx the parse tree
	 */
	enterListen_stmt?: (ctx: Listen_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.listen_stmt`.
	 * @param ctx the parse tree
	 */
	exitListen_stmt?: (ctx: Listen_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.load_stmt`.
	 * @param ctx the parse tree
	 */
	enterLoad_stmt?: (ctx: Load_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.load_stmt`.
	 * @param ctx the parse tree
	 */
	exitLoad_stmt?: (ctx: Load_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.lock_stmt`.
	 * @param ctx the parse tree
	 */
	enterLock_stmt?: (ctx: Lock_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.lock_stmt`.
	 * @param ctx the parse tree
	 */
	exitLock_stmt?: (ctx: Lock_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.move_stmt`.
	 * @param ctx the parse tree
	 */
	enterMove_stmt?: (ctx: Move_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.move_stmt`.
	 * @param ctx the parse tree
	 */
	exitMove_stmt?: (ctx: Move_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.notify_stmt`.
	 * @param ctx the parse tree
	 */
	enterNotify_stmt?: (ctx: Notify_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.notify_stmt`.
	 * @param ctx the parse tree
	 */
	exitNotify_stmt?: (ctx: Notify_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.prepare_stmt`.
	 * @param ctx the parse tree
	 */
	enterPrepare_stmt?: (ctx: Prepare_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.prepare_stmt`.
	 * @param ctx the parse tree
	 */
	exitPrepare_stmt?: (ctx: Prepare_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.prepare_transaction_stmt`.
	 * @param ctx the parse tree
	 */
	enterPrepare_transaction_stmt?: (ctx: Prepare_transaction_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.prepare_transaction_stmt`.
	 * @param ctx the parse tree
	 */
	exitPrepare_transaction_stmt?: (ctx: Prepare_transaction_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.reassign_owned_stmt`.
	 * @param ctx the parse tree
	 */
	enterReassign_owned_stmt?: (ctx: Reassign_owned_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.reassign_owned_stmt`.
	 * @param ctx the parse tree
	 */
	exitReassign_owned_stmt?: (ctx: Reassign_owned_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.refresh_materialized_view_stmt`.
	 * @param ctx the parse tree
	 */
	enterRefresh_materialized_view_stmt?: (ctx: Refresh_materialized_view_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.refresh_materialized_view_stmt`.
	 * @param ctx the parse tree
	 */
	exitRefresh_materialized_view_stmt?: (ctx: Refresh_materialized_view_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.reindex_stmt`.
	 * @param ctx the parse tree
	 */
	enterReindex_stmt?: (ctx: Reindex_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.reindex_stmt`.
	 * @param ctx the parse tree
	 */
	exitReindex_stmt?: (ctx: Reindex_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.release_savepoint_stmt`.
	 * @param ctx the parse tree
	 */
	enterRelease_savepoint_stmt?: (ctx: Release_savepoint_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.release_savepoint_stmt`.
	 * @param ctx the parse tree
	 */
	exitRelease_savepoint_stmt?: (ctx: Release_savepoint_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.reset_stmt`.
	 * @param ctx the parse tree
	 */
	enterReset_stmt?: (ctx: Reset_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.reset_stmt`.
	 * @param ctx the parse tree
	 */
	exitReset_stmt?: (ctx: Reset_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.revoke_stmt`.
	 * @param ctx the parse tree
	 */
	enterRevoke_stmt?: (ctx: Revoke_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.revoke_stmt`.
	 * @param ctx the parse tree
	 */
	exitRevoke_stmt?: (ctx: Revoke_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.rollback_stmt`.
	 * @param ctx the parse tree
	 */
	enterRollback_stmt?: (ctx: Rollback_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.rollback_stmt`.
	 * @param ctx the parse tree
	 */
	exitRollback_stmt?: (ctx: Rollback_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.rollback_prepared_stmt`.
	 * @param ctx the parse tree
	 */
	enterRollback_prepared_stmt?: (ctx: Rollback_prepared_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.rollback_prepared_stmt`.
	 * @param ctx the parse tree
	 */
	exitRollback_prepared_stmt?: (ctx: Rollback_prepared_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.rollback_to_savepoint_stmt`.
	 * @param ctx the parse tree
	 */
	enterRollback_to_savepoint_stmt?: (ctx: Rollback_to_savepoint_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.rollback_to_savepoint_stmt`.
	 * @param ctx the parse tree
	 */
	exitRollback_to_savepoint_stmt?: (ctx: Rollback_to_savepoint_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.savepoint_stmt`.
	 * @param ctx the parse tree
	 */
	enterSavepoint_stmt?: (ctx: Savepoint_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.savepoint_stmt`.
	 * @param ctx the parse tree
	 */
	exitSavepoint_stmt?: (ctx: Savepoint_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.security_label_stmt`.
	 * @param ctx the parse tree
	 */
	enterSecurity_label_stmt?: (ctx: Security_label_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.security_label_stmt`.
	 * @param ctx the parse tree
	 */
	exitSecurity_label_stmt?: (ctx: Security_label_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.select_stmt`.
	 * @param ctx the parse tree
	 */
	enterSelect_stmt?: (ctx: Select_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.select_stmt`.
	 * @param ctx the parse tree
	 */
	exitSelect_stmt?: (ctx: Select_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.select_into_stmt`.
	 * @param ctx the parse tree
	 */
	enterSelect_into_stmt?: (ctx: Select_into_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.select_into_stmt`.
	 * @param ctx the parse tree
	 */
	exitSelect_into_stmt?: (ctx: Select_into_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.with_clause`.
	 * @param ctx the parse tree
	 */
	enterWith_clause?: (ctx: With_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.with_clause`.
	 * @param ctx the parse tree
	 */
	exitWith_clause?: (ctx: With_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.with_expr`.
	 * @param ctx the parse tree
	 */
	enterWith_expr?: (ctx: With_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.with_expr`.
	 * @param ctx the parse tree
	 */
	exitWith_expr?: (ctx: With_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.set_stmt`.
	 * @param ctx the parse tree
	 */
	enterSet_stmt?: (ctx: Set_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.set_stmt`.
	 * @param ctx the parse tree
	 */
	exitSet_stmt?: (ctx: Set_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.set_constraints_stmt`.
	 * @param ctx the parse tree
	 */
	enterSet_constraints_stmt?: (ctx: Set_constraints_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.set_constraints_stmt`.
	 * @param ctx the parse tree
	 */
	exitSet_constraints_stmt?: (ctx: Set_constraints_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.set_role_stmt`.
	 * @param ctx the parse tree
	 */
	enterSet_role_stmt?: (ctx: Set_role_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.set_role_stmt`.
	 * @param ctx the parse tree
	 */
	exitSet_role_stmt?: (ctx: Set_role_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.set_session_authorization_stmt`.
	 * @param ctx the parse tree
	 */
	enterSet_session_authorization_stmt?: (ctx: Set_session_authorization_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.set_session_authorization_stmt`.
	 * @param ctx the parse tree
	 */
	exitSet_session_authorization_stmt?: (ctx: Set_session_authorization_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.transaction_mode`.
	 * @param ctx the parse tree
	 */
	enterTransaction_mode?: (ctx: Transaction_modeContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.transaction_mode`.
	 * @param ctx the parse tree
	 */
	exitTransaction_mode?: (ctx: Transaction_modeContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.transaction_mode_list`.
	 * @param ctx the parse tree
	 */
	enterTransaction_mode_list?: (ctx: Transaction_mode_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.transaction_mode_list`.
	 * @param ctx the parse tree
	 */
	exitTransaction_mode_list?: (ctx: Transaction_mode_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.set_transaction_stmt`.
	 * @param ctx the parse tree
	 */
	enterSet_transaction_stmt?: (ctx: Set_transaction_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.set_transaction_stmt`.
	 * @param ctx the parse tree
	 */
	exitSet_transaction_stmt?: (ctx: Set_transaction_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.show_stmt`.
	 * @param ctx the parse tree
	 */
	enterShow_stmt?: (ctx: Show_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.show_stmt`.
	 * @param ctx the parse tree
	 */
	exitShow_stmt?: (ctx: Show_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.truncate_stmt`.
	 * @param ctx the parse tree
	 */
	enterTruncate_stmt?: (ctx: Truncate_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.truncate_stmt`.
	 * @param ctx the parse tree
	 */
	exitTruncate_stmt?: (ctx: Truncate_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.unlisten_stmt`.
	 * @param ctx the parse tree
	 */
	enterUnlisten_stmt?: (ctx: Unlisten_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.unlisten_stmt`.
	 * @param ctx the parse tree
	 */
	exitUnlisten_stmt?: (ctx: Unlisten_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.update_stmt`.
	 * @param ctx the parse tree
	 */
	enterUpdate_stmt?: (ctx: Update_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.update_stmt`.
	 * @param ctx the parse tree
	 */
	exitUpdate_stmt?: (ctx: Update_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.vacuum_opt`.
	 * @param ctx the parse tree
	 */
	enterVacuum_opt?: (ctx: Vacuum_optContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.vacuum_opt`.
	 * @param ctx the parse tree
	 */
	exitVacuum_opt?: (ctx: Vacuum_optContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.vacuum_opt_list`.
	 * @param ctx the parse tree
	 */
	enterVacuum_opt_list?: (ctx: Vacuum_opt_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.vacuum_opt_list`.
	 * @param ctx the parse tree
	 */
	exitVacuum_opt_list?: (ctx: Vacuum_opt_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.vacuum_stmt`.
	 * @param ctx the parse tree
	 */
	enterVacuum_stmt?: (ctx: Vacuum_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.vacuum_stmt`.
	 * @param ctx the parse tree
	 */
	exitVacuum_stmt?: (ctx: Vacuum_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.values_stmt`.
	 * @param ctx the parse tree
	 */
	enterValues_stmt?: (ctx: Values_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.values_stmt`.
	 * @param ctx the parse tree
	 */
	exitValues_stmt?: (ctx: Values_stmtContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.selector_clause`.
	 * @param ctx the parse tree
	 */
	enterSelector_clause?: (ctx: Selector_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.selector_clause`.
	 * @param ctx the parse tree
	 */
	exitSelector_clause?: (ctx: Selector_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.from_clause`.
	 * @param ctx the parse tree
	 */
	enterFrom_clause?: (ctx: From_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.from_clause`.
	 * @param ctx the parse tree
	 */
	exitFrom_clause?: (ctx: From_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.where_clause`.
	 * @param ctx the parse tree
	 */
	enterWhere_clause?: (ctx: Where_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.where_clause`.
	 * @param ctx the parse tree
	 */
	exitWhere_clause?: (ctx: Where_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.group_by_clause`.
	 * @param ctx the parse tree
	 */
	enterGroup_by_clause?: (ctx: Group_by_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.group_by_clause`.
	 * @param ctx the parse tree
	 */
	exitGroup_by_clause?: (ctx: Group_by_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.grouping_elem`.
	 * @param ctx the parse tree
	 */
	enterGrouping_elem?: (ctx: Grouping_elemContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.grouping_elem`.
	 * @param ctx the parse tree
	 */
	exitGrouping_elem?: (ctx: Grouping_elemContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.grouping_elem_list`.
	 * @param ctx the parse tree
	 */
	enterGrouping_elem_list?: (ctx: Grouping_elem_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.grouping_elem_list`.
	 * @param ctx the parse tree
	 */
	exitGrouping_elem_list?: (ctx: Grouping_elem_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.having_clause`.
	 * @param ctx the parse tree
	 */
	enterHaving_clause?: (ctx: Having_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.having_clause`.
	 * @param ctx the parse tree
	 */
	exitHaving_clause?: (ctx: Having_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.column_list`.
	 * @param ctx the parse tree
	 */
	enterColumn_list?: (ctx: Column_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.column_list`.
	 * @param ctx the parse tree
	 */
	exitColumn_list?: (ctx: Column_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.explain_parameter`.
	 * @param ctx the parse tree
	 */
	enterExplain_parameter?: (ctx: Explain_parameterContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.explain_parameter`.
	 * @param ctx the parse tree
	 */
	exitExplain_parameter?: (ctx: Explain_parameterContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.frame`.
	 * @param ctx the parse tree
	 */
	enterFrame?: (ctx: FrameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.frame`.
	 * @param ctx the parse tree
	 */
	exitFrame?: (ctx: FrameContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.frame_start`.
	 * @param ctx the parse tree
	 */
	enterFrame_start?: (ctx: Frame_startContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.frame_start`.
	 * @param ctx the parse tree
	 */
	exitFrame_start?: (ctx: Frame_startContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.frame_end`.
	 * @param ctx the parse tree
	 */
	enterFrame_end?: (ctx: Frame_endContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.frame_end`.
	 * @param ctx the parse tree
	 */
	exitFrame_end?: (ctx: Frame_endContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.frame_clause`.
	 * @param ctx the parse tree
	 */
	enterFrame_clause?: (ctx: Frame_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.frame_clause`.
	 * @param ctx the parse tree
	 */
	exitFrame_clause?: (ctx: Frame_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.window_definition`.
	 * @param ctx the parse tree
	 */
	enterWindow_definition?: (ctx: Window_definitionContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.window_definition`.
	 * @param ctx the parse tree
	 */
	exitWindow_definition?: (ctx: Window_definitionContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.window_clause`.
	 * @param ctx the parse tree
	 */
	enterWindow_clause?: (ctx: Window_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.window_clause`.
	 * @param ctx the parse tree
	 */
	exitWindow_clause?: (ctx: Window_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.combine_clause`.
	 * @param ctx the parse tree
	 */
	enterCombine_clause?: (ctx: Combine_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.combine_clause`.
	 * @param ctx the parse tree
	 */
	exitCombine_clause?: (ctx: Combine_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.order_by_clause`.
	 * @param ctx the parse tree
	 */
	enterOrder_by_clause?: (ctx: Order_by_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.order_by_clause`.
	 * @param ctx the parse tree
	 */
	exitOrder_by_clause?: (ctx: Order_by_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.order_by_item`.
	 * @param ctx the parse tree
	 */
	enterOrder_by_item?: (ctx: Order_by_itemContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.order_by_item`.
	 * @param ctx the parse tree
	 */
	exitOrder_by_item?: (ctx: Order_by_itemContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.limit_clause`.
	 * @param ctx the parse tree
	 */
	enterLimit_clause?: (ctx: Limit_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.limit_clause`.
	 * @param ctx the parse tree
	 */
	exitLimit_clause?: (ctx: Limit_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.offset_clause`.
	 * @param ctx the parse tree
	 */
	enterOffset_clause?: (ctx: Offset_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.offset_clause`.
	 * @param ctx the parse tree
	 */
	exitOffset_clause?: (ctx: Offset_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.fetch_clause`.
	 * @param ctx the parse tree
	 */
	enterFetch_clause?: (ctx: Fetch_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.fetch_clause`.
	 * @param ctx the parse tree
	 */
	exitFetch_clause?: (ctx: Fetch_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.for_clause`.
	 * @param ctx the parse tree
	 */
	enterFor_clause?: (ctx: For_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.for_clause`.
	 * @param ctx the parse tree
	 */
	exitFor_clause?: (ctx: For_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.updater_clause`.
	 * @param ctx the parse tree
	 */
	enterUpdater_clause?: (ctx: Updater_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.updater_clause`.
	 * @param ctx the parse tree
	 */
	exitUpdater_clause?: (ctx: Updater_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.updater_expr`.
	 * @param ctx the parse tree
	 */
	enterUpdater_expr?: (ctx: Updater_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.updater_expr`.
	 * @param ctx the parse tree
	 */
	exitUpdater_expr?: (ctx: Updater_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.returning_clause`.
	 * @param ctx the parse tree
	 */
	enterReturning_clause?: (ctx: Returning_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.returning_clause`.
	 * @param ctx the parse tree
	 */
	exitReturning_clause?: (ctx: Returning_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.bool_expr`.
	 * @param ctx the parse tree
	 */
	enterBool_expr?: (ctx: Bool_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.bool_expr`.
	 * @param ctx the parse tree
	 */
	exitBool_expr?: (ctx: Bool_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.case_expr`.
	 * @param ctx the parse tree
	 */
	enterCase_expr?: (ctx: Case_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.case_expr`.
	 * @param ctx the parse tree
	 */
	exitCase_expr?: (ctx: Case_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.expr_list`.
	 * @param ctx the parse tree
	 */
	enterExpr_list?: (ctx: Expr_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.expr_list`.
	 * @param ctx the parse tree
	 */
	exitExpr_list?: (ctx: Expr_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.expr_list_list`.
	 * @param ctx the parse tree
	 */
	enterExpr_list_list?: (ctx: Expr_list_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.expr_list_list`.
	 * @param ctx the parse tree
	 */
	exitExpr_list_list?: (ctx: Expr_list_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.func_sig_arg`.
	 * @param ctx the parse tree
	 */
	enterFunc_sig_arg?: (ctx: Func_sig_argContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.func_sig_arg`.
	 * @param ctx the parse tree
	 */
	exitFunc_sig_arg?: (ctx: Func_sig_argContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.func_sig_arg_list`.
	 * @param ctx the parse tree
	 */
	enterFunc_sig_arg_list?: (ctx: Func_sig_arg_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.func_sig_arg_list`.
	 * @param ctx the parse tree
	 */
	exitFunc_sig_arg_list?: (ctx: Func_sig_arg_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.func_sig`.
	 * @param ctx the parse tree
	 */
	enterFunc_sig?: (ctx: Func_sigContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.func_sig`.
	 * @param ctx the parse tree
	 */
	exitFunc_sig?: (ctx: Func_sigContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.func_sig_list`.
	 * @param ctx the parse tree
	 */
	enterFunc_sig_list?: (ctx: Func_sig_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.func_sig_list`.
	 * @param ctx the parse tree
	 */
	exitFunc_sig_list?: (ctx: Func_sig_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.type_name`.
	 * @param ctx the parse tree
	 */
	enterType_name?: (ctx: Type_nameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.type_name`.
	 * @param ctx the parse tree
	 */
	exitType_name?: (ctx: Type_nameContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.timezone`.
	 * @param ctx the parse tree
	 */
	enterTimezone?: (ctx: TimezoneContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.timezone`.
	 * @param ctx the parse tree
	 */
	exitTimezone?: (ctx: TimezoneContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.oper`.
	 * @param ctx the parse tree
	 */
	enterOper?: (ctx: OperContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.oper`.
	 * @param ctx the parse tree
	 */
	exitOper?: (ctx: OperContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.aggregate`.
	 * @param ctx the parse tree
	 */
	enterAggregate?: (ctx: AggregateContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.aggregate`.
	 * @param ctx the parse tree
	 */
	exitAggregate?: (ctx: AggregateContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.name_`.
	 * @param ctx the parse tree
	 */
	enterName_?: (ctx: Name_Context) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.name_`.
	 * @param ctx the parse tree
	 */
	exitName_?: (ctx: Name_Context) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.name_list`.
	 * @param ctx the parse tree
	 */
	enterName_list?: (ctx: Name_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.name_list`.
	 * @param ctx the parse tree
	 */
	exitName_list?: (ctx: Name_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.identifier_list`.
	 * @param ctx the parse tree
	 */
	enterIdentifier_list?: (ctx: Identifier_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.identifier_list`.
	 * @param ctx the parse tree
	 */
	exitIdentifier_list?: (ctx: Identifier_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.option_expr`.
	 * @param ctx the parse tree
	 */
	enterOption_expr?: (ctx: Option_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.option_expr`.
	 * @param ctx the parse tree
	 */
	exitOption_expr?: (ctx: Option_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.option_list`.
	 * @param ctx the parse tree
	 */
	enterOption_list?: (ctx: Option_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.option_list`.
	 * @param ctx the parse tree
	 */
	exitOption_list?: (ctx: Option_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.table_name_`.
	 * @param ctx the parse tree
	 */
	enterTable_name_?: (ctx: Table_name_Context) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.table_name_`.
	 * @param ctx the parse tree
	 */
	exitTable_name_?: (ctx: Table_name_Context) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.data_type`.
	 * @param ctx the parse tree
	 */
	enterData_type?: (ctx: Data_typeContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.data_type`.
	 * @param ctx the parse tree
	 */
	exitData_type?: (ctx: Data_typeContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.data_type_list`.
	 * @param ctx the parse tree
	 */
	enterData_type_list?: (ctx: Data_type_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.data_type_list`.
	 * @param ctx the parse tree
	 */
	exitData_type_list?: (ctx: Data_type_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.index_method`.
	 * @param ctx the parse tree
	 */
	enterIndex_method?: (ctx: Index_methodContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.index_method`.
	 * @param ctx the parse tree
	 */
	exitIndex_method?: (ctx: Index_methodContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.func_name`.
	 * @param ctx the parse tree
	 */
	enterFunc_name?: (ctx: Func_nameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.func_name`.
	 * @param ctx the parse tree
	 */
	exitFunc_name?: (ctx: Func_nameContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.func_call`.
	 * @param ctx the parse tree
	 */
	enterFunc_call?: (ctx: Func_callContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.func_call`.
	 * @param ctx the parse tree
	 */
	exitFunc_call?: (ctx: Func_callContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.array_cons_expr`.
	 * @param ctx the parse tree
	 */
	enterArray_cons_expr?: (ctx: Array_cons_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.array_cons_expr`.
	 * @param ctx the parse tree
	 */
	exitArray_cons_expr?: (ctx: Array_cons_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.from_item`.
	 * @param ctx the parse tree
	 */
	enterFrom_item?: (ctx: From_itemContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.from_item`.
	 * @param ctx the parse tree
	 */
	exitFrom_item?: (ctx: From_itemContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.with_column_alias`.
	 * @param ctx the parse tree
	 */
	enterWith_column_alias?: (ctx: With_column_aliasContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.with_column_alias`.
	 * @param ctx the parse tree
	 */
	exitWith_column_alias?: (ctx: With_column_aliasContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.join_type`.
	 * @param ctx the parse tree
	 */
	enterJoin_type?: (ctx: Join_typeContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.join_type`.
	 * @param ctx the parse tree
	 */
	exitJoin_type?: (ctx: Join_typeContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.join_clause`.
	 * @param ctx the parse tree
	 */
	enterJoin_clause?: (ctx: Join_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.join_clause`.
	 * @param ctx the parse tree
	 */
	exitJoin_clause?: (ctx: Join_clauseContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.predicate`.
	 * @param ctx the parse tree
	 */
	enterPredicate?: (ctx: PredicateContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.predicate`.
	 * @param ctx the parse tree
	 */
	exitPredicate?: (ctx: PredicateContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.aggregate_signature`.
	 * @param ctx the parse tree
	 */
	enterAggregate_signature?: (ctx: Aggregate_signatureContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.aggregate_signature`.
	 * @param ctx the parse tree
	 */
	exitAggregate_signature?: (ctx: Aggregate_signatureContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.column_constraint`.
	 * @param ctx the parse tree
	 */
	enterColumn_constraint?: (ctx: Column_constraintContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.column_constraint`.
	 * @param ctx the parse tree
	 */
	exitColumn_constraint?: (ctx: Column_constraintContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.column_constraints`.
	 * @param ctx the parse tree
	 */
	enterColumn_constraints?: (ctx: Column_constraintsContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.column_constraints`.
	 * @param ctx the parse tree
	 */
	exitColumn_constraints?: (ctx: Column_constraintsContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.index_parameters`.
	 * @param ctx the parse tree
	 */
	enterIndex_parameters?: (ctx: Index_parametersContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.index_parameters`.
	 * @param ctx the parse tree
	 */
	exitIndex_parameters?: (ctx: Index_parametersContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.exclude_element`.
	 * @param ctx the parse tree
	 */
	enterExclude_element?: (ctx: Exclude_elementContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.exclude_element`.
	 * @param ctx the parse tree
	 */
	exitExclude_element?: (ctx: Exclude_elementContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.table_constraint`.
	 * @param ctx the parse tree
	 */
	enterTable_constraint?: (ctx: Table_constraintContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.table_constraint`.
	 * @param ctx the parse tree
	 */
	exitTable_constraint?: (ctx: Table_constraintContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.role_name`.
	 * @param ctx the parse tree
	 */
	enterRole_name?: (ctx: Role_nameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.role_name`.
	 * @param ctx the parse tree
	 */
	exitRole_name?: (ctx: Role_nameContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.role_name_list`.
	 * @param ctx the parse tree
	 */
	enterRole_name_list?: (ctx: Role_name_listContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.role_name_list`.
	 * @param ctx the parse tree
	 */
	exitRole_name_list?: (ctx: Role_name_listContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.param_value`.
	 * @param ctx the parse tree
	 */
	enterParam_value?: (ctx: Param_valueContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.param_value`.
	 * @param ctx the parse tree
	 */
	exitParam_value?: (ctx: Param_valueContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.non_reserved_keyword`.
	 * @param ctx the parse tree
	 */
	enterNon_reserved_keyword?: (ctx: Non_reserved_keywordContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.non_reserved_keyword`.
	 * @param ctx the parse tree
	 */
	exitNon_reserved_keyword?: (ctx: Non_reserved_keywordContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.identifier`.
	 * @param ctx the parse tree
	 */
	enterIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.identifier`.
	 * @param ctx the parse tree
	 */
	exitIdentifier?: (ctx: IdentifierContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.todo_fill_in`.
	 * @param ctx the parse tree
	 */
	enterTodo_fill_in?: (ctx: Todo_fill_inContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.todo_fill_in`.
	 * @param ctx the parse tree
	 */
	exitTodo_fill_in?: (ctx: Todo_fill_inContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.todo_implement`.
	 * @param ctx the parse tree
	 */
	enterTodo_implement?: (ctx: Todo_implementContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.todo_implement`.
	 * @param ctx the parse tree
	 */
	exitTodo_implement?: (ctx: Todo_implementContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.correlation_name`.
	 * @param ctx the parse tree
	 */
	enterCorrelation_name?: (ctx: Correlation_nameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.correlation_name`.
	 * @param ctx the parse tree
	 */
	exitCorrelation_name?: (ctx: Correlation_nameContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.column_name`.
	 * @param ctx the parse tree
	 */
	enterColumn_name?: (ctx: Column_nameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.column_name`.
	 * @param ctx the parse tree
	 */
	exitColumn_name?: (ctx: Column_nameContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.alias`.
	 * @param ctx the parse tree
	 */
	enterAlias?: (ctx: AliasContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.alias`.
	 * @param ctx the parse tree
	 */
	exitAlias?: (ctx: AliasContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.column_alias`.
	 * @param ctx the parse tree
	 */
	enterColumn_alias?: (ctx: Column_aliasContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.column_alias`.
	 * @param ctx the parse tree
	 */
	exitColumn_alias?: (ctx: Column_aliasContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.column_definition`.
	 * @param ctx the parse tree
	 */
	enterColumn_definition?: (ctx: Column_definitionContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.column_definition`.
	 * @param ctx the parse tree
	 */
	exitColumn_definition?: (ctx: Column_definitionContext) => void;

	/**
	 * Enter a parse tree produced by `PostgreSQLParserParser.window_name`.
	 * @param ctx the parse tree
	 */
	enterWindow_name?: (ctx: Window_nameContext) => void;
	/**
	 * Exit a parse tree produced by `PostgreSQLParserParser.window_name`.
	 * @param ctx the parse tree
	 */
	exitWindow_name?: (ctx: Window_nameContext) => void;
}

