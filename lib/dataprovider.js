
// const Odoo = require('react-native-odoo');
import Odoo from './odoo';
import Config from './config';

/**
 * instance variable for singleton
 */
let instance = null;

export default class DataProvider {
  constructor() {
    if (!instance) {
      const config = Config.server || {};

      this.host = config.host;
      this.port = config.port;
      this.database = config.database;
      instance = this;
    } else {
      return instance;
    }
  }



  /**
   * @deprecated use the getCustomers method which default to a limit 200
   * @param {*} limit 
   */
  getCustomers(limit) {
    var params = {
      domain: [["customer", "=", "true"]],
      fields: ["company_name", "name", "city", "mobile", "id"],
      limit: limit,
      offset: 0
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read("res.partner", params, (err, data) => {
        if (err)
          reject(err);
        else
          resolve(data);

      })
    });
  }

  /**
   * returns the instance of the DataProvider singleton
   */
  static getInstance() {
    return instance;
  }

  /**
   * log into Odoo using the provided username and password
   * @param {string} username 
   * @param {string} password 
   */
  login(username, password) {
    this.odoo = new Odoo(
      {
        host: this.host,
        port: this.port,
        database: this.database,
        username: username,
        password: password
      }
    )

    return new Promise((reject, resolve) => {
      this.odoo.connect((data, err) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    });

  }

  /**
   * @params {number} optional sepcify the offset to read from
   * get a list of 200 customers
   */
  getCustomers( offset = 0 ) {
    var params = {
      domain: [['customer', '=', 'true']],
      fields: ['company_name', 'name', 'city', 'mobile', 'phone', 'id'],
      limit: 200,
      offset: offset,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('res.partner', params, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

  /**
   * returns the customer(s) based on the provided id(s), the parameter can either be a single
   * id or an array of ids
   * @param {*} id 
   */
  getCustomer(id) {
    if (!Array.isArray(id)) {
      id = [id];
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
        'state',
      ],
    };

    return new Promise((resolve, reject) => {
      this.odoo.get('res.partner', params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * @deprecated use getCustomers method and specify the offset
   * @param {*} index 
   */
  getCustomersBeginIndex(index) {
    const params = {
      domain: [['customer', '=', 'true']],
      fields: ['company_name', 'name', 'city', 'mobile', 'id'],
      limit: 200,
      offset: index,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('res.partner', params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }



  /**
   * get a list 200 leads
   */
  getLeads() {
    let params = {
      domain: [['active', '=', 'true']],
      fields: ['contact_name', 'name', 'title_action', 'phone', 'partner_name', 'city', 'type', 'email_from', 'id'],
      limit: 200,
      offset: 0,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

  /**
   * get a list of 200 activities
   */
  getActivities() {
    var params = {
      domain: ['|', ['message_type', '=', 'Call'], ['message_type', '=', 'Task']],
      fields: ['body', 'id', 'create_date', 'description', 'display_name',
        'message_type', 'channel_id'],
      limit: 200,
      offset: 0,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('mail.message', params, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

  /**
   * create a new customer based on the data provided data, which needs to be a dictionary
   * @param {any} customer 
   */
  createCustomer(customer) {
    if (customer == undefined) {
      throw 'No customer provided';
    }
    return new Promise((resolve, reject) => {
      this.odoo.create('res.partner', customer, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

  /**
   * update and existing customer with the provided data (dictionary), 
   * customer must include the id of the customer to be updated
   * @param {any} customer 
   */
  updateCustomer(customer) {
    if (customer == undefined) {
      throw 'No customer provided';
    }
    else if (customer.id == undefined) {
      throw 'Invalid customer id';
    }
    let id = customer.id;

    return new Promise((resolve, reject) => {
      this.odoo.update('res.partner', id, customer, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

  /**
  * search for customer, using smartsearch to look in name, phone and city field
  * @param {string} searchTerm
  */
  searchCustomer(searchTerm) {
    var params = {
      domain: ['&', '|', '|', ['customer', '=', 'true'], ['name', 'ilike', searchTerm], ['city', 'ilike', searchTerm],
        ['phone', 'ilike', searchTerm],],
      fields: ['company_name', 'name', 'city', 'mobile', 'phone', 'id'],
      limit: 200,
      offset: 0,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('res.partner', params, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  }

  /**
   * @param {number} optional offset to read from
   * retrieve a list of 200 leads
   */
  getLeads( offset = 0 ) {
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
        'id',
      ],
      limit: 200,
      offset: 0,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }


  /**
   * @deprecated use getLeads method specifiy the offset
   * @param {*} index 
   */
  getLeadsBeginIndex(index) {
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
        'id',
      ],
      limit: 20,
      offset: index,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('crm.lead', params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * get a list of 200 activities for the user
   */
  getActivities() {
    const params = {
      domain: ['|', ['message_type', '=', 'Call'], ['message_type', '=', 'Task']],
      fields: [
        'body',
        'id',
        'create_date',
        'description',
        'display_name',
        'message_type',
        'channel_id',
      ],
      limit: 200,
      offset: 0,
    };

    return new Promise((resolve, reject) => {
      this.odoo.search_read('mail.message', params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
