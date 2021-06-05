import {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios-ts'; 

declare namespace Components {
  namespace Parameters {
    namespace AccessParam {
      export type Access = string;
    }
    namespace ActionParam {
      export type Action = string;
    }
    namespace AliasParam {
      /**
       * entity alias
       */
      export type Alias = string;
    }
    namespace Avatar {
      /**
       * avatar name
       */
      export type Avatar = string;
    }
    namespace ClientParam {
      export type Client = string;
    }
    namespace ColumnParam {
      /**
       * column names to project
       */
      export type Columns = string[];
    }
    namespace CountParam {
      /**
       * to process count
       * example:
       * true
       */
      export type Count = boolean;
    }
    namespace CronWorkflowNameParam {
      /**
       * Name of the workflow template
       */
      export type CronWorkflowName = string;
    }
    namespace DateFromParam {
      export type DateFrom = string;
    }
    namespace DateToParam {
      export type DateTo = string;
    }
    namespace EmailParam {
      /**
       * column names to project
       */
      export type Email = string;
    }
    namespace EndDateParam {
      export type EndDate = string;
    }
    namespace FilterParam {
      /**
       * filter string
       */
      export type Filter = string;
    }
    namespace FirstNameParam {
      /**
       * column names to project
       */
      export type FirstName = string;
    }
    namespace FirstParam {
      export type First = number; // int32
    }
    namespace FullParam {
      /**
       * column names to project
       */
      export type Full = boolean;
    }
    namespace GuidParamQuery {
      /**
       * entity id
       */
      export type Guid = string; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
    namespace IdParam {
      /**
       * entity id
       */
      export type Id = string; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
    namespace IgnoreCountParam {
      /**
       * column names to project
       */
      export type IgnoreCount = boolean;
    }
    namespace IgnoreGroupMetaParam {
      /**
       * column names to project
       */
      export type IgnoreGroupMeta = boolean;
    }
    namespace IgnoreRolesMetaParam {
      /**
       * column names to project
       */
      export type IgnoreRolesMeta = boolean;
    }
    namespace IpAddressParam {
      export type IpAddress = string;
    }
    namespace LastNameParam {
      /**
       * column names to project
       */
      export type LastName = string;
    }
    namespace LimitParam {
      /**
       * The numbers of items to return
       * example:
       * 10
       */
      export type Limit = number;
    }
    namespace MaxParam {
      export type Max = number; // int32
    }
    namespace OffsetParam {
      /**
       * Offset for Pagination
       * example:
       * 0
       */
      export type Offset = number;
    }
    namespace PodNameParam {
      /**
       * Name of the workflow pod
       */
      export type PodName = string;
    }
    namespace PodNameParamQuery {
      /**
       * Name of the workflow pod
       */
      export type PodName = string;
    }
    namespace PolicyIdParam {
      export type PolicyId = string;
    }
    namespace PreviewParam {
      /**
       * column names to project
       */
      export type Preview = boolean;
    }
    namespace QualifiedNameParam {
      export type QualifiedName = string;
    }
    namespace RealmParam {
      /**
       * realm
       */
      export type Realm = string;
    }
    namespace RelationParam {
      /**
       * column names to lookup
       */
      export type Relations = string[];
    }
    namespace ResourceParam {
      export type Resource = string;
    }
    namespace ResourceTypeParam {
      /**
       * k8s resource name
       */
      export type ResourceType = string;
    }
    namespace SearchParam {
      /**
       * column names to project
       */
      export type Search = string;
    }
    namespace SessionIdParam {
      /**
       * session id
       */
      export type SessionId = string; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
    namespace SortParam {
      /**
       * column names for sorting +/-
       * example:
       * created_at
       */
      export type Sort = string[];
    }
    namespace StartDateParam {
      export type StartDate = string;
    }
    namespace TenantParam {
      /**
       * tenant
       */
      export type Tenant = string;
    }
    namespace TenantQueryParam {
      /**
       * Tenant Alias / ID in Query Params
       */
      export type Tenant = string;
    }
    namespace TypeParam {
      export type Type = string[];
    }
    namespace UserParam {
      export type User = string;
    }
    namespace UserTypesParam {
      /**
       * user types to include
       */
      export type UserTypes = string[];
    }
    namespace UsernameParam {
      /**
       * column names to project
       */
      export type Username = string;
    }
    namespace VersionParam {
      /**
       * entity version
       */
      export type Version = string;
    }
    namespace WhereParam {
      /**
       * where string
       */
      export type Where = string;
    }
    namespace WorkflowNameParam {
      /**
       * Name of the workflow template
       */
      export type WorkflowName = string;
    }
    namespace WorkflowTemplateNameParam {
      /**
       * Name of the workflow template
       */
      export type WorkflowTemplateName = string;
    }
  }
  namespace Schemas {
    /**
     * AccessResult
     * 
     * example:
     * {
     *   "isFinal": true,
     *   "policy": {
     *     "allowExceptions": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "conditions": [
     *       {
     *         "type": "...",
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "type": "...",
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskPolicyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "dataMaskInfo": {},
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "dataMaskInfo": {},
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "denyExceptions": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "denyPolicyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "description": "...",
     *     "guid": "...",
     *     "id": 12345,
     *     "isAuditEnabled": true,
     *     "isDenyAllElse": true,
     *     "isEnabled": true,
     *     "name": "...",
     *     "options": {
     *       "property1": {},
     *       "property2": {}
     *     },
     *     "policyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "policyLabels": [
     *       "...",
     *       "..."
     *     ],
     *     "policyPriority": 12345,
     *     "policyType": 12345,
     *     "resourceSignature": "...",
     *     "resources": {
     *       "property1": {
     *         "isExcludes": true,
     *         "isRecursive": true,
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       "property2": {
     *         "isExcludes": true,
     *         "isRecursive": true,
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     },
     *     "rowFilterPolicyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "rowFilterInfo": {},
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "rowFilterInfo": {},
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "service": "...",
     *     "serviceType": "...",
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "validitySchedules": [
     *       {
     *         "endTime": "...",
     *         "recurrences": [
     *           {},
     *           {}
     *         ],
     *         "startTime": "...",
     *         "timeZone": "..."
     *       },
     *       {
     *         "endTime": "...",
     *         "recurrences": [
     *           {},
     *           {}
     *         ],
     *         "startTime": "...",
     *         "timeZone": "..."
     *       }
     *     ],
     *     "version": 12345,
     *     "zoneName": "..."
     *   },
     *   "result": 12345
     * }
     */
    export interface AccessResult {
      /**
       * 
       */
      isFinal?: boolean;
      policy?: RangerPolicy;
      /**
       * 
       */
      result?: number; // int32
    }
    export interface AccessToken {
      acr?: string;
      address?: AddressClaimSet;
      "allowed-origins"?: string[];
      at_hash?: string;
      auth_time?: number; // int64
      authorization?: AccessTokenAuthorization;
      azp?: string;
      birthdate?: string;
      c_hash?: string;
      category?: "INTERNAL" | "ACCESS" | "ID" | "ADMIN" | "USERINFO";
      claims_locales?: string;
      cnf?: AccessTokenCertConf;
      email?: string;
      email_verified?: boolean;
      exp?: number; // int64
      family_name?: string;
      gender?: string;
      given_name?: string;
      iat?: number; // int64
      iss?: string;
      jti?: string;
      locale?: string;
      middle_name?: string;
      name?: string;
      nbf?: number; // int64
      nickname?: string;
      nonce?: string;
      otherClaims?: {
        [name: string]: any;
      };
      phone_number?: string;
      phone_number_verified?: boolean;
      picture?: string;
      preferred_username?: string;
      profile?: string;
      realm_access?: AccessTokenAccess;
      s_hash?: string;
      scope?: string;
      session_state?: string;
      sub?: string;
      "trusted-certs"?: string[];
      typ?: string;
      updated_at?: number; // int64
      website?: string;
      zoneinfo?: string;
    }
    export interface AccessTokenAccess {
      roles?: string[];
      verify_caller?: boolean;
    }
    export interface AccessTokenAuthorization {
      permissions?: Permission[];
    }
    export interface AccessTokenCertConf {
      "x5t#S256"?: string;
    }
    export interface AddGroupsToRole {
      groups: string[];
    }
    export interface AddGroupsToUser {
      groups: string[];
    }
    export interface AddMembersToGroup {
      users: string[];
    }
    export interface AddUser {
      users?: NewUser[];
    }
    export interface AddUsersToRole {
      users: string[];
    }
    export interface AddressClaimSet {
      country?: string;
      formatted?: string;
      locality?: string;
      postal_code?: string;
      region?: string;
      street_address?: string;
    }
    export interface AdminEventRepresentation {
      authDetails?: AuthDetailsRepresentation;
      error?: string;
      operationType?: string;
      realmId?: string;
      representation?: string;
      resourcePath?: string;
      resourceType?: string;
      time?: number; // int64
    }
    export interface AuthDetailsRepresentation {
      clientId?: string;
      ipAddress?: string;
      realmId?: string;
      userId?: string;
    }
    export interface AuthenticationExecutionExportRepresentation {
      authenticator?: string;
      authenticatorConfig?: string;
      authenticatorFlow?: boolean;
      autheticatorFlow?: boolean;
      flowAlias?: string;
      priority?: number; // int32
      requirement?: string;
      userSetupAllowed?: boolean;
    }
    export interface AuthenticationExecutionInfoRepresentation {
      alias?: string;
      authenticationConfig?: string;
      authenticationFlow?: boolean;
      configurable?: boolean;
      displayName?: string;
      flowId?: string;
      id?: string;
      index?: number; // int32
      level?: number; // int32
      providerId?: string;
      requirement?: string;
      requirementChoices?: string[];
    }
    export interface AuthenticationExecutionRepresentation {
      authenticator?: string;
      authenticatorConfig?: string;
      authenticatorFlow?: boolean;
      autheticatorFlow?: boolean;
      flowId?: string;
      id?: string;
      parentFlow?: string;
      priority?: number; // int32
      requirement?: string;
    }
    export interface AuthenticationFlowRepresentation {
      alias?: string;
      authenticationExecutions?: AuthenticationExecutionExportRepresentation[];
      builtIn?: boolean;
      description?: string;
      id?: string;
      providerId?: string;
      topLevel?: boolean;
    }
    export interface AuthenticatorConfigInfoRepresentation {
      helpText?: string;
      name?: string;
      properties?: ConfigPropertyRepresentation[];
      providerId?: string;
    }
    export interface AuthenticatorConfigRepresentation {
      alias?: string;
      config?: {
        [name: string]: any;
      };
      id?: string;
    }
    export interface BulkUserRepresentation {
      ids?: string /* ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ */ [];
      method?: string;
      usernames?: string[];
    }
    export interface CertificateRepresentation {
      certificate?: string;
      kid?: string;
      privateKey?: string;
      publicKey?: string;
    }
    export interface ClientInitialAccessCreatePresentation {
      count?: number; // int32
      expiration?: number; // int32
    }
    export interface ClientInitialAccessPresentation {
      count?: number; // int32
      expiration?: number; // int32
      id?: string;
      remainingCount?: number; // int32
      timestamp?: number; // int32
      token?: string;
    }
    export interface ClientMappingsRepresentation {
      client?: string;
      id?: string;
      mappings?: RoleRepresentation[];
    }
    export interface ClientRepresentation {
      access?: {
        [name: string]: any;
      };
      adminUrl?: string;
      alwaysDisplayInConsole?: boolean;
      attributes?: {
        [name: string]: any;
      };
      authenticationFlowBindingOverrides?: {
        [name: string]: any;
      };
      authorizationServicesEnabled?: boolean;
      authorizationSettings?: ResourceServerRepresentation;
      baseUrl?: string;
      bearerOnly?: boolean;
      clientAuthenticatorType?: string;
      clientId?: string;
      consentRequired?: boolean;
      defaultClientScopes?: string[];
      defaultRoles?: string[];
      description?: string;
      directAccessGrantsEnabled?: boolean;
      enabled?: boolean;
      frontchannelLogout?: boolean;
      fullScopeAllowed?: boolean;
      id?: string;
      implicitFlowEnabled?: boolean;
      name?: string;
      nodeReRegistrationTimeout?: number; // int32
      notBefore?: number; // int32
      optionalClientScopes?: string[];
      origin?: string;
      protocol?: string;
      protocolMappers?: ProtocolMapperRepresentation[];
      publicClient?: boolean;
      redirectUris?: string[];
      registeredNodes?: {
        [name: string]: any;
      };
      registrationAccessToken?: string;
      rootUrl?: string;
      secret?: string;
      serviceAccountsEnabled?: boolean;
      standardFlowEnabled?: boolean;
      surrogateAuthRequired?: boolean;
      webOrigins?: string[];
    }
    export interface ClientScopeEvaluateResourceProtocolMapperEvaluationRepresentation {
      containerId?: string;
      containerName?: string;
      containerType?: string;
      mapperId?: string;
      mapperName?: string;
      protocolMapper?: string;
    }
    export interface ClientScopeRepresentation {
      attributes?: {
        [name: string]: any;
      };
      description?: string;
      id?: string;
      name?: string;
      protocol?: string;
      protocolMappers?: ProtocolMapperRepresentation[];
    }
    export interface ComponentExportRepresentation {
      config?: MultivaluedHashMap;
      id?: string;
      name?: string;
      providerId?: string;
      subComponents?: MultivaluedHashMap;
      subType?: string;
    }
    export interface ComponentRepresentation {
      config?: MultivaluedHashMap;
      id?: string;
      name?: string;
      parentId?: string;
      providerId?: string;
      providerType?: string;
      subType?: string;
    }
    export interface ComponentTypeRepresentation {
      helpText?: string;
      id?: string;
      metadata?: {
        [name: string]: any;
      };
      properties?: ConfigPropertyRepresentation[];
    }
    export interface ConfigPropertyRepresentation {
      defaultValue?: {
      };
      helpText?: string;
      label?: string;
      name?: string;
      options?: string[];
      secret?: boolean;
      type?: string;
    }
    export interface Connection {
      allowPreview?: boolean;
      allowQuery?: boolean;
      extra?: {
      };
      host: string;
      name: string; // ^[A-Za-z][a-zA-Z0-9_]+$
      ownerGroups?: string;
      ownerUsers?: string;
      port?: number;
      previewConfig?: {
      };
      queryConfig?: {
      };
    }
    export interface ConnectionArchive {
      deleteAssets?: boolean;
      deleteType?: string;
    }
    export interface ConnectionQuery {
      allowPreview?: boolean;
      allowQuery?: boolean;
      defaultCredentialId: string;
      previewConfig?: {
      };
      queryConfig?: {
      };
    }
    export interface ConnectionSetup {
      botQualifiedName?: string;
      connection: Connection;
      credential: Credential;
      job?: Job;
    }
    export interface ConnectionTest {
      host: string;
      port?: number;
    }
    export interface CreateAccessToken {
      category: string;
      name: string;
      roleId?: string;
      roleName?: string;
      validitySeconds?: number;
    }
    /**
     * New Alert
     */
    export interface CreateAlert {
      alert_type: string; // ^(slack|teams)$
      from?: string;
      replace?: {
      };
      template_alias: string;
      to: string;
      url: string;
    }
    /**
     * New Email
     */
    export interface CreateEmail {
      bcc?: string /* email */ [];
      body?: string;
      cc?: string /* email */ [];
      name?: string;
      replace?: {
      };
      subject: string;
      template?: string;
      to: string /* email */ [];
    }
    /**
     * New File
     */
    export interface CreateFile {
      excludePrefix?: boolean;
      file: string; // binary
      force?: boolean;
      name: string;
      prefix: string;
    }
    export interface CreateGroup {
      group: GroupRepresentation;
      users?: string[];
    }
    /**
     * New Image
     */
    export interface CreateImage {
      excludePrefix?: boolean;
      file: string; // binary
      force?: boolean;
      name: string;
      prefix: string;
    }
    /**
     * New Notification
     */
    export interface CreateNotification {
      action?: string;
      attributes?: {
        key?: string;
        value?: string;
      }[];
      body?: string;
      category: string;
      title?: string;
      userIds: string[];
    }
    /**
     * New Request
     */
    export interface CreateRequest {
      entities?: {
      }[];
      message?: string;
      terms?: {
      }[];
      type: "terms" | "description";
    }
    /**
     * New Sms
     */
    export interface CreateSms {
      Message: string;
      Recipient: string[];
      RecipientName?: string;
      callbackUrl?: string;
    }
    /**
     * New Template
     */
    export interface CreateTemplate {
      alias: string;
      description?: string;
      message_base64: string;
      message_title: string;
      name: string;
    }
    /**
     * New Tenant
     */
    export interface CreateTenant {
      email: string;
      firstname: string;
      isResetPassword?: boolean;
      lastname: string;
      password: string; // .*[0-9].*
      tenantAlias: string;
      tenantName: string;
      username: string;
    }
    /**
     * New UserAssetSuggestion
     */
    export interface CreateUserAssetSuggestion {
      asset: string;
      assetId: string;
      status: string;
      suggestionType: string;
      userId: string;
    }
    /**
     * New Credential
     */
    export interface Credential {
      authType?: string;
      connType?: string;
      connectionQualifiedName?: string; // [a-zA-Z0-9-]+/[a-zA-Z0-9-]+/[a-zA-Z0-9-]+
      description?: string;
      extra?: {
      };
      login?: string;
      name?: string; // ^[A-Za-z][a-zA-Z0-9_]+$
      password?: string;
    }
    export interface CredentialRepresentation {
      createdDate?: number; // int64
      credentialData?: string;
      id?: string;
      priority?: number; // int32
      secretData?: string;
      temporary?: boolean;
      type?: string;
      userLabel?: string;
      value?: string;
    }
    /**
     * Error Response
     */
    export interface Error {
      code: number;
      error: string;
      info: string;
    }
    export interface EvaluateAccess {
      entityGuid: string;
      typeName: string;
    }
    export interface EventRepresentation {
      clientId?: string;
      details?: {
        [name: string]: any;
      };
      error?: string;
      ipAddress?: string;
      realmId?: string;
      sessionId?: string;
      time?: number; // int64
      type?: string;
      userId?: string;
    }
    export interface FederatedIdentityRepresentation {
      identityProvider?: string;
      userId?: string;
      userName?: string;
    }
    export type GetAdminEvent = any;
    export interface GlobalRequestResult {
      failedRequests?: string[];
      successRequests?: string[];
    }
    /**
     * GrantRevokeRequest
     * 
     * example:
     * {
     *   "accessTypes": [
     *     "...",
     *     "..."
     *   ],
     *   "clientIPAddress": "...",
     *   "clientType": "...",
     *   "clusterName": "...",
     *   "delegateAdmin": true,
     *   "enableAudit": true,
     *   "grantor": "...",
     *   "grantorGroups": [
     *     "...",
     *     "..."
     *   ],
     *   "groups": [
     *     "...",
     *     "..."
     *   ],
     *   "isRecursive": true,
     *   "replaceExistingPermissions": true,
     *   "requestData": "...",
     *   "resource": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "roles": [
     *     "...",
     *     "..."
     *   ],
     *   "sessionId": "...",
     *   "users": [
     *     "...",
     *     "..."
     *   ],
     *   "zoneName": "..."
     * }
     */
    export interface GrantRevokeRequest {
      /**
       * 
       */
      accessTypes?: any[];
      /**
       * 
       */
      clientIPAddress?: any;
      /**
       * 
       */
      clientType?: any;
      /**
       * 
       */
      clusterName?: any;
      /**
       * 
       */
      delegateAdmin?: boolean;
      /**
       * 
       */
      enableAudit?: boolean;
      /**
       * 
       */
      grantor?: any;
      /**
       * 
       */
      grantorGroups?: any[];
      /**
       * 
       */
      groups?: any[];
      /**
       * 
       */
      isRecursive?: boolean;
      /**
       * 
       */
      replaceExistingPermissions?: boolean;
      /**
       * 
       */
      requestData?: any;
      /**
       * 
       */
      resource?: {
        [name: string]: any;
      };
      /**
       * 
       */
      roles?: any[];
      /**
       * 
       */
      sessionId?: any;
      /**
       * 
       */
      users?: any[];
      /**
       * 
       */
      zoneName?: any;
    }
    /**
     * GrantRevokeRoleRequest
     * 
     * example:
     * {
     *   "clientIPAddress": "...",
     *   "clientType": "...",
     *   "clusterName": "...",
     *   "grantOption": true,
     *   "grantor": "...",
     *   "grantorGroups": [
     *     "...",
     *     "..."
     *   ],
     *   "groups": [
     *     "...",
     *     "..."
     *   ],
     *   "requestData": "...",
     *   "roles": [
     *     "...",
     *     "..."
     *   ],
     *   "sessionId": "...",
     *   "targetRoles": [
     *     "...",
     *     "..."
     *   ],
     *   "users": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface GrantRevokeRoleRequest {
      /**
       * 
       */
      clientIPAddress?: any;
      /**
       * 
       */
      clientType?: any;
      /**
       * 
       */
      clusterName?: any;
      /**
       * 
       */
      grantOption?: boolean;
      /**
       * 
       */
      grantor?: any;
      /**
       * 
       */
      grantorGroups?: any[];
      /**
       * 
       */
      groups?: any[];
      /**
       * 
       */
      requestData?: any;
      /**
       * 
       */
      roles?: any[];
      /**
       * 
       */
      sessionId?: any;
      /**
       * 
       */
      targetRoles?: any[];
      /**
       * 
       */
      users?: any[];
    }
    export interface GroupRepresentation {
      access?: {
        [name: string]: any;
      };
      attributes?: {
        [name: string]: any;
      };
      clientRoles?: {
        [name: string]: any;
      };
      id?: string;
      name?: string;
      path?: string;
      realmRoles?: string[];
      subGroups?: GroupRepresentation[];
    }
    export interface IdentityProviderMapperRepresentation {
      config?: {
        [name: string]: any;
      };
      id?: string;
      identityProviderAlias?: string;
      identityProviderMapper?: string;
      name?: string;
    }
    export interface IdentityProviderRepresentation {
      addReadTokenRoleOnCreate?: boolean;
      alias: string;
      config?: {
        [name: string]: any;
      };
      displayName?: string;
      enabled?: boolean;
      firstBrokerLoginFlowAlias?: string;
      internalId?: string;
      linkOnly?: boolean;
      postBrokerLoginFlowAlias?: string;
      providerId?: string;
      storeToken?: boolean;
      trustEmail?: boolean;
    }
    /**
     * New ConfigMap
     */
    export interface Job {
      advanced?: {
      };
      arguments?: {
      };
      botQualifiedName?: string;
      connectionQualifiedName?: string;
      credentialQualifiedName?: string;
      cronString?: string;
      cronTimezone?: string;
      isCron?: boolean;
      isEvent?: boolean;
      name?: string;
      triggerNow?: boolean;
    }
    export interface KeyStoreConfig {
      format?: string;
      keyAlias?: string;
      keyPassword?: string;
      realmAlias?: string;
      realmCertificate?: boolean;
      storePassword?: string;
    }
    export interface KeysMetadataRepresentation {
      active?: {
        [name: string]: any;
      };
      keys?: KeysMetadataRepresentationKeyMetadataRepresentation[];
    }
    export interface KeysMetadataRepresentationKeyMetadataRepresentation {
      algorithm?: string;
      certificate?: string;
      kid?: string;
      providerId?: string;
      providerPriority?: number; // int64
      publicKey?: string;
      status?: string;
      type?: string;
    }
    export interface ManagementPermissionReference {
      enabled?: boolean;
      resource?: string;
      scopePermissions?: {
        [name: string]: any;
      };
    }
    export interface MappingsRepresentation {
      clientMappings?: {
        [name: string]: any;
      };
      realmMappings?: RoleRepresentation[];
    }
    /**
     * MatchType
     * 
     */
    export type MatchType = "NONE" | "SELF" | "DESCENDANT" | "ANCESTOR" | "ANCESTOR_WITH_WILDCARDS";
    export interface MemoryInfoRepresentation {
      free?: number; // int64
      freeFormated?: string;
      freePercentage?: number; // int64
      total?: number; // int64
      totalFormated?: string;
      used?: number; // int64
      usedFormated?: string;
    }
    /**
     * Message
     * 
     * example:
     * {
     *   "fieldName": "...",
     *   "message": "...",
     *   "name": "...",
     *   "objectId": 12345,
     *   "rbKey": "..."
     * }
     */
    export interface Message {
      /**
       * 
       */
      fieldName?: any;
      /**
       * 
       */
      message?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      objectId?: number;
      /**
       * 
       */
      rbKey?: any;
    }
    export interface MultivaluedHashMap {
      empty?: boolean;
      loadFactor?: number; // float
      threshold?: number; // int32
    }
    export interface NewUser {
      email: string;
      roleId: string;
      roleName: string;
    }
    export interface PartialImportRepresentation {
      clients?: ClientRepresentation[];
      groups?: GroupRepresentation[];
      identityProviders?: IdentityProviderRepresentation[];
      ifResourceExists?: string;
      policy?: "SKIP" | "OVERWRITE" | "FAIL";
      roles?: RolesRepresentation;
      users?: UserRepresentation[];
    }
    export interface PasswordPolicyTypeRepresentation {
      configType?: string;
      defaultValue?: string;
      displayName?: string;
      id?: string;
      multipleSupported?: boolean;
    }
    export interface Permission {
      claims?: {
        [name: string]: any;
      };
      rsid?: string;
      rsname?: string;
      scopes?: string[];
    }
    export interface PolicyRepresentation {
      config?: {
        [name: string]: any;
      };
      decisionStrategy?: "AFFIRMATIVE" | "UNANIMOUS" | "CONSENSUS";
      description?: string;
      id?: string;
      logic?: "POSITIVE" | "NEGATIVE";
      name?: string;
      owner?: string;
      policies?: string[];
      resources?: string[];
      resourcesData?: ResourceRepresentation[];
      scopes?: string[];
      scopesData?: ScopeRepresentation[];
      type?: string;
    }
    /**
     * Preview Template
     */
    export interface PreviewTemplate {
      replace?: {
      };
    }
    export interface ProfileInfoRepresentation {
      disabledFeatures?: string[];
      experimentalFeatures?: string[];
      name?: string;
      previewFeatures?: string[];
    }
    export interface ProtocolMapperRepresentation {
      config?: {
        [name: string]: any;
      };
      id?: string;
      name?: string;
      protocol?: string;
      protocolMapper?: string;
    }
    export interface ProviderRepresentation {
      operationalInfo?: {
        [name: string]: any;
      };
      order?: number; // int32
    }
    /**
     * RESTResponse
     * 
     * example:
     * {
     *   "httpStatusCode": 12345,
     *   "message": "...",
     *   "messageList": [
     *     {
     *       "fieldName": "...",
     *       "message": "...",
     *       "name": "...",
     *       "objectId": 12345,
     *       "rbKey": "..."
     *     },
     *     {
     *       "fieldName": "...",
     *       "message": "...",
     *       "name": "...",
     *       "objectId": 12345,
     *       "rbKey": "..."
     *     }
     *   ],
     *   "msgDesc": "...",
     *   "statusCode": 12345
     * }
     */
    export interface RESTResponse {
      /**
       * 
       */
      httpStatusCode?: number; // int32
      /**
       * 
       */
      message?: any;
      /**
       * 
       */
      messageList?: Message[];
      /**
       * 
       */
      msgDesc?: any;
      /**
       * 
       */
      statusCode?: number; // int32
    }
    /**
     * RangerAccessResource
     * 
     * example:
     * {
     *   "asMap": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "asString": "...",
     *   "cacheKey": "...",
     *   "keys": [
     *     "...",
     *     "..."
     *   ],
     *   "leafName": "...",
     *   "ownerUser": "...",
     *   "readOnlyCopy": {
     *     "asMap": {
     *       "property1": {},
     *       "property2": {}
     *     },
     *     "asString": "...",
     *     "cacheKey": "...",
     *     "keys": [
     *       "...",
     *       "..."
     *     ],
     *     "leafName": "...",
     *     "ownerUser": "...",
     *     "readOnlyCopy": {},
     *     "serviceDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "configs": [
     *         {},
     *         {}
     *       ],
     *       "contextEnrichers": [
     *         {},
     *         {}
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {},
     *       "description": "...",
     *       "enums": [
     *         {},
     *         {}
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {},
     *         {}
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {},
     *         {}
     *       ],
     *       "rowFilterDef": {},
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   },
     *   "serviceDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "configs": [
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "contextEnrichers": [
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "maskTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "description": "...",
     *     "enums": [
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "guid": "...",
     *     "id": 12345,
     *     "implClass": "...",
     *     "isEnabled": true,
     *     "label": "...",
     *     "name": "...",
     *     "options": {
     *       "property1": "...",
     *       "property2": "..."
     *     },
     *     "policyConditions": [
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rbKeyDescription": "...",
     *     "rbKeyLabel": "...",
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rowFilterDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "version": 12345
     *   }
     * }
     */
    export interface RangerAccessResource {
      /**
       * 
       */
      asMap?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      asString?: any;
      /**
       * 
       */
      cacheKey?: any;
      /**
       * 
       */
      keys?: any[];
      /**
       * 
       */
      leafName?: any;
      /**
       * 
       */
      ownerUser?: any;
      readOnlyCopy?: RangerAccessResource;
      serviceDef?: RangerServiceDef;
    }
    /**
     * RangerAccessResourceImpl
     * 
     * example:
     * {
     *   "asMap": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "asString": "...",
     *   "cacheKey": "...",
     *   "keys": [
     *     "...",
     *     "..."
     *   ],
     *   "leafName": "...",
     *   "ownerUser": "...",
     *   "readOnlyCopy": {
     *     "asMap": {
     *       "property1": {},
     *       "property2": {}
     *     },
     *     "asString": "...",
     *     "cacheKey": "...",
     *     "keys": [
     *       "...",
     *       "..."
     *     ],
     *     "leafName": "...",
     *     "ownerUser": "...",
     *     "readOnlyCopy": {},
     *     "serviceDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "configs": [
     *         {},
     *         {}
     *       ],
     *       "contextEnrichers": [
     *         {},
     *         {}
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {},
     *       "description": "...",
     *       "enums": [
     *         {},
     *         {}
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {},
     *         {}
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {},
     *         {}
     *       ],
     *       "rowFilterDef": {},
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   },
     *   "serviceDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "configs": [
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "contextEnrichers": [
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "maskTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "description": "...",
     *     "enums": [
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "guid": "...",
     *     "id": 12345,
     *     "implClass": "...",
     *     "isEnabled": true,
     *     "label": "...",
     *     "name": "...",
     *     "options": {
     *       "property1": "...",
     *       "property2": "..."
     *     },
     *     "policyConditions": [
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rbKeyDescription": "...",
     *     "rbKeyLabel": "...",
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rowFilterDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "version": 12345
     *   }
     * }
     */
    export interface RangerAccessResourceImpl {
      /**
       * 
       */
      asMap?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      asString?: any;
      /**
       * 
       */
      cacheKey?: any;
      /**
       * 
       */
      keys?: any[];
      /**
       * 
       */
      leafName?: any;
      /**
       * 
       */
      ownerUser?: any;
      readOnlyCopy?: RangerAccessResource;
      serviceDef?: RangerServiceDef;
    }
    /**
     * RangerAccessResourceReadOnly
     * 
     * example:
     * {
     *   "asMap": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "asString": "...",
     *   "cacheKey": "...",
     *   "keys": [
     *     "...",
     *     "..."
     *   ],
     *   "leafName": "...",
     *   "ownerUser": "...",
     *   "readOnlyCopy": {
     *     "asMap": {
     *       "property1": {},
     *       "property2": {}
     *     },
     *     "asString": "...",
     *     "cacheKey": "...",
     *     "keys": [
     *       "...",
     *       "..."
     *     ],
     *     "leafName": "...",
     *     "ownerUser": "...",
     *     "readOnlyCopy": {},
     *     "serviceDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "configs": [
     *         {},
     *         {}
     *       ],
     *       "contextEnrichers": [
     *         {},
     *         {}
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {},
     *       "description": "...",
     *       "enums": [
     *         {},
     *         {}
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {},
     *         {}
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {},
     *         {}
     *       ],
     *       "rowFilterDef": {},
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   },
     *   "serviceDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "configs": [
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "contextEnrichers": [
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "maskTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "description": "...",
     *     "enums": [
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "guid": "...",
     *     "id": 12345,
     *     "implClass": "...",
     *     "isEnabled": true,
     *     "label": "...",
     *     "name": "...",
     *     "options": {
     *       "property1": "...",
     *       "property2": "..."
     *     },
     *     "policyConditions": [
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rbKeyDescription": "...",
     *     "rbKeyLabel": "...",
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rowFilterDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "version": 12345
     *   }
     * }
     */
    export interface RangerAccessResourceReadOnly {
      /**
       * 
       */
      asMap?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      asString?: any;
      /**
       * 
       */
      cacheKey?: any;
      /**
       * 
       */
      keys?: any[];
      /**
       * 
       */
      leafName?: any;
      /**
       * 
       */
      ownerUser?: any;
      readOnlyCopy?: RangerAccessResource;
      serviceDef?: RangerServiceDef;
    }
    /**
     * RangerAccessTypeDef
     * 
     * example:
     * {
     *   "impliedGrants": [
     *     "...",
     *     "..."
     *   ],
     *   "itemId": 12345,
     *   "label": "...",
     *   "name": "...",
     *   "rbKeyLabel": "..."
     * }
     */
    export interface RangerAccessTypeDef {
      /**
       * 
       */
      impliedGrants?: any[];
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
    }
    /**
     * AssetPolicy
     */
    export interface RangerAssetPolicy {
      /**
       * AssetOwner
       */
      owner: {
        groups: string[];
        users: string[];
      };
      qualifiedName: string;
      /**
       * AssetSubscriber
       */
      subscriber: {
        groups: string[];
        users: string[];
      };
    }
    /**
     * AssetPolicy
     */
    export interface RangerAtlanAssetPolicy {
      assetType: string;
      assets: string[];
      classifications: string[];
      /**
       * AssetOwner
       */
      groups: {
        editors: string[];
        editorsExcludedFromAllow?: string[];
        editorsExcludedFromDeny?: string[];
        editorsdenied: string[];
        subscribers: string[];
        subscribersExcludedFromAllow?: string[];
        subscribersExcludedFromDeny?: string[];
        subscribersdenied: string[];
      };
      includeAllAssetTypes: boolean;
      includeAllAssets: boolean;
      includeAllClassifications: boolean;
      isEnabled: boolean;
      policyName: string;
      /**
       * AssetSubscriber
       */
      users: {
        editors: string[];
        editorsExcludedFromAllow?: string[];
        editorsExcludedFromDeny?: string[];
        editorsdenied: string[];
        subscribers: string[];
        subscribersExcludedFromAllow?: string[];
        subscribersExcludedFromDeny?: string[];
        subscribersdenied: string[];
      };
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerBaseModelObject {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
    }
    /**
     * RangerContextEnricherDef
     * 
     * example:
     * {
     *   "enricher": "...",
     *   "enricherOptions": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "itemId": 12345,
     *   "name": "..."
     * }
     */
    export interface RangerContextEnricherDef {
      /**
       * 
       */
      enricher?: any;
      /**
       * 
       */
      enricherOptions?: {
        [name: string]: any;
      };
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      name?: any;
    }
    /**
     * RangerDataMaskDef
     * 
     * example:
     * {
     *   "accessTypes": [
     *     {
     *       "impliedGrants": [
     *         "...",
     *         "..."
     *       ],
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     },
     *     {
     *       "impliedGrants": [
     *         "...",
     *         "..."
     *       ],
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     }
     *   ],
     *   "maskTypes": [
     *     {
     *       "dataMaskOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "description": "...",
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "transformer": "..."
     *     },
     *     {
     *       "dataMaskOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "description": "...",
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "transformer": "..."
     *     }
     *   ],
     *   "resources": [
     *     {
     *       "accessTypeRestrictions": [
     *         "...",
     *         "..."
     *       ],
     *       "description": "...",
     *       "excludesSupported": true,
     *       "isValidLeaf": true,
     *       "itemId": 12345,
     *       "label": "...",
     *       "level": 12345,
     *       "lookupSupported": true,
     *       "mandatory": true,
     *       "matcher": "...",
     *       "matcherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "name": "...",
     *       "parent": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "recursiveSupported": true,
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     },
     *     {
     *       "accessTypeRestrictions": [
     *         "...",
     *         "..."
     *       ],
     *       "description": "...",
     *       "excludesSupported": true,
     *       "isValidLeaf": true,
     *       "itemId": 12345,
     *       "label": "...",
     *       "level": 12345,
     *       "lookupSupported": true,
     *       "mandatory": true,
     *       "matcher": "...",
     *       "matcherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "name": "...",
     *       "parent": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "recursiveSupported": true,
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     }
     *   ]
     * }
     */
    export interface RangerDataMaskDef {
      /**
       * 
       */
      accessTypes?: RangerAccessTypeDef[];
      /**
       * 
       */
      maskTypes?: RangerDataMaskTypeDef[];
      /**
       * 
       */
      resources?: RangerResourceDef[];
    }
    /**
     * RangerPolicyItem
     * 
     * example:
     * {
     *   "accesses": [
     *     {
     *       "isAllowed": true,
     *       "type": "..."
     *     },
     *     {
     *       "isAllowed": true,
     *       "type": "..."
     *     }
     *   ],
     *   "conditions": [
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "dataMaskInfo": {
     *     "conditionExpr": "...",
     *     "dataMaskType": "...",
     *     "valueExpr": "..."
     *   },
     *   "delegateAdmin": true,
     *   "groups": [
     *     "...",
     *     "..."
     *   ],
     *   "roles": [
     *     "...",
     *     "..."
     *   ],
     *   "users": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface RangerDataMaskPolicyItem {
      /**
       * 
       */
      accesses?: RangerPolicyItemAccess[];
      /**
       * 
       */
      conditions?: RangerPolicyItemCondition[];
      /**
       * 
       */
      delegateAdmin?: boolean;
      /**
       * 
       */
      groups?: any[];
      /**
       * 
       */
      roles?: any[];
      /**
       * 
       */
      users?: any[];
      dataMaskInfo?: RangerPolicyItemDataMaskInfo;
    }
    /**
     * RangerDataMaskTypeDef
     * 
     * example:
     * {
     *   "dataMaskOptions": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "description": "...",
     *   "itemId": 12345,
     *   "label": "...",
     *   "name": "...",
     *   "rbKeyDescription": "...",
     *   "rbKeyLabel": "...",
     *   "transformer": "..."
     * }
     */
    export interface RangerDataMaskTypeDef {
      /**
       * 
       */
      dataMaskOptions?: {
        [name: string]: any;
      };
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      rbKeyDescription?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
      /**
       * 
       */
      transformer?: any;
    }
    /**
     * RangerEnumDef
     * 
     * example:
     * {
     *   "defaultIndex": 12345,
     *   "elements": [
     *     {
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     },
     *     {
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     }
     *   ],
     *   "itemId": 12345,
     *   "name": "..."
     * }
     */
    export interface RangerEnumDef {
      /**
       * 
       */
      defaultIndex?: number;
      /**
       * 
       */
      elements?: RangerEnumElementDef[];
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      name?: any;
    }
    /**
     * RangerEnumElementDef
     * 
     * example:
     * {
     *   "itemId": 12345,
     *   "label": "...",
     *   "name": "...",
     *   "rbKeyLabel": "..."
     * }
     */
    export interface RangerEnumElementDef {
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "metaDataInfo": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "pageSize": 12345,
     *   "policies": [
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     },
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     }
     *   ],
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerExportPolicyList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      policies?: RangerPolicy[];
      /**
       * 
       */
      metaDataInfo?: {
        [name: string]: {
        };
      };
    }
    /**
     * RangerMutableResource
     * 
     * example:
     * {}
     */
    export interface RangerMutableResource {
    }
    /**
     * RangerPluginInfo
     * 
     * example:
     * {
     *   "appType": "...",
     *   "createTime": 12345,
     *   "hostName": "...",
     *   "id": 12345,
     *   "info": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "ipAddress": "...",
     *   "serviceName": "...",
     *   "serviceType": "...",
     *   "updateTime": 12345
     * }
     */
    export interface RangerPluginInfo {
      /**
       * 
       */
      appType?: any;
      /**
       * 
       */
      createTime?: number;
      /**
       * 
       */
      hostName?: any;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      info?: {
        [name: string]: any;
      };
      /**
       * 
       */
      ipAddress?: any;
      /**
       * 
       */
      serviceName?: any;
      /**
       * 
       */
      serviceType?: any;
      /**
       * 
       */
      updateTime?: number;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "pluginInfoList": [
     *     {
     *       "appType": "...",
     *       "createTime": 12345,
     *       "hostName": "...",
     *       "id": 12345,
     *       "info": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "ipAddress": "...",
     *       "serviceName": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345
     *     },
     *     {
     *       "appType": "...",
     *       "createTime": 12345,
     *       "hostName": "...",
     *       "id": 12345,
     *       "info": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "ipAddress": "...",
     *       "serviceName": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345
     *     }
     *   ],
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerPluginInfoList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      pluginInfoList?: RangerPluginInfo[];
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "allowExceptions": [
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "conditions": [
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "dataMaskPolicyItems": [
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "dataMaskInfo": {
     *         "conditionExpr": "...",
     *         "dataMaskType": "...",
     *         "valueExpr": "..."
     *       },
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "dataMaskInfo": {
     *         "conditionExpr": "...",
     *         "dataMaskType": "...",
     *         "valueExpr": "..."
     *       },
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "denyExceptions": [
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "denyPolicyItems": [
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isAuditEnabled": true,
     *   "isDenyAllElse": true,
     *   "isEnabled": true,
     *   "name": "...",
     *   "options": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "policyItems": [
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "policyLabels": [
     *     "...",
     *     "..."
     *   ],
     *   "policyPriority": 12345,
     *   "policyType": 12345,
     *   "resourceSignature": "...",
     *   "resources": {
     *     "property1": {
     *       "isExcludes": true,
     *       "isRecursive": true,
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     "property2": {
     *       "isExcludes": true,
     *       "isRecursive": true,
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   },
     *   "rowFilterPolicyItems": [
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "rowFilterInfo": {
     *         "filterExpr": "..."
     *       },
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "accesses": [
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         },
     *         {
     *           "isAllowed": true,
     *           "type": "..."
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "delegateAdmin": true,
     *       "groups": [
     *         "...",
     *         "..."
     *       ],
     *       "roles": [
     *         "...",
     *         "..."
     *       ],
     *       "rowFilterInfo": {
     *         "filterExpr": "..."
     *       },
     *       "users": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "service": "...",
     *   "serviceType": "...",
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "validitySchedules": [
     *     {
     *       "endTime": "...",
     *       "recurrences": [
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         },
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         }
     *       ],
     *       "startTime": "...",
     *       "timeZone": "..."
     *     },
     *     {
     *       "endTime": "...",
     *       "recurrences": [
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         },
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         }
     *       ],
     *       "startTime": "...",
     *       "timeZone": "..."
     *     }
     *   ],
     *   "version": 12345,
     *   "zoneName": "..."
     * }
     */
    export interface RangerPolicy {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      allowExceptions?: RangerPolicyItem[];
      /**
       * 
       */
      conditions?: RangerPolicyItemCondition[];
      /**
       * 
       */
      dataMaskPolicyItems?: RangerDataMaskPolicyItem[];
      /**
       * 
       */
      denyExceptions?: RangerPolicyItem[];
      /**
       * 
       */
      denyPolicyItems?: RangerPolicyItem[];
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      isAuditEnabled?: boolean;
      /**
       * 
       */
      isDenyAllElse?: boolean;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      options?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      policyItems?: RangerPolicyItem[];
      /**
       * 
       */
      policyLabels?: any[];
      /**
       * 
       */
      policyPriority?: number;
      /**
       * 
       */
      policyType?: number;
      /**
       * 
       */
      resourceSignature?: any;
      /**
       * 
       */
      resources?: {
        [name: string]: RangerPolicyResource;
      };
      /**
       * 
       */
      rowFilterPolicyItems?: RangerRowFilterPolicyItem[];
      /**
       * 
       */
      service?: any;
      /**
       * 
       */
      serviceType?: any;
      /**
       * 
       */
      validitySchedules?: RangerValiditySchedule[];
      /**
       * 
       */
      zoneName?: any;
    }
    /**
     * RangerPolicyConditionDef
     * 
     * example:
     * {
     *   "description": "...",
     *   "evaluator": "...",
     *   "evaluatorOptions": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "itemId": 12345,
     *   "label": "...",
     *   "name": "...",
     *   "rbKeyDescription": "...",
     *   "rbKeyLabel": "...",
     *   "rbKeyValidationMessage": "...",
     *   "uiHint": "...",
     *   "validationMessage": "...",
     *   "validationRegEx": "..."
     * }
     */
    export interface RangerPolicyConditionDef {
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      evaluator?: any;
      /**
       * 
       */
      evaluatorOptions?: {
        [name: string]: any;
      };
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      rbKeyDescription?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
      /**
       * 
       */
      rbKeyValidationMessage?: any;
      /**
       * 
       */
      uiHint?: any;
      /**
       * 
       */
      validationMessage?: any;
      /**
       * 
       */
      validationRegEx?: any;
    }
    /**
     * RangerPolicyDelta
     * 
     * example:
     * {
     *   "changeType": 12345,
     *   "id": 12345,
     *   "policy": {
     *     "allowExceptions": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "conditions": [
     *       {
     *         "type": "...",
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "type": "...",
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskPolicyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "dataMaskInfo": {},
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "dataMaskInfo": {},
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "denyExceptions": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "denyPolicyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "description": "...",
     *     "guid": "...",
     *     "id": 12345,
     *     "isAuditEnabled": true,
     *     "isDenyAllElse": true,
     *     "isEnabled": true,
     *     "name": "...",
     *     "options": {
     *       "property1": {},
     *       "property2": {}
     *     },
     *     "policyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "policyLabels": [
     *       "...",
     *       "..."
     *     ],
     *     "policyPriority": 12345,
     *     "policyType": 12345,
     *     "resourceSignature": "...",
     *     "resources": {
     *       "property1": {
     *         "isExcludes": true,
     *         "isRecursive": true,
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       "property2": {
     *         "isExcludes": true,
     *         "isRecursive": true,
     *         "values": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     },
     *     "rowFilterPolicyItems": [
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "rowFilterInfo": {},
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       },
     *       {
     *         "accesses": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "delegateAdmin": true,
     *         "groups": [
     *           "...",
     *           "..."
     *         ],
     *         "roles": [
     *           "...",
     *           "..."
     *         ],
     *         "rowFilterInfo": {},
     *         "users": [
     *           "...",
     *           "..."
     *         ]
     *       }
     *     ],
     *     "service": "...",
     *     "serviceType": "...",
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "validitySchedules": [
     *       {
     *         "endTime": "...",
     *         "recurrences": [
     *           {},
     *           {}
     *         ],
     *         "startTime": "...",
     *         "timeZone": "..."
     *       },
     *       {
     *         "endTime": "...",
     *         "recurrences": [
     *           {},
     *           {}
     *         ],
     *         "startTime": "...",
     *         "timeZone": "..."
     *       }
     *     ],
     *     "version": 12345,
     *     "zoneName": "..."
     *   }
     * }
     */
    export interface RangerPolicyDelta {
      /**
       * 
       */
      changeType?: number;
      /**
       * 
       */
      id?: number;
      policy?: RangerPolicy;
    }
    /**
     * RangerPolicyItem
     * 
     * example:
     * {
     *   "accesses": [
     *     {
     *       "isAllowed": true,
     *       "type": "..."
     *     },
     *     {
     *       "isAllowed": true,
     *       "type": "..."
     *     }
     *   ],
     *   "conditions": [
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "delegateAdmin": true,
     *   "groups": [
     *     "...",
     *     "..."
     *   ],
     *   "roles": [
     *     "...",
     *     "..."
     *   ],
     *   "users": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface RangerPolicyItem {
      /**
       * 
       */
      accesses?: RangerPolicyItemAccess[];
      /**
       * 
       */
      conditions?: RangerPolicyItemCondition[];
      /**
       * 
       */
      delegateAdmin?: boolean;
      /**
       * 
       */
      groups?: any[];
      /**
       * 
       */
      roles?: any[];
      /**
       * 
       */
      users?: any[];
    }
    /**
     * RangerPolicyItemAccess
     * 
     * example:
     * {
     *   "isAllowed": true,
     *   "type": "..."
     * }
     */
    export interface RangerPolicyItemAccess {
      /**
       * 
       */
      isAllowed?: boolean;
      /**
       * 
       */
      type?: any;
    }
    /**
     * RangerPolicyItemCondition
     * 
     * example:
     * {
     *   "type": "...",
     *   "values": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface RangerPolicyItemCondition {
      /**
       * 
       */
      type?: any;
      /**
       * 
       */
      values?: any[];
    }
    /**
     * RangerPolicyItemDataMaskInfo
     * 
     * example:
     * {
     *   "conditionExpr": "...",
     *   "dataMaskType": "...",
     *   "valueExpr": "..."
     * }
     */
    export interface RangerPolicyItemDataMaskInfo {
      /**
       * 
       */
      conditionExpr?: any;
      /**
       * 
       */
      dataMaskType?: any;
      /**
       * 
       */
      valueExpr?: any;
    }
    /**
     * RangerPolicyItemRowFilterInfo
     * 
     * example:
     * {
     *   "filterExpr": "..."
     * }
     */
    export interface RangerPolicyItemRowFilterInfo {
      /**
       * 
       */
      filterExpr?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "policies": [
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     },
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     }
     *   ],
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerPolicyList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      policies?: RangerPolicy[];
    }
    /**
     * RangerPolicyResource
     * 
     * example:
     * {
     *   "isExcludes": true,
     *   "isRecursive": true,
     *   "values": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface RangerPolicyResource {
      /**
       * 
       */
      isExcludes?: boolean;
      /**
       * 
       */
      isRecursive?: boolean;
      /**
       * 
       */
      values?: any[];
    }
    /**
     * RangerRequestedResources
     * 
     * example:
     * {
     *   "requestedResources": [
     *     {
     *       "asMap": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "asString": "...",
     *       "cacheKey": "...",
     *       "keys": [
     *         "...",
     *         "..."
     *       ],
     *       "leafName": "...",
     *       "ownerUser": "...",
     *       "readOnlyCopy": {},
     *       "serviceDef": {
     *         "accessTypes": [
     *           {},
     *           {}
     *         ],
     *         "configs": [
     *           {},
     *           {}
     *         ],
     *         "contextEnrichers": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskDef": {},
     *         "description": "...",
     *         "enums": [
     *           {},
     *           {}
     *         ],
     *         "guid": "...",
     *         "id": 12345,
     *         "implClass": "...",
     *         "isEnabled": true,
     *         "label": "...",
     *         "name": "...",
     *         "options": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "policyConditions": [
     *           {},
     *           {}
     *         ],
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "resources": [
     *           {},
     *           {}
     *         ],
     *         "rowFilterDef": {},
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "version": 12345
     *       }
     *     },
     *     {
     *       "asMap": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "asString": "...",
     *       "cacheKey": "...",
     *       "keys": [
     *         "...",
     *         "..."
     *       ],
     *       "leafName": "...",
     *       "ownerUser": "...",
     *       "readOnlyCopy": {},
     *       "serviceDef": {
     *         "accessTypes": [
     *           {},
     *           {}
     *         ],
     *         "configs": [
     *           {},
     *           {}
     *         ],
     *         "contextEnrichers": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskDef": {},
     *         "description": "...",
     *         "enums": [
     *           {},
     *           {}
     *         ],
     *         "guid": "...",
     *         "id": 12345,
     *         "implClass": "...",
     *         "isEnabled": true,
     *         "label": "...",
     *         "name": "...",
     *         "options": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "policyConditions": [
     *           {},
     *           {}
     *         ],
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "resources": [
     *           {},
     *           {}
     *         ],
     *         "rowFilterDef": {},
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "version": 12345
     *       }
     *     }
     *   ]
     * }
     */
    export interface RangerRequestedResources {
      /**
       * 
       */
      requestedResources?: RangerAccessResource[];
    }
    /**
     * RangerResourceDef
     * 
     * example:
     * {
     *   "accessTypeRestrictions": [
     *     "...",
     *     "..."
     *   ],
     *   "description": "...",
     *   "excludesSupported": true,
     *   "isValidLeaf": true,
     *   "itemId": 12345,
     *   "label": "...",
     *   "level": 12345,
     *   "lookupSupported": true,
     *   "mandatory": true,
     *   "matcher": "...",
     *   "matcherOptions": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "name": "...",
     *   "parent": "...",
     *   "rbKeyDescription": "...",
     *   "rbKeyLabel": "...",
     *   "rbKeyValidationMessage": "...",
     *   "recursiveSupported": true,
     *   "type": "...",
     *   "uiHint": "...",
     *   "validationMessage": "...",
     *   "validationRegEx": "..."
     * }
     */
    export interface RangerResourceDef {
      /**
       * 
       */
      accessTypeRestrictions?: any[];
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      excludesSupported?: boolean;
      /**
       * 
       */
      isValidLeaf?: boolean;
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      level?: number;
      /**
       * 
       */
      lookupSupported?: boolean;
      /**
       * 
       */
      mandatory?: boolean;
      /**
       * 
       */
      matcher?: any;
      /**
       * 
       */
      matcherOptions?: {
        [name: string]: any;
      };
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      parent?: any;
      /**
       * 
       */
      rbKeyDescription?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
      /**
       * 
       */
      rbKeyValidationMessage?: any;
      /**
       * 
       */
      recursiveSupported?: boolean;
      /**
       * 
       */
      type?: any;
      /**
       * 
       */
      uiHint?: any;
      /**
       * 
       */
      validationMessage?: any;
      /**
       * 
       */
      validationRegEx?: any;
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "createdByUser": "...",
     *   "description": "...",
     *   "groups": [
     *     {
     *       "isAdmin": true,
     *       "name": "..."
     *     },
     *     {
     *       "isAdmin": true,
     *       "name": "..."
     *     }
     *   ],
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "name": "...",
     *   "options": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "roles": [
     *     {
     *       "isAdmin": true,
     *       "name": "..."
     *     },
     *     {
     *       "isAdmin": true,
     *       "name": "..."
     *     }
     *   ],
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "users": [
     *     {
     *       "isAdmin": true,
     *       "name": "..."
     *     },
     *     {
     *       "isAdmin": true,
     *       "name": "..."
     *     }
     *   ],
     *   "version": 12345
     * }
     */
    export interface RangerRole {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      createdByUser?: any;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      groups?: RoleMember[];
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      options?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      roles?: RoleMember[];
      /**
       * 
       */
      users?: RoleMember[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "roles": [
     *     {
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "createdByUser": "...",
     *       "description": "...",
     *       "groups": [
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         },
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         }
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "roles": [
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         },
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         }
     *       ],
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "users": [
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         },
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         }
     *       ],
     *       "version": 12345
     *     },
     *     {
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "createdByUser": "...",
     *       "description": "...",
     *       "groups": [
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         },
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         }
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "roles": [
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         },
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         }
     *       ],
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "users": [
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         },
     *         {
     *           "isAdmin": true,
     *           "name": "..."
     *         }
     *       ],
     *       "version": 12345
     *     }
     *   ],
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerRoleList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      roles?: RangerRole[];
    }
    /**
     * RangerRowFilterDef
     * 
     * example:
     * {
     *   "accessTypes": [
     *     {
     *       "impliedGrants": [
     *         "...",
     *         "..."
     *       ],
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     },
     *     {
     *       "impliedGrants": [
     *         "...",
     *         "..."
     *       ],
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     }
     *   ],
     *   "resources": [
     *     {
     *       "accessTypeRestrictions": [
     *         "...",
     *         "..."
     *       ],
     *       "description": "...",
     *       "excludesSupported": true,
     *       "isValidLeaf": true,
     *       "itemId": 12345,
     *       "label": "...",
     *       "level": 12345,
     *       "lookupSupported": true,
     *       "mandatory": true,
     *       "matcher": "...",
     *       "matcherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "name": "...",
     *       "parent": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "recursiveSupported": true,
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     },
     *     {
     *       "accessTypeRestrictions": [
     *         "...",
     *         "..."
     *       ],
     *       "description": "...",
     *       "excludesSupported": true,
     *       "isValidLeaf": true,
     *       "itemId": 12345,
     *       "label": "...",
     *       "level": 12345,
     *       "lookupSupported": true,
     *       "mandatory": true,
     *       "matcher": "...",
     *       "matcherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "name": "...",
     *       "parent": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "recursiveSupported": true,
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     }
     *   ]
     * }
     */
    export interface RangerRowFilterDef {
      /**
       * 
       */
      accessTypes?: RangerAccessTypeDef[];
      /**
       * 
       */
      resources?: RangerResourceDef[];
    }
    /**
     * RangerPolicyItem
     * 
     * example:
     * {
     *   "accesses": [
     *     {
     *       "isAllowed": true,
     *       "type": "..."
     *     },
     *     {
     *       "isAllowed": true,
     *       "type": "..."
     *     }
     *   ],
     *   "conditions": [
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "type": "...",
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "delegateAdmin": true,
     *   "groups": [
     *     "...",
     *     "..."
     *   ],
     *   "roles": [
     *     "...",
     *     "..."
     *   ],
     *   "rowFilterInfo": {
     *     "filterExpr": "..."
     *   },
     *   "users": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface RangerRowFilterPolicyItem {
      /**
       * 
       */
      accesses?: RangerPolicyItemAccess[];
      /**
       * 
       */
      conditions?: RangerPolicyItemCondition[];
      /**
       * 
       */
      delegateAdmin?: boolean;
      /**
       * 
       */
      groups?: any[];
      /**
       * 
       */
      roles?: any[];
      /**
       * 
       */
      users?: any[];
      rowFilterInfo?: RangerPolicyItemRowFilterInfo;
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "adminUserGroups": [
     *     "...",
     *     "..."
     *   ],
     *   "adminUsers": [
     *     "...",
     *     "..."
     *   ],
     *   "auditUserGroups": [
     *     "...",
     *     "..."
     *   ],
     *   "auditUsers": [
     *     "...",
     *     "..."
     *   ],
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "name": "...",
     *   "services": {
     *     "property1": {
     *       "resources": [
     *         {
     *           "property1": [],
     *           "property2": []
     *         },
     *         {
     *           "property1": [],
     *           "property2": []
     *         }
     *       ]
     *     },
     *     "property2": {
     *       "resources": [
     *         {
     *           "property1": [],
     *           "property2": []
     *         },
     *         {
     *           "property1": [],
     *           "property2": []
     *         }
     *       ]
     *     }
     *   },
     *   "tagServices": [
     *     "...",
     *     "..."
     *   ],
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerSecurityZone {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      adminUserGroups?: any[];
      /**
       * 
       */
      adminUsers?: any[];
      /**
       * 
       */
      auditUserGroups?: any[];
      /**
       * 
       */
      auditUsers?: any[];
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      services?: {
        [name: string]: RangerSecurityZoneService;
      };
      /**
       * 
       */
      tagServices?: any[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "securityZones": [
     *     {
     *       "adminUserGroups": [
     *         "...",
     *         "..."
     *       ],
     *       "adminUsers": [
     *         "...",
     *         "..."
     *       ],
     *       "auditUserGroups": [
     *         "...",
     *         "..."
     *       ],
     *       "auditUsers": [
     *         "...",
     *         "..."
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "services": {
     *         "property1": {
     *           "resources": [
     *             {
     *               "property1": [],
     *               "property2": []
     *             },
     *             {
     *               "property1": [],
     *               "property2": []
     *             }
     *           ]
     *         },
     *         "property2": {
     *           "resources": [
     *             {
     *               "property1": [],
     *               "property2": []
     *             },
     *             {
     *               "property1": [],
     *               "property2": []
     *             }
     *           ]
     *         }
     *       },
     *       "tagServices": [
     *         "...",
     *         "..."
     *       ],
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     },
     *     {
     *       "adminUserGroups": [
     *         "...",
     *         "..."
     *       ],
     *       "adminUsers": [
     *         "...",
     *         "..."
     *       ],
     *       "auditUserGroups": [
     *         "...",
     *         "..."
     *       ],
     *       "auditUsers": [
     *         "...",
     *         "..."
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "services": {
     *         "property1": {
     *           "resources": [
     *             {
     *               "property1": [],
     *               "property2": []
     *             },
     *             {
     *               "property1": [],
     *               "property2": []
     *             }
     *           ]
     *         },
     *         "property2": {
     *           "resources": [
     *             {
     *               "property1": [],
     *               "property2": []
     *             },
     *             {
     *               "property1": [],
     *               "property2": []
     *             }
     *           ]
     *         }
     *       },
     *       "tagServices": [
     *         "...",
     *         "..."
     *       ],
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   ],
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerSecurityZoneList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      securityZones?: RangerSecurityZone[];
    }
    /**
     * RangerSecurityZoneService
     * 
     * example:
     * {
     *   "resources": [
     *     {
     *       "property1": [],
     *       "property2": []
     *     },
     *     {
     *       "property1": [],
     *       "property2": []
     *     }
     *   ]
     * }
     */
    export interface RangerSecurityZoneService {
      /**
       * 
       */
      resources?: {
        [name: string]: {
        }[];
      }[];
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "configs": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "name": "...",
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "tagService": "...",
     *   "tagUpdateTime": 12345,
     *   "tagVersion": 12345,
     *   "type": "...",
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerService {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      configs?: {
        [name: string]: any;
      };
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      policyUpdateTime?: number;
      /**
       * 
       */
      policyVersion?: number;
      /**
       * 
       */
      tagService?: any;
      /**
       * 
       */
      tagUpdateTime?: number;
      /**
       * 
       */
      tagVersion?: number;
      /**
       * 
       */
      type?: any;
    }
    /**
     * RangerServiceConfigDef
     * 
     * example:
     * {
     *   "defaultValue": "...",
     *   "description": "...",
     *   "itemId": 12345,
     *   "label": "...",
     *   "mandatory": true,
     *   "name": "...",
     *   "rbKeyDescription": "...",
     *   "rbKeyLabel": "...",
     *   "rbKeyValidationMessage": "...",
     *   "subType": "...",
     *   "type": "...",
     *   "uiHint": "...",
     *   "validationMessage": "...",
     *   "validationRegEx": "..."
     * }
     */
    export interface RangerServiceConfigDef {
      /**
       * 
       */
      defaultValue?: any;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      itemId?: number;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      mandatory?: boolean;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      rbKeyDescription?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
      /**
       * 
       */
      rbKeyValidationMessage?: any;
      /**
       * 
       */
      subType?: any;
      /**
       * 
       */
      type?: any;
      /**
       * 
       */
      uiHint?: any;
      /**
       * 
       */
      validationMessage?: any;
      /**
       * 
       */
      validationRegEx?: any;
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "accessTypes": [
     *     {
     *       "impliedGrants": [
     *         "...",
     *         "..."
     *       ],
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     },
     *     {
     *       "impliedGrants": [
     *         "...",
     *         "..."
     *       ],
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyLabel": "..."
     *     }
     *   ],
     *   "configs": [
     *     {
     *       "defaultValue": "...",
     *       "description": "...",
     *       "itemId": 12345,
     *       "label": "...",
     *       "mandatory": true,
     *       "name": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "subType": "...",
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     },
     *     {
     *       "defaultValue": "...",
     *       "description": "...",
     *       "itemId": 12345,
     *       "label": "...",
     *       "mandatory": true,
     *       "name": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "subType": "...",
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     }
     *   ],
     *   "contextEnrichers": [
     *     {
     *       "enricher": "...",
     *       "enricherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "itemId": 12345,
     *       "name": "..."
     *     },
     *     {
     *       "enricher": "...",
     *       "enricherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "itemId": 12345,
     *       "name": "..."
     *     }
     *   ],
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "dataMaskDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "maskTypes": [
     *       {
     *         "dataMaskOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "transformer": "..."
     *       },
     *       {
     *         "dataMaskOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "transformer": "..."
     *       }
     *     ],
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ]
     *   },
     *   "description": "...",
     *   "enums": [
     *     {
     *       "defaultIndex": 12345,
     *       "elements": [
     *         {
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         },
     *         {
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         }
     *       ],
     *       "itemId": 12345,
     *       "name": "..."
     *     },
     *     {
     *       "defaultIndex": 12345,
     *       "elements": [
     *         {
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         },
     *         {
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         }
     *       ],
     *       "itemId": 12345,
     *       "name": "..."
     *     }
     *   ],
     *   "guid": "...",
     *   "id": 12345,
     *   "implClass": "...",
     *   "isEnabled": true,
     *   "label": "...",
     *   "name": "...",
     *   "options": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "policyConditions": [
     *     {
     *       "description": "...",
     *       "evaluator": "...",
     *       "evaluatorOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     },
     *     {
     *       "description": "...",
     *       "evaluator": "...",
     *       "evaluatorOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "itemId": 12345,
     *       "label": "...",
     *       "name": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     }
     *   ],
     *   "rbKeyDescription": "...",
     *   "rbKeyLabel": "...",
     *   "resources": [
     *     {
     *       "accessTypeRestrictions": [
     *         "...",
     *         "..."
     *       ],
     *       "description": "...",
     *       "excludesSupported": true,
     *       "isValidLeaf": true,
     *       "itemId": 12345,
     *       "label": "...",
     *       "level": 12345,
     *       "lookupSupported": true,
     *       "mandatory": true,
     *       "matcher": "...",
     *       "matcherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "name": "...",
     *       "parent": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "recursiveSupported": true,
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     },
     *     {
     *       "accessTypeRestrictions": [
     *         "...",
     *         "..."
     *       ],
     *       "description": "...",
     *       "excludesSupported": true,
     *       "isValidLeaf": true,
     *       "itemId": 12345,
     *       "label": "...",
     *       "level": 12345,
     *       "lookupSupported": true,
     *       "mandatory": true,
     *       "matcher": "...",
     *       "matcherOptions": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "name": "...",
     *       "parent": "...",
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "rbKeyValidationMessage": "...",
     *       "recursiveSupported": true,
     *       "type": "...",
     *       "uiHint": "...",
     *       "validationMessage": "...",
     *       "validationRegEx": "..."
     *     }
     *   ],
     *   "rowFilterDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ]
     *   },
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerServiceDef {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      accessTypes?: RangerAccessTypeDef[];
      /**
       * 
       */
      configs?: RangerServiceConfigDef[];
      /**
       * 
       */
      contextEnrichers?: RangerContextEnricherDef[];
      dataMaskDef?: RangerDataMaskDef;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      enums?: RangerEnumDef[];
      /**
       * 
       */
      implClass?: any;
      /**
       * 
       */
      label?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      options?: {
        [name: string]: any;
      };
      /**
       * 
       */
      policyConditions?: RangerPolicyConditionDef[];
      /**
       * 
       */
      rbKeyDescription?: any;
      /**
       * 
       */
      rbKeyLabel?: any;
      /**
       * 
       */
      resources?: RangerResourceDef[];
      rowFilterDef?: RangerRowFilterDef;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "serviceDefs": [
     *     {
     *       "accessTypes": [
     *         {
     *           "impliedGrants": [
     *             "...",
     *             "..."
     *           ],
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         },
     *         {
     *           "impliedGrants": [
     *             "...",
     *             "..."
     *           ],
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         }
     *       ],
     *       "configs": [
     *         {
     *           "defaultValue": "...",
     *           "description": "...",
     *           "itemId": 12345,
     *           "label": "...",
     *           "mandatory": true,
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "subType": "...",
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         },
     *         {
     *           "defaultValue": "...",
     *           "description": "...",
     *           "itemId": 12345,
     *           "label": "...",
     *           "mandatory": true,
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "subType": "...",
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         }
     *       ],
     *       "contextEnrichers": [
     *         {
     *           "enricher": "...",
     *           "enricherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "name": "..."
     *         },
     *         {
     *           "enricher": "...",
     *           "enricherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "name": "..."
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {
     *         "accessTypes": [
     *           {},
     *           {}
     *         ],
     *         "maskTypes": [
     *           {},
     *           {}
     *         ],
     *         "resources": [
     *           {},
     *           {}
     *         ]
     *       },
     *       "description": "...",
     *       "enums": [
     *         {
     *           "defaultIndex": 12345,
     *           "elements": [
     *             {},
     *             {}
     *           ],
     *           "itemId": 12345,
     *           "name": "..."
     *         },
     *         {
     *           "defaultIndex": 12345,
     *           "elements": [
     *             {},
     *             {}
     *           ],
     *           "itemId": 12345,
     *           "name": "..."
     *         }
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {
     *           "description": "...",
     *           "evaluator": "...",
     *           "evaluatorOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         },
     *         {
     *           "description": "...",
     *           "evaluator": "...",
     *           "evaluatorOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         }
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {
     *           "accessTypeRestrictions": [
     *             "...",
     *             "..."
     *           ],
     *           "description": "...",
     *           "excludesSupported": true,
     *           "isValidLeaf": true,
     *           "itemId": 12345,
     *           "label": "...",
     *           "level": 12345,
     *           "lookupSupported": true,
     *           "mandatory": true,
     *           "matcher": "...",
     *           "matcherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "name": "...",
     *           "parent": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "recursiveSupported": true,
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         },
     *         {
     *           "accessTypeRestrictions": [
     *             "...",
     *             "..."
     *           ],
     *           "description": "...",
     *           "excludesSupported": true,
     *           "isValidLeaf": true,
     *           "itemId": 12345,
     *           "label": "...",
     *           "level": 12345,
     *           "lookupSupported": true,
     *           "mandatory": true,
     *           "matcher": "...",
     *           "matcherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "name": "...",
     *           "parent": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "recursiveSupported": true,
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         }
     *       ],
     *       "rowFilterDef": {
     *         "accessTypes": [
     *           {},
     *           {}
     *         ],
     *         "resources": [
     *           {},
     *           {}
     *         ]
     *       },
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     },
     *     {
     *       "accessTypes": [
     *         {
     *           "impliedGrants": [
     *             "...",
     *             "..."
     *           ],
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         },
     *         {
     *           "impliedGrants": [
     *             "...",
     *             "..."
     *           ],
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyLabel": "..."
     *         }
     *       ],
     *       "configs": [
     *         {
     *           "defaultValue": "...",
     *           "description": "...",
     *           "itemId": 12345,
     *           "label": "...",
     *           "mandatory": true,
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "subType": "...",
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         },
     *         {
     *           "defaultValue": "...",
     *           "description": "...",
     *           "itemId": 12345,
     *           "label": "...",
     *           "mandatory": true,
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "subType": "...",
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         }
     *       ],
     *       "contextEnrichers": [
     *         {
     *           "enricher": "...",
     *           "enricherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "name": "..."
     *         },
     *         {
     *           "enricher": "...",
     *           "enricherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "name": "..."
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {
     *         "accessTypes": [
     *           {},
     *           {}
     *         ],
     *         "maskTypes": [
     *           {},
     *           {}
     *         ],
     *         "resources": [
     *           {},
     *           {}
     *         ]
     *       },
     *       "description": "...",
     *       "enums": [
     *         {
     *           "defaultIndex": 12345,
     *           "elements": [
     *             {},
     *             {}
     *           ],
     *           "itemId": 12345,
     *           "name": "..."
     *         },
     *         {
     *           "defaultIndex": 12345,
     *           "elements": [
     *             {},
     *             {}
     *           ],
     *           "itemId": 12345,
     *           "name": "..."
     *         }
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {
     *           "description": "...",
     *           "evaluator": "...",
     *           "evaluatorOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         },
     *         {
     *           "description": "...",
     *           "evaluator": "...",
     *           "evaluatorOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "itemId": 12345,
     *           "label": "...",
     *           "name": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         }
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {
     *           "accessTypeRestrictions": [
     *             "...",
     *             "..."
     *           ],
     *           "description": "...",
     *           "excludesSupported": true,
     *           "isValidLeaf": true,
     *           "itemId": 12345,
     *           "label": "...",
     *           "level": 12345,
     *           "lookupSupported": true,
     *           "mandatory": true,
     *           "matcher": "...",
     *           "matcherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "name": "...",
     *           "parent": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "recursiveSupported": true,
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         },
     *         {
     *           "accessTypeRestrictions": [
     *             "...",
     *             "..."
     *           ],
     *           "description": "...",
     *           "excludesSupported": true,
     *           "isValidLeaf": true,
     *           "itemId": 12345,
     *           "label": "...",
     *           "level": 12345,
     *           "lookupSupported": true,
     *           "mandatory": true,
     *           "matcher": "...",
     *           "matcherOptions": {
     *             "property1": "...",
     *             "property2": "..."
     *           },
     *           "name": "...",
     *           "parent": "...",
     *           "rbKeyDescription": "...",
     *           "rbKeyLabel": "...",
     *           "rbKeyValidationMessage": "...",
     *           "recursiveSupported": true,
     *           "type": "...",
     *           "uiHint": "...",
     *           "validationMessage": "...",
     *           "validationRegEx": "..."
     *         }
     *       ],
     *       "rowFilterDef": {
     *         "accessTypes": [
     *           {},
     *           {}
     *         ],
     *         "resources": [
     *           {},
     *           {}
     *         ]
     *       },
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   ],
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerServiceDefList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      serviceDefs?: RangerServiceDef[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "services": [
     *     {
     *       "configs": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "policyUpdateTime": 12345,
     *       "policyVersion": 12345,
     *       "tagService": "...",
     *       "tagUpdateTime": 12345,
     *       "tagVersion": 12345,
     *       "type": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     },
     *     {
     *       "configs": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "policyUpdateTime": 12345,
     *       "policyVersion": 12345,
     *       "tagService": "...",
     *       "tagUpdateTime": 12345,
     *       "tagVersion": 12345,
     *       "type": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   ],
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface RangerServiceList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      services?: RangerService[];
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "resourceElements": {
     *     "property1": {
     *       "isExcludes": true,
     *       "isRecursive": true,
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     "property2": {
     *       "isExcludes": true,
     *       "isRecursive": true,
     *       "values": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   },
     *   "resourceSignature": "...",
     *   "serviceName": "...",
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerServiceResource {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      resourceElements?: {
        [name: string]: RangerPolicyResource;
      };
      /**
       * 
       */
      resourceSignature?: any;
      /**
       * 
       */
      serviceName?: any;
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "attributes": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "options": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "owner": 12345,
     *   "type": "...",
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "validityPeriods": [
     *     {
     *       "endTime": "...",
     *       "recurrences": [
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         },
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         }
     *       ],
     *       "startTime": "...",
     *       "timeZone": "..."
     *     },
     *     {
     *       "endTime": "...",
     *       "recurrences": [
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         },
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         }
     *       ],
     *       "startTime": "...",
     *       "timeZone": "..."
     *     }
     *   ],
     *   "version": 12345
     * }
     */
    export interface RangerTag {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      attributes?: {
        [name: string]: any;
      };
      /**
       * 
       */
      options?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      owner?: number;
      /**
       * 
       */
      type?: any;
      /**
       * 
       */
      validityPeriods?: RangerValiditySchedule[];
    }
    /**
     * RangerTagAttributeDef
     * 
     * example:
     * {
     *   "name": "...",
     *   "type": "..."
     * }
     */
    export interface RangerTagAttributeDef {
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      type?: any;
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "attributeDefs": [
     *     {
     *       "name": "...",
     *       "type": "..."
     *     },
     *     {
     *       "name": "...",
     *       "type": "..."
     *     }
     *   ],
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "name": "...",
     *   "source": "...",
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerTagDef {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      attributeDefs?: RangerTagAttributeDef[];
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      source?: any;
    }
    /**
     * RangerTagForEval
     * 
     * example:
     * {
     *   "attributes": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "matchType": "NONE",
     *   "options": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "type": "...",
     *   "validityPeriods": [
     *     {
     *       "endTime": "...",
     *       "recurrences": [
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         },
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         }
     *       ],
     *       "startTime": "...",
     *       "timeZone": "..."
     *     },
     *     {
     *       "endTime": "...",
     *       "recurrences": [
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         },
     *         {
     *           "interval": {},
     *           "schedule": {}
     *         }
     *       ],
     *       "startTime": "...",
     *       "timeZone": "..."
     *     }
     *   ]
     * }
     */
    export interface RangerTagForEval {
      /**
       * 
       */
      attributes?: {
        [name: string]: any;
      };
      matchType?: MatchType;
      /**
       * 
       */
      options?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      type?: any;
      /**
       * 
       */
      validityPeriods?: RangerValiditySchedule[];
    }
    /**
     * RangerAccessResourceImpl
     * 
     * example:
     * {
     *   "asMap": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "asString": "...",
     *   "cacheKey": "...",
     *   "keys": [
     *     "...",
     *     "..."
     *   ],
     *   "leafName": "...",
     *   "ownerUser": "...",
     *   "readOnlyCopy": {
     *     "asMap": {
     *       "property1": {},
     *       "property2": {}
     *     },
     *     "asString": "...",
     *     "cacheKey": "...",
     *     "keys": [
     *       "...",
     *       "..."
     *     ],
     *     "leafName": "...",
     *     "ownerUser": "...",
     *     "readOnlyCopy": {},
     *     "serviceDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "configs": [
     *         {},
     *         {}
     *       ],
     *       "contextEnrichers": [
     *         {},
     *         {}
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {},
     *       "description": "...",
     *       "enums": [
     *         {},
     *         {}
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {},
     *         {}
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {},
     *         {}
     *       ],
     *       "rowFilterDef": {},
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   },
     *   "serviceDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "configs": [
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "contextEnrichers": [
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "maskTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "description": "...",
     *     "enums": [
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "guid": "...",
     *     "id": 12345,
     *     "implClass": "...",
     *     "isEnabled": true,
     *     "label": "...",
     *     "name": "...",
     *     "options": {
     *       "property1": "...",
     *       "property2": "..."
     *     },
     *     "policyConditions": [
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rbKeyDescription": "...",
     *     "rbKeyLabel": "...",
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rowFilterDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "version": 12345
     *   }
     * }
     */
    export interface RangerTagResource {
      /**
       * 
       */
      asMap?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      asString?: any;
      /**
       * 
       */
      cacheKey?: any;
      /**
       * 
       */
      keys?: any[];
      /**
       * 
       */
      leafName?: any;
      /**
       * 
       */
      ownerUser?: any;
      readOnlyCopy?: RangerAccessResource;
      serviceDef?: RangerServiceDef;
    }
    /**
     * RangerBaseModelObject
     * 
     * example:
     * {
     *   "createTime": 12345,
     *   "createdBy": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "resourceId": 12345,
     *   "tagId": 12345,
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "version": 12345
     * }
     */
    export interface RangerTagResourceMap {
      /**
       * 
       */
      createTime?: any;
      /**
       * 
       */
      createdBy?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      id?: any;
      /**
       * 
       */
      isEnabled?: any;
      /**
       * 
       */
      updateTime?: any;
      /**
       * 
       */
      updatedBy?: any;
      /**
       * 
       */
      version?: any;
      /**
       * 
       */
      resourceId?: number;
      /**
       * 
       */
      tagId?: number;
    }
    /**
     * RangerValidityRecurrence
     * 
     * example:
     * {
     *   "interval": {
     *     "days": 12345,
     *     "hours": 12345,
     *     "minutes": 12345
     *   },
     *   "schedule": {
     *     "dayOfMonth": "...",
     *     "dayOfWeek": "...",
     *     "hour": "...",
     *     "minute": "...",
     *     "month": "...",
     *     "year": "..."
     *   }
     * }
     */
    export interface RangerValidityRecurrence {
      interval?: ValidityInterval;
      schedule?: RecurrenceSchedule;
    }
    /**
     * RangerValiditySchedule
     * 
     * example:
     * {
     *   "endTime": "...",
     *   "recurrences": [
     *     {
     *       "interval": {
     *         "days": 12345,
     *         "hours": 12345,
     *         "minutes": 12345
     *       },
     *       "schedule": {
     *         "dayOfMonth": "...",
     *         "dayOfWeek": "...",
     *         "hour": "...",
     *         "minute": "...",
     *         "month": "...",
     *         "year": "..."
     *       }
     *     },
     *     {
     *       "interval": {
     *         "days": 12345,
     *         "hours": 12345,
     *         "minutes": 12345
     *       },
     *       "schedule": {
     *         "dayOfMonth": "...",
     *         "dayOfWeek": "...",
     *         "hour": "...",
     *         "minute": "...",
     *         "month": "...",
     *         "year": "..."
     *       }
     *     }
     *   ],
     *   "startTime": "...",
     *   "timeZone": "..."
     * }
     */
    export interface RangerValiditySchedule {
      /**
       * 
       */
      endTime?: any;
      /**
       * 
       */
      recurrences?: RangerValidityRecurrence[];
      /**
       * 
       */
      startTime?: any;
      /**
       * 
       */
      timeZone?: any;
    }
    export interface RealmEventsConfigRepresentation {
      adminEventsDetailsEnabled?: boolean;
      adminEventsEnabled?: boolean;
      enabledEventTypes?: string[];
      eventsEnabled?: boolean;
      eventsExpiration?: number; // int64
      eventsListeners?: string[];
    }
    export interface RealmRepresentation {
      accessCodeLifespan?: number; // int32
      accessCodeLifespanLogin?: number; // int32
      accessCodeLifespanUserAction?: number; // int32
      accessTokenLifespan?: number; // int32
      accessTokenLifespanForImplicitFlow?: number; // int32
      accountTheme?: string;
      actionTokenGeneratedByAdminLifespan?: number; // int32
      actionTokenGeneratedByUserLifespan?: number; // int32
      adminEventsDetailsEnabled?: boolean;
      adminEventsEnabled?: boolean;
      adminTheme?: string;
      attributes?: {
        [name: string]: any;
      };
      authenticationFlows?: AuthenticationFlowRepresentation[];
      authenticatorConfig?: AuthenticatorConfigRepresentation[];
      browserFlow?: string;
      browserSecurityHeaders?: {
        [name: string]: any;
      };
      bruteForceProtected?: boolean;
      clientAuthenticationFlow?: string;
      clientScopeMappings?: {
        [name: string]: any;
      };
      clientScopes?: ClientScopeRepresentation[];
      clientSessionIdleTimeout?: number; // int32
      clientSessionMaxLifespan?: number; // int32
      clients?: ClientRepresentation[];
      components?: MultivaluedHashMap;
      defaultDefaultClientScopes?: string[];
      defaultGroups?: string[];
      defaultLocale?: string;
      defaultOptionalClientScopes?: string[];
      defaultRoles?: string[];
      defaultSignatureAlgorithm?: string;
      directGrantFlow?: string;
      displayName?: string;
      displayNameHtml?: string;
      dockerAuthenticationFlow?: string;
      duplicateEmailsAllowed?: boolean;
      editUsernameAllowed?: boolean;
      emailTheme?: string;
      enabled?: boolean;
      enabledEventTypes?: string[];
      eventsEnabled?: boolean;
      eventsExpiration?: number; // int64
      eventsListeners?: string[];
      failureFactor?: number; // int32
      federatedUsers?: UserRepresentation[];
      groups?: GroupRepresentation[];
      id?: string;
      identityProviderMappers?: IdentityProviderMapperRepresentation[];
      identityProviders?: IdentityProviderRepresentation[];
      internationalizationEnabled?: boolean;
      keycloakVersion?: string;
      loginTheme?: string;
      loginWithEmailAllowed?: boolean;
      maxDeltaTimeSeconds?: number; // int32
      maxFailureWaitSeconds?: number; // int32
      minimumQuickLoginWaitSeconds?: number; // int32
      notBefore?: number; // int32
      offlineSessionIdleTimeout?: number; // int32
      offlineSessionMaxLifespan?: number; // int32
      offlineSessionMaxLifespanEnabled?: boolean;
      otpPolicyAlgorithm?: string;
      otpPolicyDigits?: number; // int32
      otpPolicyInitialCounter?: number; // int32
      otpPolicyLookAheadWindow?: number; // int32
      otpPolicyPeriod?: number; // int32
      otpPolicyType?: string;
      otpSupportedApplications?: string[];
      passwordPolicy?: string;
      permanentLockout?: boolean;
      protocolMappers?: ProtocolMapperRepresentation[];
      quickLoginCheckMilliSeconds?: number; // int64
      realm?: string;
      refreshTokenMaxReuse?: number; // int32
      registrationAllowed?: boolean;
      registrationEmailAsUsername?: boolean;
      registrationFlow?: string;
      rememberMe?: boolean;
      requiredActions?: RequiredActionProviderRepresentation[];
      resetCredentialsFlow?: string;
      resetPasswordAllowed?: boolean;
      revokeRefreshToken?: boolean;
      roles?: RolesRepresentation;
      scopeMappings?: ScopeMappingRepresentation[];
      smtpServer?: {
        [name: string]: any;
      };
      sslRequired?: string;
      ssoSessionIdleTimeout?: number; // int32
      ssoSessionIdleTimeoutRememberMe?: number; // int32
      ssoSessionMaxLifespan?: number; // int32
      ssoSessionMaxLifespanRememberMe?: number; // int32
      supportedLocales?: string[];
      userFederationMappers?: UserFederationMapperRepresentation[];
      userFederationProviders?: UserFederationProviderRepresentation[];
      userManagedAccessAllowed?: boolean;
      users?: UserRepresentation[];
      verifyEmail?: boolean;
      waitIncrementSeconds?: number; // int32
      webAuthnPolicyAcceptableAaguids?: string[];
      webAuthnPolicyAttestationConveyancePreference?: string;
      webAuthnPolicyAuthenticatorAttachment?: string;
      webAuthnPolicyAvoidSameAuthenticatorRegister?: boolean;
      webAuthnPolicyCreateTimeout?: number; // int32
      webAuthnPolicyPasswordlessAcceptableAaguids?: string[];
      webAuthnPolicyPasswordlessAttestationConveyancePreference?: string;
      webAuthnPolicyPasswordlessAuthenticatorAttachment?: string;
      webAuthnPolicyPasswordlessAvoidSameAuthenticatorRegister?: boolean;
      webAuthnPolicyPasswordlessCreateTimeout?: number; // int32
      webAuthnPolicyPasswordlessRequireResidentKey?: string;
      webAuthnPolicyPasswordlessRpEntityName?: string;
      webAuthnPolicyPasswordlessRpId?: string;
      webAuthnPolicyPasswordlessSignatureAlgorithms?: string[];
      webAuthnPolicyPasswordlessUserVerificationRequirement?: string;
      webAuthnPolicyRequireResidentKey?: string;
      webAuthnPolicyRpEntityName?: string;
      webAuthnPolicyRpId?: string;
      webAuthnPolicySignatureAlgorithms?: string[];
      webAuthnPolicyUserVerificationRequirement?: string;
    }
    /**
     * RecurrenceSchedule
     * 
     * example:
     * {
     *   "dayOfMonth": "...",
     *   "dayOfWeek": "...",
     *   "hour": "...",
     *   "minute": "...",
     *   "month": "...",
     *   "year": "..."
     * }
     */
    export interface RecurrenceSchedule {
      /**
       * 
       */
      dayOfMonth?: any;
      /**
       * 
       */
      dayOfWeek?: any;
      /**
       * 
       */
      hour?: any;
      /**
       * 
       */
      minute?: any;
      /**
       * 
       */
      month?: any;
      /**
       * 
       */
      year?: any;
    }
    export interface RequiredActionProviderRepresentation {
      alias?: string;
      config?: {
        [name: string]: any;
      };
      defaultAction?: boolean;
      enabled?: boolean;
      name?: string;
      priority?: number; // int32
      providerId?: string;
    }
    /**
     * ResourceLookupContext
     * 
     * example:
     * {
     *   "resourceName": "...",
     *   "resources": {
     *     "property1": [
     *       "...",
     *       "..."
     *     ],
     *     "property2": [
     *       "...",
     *       "..."
     *     ]
     *   },
     *   "userInput": "..."
     * }
     */
    export interface ResourceLookupContext {
      /**
       * 
       */
      resourceName?: any;
      /**
       * 
       */
      resources?: {
        [name: string]: any[];
      };
      /**
       * 
       */
      userInput?: any;
    }
    export interface ResourceRepresentation {
      attributes?: {
        [name: string]: any;
      };
      displayName?: string;
      icon_uri?: string;
      id?: string;
      name?: string;
      ownerManagedAccess?: boolean;
      scopes?: ScopeRepresentation[];
      type?: string;
      uris?: string[];
    }
    export interface ResourceServerRepresentation {
      allowRemoteResourceManagement?: boolean;
      clientId?: string;
      decisionStrategy?: "AFFIRMATIVE" | "UNANIMOUS" | "CONSENSUS";
      id?: string;
      name?: string;
      policies?: PolicyRepresentation[];
      policyEnforcementMode?: "ENFORCING" | "PERMISSIVE" | "DISABLED";
      resources?: ResourceRepresentation[];
      scopes?: ScopeRepresentation[];
    }
    /**
     * RoleMember
     * 
     * example:
     * {
     *   "isAdmin": true,
     *   "name": "..."
     * }
     */
    export interface RoleMember {
      /**
       * 
       */
      isAdmin?: boolean;
      /**
       * 
       */
      name?: any;
    }
    export interface RoleRepresentation {
      attributes?: {
        [name: string]: any;
      };
      clientRole?: boolean;
      composite?: boolean;
      composites?: RoleRepresentationComposites;
      containerId?: string;
      description?: string;
      id?: string;
      name?: string;
    }
    export interface RoleRepresentationComposites {
      client?: {
        [name: string]: any;
      };
      realm?: string[];
    }
    export interface RolesRepresentation {
      client?: {
        [name: string]: any;
      };
      realm?: RoleRepresentation[];
    }
    /**
     * Schedule AtlanJob
     */
    export interface ScheduleAtlanJob {
      cronstring: string;
      timezone?: string;
    }
    export interface ScopeMappingRepresentation {
      client?: string;
      clientScope?: string;
      roles?: string[];
      self?: string;
    }
    export interface ScopeRepresentation {
      displayName?: string;
      iconUri?: string;
      id?: string;
      name?: string;
      policies?: PolicyRepresentation[];
      resources?: ResourceRepresentation[];
    }
    /**
     * SecurityZoneInfo
     * 
     * example:
     * {
     *   "containsAssociatedTagService": true,
     *   "policies": [
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     },
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     }
     *   ],
     *   "policyDeltas": [
     *     {
     *       "changeType": 12345,
     *       "id": 12345,
     *       "policy": {
     *         "allowExceptions": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "denyExceptions": [
     *           {},
     *           {}
     *         ],
     *         "denyPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "description": "...",
     *         "guid": "...",
     *         "id": 12345,
     *         "isAuditEnabled": true,
     *         "isDenyAllElse": true,
     *         "isEnabled": true,
     *         "name": "...",
     *         "options": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "policyItems": [
     *           {},
     *           {}
     *         ],
     *         "policyLabels": [
     *           "...",
     *           "..."
     *         ],
     *         "policyPriority": 12345,
     *         "policyType": 12345,
     *         "resourceSignature": "...",
     *         "resources": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "rowFilterPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "service": "...",
     *         "serviceType": "...",
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "validitySchedules": [
     *           {},
     *           {}
     *         ],
     *         "version": 12345,
     *         "zoneName": "..."
     *       }
     *     },
     *     {
     *       "changeType": 12345,
     *       "id": 12345,
     *       "policy": {
     *         "allowExceptions": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "denyExceptions": [
     *           {},
     *           {}
     *         ],
     *         "denyPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "description": "...",
     *         "guid": "...",
     *         "id": 12345,
     *         "isAuditEnabled": true,
     *         "isDenyAllElse": true,
     *         "isEnabled": true,
     *         "name": "...",
     *         "options": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "policyItems": [
     *           {},
     *           {}
     *         ],
     *         "policyLabels": [
     *           "...",
     *           "..."
     *         ],
     *         "policyPriority": 12345,
     *         "policyType": 12345,
     *         "resourceSignature": "...",
     *         "resources": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "rowFilterPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "service": "...",
     *         "serviceType": "...",
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "validitySchedules": [
     *           {},
     *           {}
     *         ],
     *         "version": 12345,
     *         "zoneName": "..."
     *       }
     *     }
     *   ],
     *   "resources": [
     *     {
     *       "property1": [],
     *       "property2": []
     *     },
     *     {
     *       "property1": [],
     *       "property2": []
     *     }
     *   ],
     *   "zoneName": "..."
     * }
     */
    export interface SecurityZoneInfo {
      /**
       * 
       */
      containsAssociatedTagService?: boolean;
      /**
       * 
       */
      policies?: RangerPolicy[];
      /**
       * 
       */
      policyDeltas?: RangerPolicyDelta[];
      /**
       * 
       */
      resources?: {
        [name: string]: {
        }[];
      }[];
      /**
       * 
       */
      zoneName?: any;
    }
    export interface ServerInfoRepresentation {
      builtinProtocolMappers?: {
        [name: string]: any;
      };
      clientImporters?: {
        [name: string]: any;
      }[];
      clientInstallations?: {
        [name: string]: any;
      };
      componentTypes?: {
        [name: string]: any;
      };
      enums?: {
        [name: string]: any;
      };
      identityProviders?: {
        [name: string]: any;
      }[];
      memoryInfo?: MemoryInfoRepresentation;
      passwordPolicies?: PasswordPolicyTypeRepresentation[];
      profileInfo?: ProfileInfoRepresentation;
      protocolMapperTypes?: {
        [name: string]: any;
      };
      providers?: {
        [name: string]: any;
      };
      socialProviders?: {
        [name: string]: any;
      }[];
      systemInfo?: SystemInfoRepresentation;
      themes?: {
        [name: string]: any;
      };
    }
    /**
     * ServicePolicies
     * 
     * example:
     * {
     *   "auditMode": "...",
     *   "groupRoles": {
     *     "property1": [
     *       "...",
     *       "..."
     *     ],
     *     "property2": [
     *       "...",
     *       "..."
     *     ]
     *   },
     *   "policies": [
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     },
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     }
     *   ],
     *   "policyDeltas": [
     *     {
     *       "changeType": 12345,
     *       "id": 12345,
     *       "policy": {
     *         "allowExceptions": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "denyExceptions": [
     *           {},
     *           {}
     *         ],
     *         "denyPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "description": "...",
     *         "guid": "...",
     *         "id": 12345,
     *         "isAuditEnabled": true,
     *         "isDenyAllElse": true,
     *         "isEnabled": true,
     *         "name": "...",
     *         "options": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "policyItems": [
     *           {},
     *           {}
     *         ],
     *         "policyLabels": [
     *           "...",
     *           "..."
     *         ],
     *         "policyPriority": 12345,
     *         "policyType": 12345,
     *         "resourceSignature": "...",
     *         "resources": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "rowFilterPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "service": "...",
     *         "serviceType": "...",
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "validitySchedules": [
     *           {},
     *           {}
     *         ],
     *         "version": 12345,
     *         "zoneName": "..."
     *       }
     *     },
     *     {
     *       "changeType": 12345,
     *       "id": 12345,
     *       "policy": {
     *         "allowExceptions": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "denyExceptions": [
     *           {},
     *           {}
     *         ],
     *         "denyPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "description": "...",
     *         "guid": "...",
     *         "id": 12345,
     *         "isAuditEnabled": true,
     *         "isDenyAllElse": true,
     *         "isEnabled": true,
     *         "name": "...",
     *         "options": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "policyItems": [
     *           {},
     *           {}
     *         ],
     *         "policyLabels": [
     *           "...",
     *           "..."
     *         ],
     *         "policyPriority": 12345,
     *         "policyType": 12345,
     *         "resourceSignature": "...",
     *         "resources": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "rowFilterPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "service": "...",
     *         "serviceType": "...",
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "validitySchedules": [
     *           {},
     *           {}
     *         ],
     *         "version": 12345,
     *         "zoneName": "..."
     *       }
     *     }
     *   ],
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "securityZones": {
     *     "property1": {
     *       "containsAssociatedTagService": true,
     *       "policies": [
     *         {
     *           "allowExceptions": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "createTime": 12345,
     *           "createdBy": "...",
     *           "dataMaskPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "denyExceptions": [
     *             {},
     *             {}
     *           ],
     *           "denyPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "description": "...",
     *           "guid": "...",
     *           "id": 12345,
     *           "isAuditEnabled": true,
     *           "isDenyAllElse": true,
     *           "isEnabled": true,
     *           "name": "...",
     *           "options": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "policyItems": [
     *             {},
     *             {}
     *           ],
     *           "policyLabels": [
     *             "...",
     *             "..."
     *           ],
     *           "policyPriority": 12345,
     *           "policyType": 12345,
     *           "resourceSignature": "...",
     *           "resources": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "rowFilterPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "service": "...",
     *           "serviceType": "...",
     *           "updateTime": 12345,
     *           "updatedBy": "...",
     *           "validitySchedules": [
     *             {},
     *             {}
     *           ],
     *           "version": 12345,
     *           "zoneName": "..."
     *         },
     *         {
     *           "allowExceptions": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "createTime": 12345,
     *           "createdBy": "...",
     *           "dataMaskPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "denyExceptions": [
     *             {},
     *             {}
     *           ],
     *           "denyPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "description": "...",
     *           "guid": "...",
     *           "id": 12345,
     *           "isAuditEnabled": true,
     *           "isDenyAllElse": true,
     *           "isEnabled": true,
     *           "name": "...",
     *           "options": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "policyItems": [
     *             {},
     *             {}
     *           ],
     *           "policyLabels": [
     *             "...",
     *             "..."
     *           ],
     *           "policyPriority": 12345,
     *           "policyType": 12345,
     *           "resourceSignature": "...",
     *           "resources": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "rowFilterPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "service": "...",
     *           "serviceType": "...",
     *           "updateTime": 12345,
     *           "updatedBy": "...",
     *           "validitySchedules": [
     *             {},
     *             {}
     *           ],
     *           "version": 12345,
     *           "zoneName": "..."
     *         }
     *       ],
     *       "policyDeltas": [
     *         {
     *           "changeType": 12345,
     *           "id": 12345,
     *           "policy": {}
     *         },
     *         {
     *           "changeType": 12345,
     *           "id": 12345,
     *           "policy": {}
     *         }
     *       ],
     *       "resources": [
     *         {
     *           "property1": [],
     *           "property2": []
     *         },
     *         {
     *           "property1": [],
     *           "property2": []
     *         }
     *       ],
     *       "zoneName": "..."
     *     },
     *     "property2": {
     *       "containsAssociatedTagService": true,
     *       "policies": [
     *         {
     *           "allowExceptions": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "createTime": 12345,
     *           "createdBy": "...",
     *           "dataMaskPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "denyExceptions": [
     *             {},
     *             {}
     *           ],
     *           "denyPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "description": "...",
     *           "guid": "...",
     *           "id": 12345,
     *           "isAuditEnabled": true,
     *           "isDenyAllElse": true,
     *           "isEnabled": true,
     *           "name": "...",
     *           "options": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "policyItems": [
     *             {},
     *             {}
     *           ],
     *           "policyLabels": [
     *             "...",
     *             "..."
     *           ],
     *           "policyPriority": 12345,
     *           "policyType": 12345,
     *           "resourceSignature": "...",
     *           "resources": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "rowFilterPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "service": "...",
     *           "serviceType": "...",
     *           "updateTime": 12345,
     *           "updatedBy": "...",
     *           "validitySchedules": [
     *             {},
     *             {}
     *           ],
     *           "version": 12345,
     *           "zoneName": "..."
     *         },
     *         {
     *           "allowExceptions": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "createTime": 12345,
     *           "createdBy": "...",
     *           "dataMaskPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "denyExceptions": [
     *             {},
     *             {}
     *           ],
     *           "denyPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "description": "...",
     *           "guid": "...",
     *           "id": 12345,
     *           "isAuditEnabled": true,
     *           "isDenyAllElse": true,
     *           "isEnabled": true,
     *           "name": "...",
     *           "options": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "policyItems": [
     *             {},
     *             {}
     *           ],
     *           "policyLabels": [
     *             "...",
     *             "..."
     *           ],
     *           "policyPriority": 12345,
     *           "policyType": 12345,
     *           "resourceSignature": "...",
     *           "resources": {
     *             "property1": {},
     *             "property2": {}
     *           },
     *           "rowFilterPolicyItems": [
     *             {},
     *             {}
     *           ],
     *           "service": "...",
     *           "serviceType": "...",
     *           "updateTime": 12345,
     *           "updatedBy": "...",
     *           "validitySchedules": [
     *             {},
     *             {}
     *           ],
     *           "version": 12345,
     *           "zoneName": "..."
     *         }
     *       ],
     *       "policyDeltas": [
     *         {
     *           "changeType": 12345,
     *           "id": 12345,
     *           "policy": {}
     *         },
     *         {
     *           "changeType": 12345,
     *           "id": 12345,
     *           "policy": {}
     *         }
     *       ],
     *       "resources": [
     *         {
     *           "property1": [],
     *           "property2": []
     *         },
     *         {
     *           "property1": [],
     *           "property2": []
     *         }
     *       ],
     *       "zoneName": "..."
     *     }
     *   },
     *   "serviceDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "configs": [
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "contextEnrichers": [
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "maskTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "description": "...",
     *     "enums": [
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "guid": "...",
     *     "id": 12345,
     *     "implClass": "...",
     *     "isEnabled": true,
     *     "label": "...",
     *     "name": "...",
     *     "options": {
     *       "property1": "...",
     *       "property2": "..."
     *     },
     *     "policyConditions": [
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rbKeyDescription": "...",
     *     "rbKeyLabel": "...",
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rowFilterDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "version": 12345
     *   },
     *   "serviceId": 12345,
     *   "serviceName": "...",
     *   "tagPolicies": {
     *     "auditMode": "...",
     *     "policies": [
     *       {
     *         "allowExceptions": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "denyExceptions": [
     *           {},
     *           {}
     *         ],
     *         "denyPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "description": "...",
     *         "guid": "...",
     *         "id": 12345,
     *         "isAuditEnabled": true,
     *         "isDenyAllElse": true,
     *         "isEnabled": true,
     *         "name": "...",
     *         "options": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "policyItems": [
     *           {},
     *           {}
     *         ],
     *         "policyLabels": [
     *           "...",
     *           "..."
     *         ],
     *         "policyPriority": 12345,
     *         "policyType": 12345,
     *         "resourceSignature": "...",
     *         "resources": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "rowFilterPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "service": "...",
     *         "serviceType": "...",
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "validitySchedules": [
     *           {},
     *           {}
     *         ],
     *         "version": 12345,
     *         "zoneName": "..."
     *       },
     *       {
     *         "allowExceptions": [
     *           {},
     *           {}
     *         ],
     *         "conditions": [
     *           {},
     *           {}
     *         ],
     *         "createTime": 12345,
     *         "createdBy": "...",
     *         "dataMaskPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "denyExceptions": [
     *           {},
     *           {}
     *         ],
     *         "denyPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "description": "...",
     *         "guid": "...",
     *         "id": 12345,
     *         "isAuditEnabled": true,
     *         "isDenyAllElse": true,
     *         "isEnabled": true,
     *         "name": "...",
     *         "options": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "policyItems": [
     *           {},
     *           {}
     *         ],
     *         "policyLabels": [
     *           "...",
     *           "..."
     *         ],
     *         "policyPriority": 12345,
     *         "policyType": 12345,
     *         "resourceSignature": "...",
     *         "resources": {
     *           "property1": {},
     *           "property2": {}
     *         },
     *         "rowFilterPolicyItems": [
     *           {},
     *           {}
     *         ],
     *         "service": "...",
     *         "serviceType": "...",
     *         "updateTime": 12345,
     *         "updatedBy": "...",
     *         "validitySchedules": [
     *           {},
     *           {}
     *         ],
     *         "version": 12345,
     *         "zoneName": "..."
     *       }
     *     ],
     *     "policyUpdateTime": 12345,
     *     "policyVersion": 12345,
     *     "serviceDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "configs": [
     *         {},
     *         {}
     *       ],
     *       "contextEnrichers": [
     *         {},
     *         {}
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskDef": {},
     *       "description": "...",
     *       "enums": [
     *         {},
     *         {}
     *       ],
     *       "guid": "...",
     *       "id": 12345,
     *       "implClass": "...",
     *       "isEnabled": true,
     *       "label": "...",
     *       "name": "...",
     *       "options": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "policyConditions": [
     *         {},
     *         {}
     *       ],
     *       "rbKeyDescription": "...",
     *       "rbKeyLabel": "...",
     *       "resources": [
     *         {},
     *         {}
     *       ],
     *       "rowFilterDef": {},
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     },
     *     "serviceId": 12345,
     *     "serviceName": "..."
     *   },
     *   "userRoles": {
     *     "property1": [
     *       "...",
     *       "..."
     *     ],
     *     "property2": [
     *       "...",
     *       "..."
     *     ]
     *   }
     * }
     */
    export interface ServicePolicies {
      /**
       * 
       */
      auditMode?: any;
      /**
       * 
       */
      groupRoles?: {
        [name: string]: any[];
      };
      /**
       * 
       */
      policies?: RangerPolicy[];
      /**
       * 
       */
      policyDeltas?: RangerPolicyDelta[];
      /**
       * 
       */
      policyUpdateTime?: number;
      /**
       * 
       */
      policyVersion?: number;
      /**
       * 
       */
      securityZones?: {
        [name: string]: SecurityZoneInfo;
      };
      serviceDef?: RangerServiceDef;
      /**
       * 
       */
      serviceId?: number;
      /**
       * 
       */
      serviceName?: any;
      tagPolicies?: TagPolicies;
      /**
       * 
       */
      userRoles?: {
        [name: string]: any[];
      };
    }
    /**
     * ServiceTags
     * 
     * example:
     * {
     *   "op": "...",
     *   "resourceToTagIds": {
     *     "property1": [
     *       12345,
     *       12345
     *     ],
     *     "property2": [
     *       12345,
     *       12345
     *     ]
     *   },
     *   "serviceName": "...",
     *   "serviceResources": [
     *     {
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "resourceElements": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "resourceSignature": "...",
     *       "serviceName": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     },
     *     {
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "resourceElements": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "resourceSignature": "...",
     *       "serviceName": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   ],
     *   "tagDefinitions": {
     *     "property1": {
     *       "attributeDefs": [
     *         {
     *           "name": "...",
     *           "type": "..."
     *         },
     *         {
     *           "name": "...",
     *           "type": "..."
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "source": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     },
     *     "property2": {
     *       "attributeDefs": [
     *         {
     *           "name": "...",
     *           "type": "..."
     *         },
     *         {
     *           "name": "...",
     *           "type": "..."
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "name": "...",
     *       "source": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "version": 12345
     *     }
     *   },
     *   "tagUpdateTime": 12345,
     *   "tagVersion": 12345,
     *   "tags": {
     *     "property1": {
     *       "attributes": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "owner": 12345,
     *       "type": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validityPeriods": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345
     *     },
     *     "property2": {
     *       "attributes": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isEnabled": true,
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "owner": 12345,
     *       "type": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validityPeriods": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345
     *     }
     *   }
     * }
     */
    export interface ServiceTags {
      /**
       * 
       */
      op?: any;
      /**
       * 
       */
      resourceToTagIds?: {
        [name: string]: number[];
      };
      /**
       * 
       */
      serviceName?: any;
      /**
       * 
       */
      serviceResources?: RangerServiceResource[];
      /**
       * 
       */
      tagDefinitions?: {
        [name: string]: RangerTagDef;
      };
      /**
       * 
       */
      tagUpdateTime?: number;
      /**
       * 
       */
      tagVersion?: number;
      /**
       * 
       */
      tags?: {
        [name: string]: RangerTag;
      };
    }
    /**
     * Smtp config test
     */
    export interface SmtpConfigTest {
      host: string;
      password: string;
      port?: number;
      sslEnabled?: boolean;
      tlsEnabled?: boolean;
      username: string;
    }
    export interface SpiInfoRepresentation {
      internal?: boolean;
      providers?: {
        [name: string]: any;
      };
    }
    export interface SynchronizationResult {
      added?: number; // int32
      failed?: number; // int32
      ignored?: boolean;
      removed?: number; // int32
      status?: string;
      updated?: number; // int32
    }
    export interface SystemInfoRepresentation {
      fileEncoding?: string;
      javaHome?: string;
      javaRuntime?: string;
      javaVendor?: string;
      javaVersion?: string;
      javaVm?: string;
      javaVmVersion?: string;
      osArchitecture?: string;
      osName?: string;
      osVersion?: string;
      serverTime?: string;
      uptime?: string;
      uptimeMillis?: number; // int64
      userDir?: string;
      userLocale?: string;
      userName?: string;
      userTimezone?: string;
      version?: string;
    }
    /**
     * TagPolicies
     * 
     * example:
     * {
     *   "auditMode": "...",
     *   "policies": [
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     },
     *     {
     *       "allowExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "conditions": [
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "type": "...",
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "createTime": 12345,
     *       "createdBy": "...",
     *       "dataMaskPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "dataMaskInfo": {},
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyExceptions": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "denyPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "description": "...",
     *       "guid": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isDenyAllElse": true,
     *       "isEnabled": true,
     *       "name": "...",
     *       "options": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "policyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabels": [
     *         "...",
     *         "..."
     *       ],
     *       "policyPriority": 12345,
     *       "policyType": 12345,
     *       "resourceSignature": "...",
     *       "resources": {
     *         "property1": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         "property2": {
     *           "isExcludes": true,
     *           "isRecursive": true,
     *           "values": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       },
     *       "rowFilterPolicyItems": [
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "accesses": [
     *             {},
     *             {}
     *           ],
     *           "conditions": [
     *             {},
     *             {}
     *           ],
     *           "delegateAdmin": true,
     *           "groups": [
     *             "...",
     *             "..."
     *           ],
     *           "roles": [
     *             "...",
     *             "..."
     *           ],
     *           "rowFilterInfo": {},
     *           "users": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "service": "...",
     *       "serviceType": "...",
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "validitySchedules": [
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         },
     *         {
     *           "endTime": "...",
     *           "recurrences": [
     *             {},
     *             {}
     *           ],
     *           "startTime": "...",
     *           "timeZone": "..."
     *         }
     *       ],
     *       "version": 12345,
     *       "zoneName": "..."
     *     }
     *   ],
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "serviceDef": {
     *     "accessTypes": [
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       },
     *       {
     *         "impliedGrants": [
     *           "...",
     *           "..."
     *         ],
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyLabel": "..."
     *       }
     *     ],
     *     "configs": [
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "defaultValue": "...",
     *         "description": "...",
     *         "itemId": 12345,
     *         "label": "...",
     *         "mandatory": true,
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "subType": "...",
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "contextEnrichers": [
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "enricher": "...",
     *         "enricherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "createTime": 12345,
     *     "createdBy": "...",
     *     "dataMaskDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "maskTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "description": "...",
     *     "enums": [
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       },
     *       {
     *         "defaultIndex": 12345,
     *         "elements": [
     *           {},
     *           {}
     *         ],
     *         "itemId": 12345,
     *         "name": "..."
     *       }
     *     ],
     *     "guid": "...",
     *     "id": 12345,
     *     "implClass": "...",
     *     "isEnabled": true,
     *     "label": "...",
     *     "name": "...",
     *     "options": {
     *       "property1": "...",
     *       "property2": "..."
     *     },
     *     "policyConditions": [
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "description": "...",
     *         "evaluator": "...",
     *         "evaluatorOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "itemId": 12345,
     *         "label": "...",
     *         "name": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rbKeyDescription": "...",
     *     "rbKeyLabel": "...",
     *     "resources": [
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       },
     *       {
     *         "accessTypeRestrictions": [
     *           "...",
     *           "..."
     *         ],
     *         "description": "...",
     *         "excludesSupported": true,
     *         "isValidLeaf": true,
     *         "itemId": 12345,
     *         "label": "...",
     *         "level": 12345,
     *         "lookupSupported": true,
     *         "mandatory": true,
     *         "matcher": "...",
     *         "matcherOptions": {
     *           "property1": "...",
     *           "property2": "..."
     *         },
     *         "name": "...",
     *         "parent": "...",
     *         "rbKeyDescription": "...",
     *         "rbKeyLabel": "...",
     *         "rbKeyValidationMessage": "...",
     *         "recursiveSupported": true,
     *         "type": "...",
     *         "uiHint": "...",
     *         "validationMessage": "...",
     *         "validationRegEx": "..."
     *       }
     *     ],
     *     "rowFilterDef": {
     *       "accessTypes": [
     *         {},
     *         {}
     *       ],
     *       "resources": [
     *         {},
     *         {}
     *       ]
     *     },
     *     "updateTime": 12345,
     *     "updatedBy": "...",
     *     "version": 12345
     *   },
     *   "serviceId": 12345,
     *   "serviceName": "..."
     * }
     */
    export interface TagPolicies {
      /**
       * 
       */
      auditMode?: any;
      /**
       * 
       */
      policies?: RangerPolicy[];
      /**
       * 
       */
      policyUpdateTime?: number;
      /**
       * 
       */
      policyVersion?: number;
      serviceDef?: RangerServiceDef;
      /**
       * 
       */
      serviceId?: number;
      /**
       * 
       */
      serviceName?: any;
    }
    export interface TermRequest {
      action?: string;
      glossaryId?: string;
      termId?: string;
    }
    export interface TestLdapConnectionRepresentation {
      action?: string;
      bindCredential?: string;
      bindDn?: string;
      componentId?: string;
      connectionTimeout?: string;
      connectionUrl?: string;
      startTls?: string;
      useTruststoreSpi?: string;
    }
    /**
     * Update Notification
     */
    export interface UpdateNotification {
      delivered?: boolean;
      read?: boolean;
    }
    export interface UpdatePassword {
      oldPassword: string;
      password: string;
      temporary?: boolean;
      username: string;
    }
    /**
     * New Tenant
     */
    export interface UpdateRegistrationInfo {
      allowRegistration?: boolean;
      domainRestriction?: string[];
    }
    /**
     * Update Request
     */
    export interface UpdateRequest {
      action: "approved" | "rejected";
      message?: string;
    }
    /**
     * Update Template
     */
    export interface UpdateTemplate {
      description?: string;
      message_base64?: string;
      message_title?: string;
      name?: string;
    }
    /**
     * Update UserAssetSuggestion
     */
    export interface UpdateUserAssetSuggestion {
      asset?: string;
      assetId?: string;
      status?: string;
      suggestionType?: string;
      userId?: string;
    }
    export interface UpdateUserRole {
      roleId: string;
    }
    export interface UserConsentRepresentation {
      clientId?: string;
      createdDate?: number; // int64
      grantedClientScopes?: string[];
      lastUpdatedDate?: number; // int64
    }
    export interface UserFederationMapperRepresentation {
      config?: {
        [name: string]: any;
      };
      federationMapperType?: string;
      federationProviderDisplayName?: string;
      id?: string;
      name?: string;
    }
    export interface UserFederationProviderRepresentation {
      changedSyncPeriod?: number; // int32
      config?: {
        [name: string]: any;
      };
      displayName?: string;
      fullSyncPeriod?: number; // int32
      id?: string;
      lastSync?: number; // int32
      priority?: number; // int32
      providerName?: string;
    }
    export interface UserRepresentation {
      access?: {
        [name: string]: any;
      };
      attributes?: {
        [name: string]: any;
      };
      clientConsents?: UserConsentRepresentation[];
      clientRoles?: {
        [name: string]: any;
      };
      createdTimestamp?: number; // int64
      credentials?: CredentialRepresentation[];
      disableableCredentialTypes?: string[];
      email?: string;
      emailVerified?: boolean;
      enabled?: boolean;
      federatedIdentities?: FederatedIdentityRepresentation[];
      federationLink?: string;
      firstName?: string;
      groups?: string[];
      id?: string;
      lastName?: string;
      notBefore?: number; // int32
      origin?: string;
      realmRoles?: string[];
      requiredActions?: string[];
      self?: string;
      serviceAccountClientId?: string;
      username?: string;
    }
    export interface UserSessionRepresentation {
      clients?: {
        [name: string]: any;
      };
      id?: string;
      ipAddress?: string;
      lastAccess?: number; // int64
      start?: number; // int64
      userId?: string;
      username?: string;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "elementList": [
     *     {
     *       "elementLabel": "...",
     *       "elementName": "...",
     *       "elementValue": 12345,
     *       "enumName": "...",
     *       "myClassType": 12345,
     *       "rbKey": "..."
     *     },
     *     {
     *       "elementLabel": "...",
     *       "elementName": "...",
     *       "elementValue": 12345,
     *       "enumName": "...",
     *       "myClassType": 12345,
     *       "rbKey": "..."
     *     }
     *   ],
     *   "enumName": "...",
     *   "myClassType": 12345
     * }
     */
    export interface VEnum {
      /**
       * Returns the value for the member attribute <b>elementList<b>
       */
      elementList?: VEnumElement[];
      /**
       * Returns the value for the member attribute <b>enumName<b>
       */
      enumName?: any;
      /**
       * 
       */
      myClassType?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "elementLabel": "...",
     *   "elementName": "...",
     *   "elementValue": 12345,
     *   "enumName": "...",
     *   "myClassType": 12345,
     *   "rbKey": "..."
     * }
     */
    export interface VEnumElement {
      /**
       * Returns the value for the member attribute <b>elementLabel<b>
       */
      elementLabel?: any;
      /**
       * 
       */
      elementName?: any;
      /**
       * Returns the value for the member attribute <b>elementValue<b>
       */
      elementValue?: number; // int32
      /**
       * 
       */
      enumName?: any;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      rbKey?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345
     * }
     */
    export interface VList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "attribUserFriendlyName": "...",
     *   "enum": true,
     *   "myClassType": 12345
     * }
     */
    export interface VTrxLogAttr {
      /**
       * 
       */
      attribUserFriendlyName?: any;
      /**
       * 
       */
      enum?: boolean;
      /**
       * 
       */
      myClassType?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "accessResult": 12345,
     *   "accessType": "...",
     *   "aclEnforcer": "...",
     *   "action": "...",
     *   "agentHost": "...",
     *   "agentId": "...",
     *   "auditType": 12345,
     *   "clientIP": "...",
     *   "clientType": "...",
     *   "clusterName": "...",
     *   "createDate": 12345,
     *   "eventCount": 12345,
     *   "eventDuration": 12345,
     *   "eventTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "policyId": 12345,
     *   "policyVersion": 12345,
     *   "repoName": "...",
     *   "repoType": 12345,
     *   "requestData": "...",
     *   "requestUser": "...",
     *   "resourcePath": "...",
     *   "resourceType": "...",
     *   "resultReason": "...",
     *   "sequenceNumber": 12345,
     *   "serviceType": "...",
     *   "sessionId": "...",
     *   "tags": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "zoneName": "..."
     * }
     */
    export interface VXAccessAudit {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>accessResult<b>
       */
      accessResult?: number; // int32
      /**
       * Returns the value for the member attribute <b>accessType<b>
       */
      accessType?: any;
      /**
       * Returns the value for the member attribute <b>aclEnforcer<b>
       */
      aclEnforcer?: any;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * 
       */
      agentHost?: any;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * Returns the value for the member attribute <b>clientType<b>
       */
      clientType?: any;
      /**
       * 
       */
      clusterName?: any;
      /**
       * 
       */
      eventCount?: number; // int64
      /**
       * 
       */
      eventDuration?: number; // int64
      /**
       * Returns the value for the member attribute <b>eventTime<b>
       */
      eventTime?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number; // int64
      /**
       * 
       */
      policyVersion?: number;
      /**
       * Returns the value for the member attribute <b>repoName<b>
       */
      repoName?: any;
      /**
       * Returns the value for the member attribute <b>repoType<b>
       */
      repoType?: number; // int32
      /**
       * Returns the value for the member attribute <b>requestData<b>
       */
      requestData?: any;
      /**
       * Returns the value for the member attribute <b>requestUser<b>
       */
      requestUser?: any;
      /**
       * Returns the value for the member attribute <b>resourcePath<b>
       */
      resourcePath?: any;
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: any;
      /**
       * Returns the value for the member attribute <b>resultReason<b>
       */
      resultReason?: any;
      /**
       * 
       */
      sequenceNumber?: number; // int64
      /**
       * 
       */
      serviceType?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
      /**
       * 
       */
      tags?: any;
      /**
       * 
       */
      zoneName?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXAccessAudits": [
     *     {
     *       "accessResult": 12345,
     *       "accessType": "...",
     *       "aclEnforcer": "...",
     *       "action": "...",
     *       "agentHost": "...",
     *       "agentId": "...",
     *       "auditType": 12345,
     *       "clientIP": "...",
     *       "clientType": "...",
     *       "clusterName": "...",
     *       "createDate": 12345,
     *       "eventCount": 12345,
     *       "eventDuration": 12345,
     *       "eventTime": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "policyId": 12345,
     *       "policyVersion": 12345,
     *       "repoName": "...",
     *       "repoType": 12345,
     *       "requestData": "...",
     *       "requestUser": "...",
     *       "resourcePath": "...",
     *       "resourceType": "...",
     *       "resultReason": "...",
     *       "sequenceNumber": 12345,
     *       "serviceType": "...",
     *       "sessionId": "...",
     *       "tags": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "zoneName": "..."
     *     },
     *     {
     *       "accessResult": 12345,
     *       "accessType": "...",
     *       "aclEnforcer": "...",
     *       "action": "...",
     *       "agentHost": "...",
     *       "agentId": "...",
     *       "auditType": 12345,
     *       "clientIP": "...",
     *       "clientType": "...",
     *       "clusterName": "...",
     *       "createDate": 12345,
     *       "eventCount": 12345,
     *       "eventDuration": 12345,
     *       "eventTime": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "policyId": 12345,
     *       "policyVersion": 12345,
     *       "repoName": "...",
     *       "repoType": 12345,
     *       "requestData": "...",
     *       "requestUser": "...",
     *       "resourcePath": "...",
     *       "resourceType": "...",
     *       "resultReason": "...",
     *       "sequenceNumber": 12345,
     *       "serviceType": "...",
     *       "sessionId": "...",
     *       "tags": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "zoneName": "..."
     *     }
     *   ]
     * }
     */
    export interface VXAccessAuditList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXAccessAudits?: VXAccessAudit[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "activeStatus": 12345,
     *   "assetType": 12345,
     *   "config": "...",
     *   "createDate": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "supportNative": true,
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXAsset {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>activeStatus<b>
       */
      activeStatus?: number; // int32
      /**
       * Returns the value for the member attribute <b>assetType<b>
       */
      assetType?: number; // int32
      /**
       * Returns the value for the member attribute <b>config<b>
       */
      config?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>supportNative<b>
       */
      supportNative?: boolean;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXAssets": [
     *     {
     *       "activeStatus": 12345,
     *       "assetType": 12345,
     *       "config": "...",
     *       "createDate": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "supportNative": true,
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "activeStatus": 12345,
     *       "assetType": 12345,
     *       "config": "...",
     *       "createDate": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "supportNative": true,
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXAssetList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXAssets?: VXAsset[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "auditType": 12345,
     *   "createDate": 12345,
     *   "groupId": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "resourceId": 12345,
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userId": 12345
     * }
     */
    export interface VXAuditMap {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>resourceId<b>
       */
      resourceId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXAuditMaps": [
     *     {
     *       "auditType": 12345,
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     },
     *     {
     *       "auditType": 12345,
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     }
     *   ]
     * }
     */
    export interface VXAuditMapList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXAuditMaps?: VXAuditMap[];
    }
    /**
     * VXAuditRecord
     * 
     * example:
     * {
     *   "action": "...",
     *   "assetType": 12345,
     *   "date": 12345,
     *   "enforcer": "...",
     *   "resource": "...",
     *   "resourceType": 12345,
     *   "result": "...",
     *   "user": "..."
     * }
     */
    export interface VXAuditRecord {
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>assetType<b>
       */
      assetType?: number; // int32
      /**
       * Returns the value for the member attribute <b>date<b>
       */
      date?: number;
      /**
       * 
       */
      enforcer?: any;
      /**
       * Returns the value for the member attribute <b>resource<b>
       */
      resource?: any;
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: number; // int32
      /**
       * Returns the value for the member attribute <b>result<b>
       */
      result?: any;
      /**
       * Returns the value for the member attribute <b>user<b>
       */
      user?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXAuditRecords": [
     *     {
     *       "action": "...",
     *       "assetType": 12345,
     *       "date": 12345,
     *       "enforcer": "...",
     *       "resource": "...",
     *       "resourceType": 12345,
     *       "result": "...",
     *       "user": "..."
     *     },
     *     {
     *       "action": "...",
     *       "assetType": 12345,
     *       "date": 12345,
     *       "enforcer": "...",
     *       "resource": "...",
     *       "resourceType": 12345,
     *       "result": "...",
     *       "user": "..."
     *     }
     *   ]
     * }
     */
    export interface VXAuditRecordList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXAuditRecords?: VXAuditRecord[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "authProvider": 12345,
     *   "authStatus": 12345,
     *   "authTime": 12345,
     *   "authType": 12345,
     *   "cityName": "...",
     *   "countryName": "...",
     *   "createDate": 12345,
     *   "deviceType": 12345,
     *   "emailAddress": "...",
     *   "familyScreenName": "...",
     *   "firstName": "...",
     *   "id": 12345,
     *   "isTestUser": true,
     *   "lastName": "...",
     *   "loginId": "...",
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "publicScreenName": "...",
     *   "requestIP": "...",
     *   "requestUserAgent": "...",
     *   "stateName": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userId": 12345
     * }
     */
    export interface VXAuthSession {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>authProvider<b>
       */
      authProvider?: number; // int32
      /**
       * Returns the value for the member attribute <b>authStatus<b>
       */
      authStatus?: number; // int32
      /**
       * Returns the value for the member attribute <b>authTime<b>
       */
      authTime?: number;
      /**
       * Returns the value for the member attribute <b>authType<b>
       */
      authType?: number; // int32
      /**
       * Returns the value for the member attribute <b>cityName<b>
       */
      cityName?: any;
      /**
       * Returns the value for the member attribute <b>countryName<b>
       */
      countryName?: any;
      /**
       * Returns the value for the member attribute <b>deviceType<b>
       */
      deviceType?: number; // int32
      /**
       * Returns the value for the member attribute <b>emailAddress<b>
       */
      emailAddress?: any;
      /**
       * Returns the value for the member attribute <b>familyScreenName<b>
       */
      familyScreenName?: any;
      /**
       * Returns the value for the member attribute <b>firstName<b>
       */
      firstName?: any;
      /**
       * Returns the value for the member attribute <b>isTestUser<b>
       */
      isTestUser?: boolean;
      /**
       * Returns the value for the member attribute <b>lastName<b>
       */
      lastName?: any;
      /**
       * Returns the value for the member attribute <b>loginId<b>
       */
      loginId?: any;
      /**
       * Returns the value for the member attribute <b>publicScreenName<b>
       */
      publicScreenName?: any;
      /**
       * Returns the value for the member attribute <b>requestIP<b>
       */
      requestIP?: any;
      /**
       * Returns the value for the member attribute <b>requestUserAgent<b>
       */
      requestUserAgent?: any;
      /**
       * Returns the value for the member attribute <b>stateName<b>
       */
      stateName?: any;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXAuthSessions": [
     *     {
     *       "authProvider": 12345,
     *       "authStatus": 12345,
     *       "authTime": 12345,
     *       "authType": 12345,
     *       "cityName": "...",
     *       "countryName": "...",
     *       "createDate": 12345,
     *       "deviceType": 12345,
     *       "emailAddress": "...",
     *       "familyScreenName": "...",
     *       "firstName": "...",
     *       "id": 12345,
     *       "isTestUser": true,
     *       "lastName": "...",
     *       "loginId": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "publicScreenName": "...",
     *       "requestIP": "...",
     *       "requestUserAgent": "...",
     *       "stateName": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     },
     *     {
     *       "authProvider": 12345,
     *       "authStatus": 12345,
     *       "authTime": 12345,
     *       "authType": 12345,
     *       "cityName": "...",
     *       "countryName": "...",
     *       "createDate": 12345,
     *       "deviceType": 12345,
     *       "emailAddress": "...",
     *       "familyScreenName": "...",
     *       "firstName": "...",
     *       "id": 12345,
     *       "isTestUser": true,
     *       "lastName": "...",
     *       "loginId": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "publicScreenName": "...",
     *       "requestIP": "...",
     *       "requestUserAgent": "...",
     *       "stateName": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     }
     *   ]
     * }
     */
    export interface VXAuthSessionList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXAuthSessions?: VXAuthSession[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXCredentialStore {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXCredentialStores": [
     *     {
     *       "createDate": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXCredentialStoreList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXCredentialStores?: VXCredentialStore[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXDataObject {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
    }
    /**
     * VXFileSyncSourceInfo
     * 
     * example:
     * {
     *   "fileName": "...",
     *   "lastModified": "...",
     *   "syncTime": "...",
     *   "totalGroupsSynced": 12345,
     *   "totalUsersSynced": 12345
     * }
     */
    export interface VXFileSyncSourceInfo {
      /**
       * 
       */
      fileName?: any;
      /**
       * 
       */
      lastModified?: any;
      /**
       * 
       */
      syncTime?: any;
      /**
       * 
       */
      totalGroupsSynced?: number; // int64
      /**
       * 
       */
      totalUsersSynced?: number; // int64
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "credStoreId": 12345,
     *   "description": "...",
     *   "groupSource": 12345,
     *   "groupType": 12345,
     *   "id": 12345,
     *   "isVisible": 12345,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXGroup {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>credStoreId<b>
       */
      credStoreId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      groupSource?: number; // int32
      /**
       * Returns the value for the member attribute <b>groupType<b>
       */
      groupType?: number; // int32
      /**
       * 
       */
      isVisible?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "groupId": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "parentGroupId": 12345,
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXGroupGroup {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>parentGroupId<b>
       */
      parentGroupId?: number;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXGroupGroups": [
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "parentGroupId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "parentGroupId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXGroupGroupList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXGroupGroups?: VXGroupGroup[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXGroups": [
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "groupSource": 12345,
     *       "groupType": 12345,
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "groupSource": 12345,
     *       "groupType": 12345,
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXGroupList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXGroups?: VXGroup[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "groupId": 12345,
     *   "groupName": "...",
     *   "id": 12345,
     *   "isAllowed": 12345,
     *   "moduleId": 12345,
     *   "moduleName": "...",
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXGroupPermission {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      groupId?: number;
      /**
       * 
       */
      groupName?: any;
      /**
       * 
       */
      isAllowed?: number;
      /**
       * 
       */
      moduleId?: number;
      /**
       * 
       */
      moduleName?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXGroupPermission": [
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXGroupPermissionList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXGroupPermission?: VXGroupPermission[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "parentGroupId": 12345,
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userId": 12345
     * }
     */
    export interface VXGroupUser {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>parentGroupId<b>
       */
      parentGroupId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "xgroupInfo": {
     *     "createDate": 12345,
     *     "credStoreId": 12345,
     *     "description": "...",
     *     "groupSource": 12345,
     *     "groupType": 12345,
     *     "id": 12345,
     *     "isVisible": 12345,
     *     "myClassType": 12345,
     *     "name": "...",
     *     "owner": "...",
     *     "updateDate": 12345,
     *     "updatedBy": "..."
     *   },
     *   "xuserInfo": [
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "emailAddress": "...",
     *       "firstName": "...",
     *       "groupIdList": [
     *         12345,
     *         12345
     *       ],
     *       "groupNameList": [
     *         "...",
     *         "..."
     *       ],
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "lastName": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "password": "...",
     *       "status": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userRoleList": [
     *         "...",
     *         "..."
     *       ],
     *       "userSource": 12345
     *     },
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "emailAddress": "...",
     *       "firstName": "...",
     *       "groupIdList": [
     *         12345,
     *         12345
     *       ],
     *       "groupNameList": [
     *         "...",
     *         "..."
     *       ],
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "lastName": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "password": "...",
     *       "status": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userRoleList": [
     *         "...",
     *         "..."
     *       ],
     *       "userSource": 12345
     *     }
     *   ]
     * }
     */
    export interface VXGroupUserInfo {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      xgroupInfo?: VXGroup;
      /**
       * 
       */
      xuserInfo?: VXUser[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXGroupUsers": [
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "parentGroupId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     },
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "parentGroupId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     }
     *   ]
     * }
     */
    export interface VXGroupUserList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXGroupUsers?: VXGroupUser[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "attributes": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "cipher": "...",
     *   "createDate": 12345,
     *   "created": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "length": 12345,
     *   "material": "...",
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "versionName": "...",
     *   "versions": 12345
     * }
     */
    export interface VXKmsKey {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      attributes?: {
        [name: string]: any;
      };
      /**
       * 
       */
      cipher?: any;
      /**
       * 
       */
      created?: number;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      length?: number; // int32
      /**
       * 
       */
      material?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      versionName?: any;
      /**
       * 
       */
      versions?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXKeys": [
     *     {
     *       "attributes": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "cipher": "...",
     *       "createDate": 12345,
     *       "created": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "length": 12345,
     *       "material": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "versionName": "...",
     *       "versions": 12345
     *     },
     *     {
     *       "attributes": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "cipher": "...",
     *       "createDate": 12345,
     *       "created": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "length": 12345,
     *       "material": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "versionName": "...",
     *       "versions": 12345
     *     }
     *   ]
     * }
     */
    export interface VXKmsKeyList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXKeys?: VXKmsKey[];
    }
    /**
     * VXLdapSyncSourceInfo
     * 
     * example:
     * {
     *   "groupHierarchyLevel": "...",
     *   "groupSearchEnabled": "...",
     *   "groupSearchFilter": "...",
     *   "groupSearchFirstEnabled": "...",
     *   "ldapUrl": "...",
     *   "totalGroupsSynced": 12345,
     *   "totalUsersSynced": 12345,
     *   "userSearchEnabled": "...",
     *   "userSearchFilter": "..."
     * }
     */
    export interface VXLdapSyncSourceInfo {
      /**
       * 
       */
      groupHierarchyLevel?: any;
      /**
       * 
       */
      groupSearchEnabled?: any;
      /**
       * 
       */
      groupSearchFilter?: any;
      /**
       * 
       */
      groupSearchFirstEnabled?: any;
      /**
       * 
       */
      ldapUrl?: any;
      /**
       * 
       */
      totalGroupsSynced?: number; // int64
      /**
       * 
       */
      totalUsersSynced?: number; // int64
      /**
       * 
       */
      userSearchEnabled?: any;
      /**
       * 
       */
      userSearchFilter?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "myClassType": 12345,
     *   "value": 12345
     * }
     */
    export interface VXLong {
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>value<b>
       */
      value?: number; // int64
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "fieldName": "...",
     *   "message": "...",
     *   "myClassType": 12345,
     *   "name": "...",
     *   "objectId": 12345,
     *   "rbKey": "..."
     * }
     */
    export interface VXMessage {
      /**
       * Returns the value for the member attribute <b>fieldName<b>
       */
      fieldName?: any;
      /**
       * Returns the value for the member attribute <b>message<b>
       */
      message?: any;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>objectId<b>
       */
      objectId?: number;
      /**
       * Returns the value for the member attribute <b>rbKey<b>
       */
      rbKey?: any;
    }
    /**
     * VXMetricAuditDetailsCount
     * 
     * example:
     * {
     *   "accessEventsCountTwoDays": {
     *     "serviceBasedCountList": {
     *       "property1": 12345,
     *       "property2": 12345
     *     },
     *     "totalCount": 12345
     *   },
     *   "accessEventsCountWeek": {
     *     "serviceBasedCountList": {
     *       "property1": 12345,
     *       "property2": 12345
     *     },
     *     "totalCount": 12345
     *   },
     *   "denialEventsCountTwoDays": {
     *     "serviceBasedCountList": {
     *       "property1": 12345,
     *       "property2": 12345
     *     },
     *     "totalCount": 12345
     *   },
     *   "denialEventsCountWeek": {
     *     "serviceBasedCountList": {
     *       "property1": 12345,
     *       "property2": 12345
     *     },
     *     "totalCount": 12345
     *   },
     *   "solrIndexCountTwoDays": 12345,
     *   "solrIndexCountWeek": 12345
     * }
     */
    export interface VXMetricAuditDetailsCount {
      accessEventsCountTwoDays?: VXMetricServiceCount;
      accessEventsCountWeek?: VXMetricServiceCount;
      denialEventsCountTwoDays?: VXMetricServiceCount;
      denialEventsCountWeek?: VXMetricServiceCount;
      /**
       * 
       */
      solrIndexCountTwoDays?: number;
      /**
       * 
       */
      solrIndexCountWeek?: number;
    }
    /**
     * VXMetricPolicyCount
     * 
     * example:
     * {
     *   "policyCountList": {
     *     "property1": {
     *       "serviceBasedCountList": {
     *         "property1": 12345,
     *         "property2": 12345
     *       },
     *       "totalCount": 12345
     *     },
     *     "property2": {
     *       "serviceBasedCountList": {
     *         "property1": 12345,
     *         "property2": 12345
     *       },
     *       "totalCount": 12345
     *     }
     *   },
     *   "totalCount": 12345
     * }
     */
    export interface VXMetricPolicyCount {
      /**
       * 
       */
      policyCountList?: {
        [name: string]: VXMetricServiceCount;
      };
      /**
       * 
       */
      totalCount?: number; // int64
    }
    /**
     * VXMetricPolicyWithServiceNameCount
     * 
     * example:
     * {
     *   "policyCountList": {
     *     "property1": {
     *       "serviceBasedCountList": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "totalCount": 12345
     *     },
     *     "property2": {
     *       "serviceBasedCountList": {
     *         "property1": {},
     *         "property2": {}
     *       },
     *       "totalCount": 12345
     *     }
     *   },
     *   "totalCount": 12345
     * }
     */
    export interface VXMetricPolicyWithServiceNameCount {
      /**
       * 
       */
      policyCountList?: {
        [name: string]: VXMetricServiceNameCount;
      };
      /**
       * 
       */
      totalCount?: number; // int64
    }
    /**
     * VXMetricServiceCount
     * 
     * example:
     * {
     *   "serviceBasedCountList": {
     *     "property1": 12345,
     *     "property2": 12345
     *   },
     *   "totalCount": 12345
     * }
     */
    export interface VXMetricServiceCount {
      /**
       * 
       */
      serviceBasedCountList?: {
        [name: string]: number;
      };
      /**
       * 
       */
      totalCount?: number;
    }
    /**
     * VXMetricServiceNameCount
     * 
     * example:
     * {
     *   "serviceBasedCountList": {
     *     "property1": {},
     *     "property2": {}
     *   },
     *   "totalCount": 12345
     * }
     */
    export interface VXMetricServiceNameCount {
      /**
       * 
       */
      serviceBasedCountList?: {
        [name: string]: {
        };
      };
      /**
       * 
       */
      totalCount?: number;
    }
    /**
     * VXMetricUserGroupCount
     * 
     * example:
     * {
     *   "groupCount": 12345,
     *   "userCountOfKeyAdminRole": 12345,
     *   "userCountOfKeyadminAuditorRole": 12345,
     *   "userCountOfSysAdminAuditorRole": 12345,
     *   "userCountOfSysAdminRole": 12345,
     *   "userCountOfUserRole": 12345,
     *   "userTotalCount": 12345
     * }
     */
    export interface VXMetricUserGroupCount {
      /**
       * 
       */
      groupCount?: number;
      /**
       * 
       */
      userCountOfKeyAdminRole?: number;
      /**
       * 
       */
      userCountOfKeyadminAuditorRole?: number;
      /**
       * 
       */
      userCountOfSysAdminAuditorRole?: number;
      /**
       * 
       */
      userCountOfSysAdminRole?: number;
      /**
       * 
       */
      userCountOfUserRole?: number;
      /**
       * 
       */
      userTotalCount?: number;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "addedById": 12345,
     *   "createDate": 12345,
     *   "createTime": 12345,
     *   "groupPermList": [
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ],
     *   "id": 12345,
     *   "module": "...",
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updateTime": 12345,
     *   "updatedBy": "...",
     *   "updatedById": 12345,
     *   "url": "...",
     *   "userPermList": [
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "loginId": "...",
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "loginId": "...",
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     }
     *   ]
     * }
     */
    export interface VXModuleDef {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      addedById?: number;
      /**
       * 
       */
      createTime?: number;
      /**
       * 
       */
      groupPermList?: VXGroupPermission[];
      /**
       * 
       */
      module?: any;
      /**
       * 
       */
      updateTime?: number;
      /**
       * 
       */
      updatedById?: number;
      /**
       * 
       */
      url?: any;
      /**
       * 
       */
      userPermList?: VXUserPermission[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXModuleDef": [
     *     {
     *       "addedById": 12345,
     *       "createDate": 12345,
     *       "createTime": 12345,
     *       "groupPermList": [
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         }
     *       ],
     *       "id": 12345,
     *       "module": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "updatedById": 12345,
     *       "url": "...",
     *       "userPermList": [
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         }
     *       ]
     *     },
     *     {
     *       "addedById": 12345,
     *       "createDate": 12345,
     *       "createTime": 12345,
     *       "groupPermList": [
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         }
     *       ],
     *       "id": 12345,
     *       "module": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updateTime": 12345,
     *       "updatedBy": "...",
     *       "updatedById": 12345,
     *       "url": "...",
     *       "userPermList": [
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         }
     *       ]
     *     }
     *   ]
     * }
     */
    export interface VXModuleDefList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXModuleDef?: VXModuleDef[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "emailAddress": "...",
     *   "id": 12345,
     *   "loginId": "...",
     *   "myClassType": 12345,
     *   "oldPassword": "...",
     *   "resetCode": "...",
     *   "updPassword": "..."
     * }
     */
    export interface VXPasswordChange {
      /**
       * Returns the value for the member attribute <b>emailAddress<b>
       */
      emailAddress?: any;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * Returns the value for the member attribute <b>loginId<b>
       */
      loginId?: any;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>oldPassword<b>
       */
      oldPassword?: any;
      /**
       * Returns the value for the member attribute <b>resetCode<b>
       */
      resetCode?: any;
      /**
       * Returns the value for the member attribute <b>updPassword<b>
       */
      updPassword?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "grantOrRevoke": true,
     *   "groupId": 12345,
     *   "groupName": "...",
     *   "id": 12345,
     *   "ipAddress": "...",
     *   "isRecursive": 12345,
     *   "isWildCard": true,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "permFor": 12345,
     *   "permGroup": "...",
     *   "permType": 12345,
     *   "resourceId": 12345,
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userId": 12345,
     *   "userName": "..."
     * }
     */
    export interface VXPermMap {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>grantOrRevoke<b>
       */
      grantOrRevoke?: boolean;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>groupName<b>
       */
      groupName?: any;
      /**
       * 
       */
      ipAddress?: any;
      /**
       * Returns the value for the member attribute <b>isRecursive<b>
       */
      isRecursive?: number; // int32
      /**
       * Returns the value for the member attribute <b>isWildCard<b>
       */
      isWildCard?: boolean;
      /**
       * Returns the value for the member attribute <b>permFor<b>
       */
      permFor?: number; // int32
      /**
       * Returns the value for the member attribute <b>permGroup<b>
       */
      permGroup?: any;
      /**
       * Returns the value for the member attribute <b>permType<b>
       */
      permType?: number; // int32
      /**
       * Returns the value for the member attribute <b>resourceId<b>
       */
      resourceId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
      /**
       * Returns the value for the member attribute <b>userName<b>
       */
      userName?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXPermMaps": [
     *     {
     *       "createDate": 12345,
     *       "grantOrRevoke": true,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "ipAddress": "...",
     *       "isRecursive": 12345,
     *       "isWildCard": true,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "permFor": 12345,
     *       "permGroup": "...",
     *       "permType": 12345,
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "grantOrRevoke": true,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "ipAddress": "...",
     *       "isRecursive": 12345,
     *       "isWildCard": true,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "permFor": 12345,
     *       "permGroup": "...",
     *       "permType": 12345,
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     }
     *   ]
     * }
     */
    export interface VXPermMapList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXPermMaps?: VXPermMap[];
    }
    /**
     * VXPermObj
     * 
     * example:
     * {
     *   "groupList": [
     *     "...",
     *     "..."
     *   ],
     *   "ipAddress": "...",
     *   "permList": [
     *     "...",
     *     "..."
     *   ],
     *   "userList": [
     *     "...",
     *     "..."
     *   ]
     * }
     */
    export interface VXPermObj {
      /**
       * 
       */
      groupList?: any[];
      /**
       * 
       */
      ipAddress?: any;
      /**
       * 
       */
      permList?: any[];
      /**
       * 
       */
      userList?: any[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXPermObjs": [
     *     {
     *       "groupList": [
     *         "...",
     *         "..."
     *       ],
     *       "ipAddress": "...",
     *       "permList": [
     *         "...",
     *         "..."
     *       ],
     *       "userList": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "groupList": [
     *         "...",
     *         "..."
     *       ],
     *       "ipAddress": "...",
     *       "permList": [
     *         "...",
     *         "..."
     *       ],
     *       "userList": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ]
     * }
     */
    export interface VXPermObjList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXPermObjs?: VXPermObj[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "columnFamilies": "...",
     *   "columnType": "...",
     *   "columns": "...",
     *   "createDate": 12345,
     *   "databases": "...",
     *   "description": "...",
     *   "grantor": "...",
     *   "hiveServices": "...",
     *   "id": 12345,
     *   "isAuditEnabled": true,
     *   "isEnabled": true,
     *   "isRecursive": true,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "permMapList": [
     *     {
     *       "groupList": [
     *         "...",
     *         "..."
     *       ],
     *       "ipAddress": "...",
     *       "permList": [
     *         "...",
     *         "..."
     *       ],
     *       "userList": [
     *         "...",
     *         "..."
     *       ]
     *     },
     *     {
     *       "groupList": [
     *         "...",
     *         "..."
     *       ],
     *       "ipAddress": "...",
     *       "permList": [
     *         "...",
     *         "..."
     *       ],
     *       "userList": [
     *         "...",
     *         "..."
     *       ]
     *     }
     *   ],
     *   "policyLabel": "...",
     *   "policyName": "...",
     *   "replacePerm": true,
     *   "repositoryName": "...",
     *   "repositoryType": "...",
     *   "resourceName": "...",
     *   "services": "...",
     *   "tableType": "...",
     *   "tables": "...",
     *   "topologies": "...",
     *   "udfs": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "version": "..."
     * }
     */
    export interface VXPolicy {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>columnFamilies<b>
       */
      columnFamilies?: any;
      /**
       * Returns the value for the member attribute <b>columnType<b>
       */
      columnType?: any;
      /**
       * Returns the value for the member attribute <b>columns<b>
       */
      columns?: any;
      /**
       * Returns the value for the member attribute <b>databases<b>
       */
      databases?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      grantor?: any;
      /**
       * Returns the value for the member attribute <b>hiveservices<b>
       */
      hiveServices?: any;
      /**
       * Returns the value for the member attribute <b>isAuditEnabled<b>
       */
      isAuditEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>isEnable<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>isRecursive<b>
       */
      isRecursive?: boolean;
      /**
       * Returns the value for the member attribute <b>userPermList<b>
       */
      permMapList?: VXPermObj[];
      /**
       * 
       */
      policyLabel?: any;
      /**
       * Returns the value for the member attribute <b>policyName<b>
       */
      policyName?: any;
      /**
       * 
       */
      replacePerm?: boolean;
      /**
       * Returns the value for the member attribute <b>repositoryName<b>
       */
      repositoryName?: any;
      /**
       * Returns the value for the member attribute <b>repositoryType<b>
       */
      repositoryType?: any;
      /**
       * Returns the value for the member attribute <b>resourceName<b>
       */
      resourceName?: any;
      /**
       * Returns the value for the member attribute <b>services<b>
       */
      services?: any;
      /**
       * Returns the value for the member attribute <b>tableType<b>
       */
      tableType?: any;
      /**
       * Returns the value for the member attribute <b>tables<b>
       */
      tables?: any;
      /**
       * Returns the value for the member attribute <b>topologies<b>
       */
      topologies?: any;
      /**
       * Returns the value for the member attribute <b>udfs<b>
       */
      udfs?: any;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "agentId": "...",
     *   "clientIP": "...",
     *   "clusterName": "...",
     *   "createDate": 12345,
     *   "exportedJson": "...",
     *   "httpRetCode": 12345,
     *   "id": 12345,
     *   "lastUpdated": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "policyVersion": 12345,
     *   "repositoryName": "...",
     *   "requestedEpoch": 12345,
     *   "syncStatus": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "zoneName": "..."
     * }
     */
    export interface VXPolicyExportAudit {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * 
       */
      clusterName?: any;
      /**
       * Returns the value for the member attribute <b>exportedJson<b>
       */
      exportedJson?: any;
      /**
       * Returns the value for the member attribute <b>httpRetCode<b>
       */
      httpRetCode?: number; // int32
      /**
       * Returns the value for the member attribute <b>lastUpdated<b>
       */
      lastUpdated?: number;
      /**
       * 
       */
      policyVersion?: number;
      /**
       * Returns the value for the member attribute <b>repositoryName<b>
       */
      repositoryName?: any;
      /**
       * Returns the value for the member attribute <b>requestedEpoch<b>
       */
      requestedEpoch?: number;
      /**
       * 
       */
      syncStatus?: any;
      /**
       * 
       */
      zoneName?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXPolicyExportAudits": [
     *     {
     *       "agentId": "...",
     *       "clientIP": "...",
     *       "clusterName": "...",
     *       "createDate": 12345,
     *       "exportedJson": "...",
     *       "httpRetCode": 12345,
     *       "id": 12345,
     *       "lastUpdated": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "policyVersion": 12345,
     *       "repositoryName": "...",
     *       "requestedEpoch": 12345,
     *       "syncStatus": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "zoneName": "..."
     *     },
     *     {
     *       "agentId": "...",
     *       "clientIP": "...",
     *       "clusterName": "...",
     *       "createDate": 12345,
     *       "exportedJson": "...",
     *       "httpRetCode": 12345,
     *       "id": 12345,
     *       "lastUpdated": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "policyVersion": 12345,
     *       "repositoryName": "...",
     *       "requestedEpoch": 12345,
     *       "syncStatus": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "zoneName": "..."
     *     }
     *   ]
     * }
     */
    export interface VXPolicyExportAuditList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXPolicyExportAudits?: VXPolicyExportAudit[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "policyLabel": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXPolicyLabel {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      policyLabel?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vxPolicyLabels": [
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "policyLabel": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "policyLabel": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXPolicyLabelList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vxPolicyLabels?: VXPolicyLabel[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXPolicies": [
     *     {
     *       "columnFamilies": "...",
     *       "columnType": "...",
     *       "columns": "...",
     *       "createDate": 12345,
     *       "databases": "...",
     *       "description": "...",
     *       "grantor": "...",
     *       "hiveServices": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isEnabled": true,
     *       "isRecursive": true,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "permMapList": [
     *         {
     *           "groupList": [
     *             "...",
     *             "..."
     *           ],
     *           "ipAddress": "...",
     *           "permList": [
     *             "...",
     *             "..."
     *           ],
     *           "userList": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "groupList": [
     *             "...",
     *             "..."
     *           ],
     *           "ipAddress": "...",
     *           "permList": [
     *             "...",
     *             "..."
     *           ],
     *           "userList": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabel": "...",
     *       "policyName": "...",
     *       "replacePerm": true,
     *       "repositoryName": "...",
     *       "repositoryType": "...",
     *       "resourceName": "...",
     *       "services": "...",
     *       "tableType": "...",
     *       "tables": "...",
     *       "topologies": "...",
     *       "udfs": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "version": "..."
     *     },
     *     {
     *       "columnFamilies": "...",
     *       "columnType": "...",
     *       "columns": "...",
     *       "createDate": 12345,
     *       "databases": "...",
     *       "description": "...",
     *       "grantor": "...",
     *       "hiveServices": "...",
     *       "id": 12345,
     *       "isAuditEnabled": true,
     *       "isEnabled": true,
     *       "isRecursive": true,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "permMapList": [
     *         {
     *           "groupList": [
     *             "...",
     *             "..."
     *           ],
     *           "ipAddress": "...",
     *           "permList": [
     *             "...",
     *             "..."
     *           ],
     *           "userList": [
     *             "...",
     *             "..."
     *           ]
     *         },
     *         {
     *           "groupList": [
     *             "...",
     *             "..."
     *           ],
     *           "ipAddress": "...",
     *           "permList": [
     *             "...",
     *             "..."
     *           ],
     *           "userList": [
     *             "...",
     *             "..."
     *           ]
     *         }
     *       ],
     *       "policyLabel": "...",
     *       "policyName": "...",
     *       "replacePerm": true,
     *       "repositoryName": "...",
     *       "repositoryType": "...",
     *       "resourceName": "...",
     *       "services": "...",
     *       "tableType": "...",
     *       "tables": "...",
     *       "topologies": "...",
     *       "udfs": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "version": "..."
     *     }
     *   ]
     * }
     */
    export interface VXPolicyList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXPolicies?: VXPolicy[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "emailAddress": "...",
     *   "firstName": "...",
     *   "groupIdList": [
     *     12345,
     *     12345
     *   ],
     *   "groupPermissions": [
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ],
     *   "id": 12345,
     *   "lastName": "...",
     *   "loginId": "...",
     *   "myClassType": 12345,
     *   "notes": "...",
     *   "owner": "...",
     *   "password": "...",
     *   "publicScreenName": "...",
     *   "status": 12345,
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userPermList": [
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "loginId": "...",
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "loginId": "...",
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     }
     *   ],
     *   "userRoleList": [
     *     "...",
     *     "..."
     *   ],
     *   "userSource": 12345
     * }
     */
    export interface VXPortalUser {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>emailAddress<b>
       */
      emailAddress?: any;
      /**
       * Returns the value for the member attribute <b>firstName<b>
       */
      firstName?: any;
      /**
       * 
       */
      groupIdList?: number[];
      /**
       * 
       */
      groupPermissions?: VXGroupPermission[];
      /**
       * Returns the value for the member attribute <b>lastName<b>
       */
      lastName?: any;
      /**
       * Returns the value for the member attribute <b>loginId<b>
       */
      loginId?: any;
      /**
       * Returns the value for the member attribute <b>notes<b>
       */
      notes?: any;
      /**
       * Returns the value for the member attribute <b>password<b>
       */
      password?: any;
      /**
       * Returns the value for the member attribute <b>publicScreenName<b>
       */
      publicScreenName?: any;
      /**
       * Returns the value for the member attribute <b>status<b>
       */
      status?: number; // int32
      /**
       * 
       */
      userPermList?: VXUserPermission[];
      /**
       * Returns the value for the member attribute <b>userRoleList<b>
       */
      userRoleList?: any[];
      /**
       * Returns the value for the member attribute <b>userSource<b>
       */
      userSource?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXPortalUsers": [
     *     {
     *       "createDate": 12345,
     *       "emailAddress": "...",
     *       "firstName": "...",
     *       "groupIdList": [
     *         12345,
     *         12345
     *       ],
     *       "groupPermissions": [
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         }
     *       ],
     *       "id": 12345,
     *       "lastName": "...",
     *       "loginId": "...",
     *       "myClassType": 12345,
     *       "notes": "...",
     *       "owner": "...",
     *       "password": "...",
     *       "publicScreenName": "...",
     *       "status": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userPermList": [
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         }
     *       ],
     *       "userRoleList": [
     *         "...",
     *         "..."
     *       ],
     *       "userSource": 12345
     *     },
     *     {
     *       "createDate": 12345,
     *       "emailAddress": "...",
     *       "firstName": "...",
     *       "groupIdList": [
     *         12345,
     *         12345
     *       ],
     *       "groupPermissions": [
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "..."
     *         }
     *       ],
     *       "id": 12345,
     *       "lastName": "...",
     *       "loginId": "...",
     *       "myClassType": 12345,
     *       "notes": "...",
     *       "owner": "...",
     *       "password": "...",
     *       "publicScreenName": "...",
     *       "status": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userPermList": [
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "id": 12345,
     *           "isAllowed": 12345,
     *           "loginId": "...",
     *           "moduleId": 12345,
     *           "moduleName": "...",
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         }
     *       ],
     *       "userRoleList": [
     *         "...",
     *         "..."
     *       ],
     *       "userSource": 12345
     *     }
     *   ]
     * }
     */
    export interface VXPortalUserList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXPortalUsers?: VXPortalUser[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "config": "...",
     *   "createDate": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "isActive": true,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "repositoryType": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "version": "..."
     * }
     */
    export interface VXRepository {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>config<b>
       */
      config?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>isActive<b>
       */
      isActive?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>repositoryType<b>
       */
      repositoryType?: any;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXRepositories": [
     *     {
     *       "config": "...",
     *       "createDate": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "isActive": true,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "repositoryType": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "version": "..."
     *     },
     *     {
     *       "config": "...",
     *       "createDate": 12345,
     *       "description": "...",
     *       "id": 12345,
     *       "isActive": true,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "repositoryType": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "version": "..."
     *     }
     *   ]
     * }
     */
    export interface VXRepositoryList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXRepositories?: VXRepository[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "assetId": 12345,
     *   "assetName": "...",
     *   "assetType": 12345,
     *   "auditList": [
     *     {
     *       "auditType": 12345,
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     },
     *     {
     *       "auditType": 12345,
     *       "createDate": 12345,
     *       "groupId": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345
     *     }
     *   ],
     *   "checkParentPermission": 12345,
     *   "columnFamilies": "...",
     *   "columnType": 12345,
     *   "columns": "...",
     *   "createDate": 12345,
     *   "databases": "...",
     *   "description": "...",
     *   "guid": "...",
     *   "hiveServices": "...",
     *   "id": 12345,
     *   "isEncrypt": 12345,
     *   "isRecursive": 12345,
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "parentId": 12345,
     *   "parentPath": "...",
     *   "permMapList": [
     *     {
     *       "createDate": 12345,
     *       "grantOrRevoke": true,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "ipAddress": "...",
     *       "isRecursive": 12345,
     *       "isWildCard": true,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "permFor": 12345,
     *       "permGroup": "...",
     *       "permType": 12345,
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "grantOrRevoke": true,
     *       "groupId": 12345,
     *       "groupName": "...",
     *       "id": 12345,
     *       "ipAddress": "...",
     *       "isRecursive": 12345,
     *       "isWildCard": true,
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "permFor": 12345,
     *       "permGroup": "...",
     *       "permType": 12345,
     *       "resourceId": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     }
     *   ],
     *   "policyName": "...",
     *   "resourceGroup": "...",
     *   "resourceStatus": 12345,
     *   "resourceType": 12345,
     *   "services": "...",
     *   "tableType": 12345,
     *   "tables": "...",
     *   "topologies": "...",
     *   "udfs": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXResource {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>assetId<b>
       */
      assetId?: number;
      /**
       * Returns the value for the member attribute <b>assetName<b>
       */
      assetName?: any;
      /**
       * Returns the value for the member attribute <b>assetType<b>
       */
      assetType?: number; // int32
      /**
       * Returns the value for the member attribute <b>auditList<b>
       */
      auditList?: VXAuditMap[];
      /**
       * Returns the value for the member attribute <b>checkParentPermission<b>
       */
      checkParentPermission?: number; // int32
      /**
       * Returns the value for the member attribute <b>columnFamilies<b>
       */
      columnFamilies?: any;
      /**
       * Returns the value for the member attribute <b>columnType<b>
       */
      columnType?: number; // int32
      /**
       * Returns the value for the member attribute <b>columns<b>
       */
      columns?: any;
      /**
       * Returns the value for the member attribute <b>databases<b>
       */
      databases?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>guid<b>
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>hiveservices<b>
       */
      hiveServices?: any;
      /**
       * Returns the value for the member attribute <b>isEncrypt<b>
       */
      isEncrypt?: number; // int32
      /**
       * Returns the value for the member attribute <b>isRecursive<b>
       */
      isRecursive?: number; // int32
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>parentId<b>
       */
      parentId?: number;
      /**
       * Returns the value for the member attribute <b>parentPath<b>
       */
      parentPath?: any;
      /**
       * Returns the value for the member attribute <b>permMapList<b>
       */
      permMapList?: VXPermMap[];
      /**
       * 
       */
      policyName?: any;
      /**
       * Returns the value for the member attribute <b>resourceGroup<b>
       */
      resourceGroup?: any;
      /**
       * Returns the value for the member attribute <b>resourceStatus<b>
       */
      resourceStatus?: number; // int32
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: number; // int32
      /**
       * Returns the value for the member attribute <b>services<b>
       */
      services?: any;
      /**
       * Returns the value for the member attribute <b>tableType<b>
       */
      tableType?: number; // int32
      /**
       * Returns the value for the member attribute <b>tables<b>
       */
      tables?: any;
      /**
       * Returns the value for the member attribute <b>topologies<b>
       */
      topologies?: any;
      /**
       * Returns the value for the member attribute <b>udfs<b>
       */
      udfs?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXResources": [
     *     {
     *       "assetId": 12345,
     *       "assetName": "...",
     *       "assetType": 12345,
     *       "auditList": [
     *         {
     *           "auditType": 12345,
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "id": 12345,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345
     *         },
     *         {
     *           "auditType": 12345,
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "id": 12345,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345
     *         }
     *       ],
     *       "checkParentPermission": 12345,
     *       "columnFamilies": "...",
     *       "columnType": 12345,
     *       "columns": "...",
     *       "createDate": 12345,
     *       "databases": "...",
     *       "description": "...",
     *       "guid": "...",
     *       "hiveServices": "...",
     *       "id": 12345,
     *       "isEncrypt": 12345,
     *       "isRecursive": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "parentId": 12345,
     *       "parentPath": "...",
     *       "permMapList": [
     *         {
     *           "createDate": 12345,
     *           "grantOrRevoke": true,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "ipAddress": "...",
     *           "isRecursive": 12345,
     *           "isWildCard": true,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "permFor": 12345,
     *           "permGroup": "...",
     *           "permType": 12345,
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "grantOrRevoke": true,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "ipAddress": "...",
     *           "isRecursive": 12345,
     *           "isWildCard": true,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "permFor": 12345,
     *           "permGroup": "...",
     *           "permType": 12345,
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         }
     *       ],
     *       "policyName": "...",
     *       "resourceGroup": "...",
     *       "resourceStatus": 12345,
     *       "resourceType": 12345,
     *       "services": "...",
     *       "tableType": 12345,
     *       "tables": "...",
     *       "topologies": "...",
     *       "udfs": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "assetId": 12345,
     *       "assetName": "...",
     *       "assetType": 12345,
     *       "auditList": [
     *         {
     *           "auditType": 12345,
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "id": 12345,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345
     *         },
     *         {
     *           "auditType": 12345,
     *           "createDate": 12345,
     *           "groupId": 12345,
     *           "id": 12345,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345
     *         }
     *       ],
     *       "checkParentPermission": 12345,
     *       "columnFamilies": "...",
     *       "columnType": 12345,
     *       "columns": "...",
     *       "createDate": 12345,
     *       "databases": "...",
     *       "description": "...",
     *       "guid": "...",
     *       "hiveServices": "...",
     *       "id": 12345,
     *       "isEncrypt": 12345,
     *       "isRecursive": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "parentId": 12345,
     *       "parentPath": "...",
     *       "permMapList": [
     *         {
     *           "createDate": 12345,
     *           "grantOrRevoke": true,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "ipAddress": "...",
     *           "isRecursive": 12345,
     *           "isWildCard": true,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "permFor": 12345,
     *           "permGroup": "...",
     *           "permType": 12345,
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         },
     *         {
     *           "createDate": 12345,
     *           "grantOrRevoke": true,
     *           "groupId": 12345,
     *           "groupName": "...",
     *           "id": 12345,
     *           "ipAddress": "...",
     *           "isRecursive": 12345,
     *           "isWildCard": true,
     *           "myClassType": 12345,
     *           "owner": "...",
     *           "permFor": 12345,
     *           "permGroup": "...",
     *           "permType": 12345,
     *           "resourceId": 12345,
     *           "updateDate": 12345,
     *           "updatedBy": "...",
     *           "userId": 12345,
     *           "userName": "..."
     *         }
     *       ],
     *       "policyName": "...",
     *       "resourceGroup": "...",
     *       "resourceStatus": 12345,
     *       "resourceType": 12345,
     *       "services": "...",
     *       "tableType": 12345,
     *       "tables": "...",
     *       "topologies": "...",
     *       "udfs": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXResourceList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXResources?: VXResource[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "messageList": [
     *     {
     *       "fieldName": "...",
     *       "message": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "objectId": 12345,
     *       "rbKey": "..."
     *     },
     *     {
     *       "fieldName": "...",
     *       "message": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "objectId": 12345,
     *       "rbKey": "..."
     *     }
     *   ],
     *   "msgDesc": "...",
     *   "myClassType": 12345,
     *   "statusCode": 12345
     * }
     */
    export interface VXResponse {
      /**
       * Returns the value for the member attribute <b>messageList<b>
       */
      messageList?: VXMessage[];
      /**
       * Returns the value for the member attribute <b>msgDesc<b>
       */
      msgDesc?: any;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>statusCode<b>
       */
      statusCode?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "myClassType": 12345,
     *   "value": "..."
     * }
     */
    export interface VXString {
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>value<b>
       */
      value?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXStrings": [
     *     {
     *       "myClassType": 12345,
     *       "value": "..."
     *     },
     *     {
     *       "myClassType": 12345,
     *       "value": "..."
     *     }
     *   ]
     * }
     */
    export interface VXStringList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXStrings?: VXString[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "action": "...",
     *   "attributeName": "...",
     *   "createDate": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "newValue": "...",
     *   "objectClassType": 12345,
     *   "objectId": 12345,
     *   "objectName": "...",
     *   "owner": "...",
     *   "parentObjectClassType": 12345,
     *   "parentObjectId": 12345,
     *   "parentObjectName": "...",
     *   "previousValue": "...",
     *   "requestId": "...",
     *   "sessionId": "...",
     *   "sessionType": "...",
     *   "transactionId": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "..."
     * }
     */
    export interface VXTrxLog {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>attributeName<b>
       */
      attributeName?: any;
      /**
       * Returns the value for the member attribute <b>newValue<b>
       */
      newValue?: any;
      /**
       * Returns the value for the member attribute <b>objectClassType<b>
       */
      objectClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>objectId<b>
       */
      objectId?: number;
      /**
       * Returns the value for the member attribute <b>objectName<b>
       */
      objectName?: any;
      /**
       * Returns the value for the member attribute <b>parentObjectClassType<b>
       */
      parentObjectClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>parentObjectId<b>
       */
      parentObjectId?: number;
      /**
       * Returns the value for the member attribute <b>parentObjectName<b>
       */
      parentObjectName?: any;
      /**
       * Returns the value for the member attribute <b>previousValue<b>
       */
      previousValue?: any;
      /**
       * Returns the value for the member attribute <b>requestId<b>
       */
      requestId?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
      /**
       * Returns the value for the member attribute <b>sessionType<b>
       */
      sessionType?: any;
      /**
       * Returns the value for the member attribute <b>transactionId<b>
       */
      transactionId?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXTrxLogs": [
     *     {
     *       "action": "...",
     *       "attributeName": "...",
     *       "createDate": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "newValue": "...",
     *       "objectClassType": 12345,
     *       "objectId": 12345,
     *       "objectName": "...",
     *       "owner": "...",
     *       "parentObjectClassType": 12345,
     *       "parentObjectId": 12345,
     *       "parentObjectName": "...",
     *       "previousValue": "...",
     *       "requestId": "...",
     *       "sessionId": "...",
     *       "sessionType": "...",
     *       "transactionId": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "action": "...",
     *       "attributeName": "...",
     *       "createDate": 12345,
     *       "id": 12345,
     *       "myClassType": 12345,
     *       "newValue": "...",
     *       "objectClassType": 12345,
     *       "objectId": 12345,
     *       "objectName": "...",
     *       "owner": "...",
     *       "parentObjectClassType": 12345,
     *       "parentObjectId": 12345,
     *       "parentObjectName": "...",
     *       "previousValue": "...",
     *       "requestId": "...",
     *       "sessionId": "...",
     *       "sessionType": "...",
     *       "transactionId": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ]
     * }
     */
    export interface VXTrxLogList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXTrxLogs?: VXTrxLog[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "eventTime": 12345,
     *   "fileSyncSourceInfo": {
     *     "fileName": "...",
     *     "lastModified": "...",
     *     "syncTime": "...",
     *     "totalGroupsSynced": 12345,
     *     "totalUsersSynced": 12345
     *   },
     *   "id": 12345,
     *   "ldapSyncSourceInfo": {
     *     "groupHierarchyLevel": "...",
     *     "groupSearchEnabled": "...",
     *     "groupSearchFilter": "...",
     *     "groupSearchFirstEnabled": "...",
     *     "ldapUrl": "...",
     *     "totalGroupsSynced": 12345,
     *     "totalUsersSynced": 12345,
     *     "userSearchEnabled": "...",
     *     "userSearchFilter": "..."
     *   },
     *   "myClassType": 12345,
     *   "noOfModifiedGroups": 12345,
     *   "noOfModifiedUsers": 12345,
     *   "noOfNewGroups": 12345,
     *   "noOfNewUsers": 12345,
     *   "owner": "...",
     *   "sessionId": "...",
     *   "syncSource": "...",
     *   "syncSourceInfo": {
     *     "property1": "...",
     *     "property2": "..."
     *   },
     *   "unixSyncSourceInfo": {
     *     "fileName": "...",
     *     "lastModified": "...",
     *     "minGroupId": "...",
     *     "minUserId": "...",
     *     "syncTime": "...",
     *     "totalGroupsSynced": 12345,
     *     "totalUsersSynced": 12345,
     *     "unixBackend": "..."
     *   },
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userName": "..."
     * }
     */
    export interface VXUgsyncAuditInfo {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      eventTime?: number;
      fileSyncSourceInfo?: VXFileSyncSourceInfo;
      ldapSyncSourceInfo?: VXLdapSyncSourceInfo;
      /**
       * 
       */
      noOfModifiedGroups?: number;
      /**
       * 
       */
      noOfModifiedUsers?: number;
      /**
       * 
       */
      noOfNewGroups?: number;
      /**
       * 
       */
      noOfNewUsers?: number;
      /**
       * 
       */
      sessionId?: any;
      /**
       * 
       */
      syncSource?: any;
      /**
       * 
       */
      syncSourceInfo?: {
        [name: string]: any;
      };
      unixSyncSourceInfo?: VXUnixSyncSourceInfo;
      /**
       * 
       */
      userName?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vxUgsyncAuditInfoList": [
     *     {
     *       "createDate": 12345,
     *       "eventTime": 12345,
     *       "fileSyncSourceInfo": {
     *         "fileName": "...",
     *         "lastModified": "...",
     *         "syncTime": "...",
     *         "totalGroupsSynced": 12345,
     *         "totalUsersSynced": 12345
     *       },
     *       "id": 12345,
     *       "ldapSyncSourceInfo": {
     *         "groupHierarchyLevel": "...",
     *         "groupSearchEnabled": "...",
     *         "groupSearchFilter": "...",
     *         "groupSearchFirstEnabled": "...",
     *         "ldapUrl": "...",
     *         "totalGroupsSynced": 12345,
     *         "totalUsersSynced": 12345,
     *         "userSearchEnabled": "...",
     *         "userSearchFilter": "..."
     *       },
     *       "myClassType": 12345,
     *       "noOfModifiedGroups": 12345,
     *       "noOfModifiedUsers": 12345,
     *       "noOfNewGroups": 12345,
     *       "noOfNewUsers": 12345,
     *       "owner": "...",
     *       "sessionId": "...",
     *       "syncSource": "...",
     *       "syncSourceInfo": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "unixSyncSourceInfo": {
     *         "fileName": "...",
     *         "lastModified": "...",
     *         "minGroupId": "...",
     *         "minUserId": "...",
     *         "syncTime": "...",
     *         "totalGroupsSynced": 12345,
     *         "totalUsersSynced": 12345,
     *         "unixBackend": "..."
     *       },
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userName": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "eventTime": 12345,
     *       "fileSyncSourceInfo": {
     *         "fileName": "...",
     *         "lastModified": "...",
     *         "syncTime": "...",
     *         "totalGroupsSynced": 12345,
     *         "totalUsersSynced": 12345
     *       },
     *       "id": 12345,
     *       "ldapSyncSourceInfo": {
     *         "groupHierarchyLevel": "...",
     *         "groupSearchEnabled": "...",
     *         "groupSearchFilter": "...",
     *         "groupSearchFirstEnabled": "...",
     *         "ldapUrl": "...",
     *         "totalGroupsSynced": 12345,
     *         "totalUsersSynced": 12345,
     *         "userSearchEnabled": "...",
     *         "userSearchFilter": "..."
     *       },
     *       "myClassType": 12345,
     *       "noOfModifiedGroups": 12345,
     *       "noOfModifiedUsers": 12345,
     *       "noOfNewGroups": 12345,
     *       "noOfNewUsers": 12345,
     *       "owner": "...",
     *       "sessionId": "...",
     *       "syncSource": "...",
     *       "syncSourceInfo": {
     *         "property1": "...",
     *         "property2": "..."
     *       },
     *       "unixSyncSourceInfo": {
     *         "fileName": "...",
     *         "lastModified": "...",
     *         "minGroupId": "...",
     *         "minUserId": "...",
     *         "syncTime": "...",
     *         "totalGroupsSynced": 12345,
     *         "totalUsersSynced": 12345,
     *         "unixBackend": "..."
     *       },
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userName": "..."
     *     }
     *   ]
     * }
     */
    export interface VXUgsyncAuditInfoList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vxUgsyncAuditInfoList?: VXUgsyncAuditInfo[];
    }
    /**
     * VXUnixSyncSourceInfo
     * 
     * example:
     * {
     *   "fileName": "...",
     *   "lastModified": "...",
     *   "minGroupId": "...",
     *   "minUserId": "...",
     *   "syncTime": "...",
     *   "totalGroupsSynced": 12345,
     *   "totalUsersSynced": 12345,
     *   "unixBackend": "..."
     * }
     */
    export interface VXUnixSyncSourceInfo {
      /**
       * 
       */
      fileName?: any;
      /**
       * 
       */
      lastModified?: any;
      /**
       * 
       */
      minGroupId?: any;
      /**
       * 
       */
      minUserId?: any;
      /**
       * 
       */
      syncTime?: any;
      /**
       * 
       */
      totalGroupsSynced?: number; // int64
      /**
       * 
       */
      totalUsersSynced?: number; // int64
      /**
       * 
       */
      unixBackend?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "credStoreId": 12345,
     *   "description": "...",
     *   "emailAddress": "...",
     *   "firstName": "...",
     *   "groupIdList": [
     *     12345,
     *     12345
     *   ],
     *   "groupNameList": [
     *     "...",
     *     "..."
     *   ],
     *   "id": 12345,
     *   "isVisible": 12345,
     *   "lastName": "...",
     *   "myClassType": 12345,
     *   "name": "...",
     *   "owner": "...",
     *   "password": "...",
     *   "status": 12345,
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userRoleList": [
     *     "...",
     *     "..."
     *   ],
     *   "userSource": 12345
     * }
     */
    export interface VXUser {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * Returns the value for the member attribute <b>credStoreId<b>
       */
      credStoreId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>emailAddress<b>
       */
      emailAddress?: any;
      /**
       * Returns the value for the member attribute <b>firstName<b>
       */
      firstName?: any;
      /**
       * Returns the value for the member attribute <b>groupIdList<b>
       */
      groupIdList?: number[];
      /**
       * 
       */
      groupNameList?: any[];
      /**
       * 
       */
      isVisible?: number;
      /**
       * Returns the value for the member attribute <b>lastName<b>
       */
      lastName?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>password<b>
       */
      password?: any;
      /**
       * 
       */
      status?: number; // int32
      /**
       * Returns the value for the member attribute <b>userRoleList<b>
       */
      userRoleList?: any[];
      /**
       * 
       */
      userSource?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "xgroupInfo": [
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "groupSource": 12345,
     *       "groupType": 12345,
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "groupSource": 12345,
     *       "groupType": 12345,
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "..."
     *     }
     *   ],
     *   "xuserInfo": {
     *     "createDate": 12345,
     *     "credStoreId": 12345,
     *     "description": "...",
     *     "emailAddress": "...",
     *     "firstName": "...",
     *     "groupIdList": [
     *       12345,
     *       12345
     *     ],
     *     "groupNameList": [
     *       "...",
     *       "..."
     *     ],
     *     "id": 12345,
     *     "isVisible": 12345,
     *     "lastName": "...",
     *     "myClassType": 12345,
     *     "name": "...",
     *     "owner": "...",
     *     "password": "...",
     *     "status": 12345,
     *     "updateDate": 12345,
     *     "updatedBy": "...",
     *     "userRoleList": [
     *       "...",
     *       "..."
     *     ],
     *     "userSource": 12345
     *   }
     * }
     */
    export interface VXUserGroupInfo {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      xgroupInfo?: VXGroup[];
      xuserInfo?: VXUser;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXUsers": [
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "emailAddress": "...",
     *       "firstName": "...",
     *       "groupIdList": [
     *         12345,
     *         12345
     *       ],
     *       "groupNameList": [
     *         "...",
     *         "..."
     *       ],
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "lastName": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "password": "...",
     *       "status": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userRoleList": [
     *         "...",
     *         "..."
     *       ],
     *       "userSource": 12345
     *     },
     *     {
     *       "createDate": 12345,
     *       "credStoreId": 12345,
     *       "description": "...",
     *       "emailAddress": "...",
     *       "firstName": "...",
     *       "groupIdList": [
     *         12345,
     *         12345
     *       ],
     *       "groupNameList": [
     *         "...",
     *         "..."
     *       ],
     *       "id": 12345,
     *       "isVisible": 12345,
     *       "lastName": "...",
     *       "myClassType": 12345,
     *       "name": "...",
     *       "owner": "...",
     *       "password": "...",
     *       "status": 12345,
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userRoleList": [
     *         "...",
     *         "..."
     *       ],
     *       "userSource": 12345
     *     }
     *   ]
     * }
     */
    export interface VXUserList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXUsers?: VXUser[];
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "createDate": 12345,
     *   "id": 12345,
     *   "isAllowed": 12345,
     *   "loginId": "...",
     *   "moduleId": 12345,
     *   "moduleName": "...",
     *   "myClassType": 12345,
     *   "owner": "...",
     *   "updateDate": 12345,
     *   "updatedBy": "...",
     *   "userId": 12345,
     *   "userName": "..."
     * }
     */
    export interface VXUserPermission {
      /**
       * Returns the value for the member attribute <b>createDate<b>
       */
      createDate?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>owner<b>
       */
      owner?: any;
      /**
       * Returns the value for the member attribute <b>updateDate<b>
       */
      updateDate?: number;
      /**
       * Returns the value for the member attribute <b>updatedBy<b>
       */
      updatedBy?: any;
      /**
       * 
       */
      isAllowed?: number;
      /**
       * 
       */
      loginId?: any;
      /**
       * 
       */
      moduleId?: number;
      /**
       * 
       */
      moduleName?: any;
      /**
       * 
       */
      userId?: number;
      /**
       * 
       */
      userName?: any;
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {
     *   "list": [
     *     {},
     *     {}
     *   ],
     *   "listSize": 12345,
     *   "pageSize": 12345,
     *   "resultSize": 12345,
     *   "sortBy": "...",
     *   "sortType": "...",
     *   "startIndex": 12345,
     *   "totalCount": 12345,
     *   "vXUserPermission": [
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "loginId": "...",
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     },
     *     {
     *       "createDate": 12345,
     *       "id": 12345,
     *       "isAllowed": 12345,
     *       "loginId": "...",
     *       "moduleId": 12345,
     *       "moduleName": "...",
     *       "myClassType": 12345,
     *       "owner": "...",
     *       "updateDate": 12345,
     *       "updatedBy": "...",
     *       "userId": 12345,
     *       "userName": "..."
     *     }
     *   ]
     * }
     */
    export interface VXUserPermissionList {
      /**
       * 
       */
      list?: {
      }[];
      /**
       * 
       */
      listSize?: number; // int32
      /**
       * 
       */
      pageSize?: number; // int32
      /**
       * Returns the value for the member attribute <b>resultSize<b>
       */
      resultSize?: number; // int32
      /**
       * 
       */
      sortBy?: any;
      /**
       * 
       */
      sortType?: any;
      /**
       * 
       */
      startIndex?: number; // int32
      /**
       * 
       */
      totalCount?: number; // int64
      /**
       * 
       */
      vXUserPermission?: VXUserPermission[];
    }
    /**
     * VXXTrxLog
     * 
     * example:
     * {
     *   "action": "...",
     *   "addedByUserId": 12345,
     *   "attributeName": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "newValue": "...",
     *   "objectClassType": 12345,
     *   "objectId": 12345,
     *   "objectName": "...",
     *   "parentObjectClassType": 12345,
     *   "parentObjectId": 12345,
     *   "parentObjectName": "...",
     *   "previousValue": "...",
     *   "requestId": "...",
     *   "sessionId": "...",
     *   "sessionType": "...",
     *   "transactionId": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface VXXTrxLog {
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * 
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>attributeName<b>
       */
      attributeName?: any;
      /**
       * 
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * Returns the value for the member attribute <b>newValue<b>
       */
      newValue?: any;
      /**
       * 
       */
      objectClassType?: number; // int32
      /**
       * 
       */
      objectId?: number;
      /**
       * 
       */
      objectName?: any;
      /**
       * Returns the value for the member attribute <b>parentObjectClassType<b>
       */
      parentObjectClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>parentObjectId<b>
       */
      parentObjectId?: number;
      /**
       * 
       */
      parentObjectName?: any;
      /**
       * Returns the value for the member attribute <b>previousValue<b>
       */
      previousValue?: any;
      /**
       * Returns the value for the member attribute <b>requestId<b>
       */
      requestId?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
      /**
       * Returns the value for the member attribute <b>sessionType<b>
       */
      sessionType?: any;
      /**
       * Returns the value for the member attribute <b>transactionId<b>
       */
      transactionId?: any;
      /**
       * 
       */
      updateTime?: number;
      /**
       * 
       */
      updatedByUserId?: number;
    }
    /**
     * ValidityInterval
     * 
     * example:
     * {
     *   "days": 12345,
     *   "hours": 12345,
     *   "minutes": 12345
     * }
     */
    export interface ValidityInterval {
      /**
       * 
       */
      days?: number; // int32
      /**
       * 
       */
      hours?: number; // int32
      /**
       * 
       */
      minutes?: number; // int32
    }
    /**
     * ViewBaseBean
     * 
     * example:
     * {}
     */
    export interface ViewBaseBean {
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "accessResult": 12345,
     *   "accessType": "...",
     *   "aclEnforcer": "...",
     *   "action": "...",
     *   "addedByUserId": 12345,
     *   "agentId": "...",
     *   "auditType": 12345,
     *   "clientIP": "...",
     *   "clientType": "...",
     *   "createTime": 12345,
     *   "eventCount": 12345,
     *   "eventDuration": 12345,
     *   "eventTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "repoName": "...",
     *   "repoType": 12345,
     *   "requestData": "...",
     *   "requestUser": "...",
     *   "resourcePath": "...",
     *   "resourceType": "...",
     *   "resultReason": "...",
     *   "sequenceNumber": 12345,
     *   "sessionId": "...",
     *   "tags": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAccessAudit {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>accessResult<b>
       */
      accessResult?: number; // int32
      /**
       * Returns the value for the member attribute <b>accessType<b>
       */
      accessType?: any;
      /**
       * Returns the value for the member attribute <b>aclEnforcer<b>
       */
      aclEnforcer?: any;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * Returns the value for the member attribute <b>clientType<b>
       */
      clientType?: any;
      /**
       * Returns the value for the member attribute <b>eventTime<b>
       */
      eventTime?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number; // int64
      /**
       * Returns the value for the member attribute <b>repoName<b>
       */
      repoName?: any;
      /**
       * Returns the value for the member attribute <b>repoType<b>
       */
      repoType?: number; // int32
      /**
       * Returns the value for the member attribute <b>requestData<b>
       */
      requestData?: any;
      /**
       * Returns the value for the member attribute <b>requestUser<b>
       */
      requestUser?: any;
      /**
       * Returns the value for the member attribute <b>resourcePath<b>
       */
      resourcePath?: any;
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: any;
      /**
       * Returns the value for the member attribute <b>resultReason<b>
       */
      resultReason?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
      /**
       * 
       */
      eventCount?: number; // int64
      /**
       * 
       */
      eventDuration?: number; // int64
      /**
       * 
       */
      sequenceNumber?: number; // int64
      /**
       * 
       */
      tags?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "accessResult": 12345,
     *   "accessType": "...",
     *   "aclEnforcer": "...",
     *   "action": "...",
     *   "addedByUserId": 12345,
     *   "agentId": "...",
     *   "auditType": 12345,
     *   "clientIP": "...",
     *   "clientType": "...",
     *   "createTime": 12345,
     *   "eventTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "repoName": "...",
     *   "repoType": 12345,
     *   "requestData": "...",
     *   "requestUser": "...",
     *   "resourcePath": "...",
     *   "resourceType": "...",
     *   "resultReason": "...",
     *   "sessionId": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAccessAuditBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>accessResult<b>
       */
      accessResult?: number; // int32
      /**
       * Returns the value for the member attribute <b>accessType<b>
       */
      accessType?: any;
      /**
       * Returns the value for the member attribute <b>aclEnforcer<b>
       */
      aclEnforcer?: any;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * Returns the value for the member attribute <b>clientType<b>
       */
      clientType?: any;
      /**
       * Returns the value for the member attribute <b>eventTime<b>
       */
      eventTime?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number; // int64
      /**
       * Returns the value for the member attribute <b>repoName<b>
       */
      repoName?: any;
      /**
       * Returns the value for the member attribute <b>repoType<b>
       */
      repoType?: number; // int32
      /**
       * Returns the value for the member attribute <b>requestData<b>
       */
      requestData?: any;
      /**
       * Returns the value for the member attribute <b>requestUser<b>
       */
      requestUser?: any;
      /**
       * Returns the value for the member attribute <b>resourcePath<b>
       */
      resourcePath?: any;
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: any;
      /**
       * Returns the value for the member attribute <b>resultReason<b>
       */
      resultReason?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "accessResult": 12345,
     *   "accessType": "...",
     *   "aclEnforcer": "...",
     *   "action": "...",
     *   "addedByUserId": 12345,
     *   "agentId": "...",
     *   "auditType": 12345,
     *   "clientIP": "...",
     *   "clientType": "...",
     *   "createTime": 12345,
     *   "eventTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "repoName": "...",
     *   "repoType": 12345,
     *   "requestData": "...",
     *   "requestUser": "...",
     *   "resourcePath": "...",
     *   "resourceType": "...",
     *   "resultReason": "...",
     *   "sessionId": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAccessAuditV4 {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>accessResult<b>
       */
      accessResult?: number; // int32
      /**
       * Returns the value for the member attribute <b>accessType<b>
       */
      accessType?: any;
      /**
       * Returns the value for the member attribute <b>aclEnforcer<b>
       */
      aclEnforcer?: any;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * Returns the value for the member attribute <b>clientType<b>
       */
      clientType?: any;
      /**
       * Returns the value for the member attribute <b>eventTime<b>
       */
      eventTime?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number; // int64
      /**
       * Returns the value for the member attribute <b>repoName<b>
       */
      repoName?: any;
      /**
       * Returns the value for the member attribute <b>repoType<b>
       */
      repoType?: number; // int32
      /**
       * Returns the value for the member attribute <b>requestData<b>
       */
      requestData?: any;
      /**
       * Returns the value for the member attribute <b>requestUser<b>
       */
      requestUser?: any;
      /**
       * Returns the value for the member attribute <b>resourcePath<b>
       */
      resourcePath?: any;
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: any;
      /**
       * Returns the value for the member attribute <b>resultReason<b>
       */
      resultReason?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "accessResult": 12345,
     *   "accessType": "...",
     *   "aclEnforcer": "...",
     *   "action": "...",
     *   "addedByUserId": 12345,
     *   "agentId": "...",
     *   "auditType": 12345,
     *   "clientIP": "...",
     *   "clientType": "...",
     *   "createTime": 12345,
     *   "eventCount": 12345,
     *   "eventDuration": 12345,
     *   "eventTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "repoName": "...",
     *   "repoType": 12345,
     *   "requestData": "...",
     *   "requestUser": "...",
     *   "resourcePath": "...",
     *   "resourceType": "...",
     *   "resultReason": "...",
     *   "sequenceNumber": 12345,
     *   "sessionId": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAccessAuditV5 {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>accessResult<b>
       */
      accessResult?: number; // int32
      /**
       * Returns the value for the member attribute <b>accessType<b>
       */
      accessType?: any;
      /**
       * Returns the value for the member attribute <b>aclEnforcer<b>
       */
      aclEnforcer?: any;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * Returns the value for the member attribute <b>clientType<b>
       */
      clientType?: any;
      /**
       * Returns the value for the member attribute <b>eventTime<b>
       */
      eventTime?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number; // int64
      /**
       * Returns the value for the member attribute <b>repoName<b>
       */
      repoName?: any;
      /**
       * Returns the value for the member attribute <b>repoType<b>
       */
      repoType?: number; // int32
      /**
       * Returns the value for the member attribute <b>requestData<b>
       */
      requestData?: any;
      /**
       * Returns the value for the member attribute <b>requestUser<b>
       */
      requestUser?: any;
      /**
       * Returns the value for the member attribute <b>resourcePath<b>
       */
      resourcePath?: any;
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: any;
      /**
       * Returns the value for the member attribute <b>resultReason<b>
       */
      resultReason?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
      /**
       * 
       */
      eventCount?: number; // int64
      /**
       * 
       */
      eventDuration?: number; // int64
      /**
       * 
       */
      sequenceNumber?: number; // int64
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "dataMaskOptions": "...",
     *   "defid": 12345,
     *   "id": 12345,
     *   "itemId": 12345,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "rbkeylabel": "...",
     *   "rowFilterOptions": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAccessTypeDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      dataMaskOptions?: any;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * 
       */
      rowFilterOptions?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "atdId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "impliedGrant": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAccessTypeDefGrants {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>atdId<b>
       */
      atdId?: number;
      /**
       * Returns the value for the member attribute <b>impliedGrant<b>
       */
      impliedGrant?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "activeStatus": 12345,
     *   "addedByUserId": 12345,
     *   "assetType": 12345,
     *   "config": "...",
     *   "createTime": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "supportNative": true,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXAsset {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>activeStatus<b>
       */
      activeStatus?: number; // int32
      /**
       * Returns the value for the member attribute <b>assetType<b>
       */
      assetType?: number; // int32
      /**
       * Returns the value for the member attribute <b>config<b>
       */
      config?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>supportNative<b>
       */
      supportNative?: boolean;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "auditType": 12345,
     *   "createTime": 12345,
     *   "groupId": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "resourceId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345
     * }
     */
    export interface XXAuditMap {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>auditType<b>
       */
      auditType?: number; // int32
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>resourceId<b>
       */
      resourceId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "authProvider": 12345,
     *   "authStatus": 12345,
     *   "authTime": 12345,
     *   "authType": 12345,
     *   "createTime": 12345,
     *   "deviceType": 12345,
     *   "extSessionId": "...",
     *   "id": 12345,
     *   "loginId": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "requestIP": "...",
     *   "requestUserAgent": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345
     * }
     */
    export interface XXAuthSession {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>authProvider<b>
       */
      authProvider?: number; // int32
      /**
       * Returns the value for the member attribute <b>authStatus<b>
       */
      authStatus?: number; // int32
      /**
       * Returns the value for the member attribute <b>authTime<b>
       */
      authTime?: number;
      /**
       * Returns the value for the member attribute <b>authType<b>
       */
      authType?: number; // int32
      /**
       * Returns the value for the member attribute <b>deviceType<b>
       */
      deviceType?: number; // int32
      /**
       * Returns the value for the member attribute <b>extSessionId<b>
       */
      extSessionId?: any;
      /**
       * Returns the value for the member attribute <b>loginId<b>
       */
      loginId?: any;
      /**
       * Returns the value for the member attribute <b>requestIP<b>
       */
      requestIP?: any;
      /**
       * Returns the value for the member attribute <b>requestUserAgent<b>
       */
      requestUserAgent?: any;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defid": 12345,
     *   "enricher": "...",
     *   "enricherOptions": "...",
     *   "id": 12345,
     *   "itemId": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXContextEnricherDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>enricher<b>
       */
      enricher?: any;
      /**
       * Returns the value for the member attribute <b>evaluatorOptions<b>
       */
      enricherOptions?: any;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXCredentialStore {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXDBBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
    }
    /**
     * XXDataHist
     * 
     * example:
     * {
     *   "action": "...",
     *   "content": "...",
     *   "createTime": 12345,
     *   "fromTime": 12345,
     *   "id": 12345,
     *   "objectClassType": 12345,
     *   "objectGuid": "...",
     *   "objectId": 12345,
     *   "objectName": "...",
     *   "toTime": 12345,
     *   "updateTime": 12345,
     *   "version": 12345
     * }
     */
    export interface XXDataHist {
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>content<b>
       */
      content?: any;
      /**
       * 
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>fromTime<b>
       */
      fromTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      objectClassType?: number;
      /**
       * 
       */
      objectGuid?: any;
      /**
       * 
       */
      objectId?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      objectName?: any;
      /**
       * Returns the value for the member attribute <b>toTime<b>
       */
      toTime?: number;
      /**
       * 
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "dataMaskOptions": "...",
     *   "defid": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "itemId": 12345,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "rbKeyDescription": "...",
     *   "rbkeylabel": "...",
     *   "transformer": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXDataMaskTypeDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>dataMaskOptions<b>
       */
      dataMaskOptions?: any;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>rbKeyDescription<b>
       */
      rbKeyDescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * Returns the value for the member attribute <b>transformer<b>
       */
      transformer?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defaultindex": 12345,
     *   "defid": 12345,
     *   "id": 12345,
     *   "itemId": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXEnumDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defaultIndex<b>
       */
      defaultindex?: number;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "enumdefid": 12345,
     *   "id": 12345,
     *   "itemId": 12345,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "rbkeylabel": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXEnumElementDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>enumDefId<b>
       */
      enumdefid?: number;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "appData": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "stateName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXGlobalState {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      appData?: any;
      /**
       * 
       */
      stateName?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "appData": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "stateName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXGlobalStateBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      appData?: any;
      /**
       * 
       */
      stateName?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "credStoreId": 12345,
     *   "description": "...",
     *   "groupSource": 12345,
     *   "groupType": 12345,
     *   "id": 12345,
     *   "isVisible": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "status": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXGroup {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>credStoreId<b>
       */
      credStoreId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      groupSource?: number; // int32
      /**
       * Returns the value for the member attribute <b>groupType<b>
       */
      groupType?: number; // int32
      /**
       * 
       */
      isVisible?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>status<b>
       */
      status?: number; // int32
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "groupId": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "parentGroupId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXGroupGroup {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>parentGroupId<b>
       */
      parentGroupId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "groupId": 12345,
     *   "id": 12345,
     *   "isAllowed": 12345,
     *   "moduleId": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXGroupPermission {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      groupId?: number;
      /**
       * 
       */
      isAllowed?: number;
      /**
       * 
       */
      moduleId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "parentGroupId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345
     * }
     */
    export interface XXGroupUser {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>parentGroupId<b>
       */
      parentGroupId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "module": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "url": "..."
     * }
     */
    export interface XXModuleDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      module?: any;
      /**
       * 
       */
      url?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "grantOrRevoke": true,
     *   "groupId": 12345,
     *   "id": 12345,
     *   "ipAddress": "...",
     *   "isRecursive": 12345,
     *   "isWildCard": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "permFor": 12345,
     *   "permGroup": "...",
     *   "permType": 12345,
     *   "resourceId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345
     * }
     */
    export interface XXPermMap {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>grantOrRevoke<b>
       */
      grantOrRevoke?: boolean;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * 
       */
      ipAddress?: any;
      /**
       * Returns the value for the member attribute <b>isRecursive<b>
       */
      isRecursive?: number; // int32
      /**
       * Returns the value for the member attribute <b>isWildCard<b>
       */
      isWildCard?: boolean;
      /**
       * Returns the value for the member attribute <b>permFor<b>
       */
      permFor?: number; // int32
      /**
       * Returns the value for the member attribute <b>permGroup<b>
       */
      permGroup?: any;
      /**
       * Returns the value for the member attribute <b>permType<b>
       */
      permType?: number; // int32
      /**
       * Returns the value for the member attribute <b>resourceId<b>
       */
      resourceId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
    }
    /**
     * XXPluginInfo
     * 
     * example:
     * {
     *   "appType": "...",
     *   "createTime": 12345,
     *   "hostName": "...",
     *   "id": 12345,
     *   "info": "...",
     *   "ipAddress": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "serviceName": "...",
     *   "updateTime": 12345
     * }
     */
    export interface XXPluginInfo {
      /**
       * 
       */
      appType?: any;
      /**
       * 
       */
      createTime?: number;
      /**
       * 
       */
      hostName?: any;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      info?: any;
      /**
       * 
       */
      ipAddress?: any;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * 
       */
      serviceName?: any;
      /**
       * 
       */
      updateTime?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isAuditEnabled": true,
     *   "isEnabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "options": "...",
     *   "policyPriority": 12345,
     *   "policyText": "...",
     *   "policyType": 12345,
     *   "resourceSignature": "...",
     *   "service": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXPolicy {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>isAuditEnabled<b>
       */
      isAuditEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>options<b>
       */
      options?: any;
      /**
       * 
       */
      policyPriority?: number;
      /**
       * 
       */
      policyText?: any;
      /**
       * 
       */
      policyType?: number;
      /**
       * 
       */
      resourceSignature?: any;
      /**
       * Returns the value for the member attribute <b>service<b>
       */
      service?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
      /**
       * 
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isAuditEnabled": true,
     *   "isEnabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "options": "...",
     *   "policyPriority": 12345,
     *   "policyText": "...",
     *   "policyType": 12345,
     *   "resourceSignature": "...",
     *   "service": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXPolicyBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>isAuditEnabled<b>
       */
      isAuditEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>options<b>
       */
      options?: any;
      /**
       * 
       */
      policyPriority?: number;
      /**
       * 
       */
      policyText?: any;
      /**
       * 
       */
      policyType?: number;
      /**
       * 
       */
      resourceSignature?: any;
      /**
       * Returns the value for the member attribute <b>service<b>
       */
      service?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
      /**
       * 
       */
      zoneId?: number;
    }
    /**
     * XXPolicyChangeLog
     * 
     * example:
     * {
     *   "changeType": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "policyType": 12345,
     *   "policyVersion": 12345,
     *   "serviceId": 12345,
     *   "serviceType": "...",
     *   "zoneName": "..."
     * }
     */
    export interface XXPolicyChangeLog {
      /**
       * 
       */
      changeType?: number;
      /**
       * 
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * 
       */
      policyId?: number;
      /**
       * 
       */
      policyType?: number;
      /**
       * 
       */
      policyVersion?: number;
      /**
       * 
       */
      serviceId?: number;
      /**
       * 
       */
      serviceType?: any;
      /**
       * 
       */
      zoneName?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defid": 12345,
     *   "description": "...",
     *   "evaluator": "...",
     *   "evaluatoroptions": "...",
     *   "id": 12345,
     *   "itemId": 12345,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "rbKeyValidationMessage": "...",
     *   "rbkeydescription": "...",
     *   "rbkeylabel": "...",
     *   "uiHint": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "validationMessage": "...",
     *   "validationRegEx": "..."
     * }
     */
    export interface XXPolicyConditionDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>evaluator<b>
       */
      evaluator?: any;
      /**
       * Returns the value for the member attribute <b>evaluatorOptions<b>
       */
      evaluatoroptions?: any;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * 
       */
      rbKeyValidationMessage?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyDescription<b>
       */
      rbkeydescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * 
       */
      uiHint?: any;
      /**
       * 
       */
      validationMessage?: any;
      /**
       * 
       */
      validationRegEx?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "agentId": "...",
     *   "clientIP": "...",
     *   "clusterName": "...",
     *   "createTime": 12345,
     *   "exportedJson": "...",
     *   "httpRetCode": 12345,
     *   "id": 12345,
     *   "lastUpdated": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyVersion": 12345,
     *   "repositoryName": "...",
     *   "requestedEpoch": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "zoneName": "..."
     * }
     */
    export interface XXPolicyExportAudit {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>agentId<b>
       */
      agentId?: any;
      /**
       * Returns the value for the member attribute <b>clientIP<b>
       */
      clientIP?: any;
      /**
       * Returns the value for the member attribute <b>clusterName<b>
       */
      clusterName?: any;
      /**
       * Returns the value for the member attribute <b>exportedJson<b>
       */
      exportedJson?: any;
      /**
       * Returns the value for the member attribute <b>httpRetCode<b>
       */
      httpRetCode?: number; // int32
      /**
       * Returns the value for the member attribute <b>lastUpdated<b>
       */
      lastUpdated?: number;
      /**
       * Returns the value for the member attribute <b>policyVersion<b>
       */
      policyVersion?: number;
      /**
       * Returns the value for the member attribute <b>repositoryName<b>
       */
      repositoryName?: any;
      /**
       * Returns the value for the member attribute <b>requestedEpoch<b>
       */
      requestedEpoch?: number;
      /**
       * Returns the value for the member attribute <b>zoneName<b>
       */
      zoneName?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "GUID": "...",
     *   "addedByUserId": 12345,
     *   "comments": "...",
     *   "createTime": 12345,
     *   "delegateAdmin": true,
     *   "id": 12345,
     *   "isEnabled": true,
     *   "itemType": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "order": 12345,
     *   "policyid": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyItem {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      GUID?: any;
      /**
       * Returns the value for the member attribute <b>comments<b>
       */
      comments?: any;
      /**
       * Returns the value for the member attribute <b>delegateAdmin<b>
       */
      delegateAdmin?: boolean;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>itemType<b>
       */
      itemType?: number;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyid?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "GUID": "...",
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "isallowed": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "order": 12345,
     *   "policyitemid": 12345,
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyItemAccess {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      GUID?: any;
      /**
       * Returns the value for the member attribute <b>isAllowed<b>
       */
      isallowed?: boolean;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>policyItemId<b>
       */
      policyitemid?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "GUID": "...",
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "order": 12345,
     *   "policyitemid": 12345,
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "value": "..."
     * }
     */
    export interface XXPolicyItemCondition {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      GUID?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>policyItemId<b>
       */
      policyitemid?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: number;
      /**
       * Returns the value for the member attribute <b>value<b>
       */
      value?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "conditionExpr": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyItemId": 12345,
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "valueExpr": "..."
     * }
     */
    export interface XXPolicyItemDataMaskInfo {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>valueExpr<b>
       */
      conditionExpr?: any;
      /**
       * Returns the value for the member attribute <b>policyItemId<b>
       */
      policyItemId?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: number;
      /**
       * Returns the value for the member attribute <b>valueExpr<b>
       */
      valueExpr?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "groupid": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "order": 12345,
     *   "policyitemid": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyItemGroupPerm {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupid?: number;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>policyItemId<b>
       */
      policyitemid?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "filterExpr": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyItemId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyItemRowFilterInfo {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>filterExpr<b>
       */
      filterExpr?: any;
      /**
       * Returns the value for the member attribute <b>policyItemId<b>
       */
      policyItemId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "order": 12345,
     *   "policyitemid": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userid": 12345
     * }
     */
    export interface XXPolicyItemUserPerm {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>policyItemId<b>
       */
      policyitemid?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userid?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "guid": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyLabel": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyLabel {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      policyLabel?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "guid": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "policyLabelId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyLabelMap {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      policyId?: number;
      /**
       * 
       */
      policyLabelId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "accessDefId": 12345,
     *   "accessTypeName": "...",
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyRefAccessType {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>accessDefId<b>
       */
      accessDefId?: number;
      /**
       * Returns the value for the member attribute <b>accessTypeName<b>
       */
      accessTypeName?: any;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "conditionDefId": 12345,
     *   "conditionName": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyRefCondition {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>conditionDefId<b>
       */
      conditionDefId?: number;
      /**
       * Returns the value for the member attribute <b>conditionName<b>
       */
      conditionName?: any;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "dataMaskDefId": 12345,
     *   "dataMaskTypeName": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyRefDataMaskType {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>dataMaskDefId<b>
       */
      dataMaskDefId?: number;
      /**
       * Returns the value for the member attribute <b>dataMaskTypeName<b>
       */
      dataMaskTypeName?: any;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "groupId": 12345,
     *   "groupName": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyRefGroup {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>groupName<b>
       */
      groupName?: any;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "resourceDefId": 12345,
     *   "resourceName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyRefResource {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
      /**
       * Returns the value for the member attribute <b>resourceDefId<b>
       */
      resourceDefId?: number;
      /**
       * Returns the value for the member attribute <b>resourceName<b>
       */
      resourceName?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "roleId": 12345,
     *   "roleName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyRefRole {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
      /**
       * Returns the value for the member attribute <b>roleId<b>
       */
      roleId?: number;
      /**
       * Returns the value for the member attribute <b>roleName<b>
       */
      roleName?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345,
     *   "userName": "..."
     * }
     */
    export interface XXPolicyRefUser {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
      /**
       * Returns the value for the member attribute <b>userName<b>
       */
      userName?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "isexcludes": true,
     *   "isrecursive": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyid": 12345,
     *   "resdefid": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXPolicyResource {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>isExcludes<b>
       */
      isexcludes?: boolean;
      /**
       * Returns the value for the member attribute <b>isRecursive<b>
       */
      isrecursive?: boolean;
      /**
       * Returns the value for the member attribute <b>policyId<b>
       */
      policyid?: number;
      /**
       * Returns the value for the member attribute <b>resDefId<b>
       */
      resdefid?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "order": 12345,
     *   "resourceid": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "value": "..."
     * }
     */
    export interface XXPolicyResourceMap {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>resourceId<b>
       */
      resourceid?: number;
      /**
       * Returns the value for the member attribute <b>value<b>
       */
      value?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isAuditEnabled": true,
     *   "isEnabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "options": "...",
     *   "policyPriority": 12345,
     *   "policyText": "...",
     *   "policyType": 12345,
     *   "resourceSignature": "...",
     *   "service": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXPolicyWithAssignedId {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>isAuditEnabled<b>
       */
      isAuditEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>options<b>
       */
      options?: any;
      /**
       * 
       */
      policyPriority?: number;
      /**
       * 
       */
      policyText?: any;
      /**
       * 
       */
      policyType?: number;
      /**
       * 
       */
      resourceSignature?: any;
      /**
       * Returns the value for the member attribute <b>service<b>
       */
      service?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
      /**
       * 
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "emailAddress": "...",
     *   "firstName": "...",
     *   "id": 12345,
     *   "lastName": "...",
     *   "loginId": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "notes": "...",
     *   "password": "...",
     *   "publicScreenName": "...",
     *   "status": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userSource": 12345
     * }
     */
    export interface XXPortalUser {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>emailAddress<b>
       */
      emailAddress?: any;
      /**
       * Returns the value for the member attribute <b>firstName<b>
       */
      firstName?: any;
      /**
       * Returns the value for the member attribute <b>lastName<b>
       */
      lastName?: any;
      /**
       * Returns the value for the member attribute <b>loginId<b>
       */
      loginId?: any;
      /**
       * Returns the value for the member attribute <b>notes<b>
       */
      notes?: any;
      /**
       * Returns the value for the member attribute <b>password<b>
       */
      password?: any;
      /**
       * Returns the value for the member attribute <b>publicScreenName<b>
       */
      publicScreenName?: any;
      /**
       * Returns the value for the member attribute <b>status<b>
       */
      status?: number; // int32
      /**
       * Returns the value for the member attribute <b>userSource<b>
       */
      userSource?: number; // int32
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "status": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345,
     *   "userRole": "..."
     * }
     */
    export interface XXPortalUserRole {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>status<b>
       */
      status?: number; // int32
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
      /**
       * Returns the value for the member attribute <b>userRole<b>
       */
      userRole?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "assetId": 12345,
     *   "columnFamilies": "...",
     *   "columnType": 12345,
     *   "columns": "...",
     *   "createTime": 12345,
     *   "databases": "...",
     *   "description": "...",
     *   "id": 12345,
     *   "isEncrypt": 12345,
     *   "isRecursive": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "parentId": 12345,
     *   "parentPath": "...",
     *   "policyName": "...",
     *   "resourceGroup": "...",
     *   "resourceStatus": 12345,
     *   "resourceType": 12345,
     *   "services": "...",
     *   "tableType": 12345,
     *   "tables": "...",
     *   "topologies": "...",
     *   "udfs": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXResource {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>assetId<b>
       */
      assetId?: number;
      /**
       * Returns the value for the member attribute <b>columnFamilies<b>
       */
      columnFamilies?: any;
      /**
       * Returns the value for the member attribute <b>columnType<b>
       */
      columnType?: number; // int32
      /**
       * Returns the value for the member attribute <b>columns<b>
       */
      columns?: any;
      /**
       * Returns the value for the member attribute <b>databases<b>
       */
      databases?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>isEncrypt<b>
       */
      isEncrypt?: number; // int32
      /**
       * Returns the value for the member attribute <b>isRecursive<b>
       */
      isRecursive?: number; // int32
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>parentId<b>
       */
      parentId?: number;
      /**
       * Returns the value for the member attribute <b>parentPath<b>
       */
      parentPath?: any;
      /**
       * 
       */
      policyName?: any;
      /**
       * Returns the value for the member attribute <b>resourceGroup<b>
       */
      resourceGroup?: any;
      /**
       * Returns the value for the member attribute <b>resourceStatus<b>
       */
      resourceStatus?: number; // int32
      /**
       * Returns the value for the member attribute <b>resourceType<b>
       */
      resourceType?: number; // int32
      /**
       * Returns the value for the member attribute <b>services<b>
       */
      services?: any;
      /**
       * Returns the value for the member attribute <b>tableType<b>
       */
      tableType?: number; // int32
      /**
       * Returns the value for the member attribute <b>tables<b>
       */
      tables?: any;
      /**
       * Returns the value for the member attribute <b>topologies<b>
       */
      topologies?: any;
      /**
       * Returns the value for the member attribute <b>udfs<b>
       */
      udfs?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "dataMaskOptions": "...",
     *   "defid": 12345,
     *   "description": "...",
     *   "excludessupported": true,
     *   "id": 12345,
     *   "itemId": 12345,
     *   "label": "...",
     *   "level": 12345,
     *   "lookupsupported": true,
     *   "mandatory": true,
     *   "matcher": "...",
     *   "matcheroptions": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "parent": 12345,
     *   "rbKeyValidationMessage": "...",
     *   "rbkeydescription": "...",
     *   "rbkeylabel": "...",
     *   "recursivesupported": true,
     *   "rowFilterOptions": "...",
     *   "type": "...",
     *   "uiHint": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "validationMessage": "...",
     *   "validationRegEx": "..."
     * }
     */
    export interface XXResourceDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      dataMaskOptions?: any;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>excludesSupported<b>
       */
      excludessupported?: boolean;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>level<b>
       */
      level?: number;
      /**
       * Returns the value for the member attribute <b>lookUpSupported<b>
       */
      lookupsupported?: boolean;
      /**
       * Returns the value for the member attribute <b>mandatory<b>
       */
      mandatory?: boolean;
      /**
       * Returns the value for the member attribute <b>matcher<b>
       */
      matcher?: any;
      /**
       * Returns the value for the member attribute <b>matcherOptions<b>
       */
      matcheroptions?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * Returns the value for the member attribute <b>parent<b>
       */
      parent?: number;
      /**
       * 
       */
      rbKeyValidationMessage?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyDescription<b>
       */
      rbkeydescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * Returns the value for the member attribute <b>recursiveSupported<b>
       */
      recursivesupported?: boolean;
      /**
       * 
       */
      rowFilterOptions?: any;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: any;
      /**
       * 
       */
      uiHint?: any;
      /**
       * 
       */
      validationMessage?: any;
      /**
       * 
       */
      validationRegEx?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "options": "...",
     *   "roleText": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXRole {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      options?: any;
      /**
       * 
       */
      roleText?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "options": "...",
     *   "roleText": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXRoleBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      options?: any;
      /**
       * 
       */
      roleText?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "groupId": 12345,
     *   "groupName": "...",
     *   "groupType": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "roleId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXRoleRefGroup {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>groupName<b>
       */
      groupName?: any;
      /**
       * Returns the value for the member attribute <b>groupType<b>
       */
      groupType?: number;
      /**
       * Returns the value for the member attribute <b>roleId<b>
       */
      roleId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "roleId": 12345,
     *   "subRoleId": 12345,
     *   "subRoleName": "...",
     *   "subRoleType": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXRoleRefRole {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>roleId<b>
       */
      roleId?: number;
      /**
       * Returns the value for the member attribute <b>subRoleId<b>
       */
      subRoleId?: number;
      /**
       * Returns the value for the member attribute <b>subRoleName<b>
       */
      subRoleName?: any;
      /**
       * Returns the value for the member attribute <b>subRoleType<b>
       */
      subRoleType?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "roleId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345,
     *   "userName": "...",
     *   "userType": 12345
     * }
     */
    export interface XXRoleRefUser {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>roleId<b>
       */
      roleId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
      /**
       * Returns the value for the member attribute <b>userName<b>
       */
      userName?: any;
      /**
       * Returns the value for the member attribute <b>userType<b>
       */
      userType?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "jsonData": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXSecurityZone {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      jsonData?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "jsonData": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXSecurityZoneBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      description?: any;
      /**
       * 
       */
      jsonData?: any;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "groupId": 12345,
     *   "groupName": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userType": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXSecurityZoneRefGroup {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>groupId<b>
       */
      groupId?: number;
      /**
       * Returns the value for the member attribute <b>groupName<b>
       */
      groupName?: any;
      /**
       * Returns the value for the member attribute <b>groupType<b>
       */
      userType?: number;
      /**
       * Returns the value for the member attribute <b>zoneId<b>
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "resourceDefId": 12345,
     *   "resourceName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXSecurityZoneRefResource {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>resourceDefId<b>
       */
      resourceDefId?: number;
      /**
       * Returns the value for the member attribute <b>resourceName<b>
       */
      resourceName?: any;
      /**
       * Returns the value for the member attribute <b>zoneId<b>
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "serviceId": 12345,
     *   "serviceName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXSecurityZoneRefService {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>serviceId<b>
       */
      serviceId?: number;
      /**
       * Returns the value for the member attribute <b>serviceName<b>
       */
      serviceName?: any;
      /**
       * Returns the value for the member attribute <b>zoneId<b>
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "tagServiceId": 12345,
     *   "tagServiceName": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXSecurityZoneRefTagService {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      tagServiceId?: number;
      /**
       * 
       */
      tagServiceName?: any;
      /**
       * 
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345,
     *   "userName": "...",
     *   "userType": 12345,
     *   "zoneId": 12345
     * }
     */
    export interface XXSecurityZoneRefUser {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>userId<b>
       */
      userId?: number;
      /**
       * Returns the value for the member attribute <b>userName<b>
       */
      userName?: any;
      /**
       * Returns the value for the member attribute <b>userType<b>
       */
      userType?: number;
      /**
       * Returns the value for the member attribute <b>zoneId<b>
       */
      zoneId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isenabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "tagService": 12345,
     *   "tagUpdateTime": 12345,
     *   "tagVersion": 12345,
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXService {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isenabled?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>policyUpdateTime<b>
       */
      policyUpdateTime?: number;
      /**
       * Returns the value for the member attribute <b>policyVersion<b>
       */
      policyVersion?: number;
      /**
       * Returns the value for the member attribute <b>tagService<b>
       */
      tagService?: number;
      /**
       * Returns the value for the member attribute <b>tagUpdateTime<b>
       */
      tagUpdateTime?: number;
      /**
       * Returns the value for the member attribute <b>tagVersion<b>
       */
      tagVersion?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isenabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "tagService": 12345,
     *   "tagUpdateTime": 12345,
     *   "tagVersion": 12345,
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXServiceBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isenabled?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>policyUpdateTime<b>
       */
      policyUpdateTime?: number;
      /**
       * Returns the value for the member attribute <b>policyVersion<b>
       */
      policyVersion?: number;
      /**
       * Returns the value for the member attribute <b>tagService<b>
       */
      tagService?: number;
      /**
       * Returns the value for the member attribute <b>tagUpdateTime<b>
       */
      tagUpdateTime?: number;
      /**
       * Returns the value for the member attribute <b>tagVersion<b>
       */
      tagVersion?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defaultvalue": "...",
     *   "defid": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "isMandatory": true,
     *   "itemId": 12345,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "order": 12345,
     *   "rbKeyValidationMessage": "...",
     *   "rbkeydescription": "...",
     *   "rbkeylabel": "...",
     *   "subtype": "...",
     *   "type": "...",
     *   "uiHint": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "validationMessage": "...",
     *   "validationRegEx": "..."
     * }
     */
    export interface XXServiceConfigDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defaultValue<b>
       */
      defaultvalue?: any;
      /**
       * Returns the value for the member attribute <b>defId<b>
       */
      defid?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>isMandatory<b>
       */
      isMandatory?: boolean;
      /**
       * Returns the value for the member attribute <b>itemId<b>
       */
      itemId?: number;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>order<b>
       */
      order?: number;
      /**
       * 
       */
      rbKeyValidationMessage?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyDecription<b>
       */
      rbkeydescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * Returns the value for the member attribute <b>subType<b>
       */
      subtype?: any;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: any;
      /**
       * 
       */
      uiHint?: any;
      /**
       * 
       */
      validationMessage?: any;
      /**
       * 
       */
      validationRegEx?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "configkey": "...",
     *   "configvalue": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "serviceId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXServiceConfigMap {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>configKey<b>
       */
      configkey?: any;
      /**
       * Returns the value for the member attribute <b>configValue<b>
       */
      configvalue?: any;
      /**
       * Returns the value for the member attribute <b>service<b>
       */
      serviceId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defOptions": "...",
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "implclassname": "...",
     *   "isEnabled": true,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "rbkeydescription": "...",
     *   "rbkeylabel": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXServiceDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defOptions<b>
       */
      defOptions?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>implClassName<b>
       */
      implclassname?: any;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyDescription<b>
       */
      rbkeydescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defOptions": "...",
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "implclassname": "...",
     *   "isEnabled": true,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "rbkeydescription": "...",
     *   "rbkeylabel": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXServiceDefBase {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defOptions<b>
       */
      defOptions?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>implClassName<b>
       */
      implclassname?: any;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyDescription<b>
       */
      rbkeydescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "defOptions": "...",
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "implclassname": "...",
     *   "isEnabled": true,
     *   "label": "...",
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "rbkeydescription": "...",
     *   "rbkeylabel": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXServiceDefWithAssignedId {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>defOptions<b>
       */
      defOptions?: any;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>implClassName<b>
       */
      implclassname?: any;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isEnabled?: boolean;
      /**
       * Returns the value for the member attribute <b>label<b>
       */
      label?: any;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyDescription<b>
       */
      rbkeydescription?: any;
      /**
       * Returns the value for the member attribute <b>rbKeyLabel<b>
       */
      rbkeylabel?: any;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "resourceSignature": "...",
     *   "serviceId": 12345,
     *   "serviceResourceElements": "...",
     *   "tags": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXServiceResource {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      isEnabled?: boolean;
      /**
       * 
       */
      resourceSignature?: any;
      /**
       * 
       */
      serviceId?: number;
      /**
       * 
       */
      serviceResourceElements?: any;
      /**
       * 
       */
      tags?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "isExcludes": true,
     *   "isRecursive": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "resDefId": 12345,
     *   "resourceId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXServiceResourceElement {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      isExcludes?: boolean;
      /**
       * 
       */
      isRecursive?: boolean;
      /**
       * 
       */
      resDefId?: number;
      /**
       * 
       */
      resourceId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "resElementId": 12345,
     *   "sortOrder": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "value": "..."
     * }
     */
    export interface XXServiceResourceElementValue {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      resElementId?: number;
      /**
       * 
       */
      sortOrder?: number;
      /**
       * 
       */
      value?: any;
    }
    /**
     * XXServiceVersionInfo
     * 
     * example:
     * {
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "serviceId": 12345,
     *   "tagUpdateTime": 12345,
     *   "tagVersion": 12345
     * }
     */
    export interface XXServiceVersionInfo {
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * 
       */
      policyUpdateTime?: number;
      /**
       * 
       */
      policyVersion?: number;
      /**
       * 
       */
      serviceId?: number;
      /**
       * 
       */
      tagUpdateTime?: number;
      /**
       * 
       */
      tagVersion?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "description": "...",
     *   "guid": "...",
     *   "id": 12345,
     *   "isenabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "policyUpdateTime": 12345,
     *   "policyVersion": 12345,
     *   "tagService": 12345,
     *   "tagUpdateTime": 12345,
     *   "tagVersion": 12345,
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXServiceWithAssignedId {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * 
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * 
       */
      guid?: any;
      /**
       * Returns the value for the member attribute <b>isEnabled<b>
       */
      isenabled?: boolean;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>policyUpdateTime<b>
       */
      policyUpdateTime?: number;
      /**
       * Returns the value for the member attribute <b>policyVersion<b>
       */
      policyVersion?: number;
      /**
       * Returns the value for the member attribute <b>tagService<b>
       */
      tagService?: number;
      /**
       * Returns the value for the member attribute <b>tagUpdateTime<b>
       */
      tagUpdateTime?: number;
      /**
       * Returns the value for the member attribute <b>tagVersion<b>
       */
      tagVersion?: number;
      /**
       * Returns the value for the member attribute <b>type<b>
       */
      type?: number;
      /**
       * Returns the value for the member attribute <b>version<b>
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "guid": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "options": "...",
     *   "owner": 12345,
     *   "tagAttrs": "...",
     *   "type": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXTag {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      options?: any;
      /**
       * 
       */
      owner?: number;
      /**
       * 
       */
      tagAttrs?: any;
      /**
       * 
       */
      type?: number;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "tagId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "value": "..."
     * }
     */
    export interface XXTagAttribute {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      tagId?: number;
      /**
       * 
       */
      value?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "tagDefId": 12345,
     *   "type": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXTagAttributeDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      tagDefId?: number;
      /**
       * 
       */
      type?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "guid": "...",
     *   "id": 12345,
     *   "isEnabled": true,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "source": "...",
     *   "tagAttrDefs": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "version": 12345
     * }
     */
    export interface XXTagDef {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      isEnabled?: boolean;
      /**
       * 
       */
      name?: any;
      /**
       * 
       */
      source?: any;
      /**
       * 
       */
      tagAttrDefs?: any;
      /**
       * 
       */
      version?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "guid": "...",
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "resourceId": 12345,
     *   "tagId": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXTagResourceMap {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      guid?: any;
      /**
       * 
       */
      resourceId?: number;
      /**
       * 
       */
      tagId?: number;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "action": "...",
     *   "addedByUserId": 12345,
     *   "attributeName": "...",
     *   "createTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "newValue": "...",
     *   "objectClassType": 12345,
     *   "objectId": 12345,
     *   "objectName": "...",
     *   "parentObjectClassType": 12345,
     *   "parentObjectId": 12345,
     *   "parentObjectName": "...",
     *   "previousValue": "...",
     *   "requestId": "...",
     *   "sessionId": "...",
     *   "sessionType": "...",
     *   "transactionId": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXTrxLog {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>action<b>
       */
      action?: any;
      /**
       * Returns the value for the member attribute <b>attributeName<b>
       */
      attributeName?: any;
      /**
       * Returns the value for the member attribute <b>newValue<b>
       */
      newValue?: any;
      /**
       * Returns the value for the member attribute <b>objectClassType<b>
       */
      objectClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>objectId<b>
       */
      objectId?: number;
      /**
       * Returns the value for the member attribute <b>objectName<b>
       */
      objectName?: any;
      /**
       * Returns the value for the member attribute <b>parentObjectClassType<b>
       */
      parentObjectClassType?: number; // int32
      /**
       * Returns the value for the member attribute <b>parentObjectId<b>
       */
      parentObjectId?: number;
      /**
       * Returns the value for the member attribute <b>parentObjectName<b>
       */
      parentObjectName?: any;
      /**
       * Returns the value for the member attribute <b>previousValue<b>
       */
      previousValue?: any;
      /**
       * Returns the value for the member attribute <b>requestId<b>
       */
      requestId?: any;
      /**
       * Returns the value for the member attribute <b>sessionId<b>
       */
      sessionId?: any;
      /**
       * Returns the value for the member attribute <b>sessionType<b>
       */
      sessionType?: any;
      /**
       * Returns the value for the member attribute <b>transactionId<b>
       */
      transactionId?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "eventTime": 12345,
     *   "id": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "noOfModifiedGroups": 12345,
     *   "noOfModifiedUsers": 12345,
     *   "noOfNewGroups": 12345,
     *   "noOfNewUsers": 12345,
     *   "sessionId": "...",
     *   "syncSource": "...",
     *   "syncSourceInfo": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userName": "..."
     * }
     */
    export interface XXUgsyncAuditInfo {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      eventTime?: number;
      /**
       * 
       */
      noOfModifiedGroups?: number;
      /**
       * 
       */
      noOfModifiedUsers?: number;
      /**
       * 
       */
      noOfNewGroups?: number;
      /**
       * 
       */
      noOfNewUsers?: number;
      /**
       * 
       */
      sessionId?: any;
      /**
       * 
       */
      syncSource?: any;
      /**
       * 
       */
      syncSourceInfo?: any;
      /**
       * 
       */
      userName?: any;
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "credStoreId": 12345,
     *   "description": "...",
     *   "id": 12345,
     *   "isVisible": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "name": "...",
     *   "status": 12345,
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345
     * }
     */
    export interface XXUser {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>credStoreId<b>
       */
      credStoreId?: number;
      /**
       * Returns the value for the member attribute <b>description<b>
       */
      description?: any;
      /**
       * Returns the value for the member attribute <b>isVisible<b>
       */
      isVisible?: number;
      /**
       * Returns the value for the member attribute <b>name<b>
       */
      name?: any;
      /**
       * Returns the value for the member attribute <b>status<b>
       */
      status?: number; // int32
    }
    /**
     * XXDBBase
     * 
     * example:
     * {
     *   "addedByUserId": 12345,
     *   "createTime": 12345,
     *   "id": 12345,
     *   "isAllowed": 12345,
     *   "moduleId": 12345,
     *   "myClassType": 12345,
     *   "myDisplayValue": "...",
     *   "updateTime": 12345,
     *   "updatedByUserId": 12345,
     *   "userId": 12345
     * }
     */
    export interface XXUserPermission {
      /**
       * Returns the value for the member attribute <b>addedByUserId<b>
       */
      addedByUserId?: number;
      /**
       * Returns the value for the member attribute <b>createTime<b>
       */
      createTime?: number;
      /**
       * Returns the value for the member attribute <b>id<b>
       */
      id?: number;
      /**
       * 
       */
      myClassType?: number; // int32
      /**
       * 
       */
      myDisplayValue?: any;
      /**
       * Returns the value for the member attribute <b>updateTime<b>
       */
      updateTime?: number;
      /**
       * Returns the value for the member attribute <b>updatedByUserId<b>
       */
      updatedByUserId?: number;
      /**
       * 
       */
      isAllowed?: number;
      /**
       * 
       */
      moduleId?: number;
      /**
       * 
       */
      userId?: number;
    }
  }
}
declare namespace Paths {
  namespace AddGroups {
    export type RequestBody = Components.Schemas.AddGroupsToUser;
  }
  namespace AddGroupsToRole {
    export type RequestBody = Components.Schemas.AddGroupsToRole;
  }
  namespace AddMembers {
    export type RequestBody = Components.Schemas.AddMembersToGroup;
  }
  namespace AddTenantIdp {
    export type RequestBody = Components.Schemas.IdentityProviderRepresentation;
  }
  namespace AddUser {
    export type RequestBody = Components.Schemas.AddUser;
  }
  namespace AddUsersToRole {
    export type RequestBody = Components.Schemas.AddUsersToRole;
  }
  namespace AddchildGroup {
    export type RequestBody = Components.Schemas.GroupRepresentation;
  }
  namespace ArchiveConnection {
    export type RequestBody = Components.Schemas.ConnectionArchive;
  }
  namespace ConnectionQuery {
    export type RequestBody = Components.Schemas.ConnectionQuery;
  }
  namespace ConnectionTest {
    export type RequestBody = Components.Schemas.ConnectionTest;
  }
  namespace CreateAccessToken {
    export type RequestBody = Components.Schemas.CreateAccessToken;
  }
  namespace CreateAlert {
    export type RequestBody = Components.Schemas.CreateAlert;
  }
  namespace CreateAtlanAssetPolicy {
    export type RequestBody = Components.Schemas.RangerAtlanAssetPolicy;
  }
  namespace CreateAtlanJob {
    export type RequestBody = Components.Schemas.Job;
  }
  namespace CreateConnection {
    export type RequestBody = Components.Schemas.ConnectionSetup;
  }
  namespace CreateCredential {
    export type RequestBody = Components.Schemas.Credential;
  }
  namespace CreateEmail {
    export type RequestBody = Components.Schemas.CreateEmail;
  }
  namespace CreateGroup {
    export type RequestBody = Components.Schemas.CreateGroup;
  }
  namespace CreateNotification {
    export type RequestBody = Components.Schemas.CreateNotification;
  }
  namespace CreatePolicy {
    export type RequestBody = Components.Schemas.RangerPolicy;
  }
  namespace CreateRequest {
    export type RequestBody = Components.Schemas.CreateRequest;
  }
  namespace CreateSms {
    export type RequestBody = Components.Schemas.CreateSms;
  }
  namespace CreateTemplate {
    export type RequestBody = Components.Schemas.CreateTemplate;
  }
  namespace CreateTenant {
    export type RequestBody = Components.Schemas.CreateTenant;
  }
  namespace CreateTenantIdpMapper {
    export type RequestBody = Components.Schemas.IdentityProviderMapperRepresentation;
  }
  namespace CreateUserAssetSuggestion {
    export type RequestBody = Components.Schemas.CreateUserAssetSuggestion;
  }
  namespace EvaluatePolicies {
    export type RequestBody = Components.Schemas.EvaluateAccess;
  }
  namespace GetAlert {
    namespace Parameters {
      export type Columns = string[];
      export type Exists = boolean;
    }
    export interface QueryParameters {
      columns?: Parameters.Columns;
      exists?: Parameters.Exists;
    }
  }
  namespace GetAllAccessLogs {
    namespace Parameters {
      export type Result = string;
      export type Sort = string;
    }
    export interface QueryParameters {
      result?: Parameters.Result;
      sort?: Parameters.Sort;
    }
  }
  namespace GetAllUserSessions {
    namespace Parameters {
      export type SessionType = string;
    }
    export interface QueryParameters {
      sessionType?: Parameters.SessionType;
    }
  }
  namespace GetBukUsers {
    export type RequestBody = Components.Schemas.BulkUserRepresentation;
  }
  namespace GetCurrentUser {
    namespace Responses {
      export type $200 = Components.Schemas.UserRepresentation;
    }
  }
  namespace GetFile {
    namespace Parameters {
      export type ContentDisposition = string;
      export type Id = string; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
      export type Name = string;
    }
    export interface PathParameters {
      id: Parameters.Id; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
    export interface QueryParameters {
      ContentDisposition: Parameters.ContentDisposition;
      name: Parameters.Name;
    }
  }
  namespace GetGroup {
    namespace Responses {
      export type $200 = Components.Schemas.GroupRepresentation;
    }
  }
  namespace GetImage {
    namespace Parameters {
      export type ContentDisposition = string;
      export type Id = string; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
      export type Name = string;
    }
    export interface PathParameters {
      id: Parameters.Id; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
    export interface QueryParameters {
      ContentDisposition: Parameters.ContentDisposition;
      name: Parameters.Name;
    }
  }
  namespace GetPolicesAttachedToAsset {
    namespace Parameters {
      export type AssetType = string;
      export type Classifications = string[];
    }
    export interface QueryParameters {
      assetType?: Parameters.AssetType;
      classifications?: Parameters.Classifications;
    }
  }
  namespace GetRecentAssets {
    namespace Parameters {
      export type Assets = number;
      export type Typenames = string[];
      export type Username = string;
    }
    export interface QueryParameters {
      username?: Parameters.Username;
      typenames?: Parameters.Typenames;
      assets?: Parameters.Assets;
    }
  }
  namespace GetRole {
    namespace Responses {
      export type $200 = Components.Schemas.RoleRepresentation;
    }
  }
  namespace GetSms {
    namespace Parameters {
      export type Columns = string[];
      export type Exists = boolean;
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export interface QueryParameters {
      columns?: Parameters.Columns;
      exists?: Parameters.Exists;
    }
  }
  namespace GetTenant {
    namespace Responses {
      export type $200 = Components.Schemas.RealmRepresentation;
    }
  }
  namespace GetTenantAdminEvents {
    namespace Responses {
      export type $200 = Components.Schemas.AdminEventRepresentation;
    }
  }
  namespace GetTenantEvents {
    namespace Responses {
      export type $200 = Components.Schemas.EventRepresentation;
    }
  }
  namespace GetTopAssets {
    namespace Parameters {
      export type Assets = number;
      export type Typenames = string[];
      export type Username = string;
    }
    export interface QueryParameters {
      username?: Parameters.Username;
      typenames?: Parameters.Typenames;
      assets?: Parameters.Assets;
    }
  }
  namespace GetTopTerms {
    namespace Parameters {
      export type GlossaryQualifiedName = string;
      export type Terms = number;
      export type Username = string;
    }
    export interface QueryParameters {
      username?: Parameters.Username;
      glossaryQualifiedName?: Parameters.GlossaryQualifiedName;
      terms?: Parameters.Terms;
    }
  }
  namespace GetTopUsers {
    namespace Parameters {
      export type Users = number;
    }
    export interface QueryParameters {
      users?: Parameters.Users;
    }
  }
  namespace GetUser {
    namespace Responses {
      export type $200 = Components.Schemas.UserRepresentation;
    }
  }
  namespace GetUserEvents {
    namespace Responses {
      export type $200 = Components.Schemas.EventRepresentation;
    }
  }
  namespace ListAlerts {
    namespace Parameters {
      export type Columns = string[];
      export type Count = boolean;
      export type Filter = string;
      export type Limit = number;
      export type Offset = number;
      export type Sort = string[];
    }
    export interface QueryParameters {
      limit?: Parameters.Limit;
      offset?: Parameters.Offset;
      filter?: Parameters.Filter;
      count?: Parameters.Count;
      sort?: Parameters.Sort;
      columns?: Parameters.Columns;
    }
  }
  namespace ListArchivedWorkflows {
    namespace Parameters {
      export type Continue = string;
      export type FieldSelector = string;
      export type LabelSelector = string;
      export type ResourceVersion = string;
    }
    export interface QueryParameters {
      continue?: Parameters.Continue;
      fieldSelector?: Parameters.FieldSelector;
      labelSelector?: Parameters.LabelSelector;
      resourceVersion?: Parameters.ResourceVersion;
    }
  }
  namespace ListWorkflows {
    namespace Parameters {
      export type Continue = string;
      export type FieldSelector = string;
      export type Fields = string;
      export type LabelSelector = string;
      export type ResourceVersion = string;
    }
    export interface QueryParameters {
      continue?: Parameters.Continue;
      fieldSelector?: Parameters.FieldSelector;
      labelSelector?: Parameters.LabelSelector;
      fields?: Parameters.Fields;
      resourceVersion?: Parameters.ResourceVersion;
    }
  }
  namespace PaginatePolicy {
    namespace Parameters {
      export type Group = string;
      export type IsEnabled = string;
      export type Page = string;
      export type PageSize = string;
      export type PolicyLabelsPartial = string;
      export type PolicyNamePartial = string;
      export type PolicyType = string;
      export type ResourceAatlasService = string;
      export type ResourceEndOneEntity = string;
      export type ResourceEndOneEntityClassification = string;
      export type ResourceEndOneEntityType = string;
      export type ResourceEndTwoEntity = string;
      export type ResourceEndTwoEntityClassification = string;
      export type ResourceEndTwoEntityType = string;
      export type ResourceEntity = string;
      export type ResourceEntityClassification = string;
      export type ResourceEntityType = string;
      export type ResourceRelationshipType = string;
      export type ResourceTypeCategory = string;
      export type StartIndex = string;
      export type User = string;
    }
    export interface QueryParameters {
      pageSize?: Parameters.PageSize;
      startIndex?: Parameters.StartIndex;
      page?: Parameters.Page;
      policyType?: Parameters.PolicyType;
      "resource:end-one-entity-classification"?: Parameters.ResourceEndOneEntityClassification;
      "resource:end-one-entity"?: Parameters.ResourceEndOneEntity;
      "resource:end-one-entity-type"?: Parameters.ResourceEndOneEntityType;
      "resource:end-two-entity-classification"?: Parameters.ResourceEndTwoEntityClassification;
      "resource:end-two-entity"?: Parameters.ResourceEndTwoEntity;
      "resource:end-two-entity-type"?: Parameters.ResourceEndTwoEntityType;
      "resource:entity-classification"?: Parameters.ResourceEntityClassification;
      "resource:entity"?: Parameters.ResourceEntity;
      "resource:entity-type"?: Parameters.ResourceEntityType;
      "resource:relationship-type"?: Parameters.ResourceRelationshipType;
      "resource:type-category"?: Parameters.ResourceTypeCategory;
      "resource:Aatlas-service"?: Parameters.ResourceAatlasService;
      group?: Parameters.Group;
      policyLabelsPartial?: Parameters.PolicyLabelsPartial;
      policyNamePartial?: Parameters.PolicyNamePartial;
      isEnabled?: Parameters.IsEnabled;
      user?: Parameters.User;
    }
  }
  namespace PostAssetPolicy {
    export type RequestBody = Components.Schemas.RangerAssetPolicy;
  }
  namespace PreviewTemplate {
    export type RequestBody = Components.Schemas.PreviewTemplate;
  }
  namespace RemoveGroupsFromRole {
    export type RequestBody = Components.Schemas.AddGroupsToRole;
  }
  namespace RemoveMembers {
    export type RequestBody = Components.Schemas.AddMembersToGroup;
  }
  namespace RemoveUsersFromRole {
    export type RequestBody = Components.Schemas.AddUsersToRole;
  }
  namespace ScheduleAtlanJob {
    export type RequestBody = Components.Schemas.ScheduleAtlanJob;
  }
  namespace SmtpConfigTest {
    export type RequestBody = Components.Schemas.SmtpConfigTest;
  }
  namespace Tenants$TenantAlertsId {
    namespace Parameters {
      export type Id = string; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
    export interface PathParameters {
      id: Parameters.Id; // ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
    }
  }
  namespace Tenants$TenantEventsMain {
    namespace Parameters {
      export type AuthClient = string;
      export type AuthIpAddress = string;
      export type AuthRealm = string;
      export type AuthUser = string;
      export type DateFrom = string;
      export type DateTo = string;
      export type First = number; // int32
      export type Max = number; // int32
      export type OperationTypes = string[];
      export type ResourcePath = string;
      export type ResourceTypes = string[];
    }
    export interface QueryParameters {
      authClient?: Parameters.AuthClient;
      authIpAddress?: Parameters.AuthIpAddress;
      authRealm?: Parameters.AuthRealm;
      authUser?: Parameters.AuthUser;
      dateFrom?: Parameters.DateFrom;
      dateTo?: Parameters.DateTo;
      first?: Parameters.First; // int32
      max?: Parameters.Max; // int32
      operationTypes?: Parameters.OperationTypes;
      resourcePath?: Parameters.ResourcePath;
      resourceTypes?: Parameters.ResourceTypes;
    }
  }
  namespace Tenants$TenantPoliciesAssetsAssetGuid {
    namespace Parameters {
      export type AssetGuid = string;
    }
    export interface PathParameters {
      assetGuid?: Parameters.AssetGuid;
    }
  }
  namespace Tenants$TenantPoliciesAtlanId {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id?: Parameters.Id;
    }
  }
  namespace Tenants$TenantPoliciesId {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id?: Parameters.Id;
    }
  }
  namespace Tenants$TenantPoliciesIdDelete {
    namespace Parameters {
      export type Id = number;
    }
    export interface PathParameters {
      id?: Parameters.Id;
    }
  }
  namespace UpdateAtlanAssetPolicy {
    export type RequestBody = Components.Schemas.RangerAtlanAssetPolicy;
  }
  namespace UpdateAtlanJob {
    export type RequestBody = Components.Schemas.Job;
  }
  namespace UpdateConnection {
    export type RequestBody = Components.Schemas.ConnectionSetup;
  }
  namespace UpdateCredential {
    export type RequestBody = Components.Schemas.Credential;
  }
  namespace UpdateGroup {
    export type RequestBody = Components.Schemas.GroupRepresentation;
  }
  namespace UpdateNotification {
    export type RequestBody = Components.Schemas.UpdateNotification;
  }
  namespace UpdatePolicy {
    export type RequestBody = Components.Schemas.RangerPolicy;
  }
  namespace UpdateRegistrationInfo {
    export type RequestBody = Components.Schemas.UpdateRegistrationInfo;
  }
  namespace UpdateRequest {
    export type RequestBody = Components.Schemas.UpdateRequest;
  }
  namespace UpdateTemplateAlias {
    export type RequestBody = Components.Schemas.UpdateTemplate;
  }
  namespace UpdateTenant {
    export type RequestBody = Components.Schemas.RealmRepresentation;
  }
  namespace UpdateTenantIdp {
    export type RequestBody = Components.Schemas.IdentityProviderRepresentation;
  }
  namespace UpdateTenantIdpMapper {
    export type RequestBody = Components.Schemas.IdentityProviderMapperRepresentation;
  }
  namespace UpdateUser {
    export type RequestBody = Components.Schemas.UserRepresentation;
  }
  namespace UpdateUserAssetSuggestion {
    export type RequestBody = Components.Schemas.UpdateUserAssetSuggestion;
  }
  namespace UpdateUserPassword {
    export type RequestBody = Components.Schemas.UpdatePassword;
  }
  namespace UpdateUserRole {
    export type RequestBody = Components.Schemas.UpdateUserRole;
  }
}

export interface OperationMethods {
  /**
   * cacheClear - to clear the cache for certificates
   */
  'cacheClear'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * debugHealth - Liveness check
   * 
   * used by Kubernetes liveness probe
   */
  'debugHealth'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * debugReady - Liveness check
   * 
   * used by Kubernetes readiness probe
   */
  'debugReady'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveK8sResource - Archive k8s secret by alias
   */
  'archiveK8sResource'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createTenant - Get current tenant in case of single tenant
   */
  'createTenant'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateTenant.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTenant - Get tenant by tenant
   */
  'getTenant'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTenant.Responses.$200>
  /**
   * updateTenant - Update the top-level information of the tenant   Any user, roles or client information in the representation  will be ignored.
   * 
   * Update Tenant by tenant
   */
  'updateTenant'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateTenant.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteTenant - Delete tenant.
   * 
   * Delete Tenant by tenant
   */
  'deleteTenant'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * evaluatePolicies - Evaluate Policies
   */
  'evaluatePolicies'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.EvaluatePolicies.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listAccessToken - List access tokens
   */
  'listAccessToken'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createAccessToken - Create access token
   */
  'createAccessToken'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateAccessToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteAccessToken - Delete access token
   */
  'deleteAccessToken'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * resetAccessTokens - Reset access tokens
   */
  'resetAccessTokens'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getRecentAssets - get recent assets of an user or all users
   */
  'getRecentAssets'(
    parameters?: Parameters<Paths.GetRecentAssets.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTopAssets - get top assets of an user or all users
   */
  'getTopAssets'(
    parameters?: Parameters<Paths.GetTopAssets.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTopTerms - get top terms of an user or all users
   */
  'getTopTerms'(
    parameters?: Parameters<Paths.GetTopTerms.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTopUsers - get top users of an asset/tenant
   */
  'getTopUsers'(
    parameters?: Parameters<Paths.GetTopUsers.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listAlerts - Create a new alert
   */
  'listAlerts'(
    parameters?: Parameters<Paths.ListAlerts.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createAlert - Create a new alert
   */
  'createAlert'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateAlert.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getAlert - Get alert by objectid
   */
  'getAlert'(
    parameters?: Parameters<Paths.GetAlert.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createAvatar - Create a new avatar
   */
  'createAvatar'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getAvatar - Get avatar by objectid
   */
  'getAvatar'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveAvatar - Archive avatar by objectid
   */
  'archiveAvatar'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createConnection - Setup connection
   */
  'createConnection'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateConnection.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateConnection - update connection
   */
  'updateConnection'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateConnection.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveConnection - Delete a connection
   */
  'archiveConnection'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.ArchiveConnection.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * connectionQuery - Update connection query config
   */
  'connectionQuery'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.ConnectionQuery.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * connectionTest - Check connection connectivity
   */
  'connectionTest'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.ConnectionTest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createCredential - Create a new credential
   */
  'createCredential'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateCredential.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getCredential - Get credential by id
   */
  'getCredential'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateCredential - Update credential by objectid
   */
  'updateCredential'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateCredential.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveCredential - Archive subscription by objectid
   */
  'archiveCredential'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createEmail - Create a new email
   */
  'createEmail'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateEmail.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getEmail - Get email by objectid
   */
  'getEmail'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTenantEvents - Get tenant events
   */
  'getTenantEvents'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTenantEvents.Responses.$200>
  /**
   * getTenantAdminEvents - Get admin events
   */
  'getTenantAdminEvents'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTenantAdminEvents.Responses.$200>
  /**
   * createFile - Create a new file
   */
  'createFile'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getFile - Get file by objectid
   */
  'getFile'(
    parameters?: Parameters<Paths.GetFile.PathParameters & Paths.GetFile.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listGroups - List groups
   */
  'listGroups'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createGroup - Create a new group
   */
  'createGroup'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateGroup.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getGroup - Get group by objectid
   */
  'getGroup'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetGroup.Responses.$200>
  /**
   * updateGroup - Update group by objectid
   */
  'updateGroup'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateGroup.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * addchildGroup - Add Child to a group
   */
  'addchildGroup'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddchildGroup.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteGroup - Delete a group
   */
  'deleteGroup'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getMembers - Add Child to a group
   */
  'getMembers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * addMembers - Add members to a group
   */
  'addMembers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddMembers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * removeMembers - Remove members from a group
   */
  'removeMembers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.RemoveMembers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listGroupsV2 - List groups V2
   */
  'listGroupsV2'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listTenantIdps - Get tenant idps
   */
  'listTenantIdps'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * addTenantIdp - Create new idp instance
   */
  'addTenantIdp'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddTenantIdp.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTenantIdpByAlias - Get tenant idps
   */
  'getTenantIdpByAlias'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateTenantIdp - Update idp instance
   */
  'updateTenantIdp'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateTenantIdp.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * DeleteTenantIdp - Delete idp instance
   */
  'DeleteTenantIdp'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listTenantIdpMappers - List tenant idp mappers
   */
  'listTenantIdpMappers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createTenantIdpMapper - Create new idp mapper
   */
  'createTenantIdpMapper'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateTenantIdpMapper.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTenantIdpMapper - Get tenant idp mapper by id
   */
  'getTenantIdpMapper'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateTenantIdpMapper - Update idp mapper 
   */
  'updateTenantIdpMapper'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateTenantIdpMapper.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteTenantIdpMapper - Delete idp mapper
   */
  'deleteTenantIdpMapper'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getDefaultIDP - Get default IDP
   */
  'getDefaultIDP'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * setDefaultIDP - Set default IDP
   */
  'setDefaultIDP'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * removeDefaultIDP - Remove default IDP
   */
  'removeDefaultIDP'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createImage - Create a new image
   */
  'createImage'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getImage - Get image by objectid
   */
  'getImage'(
    parameters?: Parameters<Paths.GetImage.PathParameters & Paths.GetImage.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createAtlanJob - Create new AtlanJob
   */
  'createAtlanJob'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateAtlanJob.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getAtlanJob - Get AtlanJob
   */
  'getAtlanJob'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateAtlanJob - Update AtlanJob
   */
  'updateAtlanJob'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateAtlanJob.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * scheduleAtlanJob - Schedule AtlanJob
   */
  'scheduleAtlanJob'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.ScheduleAtlanJob.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * submitAtlanJob - Submit AtlanJob
   */
  'submitAtlanJob'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * suspendAtlanJobSchedule - Suspend schedule of AtlanJob
   */
  'suspendAtlanJobSchedule'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTenantMetricsTable - Sync Keycloak with ranger
   */
  'getTenantMetricsTable'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTenantMetricsUsers - Tenant Metrics with Top Users
   */
  'getTenantMetricsUsers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listNotifications - List notifications
   */
  'listNotifications'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createNotification - Create a new notification
   */
  'createNotification'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateNotification.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getNotification - Get notification by objectid
   */
  'getNotification'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateNotification - Update notification by objectid
   */
  'updateNotification'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateNotification.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createPolicy - Create a new ranger policy
   */
  'createPolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreatePolicy.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getPolicy - Get ranger policy
   */
  'getPolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updatePolicy - Create a new ranger policy
   */
  'updatePolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdatePolicy.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deletePolicy - Delete a ranger policy
   */
  'deletePolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getAllAccessLogs - Get all user sessions
   */
  'getAllAccessLogs'(
    parameters?: Parameters<Paths.GetAllAccessLogs.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getPolicesAttachedToAsset - paginate policies attached to asset
   */
  'getPolicesAttachedToAsset'(
    parameters?: Parameters<Paths.GetPolicesAttachedToAsset.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getAssetPolicy - Create ranger policy for asset
   */
  'getAssetPolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postAssetPolicy - Create ranger policy for asset
   */
  'postAssetPolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.PostAssetPolicy.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createAtlanAssetPolicy - Create ranger policy for atlan asset
   */
  'createAtlanAssetPolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateAtlanAssetPolicy.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateAtlanAssetPolicy - Update ranger policy for atlan asset
   */
  'updateAtlanAssetPolicy'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateAtlanAssetPolicy.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getLastSync - Delete a ranger policy
   */
  'getLastSync'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * paginatePolicy - paginate ranger policies
   */
  'paginatePolicy'(
    parameters?: Parameters<Paths.PaginatePolicy.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * rangerSync - Sync Keycloak with ranger
   */
  'rangerSync'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateRegistrationInfo - Get tenant by tenant
   */
  'updateRegistrationInfo'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateRegistrationInfo.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listRequests - Create a new request
   */
  'listRequests'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createRequest - Create a new request
   */
  'createRequest'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getRequest - Get request by objectid
   */
  'getRequest'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateRequest - Update request by objectid
   */
  'updateRequest'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveRequest - Archive subscription by objectid
   */
  'archiveRequest'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listRoles - List roles
   */
  'listRoles'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getRole - Get role by objectid
   */
  'getRole'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetRole.Responses.$200>
  /**
   * addGroupsToRole - Add groups to role
   */
  'addGroupsToRole'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddGroupsToRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * removeGroupsFromRole - Remove groups from role
   */
  'removeGroupsFromRole'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.RemoveGroupsFromRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * addUsersToRole - Add users to role
   */
  'addUsersToRole'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddUsersToRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * removeUsersFromRole - Remove users from role
   */
  'removeUsersFromRole'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.RemoveUsersFromRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listWorkflows - List runs
   */
  'listWorkflows'(
    parameters?: Parameters<Paths.ListWorkflows.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * streamWorkflowLogs - Stream logs of a workflow
   */
  'streamWorkflowLogs'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * resubmitWorkflow - Resubmit a workflow
   */
  'resubmitWorkflow'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * resumeWorkflow - Resume a workflow
   */
  'resumeWorkflow'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * retryWorkflow - Retry workflow by workflowName
   */
  'retryWorkflow'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * stopWorkflow - Stop a workflow
   */
  'stopWorkflow'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * suspendWorkflow - Suspend a workflow
   */
  'suspendWorkflow'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * terminateWorkflow - Terminate a worklfow
   */
  'terminateWorkflow'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listArchivedWorkflows - List archived runs
   */
  'listArchivedWorkflows'(
    parameters?: Parameters<Paths.ListArchivedWorkflows.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * GetArchivedWorkflowLogArtifact - Get logs artifact of an archived workflow
   */
  'GetArchivedWorkflowLogArtifact'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createSms - Create a new sms
   */
  'createSms'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateSms.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getSms - Get sms by objectid
   */
  'getSms'(
    parameters?: Parameters<Paths.GetSms.PathParameters & Paths.GetSms.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * smtpConfigTest - Sync Keycloak with ranger
   */
  'smtpConfigTest'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.SmtpConfigTest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listTemplates - List Templates
   */
  'listTemplates'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createTemplate - Create a new Template
   */
  'createTemplate'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateTemplate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listTemplateHistory - Get Template History
   */
  'listTemplateHistory'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTemplateAlias - Get Template By Alias
   */
  'getTemplateAlias'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateTemplateAlias - Update Template by Alias
   */
  'updateTemplateAlias'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateTemplateAlias.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveTemplateAlias - Archive Template by Alias
   */
  'archiveTemplateAlias'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * previewTemplate - Get Template Preview By Alias
   */
  'previewTemplate'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.PreviewTemplate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listUserAssetSuggestions - Create a new userAssetSuggestion
   */
  'listUserAssetSuggestions'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * createUserAssetSuggestion - Create a new userAssetSuggestion
   */
  'createUserAssetSuggestion'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.CreateUserAssetSuggestion.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getUserAssetSuggestion - Get userAssetSuggestion by objectid
   */
  'getUserAssetSuggestion'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateUserAssetSuggestion - Update userAssetSuggestion by objectid
   */
  'updateUserAssetSuggestion'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateUserAssetSuggestion.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * archiveUserAssetSuggestion - Archive subscription by objectid
   */
  'archiveUserAssetSuggestion'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listUserAssetSuggestionHistory - Get UserAssetSuggestion History
   */
  'listUserAssetSuggestionHistory'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getUserAssetSuggestionHistory - Get UserAssetSuggestion History
   */
  'getUserAssetSuggestionHistory'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listUsers - List users
   */
  'listUsers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * addUser - Add user
   */
  'addUser'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getUser - Get user by objectid
   */
  'getUser'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUser.Responses.$200>
  /**
   * updateUser - Update user by objectid
   */
  'updateUser'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getAccessLogs - Get all user sessions
   */
  'getAccessLogs'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteUser - Delete a user
   */
  'deleteUser'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getUserEvents - Get user events
   */
  'getUserEvents'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUserEvents.Responses.$200>
  /**
   * getUserGroups - get groups of a user
   */
  'getUserGroups'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * addGroups - Add groups to a user
   */
  'addGroups'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AddGroups.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * resendVerificationEmail - Send an email for updating password
   */
  'resendVerificationEmail'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateUserRole - Update user role
   */
  'updateUserRole'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateUserRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getUserSessions - Get user sessions
   */
  'getUserSessions'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteUserAllSession - Delete user's all session
   */
  'deleteUserAllSession'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * syncCurrentUser - Sync the current user with ranger
   */
  'syncCurrentUser'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateUserPassword - Set up a new password for the user.
   */
  'updateUserPassword'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UpdateUserPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * updateUserPasswordEmail - Send an email for updating password
   */
  'updateUserPasswordEmail'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getBukUsers - get users in bulk
   */
  'getBukUsers'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.GetBukUsers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getCurrentUser - Get current user
   */
  'getCurrentUser'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCurrentUser.Responses.$200>
  /**
   * getAllUserSessions - Get all user sessions
   */
  'getAllUserSessions'(
    parameters?: Parameters<Paths.GetAllUserSessions.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteUserSession - Delete user session
   */
  'deleteUserSession'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * listUsersV2 - List users V2
   */
  'listUsersV2'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getTemplateHistory - Get Template History
   */
  'getTemplateHistory'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * checkTenantExists - Check if tenant with the id exists
   */
  'checkTenantExists'(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
}

export interface PathsDictionary {
  ['/debug/cacheclear']: {
    /**
     * cacheClear - to clear the cache for certificates
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/debug/health']: {
    /**
     * debugHealth - Liveness check
     * 
     * used by Kubernetes liveness probe
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/debug/ready']: {
    /**
     * debugReady - Liveness check
     * 
     * used by Kubernetes readiness probe
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/internal/tenants/{tenant}/k8s/{resourceType}/{alias}/archive']: {
    /**
     * archiveK8sResource - Archive k8s secret by alias
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants']: {
    /**
     * createTenant - Get current tenant in case of single tenant
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateTenant.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}']: {
    /**
     * deleteTenant - Delete tenant.
     * 
     * Delete Tenant by tenant
     */
    'delete'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * getTenant - Get tenant by tenant
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTenant.Responses.$200>
    /**
     * updateTenant - Update the top-level information of the tenant   Any user, roles or client information in the representation  will be ignored.
     * 
     * Update Tenant by tenant
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateTenant.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/access/evaluate']: {
    /**
     * evaluatePolicies - Evaluate Policies
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.EvaluatePolicies.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/accesstokens']: {
    /**
     * listAccessToken - List access tokens
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createAccessToken - Create access token
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateAccessToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/accesstokens/{id}/delete']: {
    /**
     * deleteAccessToken - Delete access token
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/accesstokens/reset']: {
    /**
     * resetAccessTokens - Reset access tokens
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/adoption/recentassets']: {
    /**
     * getRecentAssets - get recent assets of an user or all users
     */
    'get'(
      parameters?: Parameters<Paths.GetRecentAssets.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/adoption/topassets']: {
    /**
     * getTopAssets - get top assets of an user or all users
     */
    'get'(
      parameters?: Parameters<Paths.GetTopAssets.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/adoption/topterms']: {
    /**
     * getTopTerms - get top terms of an user or all users
     */
    'get'(
      parameters?: Parameters<Paths.GetTopTerms.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/adoption/topusers']: {
    /**
     * getTopUsers - get top users of an asset/tenant
     */
    'get'(
      parameters?: Parameters<Paths.GetTopUsers.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/alerts']: {
    /**
     * listAlerts - Create a new alert
     */
    'get'(
      parameters?: Parameters<Paths.ListAlerts.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createAlert - Create a new alert
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateAlert.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/alerts/{id}']: {
    /**
     * getAlert - Get alert by objectid
     */
    'get'(
      parameters?: Parameters<Paths.GetAlert.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/avatars']: {
    /**
     * createAvatar - Create a new avatar
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/avatars/{avatar}']: {
    /**
     * getAvatar - Get avatar by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/avatars/{avatar}/archive']: {
    /**
     * archiveAvatar - Archive avatar by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/connections']: {
    /**
     * createConnection - Setup connection
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateConnection.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/connections/{id}']: {
    /**
     * updateConnection - update connection
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateConnection.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/connections/{id}/archive']: {
    /**
     * archiveConnection - Delete a connection
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.ArchiveConnection.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/connections/{id}/query']: {
    /**
     * connectionQuery - Update connection query config
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.ConnectionQuery.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/connections/test']: {
    /**
     * connectionTest - Check connection connectivity
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.ConnectionTest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/credentials']: {
    /**
     * createCredential - Create a new credential
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateCredential.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/credentials/{id}']: {
    /**
     * getCredential - Get credential by id
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateCredential - Update credential by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateCredential.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/credentials/{id}/archive']: {
    /**
     * archiveCredential - Archive subscription by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/emails']: {
    /**
     * createEmail - Create a new email
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateEmail.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/emails/{id}']: {
    /**
     * getEmail - Get email by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/events/login']: {
    /**
     * getTenantEvents - Get tenant events
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTenantEvents.Responses.$200>
  }
  ['/tenants/{tenant}/events/main']: {
    /**
     * getTenantAdminEvents - Get admin events
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTenantAdminEvents.Responses.$200>
  }
  ['/tenants/{tenant}/files']: {
    /**
     * createFile - Create a new file
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/files/{id}']: {
    /**
     * getFile - Get file by objectid
     */
    'get'(
      parameters?: Parameters<Paths.GetFile.PathParameters & Paths.GetFile.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups']: {
    /**
     * listGroups - List groups
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createGroup - Create a new group
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateGroup.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups/{id}']: {
    /**
     * getGroup - Get group by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetGroup.Responses.$200>
    /**
     * updateGroup - Update group by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateGroup.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups/{id}/addchild']: {
    /**
     * addchildGroup - Add Child to a group
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddchildGroup.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups/{id}/delete']: {
    /**
     * deleteGroup - Delete a group
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups/{id}/members']: {
    /**
     * getMembers - Add Child to a group
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * addMembers - Add members to a group
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddMembers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups/{id}/members/remove']: {
    /**
     * removeMembers - Remove members from a group
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.RemoveMembers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/groups/v2']: {
    /**
     * listGroupsV2 - List groups V2
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp']: {
    /**
     * listTenantIdps - Get tenant idps
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * addTenantIdp - Create new idp instance
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddTenantIdp.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/{alias}']: {
    /**
     * getTenantIdpByAlias - Get tenant idps
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateTenantIdp - Update idp instance
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateTenantIdp.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/{alias}/delete']: {
    /**
     * DeleteTenantIdp - Delete idp instance
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/{alias}/mappers']: {
    /**
     * listTenantIdpMappers - List tenant idp mappers
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createTenantIdpMapper - Create new idp mapper
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateTenantIdpMapper.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/{alias}/mappers/{id}']: {
    /**
     * getTenantIdpMapper - Get tenant idp mapper by id
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateTenantIdpMapper - Update idp mapper 
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateTenantIdpMapper.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/{alias}/mappers/{id}/delete']: {
    /**
     * deleteTenantIdpMapper - Delete idp mapper
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/default']: {
    /**
     * getDefaultIDP - Get default IDP
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/default/{alias}']: {
    /**
     * setDefaultIDP - Set default IDP
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/idp/default/{alias}/delete']: {
    /**
     * removeDefaultIDP - Remove default IDP
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/images']: {
    /**
     * createImage - Create a new image
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/images/{id}']: {
    /**
     * getImage - Get image by objectid
     */
    'get'(
      parameters?: Parameters<Paths.GetImage.PathParameters & Paths.GetImage.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/jobs']: {
    /**
     * createAtlanJob - Create new AtlanJob
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateAtlanJob.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/jobs/{id}']: {
    /**
     * getAtlanJob - Get AtlanJob
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateAtlanJob - Update AtlanJob
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateAtlanJob.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/jobs/{id}/schedule']: {
    /**
     * scheduleAtlanJob - Schedule AtlanJob
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.ScheduleAtlanJob.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/jobs/{id}/submit']: {
    /**
     * submitAtlanJob - Submit AtlanJob
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/jobs/{id}/suspend']: {
    /**
     * suspendAtlanJobSchedule - Suspend schedule of AtlanJob
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/metrics/toptables']: {
    /**
     * getTenantMetricsTable - Sync Keycloak with ranger
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/metrics/topusers']: {
    /**
     * getTenantMetricsUsers - Tenant Metrics with Top Users
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/notifications']: {
    /**
     * listNotifications - List notifications
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createNotification - Create a new notification
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateNotification.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/notifications/{id}']: {
    /**
     * getNotification - Get notification by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateNotification - Update notification by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateNotification.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies']: {
    /**
     * createPolicy - Create a new ranger policy
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreatePolicy.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/{id}']: {
    /**
     * getPolicy - Get ranger policy
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updatePolicy - Create a new ranger policy
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdatePolicy.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/{id}/delete']: {
    /**
     * deletePolicy - Delete a ranger policy
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/accesslogs']: {
    /**
     * getAllAccessLogs - Get all user sessions
     */
    'get'(
      parameters?: Parameters<Paths.GetAllAccessLogs.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/asset']: {
    /**
     * getPolicesAttachedToAsset - paginate policies attached to asset
     */
    'get'(
      parameters?: Parameters<Paths.GetPolicesAttachedToAsset.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/assets/{assetGuid}']: {
    /**
     * getAssetPolicy - Create ranger policy for asset
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * postAssetPolicy - Create ranger policy for asset
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.PostAssetPolicy.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/atlan']: {
    /**
     * createAtlanAssetPolicy - Create ranger policy for atlan asset
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateAtlanAssetPolicy.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/atlan/{id}']: {
    /**
     * updateAtlanAssetPolicy - Update ranger policy for atlan asset
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateAtlanAssetPolicy.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/lastsync']: {
    /**
     * getLastSync - Delete a ranger policy
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/policies/paginate']: {
    /**
     * paginatePolicy - paginate ranger policies
     */
    'get'(
      parameters?: Parameters<Paths.PaginatePolicy.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/ranger/sync']: {
    /**
     * rangerSync - Sync Keycloak with ranger
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/registration/info']: {
    /**
     * updateRegistrationInfo - Get tenant by tenant
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateRegistrationInfo.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/requests']: {
    /**
     * listRequests - Create a new request
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createRequest - Create a new request
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/requests/{id}']: {
    /**
     * getRequest - Get request by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateRequest - Update request by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/requests/{id}/archive']: {
    /**
     * archiveRequest - Archive subscription by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/roles']: {
    /**
     * listRoles - List roles
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/roles/{id}']: {
    /**
     * getRole - Get role by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetRole.Responses.$200>
  }
  ['/tenants/{tenant}/roles/{id}/groups']: {
    /**
     * addGroupsToRole - Add groups to role
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddGroupsToRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/roles/{id}/groups/remove']: {
    /**
     * removeGroupsFromRole - Remove groups from role
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.RemoveGroupsFromRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/roles/{id}/users']: {
    /**
     * addUsersToRole - Add users to role
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddUsersToRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/roles/{id}/users/remove']: {
    /**
     * removeUsersFromRole - Remove users from role
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.RemoveUsersFromRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs']: {
    /**
     * listWorkflows - List runs
     */
    'get'(
      parameters?: Parameters<Paths.ListWorkflows.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/logs']: {
    /**
     * streamWorkflowLogs - Stream logs of a workflow
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/resubmit']: {
    /**
     * resubmitWorkflow - Resubmit a workflow
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/resume']: {
    /**
     * resumeWorkflow - Resume a workflow
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/retry']: {
    /**
     * retryWorkflow - Retry workflow by workflowName
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/stop']: {
    /**
     * stopWorkflow - Stop a workflow
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/suspend']: {
    /**
     * suspendWorkflow - Suspend a workflow
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/{workflowName}/terminate']: {
    /**
     * terminateWorkflow - Terminate a worklfow
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/archived']: {
    /**
     * listArchivedWorkflows - List archived runs
     */
    'get'(
      parameters?: Parameters<Paths.ListArchivedWorkflows.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/runs/archived/{id}/logs']: {
    /**
     * GetArchivedWorkflowLogArtifact - Get logs artifact of an archived workflow
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/sms']: {
    /**
     * createSms - Create a new sms
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateSms.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/sms/{id}']: {
    /**
     * getSms - Get sms by objectid
     */
    'get'(
      parameters?: Parameters<Paths.GetSms.PathParameters & Paths.GetSms.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/smtp/test']: {
    /**
     * smtpConfigTest - Sync Keycloak with ranger
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.SmtpConfigTest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/templates']: {
    /**
     * listTemplates - List Templates
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createTemplate - Create a new Template
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateTemplate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/templates/{id}/history']: {
    /**
     * listTemplateHistory - Get Template History
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/templates/alias/{alias}']: {
    /**
     * getTemplateAlias - Get Template By Alias
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateTemplateAlias - Update Template by Alias
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateTemplateAlias.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/templates/alias/{alias}/archive']: {
    /**
     * archiveTemplateAlias - Archive Template by Alias
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/templates/alias/{alias}/preview']: {
    /**
     * previewTemplate - Get Template Preview By Alias
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.PreviewTemplate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/userAssetSuggestions']: {
    /**
     * listUserAssetSuggestions - Create a new userAssetSuggestion
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * createUserAssetSuggestion - Create a new userAssetSuggestion
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.CreateUserAssetSuggestion.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/userAssetSuggestions/{id}']: {
    /**
     * getUserAssetSuggestion - Get userAssetSuggestion by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * updateUserAssetSuggestion - Update userAssetSuggestion by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateUserAssetSuggestion.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/userAssetSuggestions/{id}/archive']: {
    /**
     * archiveUserAssetSuggestion - Archive subscription by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/userAssetSuggestions/{id}/history']: {
    /**
     * listUserAssetSuggestionHistory - Get UserAssetSuggestion History
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/userAssetSuggestions/{id}/history/{version}']: {
    /**
     * getUserAssetSuggestionHistory - Get UserAssetSuggestion History
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users']: {
    /**
     * listUsers - List users
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * addUser - Add user
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}']: {
    /**
     * getUser - Get user by objectid
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUser.Responses.$200>
    /**
     * updateUser - Update user by objectid
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/accesslogs']: {
    /**
     * getAccessLogs - Get all user sessions
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/delete']: {
    /**
     * deleteUser - Delete a user
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/events']: {
    /**
     * getUserEvents - Get user events
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUserEvents.Responses.$200>
  }
  ['/tenants/{tenant}/users/{id}/groups']: {
    /**
     * getUserGroups - get groups of a user
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * addGroups - Add groups to a user
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AddGroups.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/resendinvite']: {
    /**
     * resendVerificationEmail - Send an email for updating password
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/roles/update']: {
    /**
     * updateUserRole - Update user role
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateUserRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/sessions']: {
    /**
     * getUserSessions - Get user sessions
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/sessions/delete']: {
    /**
     * deleteUserAllSession - Delete user's all session
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/sync']: {
    /**
     * syncCurrentUser - Sync the current user with ranger
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/updatepassword']: {
    /**
     * updateUserPassword - Set up a new password for the user.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UpdateUserPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/{id}/updatepasswordemail']: {
    /**
     * updateUserPasswordEmail - Send an email for updating password
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/bulk']: {
    /**
     * getBukUsers - get users in bulk
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.GetBukUsers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/current']: {
    /**
     * getCurrentUser - Get current user
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCurrentUser.Responses.$200>
  }
  ['/tenants/{tenant}/users/sessions']: {
    /**
     * getAllUserSessions - Get all user sessions
     */
    'get'(
      parameters?: Parameters<Paths.GetAllUserSessions.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/sessions/{sessionId}/delete']: {
    /**
     * deleteUserSession - Delete user session
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/users/v2']: {
    /**
     * listUsersV2 - List users V2
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/{tenant}/v1/templates/{id}/history/{version}']: {
    /**
     * getTemplateHistory - Get Template History
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/tenants/exists']: {
    /**
     * checkTenantExists - Check if tenant with the id exists
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
