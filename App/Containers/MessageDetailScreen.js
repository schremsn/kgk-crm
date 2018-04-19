import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import styles from './Styles/ProductDetailScreen';
import { Images } from './../Themes';
import WebViewAutoHeight from '../../App/Components/WebViewAutoHeight';

const data = [
  { name: 'id', value: 'Id' },
  { name: 'date', value: I18n.t('date') },
  { name: 'email_from', value: I18n.t('from') },
  { name: 'channel', value: I18n.t('channel') },
];
export default class MessageDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      messageDetail: [],
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }
  componentWillMount() {
    const messageDetail = this.props.navigation.state.params.messageDetail;
    this.setState({ messageDetail });
  }
  renderCard(cardTitle, rowData) {
    return (
      <View>
        {this.renderRows(rowData)}
      </View>
    );
  }
  renderRows(rowData) {
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
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack(null)}
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20
        }}
        >
          <Image source={Images.backButton} />
          <Text style={{ paddingLeft: 30, paddingTop: 10, color: 'white', frontSize: 50, fontWeight: '700'}}>{I18n.t('message detail').toUpperCase()}</Text>
        </TouchableOpacity>
        <ScrollView>
          <View style={{ padding: 10 }}>
            {this.renderCard('Message Information', messageDetail)}
          </View>
          <View style={{ padding: 20 }}>
            <WebViewAutoHeight
              source={{ html: `<body>${messageDetail.body}</body>` }}
              minHeight={500}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
MessageDetailScreen.navigationOptions = {
  title: I18n.t('message detail'),
  tabBarHidden: true,
};
