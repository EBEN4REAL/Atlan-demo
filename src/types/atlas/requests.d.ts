export type RequestAction = 'approved' | 'rejected'
export type RequestType =
    | 'attribute'
    | 'bm_attribute'
    | 'create_typedef'
    | 'create_glossary'
    | 'create_category'
    | 'create_term'
    | 'term_link'
    | 'attach_classification'

export type RequestStatus = 'approved' | 'rejected' | 'active'

export interface IActionDetails {
    message: string
    timestamp: Date
    userId: string
}

export interface IAssignedApprovers {
    type: 'user' | 'group'
    userId: string
}

export interface IRequestActionBody {
    action: RequestAction
    message?: string
}

export interface RequestAttributes {
    id: string
    version: string
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: Record<string, any>
    createdByUser: Record<string, any>
    updated_by: string
    tenant_id: string
    source_type: 'static' | 'atlas'
    source_guid: string
    source_qf_name: string
    source_attribute: string
    sourceEntity: assetInterface
    destination_guid: string
    destination_qf_name: string
    destination_attribute: string
    destination_value: string
    destinationEntity: assetInterface
    entity_type: string
    re: RequestType
    confidence_score: number
    bot_run_id: string
    approved_by: IActionDetails[]
    rejected_by: IActionDetails[]
    status: RequestStatus
    message: string
    requests_batch: string
    approval_type: string
    assigned_approvers: IAssignedApprovers[]
    payload: any
    access_start_date: Date
    access_end_date: Date
}
