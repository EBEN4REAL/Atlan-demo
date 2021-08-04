export type RequestAction = 'approved' | 'rejected'

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
    message: string
}

export interface RequestAttributes {
    id: string
    version: string
    is_active: boolean
    created_at: Date
    updated_at: Date
    created_by: string
    updated_by: string
    tenant_id: string
    source_type: 'static' | 'atlas'
    source_guid: string
    source_qf_name: string
    source_attribute: string
    destination_guid: string
    destination_qf_name: string
    destination_attribute: string
    destination_value: string
    entity_type: string
    re: string
    confidence_score: number
    bot_run_id: string
    approved_by: IActionDetails[]
    rejected_by: IActionDetails[]
    status: 'approved' | 'rejected' | 'active'
    message: string
    requests_batch: string
    approval_type: string
    assigned_approvers: IAssignedApprovers[]
    payload: any
    access_start_date: Date
    access_end_date: Date
}
