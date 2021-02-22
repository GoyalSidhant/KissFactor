import React, { Component } from "react";
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
  AsyncStorage,
  ActivityIndicator
} from "react-native";
// import { AsyncStorage } from '@react-native-community/async-storage';
import styles from "../styles/DoctreatAppStyles";
import { SwipeRow, List, Content } from "native-base";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import Dash from "react-native-dash";
import Dates from "react-native-dates";
import Moment from "moment";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";
import Spinner from "react-native-loading-spinner-overlay";
import CountDown from "react-native-countdown-component";
import RBSheet from "react-native-raw-bottom-sheet";
class Dashboard extends Component {
  state = {
    isLoading: true,
    data: "",
    storedValue: "",
    storedType: "",
    profileImg: "",
    profileCallSetting: ""
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("full_name");
      const storedType = await AsyncStorage.getItem("user_type");
      const profileImg = await AsyncStorage.getItem("profile_img");
      const locationType = await AsyncStorage.getItem("location_type");
      const profileCallSetting = await AsyncStorage.getItem(
        "user_onCall_booking"
      );
      const login_type = await AsyncStorage.getItem("profileType");
      const id = await AsyncStorage.getItem("projectUid");
      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (storedValue !== null) {
        this.setState({ storedValue });
      } else {
        // alert('something wrong')
      }
      if (storedType !== null) {
        this.setState({ storedType });
      } else {
        //  alert('something wrong')
      }
      if (profileImg !== null) {
        this.setState({ profileImg });
      } else {
        //  alert('something wrong')
      }
      if (profileCallSetting !== null) {
        this.setState({ profileCallSetting });
      } else {
        //  alert('something wrong')
      }
      if (login_type !== null) {
        this.setState({ login_type });
      } else {
        //  alert('something wrong')
      }
      if (id !== null) {
        this.setState({ id });
      } else {
        //  alert('something wrong')
      }
      if (locationType !== null) {
        this.setState({ locationType });
      } else {
        //  alert('something wrong')
      }
      this.fetchBalance();
    } catch (error) {
      // alert(error)
    }
  };

  fetchBalance = async () => {
    const id = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "profile/get_user_dashboard_insights?user_id=" + id
    );
    const json = await response.json();

    this.setState({
      data: json,
      isLoading: false
    });
    console.log(balance);
    Alert.alert("data", JSON.stringify(this.state.data));
  };

  render() {
    const { isLoading, data, storedType } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader headerText="Dashboard" />
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              padding: 10,
              justifyContent: "space-between",
              flexWrap: "wrap"
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("MessagesMain")}
              style={{
                width: "48%",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                borderColor: "#767676",
                borderRadius: 4,
                borderWidth: 0.6,
                paddingVertical: 15,
                backgroundColor: "#fff",
                marginBottom: 10
              }}
            >
              {this.state.data ? (
                <Image
                  resizeMode="cover"
                  style={styles.SpecialitiesAndServicesImageStyle}
                  source={{ uri: data.messages.new_messages_img }}
                />
              ) : null}
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                New Messages
              </Text>
              <Text style={{ fontSize: 14, color: "skyblue" }}>
                Click To View
              </Text>
              {this.state.data ? (
                <View
                  style={{
                    backgroundColor: "red",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: -5,
                    right: -5
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "700",
                      paddingHorizontal: 5,
                      paddingVertical: 2
                    }}
                  >
                    {data.messages.count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
            {storedType == "doctor" && (
              <TouchableOpacity
                onPress={() => this.RBSheet.open()}
                style={{
                  width: "48%",
                  borderColor: "#767676",
                  borderRadius: 4,
                  borderWidth: 0.6,
                  paddingVertical: 15,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  marginBottom: 10
                }}
              >
                <RBSheet
                  ref={ref => {
                    this.RBSheet = ref;
                  }}
                  height={450}
                  duration={250}
                  customStyles={{
                    container: {
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 15,
                      paddingRight: 15,
                      backgroundColor: "transparent",
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6
                    }
                  }}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.getAnswersRBSheetMainArea}
                  >
                    <View
                      style={{
                        backgroundColor: CONSTANT.primaryColor,
                        height: 50,
                        justifyContent: "center"
                      }}
                    >
                      {data ? (
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 20,
                            textAlign: "center",
                            fontWeight: "700"
                          }}
                        >
                          {data.package.title}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_services.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_services.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_downloads.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_downloads.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_articles.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_articles.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_awards.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_awards.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_memberships.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_memberships.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_chat.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_chat.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_bookings.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_bookings.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_featured.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_featured.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_featured_duration.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_featured_duration.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#ddd",
                        borderBottomWidth: 1
                      }}
                    >
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            borderRightColor: "#ddd",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            paddingLeft: 10
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_duration.feature}
                          </Text>
                        </View>
                      ) : null}
                      {data ? (
                        <View
                          style={{
                            width: "50%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: "#000", fontSize: 20 }}>
                            {data.package.features.dc_duration.value}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </ScrollView>
                </RBSheet>
                {this.state.data ? (
                  <CountDown
                    style={{
                      backgroundColor: "red",
                      marginTop: -15,
                      marginBottom: -10,
                      borderBottomLeftRadius: 5,
                      marginLeft: "20%"
                    }}
                    size={10}
                    until={data.package.package_expiry}
                    onFinish={() => alert("Finished")}
                    digitStyle={{}}
                    digitTxtStyle={{ color: "#fff" }}
                    timeLabelStyle={{ color: "red", fontWeight: "bold" }}
                    separatorStyle={{ color: "#fff" }}
                    timeToShow={["D", "H", "M", "S"]}
                    timeLabels={{ m: null, s: null }}
                    showSeparator
                  />
                ) : null}
                {this.state.data ? (
                  <Image
                    resizeMode="cover"
                    style={{
                      margin: 15,
                      width: 35,
                      height: 35,
                      alignSelf: "center",
                      justifyContent: "center"
                    }}
                    source={{ uri: data.package.package_expiry_img }}
                  />
                ) : null}

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    alignSelf: "center",
                    justifyContent: "center"
                  }}
                >
                  Check Package Detail
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    alignSelf: "center",
                    justifyContent: "center"
                  }}
                >
                  Updrage Now
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("FavoriteListing")}
              style={{
                width: "48%",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                borderColor: "#767676",
                borderRadius: 4,
                borderWidth: 0.6,
                paddingVertical: 15,
                backgroundColor: "#fff",
                marginBottom: 10
              }}
            >
              <Image
                resizeMode="cover"
                style={styles.SpecialitiesAndServicesImageStyle}
                source={{
                  uri:
                    "https://houzillo.com/projects/doctreat/wp-content/uploads/2019/08/img-22.png"
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                View Saved items
              </Text>
              <Text style={{ fontSize: 14, color: "skyblue" }}>
                Click To View
              </Text>
            </TouchableOpacity>
            {storedType == "doctor" && (
              <View
                style={{
                  width: "48%",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderColor: "#767676",
                  borderRadius: 4,
                  borderWidth: 0.6,
                  paddingVertical: 15,
                  backgroundColor: "#fff",
                  marginBottom: 10
                }}
              >
                {this.state.data &&
                this.state.data.current_balance.balance_img != "" ? (
                  <Image
                    resizeMode="cover"
                    style={styles.SpecialitiesAndServicesImageStyle}
                    source={{ uri: data.current_balance.balance_img }}
                  />
                ) : (
                  <AntIcon
                    name="shoppingcart"
                    color={"#484848"}
                    size={36}
                    style={{ marginVertical: 15 }}
                  />
                )}

                {this.state.data ? (
                  <Text style={{ fontSize: 18 }}>
                    {data.current_balance.balance}
                  </Text>
                ) : null}

                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Available Balance
                </Text>
              </View>
            )}

            {storedType == "doctor" && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("PostArticle")}
                style={{
                  width: "48%",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderColor: "#767676",
                  borderRadius: 4,
                  borderWidth: 0.6,
                  paddingVertical: 15,
                  backgroundColor: "#fff",
                  marginBottom: 10
                }}
              >
                <Image
                  resizeMode="cover"
                  style={styles.SpecialitiesAndServicesImageStyle}
                  source={{
                    uri:
                      "https://houzillo.com/projects/doctreat/wp-content/uploads/2019/10/list.png"
                  }}
                />
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Add Article
                </Text>
                <Text style={{ fontSize: 14, color: "skyblue" }}>
                  Click To View
                </Text>
              </TouchableOpacity>
            )}
            {storedType == "doctor" && (
              <View
                style={{
                  width: "48%",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderColor: "#767676",
                  borderRadius: 4,
                  borderWidth: 0.6,
                  paddingVertical: 15,
                  backgroundColor: "#fff",
                  marginBottom: 10
                }}
              >
                {this.state.data ? (
                  <Image
                    resizeMode="cover"
                    style={styles.SpecialitiesAndServicesImageStyle}
                    source={{ uri: data.article.published_articles_img }}
                  />
                ) : null}
                {this.state.data ? (
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {data.article.published_articles}
                  </Text>
                ) : null}

                <Text style={{ fontSize: 14 }}>Articles published</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("SpecialitiesAndServices")
              }
              style={{
                width: "48%",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                borderColor: "#767676",
                borderRadius: 4,
                borderWidth: 0.6,
                paddingVertical: 15,
                backgroundColor: "#fff",
                marginBottom: 10
              }}
            >
              <Image
                resizeMode="cover"
                style={styles.SpecialitiesAndServicesImageStyle}
                source={{
                  uri:
                    "https://houzillo.com/projects/doctreat/wp-content/uploads/2019/10/support.png"
                }}
              />
              <Text
                style={{ fontSize: 16, fontWeight: "700", textAlign: "center" }}
              >
                Specialities and Services
              </Text>
              <Text style={{ fontSize: 14 }}>Specialities and Services</Text>
            </TouchableOpacity>
            {storedType == "hospital" && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("TeamListing")}
                style={{
                  width: "48%",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderColor: "#767676",
                  borderRadius: 4,
                  borderWidth: 0.6,
                  paddingVertical: 15,
                  backgroundColor: "#fff",
                  marginBottom: 10
                }}
              >
                <Image
                  resizeMode="cover"
                  style={styles.SpecialitiesAndServicesImageStyle}
                  source={{
                    uri:
                      "https://houzillo.com/projects/doctreat/wp-content/uploads/2019/08/img-18.png"
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    textAlign: "center"
                  }}
                >
                  Manage Team
                </Text>
                <Text style={{ fontSize: 14, color: "skyblue" }}>
                  Click To View
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(Dashboard);
