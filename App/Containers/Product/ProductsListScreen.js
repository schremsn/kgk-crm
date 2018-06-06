import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView } from 'react-native';
// libraries
import I18n from 'react-native-i18n';
// components
import BaseScreen from '../../Components/BaseScreen';
// reducers
import { getProducts } from '../../Redux/ProductRedux';
// styles
import { Images, Colors } from '../../Themes/index';
import styles from '../Styles/ContainerStyles';


class ProductsListScreen extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      offset: 0,
      isFetching: true,
      isRefreshing: false,
      isError: false,
      dataSource: ds.cloneWithRows([]),
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
    getProducts(0)
      .then((list, offset) => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(list);
        this.setState({
          dataSource,
          isFetching: false,
          isRefreshing: false,
          offset,
        });
      })
      .catch((e) => {
        this.setState({ isFetching: false, isError: true, isRefreshing: false });
      });
  }
  getProductListNextPage() {
    getProducts(this.state.offset, (list, offset) => {
      const data = this.state.list;
      list.map(item => data.push(item));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        offset,
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true, isError: false });
    this.getProductList('isRefreshed');
  }
  renderProduct(item) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.navigation.state.params.onSelectProduct) {
            this.props.navigation.state.params.onSelectProduct(item);
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
    const {
      isFetching, isRefreshing, dataSource, isError,
    } = this.state;
    return (
      <BaseScreen
        onPress={() => { this.props.navigation.goBack(null); }}
        fullLoading={isFetching}
        isError={isError}
        onRefresh={this.onRefresh}
        title={I18n.t('product list')}
      >
        <ListView
          style={styles.mainContainerModal}
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
      </BaseScreen>
    );
  }
}

ProductsListScreen.navigationOptions = {
  title: I18n.t('product list'),
};
ProductsListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsListScreen);
