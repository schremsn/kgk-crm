

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
   * @param {*} username 
   * @param {*} password 
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
   * get a list of 200 customers
   */
  getCustomers() {
    var params = {
      domain: [['customer', '=', 'true']],
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
   * returns the customer(s) based on the provided id(s), the parameter can either be a single
   * id or an array of ids
   * @param {*} id 
   */
  getCustomer(id) {
    if (id == undefined) {
      throw 'New customer id provided';
    }
    if (!Array.isArray(id)) {
      id = [id];
    };
  }
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
   * get a list of 200 customers
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
   * @param {*} customer 
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
   * @param {*} customer 
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
  * @param {*} searchTerm
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


  getLeads() {
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
