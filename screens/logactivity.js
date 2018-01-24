import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { Container, Picker, Content, Form, Label, Item, Input } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import ReferenceData from '../data/referencedata';
import i18n from './translation/i18n';

let that = null;

export default class LogActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activityTypes: ReferenceData.getInstance().getActivityTypes(),
      summary: undefined,
      description: undefined,
      type: ReferenceData.getInstance().getActivityTypes()[0].id,
    };

    that = this;
  }

  onValueChange(selection) {
    that.setState({ type: selection });
  }

  componentWillMount() {
    console.log('log activity');
  }

  /**
   * log activity and navigate back to caller
   */
  logActivity() {
    const dataprovider = DataProvider.getInstance();
    const leadId = that.props.navigation.state.params.leadId;
    const description = that.state.description;
    const name = that.state.summary;
    const activity = {
      lead_id: leadId,
      title_action: name,
      note: description,
      next_activity_id: that.state.type,
    };

    dataprovider.logActivity(activity)
      .then((data) => {
        console.log(`logged activity: ${data}`);
        that.props.navigation.goBack();
      })
      .catch((err) => {
        console.log(`log error: ${err}`);
        console.log(err);
      });
  }

  /**
   * log current activity and prompt to schedule new
   */
  logAndSchedule() {

  }

  /**
   * cancel input and navigate back to caller
   */
  cancel() {
    that.setState({ summary: '' });
    that.setState({ description: '' });
    that.setState({ type: '' });
    that.props.navigation.goBack();
  }
  
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Picker
              mode="dropdown"
              placeholder={i18n.t('select_action')}
              selectedValue={this.state.type}
              note={false}
              onValueChange={(value) => { this.onValueChange(value); }}
            >
              {this.state.activityTypes.map((types) => {
                return <Picker.Item key={types.id} label={types.name} value={types.id} />;
            })}

            </Picker>
            <Item stackedLabel>
              <Label>Summary</Label>
              <Input onChangeText={(value) => { this.setState({ summary: value }); }} />
            </Item>
            <Item stackedLabel>
              <Label>Description</Label>
              <Input onChangeText={(value) => { this.setState({ description: value }); }} />
            </Item>
            <Button title={i18n.t('log_activity')} onPress={this.logActivity} />
            <Button title={i18n.t('log_schedule')} onPress={this.logAndSchedule} />
            <Button title={i18n.t('cancel')} onPress={this.cancel} />
          </Form>
        </Content>
      </Container>
    );
  }
  
}
