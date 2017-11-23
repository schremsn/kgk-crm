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
            lead: {}
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.lead);
        this.setState({
            lead: this.props.navigation.state.params.lead
        });
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
        return (
            <View>
                <ScrollView>
                    <Form
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}
                        validate={this.validate}
                    >
                        <Form.Layout style={styles.row}>
                            <Form.Field name="Name" label="Name" style={styles.field}>
                                <Form.TextField value={this.state.lead.name} />
                            </Form.Field>
                        </Form.Layout>
                        <Form.Layout style={styles.row}>
                            <Form.Field name="Contact Name" label="Contact Name" style={styles.field}>
                                <Form.TextField value={this.state.contact_name} />
                            </Form.Field>
                        </Form.Layout>
                        <Form.Layout style={styles.row}>
                            <Form.Field name="City" label="City" style={styles.field}>
                                <Form.TextField value={this.state.lead.city} />
                            </Form.Field>
                        </Form.Layout>
                        <Form.Layout style={styles.row}>
                            <Form.Field name="Phone" label="Phone" style={styles.field}>
                                <Form.TextField value={this.state.lead.phone} />
                            </Form.Field>
                        </Form.Layout>
                        <Form.Layout style={styles.row}>
                            <Form.Field name="Partner Name" label="Partner Name" style={styles.field}>
                                <Form.TextField value={this.state.lead.partner_name} />
                            </Form.Field>
                        </Form.Layout>

                        <Form.Layout style={styles.row}>
                            <Form.Field name="Email From" label="Email From" style={styles.field}>
                                <Form.TextField value={this.state.lead.email_from} />
                            </Form.Field>
                        </Form.Layout>
                        <Form.Layout style={styles.row}>
                            <Form.Field name="Title Action" label="Title Action" style={styles.field}>
                                <Form.TextField value={this.state.lead.title_action} />
                            </Form.Field>
                        </Form.Layout>
                        <Form.Layout style={styles.row}>
                            <Form.Field name="Type" label="Type" style={styles.field}>
                                <Form.TextField value={this.state.lead.type} />
                            </Form.Field>
                        </Form.Layout>
                    </Form>
                </ScrollView>
                <Button
                    onPress={() => console.log("press")}
                    title="Save"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Button
                    onPress={() => console.log("press")}
                    title="Menu"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        );
    }
}

