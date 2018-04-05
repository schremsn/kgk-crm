import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'

import { Images } from '../Themes'
import RoundedButton from '../../App/Components/RoundedButton'

// Styles
import styles from './Styles/ProductsListScreenStyle'

export default class MoreScreen extends Component {
  static navigationOptions = {
    title: 'More'
  };
  render () {
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Text>1234</Text>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <View style={styles.sectionHeaderContainer}>
          <RoundedButton onPress={() => this.props.navigation.navigate('WebViewScreen')}>
            Sign out
          </RoundedButton>
        </View>
      </View>
    )
  }
}
