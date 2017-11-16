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

let that = null;

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: props.visible,
    };
    that = this;
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onComponentDidMount() {
    console.log('customerdetail mount');
  }

  onRequestClose() {
    console.log('request close detail');
    that.setState({ modalVisible: false });
    that.props.onClose();
  }

  onSave() {
    console.log('save');
    that.setState({ modalVisible: false });
    that.props.onClose();
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

  render() {
    console.log(this.props.customer);
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.onRequestClose}
        >
          <ScrollView>
            <Form
              ref="form"
              onChange={this.onChange}
              onSubmit={this.onSubmit}
              validate={this.validate}
            >
              <Form.Layout style={styles.row}>
                <Form.Field name="Name" label="Name" style={styles.field}>
                  <Form.TextField value={this.props.customer.name} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Street" label="Street" style={styles.field}>
                  <Form.TextField value={this.props.customer.street} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Street2" label="Street2" style={styles.field}>
                  <Form.TextField value={this.props.customer.street2} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="City" label="City" style={styles.field}>
                  <Form.TextField value={this.props.customer.city} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Zip" label="Postal code" style={styles.field}>
                  <Form.TextField value={this.props.customer.zip} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="State" label="Province" style={styles.field}>
                  <Form.TextField value={this.props.customer.state} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Mobile" label="Mobile" style={styles.field}>
                  <Form.TextField value={this.props.customer.mobile} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Phone" label="Phone" style={styles.field}>
                  <Form.TextField value={this.props.customer.phone} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Email" label="Email" style={styles.field}>
                  <Form.TextField value={this.props.customer.Email} />
                </Form.Field>
              </Form.Layout>
              <Form.Layout style={styles.row}>
                <Form.Field name="Website" label="Website" style={styles.field}>
                  <Form.TextField value={this.props.customer.website} />
                </Form.Field>
              </Form.Layout>
            </Form>
          </ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-start',
              maxHeight: 30,
            }}
          >
            <Button title="Save" onPress={this.onSave} style={{ minWidth: '50%' }} />
            <Button title="Menu" onPress={this.onSave} style={{ width: '50%' }} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  item: {
    padding: 5,
    fontSize: 16,
    height: 36,
  },
});
