'use strict';

//const Odoo = require('react-native-odoo');
import Odoo from './odoo';
import Config from './config';

let instance = null;

export default class DataProvider {  
    constructor( ) {  
        if(! instance) {
            let config = Config.server || {};
                
            this.host = config.host;
            this.port = config.port;
            this.database = config.database; 
            instance = this;
        }
        else {
            return instance;
        }
    }

    static getInstance() {
        console.log( (instance instanceof DataProvider) );
        return instance;
    }


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
        return new Promise(( reject, resolve ) => {
            this.odoo.connect( (data, err) => {
                if( err ) {
                    reject( err );
                }
                resolve(data);
            })
        });
        
    }
    
    getCustomers() {
        var params = {
            domain: [ ['customer', '=', 'true']],
            fields: [ 'company_name', 'name', 'city', 'mobile',  'id'],
            limit: 200,
            offset: 0,  
        }; 

        return new Promise((resolve, reject ) => {
            this.odoo.search_read('res.partner', params, (err, data) => {
                if( err ) {
                    reject( err );
                }
                else {
                    resolve( data );
                }
            });
        });
    }

    getCustomer( id ) {
        if(! Array.isArray(id) ) {
            id = [ id ];
        }

        let params = {
            ids: id,
            fields: [ 'name', 'city', 'mobile', 'phone', 'id', 'email', 'comment',
               'company_name', 'contact_address', 'is_company', 'street', 'street2','website', 'zip', 'state'  ],
        };

        return new Promise((resolve, reject ) => {
            this.odoo.get('res.partner', params, (err, data) => {
                if( err ) {
                    reject( err );
                }
                else {
                    resolve( data );
                }
            });
        });
    }

    getLeads() {
        let params = {
            domain: [ ['active', '=', 'true']],
            fields: [ 'contact_name', 'name', 'title_action', 'phone', 'partner_name', 'city', 'type', 'email_from', 'id'],
            limit: 200,
            offset: 0,  
        }; 

        return new Promise((resolve, reject ) => {
            this.odoo.search_read('crm.lead', params, (err, data) => {
                if( err ) {
                    reject( err );
                }
                else {
                    resolve( data );
                }
            });
        });
    }

    getActivities() {
        var params = {
            domain: [ '|',  ['message_type', '=', 'Call'], ['message_type', '=', 'Task'] ],
            fields: [ 'body', 'id', 'create_date', 'description', 'display_name',
                'message_type', 'channel_id'],
            limit: 200,
            offset: 0,  
        }; 

        return new Promise((resolve, reject ) => {
            this.odoo.search_read('mail.message', params, (err, data) => {
                if( err ) {
                    reject( err );
                }
                else {
                    resolve( data );
                }
            });
        });
    }
}



