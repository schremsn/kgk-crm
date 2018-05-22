import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView } from 'react-native';
import I18n from 'react-native-i18n';
import styles from '../Styles/ContainerStyles';
import { Images, Colors } from '../../Themes/index';
import { getProducts } from '../../Redux/ProductRedux';
import ProgressBar from '../../Components/ProgressBar';
import Header from '../../Components/Header';

class ProductsListScreen extends Component {
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
    if (isRefreshed) {
      this.setState({ isRefreshing: false });
    }
  }
  getProductListNextPage() {
    this.props.getProducts(this.props.offset, (list) => {
      const data = this.state.list;
      list.map(item => data.push(item));
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
      <TouchableOpacity
        onPress={() => {
       if (this.props.isModal) {
         this.props.onSelectProduct(item);
       } else {
         this.props.navigation.navigate('ProductDetailScreen', { productId: item.id });
       }
      }}
        style={styles.sectionHeaderContainer}
      >
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
    const { isLoading, isRefreshing, dataSource } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header
          title={I18n.t('product list')}
          onPress={() => {
          if (this.props.isModal) {
            this.props.onSelectProduct(null);
          } else {
            this.props.navigation.goBack(null);
          }
        }}
        />
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
              style={styles.mainContainer}
              enableEmptySections
              onEndReached={() => this.getProductListNextPage()}
              onEndReachedThreshold={1200}
              dataSource={dataSource}
              renderRow={item => this.renderProduct(item)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              // renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.onRefresh}
                  colors={[Colors.fire]}
                  tintColor={Colors.snow}
                  title={`${I18n.t('loading')}...`}
                  titleColor={Colors.snow}
                  progressBackgroundColor={Colors.snow}
                />
              }
            />
        }
      </View>
    );
  }
}

ProductsListScreen.navigationOptions = {
  title: I18n.t('product list'),
};
ProductsListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getProducts: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  isModal: PropTypes.bool,
  onSelectProduct: PropTypes.func,
};

const mapStateToProps = state => ({
  offset: state.product.offset,
});

const mapDispatchToProps = dispatch => ({
  getProducts: (offset, cb) => { dispatch(getProducts(offset, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsListScreen);
