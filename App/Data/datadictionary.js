/**
 * class used for data definitions
 */

export default class DD {
  static product = [
    'id',
    'code',
    'description',
    'image_small',
    'name',
  ]
  static productDetail = [
    'id',
    'code',
    'description',
    'description_sale',
    'image_small',
    'name',
    'information',
  ]
  static commissionSummary = [
    'display_name',
    'id',
    'start_date',
    'end_date',
    'amount',
    'points',
    'sales_agent',
  ]
  static commissionDetail = [
    'id',
    'calc_datetime',
    'sales_agent',
    'product',
    'commission_group',
    'commission_scheme',
    'commission_tier',
    'type',
    'rate',
    'amount',
    'points',
  ]

  static commissionStatus = [
    'identifier',
    'partner',
    'customer',
    'product',
    'product_category',
    'issue',
    'create_date',
    'phone',
    'mobile',
    'notes',
    'sales_agent',
    'amount',
    'update_date',
    'detail',
    'id',
  ]
  static commissionStatusDetail = [
    'id',
    'status_date',
    'status',
    'changed_by',
    'notes',
  ]

  static mailChannel = [
    'id',
    'name',
    'description',
  ]

  static leadDetail = [
    'contact_name',
    'name',
    'title_action',
    'phone',
    'partner_name',
    'mobile',
    'city',
    'type',
    'email_from',
    'id',
    'description',
    'lost_reason',
    'zip',
    'street',
    'street2',
    'function',
    'stage_id',
    'tag_ids',
    'probability',
    'product',
    'external_status',
  ]

  static customer = ['company_name', 'name', 'city', 'mobile', 'phone', 'id']

  static customerDetail = [
    'name',
    'city',
    'mobile',
    'phone',
    'id',
    'email',
    'comment',
    'contact_address',
    'is_company',
    'street',
    'street2',
    'website',
    'zip',
    'state',
    'identification_id',
  ]

  static lead = [
    'contact_name',
    'name',
    'title_action',
    'phone',
    'partner_name',
    'city',
    'type',
    'email_from',
    'id',
    'date_deadline',
  ]

  static dashboard = {
    meeting: {
      today: 0,
      next_7_days: 0,
    },
    activity: {
      today: 0,
      overdue: 0,
      next_7_days: 0,
    },
    closing: {
      today: 0,
      overdue: 0,
      next_7_days: 0,
    },
    done: {
      this_month: 0,
      last_month: 0,
    },
    won: {
      this_month: 0,
      last_month: 0,
    },
  }

  static message = [
    'email_from',
    'date',
    'needaction',
    'channel_ids',
    'id',
    'body',
  ]

  static leadStage = [
    'id',
    'name',
    'sequence',
  ]

  static reason = [
    'id',
    'name',
  ]
}
