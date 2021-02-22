import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  FlatList,
  NativeModules,
  TextInput,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
// import { AsyncStorage } from '@react-native-community/async-storage';
import styles from "../styles/DoctreatAppStyles";
import AntIcon from "react-native-vector-icons/AntDesign";
import RNRestart from "react-native-restart";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";
import CustomHeader from "../Header/CustomHeader";
import TopRatedCard from "../Home/TopRatedCard";
import { withNavigation } from "react-navigation";
import { ScrollableTabView } from "@valdio/react-native-scrollable-tabview";
import { Button } from "native-base";
import StarRating from "react-native-star-rating";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class FavHospitals extends Component {
  state = {
    data: [],
    TopRatedData: [],
    isLoading: true,
  };

  componentDidMount() {
    this.fetchFavhospitalsData();
  }
  fetchFavhospitalsData = async () => {
    const id = await AsyncStorage.getItem("projectProfileId");
    const response = await fetch(
      CONSTANT.BaseUrl +
        "user/get_wishlist?profile_id=" +
        id +
        "&type=hospitals"
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ TopRatedData: [], isLoading: false }); // empty data set
    } else {
      this.setState({ TopRatedData: json, isLoading: false });
    }
  };
  DeleteRecord = async (itemID) => {
    this.setState({
      isLoading: true,
    });
    const Uid = await AsyncStorage.getItem("projectUid");
    axios
      .post(CONSTANT.BaseUrl + "profile/delete_saved_items", {
        item_id: itemID,
        user_id: Uid,
        item_type: "_saved_hospitals",
      })
      .then(async (response) => {
        if (response.status === 200) {
          Alert.alert("Success", JSON.stringify(response.data.message));
          this.setState({ isLoading: false });
          this.fetchFavDoctorsData();
        } else if (response.status === 203) {
          Alert.alert("Oops", JSON.stringify(response.data.message));
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error);
      });
  };
  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.favHospitalsContainer}>
        {isLoading ? (
          <View style={styles.ActivityIndicatorAreaStyle}>
            <ActivityIndicator
              size="small"
              color={CONSTANT.primaryColor}
              style={styles.ActivityIndicatorStyle}
            />
          </View>
        ) : null}
        <View style={styles.favHospitalsTopRatedCardManagment}>
          {this.state.TopRatedData.length >= 1 ? (
            <FlatList
              style={{marginTop:10}}
              data={this.state.TopRatedData}
              ListEmptyComponent={this._listEmptyComponent}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  // onPress = { () => this.props.navigation.navigate("DetailDoctorScreen", {doc_id: item.ID})}
                  onPress={() => {
                    this.props.navigation.navigate("DetailDoctorScreen", {
                      itemId: item.ID,
                    });
                  }}
                  style={styles.TopRatedCardcontainer}
                >
                  {/* <TopRatedCard
                    profileImage={{uri: `${item.image}`}}
                    specialities={`${entities.decode(item.specialities.name)}`}
                    name={`${entities.decode(item.name)}`}
                    sub_heading={`${entities.decode(item.sub_heading)}`}
                    total_rating={`${entities.decode(item.total_rating)}`}
                    average_rating={`${entities.decode(item.average_rating)}`}
                    featured_check={`${entities.decode(item.featured)}`}
                    verified={`${entities.decode(item.is_verified)}`}
                    verified_medically={`${entities.decode(item.is_verified)}`}
                    role={`${entities.decode(item.role)}`}
                  /> */}
                        <View style={{ flexDirection: "row", width: "85%", alignItems:"center" }}>
                          <View style={styles.ImageLayoutStyle}>
                            <Image
                              resizeMode="contain"
                              style={styles.ImageStyle}
                              source={{ uri: item.image }}
                            />
                            {item.featured == "yes" && (
                              <View style={styles.topRatedCardArea} />
                            )}
                            {item.featured == "yes" && (
                              <Image
                                resizeMode={"contain"}
                                style={styles.topRatedCardImage}
                                source={require("../../Assets/Images/featured.png")}
                              />
                            )}
                          </View>
                          <View style={styles.docContentstyle}>
                            <Text style={styles.titleStyle}>
                              {item.specialities.name}
                            </Text>
                            <View style={styles.topRatedCardName}>
                              <Text style={styles.DocName}>{item.name}</Text>
                              {item.is_verified == "yes" && (
                                <AntIcon
                                  name="star"
                                  color={"#3fabf3"}
                                  size={13}
                                  style={styles.topRatedCardIconOne}
                                />
                              )}

                              {item.is_verified == "yes" && (
                                <AntIcon
                                  name="checkcircle"
                                  color={"#1abc9c"}
                                  size={12}
                                  style={styles.topRatedCardIconTwo}
                                />
                              )}
                            </View>
                            <Text style={styles.topRatedCardTextOne}>
                              {item.sub_heading}
                            </Text>
                            <View style={styles.topRatedStarArea}>
                              <View style={{ flexDirection: "row" }}>
                                {item.total_rating != null ?
                                  <Text style={styles.topRatedCardTextTwo}>
                                    {item.total_rating}
                                  </Text>
                                  :
                                  <Text style={styles.topRatedCardTextTwo}>
                                    0
                                  </Text>
                                }
                                <Text style={styles.topRatedCardTextTwo}>
                                  {CONSTANT.TopRatedCardFeedback}
                                </Text>
                              </View>

                              <StarRating
                                disabled={true}
                                maxStars={5}
                                starSize={13}
                                fullStarColor={"#fecb02"}
                                emptyStarColor={"#fecb02"}
                                rating={item.average_rating}
                                selectedStar={(rating) =>
                                  this.onStarRatingPress(rating)
                                }
                              />
                            </View>
                          </View>
                        </View>
                        <View style={{ width: "15%", height: "100%", alignItems:'flex-end', justifyContent: 'center', }}>
                          <TouchableOpacity
                            onPress={() => this.DeleteRecord(item.ID)}
                            style={{
                              backgroundColor: "#ff5851",
                              borderRadius: 3,
                              justifyContent: "center",
                              flexDirection: "row",
                              height: 80,
                              width:50,
                              alignItems: "center",
                            }}
                          >
                            <AntIcon name="delete" color={"#fff"} size={20} />
                          </TouchableOpacity>
                        </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.favHospitalsArea}>
              <Image
                resizeMode={"contain"}
                style={styles.favHospitalsImageStyle}
                source={require("../../Assets/Images/arrow.png")}
              />
              <Text style={styles.favHospitalsOopsText}>{CONSTANT.Oops}</Text>
              <Text style={styles.favHospitalsNoDataText}>
                {CONSTANT.NoDataAvailable}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
export default withNavigation(FavHospitals);