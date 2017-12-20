import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import { Container, ActionSheet, Content, Form, Item, Input, Label} from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

let that = null;

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lead: {},
    };

    that = this;
  }

  componentDidMount() {
    this.setState({
      lead: this.props.navigation.state.params.lead,
    });
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
  * show actionsheet menu for customer
  */
  showMenu() {
    const BUTTONS = ['Edit', 'New', 'Convert to opportunity', 'Log activity', 'Mark won', 'Mark lost', 'Cancel'];
    // const DESTRUCTIVE_INDEX = 3;
    const CANCEL_INDEX = 7;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Lead  menu',
      },
      (buttonIndex) => {
        that.setState({ clicked: BUTTONS[buttonIndex] });
        console.log(`menu: ${  buttonIndex}`);
      },
    );
  }

  render() {
    const lead = this.state.lead;

    return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                            <Label>{lead.type}</Label>
                        </Item>
                        <Item stackedLabel>
                            <Label>Name</Label>
                            <Input value={this.getValue(lead.name)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Action</Label>
                            <Input value={this.getValue(lead.title_action)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Contact</Label>
                            <Input value={this.getValue(lead.contact_name)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Phone</Label>
                            <Input value={this.getValue(lead.phone)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Email</Label>
                            <Input value={this.getValue(lead.email_from)} />
                        </Item>
                        <Item stackedLabel>
                            <Label>City</Label>
                            <Input value={this.getValue(lead.city)} />
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

