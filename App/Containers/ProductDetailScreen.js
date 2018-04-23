import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, ScrollView, Text, Image, Linking } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import MyWebView from 'react-native-webview-autoheight';
import styles from './Styles/ProductDetailScreen';
import { Images, Metrics } from './../Themes';
import { getProductDetail } from '../Redux/ProductRedux';
import Header from '../Components/Header';

const customStyle = '<style>* {max-width: 100% } body {font-family: sans-serif;} h1 {color: red;}</style>';

const data = [
  { name: 'id', value: 'Id' },
  { name: 'name', value: I18n.t('name') },
  { name: 'code', value: I18n.t('code') },
  { name: 'description', value: I18n.t('description') },
  { name: 'image_small', value: I18n.t('image') }];
class ProductDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      productDetail: [],
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }
  componentWillMount() {
    const { productId } = this.props.navigation.state.params;
    this.props.getProductDetail(productId, (productDetail) => {
      this.setState({ productDetail });
    });
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
      data.map(item => (<View key={item.name} style={styles.rowContainer}>
        <View style={styles.rowLabelContainer}>
          <Text style={styles.rowLabel}>{item.value}</Text>
        </View>
        <View style={styles.rowInfoContainer}>
          {
            item.value === I18n.t('image')
              ? <Image source={{ uri: `data:image/png;base64,${rowData[item.name]}` }} style={{ width: 100, height: 100, marginBottom: 10 }} />
              : <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
          }
        </View>
      </View>))
    );
  }
  render() {
    const { productDetail } = this.state;
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title="product detail" onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView>
          <View style={{ padding: 10 }}>
            {this.renderCard('Product Information', productDetail)}
          </View>
          <View style={{ padding: 20 }}>
            <MyWebView
              ref={(ref) => { this.webview = ref; }}
              source={{ html: customStyle + productDetail.information }}
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

ProductDetailScreen.navigationOptions = {
  title: I18n.t('product detail'),
};
ProductDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getProductDetail: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getProductDetail: (productId, cb) => { dispatch(getProductDetail(productId, cb)); },
});

export default connect(null, mapDispatchToProps)(ProductDetailScreen);
