import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import ProgressBar from '../Components/ProgressBar';
import { getMessages } from '../Redux/MessageRedux';
import styles from './Styles/ProductsListScreenStyle';
import { Images, Metrics } from './../Themes';

class MessagesListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
    };

    this.getMessages = this.getMessages.bind(this);
    this.getMessagesNextPage = this.getMessagesNextPage.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.getMessages();
  }

  getMessages(isRefreshed) {
    this.props.getMessages(50, (list) => {
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
  getMessagesNextPage() {
    this.props.getMessages(this.props.offset, (list) => {
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
    this.getMessages('isRefreshed');
  }
  renderMessage(item) {
    const channel = this.props.mailChannels.filter(ch => ch.id === item.channel_ids[0])[0];
    return (
      <TouchableOpacity style={styles.sectionHeaderContainer} onPress={() => { this.props.navigation.navigate('MessageDetailScreen', { messageDetail: item }); }} >
        <Text style={styles.sectionHeader}>{I18n.t('date')} : {item.date}</Text>
        <Text style={styles.sectionText}>{I18n.t('from')}: {item.email_from}</Text>
        <Text style={styles.sectionText}>{I18n.t('channel')}: {channel && channel.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('message')}: {item.body && item.body.substring(0, 40)}</Text>
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
          this.state.isLoading ? <View style={[styles.progressBar, { height: Metrics.screenHeight }]}><ProgressBar /></View>
            : <ListView
              style={styles.container}
              enableEmptySections
              onEndReached={this.getMessagesNextPage}
              onEndReachedThreshold={1200}
              dataSource={this.state.dataSource}
              renderRow={item => this.renderMessage(item)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
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
  offset: state.message.offset,
  mailChannels: state.auth.mailChannels,
});

const mapDispatchToProps = dispatch => ({
  getMessages: (offset, cb) => { dispatch(getMessages(offset, cb)); },
});
MessagesListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  offset: PropTypes.number.isRequired,
  mailChannels: PropTypes.array.isRequired,
  getMessages: PropTypes.func.isRequired,
};

MessagesListScreen.navigationOptions = {
  title: I18n.t('messages'),
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesListScreen);
