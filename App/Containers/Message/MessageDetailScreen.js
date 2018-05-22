import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, Image, Linking } from 'react-native';
import I18n from 'react-native-i18n';
import MyWebView from 'react-native-webview-autoheight';
import styles from '../Styles/ContainerStyles';
import { Images, Metrics } from '../../Themes/index';
import Header from '../../Components/Header';

const customStyle = '<style>* {max-width: 100% } body {font-family: sans-serif;} h1 {color: red;}</style>';

const data = [
  { name: 'id', value: 'Id' },
  { name: 'date', value: I18n.t('date') },
  { name: 'email_from', value: I18n.t('from') },
  { name: 'channel', value: I18n.t('channel') },
];
export default class MessageDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageDetail: props.navigation.state.params.messageDetail,
    };
    this.renderCard = this.renderCard.bind(this);
  }
  renderCard(rowData) {
    return (
      data.map(item => (
        <View key={item.name} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{item.value}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
          </View>
        </View>
      ))
    );
  }
  render() {
    const { messageDetail } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('message detail')} onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView style={styles.mainContainer}>
          {this.renderCard(messageDetail)}
          <View style={{ paddingVertical: Metrics.doubleBaseMargin }}>
            <MyWebView
              ref={(ref) => { this.webview = ref; }}
              source={{ html: customStyle + messageDetail.body }}
              startInLoadingState
              width={Metrics.screenWidth - 40}
              onNavigationStateChange={(event) => {
                if (event.url.slice(0, 14) !== 'data:text/html') {
                  this.webview.stopLoading();
                  Linking.openURL(event.url);
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
MessageDetailScreen.navigationOptions = {
  title: I18n.t('message detail'),
};
MessageDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
