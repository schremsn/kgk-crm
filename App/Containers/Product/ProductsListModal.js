import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, RefreshControl, ListView } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/ContainerStyles';
import { Colors } from '../../Themes/index';
import { getProducts } from '../../Redux/ProductRedux';
import ProgressBar from '../../Components/ProgressBar';

class ProductsListModal extends Component {
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
        onPress={() => this.props.onSelectProduct(item)}
        activeOpacity={0.9}
        style={styles.sectionHeaderContainerModal}
      >
        <Text style={styles.sectionHeaderModal}>{item.name}</Text>
        <Text style={styles.sectionTextModal}>{I18n.t('code')}: {item.code}</Text>
        <Text style={styles.sectionTextModal}>{I18n.t('description')}: {item.description}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const { isLoading, isRefreshing, dataSource } = this.state;
    return (
      <View style={styles.containerModal}>
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
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
        }
        <TouchableOpacity
          style={[styles.buttonBoxModal]}
          onPress={() => this.props.onSelectProduct(null)}
        >
          <View style={styles.button}>
            <Ionicons name="ios-arrow-down-outline" size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
ProductsListModal.propTypes = {
  navigation: PropTypes.object.isRequired,
  getProducts: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  onSelectProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  offset: state.product.offset,
});

const mapDispatchToProps = dispatch => ({
  getProducts: (offset, cb) => { dispatch(getProducts(offset, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsListModal);
