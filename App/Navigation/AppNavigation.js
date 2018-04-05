import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation'
import { ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View } from 'react-native'
import { Colors } from '../Containers/DevTheme'

import LoginScreen from '../Containers/LoginScreen'
import ProductsListScreen from '../Containers/ProductsListScreen'
import ProductDetailScreen from '../Containers/ProductDetailScreen'
import WebViewScreen from '../Containers/WebViewScreen'
import MoreScreen from '../Containers/MoreScreen'
import MessagesListScreen from '../Containers/MessagesListScreen'

class AuthLoadingScreen extends React.Component {
  constructor () {
    super()
    this._bootstrapAsync()
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('token')
    console.log(userToken)
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth')
  };

  // Render any loading content that you like here
  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ProductStack = StackNavigator({
  ProductsListScreen: { screen: ProductsListScreen },
  ProductDetailScreen: { screen: ProductDetailScreen },
  WebViewScreen: { screen: WebViewScreen },
  MessagesListScreen: { screen: MessagesListScreen },
  MoreScreen: { screen: MoreScreen }
})
const MoreStack = StackNavigator({
  MoreScreen: { screen: MoreScreen }
})

const AppStack = TabNavigator({
  Products: { screen: ProductStack },
  MessagesListScreen: { screen: MessagesListScreen },
  MoreScreen: { screen: MoreScreen }
},
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Products') {
          iconName = `ios-list-box${focused ? '' : '-outline'}`
        } else if (routeName === 'MessagesListScreen') {
          iconName = `ios-mail${focused ? '' : '-outline'}`
        } else if (routeName === 'MoreScreen') {
          iconName = `ios-options${focused ? '' : '-outline'}`
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false
  })
const AuthStack = StackNavigator(
  { LoginScreen: LoginScreen },
  {
    // Default config for all screens
    initialRouteName: 'LoginScreen',
    headerMode: 'none'
  })

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)
