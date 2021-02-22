import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  ImageBackground,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
// import { AsyncStorage } from '@react-native-community/async-storage';
import styles from '../styles/DoctreatAppStyles';
import {SwipeRow, List, Content} from 'native-base';
import {Input, InputProps, Button} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {withNavigation, DrawerActions} from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import Dash from 'react-native-dash';
import SwipeCards from 'react-native-swipeable-cards';
import * as CONSTANT from '../Constants/Constant';
import TeamListCard from './TeamListCard';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const horizontalMargin = 10;
const slideWidth = 280;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 200;
class TeamListing extends Component {
  constructor(props) {
    super(props);
    this.approveDoctor = this.approveDoctor.bind(this);
    this.state = {
      isLoading: true,
      outOfCards: false,
      storedValue: '',
      storedType: '',
      profileImg: '',
      type: '',
      id: '',
      pendingTeamId: '',
      showAlert: false,
      TopRatedData: [],
      isDateTimePickerVisible: false,
      current_date: '',
      selected_date: '',
      entries: [{title: 'hello'}, {title: 'world'}],
    };
  }

  componentDidMount() {
    this.getUser();
  }
  getUser = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('full_name');
      const storedType = await AsyncStorage.getItem('user_type');
      const profileImg = await AsyncStorage.getItem('profile_img');
      const type = await AsyncStorage.getItem('profileType');
      const id = await AsyncStorage.getItem('projectUid');
      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (storedValue !== null) {
        this.setState({storedValue});
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({storedType});
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({profileImg});
      } else {
        //  alert('something wrong')
      }
      if (type !== null) {
        this.setState({type});
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({id});
      } else {
        //  alert('something wrong')
      }
      this.fetchPendingTeamListing();
      this.fetchTeamListing();
    } catch (error) {
      // alert(error)
    }
  };
  fetchTeamListing = async () => {
    const {id, current_date} = this.state;

    const response = await fetch(
      CONSTANT.BaseUrl + 'team/get_listing?user_id=' + id,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({TeamPendingData: [], isLoading: false}); // empty data set
    } else {
      this.setState({TeamPendingData: json, isLoading: false});
    }
  };
  fetchPendingTeamListing = async () => {
    console.log('i am in ');
    const {id, current_date} = this.state;

    const response = await fetch(
      CONSTANT.BaseUrl + 'team/get_listing?status=pending&user_id=' + id,
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({TeamPendingListData: [], isLoading: false}); // empty data set
    } else {
      this.setState({TeamPendingListData: json, isLoading: false});
      console.log('Data:', JSON.stringify(TeamPendingListData));
      Alert.alert('Data:', JSON.stringify(TeamPendingListData));
    }
  };

  approveDoctor = async ID => {
    axios
      .post(CONSTANT.BaseUrl + 'team/update_status', {
        id: ID,
        status: 'publish',
      })
      .then(async response => {
        if (response.status === 200) {
          alert(response.data.message);
        } else if (response.status === 203) {
          alert(response.data.message);
        }
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };

  rejectDoctor = async ID => {
    axios
      .post(CONSTANT.BaseUrl + 'team/update_status', {
        id: ID,
        status: 'trash',
      })
      .then(async response => {
        if (response.status === 200) {
          alert(response.data.message);
        } else if (response.status === 203) {
          alert(response.data.message);
        }
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };
  _renderItem({item, index}) {
    return (
      <View>
        <View style={styles.teamListingRenderItem}>
          <Image
            style={styles.teamListingRenderItemImageStyle}
            source={{uri: item.image}}
          />
          <Text
            numberOfLines={1}
            style={styles.teamListingRenderItemName}>
            {item.name}
          </Text>
          <Text style={styles.teamListingRenderItemRequest}>
            {CONSTANT.TeamManagementNewRequest}
          </Text>
        </View>
        <View
          style={styles.teamListingTouchableArea}>
          <TouchableOpacity
            onPress={() => this.rejectDoctor(item.ID)}
            style={styles.teamListingTouchableReject}>
            <AntIcon name="close" color={'#fff'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.approveDoctor(item.ID)}
            style={styles.teamListingTouchableApprove}>
            <AntIcon name="check" color={'#fff'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.teamListingcontainer}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={CONSTANT.TeamManagementHeaderText} />
        {isLoading  ? (
            <View style={styles.ActivityIndicatorAreaStyle}>
              <ActivityIndicator
                size="small"
                color={CONSTANT.primaryColor}
                style={styles.ActivityIndicatorStyle}
              />
            </View>
          ) : null}
        <ScrollView>
          <View style={styles.teamListingTopRatedCardManagment}>
            {this.state.TeamPendingListData ? (
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.TeamPendingListData}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                inactiveSlideScale={1}
                slideStyle={styles.teamListingCarousalSlideStyle}
              />
            ) : null}
          </View>
          <Text
            style={styles.teamListingSectionText}>
            {CONSTANT.TeamManagementSectionText}
          </Text>
          <View style={styles.teamListingTopRatedCardManagment}>
            {this.state.TeamPendingData && (
              <FlatList
                style={styles.teamListingFlatListStyle}
                data={this.state.TeamPendingData}
                ListEmptyComponent={this._listEmptyComponent}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity activeOpacity={0.9}>
                    <TeamListCard
                      TeamImage={{uri: `${item.image}`}}
                      status={`${entities.decode(item.status)}`}
                      name={`${entities.decode(item.name)}`}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(TeamListing);
