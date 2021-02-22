import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  navigationOptions,
  CONST,
  TouchableOpacity,
  NativeModules,
  Alert,
  StatusBar,
  Button,
  SafeAreaView,
  ScrollView,
  Easing,
  Animated,
  Image,
  Dimensions,
  Platform,
  ImageBackground,
  Linking,
  Share,
  AsyncStorage,
} from 'react-native';
// import { AsyncStorage } from '@react-native-community/async-storage';
import {mapping, light as lightTheme} from '@eva-design/eva';
import {ApplicationProvider, Layout} from 'react-native-ui-kitten';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerActions} from 'react-navigation-drawer';
import RNRestart from 'react-native-restart';
import Location from './src/Location/Location';
import PreLoader from './src/preLoader/PreLoader';
import DetailDoctorScreen from './src/DetailDoctor/DetailDoctorScreen';
import SearchResultScreen from './src/SearchResult/SearchResultScreen';
import MessagesMain from './src/Messages/MessagesMain';
import MessageDetailLayout from './src/Messages/MessageDetail/MessageDetailLayout';
import PersonalDetail from './src/Profile/PersonalDetail';
import AppoinmentList from './src/Appointment/AppointmentList';
import Home from './src/Home/Home';
import LoginScreen from './src/Authentication/LoginScreen';
import SignupScreen from './src/Authentication/SignupScreen';
import VerificationAccount from './src/Authentication/VerificationAccount';
import AddAwardLayout from './src/Profile/AddAwardLayout';
import AddListCard from './src/Profile/AddListCard';
import SearchQuestions from './src/HealthForum/SearchQuestions';
import HealthForumCard from './src/HealthForum/HealthForumCard';
import SecuritySettings from './src/SecuritySetting/SecuritySettings';
import GetAnswers from './src/HealthForum/GetAnswers';
import ChangePassword from './src/SecuritySetting/ChangePassword';
import DeleteAccount from './src/SecuritySetting/DeleteAccount';
import ArticleListing from './src/BlogListing/ArticleListing';
import MyArticles from './src/BlogListing/MyArticles';
import ArticleDetailPage from './src/BlogListing/ArticleDetailPage';
import AccountSecuritySetting from './src/SecuritySetting/AccountSecuritySetting';
import ManageEmailNotification from './src/SecuritySetting/ManageEmailNotification';
import ArticleListCard from './src/BlogListing/ArticleListCard';
import TeamListing from './src/TeamManagement/TeamListing';
import PostArticle from './src/ArticlePost/PostArticle';
import AwesomeAlert from 'react-native-awesome-alerts';
import AppointmentSettings from './src/Appointment/AppointmentSettings';
import SpecialitiesAndServices from './src/Add Specialities/SpecialitiesAndServices';
import LocationDetail from './src/Appointment/LocationDetail';
import SearchResultTopCategory from './src/SearchResult/SearchResultTopCategory';
import BookAppointment from './src/Appointment/BookAppointment';
import Packages from './src/Buy Packages/Packages';
import BuyPackageWebview from './src/Buy Packages/BuyPackageWebview';
import AppointmentDetailPage from './src/Appointment/AppointmentDetailPage';
import VerifyPasswordForBooking from './src/Appointment/VerifyPasswordForBooking';
import SubmitCode from './src/Appointment/SubmitCode';
import PayAppointmentCheckout from './src/Appointment/PayAppointmentCheckout';
import FavoriteListing from './src/Favorites/FavoriteListing';
import FavDoctors from './src/Favorites/FavDoctors';
import FavHospitals from './src/Favorites/FavHospitals';
import FavArticles from './src/Favorites/FavArticles';
import BookAppointmentCall from './src/Appointment/BookAppointmentCall';
import DoctorAddBooking from './src/Appointment/DoctorAddBooking';
import AddFeedback from './src/Feedback/AddFeedback';
import AppointmentListPatient from './src/Appointment/AppointmentListPatient';
import AboutUs from './src/GeneralPages/AboutUs';
import Contact from './src/GeneralPages/Contact';
import MessageDoctor from './src/DetailDoctor/MessageDoctor';
import InviteHospitals from './src/Appointment/InviteHospitals';
import Prescription from './src/Appointment/Prescription';
import Payout from './src/PayoutSettings/Payout';
import Yourpayouts from './src/PayoutSettings/YourPayouts';
import PayoutSetting from './src/PayoutSettings/PayoutSetting';
import Dashboard from './src/Dashboard/Dashboard';
import axios from 'axios';
import {I18nManager} from 'react-native';
import * as CONSTANT from './src/Constants/Constant';
console.disableYellowBox = true;
const {width} = Dimensions.get('window');

let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });
  const scaleY = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });
  return {
    opacity,
    transform: [{scaleY}],
  };
};

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const {layout, position, scene} = sceneProps;
      const width = layout.initWidth;
      const {index, route} = scene;
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        collapseExpand: CollapseExpand(index, position),
        default: CollapseExpand(index, position, width),
      }[transition];
    },
  };
};

class App extends Component {
  render() {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <SafeAreaView style={{flex: 1}}>
          <AppContainer />
        </SafeAreaView>
      </ApplicationProvider>
    );
  }
}
export default App;

class WelcomeScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#e8f6ff',
        }}>
        {Platform.OS === 'ios' ? (
          <StatusBar hidden />
        ) : (
          <StatusBar backgroundColor="#cc4641" barStyle="light-content" />
        )}

        {/* <Grid>
          <Row size={3}></Row>
          <Row size={1}></Row>
      </Grid> */}
        <View style={{height: '100%'}}>
          <View style={{marginLeft: 20, height: '70%'}}>
            <ImageBackground
              resizeMode="stretch"
              source={require('./Assets/Images/wizardMain.png')}
              style={{width: '100%', height: 416}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}
                style={{
                  alignItems: 'center',
                  height: 40,
                  alignSelf: 'flex-end',
                  borderRadius: 25,
                  width: 80,
                  marginRight: 15,
                  marginTop: 15,
                  backgroundColor: '#3d4461',
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    paddingTop: 10,
                    fontFamily: CONSTANT.PoppinsRegular,
                  }}>
                  {CONSTANT.AppSkip}
                </Text>
              </TouchableOpacity>
              <Image
                style={{
                  width: 180,
                  left: '25%',
                  overflow: 'hidden',
                  resizeMode: 'contain',
                  justifyContent: 'flex-end',
                }}
                source={require('./Assets/Images/WizardLogo.png')}
              />
            </ImageBackground>
          </View>
          <View style={{height: '30%'}}>
            <Image
              style={{
                justifyContent: 'center',
                width: 150,
                height: 100,
                alignSelf: 'center',
                resizeMode: 'center',
              }}
              source={require('./Assets/Images/SplashImage.png')}
            />
            <Text
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 16,
                alignItems: 'center',
                fontFamily: CONSTANT.OpenSansRegular,
              }}>
              {CONSTANT.AppWizardParagraph}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

class CustomDrawerComponent extends Component {
  state = {
    storedValue: '',
    storedType: '',
    profileImg: '',
    type: '',
    id: '',
    showAlert: false,
  };
  componentWillMount() {
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
    } catch (error) {
      // alert(error)
    }
  };
  logoutAlert = () => {
    Alert.alert(CONSTANT.AppConfirm, CONSTANT.AppWantToLogout, [
      {text: CONSTANT.AppYes, onPress: () => this.logout()},
      {text: CONSTANT.AppCancel, onPress: () => this.canceledLogout},
    ]);
  };
  logout = async () => {
    const {id, storedValue, storedType, profileImg, type} = this.state;
    const Uid = await AsyncStorage.getItem('projectUid');
    axios
      .post(CONSTANT.BaseUrl + 'user/do_logout', {
        user_id: Uid,
      })
      .then(async response => {
        console.log('data', id, JSON.stringify(response));
        if (response.status == 200) {
          AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => console.log('success data deleted'));
          this.clearAsyncStorage();
          RNRestart.Restart();
        } else if (response.status == 203) {
          alert(CONSTANT.AppIncorrectDetail);
        }
      })
      .catch(error => {
        alert(CONSTANT.AppIncorrectDetail);
      });
  };
  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  updateAppNotice = () => {
    Alert.alert(
      CONSTANT.AppRateThisApp,
      CONSTANT.AppPleasegiveusFiveStar +
        (Platform.OS == 'ios' ? CONSTANT.Appappstore : CONSTANT.Appplaystore) +
        '.',
      [
        {
          text: CONSTANT.AppRateNow,
          onPress: () => {
            if (Platform.OS == 'ios') {
              Linking.openURL(CONSTANT.APP_STORE_LINK).catch(err =>
                console.error('An error occurred', err),
              );
            } else {
              Linking.openURL(CONSTANT.PLAY_STORE_LINK).catch(err =>
                console.error('An error occurred', err),
              );
            }
          },
        },
      ],
    );
  };
  onClickShare = () => {
    Share.share(
      {
        message: CONSTANT.PLAY_STORE_LINK,
        url: CONSTANT.PLAY_STORE_LINK,
        title: CONSTANT.AppWowdidyouseethat,
      },
      {
        // Android only:
        dialogTitle: CONSTANT.AppShareAppLink,
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
  };
  render() {
    const {storedValue, storedType, profileImg} = this.state;
    return (
      <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
        <View>
          <Image
            style={{
              justifyContent: 'center',
              width: 130,
              height: 80,
              alignSelf: 'center',
              resizeMode: 'center',
            }}
            source={require('./Assets/Images/SplashImage.png')}
          />
          <View
            style={{
              height: 120,
              width: '100%',
              backgroundColor: '#e8f6ff',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{flexDirection: 'row', width: '85%', overflow: 'hidden'}}>
              {storedValue != '' ? (
                <Image
                  source={{uri: `${profileImg}`}}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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',
                  }}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                  }}
                />
              )}

              {storedValue != '' ? (
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '70%',
                    justifyContent: 'center',
                  }}>
                  {}
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#55acee',
                      fontSize: 10,
                      marginLeft: 10,
                      fontFamily: CONSTANT.PoppinsRegular,
                    }}>
                    {storedType}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: CONSTANT.primaryColor,
                      fontSize: 13,
                      marginLeft: 10,
                      fontFamily: CONSTANT.PoppinsMedium,
                    }}>
                    {storedValue}
                  </Text>
                </View>
              ) : (
                <View style={{flexDirection: 'column', marginTop: 20}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#55acee',
                      fontSize: 10,
                      marginLeft: 10,
                      fontFamily: CONSTANT.PoppinsRegular,
                    }}>
                    {CONSTANT.AppGuest}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#v',
                      fontSize: 13,
                      marginLeft: 10,
                      fontFamily: CONSTANT.PoppinsMedium,
                    }}>
                    {CONSTANT.AppGreetings}
                  </Text>
                </View>
              )}
            </View>
            <View style={{width: '15%'}}>
              <View
                style={{
                  borderRadius: 15,
                  height: 30,
                  width: 30,
                  backgroundColor: '#fe736e',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntIcon
                  name={I18nManager.isRTL ? 'left' : 'right'}
                  color={'#fff'}
                  size={15}
                />
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 20}}>
          {storedType != '' && (
            <View style={{marginLeft: 25, flexDirection: 'row', marginTop: 20}}>
              <AntIcon name="user" color={'#3d4461'} size={20} />
              <Text
                style={{
                  marginLeft: 10,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 17,
                }}>
                {CONSTANT.AppDashboard}
              </Text>
            </View>
          )}
          {storedType != '' && (
            <View
              style={{
                marginTop: 20,
                borderBottomColor: '#dddddd',
                borderBottomWidth: 0.6,
              }}
            />
          )}
          {storedType != '' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('Dashboard')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.DrawerDashboard}
              </Text>
            </View>
          )}
          {storedType == 'doctor' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('AppointmentSettings')
                }
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppAppointmentSettings}
              </Text>
            </View>
          )}
          {storedType == 'doctor' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('AppoinmentList')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppAppointmentListing}
              </Text>
            </View>
          )}

          {storedType == 'regular_user' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('AppointmentListPatient')
                }
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppAppointmentListing}
              </Text>
            </View>
          )}

          {storedType == 'doctor' || storedType == 'hospital' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('SpecialitiesAndServices')
                }
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppSpecialitiesServices}
              </Text>
            </View>
          )}
          {storedType == 'doctor' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('PayoutSetting')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppPayoutSetting}
              </Text>
            </View>
          )}

          {storedType == 'doctor' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('Packages')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppPackages}
              </Text>
            </View>
          )}

          {storedType != '' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('FavoriteListing')
                }
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppFavorites}
              </Text>
            </View>
          )}

          {storedType != '' && storedType != 'hospital' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('MessagesMain')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppInbox}
              </Text>
            </View>
          )}

          {storedType == 'hospital' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('TeamListing')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppManageTeam}
              </Text>
            </View>
          )}

          {storedType == '' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('LoginScreen')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppLogin}
              </Text>
            </View>
          )}

          {
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('SearchQuestions')
                }
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppHealthForum}
              </Text>
            </View>
          }
          {
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('ArticleListing')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppBlogList}
              </Text>
            </View>
          }
          {storedType == 'doctor' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('MyArticles')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppMyArticles}
              </Text>
            </View>
          )}
          {storedType == 'doctor' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                onPress={() => this.props.navigation.navigate('PostArticle')}
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.AppPostArticle}
              </Text>
            </View>
          )}
          <View style={{marginLeft: 25, marginTop: 20, flexDirection: 'row'}}>
            <AntIcon name="notification" color={'#3d4461'} size={20} />
            <Text
              style={{
                marginLeft: 10,
                color: '#3d4461',
                fontFamily: CONSTANT.PoppinsMedium,
                fontSize: 17,
              }}>
              {CONSTANT.AppGeneral}
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              borderBottomColor: '#dddddd',
              borderBottomWidth: 0.6,
            }}
          />

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AboutUs')}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                  marginTop: 20,
                }}>
                {CONSTANT.DrawerAboutus}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.updateAppNotice()}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.DrawerRateApp}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onClickShare()}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.DrawerInviteFriends}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Contact')}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  marginLeft: 55,
                  color: '#3d4461',
                  fontFamily: CONSTANT.PoppinsMedium,
                  fontSize: 15,
                }}>
                {CONSTANT.DrawerContact}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={{height: 70, backgroundColor: '#e8f6ff'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 25,
              marginLeft: 25,
              alignSelf: 'flex-start',
            }}>
            {storedType != '' ? (
              <TouchableOpacity onPress={this.logoutAlert}>
                <AntIcon name="poweroff" color={'#fe736e'} size={20} />
              </TouchableOpacity>
            ) : null}

            {storedType != '' ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SecuritySettings')
                }>
                <AntIcon
                  name="setting"
                  color={'#3d4461'}
                  size={20}
                  style={{
                    marginLeft: 25,
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          {/* <Text
            style={{
              alignSelf: 'flex-end',
              textAlign: 'center',
              color: '#3d4461',
              marginRight: 10,
              marginTop: -10,
            }}>
            ver 1.0.0
          </Text> */}
        </View>
      </SafeAreaView>
    );
  }
}

class CustomBottomSheetComponent extends Component {
  state = {
    storedValue: '',
    storedType: '',
    profileImg: '',
    type: '',
    id: '',
    showAlert: false,
  };
  componentWillMount() {
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
        //  alert('something wrong')
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
    } catch (error) {
      // alert(error)
    }
  };
  toggleDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  };
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  MoveProfileSetting = () => {
    const {storedValue, storedType, profileImg} = this.state;
    if (storedType != '') {
      this.props.navigation.navigate('PersonalDetail');
    } else {
      Alert.alert('Sorry', 'Please Login First');
    }
  };
  MoveSecuritySetting = () => {
    const {storedValue, storedType, profileImg} = this.state;
    if (storedType != '') {
      this.props.navigation.navigate('SecuritySettings');
    } else {
      Alert.alert('Sorry', 'Please Login First');
    }
  };
  MoveMessageScreen = () => {
    const {storedValue, storedType, profileImg} = this.state;
    if (storedType != '') {
      this.props.navigation.navigate('MessagesMain');
    } else {
      Alert.alert('Sorry', 'Please Login First');
    }
  };
  render() {
    const {showAlert} = this.state;
    // const { storedValue, storedType, profileImg } = this.state;
    return (
      <SafeAreaView
        ref={c => {
          this.scroll = c;
        }}>
        <View style={{borderBottomColor: '#dddddd', borderBottomWidth: 0.6}} />
        <View
          style={{
            height: 50,
            width: '100%',
            backgroundColor: '#fff',
            flexDirection: 'row',
            overflow: 'visible',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.toggleDrawer}
            style={{
              width: '17.5%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            <View>
              <AntIcon
                name="menufold"
                color={'#3d4461'}
                size={17}
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginTop: 2,
                  marginLeft: 2,
                  marginRight: 1,
                }}
              />
            </View>
          </TouchableOpacity>

          <View style={{borderLeftColor: '#dddddd', borderLeftWidth: 0.6}} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.MoveMessageScreen}
            style={{
              width: '17.5%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            <View>
              <AntIcon
                name="message1"
                color={'#323232'}
                size={17}
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginTop: 2,
                  marginLeft: 2,
                  marginRight: 1,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: '30%',
              height: 70,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              backgroundColor: '#3fabf3',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              textAlign: 'center',
              elevation: 3,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowColor: '#000',
            }}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchResultScreen', {
                    title: '',
                    selectedItem: '',
                    location: '',
                    Speciality: '',
                  })
                }
                style={{flexDirection: 'column'}}>
                <AntIcon
                  name="search1"
                  color={'#ffffff'}
                  size={17}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 2,
                    marginLeft: 2,
                    marginRight: 1,
                  }}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontFamily: CONSTANT.PoppinsMedium,
                  }}>
                  {CONSTANT.AppBottomSheetSearch}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View
            style={{
              width: '17.5%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            <AntIcon
              name="setting"
              color={'#323232'}
              onPress={this.MoveSecuritySetting}
              size={17}
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                marginTop: 2,
                marginLeft: 2,
                marginRight: 1,
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.MoveProfileSetting}
            style={{
              width: '17.5%',
              backgroundColor: '#fe736e',
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                  top: 10,
                }}>
                {this.state.storedType != '' ? (
                  <Image
                    source={{uri: `${this.state.profileImg}`}}
                    resizeMode={'cover'}
                    style={{
                      borderRadius: 15,
                      height: 30,
                      width: 30,
                      borderWidth: 1,
                      borderColor: '#fff',
                      marginRight: 5,
                    }}
                  />
                ) : (
                  <Image
                    resizeMode={'cover'}
                    style={{
                      borderRadius: 15,
                      height: 30,
                      width: 30,
                      borderWidth: 1,
                      borderColor: '#fff',
                      marginRight: 5,
                    }}
                    source={{
                      uri:
                        'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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',
                    }}
                  />
                )}

                <AntIcon
                  name={I18nManager.isRTL ? 'doubleleft' : 'doubleright'}
                  color={'#fff'}
                  size={13}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 2,
                    marginLeft: 2,
                    marginRight: 1,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const DashboardTabNavigator = createBottomTabNavigator(
  {
    // MainNavigator: MainDrawer},{
    Home: {
      screen: Home,
    },
    // SearchResultScreen:{
    //   screen:SearchResultScreen
    // },
  },
  {
    navigationOptions: ({navigation}) => {
      const {routeName} = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
      };
    },
    tabBarComponent: CustomBottomSheetComponent,
    tabBarOptions: {
      activeTintColor: '#ff5851',
    },
  },
  {
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    // transitionConfig: TransitionConfiguration
  },
);

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator,
    CustomBottomSheetComponent: CustomBottomSheetComponent,
    PreLoader: PreLoader,
    Location: Location,
    SearchResultScreen: SearchResultScreen,
    DetailDoctorScreen: DetailDoctorScreen,
    CustomDrawerComponent: CustomDrawerComponent,
    MessagesMain: MessagesMain,
    MessageDetailLayout: MessageDetailLayout,
    PersonalDetail: PersonalDetail,
    AppoinmentList: AppoinmentList,
    LoginScreen: LoginScreen,
    SignupScreen: SignupScreen,
    VerificationAccount: VerificationAccount,
    AddAwardLayout: AddAwardLayout,
    AddListCard: AddListCard,
    SearchQuestions: SearchQuestions,
    HealthForumCard: HealthForumCard,
    SecuritySettings: SecuritySettings,
    GetAnswers: GetAnswers,
    ManageEmailNotification: ManageEmailNotification,
    AccountSecuritySetting: AccountSecuritySetting,
    DeleteAccount: DeleteAccount,
    ChangePassword: ChangePassword,
    ArticleListing: ArticleListing,
    MyArticles: MyArticles,
    ArticleListCard: ArticleListCard,
    ArticleDetailPage: ArticleDetailPage,
    TeamListing: TeamListing,
    PostArticle: PostArticle,
    SpecialitiesAndServices: SpecialitiesAndServices,
    AppointmentSettings: AppointmentSettings,
    LocationDetail: LocationDetail,
    SearchResultTopCategory: SearchResultTopCategory,
    BookAppointment: BookAppointment,
    Packages: Packages,
    BuyPackageWebview: BuyPackageWebview,
    AppointmentDetailPage: AppointmentDetailPage,
    VerifyPasswordForBooking: VerifyPasswordForBooking,
    SubmitCode: SubmitCode,
    PayAppointmentCheckout: PayAppointmentCheckout,
    FavoriteListing: FavoriteListing,
    FavDoctors: FavDoctors,
    FavHospitals: FavHospitals,
    FavArticles: FavArticles,
    BookAppointmentCall: BookAppointmentCall,
    AddFeedback: AddFeedback,
    AppointmentListPatient: AppointmentListPatient,
    AboutUs: AboutUs,
    Contact: Contact,
    MessageDoctor: MessageDoctor,
    DoctorAddBooking: DoctorAddBooking,
    InviteHospitals: InviteHospitals,
    Prescription: Prescription,
    Payout: Payout,
    Yourpayouts: Yourpayouts,
    PayoutSetting: PayoutSetting,
    Dashboard: Dashboard,
  },
  {
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    // transitionConfig: TransitionConfiguration
  },
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    Dash: {screen: DashboardStackNavigator},
  },
  {
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    drawerPosition: I18nManager.isRTL ? 'right' : 'left',
    //  transitionConfig: TransitionConfiguration,
    overlayColor: 'rgba(0, 0, 0, 0.7)',
    contentComponent: CustomDrawerComponent,
    contentOptions: {
      activeTintColor: '#ff5851',
    },
  },
);

const AppSwitchNavigator = createSwitchNavigator(
  {
    PreLoader: {screen: PreLoader},
    Welcome: {screen: WelcomeScreen},
    Dashboard: {screen: AppDrawerNavigator},
  },
  {
    headerMode: 'none',
    initialRouteName: 'PreLoader',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
      gesturesEnabled: false,
    },
    gesturesEnabled: false,
    transitionConfig: TransitionConfiguration,
  },
);

const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
