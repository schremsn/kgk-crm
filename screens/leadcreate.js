import React from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';
import { Container, Content, Form, Item, Input, Label, Toast, Picker } from 'native-base';

import DataProvider from '../lib/dataprovider';
import ReferenceData from '../data/referencedata';
import i18n from './translation/i18n';

let that = null;

export default class LeadCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: ReferenceData.getInstance().getLeadTags(),
      tag: 0,
    };

    this.lead = new Map();
    that = this;
  }

  /**
   * update the lead with input values
   * @param {string} field
   * @param {string} value
   */
  updateValue(field, value) {
    this.lead.set(field, value);
  }

  /**
   * update the selected stage
   * @param {number} value
   */
  onValueChange(value) {
    that.setState({ tag: value });
    that.lead.set('tag', value);
  }

  /**
   * event handler to save lead
   */
  onSave() {
    // if stage was passed to screen set it on lead
    if (that.props.navigation.state.params.stageid) {
      that.lead.set('stage_id', that.props.navigation.state.params.stageid);
    }
    const dataprovider = DataProvider.getInstance();
    dataprovider.createLead(that.lead)
      .then((data) => {
        console.log(`save lead ${data}`);
        Toast.show({
          text: i18n.t('lead_created'),
          position: 'bottom',
          duration: 2000,
        });
      })
      .catch((err) => {
        console.log(`error saving lead ${err}`);
        console.log(err);
      });
  }


  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>{i18n.t('name')}</Label>
              <Input onChangeText={text => this.updateValue('name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('company')}</Label>
              <Input onChangeText={text => this.updateValue('partner_name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('contact')}</Label>
              <Input onChangeText={text => this.updateValue('contact_name', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('position')}</Label>
              <Input onChangeText={text => this.updateValue('function', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('phone')}</Label>
              <Input keyboardType="numeric" onChangeText={text => this.updateValue('phone', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('mobile')}</Label>
              <Input keyboardType="numeric" onChangeText={text => this.updateValue('mobile', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('email')}</Label>
              <Input keyboardType="email-address" onChangeText={text => this.updateValue('email_from', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('street')}</Label>
              <Input onChangeText={text => this.updateValue('street', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('street2')}</Label>
              <Input onChangeText={text => this.updateValue('street2', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('city')}</Label>
              <Input onChangeText={text => this.updateValue('city', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('postal_code')}</Label>
              <Input onChangeText={text => this.updateValue('zip', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('province')}</Label>
              <Input onChangeText={text => this.updateValue('state_id', text)} />
            </Item>
            <Item stackedLabel>
              <Label>{i18n.t('select_tag')}</Label>
            </Item>
            <Picker
              style={{ marginLeft: 10 }}
              mode="dropdown"
              placeholder={i18n.t('select_tag')}
              iosHeader={i18n.t('tags')}
              Header={i18n.t('tags')}
              selectedValue={this.state.tag}
              note={false}
              onValueChange={(value) => { this.onValueChange(value); }}
            >
              {this.state.tags.map((tag) => {
                return <Picker.Item key={tag.id} label={tag.name} value={tag.id} />;
            })}
            </Picker>
            <View style={{ padding: 15 }}>
              <Text>{i18n.t('notes')}</Text>
              <TextInput numberOfLines={3} keyboardType="default" onChangeText={text => this.updateValue('description', text)} />
            </View>
          </Form>
        </Content>
        <View>
          <Button
            title={i18n.t('save')}
            onPress={this.onSave}
          />
        </View>
      </Container>
    );
  }
}
