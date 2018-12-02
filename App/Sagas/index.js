import { takeLatest, all } from 'redux-saga/effects';
// import API from '../Services/Api';
import FixtureAPI from '../Services/FixtureApi';
import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux';
import { ContactTypes, ContactSagas } from '../Containers/Contact'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas';
// import { getUserAvatar } from './GithubSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    takeLatest(ContactTypes.GET_CUSTOMER_REQUEST, ContactSagas.getCustomers),
    takeLatest(ContactTypes.SEARCH_CUSTOMER_REQUEST, ContactSagas.searchCustomer),
    takeLatest(ContactTypes.GET_CUSTOMER_DETAIL_REQUEST, ContactSagas.getCustomerDetail),
    takeLatest(ContactTypes.CREATE_CUSTOMER_REQUEST, ContactSagas.createCustomer),
    takeLatest(ContactTypes.UPDATE_CUSTOMER_REQUEST, ContactSagas.updateCustomer),
    takeLatest(ContactTypes.GET_CONTACT_CATEGORIES_REQUEST, ContactSagas.getContactCategories),
    takeLatest(ContactTypes.CREATE_CONTACT_ATTACHMENT_REQUEST, ContactSagas.createContactAttachment),
  ]);
}
