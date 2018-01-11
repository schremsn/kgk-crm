import React from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
} from 'react-native';
import { Container, ActionSheet, Content, Form, Item, Input, Label, Toast } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import ReferenceData from '../data/referencedata';
import i18n from './translation/i18n';

let that = null;

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lead: [{}],
      isDirty: false,
    };

    that = this;
  }

  /**
   * retrieve the lead details when the screen is loaded
   */
  componentDidMount() {
    this.getLead(this.props.navigation.state.params.leadId);
  }

  componentWillUnmount() {
    this.updateLead();
  }

  /**
   * save updated lead
   */
  updateLead() {
    if (this.state.isDirty) {
      const lead = this.state.lead[0];
      this.saveLead(lead);
      
      Toast.show({
        text: 'Lead saved',
        position: 'bottom',
        duration: 1000,
      });
    }
  }

  /**
   * retrieve lead, will return a promise
   * @param {number} id
   */
  getLead(id) {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getLead(id)
      .then((data) => {
        this.setState({ lead: data });
      })
      .catch((err) => {
        console.log(`error getting lead: ${err}`);
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
    } else if (data === false) {
      value = '';
    } else {
      value = data;
    }
    return value;
  }

  /**
   * helper method to capitalize the first letter
   * @param {string} data
   */
  convertCase(data) {
    let result = data;
    if (typeof (data) === 'string' && data.length > 0) {
      const first = data.substring(0, 1);
      result = first.toUpperCase();
      result = result.concat(data.substring(1));
    }
    return result;
  }

  /**
   * navigate to the convertlead screen or exit if it's is already and opportunity
   */
  convertLead() {
    const lead1 = that.state.lead[0];

    if (lead1.type.toUpperCase() === 'opportunity'.toUpperCase()) {
      Toast.show({
        text: i18n.t('only_leads'),
        position: 'bottom',
        type: 'warning',
        buttonText: i18n.t('ok'),
      });
      return;
    }
    that.props.navigation.navigate('Convert', { lead: lead1 });
  }

  /**
   * navigate to the logactvity screen or display message if it's a lead
   */
  logActivity() {
    const lead = that.state.lead[0];

    if (lead.type.toUpperCase() === 'opportunity'.toUpperCase()) {
      that.props.navigation.navigate('LogActivity', { leadId: lead.id });
    }
    else {
      Toast.show({
        text: i18n.t('log_only_leads'),
        position: 'bottom',
        duration: 2000,
      });
    }
  }

  /**
   * save lead to database
   * @param {lead} lead
   */
  saveLead(lead) {
    const dataprovider = DataProvider.getInstance();
    dataprovider.updateLead(lead)
      .then((data) => {
        console.log(`saved lead ${data}`);
      })
      .catch((err) => {
        console.log(`error saving ${err}`);
      });
  }

  updateValue(field, value) {
    console.log( value);
    this.setState({ isDirty: true });
    this.state.lead[0].field = value;
  }

  /**
   * lookup the tag names for the lead
   * @param {array} tags
   */
  getTags(tags) {
    let tagText = '';
    if ((tags !== undefined) && (tags.length > 0)) {
      const tagInfo = ReferenceData.getInstance().getLeadTags();
      tags.forEach((tagid) => {
        tagText = tagText.concat(tagInfo.get(tagid));
        tagText = tagText.concat(',');
      });
    }
    return tagText;
  }

  /**
   * mark the current opportunity as won
   */
  markWon() {
    const lead = this.state.lead[0];

    if (lead.type.toUpperCase() === 'opportunity'.toUpperCase()) {
      const dataprovider = DataProvider.getInstance();
      dataprovider.markLeadWon(lead.id)
        .then((data) => {
          console.log(`won: ${data}`);
          that.props.navigation.goBack();
        })
        .catch((err) => {
          console.log(`lost err: ${err}`);
        });
    }
    else {
      Toast.show({
        text: i18n.t('win_only_opportunity'),
        position: 'bottom',
        duration: 2000,
      });
    }
  }

  /**
   * mark the current opportunity as lost
   */
  markLost() {
    const lead = this.state.lead[0];

    if (lead.type.toUpperCase() === 'opportunity'.toUpperCase()) {
      const dataprovider = DataProvider.getInstance();
      dataprovider.markLeadLost(lead.id)
        .then((data) => {
          console.log(`lost: ${data}`);
          that.props.navigation.goBack();
        })
        .catch((err) => {
          console.log(`lost err: ${err}`);
        });
    }
    else {
      Toast.show({
        text: i18n.t('lost_only_opportunity'),
        position: 'bottom',
        duration: 2000,
      });
    }
  }

  /**
   * parse the state name from array returned with the lead data
   * @param {array} state
   */
  getState(state) {
    let result = '';
    if (Array.isArray(state)) {
      result = state[1];
    }
    return result;
  }

  /**
  * show actionsheet menu for customer
  */
  showMenu() {
    const BUTTONS = [
      i18n.t('new'),
      i18n.t('convert_to_opportunity'),
      i18n.t('log_activity'),
      i18n.t('mark_won'),
      i18n.t('mark_lost'),
      i18n.t('save'),
      i18n.t('cancel')];
    const CANCEL_INDEX = 6;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: i18n.t('lead_menu'),
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0: // New
            break;
          case 1: // convert lead to oppurtunity
            that.convertLead();
            break;
          case 2: // log activity
            that.logActivity();
            break;
          case 3: // mark won
            that.markWon();
            break;
          case 4: // mark lost
            that.markLost();
            break;
          case 5: // save
            that.updateLead();
            break;
          case 6: // cancel
            break;
          default:
        }
      },
    );
  }

  render() {
    const lead = this.state.lead[0];
    let col = styles.leadColor;
    if (lead.type && lead.type.toUpperCase() === 'opportunity'.toUpperCase()) {
      col = styles.opportunityColor;
    }

    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Label style={col}>{this.convertCase(lead.type)}</Label>
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('name')}</Label>
              <Input
                value={this.getValue(lead.name)}
                onChangeText={text => this.updateValue('name', text)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Company</Label>
              <Input value={this.getValue(lead.partner_name)} onChangeText={text => this.updateValue('partner_name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('action')}</Label>
              <Input value={this.getValue(lead.title_action)} />
            </Item>
            <Item stackedLabel>
              <Label>Contact</Label>
              <Input value={this.getValue(lead.contact_name)} onChangeText={text => this.updateValue('contact_name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Position</Label>
              <Input value={this.getValue(lead.function)} onChangeText={text => this.updateValue('function', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Phone</Label>
              <Input value={this.getValue(lead.phone)} onChangeText={text => this.updateValue('phone', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Mobile</Label>
              <Input value={this.getValue(lead.mobile)} onChangeText={text => this.updateValue('mobile', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input value={this.getValue(lead.email_from)} onChangeText={text => this.updateValue('email_from', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Street</Label>
              <Input
                value={this.getValue(lead.street)}
                onChangeText={text => this.updateValue('street', text)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Street 2</Label>
              <Input value={this.getValue(lead.street2)} onChangeText={text => this.updateValue('street2', text)} />
            </Item>
            <Item stackedLabel>
              <Label>City</Label>
              <Input value={this.getValue(lead.city)} onChangeText={text => this.updateValue('city', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Postal code</Label>
              <Input value={this.getValue(lead.zip)} onChangeText={text => this.updateValue('zip', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Province</Label>
              <Input value={this.getState(lead.state_id)} onChangeText={text => this.updateValue('state_id', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Tags</Label>
              <Input value={this.getTags(lead.tag_ids)} />
            </Item>
            <View style={{ padding: 15 }}>
              <Text>Notes</Text>
              <TextInput numberOfLines={3} keyboardType="default" value={this.getValue(lead.description)} onChangeText={text => this.updateValue('description', text)} />
            </View>
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

