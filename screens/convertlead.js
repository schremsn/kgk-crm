import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Radio, Right, ListItem, Toast, List } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

let that = null;

export default class ConvertLead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: [{}],
      customerName: '',
      linkCustomer: false,
      newCustomer: true,
    };

    that = this;
  }

  /**
   * save the updated oppurtunity
   */
  saveOpportunity() {
    const lead = that.props.navigation.state.params.lead;
    const dataprovider = DataProvider.getInstance();
    const customerId = that.state.customer[0].id;

    dataprovider.convertLead(lead.id, customerId)
      .then((data) => {
        console.log(`convert lead: ${data}`);
        Toast.show({
          Text: 'The lead was converted to an opportunity',
          position: 'bottom',
          duration: 2000,
        });
        // @todo - should navigate to customer details
        that.props.navigation.goBack();
      })
      .catch((err) => {
        console.log(`convert error: ${err}`);
        Toast.show({
          text: `Error converting lead: ${err}`,
          position: 'bottom',
          type: 'danger',
          buttonText: 'OK',
        });
      });
  }

  /**
   * callback function for customer selection screen
   * will retrieve the customer
   * @param {number} customerId
   */
  selectCustomer(customerId) {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getCustomer(customerId)
      .then((data) => {
        that.setState({ customer: data });
        that.setState({ customerName: data[0].name });
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
  }

  /**
   * toggle radio buttons
   */
  toggle() {
    let r1 = that.state.linkCustomer;
    r1 = !r1;
    that.setState({ linkCustomer: r1 });
    let r2 = that.state.newCustomer;
    r2 = !r2;
    that.setState({ newCustomer: r2 });
  }

  render() {
    return (
      <View>
        <List>
          <ListItem>
            <Text>Create a new customer</Text>
            <Right>
              <Radio selected={this.state.newCustomer} onPress={this.toggle} />
            </Right>
          </ListItem>
          <ListItem>
            <Text>Link to an existing customer</Text>
            <Right>
              <Radio selected={this.state.linkCustomer} onPress={this.toggle} />
            </Right>
          </ListItem>
          <ListItem>
            <Text>Linked customer</Text>
            <TextInput placeHolder="linked customer" value={this.state.customerName} editable={false} />
          </ListItem>
          <ListItem>
            <Button
              onPress={() => { this.props.navigation.navigate('SelectCustomer', { select: that.selectCustomer }); }}
              title="Select customer"
            />
          </ListItem>
        </List>
        <Button
          onPress={this.saveOpportunity}
          title="Convert"
        />
      </View>
    );
  }
}
