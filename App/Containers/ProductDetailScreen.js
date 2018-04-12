import React, { Component } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import styles from './Styles/ProductDetailScreen';
import { Images } from './../Themes';
import WebViewAutoHeight from '../../App/Components/WebViewAutoHeight';
import { getProductDetail } from '../Redux/ProductRedux';

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
  static navigationOptions = {
    title: I18n.t('product detail'),
  };
  componentWillMount() {
    const productId = this.props.navigation.state.params.productId;
    this.props.getProductDetail(productId, (productDetail) => {
      this.setState({ productDetail });
    });
  }
  renderCard(cardTitle, rowData) {
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>{cardTitle.toUpperCase()}</Text>
        </View>
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
        <ScrollView>
          <View style={{ padding: 10 }}>
            {this.renderCard('Product Information', productDetail)}
          </View>
          <View style={{ padding: 20 }}>
            <WebViewAutoHeight
              source={{ html: `<body>${productDetail.information}</body>` }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getProductDetail: (productId, cb) => { dispatch(getProductDetail(productId, cb)); },
});

export default connect(null, mapDispatchToProps)(ProductDetailScreen);
