// Generated from ./src/grammar/PostgreSQLParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PostgreSQLParserParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface PostgreSQLParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.root`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRoot?: (ctx: RootContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStmt?: (ctx: StmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.abort_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbort_stmt?: (ctx: Abort_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_stmt?: (ctx: Alter_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_aggregate_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_aggregate_stmt?: (ctx: Alter_aggregate_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_collation_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_collation_stmt?: (ctx: Alter_collation_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_conversion_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_conversion_stmt?: (ctx: Alter_conversion_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_database_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_database_stmt?: (ctx: Alter_database_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_default_privileges_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_default_privileges_stmt?: (ctx: Alter_default_privileges_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_domain_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_domain_stmt?: (ctx: Alter_domain_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_event_trigger_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_event_trigger_stmt?: (ctx: Alter_event_trigger_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_extension_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_extension_stmt?: (ctx: Alter_extension_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_foreign_data_wrapper_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_foreign_data_wrapper_stmt?: (ctx: Alter_foreign_data_wrapper_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_action`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_foreign_table_action?: (ctx: Alter_foreign_table_actionContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_action_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_foreign_table_action_list?: (ctx: Alter_foreign_table_action_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_foreign_table_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_foreign_table_stmt?: (ctx: Alter_foreign_table_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_function_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_function_stmt?: (ctx: Alter_function_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_group_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_group_stmt?: (ctx: Alter_group_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_index_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_index_stmt?: (ctx: Alter_index_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_language_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_language_stmt?: (ctx: Alter_language_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_large_object_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_large_object_stmt?: (ctx: Alter_large_object_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_materialize_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_materialize_view_stmt?: (ctx: Alter_materialize_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_operator_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_operator_stmt?: (ctx: Alter_operator_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_operator_class_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_operator_class_stmt?: (ctx: Alter_operator_class_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_operator_family_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_operator_family_stmt?: (ctx: Alter_operator_family_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_policy_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_policy_stmt?: (ctx: Alter_policy_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_publication_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_publication_stmt?: (ctx: Alter_publication_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_role_options`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_role_options?: (ctx: Alter_role_optionsContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_role_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_role_stmt?: (ctx: Alter_role_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_rule_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_rule_stmt?: (ctx: Alter_rule_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_schema_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_schema_stmt?: (ctx: Alter_schema_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_sequence_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_sequence_stmt?: (ctx: Alter_sequence_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_server_options_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_server_options_list?: (ctx: Alter_server_options_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_server_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_server_stmt?: (ctx: Alter_server_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_statistics_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_statistics_stmt?: (ctx: Alter_statistics_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_subscription_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_subscription_stmt?: (ctx: Alter_subscription_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_system_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_system_stmt?: (ctx: Alter_system_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_table_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_table_stmt?: (ctx: Alter_table_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_tablespace_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_tablespace_stmt?: (ctx: Alter_tablespace_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_text_search_config_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_text_search_config_stmt?: (ctx: Alter_text_search_config_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_text_search_dict_stmt?: (ctx: Alter_text_search_dict_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_text_search_parser_stmt?: (ctx: Alter_text_search_parser_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_text_search_template_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_text_search_template_stmt?: (ctx: Alter_text_search_template_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_trigger_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_trigger_stmt?: (ctx: Alter_trigger_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_type_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_type_stmt?: (ctx: Alter_type_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_user_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_user_stmt?: (ctx: Alter_user_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_user_mapping_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_user_mapping_stmt?: (ctx: Alter_user_mapping_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alter_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlter_view_stmt?: (ctx: Alter_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.analyze_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnalyze_stmt?: (ctx: Analyze_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.close_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClose_stmt?: (ctx: Close_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.cluster_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCluster_stmt?: (ctx: Cluster_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.comment_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComment_stmt?: (ctx: Comment_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.commit_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCommit_stmt?: (ctx: Commit_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.commit_prepared_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCommit_prepared_stmt?: (ctx: Commit_prepared_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.copy_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCopy_stmt?: (ctx: Copy_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_stmt?: (ctx: Create_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_access_method_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_access_method_stmt?: (ctx: Create_access_method_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_aggregate_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_aggregate_stmt?: (ctx: Create_aggregate_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_cast_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_cast_stmt?: (ctx: Create_cast_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_collation_opt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_collation_opt?: (ctx: Create_collation_optContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_collation_opt_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_collation_opt_list?: (ctx: Create_collation_opt_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_collation_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_collation_stmt?: (ctx: Create_collation_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_conversion_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_conversion_stmt?: (ctx: Create_conversion_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_database_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_database_stmt?: (ctx: Create_database_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.domain_constraint`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDomain_constraint?: (ctx: Domain_constraintContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_domain_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_domain_stmt?: (ctx: Create_domain_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_event_trigger_cond`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_event_trigger_cond?: (ctx: Create_event_trigger_condContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_event_trigger_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_event_trigger_stmt?: (ctx: Create_event_trigger_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_foreign_data_options`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_foreign_data_options?: (ctx: Create_foreign_data_optionsContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_foreign_data_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_foreign_data_stmt?: (ctx: Create_foreign_data_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_foreign_table_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_foreign_table_stmt?: (ctx: Create_foreign_table_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_function_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_function_stmt?: (ctx: Create_function_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_group_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_group_stmt?: (ctx: Create_group_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_index_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_index_stmt?: (ctx: Create_index_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_language_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_language_stmt?: (ctx: Create_language_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_materialized_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_materialized_view_stmt?: (ctx: Create_materialized_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_operator_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_operator_stmt?: (ctx: Create_operator_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_operator_class_opt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_operator_class_opt?: (ctx: Create_operator_class_optContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_operator_class_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_operator_class_stmt?: (ctx: Create_operator_class_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_operator_family_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_operator_family_stmt?: (ctx: Create_operator_family_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_policy_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_policy_stmt?: (ctx: Create_policy_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_role_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_role_stmt?: (ctx: Create_role_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_rule_event`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_rule_event?: (ctx: Create_rule_eventContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_rule_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_rule_stmt?: (ctx: Create_rule_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_schema_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_schema_stmt?: (ctx: Create_schema_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_sequence_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_sequence_stmt?: (ctx: Create_sequence_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_server_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_server_stmt?: (ctx: Create_server_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_statistics_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_statistics_stmt?: (ctx: Create_statistics_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_subscription_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_subscription_stmt?: (ctx: Create_subscription_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_table_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_table_stmt?: (ctx: Create_table_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_table_as_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_table_as_stmt?: (ctx: Create_table_as_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_tablespace_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_tablespace_stmt?: (ctx: Create_tablespace_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_text_search_config_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_text_search_config_stmt?: (ctx: Create_text_search_config_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_text_search_dict_stmt?: (ctx: Create_text_search_dict_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_text_search_parser_stmt?: (ctx: Create_text_search_parser_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_text_search_template_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_text_search_template_stmt?: (ctx: Create_text_search_template_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_transform_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_transform_stmt?: (ctx: Create_transform_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_trigger_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_trigger_stmt?: (ctx: Create_trigger_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_type_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_type_stmt?: (ctx: Create_type_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_user_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_user_stmt?: (ctx: Create_user_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_user_mapping_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_user_mapping_stmt?: (ctx: Create_user_mapping_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.create_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCreate_view_stmt?: (ctx: Create_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.deallocate_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeallocate_stmt?: (ctx: Deallocate_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.declare_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclare_stmt?: (ctx: Declare_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.delete_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDelete_stmt?: (ctx: Delete_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.discard_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDiscard_stmt?: (ctx: Discard_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_stmt?: (ctx: Drop_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_access_method_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_access_method_stmt?: (ctx: Drop_access_method_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_aggregate_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_aggregate_stmt?: (ctx: Drop_aggregate_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_cast_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_cast_stmt?: (ctx: Drop_cast_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_collation_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_collation_stmt?: (ctx: Drop_collation_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_conversion_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_conversion_stmt?: (ctx: Drop_conversion_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_database_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_database_stmt?: (ctx: Drop_database_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_domain_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_domain_stmt?: (ctx: Drop_domain_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_event_trigger_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_event_trigger_stmt?: (ctx: Drop_event_trigger_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_extension_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_extension_stmt?: (ctx: Drop_extension_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_foreign_data_wrapper_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_foreign_data_wrapper_stmt?: (ctx: Drop_foreign_data_wrapper_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_foreign_table_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_foreign_table_stmt?: (ctx: Drop_foreign_table_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_function_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_function_stmt?: (ctx: Drop_function_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_group_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_group_stmt?: (ctx: Drop_group_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_index_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_index_stmt?: (ctx: Drop_index_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_language_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_language_stmt?: (ctx: Drop_language_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_materialized_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_materialized_view_stmt?: (ctx: Drop_materialized_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_operator_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_operator_stmt?: (ctx: Drop_operator_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_operator_class_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_operator_class_stmt?: (ctx: Drop_operator_class_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_operator_family_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_operator_family_stmt?: (ctx: Drop_operator_family_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_owned_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_owned_stmt?: (ctx: Drop_owned_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_policy_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_policy_stmt?: (ctx: Drop_policy_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_publication_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_publication_stmt?: (ctx: Drop_publication_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_role_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_role_stmt?: (ctx: Drop_role_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_rule_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_rule_stmt?: (ctx: Drop_rule_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_schema_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_schema_stmt?: (ctx: Drop_schema_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_sequence_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_sequence_stmt?: (ctx: Drop_sequence_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_server_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_server_stmt?: (ctx: Drop_server_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_statistics_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_statistics_stmt?: (ctx: Drop_statistics_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_subscription_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_subscription_stmt?: (ctx: Drop_subscription_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_table_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_table_stmt?: (ctx: Drop_table_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_tablespace_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_tablespace_stmt?: (ctx: Drop_tablespace_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_text_search_config_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_text_search_config_stmt?: (ctx: Drop_text_search_config_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_text_search_dict_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_text_search_dict_stmt?: (ctx: Drop_text_search_dict_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_text_search_parser_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_text_search_parser_stmt?: (ctx: Drop_text_search_parser_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_text_search_template_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_text_search_template_stmt?: (ctx: Drop_text_search_template_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_transform_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_transform_stmt?: (ctx: Drop_transform_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_trigger_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_trigger_stmt?: (ctx: Drop_trigger_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_type_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_type_stmt?: (ctx: Drop_type_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_user_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_user_stmt?: (ctx: Drop_user_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_user_mapping_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_user_mapping_stmt?: (ctx: Drop_user_mapping_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.drop_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDrop_view_stmt?: (ctx: Drop_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.execute_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExecute_stmt?: (ctx: Execute_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.explain_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExplain_stmt?: (ctx: Explain_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.fetch_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFetch_stmt?: (ctx: Fetch_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.grant_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGrant_stmt?: (ctx: Grant_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.import_foreign_schema_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImport_foreign_schema_stmt?: (ctx: Import_foreign_schema_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.insert_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInsert_stmt?: (ctx: Insert_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.listen_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitListen_stmt?: (ctx: Listen_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.load_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLoad_stmt?: (ctx: Load_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.lock_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLock_stmt?: (ctx: Lock_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.move_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMove_stmt?: (ctx: Move_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.notify_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNotify_stmt?: (ctx: Notify_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.prepare_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrepare_stmt?: (ctx: Prepare_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.prepare_transaction_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrepare_transaction_stmt?: (ctx: Prepare_transaction_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.reassign_owned_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReassign_owned_stmt?: (ctx: Reassign_owned_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.refresh_materialized_view_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRefresh_materialized_view_stmt?: (ctx: Refresh_materialized_view_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.reindex_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReindex_stmt?: (ctx: Reindex_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.release_savepoint_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelease_savepoint_stmt?: (ctx: Release_savepoint_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.reset_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReset_stmt?: (ctx: Reset_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.revoke_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRevoke_stmt?: (ctx: Revoke_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.rollback_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRollback_stmt?: (ctx: Rollback_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.rollback_prepared_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRollback_prepared_stmt?: (ctx: Rollback_prepared_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.rollback_to_savepoint_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRollback_to_savepoint_stmt?: (ctx: Rollback_to_savepoint_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.savepoint_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSavepoint_stmt?: (ctx: Savepoint_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.security_label_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSecurity_label_stmt?: (ctx: Security_label_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.select_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelect_stmt?: (ctx: Select_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.select_into_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelect_into_stmt?: (ctx: Select_into_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.with_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWith_clause?: (ctx: With_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.with_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWith_expr?: (ctx: With_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.set_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSet_stmt?: (ctx: Set_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.set_constraints_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSet_constraints_stmt?: (ctx: Set_constraints_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.set_role_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSet_role_stmt?: (ctx: Set_role_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.set_session_authorization_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSet_session_authorization_stmt?: (ctx: Set_session_authorization_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.transaction_mode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransaction_mode?: (ctx: Transaction_modeContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.transaction_mode_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransaction_mode_list?: (ctx: Transaction_mode_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.set_transaction_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSet_transaction_stmt?: (ctx: Set_transaction_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.show_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitShow_stmt?: (ctx: Show_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.truncate_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTruncate_stmt?: (ctx: Truncate_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.unlisten_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnlisten_stmt?: (ctx: Unlisten_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.update_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUpdate_stmt?: (ctx: Update_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.vacuum_opt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVacuum_opt?: (ctx: Vacuum_optContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.vacuum_opt_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVacuum_opt_list?: (ctx: Vacuum_opt_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.vacuum_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVacuum_stmt?: (ctx: Vacuum_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.values_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValues_stmt?: (ctx: Values_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.selector_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelector_clause?: (ctx: Selector_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.from_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFrom_clause?: (ctx: From_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.where_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhere_clause?: (ctx: Where_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.group_by_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGroup_by_clause?: (ctx: Group_by_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.grouping_elem`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGrouping_elem?: (ctx: Grouping_elemContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.grouping_elem_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGrouping_elem_list?: (ctx: Grouping_elem_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.having_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHaving_clause?: (ctx: Having_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.column_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn_list?: (ctx: Column_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.explain_parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExplain_parameter?: (ctx: Explain_parameterContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.frame`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFrame?: (ctx: FrameContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.frame_start`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFrame_start?: (ctx: Frame_startContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.frame_end`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFrame_end?: (ctx: Frame_endContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.frame_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFrame_clause?: (ctx: Frame_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.window_definition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWindow_definition?: (ctx: Window_definitionContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.window_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWindow_clause?: (ctx: Window_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.combine_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCombine_clause?: (ctx: Combine_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.order_by_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrder_by_clause?: (ctx: Order_by_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.order_by_item`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrder_by_item?: (ctx: Order_by_itemContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.limit_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLimit_clause?: (ctx: Limit_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.offset_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOffset_clause?: (ctx: Offset_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.fetch_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFetch_clause?: (ctx: Fetch_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.for_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFor_clause?: (ctx: For_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.updater_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUpdater_clause?: (ctx: Updater_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.updater_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUpdater_expr?: (ctx: Updater_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.returning_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturning_clause?: (ctx: Returning_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.bool_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBool_expr?: (ctx: Bool_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.case_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCase_expr?: (ctx: Case_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.expr_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr_list?: (ctx: Expr_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.expr_list_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr_list_list?: (ctx: Expr_list_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.func_sig_arg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_sig_arg?: (ctx: Func_sig_argContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.func_sig_arg_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_sig_arg_list?: (ctx: Func_sig_arg_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.func_sig`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_sig?: (ctx: Func_sigContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.func_sig_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_sig_list?: (ctx: Func_sig_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.type_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType_name?: (ctx: Type_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.timezone`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTimezone?: (ctx: TimezoneContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.oper`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOper?: (ctx: OperContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.aggregate`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregate?: (ctx: AggregateContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.name_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitName_?: (ctx: Name_Context) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.name_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitName_list?: (ctx: Name_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.identifier_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier_list?: (ctx: Identifier_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.option_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOption_expr?: (ctx: Option_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.option_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOption_list?: (ctx: Option_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.table_name_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTable_name_?: (ctx: Table_name_Context) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.data_type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitData_type?: (ctx: Data_typeContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.data_type_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitData_type_list?: (ctx: Data_type_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.index_method`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndex_method?: (ctx: Index_methodContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.func_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_name?: (ctx: Func_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.func_call`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_call?: (ctx: Func_callContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.array_cons_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray_cons_expr?: (ctx: Array_cons_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.from_item`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFrom_item?: (ctx: From_itemContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.with_column_alias`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWith_column_alias?: (ctx: With_column_aliasContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.join_type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJoin_type?: (ctx: Join_typeContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.join_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJoin_clause?: (ctx: Join_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.predicate`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPredicate?: (ctx: PredicateContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.aggregate_signature`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregate_signature?: (ctx: Aggregate_signatureContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.column_constraint`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn_constraint?: (ctx: Column_constraintContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.column_constraints`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn_constraints?: (ctx: Column_constraintsContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.index_parameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndex_parameters?: (ctx: Index_parametersContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.exclude_element`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExclude_element?: (ctx: Exclude_elementContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.table_constraint`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTable_constraint?: (ctx: Table_constraintContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.role_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRole_name?: (ctx: Role_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.role_name_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRole_name_list?: (ctx: Role_name_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.param_value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParam_value?: (ctx: Param_valueContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.non_reserved_keyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNon_reserved_keyword?: (ctx: Non_reserved_keywordContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.todo_fill_in`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTodo_fill_in?: (ctx: Todo_fill_inContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.todo_implement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTodo_implement?: (ctx: Todo_implementContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.correlation_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCorrelation_name?: (ctx: Correlation_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.column_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn_name?: (ctx: Column_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.alias`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlias?: (ctx: AliasContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.column_alias`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn_alias?: (ctx: Column_aliasContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.column_definition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitColumn_definition?: (ctx: Column_definitionContext) => Result;

	/**
	 * Visit a parse tree produced by `PostgreSQLParserParser.window_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWindow_name?: (ctx: Window_nameContext) => Result;
}

