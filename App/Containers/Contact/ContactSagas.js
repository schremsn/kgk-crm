import {
  call, put, select, all,
} from 'redux-saga/effects';

import DataProvider from '../../Lib/dataprovider';
import { ContactActions } from '.';
import retryPromise from '../../Services/Api';

const dataprovider = DataProvider.getInstance();

export function* getCustomers(api, action) {
  const {
    offset,
  } = action;

  try {
    const response = yield dataprovider.getCustomers(offset);
    console.log('getCustomers', response);
    if (response.ok) {
      yield put(ContactActions.getCustomerSuccess(response.data));
    } else {
      yield put(ContactActions.getCustomerFailure());
    }
  } catch (e) {
    yield put(ContactActions.getCustomerFailure());
  }
}

export function* getCustomerDetail(api, action) {
  const {
    id,
  } = action;

  try {
    const response = yield dataprovider.getCustomerDetail(id);
    console.log('getCustomerDetail', response);
    if (response.ok) {
      yield put(ContactActions.getCustomerDetailSuccess(response.data));
    } else {
      yield put(ContactActions.getCustomerDetailFailure());
    }
  } catch (e) {
    yield put(ContactActions.getCustomerDetailFailure());
  }
}

export function* createCustomer(api, action) {
  const {
    data,
  } = action;

  try {
    const response = yield dataprovider.createCustomer(data);
    console.log('createCustomer', response);
    if (response.ok) {
      yield put(ContactActions.createCustomerSuccess(response.data));
    } else {
      yield put(ContactActions.createCustomerFailure());
    }
  } catch (e) {
    yield put(ContactActions.createCustomerFailure());
  }
}

export function* updateCustomer(api, action) {
  const {
    data,
  } = action;

  try {
    const response = yield dataprovider.updateCustomer(data);
    console.log('updateCustomer', response);
    if (response.ok) {
      yield put(ContactActions.updateCustomerSuccess(response.data));
    } else {
      yield put(ContactActions.updateCustomerFailure());
    }
  } catch (e) {
    yield put(ContactActions.updateCustomerFailure());
  }
}

export function* getContactCategories(api, action) {

  try {
    const response = yield dataprovider.getContactCategories();
    console.log('getContactCategories', response);
    if (response.ok) {
      yield put(ContactActions.updateCustomerSuccess(response.data));
    } else {
      yield put(ContactActions.updateCustomerFailure());
    }
  } catch (e) {
    yield put(ContactActions.updateCustomerFailure());
  }
}

export function* createContactAttachment(api, action) {
  const {
    contactId, data, fileName, description
  } = action;
  try {
    const response = yield dataprovider.createContactAttachment(contactId, data, fileName, description);
    console.log('createContactAttachment', response);
    if (response.ok) {
      yield put(ContactActions.updateCustomerSuccess(response.data));
    } else {
      yield put(ContactActions.updateCustomerFailure());
    }
  } catch (e) {
    yield put(ContactActions.updateCustomerFailure());
  }
}

export function* searchCustomer(api, action) {
  const {
    searchTerm
  } = action;
  try {
    const response = yield dataprovider.searchCustomer(searchTerm);
    console.log('createContactAttachment', response);
    if (response.ok) {
      yield put(ContactActions.updateCustomerSuccess(response.data));
    } else {
      yield put(ContactActions.updateCustomerFailure());
    }
  } catch (e) {
    yield put(ContactActions.updateCustomerFailure());
  }
}

