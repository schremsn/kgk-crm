import React, { Component } from 'react'
import { TouchableOpacity, WebView, Image, View } from 'react-native'

import { Images } from './DevTheme'

// Styles
import styles from './Styles/ProductsListScreenStyle'

export default class WebViewScreen extends Component {
  render () {
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
          position: 'absolute',
          paddingTop: 30,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Image source={Images.backButton} />
        </TouchableOpacity>
        <WebView
          source={{uri: 'https://www.bing.com/'}}
        />
      </View>
    )
  }
}
