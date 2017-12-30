import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
  ScrollView,
  Button,
  TextInput,
} from 'react-native';
import { Container, ActionSheet, Content, Form, Item, Input, Label, CheckBox } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

let that = null;

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cus: [
        {},
      ],
    };

    that = this;
  }


  /**
   * helper method to filter out json false values for empty (null) field - should only be called for non-boolean fields
   * @param {any} data
   * @return {any} value
   */
  getValue(data) {
    let value = '';
    if (data == null) {
      value = '';
    } else if (data == false) {
      value = '';
    } else {
      value = data;
    }
    return value;
  }

  /**
   * retrieve customer by id
   * @param {number} id
   */
  getCustomer(id) {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getCustomer(id)
      .then((data) => {
        this.setState({ cus: data });
        console.log(this.state.cus[0].name);
      })
      .catch((err) => {
        console.log(`error customer: ${err}`);
      });
  }


  componentDidMount() {
    this.getCustomer(this.props.navigation.state.params.customerId);
  }

  /**
   * show actionsheet menu for customer
   */
  showMenu() {
    const { navigate } = that.props.navigation;

    const BUTTONS = ['Edit', 'New', 'Log activity', 'New note', 'New contact', 'New opportunity', 'Cancel'];
    // const DESTRUCTIVE_INDEX = 3;
    const CANCEL_INDEX = 6;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Customer menu',
      },
      (buttonIndex) => {
        if (buttonIndex === 3) {
          navigate('Note', { customerId: that.state.cus[0].id });
        }
      },
    );
  }


  render() {
    const customer = this.state.cus[0];

    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Label>Is company</Label>
              <CheckBox checked={customer.is_company} />
            </Item>
            <Item stackedLabel>
              <Label>Customer name</Label>
              <Input value={customer.name} />
            </Item>
            <Item stackedLabel>
              <Label>Street</Label>
              <Input value={this.getValue(customer.street)} />
            </Item>
            <Item stackedLabel>
              <Label>Street 2</Label>
              <Input value={this.getValue(customer.street2)} />
            </Item>
            <Item stackedLabel>
              <Label>City</Label>
              <Input value={this.getValue(customer.city)} />
            </Item>
            <Item stackedLabel>
              <Label>Province</Label>
              <Input value={this.getValue(customer.state)} />
            </Item>
            <Item stackedLabel>
              <Label>Telephone</Label>
              <Input value={this.getValue(customer.phone)} />
            </Item>
            <Item stackedLabel>
              <Label>Mobile</Label>
              <Input value={this.getValue(customer.mobile)} />
            </Item>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input value={this.getValue(customer.email)} />
            </Item>
            <Item stackedLabel>
              <Label>Website</Label>
              <Input value={this.getValue(customer.website)} />
            </Item>
          </Form>
        </Content>
        <View>
          <TouchableHighlight
            style={styles.newCustomerbutton}
            underlayColor="#ff7043"
            onPress={this.showMenu}
          >
            <Text style={{ fontSize: 30, color: 'white' }}>&#8801;</Text>
          </TouchableHighlight>
        </View>
      </Container>
    );
  }
}

