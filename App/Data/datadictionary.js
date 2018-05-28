/**
 * class used for data definitions
 */

export default class DD {
  static get product() {
    return [
      'id',
      'code',
      'description',
      'image_small',
      'name',
    ];
  }

  static get productDetail() {
    return [
      'id',
      'code',
      'description',
      'description_sale',
      'image_small',
      'name',
      'information',
    ];
  }

  static get commissionSummary() {
    return [
      'display_name',
      'id',
      'start_date',
      'end_date',
      'amount',
      'points',
      'sales_agent',
    ];
  }

  static get commissionDetail() {
    return [
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
    ];
  }

  static get commissionStatus() {
    return [
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
    ];
  }

  static get commissionStatusDetail() {
    return [
      'id',
      'status_date',
      'status',
      'changed_by',
      'notes',
    ];
  }

  static get mailChannel() {
    return [
      'id',
      'name',
      'description',
    ];
  }

  static get leadDetail() {
    return [
      'contact_name',
      'name',
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
      'state',
      'street',
      'street2',
      'function',
      'stage_id',
      'tag_ids',
      'product',
      'external_status',
    ];
  }

  static get customer() {
    return ['company_name', 'name', 'city', 'mobile', 'phone', 'id'];
  }

  static get customerDetail() {
    return [
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
    ];
  }

  static get lead() {
    return [
      'contact_name',
      'name',
      'phone',
      'partner_name',
      'city',
      'type',
      'email_from',
      'id',
    ];
  }

  static get dashboard() {
    return {
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
    };
  }

  static get message() {
    return [
      'email_from',
      'date',
      'needaction',
      'channel_ids',
      'id',
      'body',
    ];
  }

  static get leadStage() {
    return [
      'id',
      'name',
      'sequence',
    ];
  }

  static get reason() {
    return [
      'id',
      'name',
    ];
  }

  static get state() {
    return [
      'id',
      'name',
    ];
  }
}
