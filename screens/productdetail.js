import React from 'react';
import {  Text, View, Button, Image } from 'react-native';
import { Thumbnail, Card, CardItem, Content, Container } from 'native-base';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import i18n from './translation/i18n';

let that = null;

export default class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };

    that = this;
  }

  static navigationOptions = ({ navigation }) => {
    const temp = navigation.state.params.product.name;
    return { headerTitle: temp, tabBarLabel: i18n.t('product') };
  };

  componentWillMount() {
    const id = this.props.navigation.state.params.product.id;
    const dataprovider = DataProvider.getInstance();
    dataprovider.getProductDetail(id)
      .then((data) => {
        this.setState({ product: data });
      })
      .catch((err) => {
        console.log(`error product detail ${err}`);
      });
  }

  onTraining() {
    that.props.navigation.navigate('Web', { url: 'https://www.bing.com' });
  }

  render() {
    if (!this.state.product) {
      return (<Text>Loading</Text>);
    }

    let imgString = 'data:image/png;base64,';
    imgString = imgString.concat(this.state.product.image_small);
    return (
      <Container style={{ padding: 5, marginTop: 20 }}>
        <Content>
          <Card>
            <CardItem header style={{ backgroundColor: 'silver' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('product_information')}</Text>
            </CardItem>
            <CardItem>
              <Thumbnail source={{ uri: imgString }} />
            </CardItem>
            <CardItem header style={{ backgroundColor: 'silver' }}>
              <Text>{this.state.product.description}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Text>Training information</Text>
            </CardItem>
            <CardItem button onPress={this.onTraining} style={{ backgroundColor: 'dodgerblue' }}>
              <Text style={{ textAlign: 'center', width: '100%' }}>{i18n.t('details')}</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}