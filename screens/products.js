import React from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Button } from 'react-native';
import { Container, Content, Card, CardItem, Toast } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import FlatListItemSeparator from './components/listseparator';
import i18n from './translation/i18n';

let that = null;

export default class Products extends React.Component {
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
    tabBarLabel: 'Product',
  };

  renderProduct(item) {
    return (
      <Card>
        <CardItem>
          <Text>test</Text>
        </CardItem>
      </Card>
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
        <Text>Product</Text>
      </View>
    );
  }
}
