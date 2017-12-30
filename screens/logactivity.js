import React from 'react';
import { TextInput, Button } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Picker } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

let that = null;

export default class LogActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activityTypes: [],
      summary: {},
      description: {},
      type: {},
    };

    that = this;
  }

  /**
   * load the activity types used in the picker
   */
  onComponentDidMount() {
    console.log('log mounted');
    const dataprovider = DataProvider.getInstance();
    dataprovider.getActivityTypes()
      .then((data) => {
        this.setState({ activityTypes: data });
      })
      .catch((err) => {
        console.log(`error getting activity types: ${err}`);
      });
  }

  onValueChange(selection) {
    console.log(selection);
    that.setState({ type: selection });
  }

  /**
   * log activity and navigate back to caller
   */
  logActivity() {
    const dataprovider = DataProvider.getInstance();
    const leadId = that.props.navigation.state.params.leadId;
    const description = that.state.description;
    const name = that.state.summary;
    const lead = {
      id: leadId,
      note: description,
      title_action: name,
      next_activity_id: that.state.type,
    };

    dataprovider.logActivity(lead)
      .then((data) => {
        console.log(`logged activity: ${data}`);
      })
      .catch((err) => {
        console.log(`log error: ${err}`);
      });

    that.props.navigation.goBack();
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
    that.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Picker
              mode="dropdown"
              placeholder="Select action"
              note={false}
              onValueChange={(value) => { this.onValueChange(value); }}
            >
              {this.state.list.map((activityTypes) => {
                return <Picker.Item key={activityTypes.id} label={activityTypes.name} value={activityTypes.id} />;
            })}

            </Picker>
            <Item stackLabel>
              <Label>Summary</Label>
              <Input onChangeText={(value) => { this.setState({summary: value}); }} />
            </Item>
            <Item stackLabel>
              <Label>Description</Label>
              <TextInput numberOfLines={5} onChangeText={(value) => { this.setState({description: value}); }} />
            </Item>
            <Item>
              <Button title="Log activity" onPress={this.logActivity()} />
              <Button title="Log and schedule new activity" onPress={this.logAndSchedule()} />
              <Button title="Cancel" onPress={this.cancel()} />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}