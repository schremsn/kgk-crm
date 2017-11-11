import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';

export default class Leadlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {    
            loading: false,    
            data: [],        
            error: null,    
            refreshing: true    
        };  
    }
    static navigationOptions = {
        tabBarLabel: 'Leads',
    };

    componentDidMount() {    
        console.log('leadlist');
        this.getLeads();    
    }

    getLeads() {
        let dataprovider = DataProvider.getInstance(); 
        dataprovider.getLeads()
          .then( data => {
            console.log( 'got leads: ' );
            this.setState({data: data});
          })
          .catch( err => {
            console.log( 'error leads: ' + err);
          });
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

    renderLead(item) {
        return (
            <View>
            <Text style={styles.item}>{item.name}</Text>
            <Text style={styles.item}>{item.contact_name}</Text>
            <Text style={styles.item}>{item.title_action}</Text>
            </View>
        )
        }

    render() {
      return (
        <View style={styles.container}>
         <FlatList
           data= {this.state.data}
           ItemSeparatorComponent = {this.FlatListItemSeparator}
           keyExtractor={(item, index) => index}
           renderItem={({item}) => this.renderLead(item)}
         />        
       </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      marginTop: 22,
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