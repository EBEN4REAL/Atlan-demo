import {
    OpenAPIClient,
    Parameters,
    UnknownParamsObject,
    OperationResponse,
    AxiosRequestConfig,
  } from "openapi-client-axios-ts";
  
  declare namespace Components {
    namespace Schemas {
      /**
       * AtlasAggregationEntry
       * An instance of an entity - like hive_table, hive_database.
       * example:
       * {
       *   "count": 12345,
       *   "name": "..."
       * }
       */
      export interface AtlasAggregationEntry {
        count?: number; // int64
        name?: string;
      }
      /**
       * AtlasAttributeDef
       * class that captures details of a struct-attribute.
       * example:
       * {
       *   "cardinality": "SINGLE",
       *   "constraints": [
       *     {
       *       "params": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "type": "..."
       *     },
       *     {
       *       "params": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "type": "..."
       *     }
       *   ],
       *   "defaultValue": "...",
       *   "description": "...",
       *   "displayName": "...",
       *   "includeInNotification": true,
       *   "indexType": "DEFAULT",
       *   "isIndexable": true,
       *   "isOptional": true,
       *   "isUnique": true,
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "searchWeight": 12345,
       *   "typeName": "...",
       *   "valuesMaxCount": 12345,
       *   "valuesMinCount": 12345
       * }
       */
      export interface AtlasAttributeDef {
        cardinality?: Cardinality;
        /**
         *
         */
        constraints?: AtlasConstraintDef[];
        defaultValue?: string;
        description?: string;
        displayName?: string;
        includeInNotification?: boolean;
        indexType?: IndexType;
        isIndexable?: boolean;
        isOptional?: boolean;
        isUnique?: boolean;
        name?: string;
        options?: {
          [name: string]: string;
        };
        searchWeight?: number; // int32
        typeName?: string;
        valuesMaxCount?: number; // int32
        valuesMinCount?: number; // int32
      }
      /**
       * AtlasBaseModelObject
       * example:
       * {
       *   "guid": "..."
       * }
       */
      export interface AtlasBaseModelObject {
        guid?: string;
      }
      /**
       * AtlasBaseTypeDef
       * Base class that captures common-attributes for all Atlas types.
       * example:
       * {
       *   "category": "CLASSIFICATION",
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "dateFormatter": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "HALF_EVEN"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "description": "...",
       *   "guid": "...",
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "serviceType": "...",
       *   "typeVersion": "...",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345
       * }
       */
      export interface AtlasBaseTypeDef {
        category?: TypeCategory;
        createTime?: number;
        createdBy?: string;
        dateFormatter?: DateFormat;
        description?: string;
        guid?: string;
        name?: string;
        options?: {
          [name: string]: string;
        };
        serviceType?: string;
        typeVersion?: string;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
      }
      /**
       * AtlasClassification
       * An instance of a classification; it doesn't have an identity, this object exists only when associated with an entity.
       * example:
       * {
       *   "entityGuid": "...",
       *   "entityStatus": "PURGED",
       *   "propagate": true,
       *   "removePropagationsOnEntityDelete": true,
       *   "validityPeriods": [
       *     {
       *       "endTime": "...",
       *       "startTime": "...",
       *       "timeZone": "..."
       *     },
       *     {
       *       "endTime": "...",
       *       "startTime": "...",
       *       "timeZone": "..."
       *     }
       *   ],
       *   "attributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "typeName": "..."
       * }
       */
      export interface AtlasClassification {
        attributes?: {
          [name: string]: {};
        };
        typeName?: string;
        entityGuid?: string;
        entityStatus?: Status;
        propagate?: boolean;
        removePropagationsOnEntityDelete?: boolean;
        /**
         *
         */
        validityPeriods?: TimeBoundary[];
      }
      /**
       * AtlasClassificationDef
       * class that captures details of a classification-type.
       * example:
       * {
       *   "entityTypes": [
       *     "...",
       *     "..."
       *   ],
       *   "subTypes": [
       *     "...",
       *     "..."
       *   ],
       *   "superTypes": [
       *     "...",
       *     "..."
       *   ],
       *   "attributeDefs": [
       *     {
       *       "cardinality": "LIST",
       *       "constraints": [
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         },
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         }
       *       ],
       *       "defaultValue": "...",
       *       "description": "...",
       *       "displayName": "...",
       *       "includeInNotification": true,
       *       "indexType": "DEFAULT",
       *       "isIndexable": true,
       *       "isOptional": true,
       *       "isUnique": true,
       *       "name": "...",
       *       "options": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "searchWeight": 12345,
       *       "typeName": "...",
       *       "valuesMaxCount": 12345,
       *       "valuesMinCount": 12345
       *     },
       *     {
       *       "cardinality": "SET",
       *       "constraints": [
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         },
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         }
       *       ],
       *       "defaultValue": "...",
       *       "description": "...",
       *       "displayName": "...",
       *       "includeInNotification": true,
       *       "indexType": "STRING",
       *       "isIndexable": true,
       *       "isOptional": true,
       *       "isUnique": true,
       *       "name": "...",
       *       "options": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "searchWeight": 12345,
       *       "typeName": "...",
       *       "valuesMaxCount": 12345,
       *       "valuesMinCount": 12345
       *     }
       *   ],
       *   "category": "BUSINESS_METADATA",
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "dateFormatter": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "CEILING"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "description": "...",
       *   "guid": "...",
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "serviceType": "...",
       *   "typeVersion": "...",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345
       * }
       */
      export interface AtlasClassificationDef {
        category?: TypeCategory;
        createTime?: number;
        createdBy?: string;
        dateFormatter?: DateFormat;
        description?: string;
        guid?: string;
        name?: string;
        options?: {
          [name: string]: string;
        };
        serviceType?: string;
        typeVersion?: string;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
        /**
         *
         */
        attributeDefs?: AtlasAttributeDef[];
        /**
         * Specifying a list of entityType names in the classificationDef, ensures that classifications can
         * only be applied to those entityTypes.
         * <ul>
         * <li>Any subtypes of the entity types inherit the restriction</li>
         * <li>Any classificationDef subtypes inherit the parents entityTypes restrictions</li>
         * <li>Any classificationDef subtypes can further restrict the parents entityTypes restrictions by specifying a subset of the entityTypes</li>
         * <li>An empty entityTypes list when there are no parent restrictions means there are no restrictions</li>
         * <li>An empty entityTypes list when there are parent restrictions means that the subtype picks up the parents restrictions</li>
         * <li>If a list of entityTypes are supplied, where one inherits from another, this will be rejected. This should encourage cleaner classificationsDefs</li>
         * </ul>
         */
        entityTypes?: string[];
        /**
         *
         */
        subTypes?: string[];
        /**
         *
         */
        superTypes?: string[];
      }
      /**
       * AtlasClassifications
       * REST serialization friendly list.
       * example:
       * {
       *   "list": [
       *     {},
       *     {}
       *   ],
       *   "pageSize": 12345,
       *   "sortBy": "...",
       *   "sortType": "DESC",
       *   "startIndex": 12345,
       *   "totalCount": 12345
       * }
       */
      export interface AtlasClassifications {
        /**
         *
         */
        list?: {}[];
        pageSize?: number; // int32
        sortBy?: string;
        sortType?: SortType;
        startIndex?: number; // int64
        totalCount?: number; // int64
      }
      /**
       * AtlasConstraintDef
       * class that captures details of a constraint.
       * example:
       * {
       *   "params": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "type": "..."
       * }
       */
      export interface AtlasConstraintDef {
        params?: {
          [name: string]: {};
        };
        type?: string;
      }
      /**
       * AtlasEntitiesWithExtInfo
       * An instance of an entity along with extended info - like hive_table, hive_database.
       * example:
       * {
       *   "entities": [
       *     {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "DELETED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "DELETED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "referredEntities": {
       *     "property1": {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "DELETED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "VALIDATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "PURGED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   }
       * }
       */
      export interface AtlasEntitiesWithExtInfo {
        referredEntities?: {
          [name: string]: AtlasEntity;
        };
        /**
         *
         */
        entities?: AtlasEntity[];
      }
      /**
       * AtlasEntity
       * An instance of an entity - like hive_table, hive_database.
       * example:
       * {
       *   "businessAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "DELETED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "DELETED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "customAttributes": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "guid": "...",
       *   "homeId": "...",
       *   "isIncomplete": true,
       *   "labels": [
       *     "...",
       *     "..."
       *   ],
       *   "meanings": [
       *     {
       *       "confidence": 12345,
       *       "createdBy": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DISCOVERED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "confidence": 12345,
       *       "createdBy": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "IMPORTED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "provenanceType": 12345,
       *   "proxy": true,
       *   "relationshipAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "status": "ACTIVE",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345,
       *   "attributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "typeName": "..."
       * }
       */
      export interface AtlasEntity {
        attributes?: {
          [name: string]: {};
        };
        typeName?: string;
        businessAttributes?: {
          [name: string]: {};
        };
        /**
         *
         */
        classifications?: AtlasClassification[];
        createTime?: number;
        createdBy?: string;
        customAttributes?: {
          [name: string]: string;
        };
        guid?: string;
        homeId?: string;
        isIncomplete?: boolean;
        /**
         *
         */
        labels?: string[];
        /**
         *
         */
        meanings?: AtlasTermAssignmentHeader[];
        provenanceType?: number;
        proxy?: boolean;
        relationshipAttributes?: {
          [name: string]: {};
        };
        status?: Status;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
      }
      /**
       * AtlasEntityDef
       * class that captures details of a entity-type.
       */
      export interface AtlasEntityDef {
        category?: TypeCategory;
        createTime?: number;
        createdBy?: string;
        dateFormatter?: DateFormat;
        description?: string;
        guid?: string;
        name?: string;
        options?: {
          [name: string]: string;
        };
        serviceType?: string;
        typeVersion?: string;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
        /**
         *
         */
        attributeDefs?: AtlasAttributeDef[];
        businessAttributeDefs?: {
          [name: string]: {};
        };
        /**
         *
         */
        relationshipAttributeDefs?: AtlasRelationshipAttributeDef[];
        /**
         *
         */
        subTypes?: string[];
        /**
         *
         */
        superTypes?: string[];
      }
      /**
       * AtlasEntityExtInfo
       * An instance of an entity along with extended info - like hive_table, hive_database.
       * example:
       * {
       *   "referredEntities": {
       *     "property1": {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "IMPORTED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "PURGED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "DELETED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   }
       * }
       */
      export interface AtlasEntityExtInfo {
        referredEntities?: {
          [name: string]: AtlasEntity;
        };
      }
      /**
       * AtlasEntityHeader
       * An instance of an entity - like hive_table, hive_database.
       * example:
       * {
       *   "classificationNames": [
       *     "...",
       *     "..."
       *   ],
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "displayText": "...",
       *   "guid": "...",
       *   "isIncomplete": true,
       *   "labels": [
       *     "...",
       *     "..."
       *   ],
       *   "meaningNames": [
       *     "...",
       *     "..."
       *   ],
       *   "meanings": [
       *     {
       *       "confidence": 12345,
       *       "createdBy": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "PROPOSED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "confidence": 12345,
       *       "createdBy": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DEPRECATED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "status": "PURGED",
       *   "attributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "typeName": "..."
       * }
       */
      export interface AtlasEntityHeader {
        attributes?: {
          [name: string]: {};
        };
        typeName?: string;
        /**
         *
         */
        classificationNames?: string[];
        /**
         *
         */
        classifications?: AtlasClassification[];
        displayText?: string;
        guid?: string;
        isIncomplete?: boolean;
        /**
         *
         */
        labels?: string[];
        /**
         *
         */
        meaningNames?: string[];
        /**
         *
         */
        meanings?: AtlasTermAssignmentHeader[];
        status?: Status;
      }
      /**
       * AtlasEntityHeaders
       * example:
       * {
       *   "guidHeaderMap": {
       *     "property1": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "ACTIVE",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "PURGED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   }
       * }
       */
      export interface AtlasEntityHeaders {
        guidHeaderMap?: {
          [name: string]: AtlasEntityHeader;
        };
      }
      /**
       * AtlasEntityWithExtInfo
       * An instance of an entity along with extended info - like hive_table, hive_database.
       * example:
       * {
       *   "entity": {
       *     "businessAttributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "classifications": [
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "DELETED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "ACTIVE",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       }
       *     ],
       *     "createTime": 12345,
       *     "createdBy": "...",
       *     "customAttributes": {
       *       "property1": "...",
       *       "property2": "..."
       *     },
       *     "guid": "...",
       *     "homeId": "...",
       *     "isIncomplete": true,
       *     "labels": [
       *       "...",
       *       "..."
       *     ],
       *     "meanings": [
       *       {
       *         "confidence": 12345,
       *         "createdBy": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "expression": "...",
       *         "relationGuid": "...",
       *         "source": "...",
       *         "status": "DEPRECATED",
       *         "steward": "...",
       *         "termGuid": "..."
       *       },
       *       {
       *         "confidence": 12345,
       *         "createdBy": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "expression": "...",
       *         "relationGuid": "...",
       *         "source": "...",
       *         "status": "DISCOVERED",
       *         "steward": "...",
       *         "termGuid": "..."
       *       }
       *     ],
       *     "provenanceType": 12345,
       *     "proxy": true,
       *     "relationshipAttributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "status": "PURGED",
       *     "updateTime": 12345,
       *     "updatedBy": "...",
       *     "version": 12345,
       *     "attributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "typeName": "..."
       *   },
       *   "referredEntities": {
       *     "property1": {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "IMPORTED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "DELETED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "businessAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "createTime": 12345,
       *       "createdBy": "...",
       *       "customAttributes": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "guid": "...",
       *       "homeId": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "provenanceType": 12345,
       *       "proxy": true,
       *       "relationshipAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "status": "PURGED",
       *       "updateTime": 12345,
       *       "updatedBy": "...",
       *       "version": 12345,
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   }
       * }
       */
      export interface AtlasEntityWithExtInfo {
        referredEntities?: {
          [name: string]: AtlasEntity;
        };
        entity?: AtlasEntity;
      }
      /**
       * AtlasEnumDef
       * class that captures details of an enum-type.
       * example:
       * {
       *   "defaultValue": "...",
       *   "elementDefs": [
       *     {
       *       "description": "...",
       *       "ordinal": 12345,
       *       "value": "..."
       *     },
       *     {
       *       "description": "...",
       *       "ordinal": 12345,
       *       "value": "..."
       *     }
       *   ],
       *   "category": "MAP",
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "dateFormatter": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "CEILING"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "description": "...",
       *   "guid": "...",
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "serviceType": "...",
       *   "typeVersion": "...",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345
       * }
       */
      export interface AtlasEnumDef {
        category?: TypeCategory;
        createTime?: number;
        createdBy?: string;
        dateFormatter?: DateFormat;
        description?: string;
        guid?: string;
        name?: string;
        options?: {
          [name: string]: string;
        };
        serviceType?: string;
        typeVersion?: string;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
        defaultValue?: string;
        /**
         *
         */
        elementDefs?: AtlasEnumElementDef[];
      }
      /**
       * AtlasEnumElementDef
       * class that captures details of an enum-element.
       * example:
       * {
       *   "description": "...",
       *   "ordinal": 12345,
       *   "value": "..."
       * }
       */
      export interface AtlasEnumElementDef {
        description?: string;
        ordinal?: number;
        value?: string;
      }
      /**
       * AtlasFullTextResult
       * example:
       * {
       *   "entity": {
       *     "classificationNames": [
       *       "...",
       *       "..."
       *     ],
       *     "classifications": [
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "DELETED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "PURGED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       }
       *     ],
       *     "displayText": "...",
       *     "guid": "...",
       *     "isIncomplete": true,
       *     "labels": [
       *       "...",
       *       "..."
       *     ],
       *     "meaningNames": [
       *       "...",
       *       "..."
       *     ],
       *     "meanings": [
       *       {
       *         "confidence": 12345,
       *         "createdBy": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "expression": "...",
       *         "relationGuid": "...",
       *         "source": "...",
       *         "status": "DISCOVERED",
       *         "steward": "...",
       *         "termGuid": "..."
       *       },
       *       {
       *         "confidence": 12345,
       *         "createdBy": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "expression": "...",
       *         "relationGuid": "...",
       *         "source": "...",
       *         "status": "DEPRECATED",
       *         "steward": "...",
       *         "termGuid": "..."
       *       }
       *     ],
       *     "status": "ACTIVE",
       *     "attributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "typeName": "..."
       *   },
       *   "score": 12345
       * }
       */
      export interface AtlasFullTextResult {
        entity?: AtlasEntityHeader;
        score?: number;
      }
      /**
       * AtlasGlossary
       * example:
       * {
       *   "categories": [
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "parentCategoryGuid": "...",
       *       "relationGuid": "..."
       *     },
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "parentCategoryGuid": "...",
       *       "relationGuid": "..."
       *     }
       *   ],
       *   "language": "...",
       *   "terms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "usage": "...",
       *   "additionalAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "DELETED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "longDescription": "...",
       *   "name": "...",
       *   "qualifiedName": "...",
       *   "shortDescription": "...",
       *   "guid": "..."
       * }
       */
      export interface AtlasGlossary {
        guid?: string;
        additionalAttributes?: {
          [name: string]: {};
        };
        /**
         *
         */
        classifications?: AtlasClassification[];
        longDescription?: string;
        name?: string;
        qualifiedName?: string;
        shortDescription?: string;
        /**
         *
         */
        categories?: AtlasRelatedCategoryHeader[];
        language?: string;
        /**
         *
         */
        terms?: AtlasRelatedTermHeader[];
        usage?: string;
      }
      /**
       * AtlasGlossaryBaseObject
       * example:
       * {
       *   "additionalAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "DELETED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "longDescription": "...",
       *   "name": "...",
       *   "qualifiedName": "...",
       *   "shortDescription": "...",
       *   "guid": "..."
       * }
       */
      export interface AtlasGlossaryBaseObject {
        guid?: string;
        additionalAttributes?: {
          [name: string]: {};
        };
        /**
         *
         */
        classifications?: AtlasClassification[];
        longDescription?: string;
        name?: string;
        qualifiedName?: string;
        shortDescription?: string;
      }
      /**
       * AtlasGlossaryCategory
       * example:
       * {
       *   "anchor": {
       *     "displayText": "...",
       *     "glossaryGuid": "...",
       *     "relationGuid": "..."
       *   },
       *   "childrenCategories": [
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "parentCategoryGuid": "...",
       *       "relationGuid": "..."
       *     },
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "parentCategoryGuid": "...",
       *       "relationGuid": "..."
       *     }
       *   ],
       *   "parentCategory": {
       *     "categoryGuid": "...",
       *     "description": "...",
       *     "displayText": "...",
       *     "parentCategoryGuid": "...",
       *     "relationGuid": "..."
       *   },
       *   "terms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "additionalAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "longDescription": "...",
       *   "name": "...",
       *   "qualifiedName": "...",
       *   "shortDescription": "...",
       *   "guid": "..."
       * }
       */
      export interface AtlasGlossaryCategory {
        guid?: string;
        additionalAttributes?: {
          [name: string]: {};
        };
        /**
         *
         */
        classifications?: AtlasClassification[];
        longDescription?: string;
        name?: string;
        qualifiedName?: string;
        shortDescription?: string;
        anchor?: AtlasGlossaryHeader;
        /**
         *
         */
        childrenCategories?: AtlasRelatedCategoryHeader[];
        parentCategory?: AtlasRelatedCategoryHeader;
        /**
         *
         */
        terms?: AtlasRelatedTermHeader[];
      }
      /**
       * AtlasGlossaryExtInfo
       * example:
       * {
       *   "categoryInfo": {
       *     "property1": {
       *       "anchor": {
       *         "displayText": "...",
       *         "glossaryGuid": "...",
       *         "relationGuid": "..."
       *       },
       *       "childrenCategories": [
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "parentCategoryGuid": "...",
       *           "relationGuid": "..."
       *         },
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "parentCategoryGuid": "...",
       *           "relationGuid": "..."
       *         }
       *       ],
       *       "parentCategory": {
       *         "categoryGuid": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "parentCategoryGuid": "...",
       *         "relationGuid": "..."
       *       },
       *       "terms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "additionalAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "longDescription": "...",
       *       "name": "...",
       *       "qualifiedName": "...",
       *       "shortDescription": "...",
       *       "guid": "..."
       *     },
       *     "property2": {
       *       "anchor": {
       *         "displayText": "...",
       *         "glossaryGuid": "...",
       *         "relationGuid": "..."
       *       },
       *       "childrenCategories": [
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "parentCategoryGuid": "...",
       *           "relationGuid": "..."
       *         },
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "parentCategoryGuid": "...",
       *           "relationGuid": "..."
       *         }
       *       ],
       *       "parentCategory": {
       *         "categoryGuid": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "parentCategoryGuid": "...",
       *         "relationGuid": "..."
       *       },
       *       "terms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "additionalAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "longDescription": "...",
       *       "name": "...",
       *       "qualifiedName": "...",
       *       "shortDescription": "...",
       *       "guid": "..."
       *     }
       *   },
       *   "termInfo": {
       *     "property1": {
       *       "abbreviation": "...",
       *       "anchor": {
       *         "displayText": "...",
       *         "glossaryGuid": "...",
       *         "relationGuid": "..."
       *       },
       *       "antonyms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "assignedEntities": [
       *         {
       *           "displayText": "...",
       *           "entityStatus": "ACTIVE",
       *           "relationshipAttributes": {},
       *           "relationshipGuid": "...",
       *           "relationshipStatus": "DELETED",
       *           "relationshipType": "...",
       *           "guid": "...",
       *           "typeName": "...",
       *           "uniqueAttributes": {
       *             "property1": {},
       *             "property2": {}
       *           }
       *         },
       *         {
       *           "displayText": "...",
       *           "entityStatus": "DELETED",
       *           "relationshipAttributes": {},
       *           "relationshipGuid": "...",
       *           "relationshipStatus": "DELETED",
       *           "relationshipType": "...",
       *           "guid": "...",
       *           "typeName": "...",
       *           "uniqueAttributes": {
       *             "property1": {},
       *             "property2": {}
       *           }
       *         }
       *       ],
       *       "categories": [
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "relationGuid": "...",
       *           "status": "OTHER"
       *         },
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "relationGuid": "...",
       *           "status": "OTHER"
       *         }
       *       ],
       *       "classifies": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "examples": [
       *         "...",
       *         "..."
       *       ],
       *       "isA": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "preferredTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "preferredToTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "replacedBy": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "replacementTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "seeAlso": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "synonyms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "translatedTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "translationTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "usage": "...",
       *       "validValues": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "validValuesFor": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "additionalAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "longDescription": "...",
       *       "name": "...",
       *       "qualifiedName": "...",
       *       "shortDescription": "...",
       *       "guid": "..."
       *     },
       *     "property2": {
       *       "abbreviation": "...",
       *       "anchor": {
       *         "displayText": "...",
       *         "glossaryGuid": "...",
       *         "relationGuid": "..."
       *       },
       *       "antonyms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "assignedEntities": [
       *         {
       *           "displayText": "...",
       *           "entityStatus": "ACTIVE",
       *           "relationshipAttributes": {},
       *           "relationshipGuid": "...",
       *           "relationshipStatus": "DELETED",
       *           "relationshipType": "...",
       *           "guid": "...",
       *           "typeName": "...",
       *           "uniqueAttributes": {
       *             "property1": {},
       *             "property2": {}
       *           }
       *         },
       *         {
       *           "displayText": "...",
       *           "entityStatus": "PURGED",
       *           "relationshipAttributes": {},
       *           "relationshipGuid": "...",
       *           "relationshipStatus": "ACTIVE",
       *           "relationshipType": "...",
       *           "guid": "...",
       *           "typeName": "...",
       *           "uniqueAttributes": {
       *             "property1": {},
       *             "property2": {}
       *           }
       *         }
       *       ],
       *       "categories": [
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "relationGuid": "...",
       *           "status": "OTHER"
       *         },
       *         {
       *           "categoryGuid": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "relationGuid": "...",
       *           "status": "OTHER"
       *         }
       *       ],
       *       "classifies": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "examples": [
       *         "...",
       *         "..."
       *       ],
       *       "isA": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "preferredTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DRAFT",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "preferredToTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "replacedBy": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "replacementTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "seeAlso": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "synonyms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "translatedTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "translationTerms": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "usage": "...",
       *       "validValues": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "ACTIVE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "validValuesFor": [
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "additionalAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "longDescription": "...",
       *       "name": "...",
       *       "qualifiedName": "...",
       *       "shortDescription": "...",
       *       "guid": "..."
       *     }
       *   },
       *   "categories": [
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "parentCategoryGuid": "...",
       *       "relationGuid": "..."
       *     },
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "parentCategoryGuid": "...",
       *       "relationGuid": "..."
       *     }
       *   ],
       *   "language": "...",
       *   "terms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "usage": "...",
       *   "additionalAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "ACTIVE",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "ACTIVE",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "longDescription": "...",
       *   "name": "...",
       *   "qualifiedName": "...",
       *   "shortDescription": "...",
       *   "guid": "..."
       * }
       */
      export interface AtlasGlossaryExtInfo {
        guid?: string;
        additionalAttributes?: {
          [name: string]: {};
        };
        /**
         *
         */
        classifications?: AtlasClassification[];
        longDescription?: string;
        name?: string;
        qualifiedName?: string;
        shortDescription?: string;
        /**
         *
         */
        categories?: AtlasRelatedCategoryHeader[];
        language?: string;
        /**
         *
         */
        terms?: AtlasRelatedTermHeader[];
        usage?: string;
        categoryInfo?: {
          [name: string]: AtlasGlossaryCategory;
        };
        termInfo?: {
          [name: string]: AtlasGlossaryTerm;
        };
      }
      /**
       * AtlasGlossaryHeader
       * example:
       * {
       *   "displayText": "...",
       *   "glossaryGuid": "...",
       *   "relationGuid": "..."
       * }
       */
      export interface AtlasGlossaryHeader {
        displayText?: string;
        glossaryGuid?: string;
        relationGuid?: string;
      }
      /**
       * AtlasGlossaryTerm
       * example:
       * {
       *   "abbreviation": "...",
       *   "anchor": {
       *     "displayText": "...",
       *     "glossaryGuid": "...",
       *     "relationGuid": "..."
       *   },
       *   "antonyms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DEPRECATED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DRAFT",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "assignedEntities": [
       *     {
       *       "displayText": "...",
       *       "entityStatus": "DELETED",
       *       "relationshipAttributes": {
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       "relationshipGuid": "...",
       *       "relationshipStatus": "DELETED",
       *       "relationshipType": "...",
       *       "guid": "...",
       *       "typeName": "...",
       *       "uniqueAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       }
       *     },
       *     {
       *       "displayText": "...",
       *       "entityStatus": "ACTIVE",
       *       "relationshipAttributes": {
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       "relationshipGuid": "...",
       *       "relationshipStatus": "ACTIVE",
       *       "relationshipType": "...",
       *       "guid": "...",
       *       "typeName": "...",
       *       "uniqueAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       }
       *     }
       *   ],
       *   "categories": [
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "relationGuid": "...",
       *       "status": "OTHER"
       *     },
       *     {
       *       "categoryGuid": "...",
       *       "description": "...",
       *       "displayText": "...",
       *       "relationGuid": "...",
       *       "status": "OBSOLETE"
       *     }
       *   ],
       *   "classifies": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DEPRECATED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "examples": [
       *     "...",
       *     "..."
       *   ],
       *   "isA": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DRAFT",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "preferredTerms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "preferredToTerms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DRAFT",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "replacedBy": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DRAFT",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "replacementTerms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "seeAlso": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "synonyms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "translatedTerms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DEPRECATED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "translationTerms": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OTHER",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "OBSOLETE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "usage": "...",
       *   "validValues": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DEPRECATED",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "validValuesFor": [
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "DRAFT",
       *       "steward": "...",
       *       "termGuid": "..."
       *     },
       *     {
       *       "description": "...",
       *       "displayText": "...",
       *       "expression": "...",
       *       "relationGuid": "...",
       *       "source": "...",
       *       "status": "ACTIVE",
       *       "steward": "...",
       *       "termGuid": "..."
       *     }
       *   ],
       *   "additionalAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "classifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "longDescription": "...",
       *   "name": "...",
       *   "qualifiedName": "...",
       *   "shortDescription": "...",
       *   "guid": "..."
       * }
       */
      export interface AtlasGlossaryTerm {
        guid?: string;
        additionalAttributes?: {
          [name: string]: {};
        };
        /**
         *
         */
        classifications?: AtlasClassification[];
        longDescription?: string;
        name?: string;
        qualifiedName?: string;
        shortDescription?: string;
        abbreviation?: string;
        anchor?: AtlasGlossaryHeader;
        /**
         *
         */
        antonyms?: AtlasRelatedTermHeader[];
        /**
         *
         */
        assignedEntities?: AtlasRelatedObjectId[];
        /**
         *
         */
        categories?: AtlasTermCategorizationHeader[];
        /**
         *
         */
        classifies?: AtlasRelatedTermHeader[];
        /**
         *
         */
        examples?: string[];
        /**
         *
         */
        isA?: AtlasRelatedTermHeader[];
        /**
         *
         */
        preferredTerms?: AtlasRelatedTermHeader[];
        /**
         *
         */
        preferredToTerms?: AtlasRelatedTermHeader[];
        /**
         *
         */
        replacedBy?: AtlasRelatedTermHeader[];
        /**
         *
         */
        replacementTerms?: AtlasRelatedTermHeader[];
        /**
         *
         */
        seeAlso?: AtlasRelatedTermHeader[];
        /**
         *
         */
        synonyms?: AtlasRelatedTermHeader[];
        /**
         *
         */
        translatedTerms?: AtlasRelatedTermHeader[];
        /**
         *
         */
        translationTerms?: AtlasRelatedTermHeader[];
        usage?: string;
        /**
         *
         */
        validValues?: AtlasRelatedTermHeader[];
        /**
         *
         */
        validValuesFor?: AtlasRelatedTermHeader[];
      }
      /**
       * AtlasLineageInfo
       * example:
       * {
       *   "baseEntityGuid": "...",
       *   "guidEntityMap": {
       *     "property1": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "IMPORTED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "VALIDATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "ACTIVE",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "PROPOSED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "VALIDATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "PURGED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   },
       *   "lineageDepth": 12345,
       *   "lineageDirection": "OUTPUT",
       *   "relations": [
       *     {
       *       "fromEntityId": "...",
       *       "relationshipId": "...",
       *       "toEntityId": "..."
       *     },
       *     {
       *       "fromEntityId": "...",
       *       "relationshipId": "...",
       *       "toEntityId": "..."
       *     }
       *   ]
       * }
       */
      export interface AtlasLineageInfo {
        baseEntityGuid?: string;
        guidEntityMap?: {
          [name: string]: AtlasEntityHeader;
        };
        lineageDepth?: number; // int32
        lineageDirection?: LineageDirection;
        /**
         *
         */
        relations?: LineageRelation[];
      }
      /**
       * AtlasObjectId
       * Reference to an object-instance of an Atlas type - like entity.
       * example:
       * {
       *   "guid": "...",
       *   "typeName": "...",
       *   "uniqueAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   }
       * }
       */
      export interface AtlasObjectId {
        guid?: string;
        typeName?: string;
        uniqueAttributes?: {
          [name: string]: {};
        };
      }
      /**
       * AtlasQueryType
       */
      export type AtlasQueryType =
        | "DSL"
        | "FULL_TEXT"
        | "GREMLIN"
        | "BASIC"
        | "ATTRIBUTE"
        | "RELATIONSHIP";
      /**
       * AtlasQuickSearchResult
       */
      export interface AtlasQuickSearchResult {
        aggregationMetrics?: {
          [name: string]: {};
        };
        searchResults?: AtlasSearchResult;
      }
      /**
       * AtlasRelatedCategoryHeader
       * example:
       * {
       *   "categoryGuid": "...",
       *   "description": "...",
       *   "displayText": "...",
       *   "parentCategoryGuid": "...",
       *   "relationGuid": "..."
       * }
       */
      export interface AtlasRelatedCategoryHeader {
        categoryGuid?: string;
        description?: string;
        displayText?: string;
        parentCategoryGuid?: string;
        relationGuid?: string;
      }
      /**
       * AtlasRelatedObjectId
       * Reference to an object-instance of AtlasEntity type used in relationship attribute values
       * example:
       * {
       *   "displayText": "...",
       *   "entityStatus": "ACTIVE",
       *   "relationshipAttributes": {
       *     "attributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "typeName": "..."
       *   },
       *   "relationshipGuid": "...",
       *   "relationshipStatus": "DELETED",
       *   "relationshipType": "...",
       *   "guid": "...",
       *   "typeName": "...",
       *   "uniqueAttributes": {
       *     "property1": {},
       *     "property2": {}
       *   }
       * }
       */
      export interface AtlasRelatedObjectId {
        guid?: string;
        typeName?: string;
        uniqueAttributes?: {
          [name: string]: {};
        };
        displayText?: string;
        entityStatus?: Status;
        relationshipAttributes?: AtlasStruct;
        relationshipGuid?: string;
        relationshipStatus?: Status1;
        relationshipType?: string;
      }
      /**
       * AtlasRelatedTermHeader
       * example:
       * {
       *   "description": "...",
       *   "displayText": "...",
       *   "expression": "...",
       *   "relationGuid": "...",
       *   "source": "...",
       *   "status": "OBSOLETE",
       *   "steward": "...",
       *   "termGuid": "..."
       * }
       */
      export interface AtlasRelatedTermHeader {
        description?: string;
        displayText?: string;
        expression?: string;
        relationGuid?: string;
        source?: string;
        status?: AtlasTermRelationshipStatus;
        steward?: string;
        termGuid?: string;
      }
      /**
       * AtlasRelationship
       * Atlas relationship instance.
       * example:
       * {
       *   "blockedPropagatedClassifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "DELETED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "PURGED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "end1": {
       *     "guid": "...",
       *     "typeName": "...",
       *     "uniqueAttributes": {
       *       "property1": {},
       *       "property2": {}
       *     }
       *   },
       *   "end2": {
       *     "guid": "...",
       *     "typeName": "...",
       *     "uniqueAttributes": {
       *       "property1": {},
       *       "property2": {}
       *     }
       *   },
       *   "guid": "...",
       *   "homeId": "...",
       *   "label": "...",
       *   "propagateTags": "ONE_TO_TWO",
       *   "propagatedClassifications": [
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "DELETED",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "entityGuid": "...",
       *       "entityStatus": "ACTIVE",
       *       "propagate": true,
       *       "removePropagationsOnEntityDelete": true,
       *       "validityPeriods": [
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         },
       *         {
       *           "endTime": "...",
       *           "startTime": "...",
       *           "timeZone": "..."
       *         }
       *       ],
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "provenanceType": 12345,
       *   "status": "DELETED",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345,
       *   "attributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "typeName": "..."
       * }
       */
      export interface AtlasRelationship {
        attributes?: {
          [name: string]: {};
        };
        typeName?: string;
        /**
         *
         */
        blockedPropagatedClassifications?: AtlasClassification[];
        createTime?: number;
        createdBy?: string;
        end1?: AtlasObjectId;
        end2?: AtlasObjectId;
        guid?: string;
        homeId?: string;
        label?: string;
        propagateTags?: PropagateTags;
        /**
         *
         */
        propagatedClassifications?: AtlasClassification[];
        provenanceType?: number;
        status?: Status1;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
      }
      /**
       * AtlasRelationshipAttributeDef
       * class that captures details of a struct-attribute.
       * example:
       * {
       *   "isLegacyAttribute": true,
       *   "relationshipTypeName": "...",
       *   "cardinality": "SINGLE",
       *   "constraints": [
       *     {
       *       "params": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "type": "..."
       *     },
       *     {
       *       "params": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "type": "..."
       *     }
       *   ],
       *   "defaultValue": "...",
       *   "description": "...",
       *   "displayName": "...",
       *   "includeInNotification": true,
       *   "indexType": "STRING",
       *   "isIndexable": true,
       *   "isOptional": true,
       *   "isUnique": true,
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "searchWeight": 12345,
       *   "typeName": "...",
       *   "valuesMaxCount": 12345,
       *   "valuesMinCount": 12345
       * }
       */
      export interface AtlasRelationshipAttributeDef {
        cardinality?: Cardinality;
        /**
         *
         */
        constraints?: AtlasConstraintDef[];
        defaultValue?: string;
        description?: string;
        displayName?: string;
        includeInNotification?: boolean;
        indexType?: IndexType;
        isIndexable?: boolean;
        isOptional?: boolean;
        isUnique?: boolean;
        name?: string;
        options?: {
          [name: string]: string;
        };
        searchWeight?: number; // int32
        typeName?: string;
        valuesMaxCount?: number; // int32
        valuesMinCount?: number; // int32
        isLegacyAttribute?: boolean;
        relationshipTypeName?: string;
      }
      /**
       * AtlasRelationshipDef
       * AtlasRelationshipDef is a TypeDef that defines a relationship.
       * <p>
       * As with other typeDefs the AtlasRelationshipDef has a name. Once created the RelationshipDef has a guid.
       * The name and the guid are the 2 ways that the RelationshipDef is identified.
       * <p>
       * RelationshipDefs have 2 ends, each of which specify cardinality, an EntityDef type name and name and optionally
       * whether the end is a container.
       * <p>
       * RelationshipDefs can have AttributeDefs - though only primitive types are allowed. <br>
       * RelationshipDefs have a relationshipCategory specifying the UML type of relationship required <br>
       * RelationshipDefs also have a PropogateTag - indicating which way tags could flow over the relationships.
       * <p>
       * The way EntityDefs and RelationshipDefs are intended to be used is that EntityDefs will define AttributeDefs these AttributeDefs
       * will not specify an EntityDef type name as their types.
       * <p>
       * RelationshipDefs introduce new attributes to the entity instances. For example
       * <p>
       * EntityDef A might have attributes attr1,attr2,attr3 <br>
       * EntityDef B might have attributes attr4,attr5,attr6 <br>
       * RelationshipDef AtoB might define 2 ends <br>
       *
       * <pre>
       *    end1:  type A, name attr7
       *    end2:  type B, name attr8  </pre>
       *
       * <p>
       * When an instance of EntityDef A is created, it will have attributes attr1,attr2,attr3,attr7 <br>
       * When an instance of EntityDef B is created, it will have attributes attr4,attr5,attr6,attr8
       * <p>
       * In this way relationshipDefs can be authored separately from entityDefs and can inject relationship attributes into
       * the entity instances
       * example:
       * {
       *   "endDef1": {
       *     "cardinality": "SINGLE",
       *     "description": "...",
       *     "isContainer": true,
       *     "isLegacyAttribute": true,
       *     "name": "...",
       *     "type": "..."
       *   },
       *   "endDef2": {
       *     "cardinality": "SET",
       *     "description": "...",
       *     "isContainer": true,
       *     "isLegacyAttribute": true,
       *     "name": "...",
       *     "type": "..."
       *   },
       *   "propagateTags": "NONE",
       *   "relationshipCategory": "AGGREGATION",
       *   "relationshipLabel": "...",
       *   "attributeDefs": [
       *     {
       *       "cardinality": "LIST",
       *       "constraints": [
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         },
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         }
       *       ],
       *       "defaultValue": "...",
       *       "description": "...",
       *       "displayName": "...",
       *       "includeInNotification": true,
       *       "indexType": "DEFAULT",
       *       "isIndexable": true,
       *       "isOptional": true,
       *       "isUnique": true,
       *       "name": "...",
       *       "options": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "searchWeight": 12345,
       *       "typeName": "...",
       *       "valuesMaxCount": 12345,
       *       "valuesMinCount": 12345
       *     },
       *     {
       *       "cardinality": "SET",
       *       "constraints": [
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         },
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         }
       *       ],
       *       "defaultValue": "...",
       *       "description": "...",
       *       "displayName": "...",
       *       "includeInNotification": true,
       *       "indexType": "STRING",
       *       "isIndexable": true,
       *       "isOptional": true,
       *       "isUnique": true,
       *       "name": "...",
       *       "options": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "searchWeight": 12345,
       *       "typeName": "...",
       *       "valuesMaxCount": 12345,
       *       "valuesMinCount": 12345
       *     }
       *   ],
       *   "category": "ENUM",
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "dateFormatter": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "FLOOR"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "description": "...",
       *   "guid": "...",
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "serviceType": "...",
       *   "typeVersion": "...",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345
       * }
       */
      export interface AtlasRelationshipDef {
        category?: TypeCategory;
        createTime?: number;
        createdBy?: string;
        dateFormatter?: DateFormat;
        description?: string;
        guid?: string;
        name?: string;
        options?: {
          [name: string]: string;
        };
        serviceType?: string;
        typeVersion?: string;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
        /**
         *
         */
        attributeDefs?: AtlasAttributeDef[];
        endDef1?: AtlasRelationshipEndDef;
        endDef2?: AtlasRelationshipEndDef;
        propagateTags?: PropagateTags;
        relationshipCategory?: RelationshipCategory;
        relationshipLabel?: string;
      }
      /**
       * AtlasRelationshipEndDef
       * The relationshipEndDef represents an end of the relationship. The end of the relationship is defined by a type, an
       * attribute name, cardinality and whether it  is the container end of the relationship.
       * example:
       * {
       *   "cardinality": "SINGLE",
       *   "description": "...",
       *   "isContainer": true,
       *   "isLegacyAttribute": true,
       *   "name": "...",
       *   "type": "..."
       * }
       */
      export interface AtlasRelationshipEndDef {
        cardinality?: Cardinality;
        description?: string;
        isContainer?: boolean;
        isLegacyAttribute?: boolean;
        name?: string;
        type?: string;
      }
      /**
       * AtlasRelationshipWithExtInfo
       * example:
       * {
       *   "referredEntities": {
       *     "property1": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "IMPORTED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "PURGED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "PROPOSED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "PURGED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   },
       *   "relationship": {
       *     "blockedPropagatedClassifications": [
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "PURGED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "PURGED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       }
       *     ],
       *     "createTime": 12345,
       *     "createdBy": "...",
       *     "end1": {
       *       "guid": "...",
       *       "typeName": "...",
       *       "uniqueAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       }
       *     },
       *     "end2": {
       *       "guid": "...",
       *       "typeName": "...",
       *       "uniqueAttributes": {
       *         "property1": {},
       *         "property2": {}
       *       }
       *     },
       *     "guid": "...",
       *     "homeId": "...",
       *     "label": "...",
       *     "propagateTags": "TWO_TO_ONE",
       *     "propagatedClassifications": [
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "PURGED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "DELETED",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       }
       *     ],
       *     "provenanceType": 12345,
       *     "status": "DELETED",
       *     "updateTime": 12345,
       *     "updatedBy": "...",
       *     "version": 12345,
       *     "attributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "typeName": "..."
       *   }
       * }
       */
      export interface AtlasRelationshipWithExtInfo {
        referredEntities?: {
          [name: string]: AtlasEntityHeader;
        };
        relationship?: AtlasRelationship;
      }
      /**
       * AtlasSearchResult
       * example:
       * {
       *   "approximateCount": 12345,
       *   "attributes": {
       *     "name": [
       *       "...",
       *       "..."
       *     ],
       *     "values": []
       *   },
       *   "classification": "...",
       *   "entities": [
       *     {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "PURGED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "DELETED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OTHER",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "DELETED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   ],
       *   "fullTextResult": [
       *     {
       *       "entity": {
       *         "classificationNames": [
       *           "...",
       *           "..."
       *         ],
       *         "classifications": [
       *           {},
       *           {}
       *         ],
       *         "displayText": "...",
       *         "guid": "...",
       *         "isIncomplete": true,
       *         "labels": [
       *           "...",
       *           "..."
       *         ],
       *         "meaningNames": [
       *           "...",
       *           "..."
       *         ],
       *         "meanings": [
       *           {},
       *           {}
       *         ],
       *         "status": "ACTIVE",
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       "score": 12345
       *     },
       *     {
       *       "entity": {
       *         "classificationNames": [
       *           "...",
       *           "..."
       *         ],
       *         "classifications": [
       *           {},
       *           {}
       *         ],
       *         "displayText": "...",
       *         "guid": "...",
       *         "isIncomplete": true,
       *         "labels": [
       *           "...",
       *           "..."
       *         ],
       *         "meaningNames": [
       *           "...",
       *           "..."
       *         ],
       *         "meanings": [
       *           {},
       *           {}
       *         ],
       *         "status": "PURGED",
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       "score": 12345
       *     }
       *   ],
       *   "queryText": "...",
       *   "queryType": "RELATIONSHIP",
       *   "referredEntities": {
       *     "property1": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "ACTIVE",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "OBSOLETE",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "PROPOSED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "DELETED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     },
       *     "property2": {
       *       "classificationNames": [
       *         "...",
       *         "..."
       *       ],
       *       "classifications": [
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         },
       *         {
       *           "entityGuid": "...",
       *           "entityStatus": "DELETED",
       *           "propagate": true,
       *           "removePropagationsOnEntityDelete": true,
       *           "validityPeriods": [
       *             {},
       *             {}
       *           ],
       *           "attributes": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "typeName": "..."
       *         }
       *       ],
       *       "displayText": "...",
       *       "guid": "...",
       *       "isIncomplete": true,
       *       "labels": [
       *         "...",
       *         "..."
       *       ],
       *       "meaningNames": [
       *         "...",
       *         "..."
       *       ],
       *       "meanings": [
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DEPRECATED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         },
       *         {
       *           "confidence": 12345,
       *           "createdBy": "...",
       *           "description": "...",
       *           "displayText": "...",
       *           "expression": "...",
       *           "relationGuid": "...",
       *           "source": "...",
       *           "status": "DISCOVERED",
       *           "steward": "...",
       *           "termGuid": "..."
       *         }
       *       ],
       *       "status": "DELETED",
       *       "attributes": {
       *         "property1": {},
       *         "property2": {}
       *       },
       *       "typeName": "..."
       *     }
       *   },
       *   "searchParameters": {
       *     "attributes": [
       *       "...",
       *       "..."
       *     ],
       *     "classification": "...",
       *     "entityFilters": {
       *       "attributeName": "...",
       *       "attributeValue": "...",
       *       "condition": "OR",
       *       "criterion": [
       *         {},
       *         {}
       *       ],
       *       "operator": "ENDS_WITH"
       *     },
       *     "excludeDeletedEntities": true,
       *     "includeClassificationAttributes": true,
       *     "includeSubClassifications": true,
       *     "includeSubTypes": true,
       *     "limit": 12345,
       *     "offset": 12345,
       *     "query": "...",
       *     "sortBy": "...",
       *     "sortOrder": "DESCENDING",
       *     "tagFilters": {
       *       "attributeName": "...",
       *       "attributeValue": "...",
       *       "condition": "AND",
       *       "criterion": [
       *         {},
       *         {}
       *       ],
       *       "operator": "STARTS_WITH"
       *     },
       *     "termName": "...",
       *     "typeName": "..."
       *   },
       *   "type": "..."
       * }
       */
      export interface AtlasSearchResult {
        approximateCount?: number; // int64
        attributes?: AttributeSearchResult;
        classification?: string;
        /**
         *
         */
        entities?: AtlasEntityHeader[];
        /**
         *
         */
        fullTextResult?: AtlasFullTextResult[];
        queryText?: string;
        queryType?: AtlasQueryType;
        referredEntities?: {
          [name: string]: AtlasEntityHeader;
        };
        searchParameters?: SearchParameters;
        type?: string;
      }
      /**
       * AtlasStruct
       * Captures details of struct contents. Not instantiated directly, used only via AtlasEntity, AtlasClassification.
       * example:
       * {
       *   "attributes": {
       *     "property1": {},
       *     "property2": {}
       *   },
       *   "typeName": "..."
       * }
       */
      export interface AtlasStruct {
        attributes?: {
          [name: string]: {};
        };
        typeName?: string;
      }
      /**
       * AtlasStructDef
       * class that captures details of a struct-type.
       * example:
       * {
       *   "attributeDefs": [
       *     {
       *       "cardinality": "SET",
       *       "constraints": [
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         },
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         }
       *       ],
       *       "defaultValue": "...",
       *       "description": "...",
       *       "displayName": "...",
       *       "includeInNotification": true,
       *       "indexType": "STRING",
       *       "isIndexable": true,
       *       "isOptional": true,
       *       "isUnique": true,
       *       "name": "...",
       *       "options": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "searchWeight": 12345,
       *       "typeName": "...",
       *       "valuesMaxCount": 12345,
       *       "valuesMinCount": 12345
       *     },
       *     {
       *       "cardinality": "SINGLE",
       *       "constraints": [
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         },
       *         {
       *           "params": {
       *             "property1": {},
       *             "property2": {}
       *           },
       *           "type": "..."
       *         }
       *       ],
       *       "defaultValue": "...",
       *       "description": "...",
       *       "displayName": "...",
       *       "includeInNotification": true,
       *       "indexType": "STRING",
       *       "isIndexable": true,
       *       "isOptional": true,
       *       "isUnique": true,
       *       "name": "...",
       *       "options": {
       *         "property1": "...",
       *         "property2": "..."
       *       },
       *       "searchWeight": 12345,
       *       "typeName": "...",
       *       "valuesMaxCount": 12345,
       *       "valuesMinCount": 12345
       *     }
       *   ],
       *   "category": "ARRAY",
       *   "createTime": 12345,
       *   "createdBy": "...",
       *   "dateFormatter": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "UNNECESSARY"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "description": "...",
       *   "guid": "...",
       *   "name": "...",
       *   "options": {
       *     "property1": "...",
       *     "property2": "..."
       *   },
       *   "serviceType": "...",
       *   "typeVersion": "...",
       *   "updateTime": 12345,
       *   "updatedBy": "...",
       *   "version": 12345
       * }
       */
      export interface AtlasStructDef {
        category?: TypeCategory;
        createTime?: number;
        createdBy?: string;
        dateFormatter?: DateFormat;
        description?: string;
        guid?: string;
        name?: string;
        options?: {
          [name: string]: string;
        };
        serviceType?: string;
        typeVersion?: string;
        updateTime?: number;
        updatedBy?: string;
        version?: number;
        /**
         *
         */
        attributeDefs?: AtlasAttributeDef[];
      }
      /**
       * AtlasSuggestionsResult
       * example:
       * {
       *   "fieldName": "...",
       *   "prefixString": "...",
       *   "suggestions": [
       *     "...",
       *     "..."
       *   ]
       * }
       */
      export interface AtlasSuggestionsResult {
        fieldName?: string;
        prefixString?: string;
        /**
         *
         */
        suggestions?: string[];
      }
      /**
       * AtlasTermAssignmentHeader
       * example:
       * {
       *   "confidence": 12345,
       *   "createdBy": "...",
       *   "description": "...",
       *   "displayText": "...",
       *   "expression": "...",
       *   "relationGuid": "...",
       *   "source": "...",
       *   "status": "VALIDATED",
       *   "steward": "...",
       *   "termGuid": "..."
       * }
       */
      export interface AtlasTermAssignmentHeader {
        confidence?: number; // int32
        createdBy?: string;
        description?: string;
        displayText?: string;
        expression?: string;
        relationGuid?: string;
        source?: string;
        status?: AtlasTermAssignmentStatus;
        steward?: string;
        termGuid?: string;
      }
      /**
       * AtlasTermAssignmentStatus
       */
      export type AtlasTermAssignmentStatus =
        | "DISCOVERED"
        | "PROPOSED"
        | "IMPORTED"
        | "VALIDATED"
        | "DEPRECATED"
        | "OBSOLETE"
        | "OTHER";
      /**
       * AtlasTermCategorizationHeader
       * example:
       * {
       *   "categoryGuid": "...",
       *   "description": "...",
       *   "displayText": "...",
       *   "relationGuid": "...",
       *   "status": "OBSOLETE"
       * }
       */
      export interface AtlasTermCategorizationHeader {
        categoryGuid?: string;
        description?: string;
        displayText?: string;
        relationGuid?: string;
        status?: AtlasTermRelationshipStatus;
      }
      /**
       * AtlasTermRelationshipStatus
       */
      export type AtlasTermRelationshipStatus =
        | "DRAFT"
        | "ACTIVE"
        | "DEPRECATED"
        | "OBSOLETE"
        | "OTHER";
      /**
       * AtlasTypeDefHeader
       * example:
       * {
       *   "category": "CLASSIFICATION",
       *   "guid": "...",
       *   "name": "...",
       *   "serviceType": "..."
       * }
       */
      export interface AtlasTypeDefHeader {
        category?: TypeCategory;
        guid?: string;
        name?: string;
        serviceType?: string;
      }
      /**
       * AtlasTypesDef
       */
      export interface AtlasTypesDef {
        /**
         *
         */
        businessMetadataDefs?: AtlasStructDef[];
        /**
         *
         */
        classificationDefs?: AtlasClassificationDef[];
        /**
         *
         */
        entityDefs?: AtlasEntityDef[];
        /**
         *
         */
        enumDefs?: AtlasEnumDef[];
        /**
         *
         */
        relationshipDefs?: AtlasRelationshipDef[];
        /**
         *
         */
        structDefs?: AtlasStructDef[];
      }
      /**
       * AtlasUserSavedSearch
       * example:
       * {
       *   "name": "...",
       *   "ownerName": "...",
       *   "searchParameters": {
       *     "attributes": [
       *       "...",
       *       "..."
       *     ],
       *     "classification": "...",
       *     "entityFilters": {
       *       "attributeName": "...",
       *       "attributeValue": "...",
       *       "condition": "AND",
       *       "criterion": [
       *         {},
       *         {}
       *       ],
       *       "operator": "LIKE"
       *     },
       *     "excludeDeletedEntities": true,
       *     "includeClassificationAttributes": true,
       *     "includeSubClassifications": true,
       *     "includeSubTypes": true,
       *     "limit": 12345,
       *     "offset": 12345,
       *     "query": "...",
       *     "sortBy": "...",
       *     "sortOrder": "DESCENDING",
       *     "tagFilters": {
       *       "attributeName": "...",
       *       "attributeValue": "...",
       *       "condition": "AND",
       *       "criterion": [
       *         {},
       *         {}
       *       ],
       *       "operator": "ENDS_WITH"
       *     },
       *     "termName": "...",
       *     "typeName": "..."
       *   },
       *   "searchType": "BASIC",
       *   "uiParameters": "...",
       *   "guid": "..."
       * }
       */
      export interface AtlasUserSavedSearch {
        guid?: string;
        name?: string;
        ownerName?: string;
        searchParameters?: SearchParameters;
        searchType?: SavedSearchType;
        uiParameters?: string;
      }
      /**
       * AttributeSearchResult
       * example:
       * {
       *   "name": [
       *     "...",
       *     "..."
       *   ],
       *   "values": []
       * }
       */
      export interface AttributeSearchResult {
        /**
         *
         */
        name?: string[];
        /**
         *
         */
        values?: {}[];
      }
      /**
       * BulkImportResponse
       * example:
       * {
       *   "failedImportInfoList": [
       *     {
       *       "childObjectName": "...",
       *       "importStatus": "FAILED",
       *       "parentObjectName": "...",
       *       "remarks": "..."
       *     },
       *     {
       *       "childObjectName": "...",
       *       "importStatus": "SUCCESS",
       *       "parentObjectName": "...",
       *       "remarks": "..."
       *     }
       *   ],
       *   "successImportInfoList": [
       *     {
       *       "childObjectName": "...",
       *       "importStatus": "FAILED",
       *       "parentObjectName": "...",
       *       "remarks": "..."
       *     },
       *     {
       *       "childObjectName": "...",
       *       "importStatus": "SUCCESS",
       *       "parentObjectName": "...",
       *       "remarks": "..."
       *     }
       *   ]
       * }
       */
      export interface BulkImportResponse {
        /**
         *
         */
        failedImportInfoList?: ImportInfo[];
        /**
         *
         */
        successImportInfoList?: ImportInfo[];
      }
      /**
       * Cardinality
       * single-valued attribute or multi-valued attribute.
       */
      export type Cardinality = "SINGLE" | "LIST" | "SET";
      /**
       * ClassificationAssociateRequest
       * example:
       * {
       *   "classification": {
       *     "entityGuid": "...",
       *     "entityStatus": "ACTIVE",
       *     "propagate": true,
       *     "removePropagationsOnEntityDelete": true,
       *     "validityPeriods": [
       *       {
       *         "endTime": "...",
       *         "startTime": "...",
       *         "timeZone": "..."
       *       },
       *       {
       *         "endTime": "...",
       *         "startTime": "...",
       *         "timeZone": "..."
       *       }
       *     ],
       *     "attributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "typeName": "..."
       *   },
       *   "entityGuids": [
       *     "...",
       *     "..."
       *   ]
       * }
       */
      export interface ClassificationAssociateRequest {
        classification?: AtlasClassification;
        /**
         *
         */
        entityGuids?: string[];
      }
      /**
       * Condition
       */
      export type Condition = "AND" | "OR";
      /**
       * DateFormat
       * example:
       * {
       *   "availableLocales": [
       *     "...",
       *     "..."
       *   ],
       *   "calendar": 12345,
       *   "dateInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "CEILING"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "dateTimeInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "DOWN"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "instance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "HALF_UP"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "lenient": true,
       *   "numberFormat": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "currency": "...",
       *     "currencyInstance": {},
       *     "groupingUsed": true,
       *     "instance": {},
       *     "integerInstance": {},
       *     "maximumFractionDigits": 12345,
       *     "maximumIntegerDigits": 12345,
       *     "minimumFractionDigits": 12345,
       *     "minimumIntegerDigits": 12345,
       *     "numberInstance": {},
       *     "parseIntegerOnly": true,
       *     "percentInstance": {},
       *     "roundingMode": "HALF_UP"
       *   },
       *   "timeInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "calendar": 12345,
       *     "dateInstance": {},
       *     "dateTimeInstance": {},
       *     "instance": {},
       *     "lenient": true,
       *     "numberFormat": {
       *       "availableLocales": [
       *         "...",
       *         "..."
       *       ],
       *       "currency": "...",
       *       "currencyInstance": {},
       *       "groupingUsed": true,
       *       "instance": {},
       *       "integerInstance": {},
       *       "maximumFractionDigits": 12345,
       *       "maximumIntegerDigits": 12345,
       *       "minimumFractionDigits": 12345,
       *       "minimumIntegerDigits": 12345,
       *       "numberInstance": {},
       *       "parseIntegerOnly": true,
       *       "percentInstance": {},
       *       "roundingMode": "DOWN"
       *     },
       *     "timeInstance": {},
       *     "timeZone": {
       *       "DSTSavings": 12345,
       *       "ID": "...",
       *       "availableIDs": [
       *         "...",
       *         "..."
       *       ],
       *       "default": {},
       *       "displayName": "...",
       *       "rawOffset": 12345
       *     }
       *   },
       *   "timeZone": {
       *     "DSTSavings": 12345,
       *     "ID": "...",
       *     "availableIDs": [
       *       "...",
       *       "..."
       *     ],
       *     "default": {},
       *     "displayName": "...",
       *     "rawOffset": 12345
       *   }
       * }
       */
      export interface DateFormat {
        /**
         *
         */
        availableLocales?: string[];
        calendar?: number;
        dateInstance?: DateFormat;
        dateTimeInstance?: DateFormat;
        instance?: DateFormat;
        lenient?: boolean;
        numberFormat?: NumberFormat;
        timeInstance?: DateFormat;
        timeZone?: TimeZone;
      }
      /**
       * EntityAuditActionV2
       */
      export type EntityAuditActionV2 =
        | "ENTITY_CREATE"
        | "ENTITY_UPDATE"
        | "ENTITY_DELETE"
        | "ENTITY_IMPORT_CREATE"
        | "ENTITY_IMPORT_UPDATE"
        | "ENTITY_IMPORT_DELETE"
        | "CLASSIFICATION_ADD"
        | "CLASSIFICATION_DELETE"
        | "CLASSIFICATION_UPDATE"
        | "PROPAGATED_CLASSIFICATION_ADD"
        | "PROPAGATED_CLASSIFICATION_DELETE"
        | "PROPAGATED_CLASSIFICATION_UPDATE"
        | "TERM_ADD"
        | "TERM_DELETE"
        | "LABEL_ADD"
        | "LABEL_DELETE"
        | "ENTITY_PURGE"
        | "BUSINESS_ATTRIBUTE_UPDATE";
      /**
       * EntityAuditEventV2
       * Structure of v2 entity audit event
       * example:
       * {
       *   "action": "ENTITY_IMPORT_DELETE",
       *   "details": "...",
       *   "entity": {
       *     "businessAttributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "classifications": [
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "ACTIVE",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       },
       *       {
       *         "entityGuid": "...",
       *         "entityStatus": "ACTIVE",
       *         "propagate": true,
       *         "removePropagationsOnEntityDelete": true,
       *         "validityPeriods": [
       *           {},
       *           {}
       *         ],
       *         "attributes": {
       *           "property1": {},
       *           "property2": {}
       *         },
       *         "typeName": "..."
       *       }
       *     ],
       *     "createTime": 12345,
       *     "createdBy": "...",
       *     "customAttributes": {
       *       "property1": "...",
       *       "property2": "..."
       *     },
       *     "guid": "...",
       *     "homeId": "...",
       *     "isIncomplete": true,
       *     "labels": [
       *       "...",
       *       "..."
       *     ],
       *     "meanings": [
       *       {
       *         "confidence": 12345,
       *         "createdBy": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "expression": "...",
       *         "relationGuid": "...",
       *         "source": "...",
       *         "status": "OBSOLETE",
       *         "steward": "...",
       *         "termGuid": "..."
       *       },
       *       {
       *         "confidence": 12345,
       *         "createdBy": "...",
       *         "description": "...",
       *         "displayText": "...",
       *         "expression": "...",
       *         "relationGuid": "...",
       *         "source": "...",
       *         "status": "DEPRECATED",
       *         "steward": "...",
       *         "termGuid": "..."
       *       }
       *     ],
       *     "provenanceType": 12345,
       *     "proxy": true,
       *     "relationshipAttributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "status": "PURGED",
       *     "updateTime": 12345,
       *     "updatedBy": "...",
       *     "version": 12345,
       *     "attributes": {
       *       "property1": {},
       *       "property2": {}
       *     },
       *     "typeName": "..."
       *   },
       *   "entityId": "...",
       *   "eventKey": "...",
       *   "timestamp": 12345,
       *   "type": "ENTITY_AUDIT_V1",
       *   "user": "..."
       * }
       */
      export interface EntityAuditEventV2 {
        action?: EntityAuditActionV2;
        details?: string;
        entity?: AtlasEntity;
        entityId?: string;
        eventKey?: string;
        timestamp?: number; // int64
        type?: EntityAuditType;
        user?: string;
      }
      /**
       * EntityAuditType
       */
      export type EntityAuditType = "ENTITY_AUDIT_V1" | "ENTITY_AUDIT_V2";
      /**
       * EntityMutationResponse
       */
      export interface EntityMutationResponse {
        guidAssignments?: {
          [name: string]: string;
        };
        mutatedEntities?: {
          [name: string]: {};
        };
        /**
         *
         */
        partialUpdatedEntities?: AtlasEntityHeader[];
      }
      /**
       * EntityOperation
       */
      export type EntityOperation =
        | "CREATE"
        | "UPDATE"
        | "PARTIAL_UPDATE"
        | "DELETE"
        | "PURGE";
      /**
       * FilterCriteria
       * example:
       * {
       *   "attributeName": "...",
       *   "attributeValue": "...",
       *   "condition": "AND",
       *   "criterion": [
       *     {
       *       "attributeName": "...",
       *       "attributeValue": "...",
       *       "condition": "OR",
       *       "criterion": [
       *         {},
       *         {}
       *       ],
       *       "operator": "NOT_NULL"
       *     },
       *     {
       *       "attributeName": "...",
       *       "attributeValue": "...",
       *       "condition": "AND",
       *       "criterion": [
       *         {},
       *         {}
       *       ],
       *       "operator": "LTE"
       *     }
       *   ],
       *   "operator": "CONTAINS"
       * }
       */
      export interface FilterCriteria {
        attributeName?: string;
        attributeValue?: string;
        condition?: Condition;
        /**
         *
         */
        criterion?: FilterCriteria[];
        operator?: Operator;
      }
      /**
       * ImportInfo
       * example:
       * {
       *   "childObjectName": "...",
       *   "importStatus": "FAILED",
       *   "parentObjectName": "...",
       *   "remarks": "..."
       * }
       */
      export interface ImportInfo {
        childObjectName?: string;
        importStatus?: ImportStatus;
        parentObjectName?: string;
        remarks?: string;
      }
      /**
       * ImportStatus
       */
      export type ImportStatus = "SUCCESS" | "FAILED";
      /**
       * IndexType
       */
      export type IndexType = "DEFAULT" | "STRING";
      /**
       * LineageDirection
       */
      export type LineageDirection = "INPUT" | "OUTPUT" | "BOTH";
      /**
       * LineageRelation
       * example:
       * {
       *   "fromEntityId": "...",
       *   "relationshipId": "...",
       *   "toEntityId": "..."
       * }
       */
      export interface LineageRelation {
        fromEntityId?: string;
        relationshipId?: string;
        toEntityId?: string;
      }
      /**
       * NumberFormat
       * example:
       * {
       *   "availableLocales": [
       *     "...",
       *     "..."
       *   ],
       *   "currency": "...",
       *   "currencyInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "currency": "...",
       *     "currencyInstance": {},
       *     "groupingUsed": true,
       *     "instance": {},
       *     "integerInstance": {},
       *     "maximumFractionDigits": 12345,
       *     "maximumIntegerDigits": 12345,
       *     "minimumFractionDigits": 12345,
       *     "minimumIntegerDigits": 12345,
       *     "numberInstance": {},
       *     "parseIntegerOnly": true,
       *     "percentInstance": {},
       *     "roundingMode": "UNNECESSARY"
       *   },
       *   "groupingUsed": true,
       *   "instance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "currency": "...",
       *     "currencyInstance": {},
       *     "groupingUsed": true,
       *     "instance": {},
       *     "integerInstance": {},
       *     "maximumFractionDigits": 12345,
       *     "maximumIntegerDigits": 12345,
       *     "minimumFractionDigits": 12345,
       *     "minimumIntegerDigits": 12345,
       *     "numberInstance": {},
       *     "parseIntegerOnly": true,
       *     "percentInstance": {},
       *     "roundingMode": "HALF_DOWN"
       *   },
       *   "integerInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "currency": "...",
       *     "currencyInstance": {},
       *     "groupingUsed": true,
       *     "instance": {},
       *     "integerInstance": {},
       *     "maximumFractionDigits": 12345,
       *     "maximumIntegerDigits": 12345,
       *     "minimumFractionDigits": 12345,
       *     "minimumIntegerDigits": 12345,
       *     "numberInstance": {},
       *     "parseIntegerOnly": true,
       *     "percentInstance": {},
       *     "roundingMode": "HALF_EVEN"
       *   },
       *   "maximumFractionDigits": 12345,
       *   "maximumIntegerDigits": 12345,
       *   "minimumFractionDigits": 12345,
       *   "minimumIntegerDigits": 12345,
       *   "numberInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "currency": "...",
       *     "currencyInstance": {},
       *     "groupingUsed": true,
       *     "instance": {},
       *     "integerInstance": {},
       *     "maximumFractionDigits": 12345,
       *     "maximumIntegerDigits": 12345,
       *     "minimumFractionDigits": 12345,
       *     "minimumIntegerDigits": 12345,
       *     "numberInstance": {},
       *     "parseIntegerOnly": true,
       *     "percentInstance": {},
       *     "roundingMode": "UP"
       *   },
       *   "parseIntegerOnly": true,
       *   "percentInstance": {
       *     "availableLocales": [
       *       "...",
       *       "..."
       *     ],
       *     "currency": "...",
       *     "currencyInstance": {},
       *     "groupingUsed": true,
       *     "instance": {},
       *     "integerInstance": {},
       *     "maximumFractionDigits": 12345,
       *     "maximumIntegerDigits": 12345,
       *     "minimumFractionDigits": 12345,
       *     "minimumIntegerDigits": 12345,
       *     "numberInstance": {},
       *     "parseIntegerOnly": true,
       *     "percentInstance": {},
       *     "roundingMode": "HALF_DOWN"
       *   },
       *   "roundingMode": "FLOOR"
       * }
       */
      export interface NumberFormat {
        /**
         *
         */
        availableLocales?: string[];
        currency?: string;
        currencyInstance?: NumberFormat;
        groupingUsed?: boolean;
        instance?: NumberFormat;
        integerInstance?: NumberFormat;
        maximumFractionDigits?: number; // int32
        maximumIntegerDigits?: number; // int32
        minimumFractionDigits?: number; // int32
        minimumIntegerDigits?: number; // int32
        numberInstance?: NumberFormat;
        parseIntegerOnly?: boolean;
        percentInstance?: NumberFormat;
        roundingMode?: RoundingMode;
      }
      /**
       * Operator
       * Supported search operations
       * Logical comparision operators can only be used with numbers or dates
       * IN, LIKE, startsWith, endsWith, CONTAINS can only be used with strings or text
       */
      export type Operator =
        | "lt"
        | "gt"
        | "lte"
        | "gte"
        | "eq"
        | "neq"
        | "in"
        | "like"
        | "starts_with"
        | "ends_with"
        | "contains"
        | "not_contains"
        | "contains_any"
        | "contains_all"
        | "is_null"
        | "not_null";
      /**
       * PList
       * Paginated-list, for returning search results.
       * example:
       * {
       *   "list": [
       *     {},
       *     {}
       *   ],
       *   "pageSize": 12345,
       *   "sortBy": "...",
       *   "sortType": "DESC",
       *   "startIndex": 12345,
       *   "totalCount": 12345
       * }
       */
      export interface PList {
        /**
         *
         */
        list?: {}[];
        pageSize?: number; // int32
        sortBy?: string;
        sortType?: SortType;
        startIndex?: number; // int64
        totalCount?: number; // int64
      }
      /**
       * PList1
       */
      export interface PList1 {
        /**
         *
         */
        list?: {}[];
        pageSize?: number; // int32
        sortBy?: string;
        sortType?: SortType;
        startIndex?: number; // int64
        totalCount?: number; // int64
      }
      /**
       * PropagateTags
       * PropagateTags indicates whether tags should propagate across the relationship instance.
       * <p>
       * Tags can propagate:
       * <p>
       * NONE - not at all <br>
       * ONE_TO_TWO - from end 1 to 2 <br>
       * TWO_TO_ONE - from end 2 to 1  <br>
       * BOTH - both ways
       * <p>
       * Care needs to be taken when specifying. The use cases we are aware of where this flag is useful:
       * <p>
       * - propagating confidentiality classifications from a table to columns - ONE_TO_TWO could be used here <br>
       * - propagating classifications around Glossary synonyms - BOTH could be used here.
       * <p>
       * There is an expectation that further enhancements will allow more granular control of tag propagation and will
       * address how to resolve conflicts.
       */
      export type PropagateTags = "NONE" | "ONE_TO_TWO" | "TWO_TO_ONE" | "BOTH";
      /**
       * QuickSearchParameters
       * example:
       * {
       *   "attributes": [
       *     "...",
       *     "..."
       *   ],
       *   "entityFilters": {
       *     "attributeName": "...",
       *     "attributeValue": "...",
       *     "condition": "AND",
       *     "criterion": [
       *       {},
       *       {}
       *     ],
       *     "operator": "NEQ"
       *   },
       *   "excludeDeletedEntities": true,
       *   "includeSubTypes": true,
       *   "limit": 12345,
       *   "offset": 12345,
       *   "query": "...",
       *   "typeName": "..."
       * }
       */
      export interface QuickSearchParameters {
        /**
         *
         */
        attributes?: string[];
        entityFilters?: FilterCriteria;
        excludeDeletedEntities?: boolean;
        includeSubTypes?: boolean;
        limit?: number; // int32
        offset?: number; // int32
        query?: string;
        typeName?: string;
      }
      /**
       * Relation
       */
      export type Relation =
        | "SEE_ALSO"
        | "SYNONYMS"
        | "ANTONYMS"
        | "PREFERRED_TO_TERMS"
        | "PREFERRED_TERMS"
        | "REPLACEMENT_TERMS"
        | "REPLACED_BY"
        | "TRANSLATION_TERMS"
        | "TRANSLATED_TERMS"
        | "ISA"
        | "CLASSIFIES"
        | "VALID_VALUES"
        | "VALID_VALUES_FOR";
      /**
       * RelationshipCategory
       * The Relationship category determines the style of relationship around containment and lifecycle.
       * UML terminology is used for the values.
       * <p>
       * ASSOCIATION is a relationship with no containment. <br>
       * COMPOSITION and AGGREGATION are containment relationships.
       * <p>
       * The difference being in the lifecycles of the container and its children. In the COMPOSITION case,
       * the children cannot exist without the container. For AGGREGATION, the life cycles
       * of the container and children are totally independant.
       */
      export type RelationshipCategory =
        | "ASSOCIATION"
        | "AGGREGATION"
        | "COMPOSITION";
      /**
       * RoundingMode
       */
      export type RoundingMode =
        | "UP"
        | "DOWN"
        | "CEILING"
        | "FLOOR"
        | "HALF_UP"
        | "HALF_DOWN"
        | "HALF_EVEN"
        | "UNNECESSARY";
      /**
       * SavedSearchType
       */
      export type SavedSearchType = "BASIC" | "ADVANCED";
      /**
       * SearchFilter
       * Generic filter, to specify search criteria using name/value pairs.
       */
      export interface SearchFilter {
        getCount?: boolean;
        maxRows?: number; // int64
        params?: {
          [name: string]: {};
        };
        sortBy?: string;
        sortType?: SortType;
        startIndex?: number; // int64
      }
      /**
       * searchFilter1
       */
      export interface SearchFilter1 {
        getCount?: boolean;
        maxRows?: number; // int64
        params?: {};
        sortBy?: string;
        sortType?: SortType;
        startIndex?: number; // int64
      }
      /**
       * SearchParameters
       * example:
       * {
       *   "attributes": [
       *     "...",
       *     "..."
       *   ],
       *   "classification": "...",
       *   "entityFilters": {
       *     "attributeName": "...",
       *     "attributeValue": "...",
       *     "condition": "OR",
       *     "criterion": [
       *       {},
       *       {}
       *     ],
       *     "operator": "LTE"
       *   },
       *   "excludeDeletedEntities": true,
       *   "includeClassificationAttributes": true,
       *   "includeSubClassifications": true,
       *   "includeSubTypes": true,
       *   "limit": 12345,
       *   "offset": 12345,
       *   "query": "...",
       *   "sortBy": "...",
       *   "sortOrder": "DESCENDING",
       *   "tagFilters": {
       *     "attributeName": "...",
       *     "attributeValue": "...",
       *     "condition": "AND",
       *     "criterion": [
       *       {},
       *       {}
       *     ],
       *     "operator": "LIKE"
       *   },
       *   "termName": "...",
       *   "typeName": "..."
       * }
       */
      export interface SearchParameters {
        /**
         * Attribute values included in the results
         */
        attributes?: string[];
        classification?: string;
        entityFilters?: FilterCriteria;
        excludeDeletedEntities?: boolean;
        includeClassificationAttributes?: boolean;
        includeSubClassifications?: boolean;
        includeSubTypes?: boolean;
        limit?: number; // int32
        offset?: number; // int32
        query?: string;
        sortBy?: string;
        sortOrder?: SortOrder;
        tagFilters?: FilterCriteria;
        termName?: string;
        typeName?: string;
      }
      /**
       * SortOrder
       */
      export type SortOrder = "ASCENDING" | "DESCENDING";
      /**
       * SortType
       * to specify whether the result should be sorted? If yes, whether asc or desc.
       */
      export type SortType = "NONE" | "ASC" | "DESC";
      /**
       * Status
       * Status of the entity - can be active or deleted. Deleted entities are not removed from Atlas store.
       */
      export type Status = "ACTIVE" | "DELETED" | "PURGED";
      /**
       * Status1
       */
      export type Status1 = "ACTIVE" | "DELETED";
      /**
       * TimeBoundary
       * Captures time-boundary details
       * example:
       * {
       *   "endTime": "...",
       *   "startTime": "...",
       *   "timeZone": "..."
       * }
       */
      export interface TimeBoundary {
        endTime?: string;
        startTime?: string;
        timeZone?: string;
      }
      /**
       * timeBoundary1
       */
      export interface TimeBoundary1 {
        endTime?: string;
        startTime?: string;
        timeZone?: string;
      }
      /**
       * TimeZone
       * example:
       * {
       *   "DSTSavings": 12345,
       *   "ID": "...",
       *   "availableIDs": [
       *     "...",
       *     "..."
       *   ],
       *   "default": {
       *     "DSTSavings": 12345,
       *     "ID": "...",
       *     "availableIDs": [
       *       "...",
       *       "..."
       *     ],
       *     "default": {},
       *     "displayName": "...",
       *     "rawOffset": 12345
       *   },
       *   "displayName": "...",
       *   "rawOffset": 12345
       * }
       */
      export interface TimeZone {
        DSTSavings?: number; // int32
        ID?: string;
        /**
         *
         */
        availableIDs?: string[];
        default?: TimeZone;
        displayName?: string;
        rawOffset?: number; // int32
      }
      /**
       * TypeCategory
       */
      export type TypeCategory =
        | "PRIMITIVE"
        | "OBJECT_ID_TYPE"
        | "ENUM"
        | "STRUCT"
        | "CLASSIFICATION"
        | "ENTITY"
        | "ARRAY"
        | "MAP"
        | "RELATIONSHIP"
        | "BUSINESS_METADATA";
    }
  }
  declare namespace Paths {
    namespace AddClassification {
      export type RequestBody = Components.Schemas.ClassificationAssociateRequest;
    }
    namespace AddClassifications {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      /**
       *
       */
      export type RequestBody = Components.Schemas.AtlasClassification[];
    }
    namespace AddClassificationsByUniqueAttribute {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      /**
       *
       */
      export type RequestBody = Components.Schemas.AtlasClassification[];
    }
    namespace AddLabels {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
    }
    namespace AddOrUpdateBusinessAttributes {
      namespace Parameters {
        export type Guid = string;
        export type IsOverwrite = boolean;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        isOverwrite?: Parameters.IsOverwrite;
      }
    }
    namespace AddSavedSearch {
      export type RequestBody = Components.Schemas.AtlasUserSavedSearch;
      namespace Responses {
        export type $201 = Components.Schemas.AtlasUserSavedSearch;
      }
    }
    namespace AssignTermToEntities {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      /**
       * Related Entity IDs to which the term has to be associated
       */
      export type RequestBody = Components.Schemas.AtlasRelatedObjectId[];
    }
    namespace Create {
      export type RequestBody = Components.Schemas.AtlasRelationship;
      namespace Responses {
        export type $201 = Components.Schemas.AtlasRelationship;
      }
    }
    namespace CreateAtlasTypeDefs {
      export type RequestBody = Components.Schemas.AtlasTypesDef;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasTypesDef;
      }
    }
    namespace CreateGlossary {
      export type RequestBody = Components.Schemas.AtlasGlossary;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossary;
      }
    }
    namespace CreateGlossaryCategories {
      /**
       * glossary category definitions
       */
      export type RequestBody = Components.Schemas.AtlasGlossaryCategory[];
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasGlossaryCategory[];
      }
    }
    namespace CreateGlossaryCategory {
      export type RequestBody = Components.Schemas.AtlasGlossaryCategory;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryCategory;
      }
    }
    namespace CreateGlossaryTerm {
      export type RequestBody = Components.Schemas.AtlasGlossaryTerm;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryTerm;
      }
    }
    namespace CreateGlossaryTerms {
      /**
       * glossary term definitions
       */
      export type RequestBody = Components.Schemas.AtlasGlossaryTerm[];
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasGlossaryTerm[];
      }
    }
    namespace CreateOrUpdate {
      export type RequestBody = Components.Schemas.AtlasEntityWithExtInfo;
      namespace Responses {
        export type $201 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace CreateOrUpdate1 {
      export type RequestBody = Components.Schemas.AtlasEntitiesWithExtInfo;
      namespace Responses {
        export type $201 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace DeleteAtlasTypeByName {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
    }
    namespace DeleteAtlasTypeDefs {
      export type RequestBody = Components.Schemas.AtlasTypesDef;
    }
    namespace DeleteByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $204 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace DeleteByGuids {
      namespace Parameters {
        export type Guid = string[];
      }
      export interface QueryParameters {
        guid?: Parameters.Guid;
      }
      namespace Responses {
        export type $204 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace DeleteById {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
    }
    namespace DeleteByUniqueAttribute {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      namespace Responses {
        export type $204 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace DeleteClassification {
      namespace Parameters {
        export type AssociatedEntityGuid = string;
        export type ClassificationName = string;
        export type Guid = string;
      }
      export interface PathParameters {
        classificationName: Parameters.ClassificationName;
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        associatedEntityGuid?: Parameters.AssociatedEntityGuid;
      }
    }
    namespace DeleteClassificationByUniqueAttribute {
      namespace Parameters {
        export type ClassificationName = string;
        export type TypeName = string;
      }
      export interface PathParameters {
        classificationName: Parameters.ClassificationName;
        typeName: Parameters.TypeName;
      }
    }
    namespace DeleteGlossary {
      namespace Parameters {
        export type GlossaryGuid = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
    }
    namespace DeleteGlossaryCategory {
      namespace Parameters {
        export type CategoryGuid = string;
      }
      export interface PathParameters {
        categoryGuid: Parameters.CategoryGuid;
      }
    }
    namespace DeleteGlossaryTerm {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
    }
    namespace DeleteSavedSearch {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
    }
    namespace DeleteremoveBusinessAttributes {
      namespace Parameters {
        export type BmName = string;
        export type Guid = string;
      }
      export interface PathParameters {
        bmName: Parameters.BmName;
        guid: Parameters.Guid;
      }
    }
    namespace DeleteremoveLabels {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      /**
       *
       */
      export type RequestBody = string[];
    }
    namespace DisassociateTermAssignmentFromEntities {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      /**
       * List of related entity IDs from which the term has to be dissociated
       */
      export type RequestBody = Components.Schemas.AtlasRelatedObjectId[];
    }
    namespace ExecuteSavedSearchByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace ExecuteSavedSearchByName {
      namespace Parameters {
        export type Name = string;
        export type User = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      export interface QueryParameters {
        user?: Parameters.User;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace GetAllTypeDefs {
      namespace Responses {
        export type $200 = Components.Schemas.AtlasTypesDef;
      }
    }
    namespace GetAuditEvents {
      namespace Parameters {
        export type AuditAction = Components.Schemas.EntityAuditActionV2;
        export type Count = number; // int32
        export type Guid = string;
        export type StartKey = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        auditAction?: Parameters.AuditAction;
        count?: Parameters.Count; // int32
        startKey?: Parameters.StartKey;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.EntityAuditEventV2[];
      }
    }
    namespace GetBusinessMetadataDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasStructDef;
      }
    }
    namespace GetBusinessMetadataDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasStructDef;
      }
    }
    namespace GetByGuids {
      namespace Parameters {
        export type Guid = string[];
        export type IgnoreRelationships = boolean;
        export type MinExtInfo = boolean;
      }
      export interface QueryParameters {
        guid?: Parameters.Guid;
        ignoreRelationships?: Parameters.IgnoreRelationships;
        minExtInfo?: Parameters.MinExtInfo;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntitiesWithExtInfo;
      }
    }
    namespace GetById {
      namespace Parameters {
        export type Guid = string;
        export type IgnoreRelationships = boolean;
        export type MinExtInfo = boolean;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        ignoreRelationships?: Parameters.IgnoreRelationships;
        minExtInfo?: Parameters.MinExtInfo;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntityWithExtInfo;
      }
    }
    namespace GetById2 {
      namespace Parameters {
        export type ExtendedInfo = boolean;
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        extendedInfo?: Parameters.ExtendedInfo;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasRelationshipWithExtInfo;
      }
    }
    namespace GetByUniqueAttributes {
      namespace Parameters {
        export type IgnoreRelationships = boolean;
        export type MinExtInfo = boolean;
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      export interface QueryParameters {
        ignoreRelationships?: Parameters.IgnoreRelationships;
        minExtInfo?: Parameters.MinExtInfo;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntityWithExtInfo;
      }
    }
    namespace GetCategoryTerms {
      namespace Parameters {
        export type CategoryGuid = string;
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface PathParameters {
        categoryGuid: Parameters.CategoryGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasRelatedTermHeader[];
      }
    }
    namespace GetClassification {
      namespace Parameters {
        export type ClassificationName = string;
        export type Guid = string;
      }
      export interface PathParameters {
        classificationName: Parameters.ClassificationName;
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasClassification;
      }
    }
    namespace GetClassificationDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasClassificationDef;
      }
    }
    namespace GetClassificationDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasClassificationDef;
      }
    }
    namespace GetClassifications {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasClassifications;
      }
    }
    namespace GetDetailedGlossary {
      namespace Parameters {
        export type GlossaryGuid = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryExtInfo;
      }
    }
    namespace GetEntitiesAssignedWithTerm {
      namespace Parameters {
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasRelatedObjectId[];
      }
    }
    namespace GetEntitiesByUniqueAttributes {
      namespace Parameters {
        export type IgnoreRelationships = boolean;
        export type MinExtInfo = boolean;
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      export interface QueryParameters {
        ignoreRelationships?: Parameters.IgnoreRelationships;
        minExtInfo?: Parameters.MinExtInfo;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntitiesWithExtInfo;
      }
    }
    namespace GetEntityDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntityDef;
      }
    }
    namespace GetEntityDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntityDef;
      }
    }
    namespace GetEntityHeaderByUniqueAttributes {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntityHeader;
      }
    }
    namespace GetEntityHeaders {
      namespace Parameters {
        export type TagUpdateStartTime = number; // int64
      }
      export interface QueryParameters {
        tagUpdateStartTime?: Parameters.TagUpdateStartTime; // int64
      }
    }
    namespace GetEnumDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEnumDef;
      }
    }
    namespace GetEnumDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEnumDef;
      }
    }
    namespace GetGlossaries {
      namespace Parameters {
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasGlossary[];
      }
    }
    namespace GetGlossary {
      namespace Parameters {
        export type GlossaryGuid = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossary;
      }
    }
    namespace GetGlossaryCategories {
      namespace Parameters {
        export type GlossaryGuid = string;
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasGlossaryCategory[];
      }
    }
    namespace GetGlossaryCategoriesHeaders {
      namespace Parameters {
        export type GlossaryGuid = string;
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasRelatedCategoryHeader[];
      }
    }
    namespace GetGlossaryCategory {
      namespace Parameters {
        export type CategoryGuid = string;
      }
      export interface PathParameters {
        categoryGuid: Parameters.CategoryGuid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryCategory;
      }
    }
    namespace GetGlossaryTerm {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryTerm;
      }
    }
    namespace GetGlossaryTermHeaders {
      namespace Parameters {
        export type GlossaryGuid = string;
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasRelatedTermHeader[];
      }
    }
    namespace GetGlossaryTerms {
      namespace Parameters {
        export type GlossaryGuid = string;
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasGlossaryTerm[];
      }
    }
    namespace GetHeaderById {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasEntityHeader;
      }
    }
    namespace GetLineageByUniqueAttribute {
      namespace Parameters {
        export type Depth = number; // int32
        export type Direction = Components.Schemas.LineageDirection;
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      export interface QueryParameters {
        depth?: Parameters.Depth; // int32
        direction?: Parameters.Direction;
      }
    }
    namespace GetLineageGraph {
      namespace Parameters {
        export type Depth = number; // int32
        export type Direction = Components.Schemas.LineageDirection;
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        depth?: Parameters.Depth; // int32
        direction?: Parameters.Direction;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasLineageInfo;
      }
    }
    namespace GetRelatedCategories {
      namespace Parameters {
        export type CategoryGuid = string;
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
      }
      export interface PathParameters {
        categoryGuid: Parameters.CategoryGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        export interface $200 {
          [name: string]: {};
        }
      }
    }
    namespace GetRelatedTerms {
      namespace Parameters {
        export type Limit = string;
        export type Offset = string;
        export type Sort = string;
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      export interface QueryParameters {
        limit?: Parameters.Limit;
        offset?: Parameters.Offset;
        sort?: Parameters.Sort;
      }
      namespace Responses {
        export interface $200 {
          [name: string]: {};
        }
      }
    }
    namespace GetRelationshipDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasRelationshipDef;
      }
    }
    namespace GetRelationshipDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasRelationshipDef;
      }
    }
    namespace GetSavedSearch {
      namespace Parameters {
        export type Name = string;
        export type User = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      export interface QueryParameters {
        user?: Parameters.User;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasUserSavedSearch;
      }
    }
    namespace GetSavedSearches {
      namespace Parameters {
        export type User = string;
      }
      export interface QueryParameters {
        user?: Parameters.User;
      }
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasUserSavedSearch[];
      }
    }
    namespace GetStructDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasStructDef;
      }
    }
    namespace GetStructDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasStructDef;
      }
    }
    namespace GetSuggestions {
      namespace Parameters {
        export type FieldName = string;
        export type PrefixString = string;
      }
      export interface QueryParameters {
        fieldName?: Parameters.FieldName;
        prefixString?: Parameters.PrefixString;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSuggestionsResult;
      }
    }
    namespace GetTypeDefByGuid {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasBaseTypeDef;
      }
    }
    namespace GetTypeDefByName {
      namespace Parameters {
        export type Name = string;
      }
      export interface PathParameters {
        name: Parameters.Name;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasBaseTypeDef;
      }
    }
    namespace GetTypeDefHeaders {
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasTypeDefHeader[];
      }
    }
    namespace ImportBMAttributes {
      namespace Responses {
        export type $200 = Components.Schemas.BulkImportResponse;
      }
    }
    namespace ImportGlossaryData {
      namespace Responses {
        /**
         *
         */
        export type $200 = Components.Schemas.AtlasGlossaryTerm[];
      }
    }
    namespace PartialUpdateEntityAttrByGuid {
      namespace Parameters {
        export type Guid = string;
        export type Name = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      export interface QueryParameters {
        name?: Parameters.Name;
      }
      namespace Responses {
        export type $204 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace PartialUpdateEntityByUniqueAttrs {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      export type RequestBody = Components.Schemas.AtlasEntityWithExtInfo;
      namespace Responses {
        export type $204 = Components.Schemas.EntityMutationResponse;
      }
    }
    namespace PartialUpdateGlossary {
      namespace Parameters {
        export type GlossaryGuid = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      /**
       * Map containing keys as attribute names and values as corresponding attribute values
       */
      export interface RequestBody {
        [name: string]: string;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossary;
      }
    }
    namespace PartialUpdateGlossaryCategory {
      namespace Parameters {
        export type CategoryGuid = string;
      }
      export interface PathParameters {
        categoryGuid: Parameters.CategoryGuid;
      }
      /**
       * Map containing keys as attribute names and values as corresponding attribute values
       */
      export interface RequestBody {
        [name: string]: string;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryCategory;
      }
    }
    namespace PartialUpdateGlossaryTerm {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      /**
       * Map containing keys as attribute names and values as corresponding attribute values
       */
      export interface RequestBody {
        [name: string]: string;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryTerm;
      }
    }
    namespace PostaddOrUpdateBusinessAttributes {
      namespace Parameters {
        export type BmName = string;
        export type Guid = string;
      }
      export interface PathParameters {
        bmName: Parameters.BmName;
        guid: Parameters.Guid;
      }
    }
    namespace PostsetLabels {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      /**
       *
       */
      export type RequestBody = string[];
    }
    namespace PutaddLabels {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      /**
       *
       */
      export type RequestBody = string[];
    }
    namespace QuickSearch {
      namespace Parameters {
        export type ExcludeDeletedEntities = boolean;
        export type Limit = number; // int32
        export type Offset = number; // int32
        export type Query = string;
        export type TypeName = string;
      }
      export interface QueryParameters {
        excludeDeletedEntities?: Parameters.ExcludeDeletedEntities;
        limit?: Parameters.Limit; // int32
        offset?: Parameters.Offset; // int32
        query?: Parameters.Query;
        typeName?: Parameters.TypeName;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasQuickSearchResult;
      }
    }
    namespace QuickSearch2 {
      export type RequestBody = Components.Schemas.QuickSearchParameters;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasQuickSearchResult;
      }
    }
    namespace RemoveBusinessAttributes {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
    }
    namespace RemoveLabels {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
    }
    namespace RemoveTermAssignmentFromEntities {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      /**
       * List of related entity IDs from which the term has to be dissociated
       */
      export type RequestBody = Components.Schemas.AtlasRelatedObjectId[];
    }
    namespace SearchRelatedEntities {
      namespace Parameters {
        export type Attributes = string[];
        export type ExcludeDeletedEntities = boolean;
        export type Guid = string;
        export type Limit = number; // int32
        export type Offset = number; // int32
        export type Relation = string;
        export type SortBy = string;
        export type SortOrder = Components.Schemas.SortOrder;
      }
      export interface QueryParameters {
        attributes?: Parameters.Attributes;
        excludeDeletedEntities?: Parameters.ExcludeDeletedEntities;
        guid?: Parameters.Guid;
        limit?: Parameters.Limit; // int32
        offset?: Parameters.Offset; // int32
        relation?: Parameters.Relation;
        sortBy?: Parameters.SortBy;
        sortOrder?: Parameters.SortOrder;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace SearchUsingAttribute {
      namespace Parameters {
        export type AttrName = string;
        export type AttrValuePrefix = string;
        export type Limit = number; // int32
        export type Offset = number; // int32
        export type TypeName = string;
      }
      export interface QueryParameters {
        attrName?: Parameters.AttrName;
        attrValuePrefix?: Parameters.AttrValuePrefix;
        limit?: Parameters.Limit; // int32
        offset?: Parameters.Offset; // int32
        typeName?: Parameters.TypeName;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace SearchUsingBasic {
      namespace Parameters {
        export type Classification = string;
        export type ExcludeDeletedEntities = boolean;
        export type Limit = number; // int32
        export type Offset = number; // int32
        export type Query = string;
        export type SortBy = string;
        export type SortOrder = Components.Schemas.SortOrder;
        export type TypeName = string;
      }
      export interface QueryParameters {
        classification?: Parameters.Classification;
        excludeDeletedEntities?: Parameters.ExcludeDeletedEntities;
        limit?: Parameters.Limit; // int32
        offset?: Parameters.Offset; // int32
        query?: Parameters.Query;
        sortBy?: Parameters.SortBy;
        sortOrder?: Parameters.SortOrder;
        typeName?: Parameters.TypeName;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace SearchUsingDSL {
      namespace Parameters {
        export type Classification = string;
        export type Limit = number; // int32
        export type Offset = number; // int32
        export type Query = string;
        export type TypeName = string;
      }
      export interface QueryParameters {
        classification?: Parameters.Classification;
        limit?: Parameters.Limit; // int32
        offset?: Parameters.Offset; // int32
        query?: Parameters.Query;
        typeName?: Parameters.TypeName;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace SearchUsingFullText {
      namespace Parameters {
        export type ExcludeDeletedEntities = boolean;
        export type Limit = number; // int32
        export type Offset = number; // int32
        export type Query = string;
      }
      export interface QueryParameters {
        excludeDeletedEntities?: Parameters.ExcludeDeletedEntities;
        limit?: Parameters.Limit; // int32
        offset?: Parameters.Offset; // int32
        query?: Parameters.Query;
      }
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace SearchWithParameters {
      export type RequestBody = Components.Schemas.SearchParameters;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasSearchResult;
      }
    }
    namespace SetLabels {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
    }
    namespace Update {
      export type RequestBody = Components.Schemas.AtlasRelationship;
      namespace Responses {
        export type $204 = Components.Schemas.AtlasRelationship;
      }
    }
    namespace UpdateAtlasTypeDefs {
      export type RequestBody = Components.Schemas.AtlasTypesDef;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasTypesDef;
      }
    }
    namespace UpdateClassifications {
      namespace Parameters {
        export type Guid = string;
      }
      export interface PathParameters {
        guid: Parameters.Guid;
      }
      /**
       *
       */
      export type RequestBody = Components.Schemas.AtlasClassification[];
    }
    namespace UpdateClassificationsByUniqueAttribute {
      namespace Parameters {
        export type TypeName = string;
      }
      export interface PathParameters {
        typeName: Parameters.TypeName;
      }
      /**
       *
       */
      export type RequestBody = Components.Schemas.AtlasClassification[];
    }
    namespace UpdateGlossary {
      namespace Parameters {
        export type GlossaryGuid = string;
      }
      export interface PathParameters {
        glossaryGuid: Parameters.GlossaryGuid;
      }
      export type RequestBody = Components.Schemas.AtlasGlossary;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossary;
      }
    }
    namespace UpdateGlossaryCategory {
      namespace Parameters {
        export type CategoryGuid = string;
      }
      export interface PathParameters {
        categoryGuid: Parameters.CategoryGuid;
      }
      export type RequestBody = Components.Schemas.AtlasGlossaryCategory;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryCategory;
      }
    }
    namespace UpdateGlossaryTerm {
      namespace Parameters {
        export type TermGuid = string;
      }
      export interface PathParameters {
        termGuid: Parameters.TermGuid;
      }
      export type RequestBody = Components.Schemas.AtlasGlossaryTerm;
      namespace Responses {
        export type $200 = Components.Schemas.AtlasGlossaryTerm;
      }
    }
    namespace UpdateSavedSearch {
      export type RequestBody = Components.Schemas.AtlasUserSavedSearch;
      namespace Responses {
        export type $204 = Components.Schemas.AtlasUserSavedSearch;
      }
    }
  }
  
  export interface OperationMethods {
    /**
     * searchUsingAttribute - searchUsingAttribute
     *
     * Retrieve data for the specified attribute search query
     */
    "searchUsingAttribute"(
      parameters?: Parameters<Paths.SearchUsingAttribute.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchUsingAttribute.Responses.$200>;
    /**
     * searchUsingBasic - searchUsingBasic
     *
     * Retrieve data for the specified fulltext query
     */
    "searchUsingBasic"(
      parameters?: Parameters<Paths.SearchUsingBasic.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchUsingBasic.Responses.$200>;
    /**
     * searchWithParameters - searchWithParameters
     *
     * Attribute based search for entities satisfying the search parameters
     */
    "searchWithParameters"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.SearchWithParameters.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchWithParameters.Responses.$200>;
    /**
     * searchUsingDSL - searchUsingDSL
     *
     * Retrieve data for the specified DSL
     */
    "searchUsingDSL"(
      parameters?: Parameters<Paths.SearchUsingDSL.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchUsingDSL.Responses.$200>;
    /**
     * searchUsingFullText - searchUsingFullText
     *
     * Retrieve data for the specified fulltext query
     */
    "searchUsingFullText"(
      parameters?: Parameters<Paths.SearchUsingFullText.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchUsingFullText.Responses.$200>;
    /**
     * quickSearch - quickSearch
     *
     * Attribute based search for entities satisfying the search parameters
     */
    "quickSearch"(
      parameters?: Parameters<Paths.QuickSearch.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.QuickSearch.Responses.$200>;
    /**
     * quickSearch2 - quickSearch2
     *
     * Attribute based search for entities satisfying the search parameters
     */
    "quickSearch2"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.QuickSearch2.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.QuickSearch2.Responses.$200>;
    /**
     * searchRelatedEntities - searchRelatedEntities
     *
     * Relationship search to search for related entities satisfying the search parameters
     */
    "searchRelatedEntities"(
      parameters?: Parameters<Paths.SearchRelatedEntities.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchRelatedEntities.Responses.$200>;
    /**
     * getSavedSearches - getSavedSearches
     */
    "getSavedSearches"(
      parameters?: Parameters<Paths.GetSavedSearches.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetSavedSearches.Responses.$200>;
    /**
     * updateSavedSearch - updateSavedSearch
     */
    "updateSavedSearch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateSavedSearch.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSavedSearch.Responses.$204>;
    /**
     * addSavedSearch - addSavedSearch
     */
    "addSavedSearch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddSavedSearch.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AddSavedSearch.Responses.$201>;
    /**
     * executeSavedSearchByGuid - executeSavedSearchByGuid
     *
     * Attribute based search for entities satisfying the search parameters
     */
    "executeSavedSearchByGuid"(
      parameters?: Parameters<Paths.ExecuteSavedSearchByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ExecuteSavedSearchByGuid.Responses.$200>;
    /**
     * executeSavedSearchByName - executeSavedSearchByName
     *
     * Attribute based search for entities satisfying the search parameters
     */
    "executeSavedSearchByName"(
      parameters?: Parameters<
        Paths.ExecuteSavedSearchByName.PathParameters &
        Paths.ExecuteSavedSearchByName.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ExecuteSavedSearchByName.Responses.$200>;
    /**
     * deleteSavedSearch - deleteSavedSearch
     */
    "deleteSavedSearch"(
      parameters?: Parameters<Paths.DeleteSavedSearch.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getSavedSearch - getSavedSearch
     */
    "getSavedSearch"(
      parameters?: Parameters<
        Paths.GetSavedSearch.PathParameters & Paths.GetSavedSearch.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetSavedSearch.Responses.$200>;
    /**
     * getSuggestions - getSuggestions
     */
    "getSuggestions"(
      parameters?: Parameters<Paths.GetSuggestions.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetSuggestions.Responses.$200>;
    /**
     * createOrUpdate - createOrUpdate
     *
     * Create new entity or update existing entity in Atlas.
     * Existing entity is matched using its unique guid if supplied or by its unique attributes eg: qualifiedName
     */
    "createOrUpdate"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOrUpdate.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateOrUpdate.Responses.$201>;
    /**
     * getByGuids - getByGuids
     *
     * Bulk API to retrieve list of entities identified by its GUIDs.
     */
    "getByGuids"(
      parameters?: Parameters<Paths.GetByGuids.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetByGuids.Responses.$200>;
    /**
     * createOrUpdate1 - createOrUpdate1
     *
     * Bulk API to create new entities or updates existing entities in Atlas.
     * Existing entity is matched using its unique guid if supplied or by its unique attributes eg: qualifiedName
     */
    "createOrUpdate1"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOrUpdate1.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateOrUpdate1.Responses.$201>;
    /**
     * deleteByGuids - deleteByGuids
     *
     * Bulk API to delete list of entities identified by its GUIDs
     */
    "deleteByGuids"(
      parameters?: Parameters<Paths.DeleteByGuids.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteByGuids.Responses.$204>;
    /**
     * addClassification - addClassification
     *
     * Bulk API to associate a tag to multiple entities
     */
    "addClassification"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AddClassification.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getEntityHeaders - getEntityHeaders
     */
    "getEntityHeaders"(
      parameters?: Parameters<Paths.GetEntityHeaders.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * setClassifications - setClassifications
     */
    "setClassifications"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getEntitiesByUniqueAttributes - getEntitiesByUniqueAttributes
     *
     * Bulk API to retrieve list of entities identified by its unique attributes.
     *
     * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
     *
     * typeName=<typeName>&attr_1:<attrName>=<attrValue>&attr_2:<attrName>=<attrValue>&attr_3:<attrName>=<attrValue>
     *
     * NOTE: The attrName should be an unique attribute for the given entity-type
     *
     * The REST request would look something like this
     *
     * GET /v2/entity/bulk/uniqueAttribute/type/hive_db?attr_0:qualifiedName=db1@cl1&attr_2:qualifiedName=db2@cl1
     */
    "getEntitiesByUniqueAttributes"(
      parameters?: Parameters<
        Paths.GetEntitiesByUniqueAttributes.PathParameters &
        Paths.GetEntitiesByUniqueAttributes.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEntitiesByUniqueAttributes.Responses.$200>;
    /**
     * importBMAttributes - importBMAttributes
     *
     * Upload the file for creating Business Metadata in BULK
     */
    "importBMAttributes"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ImportBMAttributes.Responses.$200>;
    /**
     * produceTemplate - produceTemplate
     *
     * Get the sample Template for uploading/creating bulk BusinessMetaData
     */
    "produceTemplate"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getById - getById
     *
     * Fetch complete definition of an entity given its GUID.
     */
    "getById"(
      parameters?: Parameters<
        Paths.GetById.PathParameters & Paths.GetById.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetById.Responses.$200>;
    /**
     * partialUpdateEntityAttrByGuid - partialUpdateEntityAttrByGuid
     *
     * Entity Partial Update - Add/Update entity attribute identified by its GUID.
     * Supports only uprimitive attribute type and entity references.
     * does not support updation of complex types like arrays, maps
     * Null updates are not possible
     */
    "partialUpdateEntityAttrByGuid"(
      parameters?: Parameters<
        Paths.PartialUpdateEntityAttrByGuid.PathParameters &
        Paths.PartialUpdateEntityAttrByGuid.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PartialUpdateEntityAttrByGuid.Responses.$204>;
    /**
     * deleteByGuid - deleteByGuid
     *
     * Delete an entity identified by its GUID.
     */
    "deleteByGuid"(
      parameters?: Parameters<Paths.DeleteByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteByGuid.Responses.$204>;
    /**
     * addOrUpdateBusinessAttributes - addOrUpdateBusinessAttributes
     */
    "addOrUpdateBusinessAttributes"(
      parameters?: Parameters<
        Paths.AddOrUpdateBusinessAttributes.PathParameters &
        Paths.AddOrUpdateBusinessAttributes.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * removeBusinessAttributes - removeBusinessAttributes
     */
    "removeBusinessAttributes"(
      parameters?: Parameters<Paths.RemoveBusinessAttributes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * PostaddOrUpdateBusinessAttributes - addOrUpdateBusinessAttributes
     */
    "PostaddOrUpdateBusinessAttributes"(
      parameters?: Parameters<Paths.PostaddOrUpdateBusinessAttributes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * DeleteremoveBusinessAttributes - removeBusinessAttributes
     */
    "DeleteremoveBusinessAttributes"(
      parameters?: Parameters<Paths.DeleteremoveBusinessAttributes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getClassification - getClassification
     *
     * Gets the list of classifications for a given entity represented by a guid.
     */
    "getClassification"(
      parameters?: Parameters<Paths.GetClassification.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetClassification.Responses.$200>;
    /**
     * deleteClassification - deleteClassification
     *
     * Deletes a given classification from an existing entity represented by a guid.
     */
    "deleteClassification"(
      parameters?: Parameters<
        Paths.DeleteClassification.PathParameters &
        Paths.DeleteClassification.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getClassifications - getClassifications
     *
     * Gets the list of classifications for a given entity represented by a guid.
     */
    "getClassifications"(
      parameters?: Parameters<Paths.GetClassifications.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetClassifications.Responses.$200>;
    /**
     * updateClassifications - updateClassifications
     *
     * Updates classifications to an existing entity represented by a guid.
     */
    "updateClassifications"(
      parameters?: Parameters<Paths.UpdateClassifications.PathParameters> | null,
      data?: Paths.UpdateClassifications.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * addClassifications - addClassifications
     *
     * Adds classifications to an existing entity represented by a guid.
     */
    "addClassifications"(
      parameters?: Parameters<Paths.AddClassifications.PathParameters> | null,
      data?: Paths.AddClassifications.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getHeaderById - getHeaderById
     *
     * Get entity header given its GUID.
     */
    "getHeaderById"(
      parameters?: Parameters<Paths.GetHeaderById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetHeaderById.Responses.$200>;
    /**
     * addLabels - addLabels
     *
     * add given labels to a given entity
     */
    "addLabels"(
      parameters?: Parameters<Paths.AddLabels.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * setLabels - setLabels
     *
     * Set labels to a given entity
     */
    "setLabels"(
      parameters?: Parameters<Paths.SetLabels.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * removeLabels - removeLabels
     *
     * delete given labels to a given entity
     */
    "removeLabels"(
      parameters?: Parameters<Paths.RemoveLabels.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getByUniqueAttributes - getByUniqueAttributes
     *
     * Fetch complete definition of an entity given its type and unique attribute.
     *
     * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
     *
     * attr:<attrName>=<attrValue>
     *
     * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
     *
     * The REST request would look something like this
     *
     * GET /v2/entity/uniqueAttribute/type/aType?attr:aTypeAttribute=someValue
     */
    "getByUniqueAttributes"(
      parameters?: Parameters<
        Paths.GetByUniqueAttributes.PathParameters &
        Paths.GetByUniqueAttributes.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetByUniqueAttributes.Responses.$200>;
    /**
     * partialUpdateEntityByUniqueAttrs - partialUpdateEntityByUniqueAttrs
     *
     * Entity Partial Update - Allows a subset of attributes to be updated on
     * an entity which is identified by its type and unique attribute  eg: Referenceable.qualifiedName.
     * Null updates are not possible
     *
     * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
     *
     * attr:<attrName>=<attrValue>
     *
     * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
     *
     * The REST request would look something like this
     *
     * PUT /v2/entity/uniqueAttribute/type/aType?attr:aTypeAttribute=someValue
     */
    "partialUpdateEntityByUniqueAttrs"(
      parameters?: Parameters<Paths.PartialUpdateEntityByUniqueAttrs.PathParameters> | null,
      data?: Paths.PartialUpdateEntityByUniqueAttrs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PartialUpdateEntityByUniqueAttrs.Responses.$204>;
    /**
     * deleteByUniqueAttribute - deleteByUniqueAttribute
     *
     * Delete an entity identified by its type and unique attributes.
     *
     * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
     *
     * attr:<attrName>=<attrValue>
     *
     * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
     *
     * The REST request would look something like this
     *
     * DELETE /v2/entity/uniqueAttribute/type/aType?attr:aTypeAttribute=someValue
     */
    "deleteByUniqueAttribute"(
      parameters?: Parameters<Paths.DeleteByUniqueAttribute.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteByUniqueAttribute.Responses.$204>;
    /**
     * deleteClassificationByUniqueAttribute - deleteClassificationByUniqueAttribute
     *
     * Deletes a given classification from an entity identified by its type and unique attributes.
     */
    "deleteClassificationByUniqueAttribute"(
      parameters?: Parameters<Paths.DeleteClassificationByUniqueAttribute.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * updateClassificationsByUniqueAttribute - updateClassificationsByUniqueAttribute
     *
     * Updates classification on an entity identified by its type and unique attributes.
     */
    "updateClassificationsByUniqueAttribute"(
      parameters?: Parameters<Paths.UpdateClassificationsByUniqueAttribute.PathParameters> | null,
      data?: Paths.UpdateClassificationsByUniqueAttribute.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * addClassificationsByUniqueAttribute - addClassificationsByUniqueAttribute
     *
     * Adds classification to the entity identified by its type and unique attributes.
     */
    "addClassificationsByUniqueAttribute"(
      parameters?: Parameters<Paths.AddClassificationsByUniqueAttribute.PathParameters> | null,
      data?: Paths.AddClassificationsByUniqueAttribute.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getEntityHeaderByUniqueAttributes - getEntityHeaderByUniqueAttributes
     *
     * Fetch AtlasEntityHeader given its type and unique attribute.
     *
     * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
     *
     * attr:<attrName>=<attrValue>
     *
     * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
     *
     * The REST request would look something like this
     *
     * GET /v2/entity/uniqueAttribute/type/aType/header?attr:aTypeAttribute=someValue
     */
    "getEntityHeaderByUniqueAttributes"(
      parameters?: Parameters<Paths.GetEntityHeaderByUniqueAttributes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEntityHeaderByUniqueAttributes.Responses.$200>;
    /**
     * PutaddLabels - addLabels
     */
    "PutaddLabels"(
      parameters?: Parameters<Paths.PutaddLabels.PathParameters> | null,
      data?: Paths.PutaddLabels.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * PostsetLabels - setLabels
     */
    "PostsetLabels"(
      parameters?: Parameters<Paths.PostsetLabels.PathParameters> | null,
      data?: Paths.PostsetLabels.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * DeleteremoveLabels - removeLabels
     */
    "DeleteremoveLabels"(
      parameters?: Parameters<Paths.DeleteremoveLabels.PathParameters> | null,
      data?: Paths.DeleteremoveLabels.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getAuditEvents - getAuditEvents
     */
    "getAuditEvents"(
      parameters?: Parameters<
        Paths.GetAuditEvents.PathParameters & Paths.GetAuditEvents.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetAuditEvents.Responses.$200>;
    /**
     * getGlossaries - getGlossaries
     *
     * Retrieve all glossaries registered with Atlas
     */
    "getGlossaries"(
      parameters?: Parameters<Paths.GetGlossaries.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaries.Responses.$200>;
    /**
     * createGlossary - createGlossary
     *
     * Create a glossary
     */
    "createGlossary"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateGlossary.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateGlossary.Responses.$200>;
    /**
     * createGlossaryCategories - createGlossaryCategories
     *
     * Create glossary category in bulk
     */
    "createGlossaryCategories"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateGlossaryCategories.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateGlossaryCategories.Responses.$200>;
    /**
     * createGlossaryCategory - createGlossaryCategory
     *
     * Create glossary category
     */
    "createGlossaryCategory"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateGlossaryCategory.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateGlossaryCategory.Responses.$200>;
    /**
     * getGlossaryCategory - getGlossaryCategory
     *
     * Get specific glossary category
     */
    "getGlossaryCategory"(
      parameters?: Parameters<Paths.GetGlossaryCategory.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaryCategory.Responses.$200>;
    /**
     * updateGlossaryCategory - updateGlossaryCategory
     *
     * Update the given glossary category
     */
    "updateGlossaryCategory"(
      parameters?: Parameters<Paths.UpdateGlossaryCategory.PathParameters> | null,
      data?: Paths.UpdateGlossaryCategory.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateGlossaryCategory.Responses.$200>;
    /**
     * deleteGlossaryCategory - deleteGlossaryCategory
     *
     * Delete a glossary category
     */
    "deleteGlossaryCategory"(
      parameters?: Parameters<Paths.DeleteGlossaryCategory.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * partialUpdateGlossaryCategory - partialUpdateGlossaryCategory
     *
     * Partially update the glossary category
     */
    "partialUpdateGlossaryCategory"(
      parameters?: Parameters<Paths.PartialUpdateGlossaryCategory.PathParameters> | null,
      data?: Paths.PartialUpdateGlossaryCategory.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PartialUpdateGlossaryCategory.Responses.$200>;
    /**
     * getRelatedCategories - getRelatedCategories
     *
     * Get all related categories (parent and children)
     */
    "getRelatedCategories"(
      parameters?: Parameters<
        Paths.GetRelatedCategories.PathParameters &
        Paths.GetRelatedCategories.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRelatedCategories.Responses.$200>;
    /**
     * getCategoryTerms - getCategoryTerms
     *
     * Get all terms associated with the specific category
     */
    "getCategoryTerms"(
      parameters?: Parameters<
        Paths.GetCategoryTerms.PathParameters &
        Paths.GetCategoryTerms.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetCategoryTerms.Responses.$200>;
    /**
     * importGlossaryData - importGlossaryData
     *
     * Upload glossary file for creating AtlasGlossaryTerms in bulk
     */
    "importGlossaryData"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ImportGlossaryData.Responses.$200>;
    /**
     * produceTemplate2 - produceTemplate2
     *
     * Get sample template for uploading/creating bulk AtlasGlossaryTerm
     */
    "produceTemplate2"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * createGlossaryTerm - createGlossaryTerm
     *
     * Create a glossary term
     */
    "createGlossaryTerm"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateGlossaryTerm.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateGlossaryTerm.Responses.$200>;
    /**
     * getGlossaryTerm - getGlossaryTerm
     *
     * Get specific glossary term
     */
    "getGlossaryTerm"(
      parameters?: Parameters<Paths.GetGlossaryTerm.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaryTerm.Responses.$200>;
    /**
     * updateGlossaryTerm - updateGlossaryTerm
     *
     * Update the given glossary term
     */
    "updateGlossaryTerm"(
      parameters?: Parameters<Paths.UpdateGlossaryTerm.PathParameters> | null,
      data?: Paths.UpdateGlossaryTerm.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateGlossaryTerm.Responses.$200>;
    /**
     * deleteGlossaryTerm - deleteGlossaryTerm
     *
     * Delete a glossary term
     */
    "deleteGlossaryTerm"(
      parameters?: Parameters<Paths.DeleteGlossaryTerm.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * partialUpdateGlossaryTerm - partialUpdateGlossaryTerm
     *
     * Partially update the glossary term
     */
    "partialUpdateGlossaryTerm"(
      parameters?: Parameters<Paths.PartialUpdateGlossaryTerm.PathParameters> | null,
      data?: Paths.PartialUpdateGlossaryTerm.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PartialUpdateGlossaryTerm.Responses.$200>;
    /**
     * createGlossaryTerms - createGlossaryTerms
     *
     * Create glossary terms in bulk
     */
    "createGlossaryTerms"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateGlossaryTerms.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateGlossaryTerms.Responses.$200>;
    /**
     * getEntitiesAssignedWithTerm - getEntitiesAssignedWithTerm
     *
     * Get all entity headers assigned with the specified term
     */
    "getEntitiesAssignedWithTerm"(
      parameters?: Parameters<
        Paths.GetEntitiesAssignedWithTerm.PathParameters &
        Paths.GetEntitiesAssignedWithTerm.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEntitiesAssignedWithTerm.Responses.$200>;
    /**
     * disassociateTermAssignmentFromEntities - disassociateTermAssignmentFromEntities
     *
     * Remove the term assignment for the given list of entity headers
     */
    "disassociateTermAssignmentFromEntities"(
      parameters?: Parameters<Paths.DisassociateTermAssignmentFromEntities.PathParameters> | null,
      data?: Paths.DisassociateTermAssignmentFromEntities.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * assignTermToEntities - assignTermToEntities
     *
     * Assign the given term to the provided list of entity headers
     */
    "assignTermToEntities"(
      parameters?: Parameters<Paths.AssignTermToEntities.PathParameters> | null,
      data?: Paths.AssignTermToEntities.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * removeTermAssignmentFromEntities - removeTermAssignmentFromEntities
     *
     * Remove the term assignment for the given list of entity headers
     */
    "removeTermAssignmentFromEntities"(
      parameters?: Parameters<Paths.RemoveTermAssignmentFromEntities.PathParameters> | null,
      data?: Paths.RemoveTermAssignmentFromEntities.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getRelatedTerms - getRelatedTerms
     *
     * Get all related terms for a specific term
     */
    "getRelatedTerms"(
      parameters?: Parameters<
        Paths.GetRelatedTerms.PathParameters &
        Paths.GetRelatedTerms.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRelatedTerms.Responses.$200>;
    /**
     * getGlossary - getGlossary
     *
     * Get a specific Glossary
     */
    "getGlossary"(
      parameters?: Parameters<Paths.GetGlossary.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossary.Responses.$200>;
    /**
     * updateGlossary - updateGlossary
     *
     * Update the given glossary
     */
    "updateGlossary"(
      parameters?: Parameters<Paths.UpdateGlossary.PathParameters> | null,
      data?: Paths.UpdateGlossary.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateGlossary.Responses.$200>;
    /**
     * deleteGlossary - deleteGlossary
     *
     * Delete a glossary
     */
    "deleteGlossary"(
      parameters?: Parameters<Paths.DeleteGlossary.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getGlossaryCategories - getGlossaryCategories
     *
     * Get the categories belonging to a specific glossary
     */
    "getGlossaryCategories"(
      parameters?: Parameters<
        Paths.GetGlossaryCategories.PathParameters &
        Paths.GetGlossaryCategories.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaryCategories.Responses.$200>;
    /**
     * getGlossaryCategoriesHeaders - getGlossaryCategoriesHeaders
     *
     * Get the categories belonging to a specific glossary
     */
    "getGlossaryCategoriesHeaders"(
      parameters?: Parameters<
        Paths.GetGlossaryCategoriesHeaders.PathParameters &
        Paths.GetGlossaryCategoriesHeaders.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaryCategoriesHeaders.Responses.$200>;
    /**
     * getDetailedGlossary - getDetailedGlossary
     *
     * Get a specific Glossary
     */
    "getDetailedGlossary"(
      parameters?: Parameters<Paths.GetDetailedGlossary.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDetailedGlossary.Responses.$200>;
    /**
     * partialUpdateGlossary - partialUpdateGlossary
     *
     * Partially update the glossary
     */
    "partialUpdateGlossary"(
      parameters?: Parameters<Paths.PartialUpdateGlossary.PathParameters> | null,
      data?: Paths.PartialUpdateGlossary.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PartialUpdateGlossary.Responses.$200>;
    /**
     * getGlossaryTerms - getGlossaryTerms
     *
     * Get terms belonging to a specific glossary
     */
    "getGlossaryTerms"(
      parameters?: Parameters<
        Paths.GetGlossaryTerms.PathParameters &
        Paths.GetGlossaryTerms.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaryTerms.Responses.$200>;
    /**
     * getGlossaryTermHeaders - getGlossaryTermHeaders
     *
     * Get term headers belonging to a specific glossary
     */
    "getGlossaryTermHeaders"(
      parameters?: Parameters<
        Paths.GetGlossaryTermHeaders.PathParameters &
        Paths.GetGlossaryTermHeaders.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlossaryTermHeaders.Responses.$200>;
    /**
     * getLineageByUniqueAttribute - getLineageByUniqueAttribute
     *
     * Returns lineage info about entity.
     *
     * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
     *
     * attr:<attrName>=<attrValue>
     *
     * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
     */
    "getLineageByUniqueAttribute"(
      parameters?: Parameters<
        Paths.GetLineageByUniqueAttribute.PathParameters &
        Paths.GetLineageByUniqueAttribute.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getLineageGraph - getLineageGraph
     *
     * Returns lineage info about entity.
     */
    "getLineageGraph"(
      parameters?: Parameters<
        Paths.GetLineageGraph.PathParameters &
        Paths.GetLineageGraph.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetLineageGraph.Responses.$200>;
    /**
     * update - update
     *
     * Update an existing relationship between entities.
     */
    "update"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Update.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Update.Responses.$204>;
    /**
     * create - create
     *
     * Create a new relationship between entities.
     */
    "create"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Create.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Create.Responses.$201>;
    /**
     * getById2 - getById2
     *
     * Get relationship information between entities using guid.
     */
    "getById2"(
      parameters?: Parameters<
        Paths.GetById2.PathParameters & Paths.GetById2.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetById2.Responses.$200>;
    /**
     * deleteById - deleteById
     *
     * Delete a relationship between entities using guid.
     */
    "deleteById"(
      parameters?: Parameters<Paths.DeleteById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getBusinessMetadataDefByGuid - getBusinessMetadataDefByGuid
     *
     * Get the businessMetadata definition for the given guid
     */
    "getBusinessMetadataDefByGuid"(
      parameters?: Parameters<Paths.GetBusinessMetadataDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetBusinessMetadataDefByGuid.Responses.$200>;
    /**
     * getBusinessMetadataDefByName - getBusinessMetadataDefByName
     *
     * Get the businessMetadata definition by it's name (unique)
     */
    "getBusinessMetadataDefByName"(
      parameters?: Parameters<Paths.GetBusinessMetadataDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetBusinessMetadataDefByName.Responses.$200>;
    /**
     * getClassificationDefByGuid - getClassificationDefByGuid
     *
     * Get the classification definition for the given guid
     */
    "getClassificationDefByGuid"(
      parameters?: Parameters<Paths.GetClassificationDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetClassificationDefByGuid.Responses.$200>;
    /**
     * getClassificationDefByName - getClassificationDefByName
     *
     * Get the classification definition by it's name (unique)
     */
    "getClassificationDefByName"(
      parameters?: Parameters<Paths.GetClassificationDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetClassificationDefByName.Responses.$200>;
    /**
     * getEntityDefByGuid - getEntityDefByGuid
     *
     * Get the Entity definition for the given guid
     */
    "getEntityDefByGuid"(
      parameters?: Parameters<Paths.GetEntityDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEntityDefByGuid.Responses.$200>;
    /**
     * getEntityDefByName - getEntityDefByName
     *
     * Get the entity definition by it's name (unique)
     */
    "getEntityDefByName"(
      parameters?: Parameters<Paths.GetEntityDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEntityDefByName.Responses.$200>;
    /**
     * getEnumDefByGuid - getEnumDefByGuid
     *
     * Get the enum definition for the given guid
     */
    "getEnumDefByGuid"(
      parameters?: Parameters<Paths.GetEnumDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEnumDefByGuid.Responses.$200>;
    /**
     * getEnumDefByName - getEnumDefByName
     *
     * Get the enum definition by it's name (unique)
     */
    "getEnumDefByName"(
      parameters?: Parameters<Paths.GetEnumDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetEnumDefByName.Responses.$200>;
    /**
     * getRelationshipDefByGuid - getRelationshipDefByGuid
     *
     * Get the relationship definition for the given guid
     */
    "getRelationshipDefByGuid"(
      parameters?: Parameters<Paths.GetRelationshipDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRelationshipDefByGuid.Responses.$200>;
    /**
     * getRelationshipDefByName - getRelationshipDefByName
     *
     * Get the relationship definition by it's name (unique)
     */
    "getRelationshipDefByName"(
      parameters?: Parameters<Paths.GetRelationshipDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRelationshipDefByName.Responses.$200>;
    /**
     * getStructDefByGuid - getStructDefByGuid
     *
     * Get the struct definition for the given guid
     */
    "getStructDefByGuid"(
      parameters?: Parameters<Paths.GetStructDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetStructDefByGuid.Responses.$200>;
    /**
     * getStructDefByName - getStructDefByName
     *
     * Get the struct definition by it's name (unique)
     */
    "getStructDefByName"(
      parameters?: Parameters<Paths.GetStructDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetStructDefByName.Responses.$200>;
    /**
     * getTypeDefByGuid - getTypeDefByGuid
     */
    "getTypeDefByGuid"(
      parameters?: Parameters<Paths.GetTypeDefByGuid.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetTypeDefByGuid.Responses.$200>;
    /**
     * getTypeDefByName - getTypeDefByName
     *
     * Get type definition by it's name
     */
    "getTypeDefByName"(
      parameters?: Parameters<Paths.GetTypeDefByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetTypeDefByName.Responses.$200>;
    /**
     * deleteAtlasTypeByName - deleteAtlasTypeByName
     *
     * Delete API for type identified by its name.
     */
    "deleteAtlasTypeByName"(
      parameters?: Parameters<Paths.DeleteAtlasTypeByName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getAllTypeDefs - getAllTypeDefs
     *
     * Bulk retrieval API for retrieving all type definitions in Atlas
     */
    "getAllTypeDefs"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetAllTypeDefs.Responses.$200>;
    /**
     * updateAtlasTypeDefs - updateAtlasTypeDefs
     *
     * Bulk update API for all types, changes detected in the type definitions would be persisted
     */
    "updateAtlasTypeDefs"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateAtlasTypeDefs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateAtlasTypeDefs.Responses.$200>;
    /**
     * createAtlasTypeDefs - createAtlasTypeDefs
     *
     * Bulk create APIs for all atlas type definitions, only new definitions will be created.
     * Any changes to the existing definitions will be discarded
     */
    "createAtlasTypeDefs"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateAtlasTypeDefs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateAtlasTypeDefs.Responses.$200>;
    /**
     * deleteAtlasTypeDefs - deleteAtlasTypeDefs
     *
     * Bulk delete API for all types
     */
    "deleteAtlasTypeDefs"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.DeleteAtlasTypeDefs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * getTypeDefHeaders - getTypeDefHeaders
     *
     * Bulk retrieval API for all type definitions returned as a list of minimal information header
     */
    "getTypeDefHeaders"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetTypeDefHeaders.Responses.$200>;
  }
  
  export interface PathsDictionary {
    ["/v2/search/attribute"]: {
      /**
       * searchUsingAttribute - searchUsingAttribute
       *
       * Retrieve data for the specified attribute search query
       */
      "get"(
        parameters?: Parameters<Paths.SearchUsingAttribute.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.SearchUsingAttribute.Responses.$200>;
    };
    ["/v2/search/basic"]: {
      /**
       * searchUsingBasic - searchUsingBasic
       *
       * Retrieve data for the specified fulltext query
       */
      "get"(
        parameters?: Parameters<Paths.SearchUsingBasic.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.SearchUsingBasic.Responses.$200>;
      /**
       * searchWithParameters - searchWithParameters
       *
       * Attribute based search for entities satisfying the search parameters
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.SearchWithParameters.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.SearchWithParameters.Responses.$200>;
    };
    ["/v2/search/dsl"]: {
      /**
       * searchUsingDSL - searchUsingDSL
       *
       * Retrieve data for the specified DSL
       */
      "get"(
        parameters?: Parameters<Paths.SearchUsingDSL.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.SearchUsingDSL.Responses.$200>;
    };
    ["/v2/search/fulltext"]: {
      /**
       * searchUsingFullText - searchUsingFullText
       *
       * Retrieve data for the specified fulltext query
       */
      "get"(
        parameters?: Parameters<Paths.SearchUsingFullText.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.SearchUsingFullText.Responses.$200>;
    };
    ["/v2/search/quick"]: {
      /**
       * quickSearch - quickSearch
       *
       * Attribute based search for entities satisfying the search parameters
       */
      "get"(
        parameters?: Parameters<Paths.QuickSearch.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.QuickSearch.Responses.$200>;
      /**
       * quickSearch2 - quickSearch2
       *
       * Attribute based search for entities satisfying the search parameters
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.QuickSearch2.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.QuickSearch2.Responses.$200>;
    };
    ["/v2/search/relationship"]: {
      /**
       * searchRelatedEntities - searchRelatedEntities
       *
       * Relationship search to search for related entities satisfying the search parameters
       */
      "get"(
        parameters?: Parameters<Paths.SearchRelatedEntities.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.SearchRelatedEntities.Responses.$200>;
    };
    ["/v2/search/saved"]: {
      /**
       * getSavedSearches - getSavedSearches
       */
      "get"(
        parameters?: Parameters<Paths.GetSavedSearches.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetSavedSearches.Responses.$200>;
      /**
       * addSavedSearch - addSavedSearch
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.AddSavedSearch.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.AddSavedSearch.Responses.$201>;
      /**
       * updateSavedSearch - updateSavedSearch
       */
      "put"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.UpdateSavedSearch.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.UpdateSavedSearch.Responses.$204>;
    };
    ["/v2/search/saved/execute/guid/{guid}"]: {
      /**
       * executeSavedSearchByGuid - executeSavedSearchByGuid
       *
       * Attribute based search for entities satisfying the search parameters
       */
      "get"(
        parameters?: Parameters<Paths.ExecuteSavedSearchByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.ExecuteSavedSearchByGuid.Responses.$200>;
    };
    ["/v2/search/saved/execute/{name}"]: {
      /**
       * executeSavedSearchByName - executeSavedSearchByName
       *
       * Attribute based search for entities satisfying the search parameters
       */
      "get"(
        parameters?: Parameters<
          Paths.ExecuteSavedSearchByName.PathParameters &
          Paths.ExecuteSavedSearchByName.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.ExecuteSavedSearchByName.Responses.$200>;
    };
    ["/v2/search/saved/{guid}"]: {
      /**
       * deleteSavedSearch - deleteSavedSearch
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteSavedSearch.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/search/saved/{name}"]: {
      /**
       * getSavedSearch - getSavedSearch
       */
      "get"(
        parameters?: Parameters<
          Paths.GetSavedSearch.PathParameters &
          Paths.GetSavedSearch.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetSavedSearch.Responses.$200>;
    };
    ["/v2/search/suggestions"]: {
      /**
       * getSuggestions - getSuggestions
       */
      "get"(
        parameters?: Parameters<Paths.GetSuggestions.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetSuggestions.Responses.$200>;
    };
    ["/v2/entity"]: {
      /**
       * createOrUpdate - createOrUpdate
       *
       * Create new entity or update existing entity in Atlas.
       * Existing entity is matched using its unique guid if supplied or by its unique attributes eg: qualifiedName
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateOrUpdate.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateOrUpdate.Responses.$201>;
    };
    ["/v2/entity/bulk"]: {
      /**
       * deleteByGuids - deleteByGuids
       *
       * Bulk API to delete list of entities identified by its GUIDs
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteByGuids.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.DeleteByGuids.Responses.$204>;
      /**
       * getByGuids - getByGuids
       *
       * Bulk API to retrieve list of entities identified by its GUIDs.
       */
      "get"(
        parameters?: Parameters<Paths.GetByGuids.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetByGuids.Responses.$200>;
      /**
       * createOrUpdate1 - createOrUpdate1
       *
       * Bulk API to create new entities or updates existing entities in Atlas.
       * Existing entity is matched using its unique guid if supplied or by its unique attributes eg: qualifiedName
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateOrUpdate1.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateOrUpdate1.Responses.$201>;
    };
    ["/v2/entity/bulk/classification"]: {
      /**
       * addClassification - addClassification
       *
       * Bulk API to associate a tag to multiple entities
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.AddClassification.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/bulk/headers"]: {
      /**
       * getEntityHeaders - getEntityHeaders
       */
      "get"(
        parameters?: Parameters<Paths.GetEntityHeaders.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/bulk/setClassifications"]: {
      /**
       * setClassifications - setClassifications
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/bulk/uniqueAttribute/type/{typeName}"]: {
      /**
       * getEntitiesByUniqueAttributes - getEntitiesByUniqueAttributes
       *
       * Bulk API to retrieve list of entities identified by its unique attributes.
       *
       * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
       *
       * typeName=<typeName>&attr_1:<attrName>=<attrValue>&attr_2:<attrName>=<attrValue>&attr_3:<attrName>=<attrValue>
       *
       * NOTE: The attrName should be an unique attribute for the given entity-type
       *
       * The REST request would look something like this
       *
       * GET /v2/entity/bulk/uniqueAttribute/type/hive_db?attr_0:qualifiedName=db1@cl1&attr_2:qualifiedName=db2@cl1
       */
      "get"(
        parameters?: Parameters<
          Paths.GetEntitiesByUniqueAttributes.PathParameters &
          Paths.GetEntitiesByUniqueAttributes.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEntitiesByUniqueAttributes.Responses.$200>;
    };
    ["/v2/entity/businessmetadata/import"]: {
      /**
       * importBMAttributes - importBMAttributes
       *
       * Upload the file for creating Business Metadata in BULK
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.ImportBMAttributes.Responses.$200>;
    };
    ["/v2/entity/businessmetadata/import/template"]: {
      /**
       * produceTemplate - produceTemplate
       *
       * Get the sample Template for uploading/creating bulk BusinessMetaData
       */
      "get"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/guid/{guid}"]: {
      /**
       * deleteByGuid - deleteByGuid
       *
       * Delete an entity identified by its GUID.
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.DeleteByGuid.Responses.$204>;
      /**
       * getById - getById
       *
       * Fetch complete definition of an entity given its GUID.
       */
      "get"(
        parameters?: Parameters<
          Paths.GetById.PathParameters & Paths.GetById.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetById.Responses.$200>;
      /**
       * partialUpdateEntityAttrByGuid - partialUpdateEntityAttrByGuid
       *
       * Entity Partial Update - Add/Update entity attribute identified by its GUID.
       * Supports only uprimitive attribute type and entity references.
       * does not support updation of complex types like arrays, maps
       * Null updates are not possible
       */
      "put"(
        parameters?: Parameters<
          Paths.PartialUpdateEntityAttrByGuid.PathParameters &
          Paths.PartialUpdateEntityAttrByGuid.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.PartialUpdateEntityAttrByGuid.Responses.$204>;
    };
    ["/v2/entity/guid/{guid}/businessmetadata"]: {
      /**
       * removeBusinessAttributes - removeBusinessAttributes
       */
      "delete"(
        parameters?: Parameters<Paths.RemoveBusinessAttributes.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * addOrUpdateBusinessAttributes - addOrUpdateBusinessAttributes
       */
      "post"(
        parameters?: Parameters<
          Paths.AddOrUpdateBusinessAttributes.PathParameters &
          Paths.AddOrUpdateBusinessAttributes.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/guid/{guid}/businessmetadata/{bmName}"]: {
      /**
       * DeleteremoveBusinessAttributes - removeBusinessAttributes
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteremoveBusinessAttributes.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * PostaddOrUpdateBusinessAttributes - addOrUpdateBusinessAttributes
       */
      "post"(
        parameters?: Parameters<Paths.PostaddOrUpdateBusinessAttributes.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/guid/{guid}/classification/{classificationName}"]: {
      /**
       * deleteClassification - deleteClassification
       *
       * Deletes a given classification from an existing entity represented by a guid.
       */
      "delete"(
        parameters?: Parameters<
          Paths.DeleteClassification.PathParameters &
          Paths.DeleteClassification.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getClassification - getClassification
       *
       * Gets the list of classifications for a given entity represented by a guid.
       */
      "get"(
        parameters?: Parameters<Paths.GetClassification.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetClassification.Responses.$200>;
    };
    ["/v2/entity/guid/{guid}/classifications"]: {
      /**
       * getClassifications - getClassifications
       *
       * Gets the list of classifications for a given entity represented by a guid.
       */
      "get"(
        parameters?: Parameters<Paths.GetClassifications.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetClassifications.Responses.$200>;
      /**
       * addClassifications - addClassifications
       *
       * Adds classifications to an existing entity represented by a guid.
       */
      "post"(
        parameters?: Parameters<Paths.AddClassifications.PathParameters> | null,
        data?: Paths.AddClassifications.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * updateClassifications - updateClassifications
       *
       * Updates classifications to an existing entity represented by a guid.
       */
      "put"(
        parameters?: Parameters<Paths.UpdateClassifications.PathParameters> | null,
        data?: Paths.UpdateClassifications.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/guid/{guid}/header"]: {
      /**
       * getHeaderById - getHeaderById
       *
       * Get entity header given its GUID.
       */
      "get"(
        parameters?: Parameters<Paths.GetHeaderById.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetHeaderById.Responses.$200>;
    };
    ["/v2/entity/guid/{guid}/labels"]: {
      /**
       * removeLabels - removeLabels
       *
       * delete given labels to a given entity
       */
      "delete"(
        parameters?: Parameters<Paths.RemoveLabels.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * setLabels - setLabels
       *
       * Set labels to a given entity
       */
      "post"(
        parameters?: Parameters<Paths.SetLabels.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * addLabels - addLabels
       *
       * add given labels to a given entity
       */
      "put"(
        parameters?: Parameters<Paths.AddLabels.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/uniqueAttribute/type/{typeName}"]: {
      /**
       * deleteByUniqueAttribute - deleteByUniqueAttribute
       *
       * Delete an entity identified by its type and unique attributes.
       *
       * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
       *
       * attr:<attrName>=<attrValue>
       *
       * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
       *
       * The REST request would look something like this
       *
       * DELETE /v2/entity/uniqueAttribute/type/aType?attr:aTypeAttribute=someValue
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteByUniqueAttribute.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.DeleteByUniqueAttribute.Responses.$204>;
      /**
       * getByUniqueAttributes - getByUniqueAttributes
       *
       * Fetch complete definition of an entity given its type and unique attribute.
       *
       * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
       *
       * attr:<attrName>=<attrValue>
       *
       * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
       *
       * The REST request would look something like this
       *
       * GET /v2/entity/uniqueAttribute/type/aType?attr:aTypeAttribute=someValue
       */
      "get"(
        parameters?: Parameters<
          Paths.GetByUniqueAttributes.PathParameters &
          Paths.GetByUniqueAttributes.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetByUniqueAttributes.Responses.$200>;
      /**
       * partialUpdateEntityByUniqueAttrs - partialUpdateEntityByUniqueAttrs
       *
       * Entity Partial Update - Allows a subset of attributes to be updated on
       * an entity which is identified by its type and unique attribute  eg: Referenceable.qualifiedName.
       * Null updates are not possible
       *
       * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
       *
       * attr:<attrName>=<attrValue>
       *
       * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
       *
       * The REST request would look something like this
       *
       * PUT /v2/entity/uniqueAttribute/type/aType?attr:aTypeAttribute=someValue
       */
      "put"(
        parameters?: Parameters<Paths.PartialUpdateEntityByUniqueAttrs.PathParameters> | null,
        data?: Paths.PartialUpdateEntityByUniqueAttrs.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.PartialUpdateEntityByUniqueAttrs.Responses.$204>;
    };
    ["/v2/entity/uniqueAttribute/type/{typeName}/classification/{classificationName}"]: {
      /**
       * deleteClassificationByUniqueAttribute - deleteClassificationByUniqueAttribute
       *
       * Deletes a given classification from an entity identified by its type and unique attributes.
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteClassificationByUniqueAttribute.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/uniqueAttribute/type/{typeName}/classifications"]: {
      /**
       * addClassificationsByUniqueAttribute - addClassificationsByUniqueAttribute
       *
       * Adds classification to the entity identified by its type and unique attributes.
       */
      "post"(
        parameters?: Parameters<Paths.AddClassificationsByUniqueAttribute.PathParameters> | null,
        data?: Paths.AddClassificationsByUniqueAttribute.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * updateClassificationsByUniqueAttribute - updateClassificationsByUniqueAttribute
       *
       * Updates classification on an entity identified by its type and unique attributes.
       */
      "put"(
        parameters?: Parameters<Paths.UpdateClassificationsByUniqueAttribute.PathParameters> | null,
        data?: Paths.UpdateClassificationsByUniqueAttribute.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/uniqueAttribute/type/{typeName}/header"]: {
      /**
       * getEntityHeaderByUniqueAttributes - getEntityHeaderByUniqueAttributes
       *
       * Fetch AtlasEntityHeader given its type and unique attribute.
       *
       * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
       *
       * attr:<attrName>=<attrValue>
       *
       * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
       *
       * The REST request would look something like this
       *
       * GET /v2/entity/uniqueAttribute/type/aType/header?attr:aTypeAttribute=someValue
       */
      "get"(
        parameters?: Parameters<Paths.GetEntityHeaderByUniqueAttributes.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEntityHeaderByUniqueAttributes.Responses.$200>;
    };
    ["/v2/entity/uniqueAttribute/type/{typeName}/labels"]: {
      /**
       * DeleteremoveLabels - removeLabels
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteremoveLabels.PathParameters> | null,
        data?: Paths.DeleteremoveLabels.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * PostsetLabels - setLabels
       */
      "post"(
        parameters?: Parameters<Paths.PostsetLabels.PathParameters> | null,
        data?: Paths.PostsetLabels.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * PutaddLabels - addLabels
       */
      "put"(
        parameters?: Parameters<Paths.PutaddLabels.PathParameters> | null,
        data?: Paths.PutaddLabels.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/entity/{guid}/audit"]: {
      /**
       * getAuditEvents - getAuditEvents
       */
      "get"(
        parameters?: Parameters<
          Paths.GetAuditEvents.PathParameters &
          Paths.GetAuditEvents.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetAuditEvents.Responses.$200>;
    };
    ["/v2/glossary"]: {
      /**
       * getGlossaries - getGlossaries
       *
       * Retrieve all glossaries registered with Atlas
       */
      "get"(
        parameters?: Parameters<Paths.GetGlossaries.QueryParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaries.Responses.$200>;
      /**
       * createGlossary - createGlossary
       *
       * Create a glossary
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateGlossary.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateGlossary.Responses.$200>;
    };
    ["/v2/glossary/categories"]: {
      /**
       * createGlossaryCategories - createGlossaryCategories
       *
       * Create glossary category in bulk
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateGlossaryCategories.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateGlossaryCategories.Responses.$200>;
    };
    ["/v2/glossary/category"]: {
      /**
       * createGlossaryCategory - createGlossaryCategory
       *
       * Create glossary category
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateGlossaryCategory.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateGlossaryCategory.Responses.$200>;
    };
    ["/v2/glossary/category/{categoryGuid}"]: {
      /**
       * deleteGlossaryCategory - deleteGlossaryCategory
       *
       * Delete a glossary category
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteGlossaryCategory.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getGlossaryCategory - getGlossaryCategory
       *
       * Get specific glossary category
       */
      "get"(
        parameters?: Parameters<Paths.GetGlossaryCategory.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaryCategory.Responses.$200>;
      /**
       * updateGlossaryCategory - updateGlossaryCategory
       *
       * Update the given glossary category
       */
      "put"(
        parameters?: Parameters<Paths.UpdateGlossaryCategory.PathParameters> | null,
        data?: Paths.UpdateGlossaryCategory.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.UpdateGlossaryCategory.Responses.$200>;
    };
    ["/v2/glossary/category/{categoryGuid}/partial"]: {
      /**
       * partialUpdateGlossaryCategory - partialUpdateGlossaryCategory
       *
       * Partially update the glossary category
       */
      "put"(
        parameters?: Parameters<Paths.PartialUpdateGlossaryCategory.PathParameters> | null,
        data?: Paths.PartialUpdateGlossaryCategory.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.PartialUpdateGlossaryCategory.Responses.$200>;
    };
    ["/v2/glossary/category/{categoryGuid}/related"]: {
      /**
       * getRelatedCategories - getRelatedCategories
       *
       * Get all related categories (parent and children)
       */
      "get"(
        parameters?: Parameters<
          Paths.GetRelatedCategories.PathParameters &
          Paths.GetRelatedCategories.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetRelatedCategories.Responses.$200>;
    };
    ["/v2/glossary/category/{categoryGuid}/terms"]: {
      /**
       * getCategoryTerms - getCategoryTerms
       *
       * Get all terms associated with the specific category
       */
      "get"(
        parameters?: Parameters<
          Paths.GetCategoryTerms.PathParameters &
          Paths.GetCategoryTerms.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetCategoryTerms.Responses.$200>;
    };
    ["/v2/glossary/import"]: {
      /**
       * importGlossaryData - importGlossaryData
       *
       * Upload glossary file for creating AtlasGlossaryTerms in bulk
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.ImportGlossaryData.Responses.$200>;
    };
    ["/v2/glossary/import/template"]: {
      /**
       * produceTemplate2 - produceTemplate2
       *
       * Get sample template for uploading/creating bulk AtlasGlossaryTerm
       */
      "get"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/glossary/term"]: {
      /**
       * createGlossaryTerm - createGlossaryTerm
       *
       * Create a glossary term
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateGlossaryTerm.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateGlossaryTerm.Responses.$200>;
    };
    ["/v2/glossary/term/{termGuid}"]: {
      /**
       * deleteGlossaryTerm - deleteGlossaryTerm
       *
       * Delete a glossary term
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteGlossaryTerm.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getGlossaryTerm - getGlossaryTerm
       *
       * Get specific glossary term
       */
      "get"(
        parameters?: Parameters<Paths.GetGlossaryTerm.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaryTerm.Responses.$200>;
      /**
       * updateGlossaryTerm - updateGlossaryTerm
       *
       * Update the given glossary term
       */
      "put"(
        parameters?: Parameters<Paths.UpdateGlossaryTerm.PathParameters> | null,
        data?: Paths.UpdateGlossaryTerm.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.UpdateGlossaryTerm.Responses.$200>;
    };
    ["/v2/glossary/term/{termGuid}/partial"]: {
      /**
       * partialUpdateGlossaryTerm - partialUpdateGlossaryTerm
       *
       * Partially update the glossary term
       */
      "put"(
        parameters?: Parameters<Paths.PartialUpdateGlossaryTerm.PathParameters> | null,
        data?: Paths.PartialUpdateGlossaryTerm.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.PartialUpdateGlossaryTerm.Responses.$200>;
    };
    ["/v2/glossary/terms"]: {
      /**
       * createGlossaryTerms - createGlossaryTerms
       *
       * Create glossary terms in bulk
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateGlossaryTerms.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateGlossaryTerms.Responses.$200>;
    };
    ["/v2/glossary/terms/{termGuid}/assignedEntities"]: {
      /**
       * removeTermAssignmentFromEntities - removeTermAssignmentFromEntities
       *
       * Remove the term assignment for the given list of entity headers
       */
      "delete"(
        parameters?: Parameters<Paths.RemoveTermAssignmentFromEntities.PathParameters> | null,
        data?: Paths.RemoveTermAssignmentFromEntities.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getEntitiesAssignedWithTerm - getEntitiesAssignedWithTerm
       *
       * Get all entity headers assigned with the specified term
       */
      "get"(
        parameters?: Parameters<
          Paths.GetEntitiesAssignedWithTerm.PathParameters &
          Paths.GetEntitiesAssignedWithTerm.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEntitiesAssignedWithTerm.Responses.$200>;
      /**
       * assignTermToEntities - assignTermToEntities
       *
       * Assign the given term to the provided list of entity headers
       */
      "post"(
        parameters?: Parameters<Paths.AssignTermToEntities.PathParameters> | null,
        data?: Paths.AssignTermToEntities.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * disassociateTermAssignmentFromEntities - disassociateTermAssignmentFromEntities
       *
       * Remove the term assignment for the given list of entity headers
       */
      "put"(
        parameters?: Parameters<Paths.DisassociateTermAssignmentFromEntities.PathParameters> | null,
        data?: Paths.DisassociateTermAssignmentFromEntities.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/glossary/terms/{termGuid}/related"]: {
      /**
       * getRelatedTerms - getRelatedTerms
       *
       * Get all related terms for a specific term
       */
      "get"(
        parameters?: Parameters<
          Paths.GetRelatedTerms.PathParameters &
          Paths.GetRelatedTerms.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetRelatedTerms.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}"]: {
      /**
       * deleteGlossary - deleteGlossary
       *
       * Delete a glossary
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteGlossary.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getGlossary - getGlossary
       *
       * Get a specific Glossary
       */
      "get"(
        parameters?: Parameters<Paths.GetGlossary.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossary.Responses.$200>;
      /**
       * updateGlossary - updateGlossary
       *
       * Update the given glossary
       */
      "put"(
        parameters?: Parameters<Paths.UpdateGlossary.PathParameters> | null,
        data?: Paths.UpdateGlossary.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.UpdateGlossary.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}/categories"]: {
      /**
       * getGlossaryCategories - getGlossaryCategories
       *
       * Get the categories belonging to a specific glossary
       */
      "get"(
        parameters?: Parameters<
          Paths.GetGlossaryCategories.PathParameters &
          Paths.GetGlossaryCategories.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaryCategories.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}/categories/headers"]: {
      /**
       * getGlossaryCategoriesHeaders - getGlossaryCategoriesHeaders
       *
       * Get the categories belonging to a specific glossary
       */
      "get"(
        parameters?: Parameters<
          Paths.GetGlossaryCategoriesHeaders.PathParameters &
          Paths.GetGlossaryCategoriesHeaders.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaryCategoriesHeaders.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}/detailed"]: {
      /**
       * getDetailedGlossary - getDetailedGlossary
       *
       * Get a specific Glossary
       */
      "get"(
        parameters?: Parameters<Paths.GetDetailedGlossary.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetDetailedGlossary.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}/partial"]: {
      /**
       * partialUpdateGlossary - partialUpdateGlossary
       *
       * Partially update the glossary
       */
      "put"(
        parameters?: Parameters<Paths.PartialUpdateGlossary.PathParameters> | null,
        data?: Paths.PartialUpdateGlossary.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.PartialUpdateGlossary.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}/terms"]: {
      /**
       * getGlossaryTerms - getGlossaryTerms
       *
       * Get terms belonging to a specific glossary
       */
      "get"(
        parameters?: Parameters<
          Paths.GetGlossaryTerms.PathParameters &
          Paths.GetGlossaryTerms.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaryTerms.Responses.$200>;
    };
    ["/v2/glossary/{glossaryGuid}/terms/headers"]: {
      /**
       * getGlossaryTermHeaders - getGlossaryTermHeaders
       *
       * Get term headers belonging to a specific glossary
       */
      "get"(
        parameters?: Parameters<
          Paths.GetGlossaryTermHeaders.PathParameters &
          Paths.GetGlossaryTermHeaders.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetGlossaryTermHeaders.Responses.$200>;
    };
    ["/v2/lineage/uniqueAttribute/type/{typeName}"]: {
      /**
       * getLineageByUniqueAttribute - getLineageByUniqueAttribute
       *
       * Returns lineage info about entity.
       *
       * In addition to the typeName path parameter, attribute key-value pair(s) can be provided in the following format
       *
       * attr:<attrName>=<attrValue>
       *
       * NOTE: The attrName and attrValue should be unique across entities, eg. qualifiedName
       */
      "get"(
        parameters?: Parameters<
          Paths.GetLineageByUniqueAttribute.PathParameters &
          Paths.GetLineageByUniqueAttribute.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/lineage/{guid}"]: {
      /**
       * getLineageGraph - getLineageGraph
       *
       * Returns lineage info about entity.
       */
      "get"(
        parameters?: Parameters<
          Paths.GetLineageGraph.PathParameters &
          Paths.GetLineageGraph.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetLineageGraph.Responses.$200>;
    };
    ["/v2/relationship"]: {
      /**
       * create - create
       *
       * Create a new relationship between entities.
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.Create.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.Create.Responses.$201>;
      /**
       * update - update
       *
       * Update an existing relationship between entities.
       */
      "put"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.Update.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.Update.Responses.$204>;
    };
    ["/v2/relationship/guid/{guid}"]: {
      /**
       * deleteById - deleteById
       *
       * Delete a relationship between entities using guid.
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteById.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getById2 - getById2
       *
       * Get relationship information between entities using guid.
       */
      "get"(
        parameters?: Parameters<
          Paths.GetById2.PathParameters & Paths.GetById2.QueryParameters
        > | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetById2.Responses.$200>;
    };
    ["/v2/types/businessmetadatadef/guid/{guid}"]: {
      /**
       * getBusinessMetadataDefByGuid - getBusinessMetadataDefByGuid
       *
       * Get the businessMetadata definition for the given guid
       */
      "get"(
        parameters?: Parameters<Paths.GetBusinessMetadataDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetBusinessMetadataDefByGuid.Responses.$200>;
    };
    ["/v2/types/businessmetadatadef/name/{name}"]: {
      /**
       * getBusinessMetadataDefByName - getBusinessMetadataDefByName
       *
       * Get the businessMetadata definition by it's name (unique)
       */
      "get"(
        parameters?: Parameters<Paths.GetBusinessMetadataDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetBusinessMetadataDefByName.Responses.$200>;
    };
    ["/v2/types/classificationdef/guid/{guid}"]: {
      /**
       * getClassificationDefByGuid - getClassificationDefByGuid
       *
       * Get the classification definition for the given guid
       */
      "get"(
        parameters?: Parameters<Paths.GetClassificationDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetClassificationDefByGuid.Responses.$200>;
    };
    ["/v2/types/classificationdef/name/{name}"]: {
      /**
       * getClassificationDefByName - getClassificationDefByName
       *
       * Get the classification definition by it's name (unique)
       */
      "get"(
        parameters?: Parameters<Paths.GetClassificationDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetClassificationDefByName.Responses.$200>;
    };
    ["/v2/types/entitydef/guid/{guid}"]: {
      /**
       * getEntityDefByGuid - getEntityDefByGuid
       *
       * Get the Entity definition for the given guid
       */
      "get"(
        parameters?: Parameters<Paths.GetEntityDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEntityDefByGuid.Responses.$200>;
    };
    ["/v2/types/entitydef/name/{name}"]: {
      /**
       * getEntityDefByName - getEntityDefByName
       *
       * Get the entity definition by it's name (unique)
       */
      "get"(
        parameters?: Parameters<Paths.GetEntityDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEntityDefByName.Responses.$200>;
    };
    ["/v2/types/enumdef/guid/{guid}"]: {
      /**
       * getEnumDefByGuid - getEnumDefByGuid
       *
       * Get the enum definition for the given guid
       */
      "get"(
        parameters?: Parameters<Paths.GetEnumDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEnumDefByGuid.Responses.$200>;
    };
    ["/v2/types/enumdef/name/{name}"]: {
      /**
       * getEnumDefByName - getEnumDefByName
       *
       * Get the enum definition by it's name (unique)
       */
      "get"(
        parameters?: Parameters<Paths.GetEnumDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetEnumDefByName.Responses.$200>;
    };
    ["/v2/types/relationshipdef/guid/{guid}"]: {
      /**
       * getRelationshipDefByGuid - getRelationshipDefByGuid
       *
       * Get the relationship definition for the given guid
       */
      "get"(
        parameters?: Parameters<Paths.GetRelationshipDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetRelationshipDefByGuid.Responses.$200>;
    };
    ["/v2/types/relationshipdef/name/{name}"]: {
      /**
       * getRelationshipDefByName - getRelationshipDefByName
       *
       * Get the relationship definition by it's name (unique)
       */
      "get"(
        parameters?: Parameters<Paths.GetRelationshipDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetRelationshipDefByName.Responses.$200>;
    };
    ["/v2/types/structdef/guid/{guid}"]: {
      /**
       * getStructDefByGuid - getStructDefByGuid
       *
       * Get the struct definition for the given guid
       */
      "get"(
        parameters?: Parameters<Paths.GetStructDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetStructDefByGuid.Responses.$200>;
    };
    ["/v2/types/structdef/name/{name}"]: {
      /**
       * getStructDefByName - getStructDefByName
       *
       * Get the struct definition by it's name (unique)
       */
      "get"(
        parameters?: Parameters<Paths.GetStructDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetStructDefByName.Responses.$200>;
    };
    ["/v2/types/typedef/guid/{guid}"]: {
      /**
       * getTypeDefByGuid - getTypeDefByGuid
       */
      "get"(
        parameters?: Parameters<Paths.GetTypeDefByGuid.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetTypeDefByGuid.Responses.$200>;
    };
    ["/v2/types/typedef/name/{name}"]: {
      /**
       * getTypeDefByName - getTypeDefByName
       *
       * Get type definition by it's name
       */
      "get"(
        parameters?: Parameters<Paths.GetTypeDefByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetTypeDefByName.Responses.$200>;
    };
    ["/v2/types/typedef/name/{typeName}"]: {
      /**
       * deleteAtlasTypeByName - deleteAtlasTypeByName
       *
       * Delete API for type identified by its name.
       */
      "delete"(
        parameters?: Parameters<Paths.DeleteAtlasTypeByName.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
    };
    ["/v2/types/typedefs"]: {
      /**
       * deleteAtlasTypeDefs - deleteAtlasTypeDefs
       *
       * Bulk delete API for all types
       */
      "delete"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.DeleteAtlasTypeDefs.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<any>;
      /**
       * getAllTypeDefs - getAllTypeDefs
       *
       * Bulk retrieval API for retrieving all type definitions in Atlas
       */
      "get"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetAllTypeDefs.Responses.$200>;
      /**
       * createAtlasTypeDefs - createAtlasTypeDefs
       *
       * Bulk create APIs for all atlas type definitions, only new definitions will be created.
       * Any changes to the existing definitions will be discarded
       */
      "post"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.CreateAtlasTypeDefs.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.CreateAtlasTypeDefs.Responses.$200>;
      /**
       * updateAtlasTypeDefs - updateAtlasTypeDefs
       *
       * Bulk update API for all types, changes detected in the type definitions would be persisted
       */
      "put"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.UpdateAtlasTypeDefs.RequestBody,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.UpdateAtlasTypeDefs.Responses.$200>;
    };
    ["/v2/types/typedefs/headers"]: {
      /**
       * getTypeDefHeaders - getTypeDefHeaders
       *
       * Bulk retrieval API for all type definitions returned as a list of minimal information header
       */
      "get"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
      ): OperationResponse<Paths.GetTypeDefHeaders.Responses.$200>;
    };
  }
  
  export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;