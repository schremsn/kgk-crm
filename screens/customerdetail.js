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
import Form from 'react-native-advanced-forms';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet'

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cus: [
        {}
      ]
    }
  }

  onChange() {
    console.log('form changed');
  }

  onSubmit() {
    console.log('submit)');
  }

  validate() {
    console.log('validate');
  }

  getCustomer(id) {
    let dataprovider = DataProvider.getInstance();
    dataprovider.getCustomer(id)
      .then(data => {
        this.setState({ cus: data })
        console.log(this.state.cus[0].name);
      })
      .catch((err) => {
        console.log(`error customer: ${err}`);
      });
  }

  componentDidMount() {
    console.log("detail did mount")
    this.getCustomer(this.props.navigation.state.params.customerId);
    console.log(this.state.cus.name);
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Form
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            validate={this.validate}
          >
            <Form.Layout style={styles.row}>
              <Form.Field name="Name" label="Name" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['name']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Street" label="Street" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['street']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Street2" label="Street2" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['street2']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="City" label="City" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['city']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Zip" label="Postal code" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['zip']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="State" label="Province" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['state']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Mobile" label="Mobile" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['mobile']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Phone" label="Phone" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['phone']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Email" label="Email" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['email']} />
              </Form.Field>
            </Form.Layout>
            <Form.Layout style={styles.row}>
              <Form.Field name="Website" label="Website" style={styles.field}>
                <Form.TextField value={this.state.cus[0]['website']} />
              </Form.Field>
            </Form.Layout>
          </Form>
        </ScrollView>

        <View>
          <Button style={{ width: 20 }}
            onPress={() => console.log("press")}
            title="Save"
            color="#841584"
          />
          <Button
            onPress={() => console.log("press")}
            title="Menu"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}

