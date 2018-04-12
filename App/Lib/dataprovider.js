
import Odoo from './odoo'
import Config from './config'
import ReferenceData from '../Data/referencedata'
import DD from '../Data/datadictionary'

/**
 * instance variable for singleton
 */
let instance = null

const maxRecords = 100

export default class DataProvider {
  constructor () {
    if (!instance) {
      const config = Config.server || {}

      this.host = config.host
      this.port = config.port
      this.database = config.database
      instance = this
    } else {
      return instance
    }

    this.context = undefined
  }

  /**
   * returns the instance of the DataProvider singleton
   */
  static getInstance () {
    if (!instance) {
      instance = new DataProvider()
    }
    return instance
  }

  /**
   * log into Odoo using the provided username and password
   * @param {string} username
   * @param {string} password
   */
  login (_username, _password) {
    this.odoo = new Odoo({
      host: this.host,
      port: this.port,
      database: this.database,
      username: _username,
      password: _password
    })

    return new Promise((reject, resolve) => {
      this.odoo.connect((data, err) => {
        if (err) {
          reject(err)
        }
        this.context = this.odoo.context
        resolve(data)
      })
    })
  }

  retry = function (fn, times, delay) {
    return new Promise((resolve, reject) => {
      let error
      let attempt = function () {
        if (times == 0) {
          reject(error)
        } else {
          fn().then(resolve)
            .catch(function (e) {
              times--
              error = e
              setTimeout(function () { attempt() }, delay)
            })
        }
      }
      attempt()
    })
  };

  /**
   * @params {number} optional sepcify the offset to read from
   * get a list of 200 customers
   */
  getCustomers (offset = 0) {
    const params = {
      domain: [['customer', '=', 'true']],
      fields: ['company_name', 'name', 'city', 'mobile', 'phone', 'id'],
      limit: maxRecords,
      offset,
      order: 'name asc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('res.partner', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * returns the customer(s) based on the provided id(s), the parameter can either be a single
   * id or an array of ids
   * @param {*} id
   */
  getCustomer (id) {
    if (!Array.isArray(id)) {
      id = [id]
    }

    const params = {
      ids: id,
      fields: [
        'name',
        'city',
        'mobile',
        'phone',
        'id',
        'email',
        'comment',
        'company_name',
        'contact_address',
        'is_company',
        'street',
        'street2',
        'website',
        'zip',
        'state'
      ]
    }

    return new Promise((resolve, reject) => {
      this.odoo.get('res.partner', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * @deprecated use getCustomers method and specify the offset
   * @param {*} index
   */
  getCustomersBeginIndex (index) {
    const params = {
      domain: [['customer', '=', 'true']],
      fields: ['company_name', 'name', 'city', 'mobile', 'id'],
      limit: 200,
      offset: index
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('res.partner', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve lead based on id(s) provided
   * @param {array} id
   */
  getLead (id) {
    if (id === undefined) {
      throw (new Error('invalid lead id'))
    }
    if (!Array.isArray(id)) {
      id = [id]
    }

    const params = {
      ids: id,
      fields: ['contact_name', 'name', 'title_action', 'phone', 'partner_name', 'mobile', 'city', 'type', 'email_from', 'id', 'description',
        'lost_reason', 'zip', 'street', 'street2', 'function', 'stage_id', 'tag_ids', 'probability', 'date_deadline']
    }

    return new Promise((resolve, reject) => {
      this.odoo.get('crm.lead', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * create a new customer based on the data provided data, which needs to be a dictionary
   * @param {any} customer
   */
  createCustomer (customer) {
    if (customer === undefined) {
      throw (new Error('No customer provided'))
    }
    return new Promise((resolve, reject) => {
      this.odoo.create('res.partner', customer, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * update and existing customer with the provided data (dictionary),
   * customer must include the id of the customer to be updated
   * @param {any} customer
   */
  updateCustomer (customer) {
    if (customer === undefined) {
      throw new Error('Invalid argument')
    } else if (customer.id === undefined) {
      throw new Error('Invalid argument')
    }
    const id = customer.id

    return new Promise((resolve, reject) => {
      this.odoo.update('res.partner', id, customer, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * create a new lead
   * @param {map} lead
   */
  createLead (lead) {
    if (lead === undefined) {
      throw (new Error('Invalid argument'))
    }
    // resolve many-to-many relationship for tags
    const tag = lead.get('tag')
    if (tag) {
      // const temp = Object.freeze([4, tag]);
      const temp = Object.create(null)
      Object.defineProperty(temp, 4, { enumerable: true, configurable: true, get () { return tag } })
      lead.set('tag_ids', temp)
      lead.delete('tag')
    }
    // set default for lead
    lead.set('user_id', this.getUserId())
    lead.set('type', 'opportunity')

    // convert lead map to array
    const newLead = Object.create(null)
    lead.forEach((value, key) => {
      Object.defineProperty(newLead, key, { enumerable: true, configurable: true, get () { return value } })
    })

    console.log(newLead)
    return new Promise((resolve, reject) => {
      this.odoo.create('crm.lead', newLead, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * update lead with the values from the passed dictionary
   * @param {any} lead
   */
  updateLead (lead) {
    if (lead === undefined) {
      throw (new Error('Invalid argument'))
    }

    console.log(typeof (lead))
    const id = lead.id

    return new Promise((resolve, reject) => {
      this.odoo.update('crm.lead', id, lead, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * search for customer, using smartsearch to look in name, phone and city field
   * @param {string} searchTerm
   */
  searchCustomer (searchTerm) {
    if (typeof searchTerm !== 'string') {
      console.log('wrong search term')
    }
    const params = {
      // domain: ['&', '|', '|', ['customer', '=', 'true'], ['name', 'ilike', searchTerm], ['city', 'ilike', searchTerm],
      //  ['phone', 'ilike', searchTerm],],
      domain: [['customer', '=', 'true'], '|', ['name', 'ilike', searchTerm], ['city', 'ilike', searchTerm] ],
      fields: ['company_name', 'name', 'city', 'mobile', 'phone', 'id'],
      limit: 200,
      offset: 0
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('res.partner', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * search for lead, using smartsearch to look in name, phone and city field
   * @param {string} searchTerm
   */
  searchLead (searchTerm) {
    if (typeof searchTerm !== 'string') {
      console.log('wrong search term')
    }
    const params = {
      domain: [['active', '=', 'true'], '|', ['name', 'ilike', searchTerm], ['tag_ids', 'ilike', searchTerm]],
      fields: ['contact_name', 'name', 'title_action', 'phone', 'city', 'type', 'id', 'date_deadline'],
      limit: 200,
      offset: 0
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * @param {number} optional offset to read from
   * retrieve a list of 200 leads
   */
  getLeads (index = 0) {
    const params = {
      domain: [['active', '=', 'true'], ['user_id', '=', this.getUserId()]],
      fields: [
        'contact_name',
        'name',
        'title_action',
        'phone',
        'partner_name',
        'city',
        'type',
        'email_from',
        'id',
        'date_deadline'
      ],
      limit: maxRecords,
      offset: index,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve leads by stage
   * @param {number} stageid
   * @param {number} index
   */
  getLeadbyStage (stageid, index = 0) {
    const params = {
      domain: ['&', ['active', '=', 'true'], ['stage_id', '=', stageid]],
      fields: [
        'contact_name',
        'name',
        'title_action',
        'phone',
        'partner_name',
        'city',
        'email_from',
        'id',
        'type',
        'date_deadline'
      ],
      limit: maxRecords,
      offset: index,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * @deprecated use getLeads method specifiy the offset
   * @param {*} index
   */
  getLeadsBeginIndex (index) {
    const params = {
      domain: [['active', '=', 'true']],
      fields: [
        'contact_name',
        'name',
        'title_action',
        'phone',
        'partner_name',
        'city',
        'type',
        'email_from',
        'id'
      ],
      limit: 20,
      offset: index
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve products
   * @param {number} index
   */
  getProducts (index) {
    const params = {
      domain: [['active', '=', 'true'], ['sale_ok', '=', 'true']],
      fields: DD.product,
      limit: maxRecords,
      offset: index,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('product.product', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve detailed product information
   * @param {number} productId
   */
  getProductDetail (productId) {
    let products = []
    if (Array.isArray(productId)) {
      products = productId
    } else {
      products.push(productId)
    }
    const params = {
      domain: [['active', '=', 'true'], ['sale_ok', '=', 'true'], ['id', '=', products]],
      fields: DD.productDetail,
      limit: maxRecords,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('product.product', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * get actvities
   * @param {number} offset
   * @return {Promise}
   */
  getActivities (index = 0) {
    const params = {
      domain: [ ['active', '=', 'true'], ['date_deadline', '>', '1900-01-01']],
      fields: ['id', 'name', 'date_deadline', 'email_from', 'phone', 'mobile', 'contact_name'],
      limit: 200,
      offset: index
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * get a list of notes linked to a lead
   * @param {int} lead_id
   * @return {Promise}
   */
  getLeadNote (leadId) {
    const params = {
      domain: [['model', '=', 'crm.lead'], ['res_id', '=', leadId]],
      fields: ['id', 'date', 'record_name', 'subject', 'body', 'needaction', 'subtype_id', 'message_type'],
      limit: maxRecords,
      offset: 0
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('mail.message', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve the names for the tag_ids
   * @param {array} id
   */
  getLeadTags () {
    const params = {
      fields: ['id', 'name']
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead.tag', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * get a list of activity types
   * @return {Promise}
   */
  getActivityTypes () {
    const params = {
      fields: ['id', 'name', 'summary'],
      offset: 0
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('mail.activity.type', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * return the current users id
   * @return {number} userid
   */
  getUserId () {
    return this.odoo.uid
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * converts a lead to an oppotunity, if the customerId is provided it is linked to that customer otherwise a new customer will be created
   * @param {number} leadId
   * @param {number} customerId
   */
  convertLead (leadId, customerId) {
    console.log(`callMethod: ${leadId} ${customerId}`)

    const model = 'crm.lead'
    const endpoint = '/web/dataset/call_kw'
    const params = {
      kwargs: {
        context: this.context
      },
      model,
      method: 'convert_opportunity',
      args: [[leadId], customerId]
    }
    const paramsPartner = {
      kwargs: {
        context: this.context
      },
      model,
      method: 'handle_partner_assignation',
      args: [[leadId], 'create', customerId]
    }

    return new Promise((resolve, reject) => {
      // first convert lead to opportunity
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          console.log('convert error')
          reject(err)
        } else {
          resolve(data)
        }
      })
      // assign the customer
      this.odoo.rpc_call(endpoint, paramsPartner, (err, data) => {
        if (err) {
          console.log('assign error')
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * log a new activity for a opportunity
   * @param {any} activity
   */
  logActivity (activity) {
    if (activity === undefined) {
      throw (new Error('Wrong argument'))
    }

    const model = 'crm.activity.log'
    const endpoint = '/web/dataset/call_kw'
    const params = {
      kwargs: {
        // context: this.context,
      },
      model,
      method: 'action_log',
      args: activity
    }

    /*
    return new Promise((resolve, reject) => {
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
    */

    const type = activity.next_activity_id
    const temp = ReferenceData.getInstance().getActivityTypes()
    let subtype = 0
    temp.forEach((act) => {
      if (act.id === type) {
        subtype = act.subtype_id[0]
      }
    })
    let title = 'Activity done: '
    title = title.concat(activity.title_action)
    title = title.concat('\r')
    title = title.concat(activity.note)

    const message = {
      body: title,
      subject: activity.title_action,
      subtype_id: subtype,
      model: 'crm.lead',
      res_id: activity.lead_id
    }

    const p1 = new Promise((resolve, reject) => {
      this.odoo.create('crm.activity.log', activity, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    const p2 = new Promise((resolve, reject) => {
      this.odoo.create('mail.message', message, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    return Promise.all([p1, p2])
      .then((data) => {
        console.log(data)
        return data
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }

  /**
   * get additional userinfo such as language, salesteam and company for logged in user
   */
  getUserInfo () {
    const id = this.getUserId()

    const params = {
      ids: id,
      fields: ['name', 'lang', 'id', 'sale_team_id', 'company_id', 'partner_id']
    }

    return new Promise((resolve, reject) => {
      this.odoo.get('res.users', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * get company info such as country, currency, name for logged in user
   */
  getCompanyInfo (id) {
    if (id === undefined) {
      throw (new Error('invalid lead id'))
    }
    if (!Array.isArray(id)) {
      id = [id]
    }
    const params = {
      ids: id,
      fields: ['id', 'name', 'country_id', 'currency_id', 'state_id']
    }

    return new Promise((resolve, reject) => {
      this.odoo.get('res.company', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * mark the lead as lost
   * @param {number} leadId
   */
  markLeadLost (leadId) {
    const model = 'crm.lead'
    const endpoint = '/web/dataset/call_kw'
    const params = {
      kwargs: {
        context: this.context
      },
      model,
      method: 'action_set_lost',
      args: [[leadId]]
    }

    return new Promise((resolve, reject) => {
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * mark the lead as won
   * @param {number} leadId
   */
  markLeadWon (leadId) {
    const model = 'crm.lead'
    const endpoint = '/web/dataset/call_kw'
    const params = {
      kwargs: {
        context: this.context
      },
      model,
      method: 'action_set_won',
      args: [[leadId]]
    }

    return new Promise((resolve, reject) => {
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * dashboard information for the app home screen
   */
  retrieveDashboard () {
    const model = 'crm.lead'
    const endpoint = '/web/dataset/call_kw'
    const params = {
      kwargs: {},
      model,
      method: 'retrieve_sales_dashboard',
      args: [this.getUserId]
    }

    return new Promise((resolve, reject) => {
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve all lead stages
   */
  getLeadStages () {
    const params = {
      fields: ['id', 'name', 'sequence'],
      order: 'sequence asc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.stage', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve the lead count per stage
   */
  pipelineCount () {
    const model = 'crm.lead'
    const endpoint = '/web/dataset/call_kw'

    const params = {
      kwargs: {
        // context: this.context,
      },
      model,
      method: 'pipeline_count',
      args: [this.getUserId]
    }

    return new Promise((resolve, reject) => {
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * HACK need to reevaluate
   * @param {number} userId
   */
  getPartnerId (userId) {
    const params = {
      ids: userId,
      fields: ['partner_id']
    }

    return new Promise((resolve, reject) => {
      this.odoo.get('res.users', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /*
   * get all mail channels for the partner
   * @param {number} partnerid
   */
  getChannels (partnerid) {
    const params = {
      domain: [['channel_partner_ids', '=', partnerid]],
      fields: ['name', 'id']
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('mail.channel', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve messages for the user
   */
  async getMessages () {
    const partnerid = await this.getPartnerId(this.getUserId())
    const { partner_id: id } = partnerid[0]
    const channels = await this.getChannels(id[0])
    const channelIds = []
    if (channels) {
      channels.forEach((channel) => {
        channelIds.push(channel.id)
      })
    }

    const model = 'mail.message'
    const endpoint = '/web/dataset/call_kw'

    const params = {
      kwargs: {
        context: this.context
      },
      model,
      method: 'message_fetch',
      args: [[['channel_ids', 'in', channelIds]], 200]
    }

    return new Promise((resolve, reject) => {
      this.odoo.rpc_call(endpoint, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve the commission summary for the user for the specified number of month
   * @param {number} months
   */
  getCommissionSummary (months = 2) {
    const date = new Date()
    date.setDate(date.getDate() - (months * 31))
    const params = {
      domain: [['end_date', '>', date]],
      fields: DD.commissionSummary
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('commission.summary', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve the commission detail for the summary
   * @param {number} summaryID
   */
  getCommissionDetail (summaryId) {
    const params = {
      domain: [['summary', '=', summaryId]],
      fields: DD.commissionDetail
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('commission.detail', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve the commission status for the user
   * @param {number} index - offset for pagination
   * @param {number} userId
   */
  getCommissionStatus (index = 0, userId = 0) {
    let user = 0
    if (userId === 0) {
      user = this.getUserId()
    }

    const params = {
      domain: [['sales_agent', '=', user]],
      fields: DD.commissionStatus,
      limit: maxRecords,
      offset: index,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('commission.status', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve the commission status details
   * @param {number} commissionStatusId
   */
  getCommissionStatusDetail (commissionStatusId) {
    const params = {
      domain: [['sale_status', '=', commissionStatusId]],
      fields: DD.commissionStatusDetail,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('commission.status.detail', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * retrieve mail channel info reference data
   */
  getMailChannels () {
    const params = {
      fields: DD.mailChannel,
      order: 'id desc'
    }

    return new Promise((resolve, reject) => {
      this.odoo.search_read('mail.channel', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
