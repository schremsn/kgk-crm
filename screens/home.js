import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';
import SignInScreen from './signin';

let that = null;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {    
            loading: false,    
            data: [],        
            error: null,    
            refreshing: true,
            signedin: false,    
        };  

        that  = this;
    }

    static navigationOptions = {
        tabBarLabel: 'Home',
    };

    componentDidMount() {    
        console.log('home mounted');   
    }

    isSignedIn() {
        return this.state.signedin;
    }

    getActivities() {
        let dataprovider = DataProvider.getInstance();
        dataprovider.getActivities()
          .then( data => {
            console.log( 'got activities: ' + data);
            that.setState({data: data});
            that.setState( {signedin: true} );
          })
          .catch( err => {
            console.log( 'error activities: ' + err);
          });
    }

    renderActivity(item) {  
        return (
            <View>
                <Text style={styles.item}>{item.display_name}</Text>
                <Text style={styles.item}>{item.description}</Text>
                <Text style={styles.item}>{item.body}</Text>
                <Text style={styles.item}>{item.create_date}</Text>
                <Text style={styles.item}>{item.message_type}</Text>
                <Text style={styles.item}>{item.channel_id}</Text>
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
        if( !this.isSignedIn() ) {
            return(
                <SignInScreen done = {this.getActivities}/>
            )
        }
        else if( this.state.data.length == 0 ) {
            console.log('render home if');
            return (
                <View style={styles.container}>
                    <Text>Nothing to do</Text>
                </View>
            )
        }
        else {
            console.log('render home else');
            return (
                <View style={styles.container}>
                <FlatList
                    data = {this.state.data}
                    ItemSeparatorComponent = {this.FlatListItemSeparator}
                    keyExtractor={(item, index) => index}
                    renderItem={({item}) => this.renderActivity(item)}
                />        
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
  });


  
