import React, { Component } from "react";
import {
  View,
  StyleSheet,
  WebView,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Image,
  CheckBox,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import styles from '../styles/DoctreatAppStyles';
import AntIcon from "react-native-vector-icons/AntDesign";
import { RadioGroup } from "react-native-btr";
import * as CONSTANT from "../Constants/Constant";
import { ScrollView } from "react-native-gesture-handler";
import MultiSelect from "react-native-multiple-select";
import CustomHeader from '../Header/CustomHeader';
import axios from "axios";
// import constants from "jest-haste-map/build/constants";
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();
class SignupScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      projectLocationKnown: "",
      DepartmentKnown: "",
      EmployeeKnown: "",
      FirstName: "",
      LastName: "",
      UserName: "",
      DisplayName: "",
      Email: "",
      Password: "",
      RetypePassword: "",
      CheckSettingData:"",
      fetching_from_server:false,
      //   radioButtons: [
      //     {
      //       label:CONSTANT.SignupMale,
      //       value: "male",
      //       checked: true,
      //       color: "#323232",
      //       disabled: false,
      //       width: "33.33%",
      //       size: 7
      //     },
      //     {
      //       label:CONSTANT.SignupFemale,
      //       value: "female",
      //       checked: false,
      //       color: "#323232",
      //       disabled: false,
      //       width: "33.33%",
      //       size: 7
      //     }
      //   ],
      radioButtonsforStartAs: [
        {
          label: CONSTANT.SignupHospital,
          value: "hospitals",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          fontFamily:CONSTANT.PoppinsRegular,
          size: 7
        },
        {
          label: CONSTANT.SignupDoctor,
          value: "doctors",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          fontFamily:CONSTANT.PoppinsRegular,
          size: 7
        },
        {
          label: CONSTANT.SignupRegularUser,
          value: "regular_users",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          fontFamily:CONSTANT.PoppinsRegular,
          size: 7
        }
      ]
    };
    this.showFilters = true;
  }
  componentDidMount() {
    this.ProjectLocationSpinner();
    this.CheckVerifyPage();
  }
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
  CheckVerifyPage = async () => {
    const response = await fetch(CONSTANT.BaseUrl + 'user/get_theme_settings');
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === 'error'
    ) {
      this.setState({CheckSettingData: '', isLoading: false}); // empty data set
    } else {
      this.setState({CheckSettingData: json, isLoading: false});
    }
  };

  CreateAccount = () => {
    
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const {
      projectLocationKnown,
      FirstName,
      LastName,
      UserName,
      DisplayName,
      Email,
      Password,
      RetypePassword
    } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      FirstName == "" &&
      LastName == "" &&
      Email == "" &&
      Password == "" &&
      RetypePassword == "" &&
      UserName == "" &&
      DisplayName == ""
    ) {
      alert("Please enter Complete Detail");
      this.setState({ email: "Please enter Complete Detail" });
    } else if (reg.test(Email) === false) {
      alert("Email is Not Correct");
      this.setState({ email: "Email is Not Correct" });
      return false;
    } else if (Password !== RetypePassword) {
      alert("Passwords don't match");
    } else {
      this.setState({
        fetching_from_server:true
      })
      axios
        .post(CONSTANT.BaseUrl + "user/signup", {
          username: UserName,
          email: Email,
          first_name: FirstName,
          last_name: LastName,
          display_name: DisplayName,
          location: projectLocationKnown[0],
          password: Password,
          verify_password: RetypePassword,
          user_type: selectedItemforStartAs,
          termsconditions: "yes"
        })
        .then(async response => {
          if (response.status === 200) {
            if(response.data.type == 'demo'){
              this.setState({
                fetching_from_server:false,
              })
              alert(JSON.stringify(response.data.message));
            }else{
              if(this.state.CheckSettingData.verify_user != "no"){
              Alert.alert("Response", response.data.message);
                        this.props.navigation.navigate("VerificationAccount", {
                          user_id: response.data.user_id
                        });
                        this.setState({
                          fetching_from_server:false
                        })
              } else {
                Alert.alert("Response", response.data.message);
              }
            }
          } else if (response.status === 203) {
            Alert.alert("Error" + response.data.message);
            this.setState({
              fetching_from_server:false
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  render() {
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(
      e => e.checked == true
    );
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    const {
      FirstName,
      LastName,
      UserName,
      DisplayName,
      Email,
      Password,
      RetypePassword
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.SignUpcontainer}>
        {/* <StatusBar backgroundColor="#fff" barStyle="light-content" /> */}
        <CustomHeader headerText={CONSTANT.SignupHeader} />
        <ScrollView>
          <Image
            style={styles.SignupImageStyle}
            source={require("../../Assets/Images/SplashImage.png")}
          />
          <Text
            style={styles.SignupParagraphText}
          >
            {CONSTANT.Signupmain}
          </Text>
          <View
            style={styles.SignupHeadingArea}
          >
            <Text
              style={styles.SignupHeadingText}
            >
              {CONSTANT.SignupStartas}
            </Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <RadioGroup
              color={CONSTANT.primaryColor}
              labelStyle={{ fontSize: 14 }}
              radioButtons={this.state.radioButtonsforStartAs}
              onPress={radioButtons => this.setState({ radioButtons })}
              style={styles.RadioButtonStyle}
            />
          </View>
          <View
            style={styles.SignupHeadingArea}
          >
            <Text
              style={styles.SignupHeadingText}
            >
              {CONSTANT.SignupPersonal}
            </Text>
          </View>
          <View
            style={styles.SignupTextInputArea}
          >
            {/* <View style={{}}>
              <RadioGroup
                color={CONSTANT.primaryColor}
                labelStyle={{ fontSize: 14 }}
                radioButtons={this.state.radioButtons}
                onPress={radioButtons => this.setState({ radioButtons })}
                style={{
                  paddingTop: 0,
                  flexDirection: "row",
                  marginBottom: 10,
                  marginTop: 10,
                  marginLeft: 10,
                  display: "flex",
                  width: "100%",
                  alignSelf: "center",
                  alignContent: "center",
                  textAlign: "center"
                }}
              />
            </View>
            <View
              style={{
                borderBottomColor: "#dddddd",
                borderBottomWidth: 0.6
              }}
            /> */}
            <TextInput
              style={styles.SignupTextInput}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={FirstName => this.setState({ FirstName })}
              placeholder={CONSTANT.SignupFname}
            ></TextInput>
            <View
              style={styles.SignupTextInputBorder}
            />
            <TextInput
              style={styles.SignupTextInput}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={LastName => this.setState({ LastName })}
              placeholder={CONSTANT.SignupLname}
            ></TextInput>
            <View
              style={styles.SignupTextInputBorder}
            />
            <TextInput
              style={styles.SignupTextInput}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={UserName => this.setState({ UserName })}
              placeholder={CONSTANT.SignupUname}
            ></TextInput>
            <View
              style={styles.SignupTextInputBorder}
            />
            <TextInput
              style={styles.SignupTextInput}
              underlineColorAndroid="transparent"
              editable={true}
              placeholderTextColor="#999999"
              onChangeText={DisplayName => this.setState({ DisplayName })}
              placeholder={CONSTANT.SignupDname}
            ></TextInput>
            <View
              style={styles.SignupTextInputBorder}
            />
            <View style={styles.SignupTextInputWithIconArea}>
              <TextInput
                style={styles.SignupTextInputWithIcon}
                underlineColorAndroid="transparent"
                editable={true}
                placeholderTextColor="#999999"
                autoCompleteType="email"
                onChangeText={Email => this.setState({ Email })}
                placeholder={CONSTANT.SignupEmail}
              ></TextInput>
              <AntIcon
                name="mail"
                size={15}
                color={"#999999"}
                style={styles.SignupTextInputIconStyle}
              />
            </View>
            <View
              style={styles.SignupTextInputBorder}
            />
            <View style={styles.SignupTextInputWithIconArea}>
              <TextInput
                style={styles.SignupTextInputWithIcon}
                underlineColorAndroid="transparent"
                editable={true}
                placeholderTextColor="#999999"
                autoCompleteType="password"
                onChangeText={Password => this.setState({ Password })}
                placeholder={CONSTANT.SignupPassword}
              ></TextInput>
              <AntIcon
                name="lock"
                size={15}
                color={"#999999"}
                style={styles.SignupTextInputIconStyle}
              />
            </View>
            <View
              style={styles.SignupTextInputBorder}
            />
            <View style={styles.SignupTextInputWithIconArea}>
              <TextInput
                style={styles.SignupTextInputWithIcon}
                underlineColorAndroid="transparent"
                editable={true}
                placeholderTextColor="#999999"
                autoCompleteType="password"
                onChangeText={RetypePassword =>
                  this.setState({ RetypePassword })
                }
                placeholder={CONSTANT.SignupRetypePassword}
              ></TextInput>
              <AntIcon
                name="lock"
                size={15}
                color={"#999999"}
                style={styles.SignupTextInputIconStyle}
              />
            </View>
          </View>
          <View
            style={styles.SignupHeadingArea}
          >
            <Text
              style={styles.SignupHeadingText}
            >
              {CONSTANT.SignupLocation}
            </Text>
          </View>
          <View style={{ marginLeft: 15, marginRight: 15 }}>
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
              styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
              displayKey="name"
              submitButtonText="Submit"
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity
            onPress={this.CreateAccount}
            style={styles.MainButtonArea}
          >
            <Text
              style={styles.MainButtonText}
            >
              {CONSTANT.SignupContinue}
            </Text>
            {this.state.fetching_from_server == true ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
          </TouchableOpacity>
          {/* <TouchableOpacity
          onPress={this.CreateAccount}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>  {CONSTANT.SignupContinue}</Text>
          {this.state.fetching_from_server == true ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity> */}
          <View
            style={styles.SignupFooterArea}
          >
            <Text
              style={styles.SignupFooterText}
            >
              {CONSTANT.SignupMoveSignin}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
export default SignupScreen;
