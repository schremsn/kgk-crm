import React from 'react';
import { StyleSheet, Text, View, Button, Modal, TextInput, ScrollView } from 'react-native';
import DataProvider from '../lib/dataprovider';

let that = null;

export default class SignInScreen extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            modalVisible: true,
            username: '',
            password: '',
        }
        that = this;
    }

    onSignIn() {
        that.setState( {modalVisible: false} );
        that.props.done();
    }

    onClose() {
        console.log( 'close modal' );
    }

    render() {
        return(
            <View style={{padding: 10, flex: 1}}>
                <Modal animationType = {"slide"} transparent = {false} 
                    visible = {this.state.modalVisible}
                    onRequestClose = { this.onClose }>
                    <ScrollView style= {{padding: 10}}>
                        <Text style={{fontSize: 20}}>Welcome to KGK CRM</Text>
                        <TextInput style={{height: 40}} placeholder="User name" 
                            autofocus= {true} 
                            onChangeText={(text) => this.setState({username: text})} />
                        <TextInput style={{height: 40}} placeholder="Password" 
                            secureTextEntry= {true}
                            onChangeText={(text) => this.setState({password: text})} />
                    </ScrollView>
                    <View>
                        <Button onPress={ this.onSignIn } title="Sign in"/> 
                    </View>
                </Modal>
            </View>
        );
    }
}