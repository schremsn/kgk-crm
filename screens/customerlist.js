import React from 'react';
import { Button, FlatList, StyleSheet, Text, View, 
    TextInput, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';
import CustomerDetail from './customerdetail';

let that = null;

export default class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {    
            loading: false,    
            list: [],  
            customer: [],      
            error: null,    
            refreshing: true,
            searchTerm: '',  
            detail: false,  
        };  

        that = this;
    }

    static navigationOptions = {
        tabBarLabel: 'Customer',
    };
    
    componentDidMount() {    
        console.log('customerlist');
        this.getCustomers();    
    }

    getCustomers() {
        let dataprovider = DataProvider.getInstance();
        dataprovider.getCustomers()
          .then( data => {
            console.log( 'got customers: ');
            this.setState({list: data, detail: false});
          })
          .catch( err => {
            console.log( 'error customers: ' + err);
          });
    }

    newCustomer() {

    }

    onPressItem( customer ) {
      console.log('press item: ' + customer.id);
      this.getCustomer( customer.id );
    };

    getCustomer( id) {
      let dataprovider = DataProvider.getInstance();
      dataprovider.getCustomer( id )
        .then( data => {
          console.log( 'got customer: '  +  id);
          this.setState( {customer: data, detail: true});
        })
        .catch( err => {
          console.log( 'error customer: ' + err);
        });  
    }

    onSearch() {
      
    }

    closeDetails( action, data) {
      that.setState( {detail: false} )
    }
  

    renderCustomer(item) {
      const {navigate} = this.props.navigation;

        return (
            <View>
              <TouchableOpacity onPress={()=>{this.onPressItem(item)}}>
                <Text style={styles.item}>{item.name}</Text>
                <Text style={styles.item}>{item.city}</Text>
                <Text style={styles.item}>{item.mobile}</Text>
              </TouchableOpacity>
            </View>
        )
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#607D8B",
            }}
          />
        );
      }

    render() {
      if( this.state.detail ) {
        return(
          <CustomerDetail customer={this.state.customer[0]} onClose={this.closeDetails} />
        )
      }
      else {
        return (
          <View style={styles.container}>   
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', maxHeight: 35 }}>
                <TextInput placeHolder="Customer search" onChangeText={(text) => this.setState({password: text})} 
                  style={{width: '80%'}} />
                <Button title="Search" onPress={ this.onSearch } style={{width: '20%'}} />
             </View>     
            <FlatList
              data = {this.state.list}
              ItemSeparatorComponent = {this.FlatListItemSeparator}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => this.renderCustomer(item)}
            />  
            <View>
              <TouchableHighlight style={styles.newbutton}
                  underlayColor='#ff7043' onPress={this.newCustomer}>
                  <Text style={{fontSize: 50, color: 'white'}}>+</Text>
              </TouchableHighlight>
            </View>      
        </View>
        )
      }
    }
  }
  const styles = StyleSheet.create({
    container: {
      marginTop: 22,
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      width: '100%',
    },
    item: {
      padding: 5,
      fontSize: 16,
      height: 36,
      width: '100%',
    },
    newbutton:  {
      backgroundColor: '#ff5722',
      borderColor: '#ff5722',
      borderWidth: 1,
      height: 60,
      width: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 10,
      right:10,
      shadowColor: "#000000",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
        height: 1,
        width: 0
      }, 
    },
  });