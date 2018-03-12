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
import Util from '../common/util';

let that = null;

export default class LeadDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lead: [{}],
      isDirty: false,
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: i18n.t('lead'),
  };

  /**
   * retrieve the lead details when the screen is loaded
   */
  componentWillMount() {
    this.getLead(this.props.navigation.state.params.leadId);
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
      const refData = ReferenceData.getInstance();
      tags.forEach((tagid) => {
        tagText = tagText.concat(refData.lookupTagname(tagid));
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

  addNote() {
    console.log('add note');
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
   * navigate to leadcreate screen
   */
  createLead() {
    that.props.navigation.navigate('LeadCreate');
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
      i18n.t('add_note'),
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
            that.createLead();
            break;
          case 1: // add a note to lead
            that.addNote();
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
              <Label style={col}>{Util.convertCase(lead.type)}</Label>
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('name')}</Label>
              <Input
                value={Util.getValue(lead.name)}
                onChangeText={text => Util.updateValue('name', text)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Company</Label>
              <Input value={Util.getValue(lead.partner_name)} onChangeText={text => Util.updateValue('partner_name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('action')}</Label>
              <Input value={Util.getValue(lead.title_action)} />
            </Item>
            <Item stackedLabel>
              <Label>Contact</Label>
              <Input value={Util.getValue(lead.contact_name)} onChangeText={text => Util.updateValue('contact_name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Position</Label>
              <Input value={Util.getValue(lead.function)} onChangeText={text => Util.updateValue('function', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Phone</Label>
              <Input value={Util.getValue(lead.phone)} onChangeText={text => Util.updateValue('phone', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Mobile</Label>
              <Input value={Util.getValue(lead.mobile)} onChangeText={text => Util.updateValue('mobile', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input value={Util.getValue(lead.email_from)} onChangeText={text => Util.updateValue('email_from', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Street</Label>
              <Input
                value={Util.getValue(lead.street)}
                onChangeText={text => Util.updateValue('street', text)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Street 2</Label>
              <Input value={Util.getValue(lead.street2)} onChangeText={text => Util.updateValue('street2', text)} />
            </Item>
            <Item stackedLabel>
              <Label>City</Label>
              <Input value={Util.getValue(lead.city)} onChangeText={text => Util.updateValue('city', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Postal code</Label>
              <Input value={Util.getValue(lead.zip)} onChangeText={text => Util.updateValue('zip', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Province</Label>
              <Input value={this.getState(lead.state_id)} onChangeText={text => Util.updateValue('state_id', text)} />
            </Item>
            <Item stackedLabel>
              <Label>Tags</Label>
              <Input value={this.getTags(lead.tag_ids)} />
            </Item>
            <View style={{ padding: 15 }}>
              <Text>Notes</Text>
              <TextInput numberOfLines={3} keyboardType="default" value={Util.getValue(lead.description)} onChangeText={text => Util.updateValue('description', text)} />
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

