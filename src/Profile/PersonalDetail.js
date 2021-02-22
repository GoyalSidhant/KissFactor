import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  PanResponder,
  Alert,
  Dimensions,
  AsyncStorage,
  Button
} from "react-native";
import styles from "../styles/DoctreatAppStyles";
import { SwipeRow, List, Content, ListItem, Separator } from "native-base";
import { SwipeableFlatList } from "react-native-swipeable-flat-list";
import EducationAndExperienceLayout from "./EducationAndExperienceLayout";
import AntIcon from "react-native-vector-icons/AntDesign";
import DocumentPicker from "react-native-document-picker";
import MapView, { Marker } from "react-native-maps";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import ImagePicker from "react-native-image-crop-picker";
import MultiSelect from "react-native-multiple-select";
import AddListCard from "./AddListCard";
import Dash from "react-native-dash";
import * as CONSTANT from "../Constants/Constant";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class PersonalDetail extends Component {
  constructor(props) {
    super(props);
    (this.array = []),
      (this.arrayExperience = []),
      (this.arrayEducation = []),
      (this.state = {
        image: null,
        images: null,
        Downloadimages: null,
        FirstName: "",
        LastName: "",
        DisplayName: "",
        BaseName: "",
        SubHeading: "",
        ShortDescription: "",
        Description: "",
        Address: "",
        Latitude: "",
        Longitude: "",
        Registration: "",
        StratingPrice: "",
        ProfileImage: "",
        Description: "",
        arrayHolder: [],
        itemHolder: [],
        items: [],
        ExperienceData: [],
        EducationData: [],
        AwardData: [],
        DownloadData: [],
        DownloadFileData: [],
        MembershipData: [],
        NumberData: [],
        arrayHolder_Experience: [],
        arrayHolder_Education: [],
        projectLocationKnown: "",
        AddExperienceForm: false,
        textInput_Holder: "",
        ViewExperienceForm: "false",
        touchableOpacityHeight: 55,
        ExpCompanyName: "",
        ExpDescription: "",
        ExpEndDate: "End Date",
        ExpStartingDate: "Starting Date",
        ExpJobTitle: "",
        EduDescription: "",
        EduEndDate: "End Date",
        EduInstituteName: "",
        EduInstituteTitle: "",
        EduStartingDate: "Starting Date",
        AwardTitle: "",
        AwardYear: "",
        Memberdata: "",
        refreshing: true,
        awardrefresh: false,
        ExpRefresh: false,
        EduRefresh: false,
        DownloadRefresh: false,
        DownloadFileRefresh: false,
        Memberfresh: false,
        isLoading: true,
        storedValue: "",
        storedType: "",
        profileImg: "",
        profileCallSetting: "",
        login_type: "",
        id: "",
        base64_string: "",
        name: "",
        type: "",
        Mynumber: "",
        ProfileGallery: [],
        GalleryRefresh: false,
        ProfileMembership: [],
        MembershipName: "",
        MembershipRefresh: false,
        DatePickerVisibleExpStartingDate: false,
        DatePickerVisibleExpEndDate: false,
        DatePickerVisibleEduStartingDate: false,
        DatePickerVisibleEduEndDate: false,
        value: "",
        mode: "date",
        displayFormat: "DD/MM/YYYY",
        label: "Starting Date",
        galleryArrey: [],
        gallery_base64_string: "",
        galleryimage: null
      });
  }

  componentWillMount() {
    this.setState({ arrayHolder: [...this.array] });
    this.setState({ arrayHolder_Experience: [...this.arrayExperience] });
    // this.fetchProfileData();
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
      this.fetchProfileData();
      this.ProjectLocationSpinner();
    } catch (error) {
      // alert(error)
    }
  };
  ProjectLocationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl + "taxonomies/get_taxonomy?taxonomy=locations",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let projectLocation = responseJson;
        this.setState({
          projectLocation
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  fetchProfileData = async () => {
    this.setState({ isLoading: true });
    const id = await AsyncStorage.getItem("projectUid");
    const response = await fetch(CONSTANT.BaseUrl + "profile/setting?id=" + id);
    const json = await response.json();
    console.log("This is Json" + JSON.stringify(json));
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ ProfileData: [] });
    } else {
      this.setState({ ProfileData: json, isLoading: false });
      this.setState({ ExperienceData: json[0].am_experiences });
      this.setState({ EducationData: json[0].am_education });
      this.setState({ AwardData: json[0].am_award });
      this.setState({ DownloadData: json[0].am_downloads, isLoading: false });
      this.setState({ NumberData: json[0].am_booking_contact });
      this.setState({ FirstName: json[0].am_first_name });
      this.setState({ LastName: json[0].am_last_name });
      this.setState({ DisplayName: json[0].display_name });
      this.setState({ BaseName: json[0].am_name_base });
      this.setState({ ShortDescription: json[0].am_short_description });
      this.setState({ SubHeading: json[0].am_sub_heading });
      this.setState({ Description: json[0].content });
      this.setState({ Address: json[0].address });
      this.setState({ Latitude: json[0].latitude });
      this.setState({ Longitude: json[0].longitude });
      this.setState({ Registration: json[0].reg_number });
      this.setState({ StratingPrice: json[0].am_starting_price });
      this.setState({ ProfileImage: json[0].profile_image_url });
      this.setState({ ProfileGallery: json[0].am_gallery });
      this.setState({ ProfileMembership: json[0].am_memberships });
    }
  };

  joinDataEducation = () => {
    this.arrayEducation.push({ titleExpe: "Add Education" });
    this.setState({ arrayHolder_Education: [...this.arrayEducation] });
  };

  joinDataExperience = () => {
    this.setState({
      AddExperienceForm: true
    });
  };

  HandleEditForm = () => {
    this.setState({ ViewExperienceForm: "true" });
  };

  increaseHeight = () => {
    this.setState({ touchableOpacityHeight: 530 });
  };

  joinData = () => {
    this.array.push({ title: this.state.textInput_Holder });
    this.setState({ arrayHolder: [...this.array] });
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B"
        }}
      />
    );
  };

  GetItem(item) {}
  removeItem = key => {
    let data = this.state.arrayHolder;
    data = data.filter(item => item.key !== key);
    this.setState({ data });
  };
  UpdateProfileData = async () => {
    this.setState({ isLoading: true });
    const {
      FirstName,
      LastName,
      DisplayName,
      BaseName,
      SubHeading,
      Description,
      Address,
      Latitude,
      Longitude,
      ShortDescription,
      ExperienceData,
      EducationData,
      AwardData,
      Registration,
      DownloadData,
      NumberData,
      MembershipData,
      StratingPrice,
      base64_string,
      name,
      type,
      id,
      projectLocationKnown,
      images,
      Downloadimages
    } = this.state;
    console.log(
      FirstName,
      LastName,
      DisplayName,
      BaseName,
      SubHeading,
      Description,
      Address,
      Latitude,
      Longitude,
      ShortDescription,
      ExperienceData,
      EducationData,
      AwardData,
      Registration,
      DownloadData,
      NumberData,
      MembershipData,
      StratingPrice,
      base64_string,
      name,
      type,
      id
    );
    if (this.state.FirstName == "") {
      this.setState({
        FirstName: this.state.ProfileData[0].am_first_name
      });
    }
    if (this.state.LastName == "") {
      this.setState({
        LastName: this.state.ProfileData[0].am_last_name
      });
    }
    if (this.state.SubHeading === "") {
      this.setState({
        SubHeading: this.state.ProfileData[0].am_sub_heading
      });
    }
    const formData = new FormData();
    formData.append("id", id);
    formData.append("am_first_name", FirstName);
    formData.append("am_last_name", LastName);
    formData.append("display_name", DisplayName);
    formData.append("am_name_base", BaseName);
    formData.append("am_sub_heading", SubHeading);
    formData.append("am_starting_price", StratingPrice);
    formData.append("content", Description);
    formData.append("location", projectLocationKnown[0]);
    formData.append("address", Address);
    formData.append("longitude", Longitude);
    formData.append("latitude", Latitude);
    formData.append("am_education", JSON.stringify(EducationData));
    formData.append("am_experiences", JSON.stringify(ExperienceData));
    formData.append("am_award", JSON.stringify(AwardData));
    //formData.append("am_downloads", DownloadData);
    //formData.append("am_registration_number", Registration);
    formData.append("am_memberships_name", JSON.stringify(MembershipData));
    formData.append(
      "profile_base64",
      JSON.stringify({
        base64_string,
        name,
        type
      })
    );
    formData.append(
      "size",
      Downloadimages != null ? Downloadimages.length : "0"
    );
    if (Downloadimages != null) {
      Downloadimages.forEach((item, i) => {
        var path = item.uri;
        var filename = item.name;
        formData.append("am_downloads_files" + i, Downloadimages[i]);
      });
    }
    formData.append("gallery_size", images != null ? images.length : "0");
    if (images != null) {
      images.forEach((item, i) => {
        var path = item.uri;
        var filename = item.name;
        formData.append("am_gallery_files" + i, images[i]);
      });
    }
    axios
      .post(CONSTANT.BaseUrl + "profile/update-basic", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(async response => {
        if (response.status === 200) {
          this.setState({ images: [], Downloadimages: [], isLoading: false });
          Alert.alert("Success", response.data.message);
          this.fetchProfileData();
        } else if (response.status === 203) {
          this.setState({ isLoading: false });
          Alert.alert("Error", response.data.message);
        }
      })
      .catch(error => {
        Alert.alert(error);
        console.log(error);
      });
  };
  pickSingleArticleImageBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true
    })
      .then(image => {
        this.setState({
          image: {
            uri: `data:${image.mime};base64,` + image.data,
            width: image.width,
            height: image.height
          },
          images: null
        });
        this.setState({
          base64_string: image.data,
          name: "IMG-20190704-WA0004.jpg",
          type: image.mime,
          path: image.path
        });
      })
      .catch(e => console.log(e));
  }
  pickMultiGalleryImageBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true
    })
      .then(galleryimage => {
        this.setState({
          gallery_base64_string:
            `data:${galleryimage.mime};base64,` + galleryimage.data,
          name: "IMG-20190704-WA0005.jpg",
          type: galleryimage.mime,
          path: galleryimage.path.replace(/^.*[\\\/]/, "")
        });
        this.state.galleryArrey.push(
          this.state.gallery_base64_string,
          this.state.path
        );
        this.state.ProfileGallery.push(
          {
            url: this.state.gallery_base64_string,
            name: this.state.path
          },
          console.log(
            "My Data",
            this.state.ProfileGallery.filter(x => x != null)
          )
        );
        this.setState({
          GalleryRefresh: true
        });
      })
      .catch(e => console.log(e));
  }
  pickMultiple() {
    try {
      DocumentPicker.pickMultiple({})
        .then(DownloadData => {
          this.setState({
            images: DownloadData,
            DownloadRefresh: true
          });
        })
        .catch(e => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }
  pickMultipleDownloads() {
    try {
      DocumentPicker.pickMultiple({})
        .then(DownloadFileData => {
          this.setState({
            Downloadimages: DownloadFileData,
            DownloadFileRefresh: true
          });
        })
        .catch(e => alert(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }
  fetchExperienceFormData = () => {
    if (
      this.state.ExpCompanyName == "" &&
      this.state.ExpJobTitle == "" &&
      this.state.ExpDescription == ""
    ) {
      Alert.alert("Oops", "Please Enter The Data Properly");
    } else {
      const {
        ExpCompanyName,
        ExpDescription,
        ExpEndDate,
        ExpStartingDate,
        ExpJobTitle
      } = this.state;

      this.state.ExperienceData.push({
        company_name: this.state.ExpCompanyName,
        start_date: this.state.ExpStartingDate,
        ending_date: this.state.ExpEndDate,
        job_title: this.state.ExpJobTitle,
        job_description: this.state.ExpDescription
      });
      this.setState({
        ExpRefresh: true
      });
    }
  };

  fetchEducationFormData = () => {
    if (
      this.state.EduInstituteName == "" &&
      this.state.EduInstituteTitle == "" &&
      this.state.EduDescription == ""
    ) {
      Alert.alert("Oops", "Please Enter The Data Properly");
    } else {
      const {
        EduDescription,
        EduEndDate,
        EduInstituteName,
        EduInstituteTitle,
        EduStartingDate
      } = this.state;
      this.state.EducationData.push({
        institute_name: this.state.EduInstituteName,
        start_date: this.state.EduStartingDate,
        ending_date: this.state.EduEndDate,
        degree_title: this.state.EduInstituteTitle,
        degree_description: this.state.EduDescription
      });
      this.setState({
        EduRefresh: true
      });
    }
  };
  fetchAwardsData = () => {
    if (this.state.AwardTitle == "" && this.state.AwardYear == "") {
      Alert.alert("Oops", "Please Enter The Data Properly");
    } else {
      const { AwardTitle, AwardYear } = this.state;
      this.state.AwardData.push({
        title: this.state.AwardTitle,
        year: this.state.AwardYear
      });
      this.setState({
        awardrefresh: true
      });
    }
  };

  fetchNumberData = () => {
    if (this.state.Mynumber == "") {
      Alert.alert("Oops", "Please Enter The Data Properly");
    } else {
      const { Mynumber } = this.state;
      this.state.NumberData.push({
        number: this.state.Mynumber
      });
      this.setState({
        Numberfresh: true
      });
    }
  };

  fetchProfileMembershipData = () => {
    if (this.state.MembershipName == "") {
      Alert.alert("Oops", "Please Enter The Data Properly");
    } else {
      this.state.ProfileMembership.push({
        name: this.state.MembershipName
      });
      this.setState({
        MembershipRefresh: true
      });
    }
  };

  HandleExpDeleteForm = index => {
    this.state.ExperienceData.splice(index, 1);
    this.setState({
      ExpRefresh: true
    });
  };

  HandleEduDeleteForm = index => {
    this.state.EducationData.splice(index, 1);
    this.setState({
      EduRefresh: true
    });
  };

  HandleAwardDeleteForm = index => {
    this.state.AwardData.splice(index, 1);
    this.setState({
      awardrefresh: true
    });
  };

  HandleDownloadDeleteForm = index => {
    this.state.DownloadData.splice(index, 1);
    this.setState({
      DownloadRefresh: true
    });
  };

  HandleMembershipDeleteForm = index => {
    this.state.ProfileMembership.splice(index, 1);
    this.setState({
      MembershipRefresh: true
    });
  };

  HandleGalleryDeleteForm = index => {
    this.state.ProfileGallery.splice(index, 1);
    this.setState({
      GalleryRefresh: true
    });
  };

  HandleNumberDeleteForm = index => {
    this.state.NumberData.splice(index, 1);
    this.setState({
      Numberfresh: true
    });
  };

  showDatePickerExpStartingDate = () => {
    this.setState({
      DatePickerVisibleExpStartingDate: true
    });
  };
  showDatePickerExpEndDate = () => {
    this.setState({
      DatePickerVisibleExpEndDate: true
    });
  };
  showDatePickerEduStartingDate = () => {
    this.setState({
      DatePickerVisibleEduStartingDate: true
    });
  };
  showDatePickerEduEndDate = () => {
    this.setState({
      DatePickerVisibleEduEndDate: true
    });
  };
  hideDatePickerExpStartingDate = () => {
    this.setState({
      DatePickerVisibleExpStartingDate: false
    });
  };
  hideDatePickerExpEndDate = () => {
    this.setState({
      DatePickerVisibleExpEndDate: false
    });
  };
  hideDatePickerEduStartingDate = () => {
    this.setState({
      DatePickerVisibleEduStartingDate: false
    });
  };
  hideDatePickerEduEndDate = () => {
    this.setState({
      DatePickerVisibleEduEndDate: false
    });
  };
  handleConfirmExpStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ ExpStartingDate: moment(dateS).format("DD-MM-YYYY") });
    this.hideDatePickerExpStartingDate();
  };
  handleConfirmExpEndDate = date => {
    const dateS = date.toUTCString();
    this.setState({ ExpEndDate: moment(dateS).format("DD-MM-YYYY") });
    this.hideDatePickerExpEndDate();
  };
  handleConfirmEduStartingDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EduStartingDate: moment(dateS).format("DD-MM-YYYY") });
    this.hideDatePickerEduStartingDate();
  };
  handleConfirmEduEndDate = date => {
    const dateS = date.toUTCString();
    this.setState({ EduEndDate: moment(dateS).format("DD-MM-YYYY") });
    this.hideDatePickerEduEndDate();
  };

  render() {
    const {
      FirstName,
      LastName,
      DisplayName,
      BaseName,
      SubHeading,
      ShortDescription,
      isLoading,
      label,
      value,
      show,
      mode,
      displayFormat
    } = this.state;
    const {
      storedValue,
      storedType,
      profileCallSetting,
      profileImg
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={"Profile Settings"} />
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
          <View style={styles.PersonalDetailSectionsStyle}>
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.PersonalDetailUser}
            </Text>
            {this.state.ProfileData && storedType == "doctor" ? (
              <TextInput
                defaultValue={`${entities.decode(
                  this.state.ProfileData[0].am_name_base
                )}`}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Base Name"
                style={styles.TextInputLayoutStyle}
                onChangeText={BaseName => this.setState({ BaseName })}
              ></TextInput>
            ) : storedType == "doctor" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Base Name"
                style={styles.TextInputLayoutStyle}
              />
            ) : null}
            {(this.state.ProfileData && storedType == "doctor") ||
            storedType == "hospital" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Sub Heading"
                style={styles.TextInputLayoutStyle}
                onChangeText={SubHeading => this.setState({ SubHeading })}
              >{`${entities.decode(this.state.SubHeading)}`}</TextInput>
            ) : storedType == "doctor" || storedType == "hospital" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Sub Heading"
                style={styles.TextInputLayoutStyle}
              />
            ) : null}
            {this.state.ProfileData ? (
              <TextInput
                defaultValue={`${entities.decode(
                  this.state.ProfileData[0].am_first_name
                )}`}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="First Name"
                style={styles.TextInputLayoutStyle}
                onChangeText={FirstName => this.setState({ FirstName })}
              ></TextInput>
            ) : (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="First Name"
                style={styles.TextInputLayoutStyle}
              ></TextInput>
            )}
            {this.state.ProfileData ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Last Name"
                style={styles.TextInputLayoutStyle}
                onChangeText={LastName => this.setState({ LastName })}
              >
                {`${entities.decode(this.state.ProfileData[0].am_last_name)}`}
              </TextInput>
            ) : (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Last Name"
                style={styles.TextInputLayoutStyle}
              />
            )}
            {(this.state.ProfileData && storedType == "doctor") ||
            storedType == "hospital" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Username"
                style={styles.TextInputLayoutStyle}
                onChangeText={DisplayName => this.setState({ DisplayName })}
              >{`${entities.decode(this.state.DisplayName)}`}</TextInput>
            ) : storedType == "doctor" || storedType == "hospital" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Username"
                style={styles.TextInputLayoutStyle}
              />
            ) : null}
            {this.state.ProfileData && storedType == "doctor" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Booking Description"
                style={styles.TextInputLayoutStyle}
                onChangeText={BookingDescription =>
                  this.setState({ BookingDescription })
                }
              >{`${entities.decode(
                this.state.ProfileData[0].am_booking_detail
              )}`}</TextInput>
            ) : storedType == "doctor" ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Booking Description"
                style={styles.TextInputLayoutStyle}
              />
            ) : null}
            {this.state.ProfileData && storedType == "doctor" ? (
              <TextInput
                //multiline={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Starting Price"
                style={styles.TextInputLayoutStyle}
                onChangeText={StratingPrice => this.setState({ StratingPrice })}
              >{`${entities.decode(
                this.state.ProfileData[0].am_starting_price
              )}`}</TextInput>
            ) : storedType == "doctor" ? (
              <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Starting Price"
                style={styles.TextInputLayoutStyle}
              />
            ) : null}
            {this.state.ProfileData ? (
              <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Description"
                style={styles.TextInputLayoutStyleForDetail}
                onChangeText={Description => this.setState({ Description })}
              >{`${entities.decode(
                this.state.ProfileData[0].content
              )}`}</TextInput>
            ) : (
              <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Description"
                style={styles.TextInputLayoutStyleForDetail}
              />
            )}
          </View>
          <View style={styles.PersonalDetailSectionsStyle}>
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.PersonalDetailLocation}
            </Text>
            {this.state.ProfileData ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Select Location"
                editable={false}
                style={styles.TextInputLayoutStyle}
              >{`${entities.decode(
                this.state.ProfileData[0].location
              )}`}</TextInput>
            ) : (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Select Location"
                editable={false}
                style={styles.TextInputLayoutStyle}
              />
            )}
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({ projectLocationKnown: value })
                }
                uniqueKey="slug"
                items={this.state.projectLocation}
                selectedItems={this.state.projectLocationKnown}
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search Project Location..."
                onChangeInput={text => console.log(text)}
                selectText="Pick Location"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={
                  styles.MultiSelectstyleDropdownMenuSubsection
                }
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>

            {this.state.ProfileData ? (
              <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Your Address"
                style={styles.TextInputLayoutStyle}
                onChangeText={Address => this.setState({ Address })}
              >{`${entities.decode(
                this.state.ProfileData[0].address
              )}`}</TextInput>
            ) : (
              <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Your Address"
                style={styles.TextInputLayoutStyle}
              />
            )}

            {this.state.ProfileData ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Enter Longitude"
                style={styles.TextInputLayoutStyle}
                onChangeText={Longitude => this.setState({ Longitude })}
              >{`${entities.decode(
                this.state.ProfileData[0].longitude
              )}`}</TextInput>
            ) : (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Enter Longitude"
                style={styles.TextInputLayoutStyle}
              />
            )}
            {this.state.ProfileData ? (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Enter Latitude"
                style={styles.TextInputLayoutStyle}
                onChangeText={Latitude => this.setState({ Latitude })}
              >{`${entities.decode(
                this.state.ProfileData[0].latitude
              )}`}</TextInput>
            ) : (
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="#7F7F7F"
                placeholder="Enter Latitude"
                style={styles.TextInputLayoutStyle}
              />
            )}
          </View>
          <View style={styles.PersonalDetailSectionsStyle}>
            <Text style={styles.MainHeadingTextStyle}>
              {CONSTANT.PersonalDetailPhoto}
            </Text>

            <View
              res
              style={{
                flexDirection: "row",
                marginLeft: 10,
                marginRight: 10,
                overflow: "hidden"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  borderRadius: 4,
                  borderStyle: "dashed",
                  borderColor: "#dddddd",
                  borderWidth: 0.6,
                  height: 150,
                  width: "60%",
                  marginBottom: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => this.pickSingleArticleImageBase64(false)}
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <AntIcon
                    onPress={this.joinData}
                    name="plus"
                    color={"#767676"}
                    size={27}
                  />
                  <Text style={{ color: "#767676", fontSize: 17 }}>
                    {CONSTANT.PersonalDetailAddPhoto}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.base64_string == "" ? (
                <Image
                  source={{
                    uri: `${"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+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"} `
                  }}
                  style={{ width: "40%", height: 150, borderRadius: 4 }}
                />
              ) : (
                <Image
                  source={{
                    uri: `data:image/gif;base64,${this.state.base64_string}`
                  }}
                  style={{ width: "40%", height: 150, borderRadius: 4 }}
                />
              )}
            </View>
            {this.state.ProfileImage != "" && (
              <View>
                <Text style={styles.MainHeadingTextStyle}>
                  {CONSTANT.PersonalDetailCurrentPhoto}
                </Text>
                <Image
                  style={{
                    width: "40%",
                    height: 150,
                    borderRadius: 4,
                    marginLeft: 15,
                    marginBottom: 15
                  }}
                  source={{
                    uri: `${this.state.ProfileImage}`
                  }}
                />
              </View>
            )}
          </View>
          {storedType == "doctor" && (
            <View style={styles.PersonalDetailSectionsStyle}>
              <Text style={styles.MainHeadingTextStyle}>Phone Number</Text>
              <View style={styles.PersonalDetailCustomTextInputArea}>
                <TextInput
                  onChangeText={Mynumber => this.setState({ Mynumber })}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Enter Number Here"
                  keyboardType={"numeric"}
                  style={styles.PersonalDetailCustomTextInputStyle}
                />
                <View style={styles.PersonalDetailCustomTextInputIconArea}>
                  <AntIcon
                    onPress={() => this.fetchNumberData()}
                    name="plus"
                    color={"#fff"}
                    size={20}
                  />
                </View>
              </View>

              {this.state.NumberData ? (
                <FlatList
                  style={{ paddingLeft: 5 }}
                  data={this.state.NumberData}
                  extraData={this.state.Numberfresh}
                  renderItem={({ item, index }) => (
                    <View style={styles.PersonalDetailCollapseHeaderArea}>
                      <Text style={styles.PersonalDetailPhoneNumbersText}>
                        {item.number}
                      </Text>

                      <TouchableOpacity
                        onPress={() => this.HandleNumberDeleteForm(index)}
                        style={styles.PersonalDetailDeleteBTN}
                      >
                        <AntIcon name="delete" color={"#fff"} size={20} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : null}
            </View>
          )}

          {storedType == "doctor" && (
            <View>
              <View style={styles.PersonalDetailSectionsStyle}>
                <Text style={styles.MainHeadingTextStyle}>Experience</Text>

                <View style={styles.PersonalDetailSectionArea}>
                  <View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder="Company Name"
                      onChangeText={ExpCompanyName =>
                        this.setState({ ExpCompanyName })
                      }
                      style={styles.TextInputLayoutStyle}
                    />
                    <View>
                      <DateTimePickerModal
                        cancelTextIOS={"CANCEL"}
                        confirmTextIOS={"OK"}
                        cancelTextStyle={{ color: "#3d4461", fontSize: 20 }}
                        confirmTextStyle={{ color: "#3d4461", fontSize: 20 }}
                        isVisible={this.state.DatePickerVisibleExpStartingDate}
                        mode="date"
                        onConfirm={this.handleConfirmExpStartingDate}
                        onCancel={this.hideDatePickerExpStartingDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.ExpStartingDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerExpStartingDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <DateTimePickerModal
                        isVisible={this.state.DatePickerVisibleExpEndDate}
                        mode="date"
                        onConfirm={this.handleConfirmExpEndDate}
                        onCancel={this.hideDatePickerExpEndDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.ExpEndDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerExpEndDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      onChangeText={data =>
                        this.setState({ textInput_Holder: data })
                      }
                      placeholderTextColor="#7F7F7F"
                      underlineColorAndroid="transparent"
                      placeholder="Job Title"
                      onChangeText={ExpJobTitle =>
                        this.setState({ ExpJobTitle })
                      }
                      style={styles.TextInputLayoutStyle}
                    />
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder="Description"
                      onChangeText={ExpDescription =>
                        this.setState({ ExpDescription })
                      }
                      style={styles.TextInputLayoutStyleForDetail}
                    />
                    <TouchableOpacity
                      onPress={this.fetchExperienceFormData}
                      style={styles.PersonalDetailbuttonHover}
                    >
                      <Text style={styles.PersonalDetailbuttonText}>
                        Add Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.ExperienceData ? (
                    <FlatList
                      data={this.state.ExperienceData}
                      extraData={this.state.ExpRefresh}
                      renderItem={({ item, index }) => (
                        <Collapse>
                          <CollapseHeader>
                            <View
                              style={styles.PersonalDetailCollapseHeaderArea}
                            >
                              <TouchableOpacity
                                activeOpacity={1}
                                style={
                                  styles.PersonalDetailCoollapseHeaderTextArea
                                }
                              >
                                <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                >
                                  {item.company_name}
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.PersonalDetailEditBTN}>
                                <AntIcon name="edit" color={"#fff"} size={20} />
                              </View>
                              <TouchableOpacity
                                onPress={() => this.HandleExpDeleteForm(index)}
                                style={styles.PersonalDetailDeleteBTN}
                              >
                                <AntIcon
                                  name="delete"
                                  color={"#fff"}
                                  size={20}
                                />
                              </TouchableOpacity>
                            </View>
                          </CollapseHeader>
                          <CollapseBody>
                            <View style={{ marginTop: 10 }}>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Company Name"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.company_name}
                              </TextInput>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Starting Date"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.start_date}
                              </TextInput>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="End Date"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.ending_date}
                              </TextInput>
                              <TextInput
                                onChangeText={data =>
                                  this.setState({ textInput_Holder: data })
                                }
                                placeholderTextColor="#7F7F7F"
                                underlineColorAndroid="transparent"
                                placeholder="Job Title"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.job_title}
                              </TextInput>
                              <TextInput
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Description"
                                style={styles.TextInputLayoutStyleForDetail}
                              >
                                {item.job_description}
                              </TextInput>
                              <TouchableOpacity
                                onPress={this.joinData}
                                style={styles.PersonalDetailbuttonHover}
                              >
                                <Text style={styles.PersonalDetailbuttonText}>
                                  {CONSTANT.PersonalDetailAddNow}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </CollapseBody>
                        </Collapse>
                      )}
                    />
                  ) : null}
                </View>
              </View>
              <View style={styles.PersonalDetailSectionsStyle}>
                <Text style={styles.MainHeadingTextStyle}>Education</Text>
                <View style={styles.PersonalDetailSectionArea}>
                  <View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder="Institute Name"
                      onChangeText={EduInstituteName =>
                        this.setState({ EduInstituteName })
                      }
                      style={styles.TextInputLayoutStyle}
                    />
                    <View>
                      <DateTimePickerModal
                        isVisible={this.state.DatePickerVisibleEduStartingDate}
                        mode="date"
                        onConfirm={this.handleConfirmEduStartingDate}
                        onCancel={this.hideDatePickerEduStartingDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.EduStartingDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerEduStartingDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <DateTimePickerModal
                        isVisible={this.state.DatePickerVisibleEduEndDate}
                        mode="date"
                        onConfirm={this.handleConfirmEduEndDate}
                        onCancel={this.hideDatePickerEduEndDate}
                      />
                    </View>
                    <View
                      style={[
                        styles.TextInputLayoutStyle,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text style={{ color: "#7f7f7f" }}>
                        {this.state.EduEndDate}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerEduEndDate()}
                        style={{ padding: 5 }}
                      >
                        <AntIcon
                          name="calendar"
                          color={CONSTANT.primaryColor}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      onChangeText={data =>
                        this.setState({ textInput_Holder: data })
                      }
                      placeholderTextColor="#7F7F7F"
                      underlineColorAndroid="transparent"
                      placeholder="Institute Title"
                      onChangeText={EduInstituteTitle =>
                        this.setState({ EduInstituteTitle })
                      }
                      style={styles.TextInputLayoutStyle}
                    />
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder="Description"
                      onChangeText={EduDescription =>
                        this.setState({ EduDescription })
                      }
                      style={styles.TextInputLayoutStyleForDetail}
                    />
                    <TouchableOpacity
                      onPress={this.fetchEducationFormData}
                      style={styles.PersonalDetailbuttonHover}
                    >
                      <Text style={styles.PersonalDetailbuttonText}>
                        {CONSTANT.PersonalDetailAddNow}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {this.state.EducationData ? (
                    <FlatList
                      data={this.state.EducationData}
                      extraData={this.state.EduRefresh}
                      renderItem={({ item, index }) => (
                        <Collapse>
                          <CollapseHeader>
                            <View
                              style={styles.PersonalDetailCollapseHeaderArea}
                            >
                              <TouchableOpacity
                                activeOpacity={1}
                                style={
                                  styles.PersonalDetailCoollapseHeaderTextArea
                                }
                              >
                                <Text
                                  style={
                                    styles.PersonalDetailCoollapseHeaderText
                                  }
                                >
                                  {item.institute_name}
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.PersonalDetailEditBTN}>
                                <AntIcon name="edit" color={"#fff"} size={20} />
                              </View>
                              <TouchableOpacity
                                onPress={() => this.HandleEduDeleteForm(index)}
                                style={styles.PersonalDetailDeleteBTN}
                              >
                                <AntIcon
                                  name="delete"
                                  color={"#fff"}
                                  size={20}
                                />
                              </TouchableOpacity>
                            </View>
                          </CollapseHeader>
                          <CollapseBody>
                            <View style={{ marginTop: 10 }}>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Institute Name"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.institute_name}
                              </TextInput>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Starting Date"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.start_date}
                              </TextInput>
                              <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="End Date"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.ending_date}
                              </TextInput>
                              <TextInput
                                onChangeText={data =>
                                  this.setState({ textInput_Holder: data })
                                }
                                placeholderTextColor="#7F7F7F"
                                underlineColorAndroid="transparent"
                                placeholder="Degree Title"
                                style={styles.TextInputLayoutStyle}
                              >
                                {item.degree_title}
                              </TextInput>
                              <TextInput
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#7F7F7F"
                                placeholder="Description"
                                style={styles.TextInputLayoutStyleForDetail}
                              >
                                {item.degree_description}
                              </TextInput>
                              <TouchableOpacity
                                onPress={this.joinData}
                                style={styles.PersonalDetailbuttonHover}
                              >
                                <Text style={styles.PersonalDetailbuttonText}>
                                  {CONSTANT.PersonalDetailAddNow}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </CollapseBody>
                        </Collapse>
                      )}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          )}
          {storedType == "doctor" && (
            <View style={styles.PersonalDetailSectionsStyle}>
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PersonalDetailAddReward}
              </Text>
              <View style={styles.PersonalDetailSectionArea}>
                <View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder="Award Title"
                    onChangeText={AwardTitle => this.setState({ AwardTitle })}
                    style={styles.TextInputLayoutStyle}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder="Year"
                    onChangeText={AwardYear => this.setState({ AwardYear })}
                    style={styles.TextInputLayoutStyle}
                  />

                  <TouchableOpacity
                    onPress={this.fetchAwardsData}
                    style={styles.PersonalDetailbuttonHover}
                  >
                    <Text style={styles.PersonalDetailbuttonText}>
                      {CONSTANT.PersonalDetailAddNow}
                    </Text>
                  </TouchableOpacity>
                </View>

                {this.state.AwardData ? (
                  <FlatList
                    data={this.state.AwardData}
                    extraData={this.state.awardrefresh}
                    renderItem={({ item, index }) => (
                      <Collapse>
                        <CollapseHeader>
                          <View style={styles.PersonalDetailCollapseHeaderArea}>
                            <TouchableOpacity
                              activeOpacity={1}
                              style={
                                styles.PersonalDetailCoollapseHeaderTextArea
                              }
                            >
                              <Text
                                style={styles.PersonalDetailCoollapseHeaderText}
                              >
                                {item.title}
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.PersonalDetailEditBTN}>
                              <AntIcon name="edit" color={"#fff"} size={20} />
                            </View>
                            <TouchableOpacity
                              onPress={() => this.HandleAwardDeleteForm(index)}
                              style={styles.PersonalDetailDeleteBTN}
                            >
                              <AntIcon name="delete" color={"#fff"} size={20} />
                            </TouchableOpacity>
                          </View>
                        </CollapseHeader>

                        <CollapseBody>
                          <View style={{ marginTop: 10 }}>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholderTextColor="#7F7F7F"
                              placeholder="Award Title"
                              onChangeText={AwardTitle =>
                                this.setState({ AwardTitle })
                              }
                              style={styles.TextInputLayoutStyle}
                            >
                              {item.title}
                            </TextInput>
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholderTextColor="#7F7F7F"
                              placeholder="Award Year"
                              onChangeText={AwardYear =>
                                this.setState({ AwardYear })
                              }
                              style={styles.TextInputLayoutStyle}
                            >
                              {item.year}
                            </TextInput>

                            <TouchableOpacity
                              onPress={this.fetchAwardsData}
                              style={styles.PersonalDetailbuttonHover}
                            >
                              <Text style={styles.PersonalDetailbuttonText}>
                                {CONSTANT.PersonalDetailAddNow}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </CollapseBody>
                      </Collapse>
                    )}
                  />
                ) : null}
              </View>
            </View>
          )}
          {storedType == "doctor" && (
            <View style={styles.PersonalDetailSectionsStyle}>
              <Text style={styles.MainHeadingTextStyle}>
                {CONSTANT.PersonalDetailDownloads}
              </Text>
              <View style={styles.PersonalDetailSectionArea}>
                <TouchableOpacity
                  onPress={() => this.pickMultipleDownloads()}
                  style={styles.PersonalDetailDownloadArea}
                >
                  <AntIcon name="plus" color={"#767676"} size={27} />
                  <Text style={styles.PersonalDetailDownloadText}>
                    {CONSTANT.PersonalDetailAddFileforDownlaod}
                  </Text>
                </TouchableOpacity>
                {this.state.Downloadimages != null ? (
                  <FlatList
                    style={{ paddingBottom: 5, paddingTop: 10 }}
                    data={this.state.Downloadimages}
                    keyExtractor={(y, z) => z.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity elevation={5}>
                        <View
                          style={{
                            padding: 10,
                            backgroundColor: "#dddddd",
                            marginLeft: 20,
                            marginRight: 20,
                            borderRadius: 10,
                            marginBottom: 10
                          }}
                        >
                          <View style={{}}>
                            <Text style={{ width: "80%" }}>{item.name}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : null}
                {this.state.DownloadData ? (
                  <FlatList
                    data={this.state.DownloadData}
                    extraData={this.state.DownloadRefresh}
                    renderItem={({ item, index }) => (
                      <View style={styles.PersonalDetailCollapseHeaderArea}>
                        <View style={styles.PersonalDetailImageArea}>
                          <Image
                            resizeMode={"cover"}
                            style={styles.PersonalDetailImageStyle}
                            source={require("../../Assets/Images/Download.png")}
                          />
                        </View>
                        <View
                          style={styles.PersonalDetailCoollapseHeaderTextArea}
                        >
                          <Text
                            style={styles.PersonalDetailCoollapseHeaderText}
                          >
                            {item.name} {"\n"}
                            {item.size}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => this.HandleDownloadDeleteForm(index)}
                          style={styles.PersonalDetailDeleteBTN}
                        >
                          <AntIcon name="delete" color={"#fff"} size={20} />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                ) : null}
              </View>
            </View>
          )}
          {storedType == "doctor" ||
            (storedType == "hospital" && (
              <View style={styles.PersonalDetailSectionsStyle}>
                <Text style={styles.MainHeadingTextStyle}>
                  {CONSTANT.PersonalDetailRegistrationNo}
                </Text>
                <View style={styles.PersonalDetailSectionArea}>
                  {this.state.ProfileData ? (
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder="Enter Registration Number"
                      style={styles.TextInputLayoutStyle}
                      onChangeText={Registration =>
                        this.setState({ Registration })
                      }
                    >{`${entities.decode(
                      this.state.ProfileData[0].reg_number
                    )}`}</TextInput>
                  ) : (
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholderTextColor="#7F7F7F"
                      placeholder="Enter Registration Number"
                      style={styles.TextInputLayoutStyle}
                    />
                  )}
                  <View style={styles.PersonalDetailDownloadArea}>
                    <AntIcon
                      onPress={this.joinData}
                      name="plus"
                      color={"#767676"}
                      size={27}
                    />
                    <Text style={styles.PersonalDetailDownloadText}>
                      {CONSTANT.PersonalDetailAddDocument}
                    </Text>
                  </View>

                  {this.state.ProfileData ? (
                    <View style={styles.PersonalDetailCollapseHeaderArea}>
                      <View style={styles.PersonalDetailImageArea}>
                        <Image
                          resizeMode={"cover"}
                          style={styles.PersonalDetailImageStyle}
                          source={require("../../Assets/Images/Download.png")}
                        />
                      </View>
                      <View
                        style={styles.PersonalDetailCoollapseHeaderTextArea}
                      >
                        <Text style={styles.PersonalDetailCoollapseHeaderText}>
                          {this.state.ProfileData[0].document_name} {"\n"}File
                          Size: {this.state.ProfileData[0].document_size}
                        </Text>
                      </View>

                      <View style={styles.PersonalDetailDeleteBTN}>
                        <AntIcon name="delete" color={"#fff"} size={20} />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}

          <View style={styles.PersonalDetailSectionsStyle}>
            <Text style={styles.MainHeadingTextStyle}>Gallery</Text>
            <View style={styles.PersonalDetailSectionArea}>
              <TouchableOpacity
                onPress={() => this.pickMultiple()}
                style={styles.PersonalDetailDownloadArea}
              >
                <AntIcon name="plus" color={"#767676"} size={27} />
                <Text style={styles.PersonalDetailDownloadText}>
                  {CONSTANT.PersonalDetailAddImages}
                </Text>
              </TouchableOpacity>
              {this.state.images != null ? (
                <FlatList
                  style={{ paddingBottom: 5, paddingTop: 10 }}
                  data={this.state.images}
                  keyExtractor={(y, z) => z.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity elevation={5}>
                      <View
                        style={{
                          padding: 10,
                          backgroundColor: "#dddddd",
                          marginLeft: 20,
                          marginRight: 20,
                          borderRadius: 10,
                          marginBottom: 10
                        }}
                      >
                        <View style={{}}>
                          <Text style={{ width: "80%" }}>{item.name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : null}
              <FlatList
                numColumns={2}
                data={this.state.ProfileGallery.filter(x => x != null)}
                extraData={this.state.GalleryRefresh}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: "45%",
                      borderColor: "#ddd",
                      borderWidth: 1,
                      margin: "2.5%",
                      borderRadius: 5,
                      overflow: "hidden"
                    }}
                  >
                    <Image
                      source={{ uri: item.url }}
                      resizeMode={"cover"}
                      style={{ height: 120, width: "100%", borderTopRadius: 5 }}
                    />
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "row"
                      }}
                    >
                      <Text style={{ width: "80%", padding: 5 }}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.HandleGalleryDeleteForm(index)}
                        style={{ padding: 5, width: "20%" }}
                      >
                        <AntIcon name="close" color={"red"} size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
          {
              storedType == "doctor" &&
              <View style={styles.PersonalDetailSectionsStyle}>
              <Text style={styles.MainHeadingTextStyle}>Memberships</Text>
              <View style={styles.PersonalDetailSectionArea}>
                <View>
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#7F7F7F"
                    placeholder="Your Memberships"
                    onChangeText={MembershipName =>
                      this.setState({ MembershipName })
                    }
                    style={styles.TextInputLayoutStyle}
                  />
  
                  <TouchableOpacity
                    onPress={this.fetchProfileMembershipData}
                    style={styles.PersonalDetailbuttonHover}
                  >
                    <Text style={styles.PersonalDetailbuttonText}>
                      {CONSTANT.PersonalDetailAddNow}
                    </Text>
                  </TouchableOpacity>
                </View>
  
                <FlatList
                  data={this.state.ProfileMembership}
                  extraData={this.state.MembershipRefresh}
                  renderItem={({ item, index }) => (
                    <Collapse>
                      <CollapseHeader>
                        <View style={styles.PersonalDetailCollapseHeaderArea}>
                          <TouchableOpacity
                            activeOpacity={1}
                            style={styles.PersonalDetailCoollapseHeaderTextArea}
                          >
                            <Text
                              style={styles.PersonalDetailCoollapseHeaderText}
                            >
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                          <View style={styles.PersonalDetailEditBTN}>
                            <AntIcon name="edit" color={"#fff"} size={20} />
                          </View>
                          <TouchableOpacity
                            onPress={() => this.HandleMembershipDeleteForm(index)}
                            style={styles.PersonalDetailDeleteBTN}
                          >
                            <AntIcon name="delete" color={"#fff"} size={20} />
                          </TouchableOpacity>
                        </View>
                      </CollapseHeader>
  
                      <CollapseBody>
                        <View style={{ marginTop: 10 }}>
                          <TextInput
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#7F7F7F"
                            placeholder="Your Memberships"
                            onChangeText={MembershipName =>
                              this.setState({ MembershipName })
                            }
                            style={styles.TextInputLayoutStyle}
                          >
                            {item.name}
                          </TextInput>
  
                          <TouchableOpacity
                            onPress={this.fetchProfileMembershipData}
                            style={styles.PersonalDetailbuttonHover}
                          >
                            <Text style={styles.PersonalDetailbuttonText}>
                              {CONSTANT.PersonalDetailAddNow}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  )}
                />
              </View>
            </View>
          }
         

          <TouchableOpacity
            onPress={this.UpdateProfileData}
            style={styles.PersonalDetailFooterArea}
          >
            <Text style={styles.PersonalDetailFooterText}>
              {CONSTANT.PersonalDetailUpdateAllChanges}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(PersonalDetail);
