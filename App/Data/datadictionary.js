/**
 * class used for data definitions
 */

export default class DD {
  static product = [
    'id',
    'code',
    'description',
    'image_small',
    'name'
  ]
  static productDetail = [
    'id',
    'code',
    'description',
    'description_sale',
    'image_small',
    'name',
    'information'
  ]
  static commissionSummary = [
    'display_name',
    'id', 'start_date',
    'end_date', 'amount',
    'points',
    'sales_agent',
    'id'
  ]
}
