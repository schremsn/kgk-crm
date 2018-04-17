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
}
