import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, RefreshControl, ListView } from 'react-native';
import I18n from 'react-native-i18n';
import { getMessages } from '../../Redux/MessageRedux';
import styles from '../Styles/ContainerStyles';
import { Colors } from '../../Themes/index';
import BaseScreen from '../../Components/BaseScreen';

class MessagesListScreen extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      offset: 0,
      fetching: true,
      isRefreshing: false,
      isError: false,
      dataSource: ds.cloneWithRows([]),
    };

    this.getMessages = this.getMessages.bind(this);
    this.getMessagesNextPage = this.getMessagesNextPage.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.getMessages();
  }

  getMessages() {
    getMessages(0)
      .then((list, offset) => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(list);
        this.setState({
          list,
          dataSource,
          fetching: false,
          isRefreshing: false,
          offset,
        });
      })
      .catch((err) => {
        this.setState({ fetching: false, isError: true, isRefreshing: false });
      });
  }
  getMessagesNextPage() {
    setTimeout(() => {
      getMessages(this.state.offset)
        .then((list, offset) => {
          const data = this.state.list;
          list.map(item => data.push(item));
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            offset,
          });
        });
    }, 500);
  }
  onRefresh() {
    this.setState({ isRefreshing: true, isError: false });
    this.getMessages('isRefreshed');
  }
  renderMessage(item) {
    const data = item;
    const channel = this.props.mailChannels.filter(ch => ch.id === item.channel_ids[0])[0];
    data.channel = channel.name || '';
    return (
      <TouchableOpacity style={styles.sectionHeaderContainer} onPress={() => { this.props.navigation.navigate('MessageDetailScreen', { messageDetail: data }); }} >
        <Text style={styles.sectionHeader}>{I18n.t('date')} : {item.date}</Text>
        <Text style={styles.sectionText}>{I18n.t('from')}: {item.email_from}</Text>
        <Text style={styles.sectionText}>{I18n.t('channel')}: {channel && channel.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('message')}: {item.body && item.body.substring(0, 40)}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const {
      fetching, isRefreshing, isError, dataSource,
    } = this.state;
    return (
      <BaseScreen
        fullLoading={fetching}
        isError={isError}
        onRefresh={this.onRefresh}
      >
        <ListView
          style={styles.mainContainer}
          enableEmptySections
          onEndReached={this.getMessagesNextPage}
          onEndReachedThreshold={1200}
          dataSource={dataSource}
          renderRow={item => this.renderMessage(item)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
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
const mapStateToProps = state => ({
  mailChannels: state.auth.mailChannels,
});

const mapDispatchToProps = dispatch => ({
  getMessages: (offset, cb) => { dispatch(getMessages(offset, cb)); },
});
MessagesListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  mailChannels: PropTypes.array.isRequired,
  getMessages: PropTypes.func.isRequired,
};

MessagesListScreen.navigationOptions = {
  title: I18n.t('messages'),
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesListScreen);
