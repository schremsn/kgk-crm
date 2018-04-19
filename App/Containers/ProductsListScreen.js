import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView, Button } from 'react-native';
import I18n from 'react-native-i18n';
import styles from './Styles/ProductsListScreenStyle';
import { Images } from './../Themes';
import ProgressBar from '../Components/ProgressBar';
import { getProducts } from '../Redux/ProductRedux';

class ProductsListScreen extends Component {
  static navigationOptions = {
    title: I18n.t('product list'),
  };
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getProducts: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
    };
    this.getProductList = this.getProductList.bind(this);
    this.getProductListNextPage = this.getProductListNextPage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
  }
  componentWillMount() {
    this.getProductList();
  }
  getProductList(isRefreshed) {
    this.props.getProducts(0, (list) => {
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
      const dataSource = ds.cloneWithRows(list);
      this.setState({
        list,
        dataSource,
        isLoading: false,
      });
    });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }
  getProductListNextPage() {
    this.props.getProducts(this.props.offset, (list) => {
      const data = this.state.list;
      const newData = list;
      newData.map(item => data.push(item));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getProductList('isRefreshed');
  }
  renderProduct(item) {
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProductDetailScreen', { productId: item.id }); }} style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{item.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('code')}: {item.code}</Text>
        <Text style={styles.sectionText}>{I18n.t('description')}: {item.description}</Text>
        <View style={styles.sectionImage}>
          {
            item.image_small && <Image style={styles.thumpImage} source={{ uri: `data:image/png;base64,${item.image_small}` }} />
          }
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View
        style={[styles.container, styles.mainContainer]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            colors={['#EA0000']}
            tintColor="white"
            title={`${I18n.t('loading')}...`}
            titleColor="white"
            progressBackgroundColor="white"
          />
        }
      >
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />

        {
          this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View>
            : <ListView
              style={styles.container}
              enableEmptySections
              onEndReached={() => this.getProductListNextPage()}
              onEndReachedThreshold={1200}
              dataSource={this.state.dataSource}
              renderRow={item => this.renderProduct(item)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              // renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.onRefresh}
                  colors={['#EA0000']}
                  tintColor="white"
                  title={`${I18n.t('loading')}...`}
                  titleColor="white"
                  progressBackgroundColor="white"
                />
              }
            />
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({
  offset: state.product.offset,
});

const mapDispatchToProps = dispatch => ({
  getProducts: (offset, cb) => { dispatch(getProducts(offset, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsListScreen);
