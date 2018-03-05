import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Thumbnail, Card, CardItem } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import FlatListItemSeparator from './components/listseparator';
import i18n from './translation/i18n';

let that = null;

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      productList: [],
    };

    this.offset = 0;

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: i18n.t('product'),
  };

  componentWillMount() {
    this.getProducts();
  }

  refresh() {
    that.setState({ refreshing: true });
    that.getProducts();
    that.setState({ refreshing: false });
  }

  getProducts() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getProducts(0)
      .then((data) => {
        this.setState({ productList: data });
      })
      .catch((err) => {
        console.log(`Error getProducts ${err}`);
      });
  }


  renderProduct(item) {
    let imgString = 'data:image/png;base64,';
    imgString = imgString.concat(item.image_small);
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.navigation.navigate('ProductDetail', { product: item });
        }}
      >
        <Card>
          <CardItem>
            <Text>Name: {item.name}</Text>
          </CardItem>
          <CardItem>
            <Text>Description: {item.description}</Text>
          </CardItem>
          <CardItem>
            <Text>Sales description:: {item.description_sale}</Text>
          </CardItem>
          <CardItem>
            <Thumbnail source={{uri: imgString}} />
          </CardItem>
        </Card>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
          initialNumToRender={10}
          data={this.state.productList}
          ItemSeparatorComponent={FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderProduct(item)}
        />
      </View>
    );
  }
}
