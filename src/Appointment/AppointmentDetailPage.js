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
  ActivityIndicator,
  TextInput,
  Image,
  FlatList,
  PanResponder,
  Dimensions,
  PermissionsAndroid,
  AsyncStorage,
} from "react-native";
// import { AsyncStorage } from '@react-native-community/async-storage';
import styles from "../styles/DoctreatAppStyles";
import { SwipeRow, List, Content } from "native-base";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import Dash from "react-native-dash";
import Moment from "moment";
import axios from "axios";
import * as CONSTANT from "../Constants/Constant";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNBackgroundDownloader from "react-native-background-downloader";
const downloadManager = require("react-native-simple-download-manager");
import RNFetchBlob from 'rn-fetch-blob';

class AppointmentDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchAppointment: [],
      isLoading: true,
      html: "",
      Store_type: "",
    };
  }
  componentDidMount() {
    this.fetchAppointmentDetail();
    this.getUser();
  }
  getUser = async () => {
    try {
      const Store_type = await AsyncStorage.getItem('user_type');
      //  console.log(storedValue ,storedType, profileImg  ,type , id);
      if (Store_type !== null) {
        this.setState({Store_type});
      } else {
        // alert('something wrong')
      }
    } catch (error) {
      // alert(error)
    }
  };
  fetchAppointmentDetail = async () => {
    const { params } = this.props.navigation.state;
    const uid = await AsyncStorage.getItem("projectUid");
    const response = await fetch(
      CONSTANT.BaseUrl + "appointments/get_single?booking_id=" + params.id
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ fetchAppointment: [], isLoading: false }); // empty data set
    } else {
      this.setState({ fetchAppointment: json, isLoading: false });
    }
  };

  ApproveAppointment = () => {
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "appointments/update_appointment_status", {
        id: params.id,
        status: "publish"
      })
      .then(async response => {
        if (response.status === 200) {
          Alert.alert("Success", JSON.stringify(response.data.message));
          this.fetchAppointmentDetail();
        } else if (response.status === 203) {
          Alert.alert("Oops", JSON.stringify(response.data.message));
        }
      })
      .catch(error => {
        Alert.alert("Oops", "Please have a look on your code");
      });
  };

  CancelAppointment = () => {
    const { params } = this.props.navigation.state;
    axios
      .post(CONSTANT.BaseUrl + "appointments/update_appointment_status", {
        id: params.id,
        status: "cancelled"
      })
      .then(async response => {
        if (response.status === 200) {
          Alert.alert("Success", JSON.stringify(response.data.message));
          this.fetchAppointmentDetail();
        } else if (response.status === 203) {
          Alert.alert("Oops", JSON.stringify(response.data.message));
        }
      })
      .catch(error => {
        Alert.alert("Oops", "Please have a look on your code");
      });
  };

  FileDownload = () => {
    const { dirs } = RNFetchBlob.fs;
    const { params } = this.props.navigation.state;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: this.props.name,
      path: `${dirs.DownloadDir}/`+ this.props.name,
      },
    })
      .fetch('GET', CONSTANT.BaseUrlforDownload + 'download-prescription?download_prescription_id=' + params.id, {})
      .then((res) => {
      })
      .catch((e) => {
        console.log(e)
    });
 }
  downloadFile = async()=> {
    try {
      const granted_permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE ,
        {
          title: CONSTANT.DownloadCardStoragePermission,
          message: CONSTANT.DownloadCardAccess
        });
      if (granted_permission === PermissionsAndroid.RESULTS.GRANTED) {
        this.FileDownload();
      } else {
        Alert.alert(CONSTANT.DownloadCardPermissionDenied, CONSTANT.DownloadCardStorage);
      }
    } catch (err) {
      console.warn(err);
    } 
  }
  // downloadPrescription = () => {
  //   const { params } = this.props.navigation.state;
   
    // checkPermission = async () => {
    
    //   // Function to check the platform
    //   // If iOS then start downloading
    //   // If Android then ask for permission
  
    //   if (Platform.OS === 'ios') {
    //     this.downloadImage();
    //   } else {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //         {
    //           title: 'Storage Permission Required',
    //           message:
    //             'App needs access to your storage to download Files',
    //         }
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         // Once user grant the permission start downloading
    //         console.log('Storage Permission Granted.');
    //         Alert.alert('Storage Permission Granted.');
    //         this.downloadImage();
    //       } else {
    //         // If permission denied then show alert
    //         Alert.alert('Storage Permission Not Granted');
    //       }
    //     } catch (err) {
    //       // To handle permission related exception
    //       console.warn(err);
    //     }
    //   }
    // };
    // downloadImage = () => {
    //   const REMOTE_FILE_PATH = CONSTANT.BaseUrlforDownload + 'download-prescription?download_prescription_id=' + params.id
    //   // Main function to download the File
      
    //   // To add the time suffix in filename
    //   let date = new Date();
    //   // File URL which we want to download
    //   let file_Url = REMOTE_FILE_PATH;    
    //   // Getting the extention of the file
    //   // let ext = this.getExtention(file_Url);
    //   // ext = '.' + ext[0];
    //   // Get config and fs from RNFetchBlob
    //   // config: To pass the downloading related options
    //   // fs: Directory path where we want our File to download
    //   const { config, fs } = RNFetchBlob;
    //   let DocumentDir = fs.dirs.Downloads;
    //   let options = {
    //     fileCache: true,
    //     addAndroidDownloads: {
    //       // Related to the Android only
    //       useDownloadManager: true,
    //       notification: true,
    //       path: DocumentDir,
    //       description: 'File',
    //     },
    //   };
    //   config(options)
    //     .fetch('GET', file_Url)
    //     .then(res => {
    //       // Showing alert after successful downloading
    //       console.log('res -> ', JSON.stringify(res));
    //       Alert.alert('File Downloaded Successfully.');
    //     });
    // };
  
    // getExtention = filename => {
    //   // To get the file extension
    //   return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
      
    // };
  
  
    //      const url = "http://url/to/file.ext?query=parmas";
    // const headers = { Authorization: "Bearer abcsdsjkdjskjdkskjd" };
    // const config = {
    //   downloadTitle: "Title that should appear in Native Download manager",
    //   downloadDescription:
    //     "Description that should appear in Native Download manager",
    //   saveAsName: "DemoFile",
    //   allowedInRoaming: true,
    //   allowedInMetered: true,
    //   showInDownloads: true,
    //   external: false, //when false basically means use the default Download path (version ^1.3)
    //   path: "Download/" //if "external" is true then use this path (version ^1.3)
    // };
    // const downloadManager = require("react-native-simple-download-manager");
    // downloadManager.download(
    //     url = "https://houzillo.com/projects/doctreat/download-prescription?download_prescription_id=1503",
    //     headers = { "Accept-Language": "en-US" },
    //     config = {
    //       downloadTitle: "Title that should appear in Native Download manager",
    //       downloadDescription:
    //         "Description that should appear in Native Download manager",
    //       saveAsName: "DemoFile",
    //       allowedInRoaming: true,
    //       allowedInMetered: true,
    //       showInDownloads: true,
    //       external: false, //when false basically means use the default Download path (version ^1.3)
    //       path: "Download/"
    //     }
    //   )
    //   .then(response => {
    //     console.log("Download success!");
    //   })
    //   .catch(err => {
    //     console.log("Download failed!");
    //   });

    // const FileDownload = require('react-native-file-download');
    // const RNFS = require('react-native-fs');
    // const URL = CONSTANT.BaseUrl + "prescription/download_prescription?download_prescription_id=" + params.id;
    // const DEST = RNFS.DocumentDirectoryPath
    // const fileName = 'zip.zip'
    // const headers = {
    //   'Accept-Language': 'en-US'
    // }

    // FileDownload.download(URL, DEST, fileName, headers)
    // .then((response) => {
    //   console.log(`downloaded! file saved to: ${response}`)
    // })
    // .catch((error) => {
    //   console.log(error)
    // })
    // RNBackgroundDownloader.download({
    //   id: 'file123',
    //   url: 'https://houzillo.com/projects/doctreat/download-prescription?download_prescription_id=1503',
    //   destination: `${RNBackgroundDownloader.directories.documents}`
    // }).begin((expectedBytes) => {
    //   console.log(`Going to download ${expectedBytes} bytes!` , JSON.stringify(CONSTANT.BaseUrl )+ "prescription/download_prescription?download_prescription_id=" + JSON.stringify(params.id));
    // }).progress((percent) => {
    //   console.log(`Downloaded: ${percent * 100}%`);
    // }).done(() => {
    //   console.log('Download is done!' , JSON.stringify(RNBackgroundDownloader.directories.documents));
    // }).error((error) => {
    //   console.log('Download canceled due to error: ', error);
    // });

    // const { params } = this.props.navigation.state;
    // Alert.alert(JSON.stringify(params.id))
    // const response = await fetch(
    //   CONSTANT.BaseUrl + "prescription/download_prescription?download_prescription_id=" + params.id
    // );
    // const json = await response.json();

    // if (
    //   Array.isArray(json) &&
    //   json[0] &&
    //   json[0].type &&
    //   json[0].type === "error"
    // ) {
    //   Alert.alert("Oops" ,  JSON.stringify(json) );
    //   console.log(JSON.stringify(json));
    // } else {
    //   Alert.alert("good");
    //   // var value=json.html;
    //   // var removeDataN=value.replace(/\n/g,"");
    //   // var removeDataT = removeDataN.replace(/\t/g,"");
    //   // var removeDataR = removeDataT.replace(/\r/g,"");
    //   // var res = removeDataR.replace(/\\/g,"");
    //   // Alert.alert("Data" ,  JSON.parse(res));
    //   //   //Alert.alert("Success" , JSON.stringify(json) );
    //   //   let options = {
    //   //     html:  res,
    //   //     fileName: 'demo',
    //   //     directory: 'Documents',
    //   //   };

    //   // let file = await RNHTMLtoPDF.convert(options)
    //   //   // console.log(file.filePath)
    //   // Alert.alert("This is file path" , file.filePath);
    //   //   // console.log("File Path" , JSON.stringify(file.filePath));
    //   //   // this.setState({html: response.data.html} , this.createPDF.bind(this))
    //  }
  // };

  render() {
    const { isLoading } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={CONSTANT.AppointmentDetailPageheaderText} />
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
          <View style={styles.AppointmentDetailMainArea}>
            <View style={styles.AppointmentDetailHeaderArea}>
              {/* <View style={styles.AppointmentDetailImageArea}>
                {this.state.fetchAppointment.image != "" ? (
                  <Image
                    source={{ uri: this.state.fetchAppointment.image }}
                    style={styles.AppointmentDetailImageStyle}
                  />
                ) : (
                  <Image
                    source={{
                      uri: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjM2JiZTYtZDJmMy0yZTRkLWFlYzAtYjU1NThiMDVlMDI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFGQUMxQTAxRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFGQUMxQTAwRUVDQzExRTc5MTY4Q0JGNkVDOERCMkYxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI4NzM2MWE3LTExMTctNzg0YS05ZmVlLTVhYzRiMTU3OWU5ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxYWMzYmJlNi1kMmYzLTJlNGQtYWVjMC1iNTU1OGIwNWUwMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAIAAgADASIAAhEBAxEB/8QAXwABAQEBAQAAAAAAAAAAAAAAAAMCAQYBAQAAAAAAAAAAAAAAAAAAAAAQAQACAAYCAwEBAQEAAAAAAAABAhExUWFxEzIDIUGhgRJCkREBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A92AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMxGcgDM+ysZfLM+2fr4BRybVjOUptac5cBXspq1ExOSBFprOMAuFZi0YwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADk3rH2zPtj6gGzHDNKfZadmcZnMFZ9lY3Zn26QwA7N7T9uDsUtP0Dg3Hq1lqPXWPrEEsJnJqPXadlQEreuaxjjiyvMYxMIA36pzhRGk4WhYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcm9YzlztruDROP0x213O2u4Oz2TlhDM+u85y7213O2u4M9Vtjqts1213O2u4M9Vtjqts1213O2u4OR6p+5aj11jP5c7a7nbXcG4iIygY7a7nbXcGxjtrudtdwbGO2u5213BtO3rmZmYwd7a7nbXcHOq2sKMdtdztruDYx213d7a7g0ORes5S6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5Norm7af8xihMzM4yDc+3SGZvaftwBT1R/wBSey+HxGbVYwrCV5xtIOAp1RqCYp1RrJ1RrIJinVGsnVGsgmKdUaydUayCYp1RrJ1RrIJinVGsnVGsgmKdUaydUayCYp1RrJ1RrIJinVGsnVGsgmKdUaydUayCYp1RrJ1RrIJinVGsnVGoJqeu+PxOacxhODtZwtALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAx7coTV9kY14SBv10iYxlSIiMoT9U5woAhbynldC3lPIEZwuhGcLgA5a0VjGQdEp9lpy+HP8AdtQWE6+2f+v/AFSJifmAAAAAAAAAAAAAAAAAQt5TyVzjkt5TyVzjkFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJjGJhBdG8YWkCk4WhZBeJxiJAQt5TyuhbynkCM4XQjOFwJ+PlG1ptOKns8ZSAAAa9dsJw+pZAXAAAAAAAAGeyP9YfWrQAAAAAAIW8p5K5xyW8p5K5xyC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACftjKVGfZGNZ2BJX1zjXDRJv1T8zGoKIW8p5XQt5TyBGcLoRnC4OXjGsorpXp/mdgZAAIjGcBT10/6n+A2AAAAAAne/wBR/ZL3+o/ssAN0vh8TkwAuJ0vh8TkoAAAACFvKeSucclvKeSuccguAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZgCE/E4O1nC0S77IwtyyC6FvKeV6/MRwhbynkCM4XQjOFwAAYn1ROXw51TqoAzX11jeWgAAAAATvf6j+yXv8AUf2WAAAAAG6Xw+JyYAXE6Xw+JyUAABC3lPJXOOS3lPJXOOQXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj2x8RKa14xrKILV8Y4Rt5TytXxjhG3lPIEZwuhGcLgAAA5a0VjGQLWisYy5S/+vifiUrWm04yAuM0v/r4nNoBO9/qP7Je/1H9lgAAAAAAAABul8PicmAFxn1+LQIW8p5K5xyW8p5K5xyC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACExhMwul7IwtjqClfGOEbeU8rV8Y4Rt5TyBGcLoRnC4AFrRWMZBy1orGMo2tNpxktabTjIAAA1PsmYw/wDZZAAAAAAAAAAAAAV9Xj/WmfV4/wBaBC3lPJXOOS3lPJXOOQXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY9sfGOjZaMazAOV8Y4Rt5TytXxjhG3lPIEZwuhGcLgWmKxjKNrTacZU9nikAAAAAAAAAAAAAAAAAACvq8f60z6vH+tAhbynkrnHJbynkrnHILgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIW8p5XQt5TyBGcLoRnC4M+zxSWtX/UYZMdW/4DA31b/h1b/gMDfVv+HVv+AwN9W/4dW/4DA31b/h1b/gMDfVv+HVv+AwN9W/4dW/4DA31b/h1b/gMDfVv+HVv+AwN9W/4dW/4DXq8f605Wv+YwzdBC3lPJXOOS3lPJXOOQXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQt5Tyul7IwtO4MxnC6Dv+76gsI9l9TsvqCwj2X1Oy+oLCPZfU7L6gsI9l9TsvqCwj2X1Oy+oLCPZfU7L6gsI9l9TsvqCwj2X1Oy+oLCPZfU7L6gsI9l9TsvqCwj2X1Oy+oOW8p5K5xyO0jG0bfILAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOWrFodARmsxm4uAgL4GAIC+BgCAvgYAgL4GAIC+BgCAvgYAgL4GAIC+BgCAvgYAgL4GAIC+ACMVmcoVrWKxu6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k="
                    }}
                    style={styles.AppointmentDetailImageStyle}
                  />
                )}
              </View> */}
              <View style={styles.AppointmentDetailNameArea}>
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailUseTypeText}>
                    {this.state.fetchAppointment.user_type}
                  </Text>
                )}
                {this.state.fetchAppointment.name != "" && (
                  <Text
                    numberOfLines={2}
                    style={styles.AppointmentDetailNameText}
                  >
                    {this.state.fetchAppointment.name}
                  </Text>
                )}
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailCountryText}>
                    {this.state.fetchAppointment.country}
                  </Text>
                )}
              </View>
              <View style={styles.AppointmentDetailLefBorder} />
              <View style={styles.AppointmentDetailAcceptedArea}>
                <View>
                  {this.state.fetchAppointment.post_status == "Confirmed" ? (
                    <View>
                      <AntIcon
                        name="checkcircle"
                        color={"#3fabf3"}
                        size={15}
                        style={styles.AppointmentDetailAcceptedIcon}
                      />
                      <Text style={styles.AppointmentDetailAcceptedText}>
                        {CONSTANT.AppointmentDetailPageAccepted}
                      </Text>
                    </View>
                  ) : this.state.fetchAppointment.post_status == "pending" ? (
                    <View>
                      <AntIcon
                        name="loading1"
                        color={"#999999"}
                        size={15}
                        style={styles.AppointmentDetailAcceptedIcon}
                      />
                      <Text style={styles.AppointmentDetailAcceptedText}>
                        {CONSTANT.AppointmentDetailPagePending}
                      </Text>
                    </View>
                  ) : this.state.fetchAppointment.post_status == "rejected" ? (
                    <View>
                      <AntIcon
                        name="circle-with-cross"
                        color={"#fe736e"}
                        size={15}
                        style={styles.AppointmentDetailAcceptedIcon}
                      />
                      <Text style={styles.AppointmentDetailAcceptedText}>
                        {CONSTANT.AppointmentDetailPageRejected}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={styles.AppointmentDetailBorderBottom} />
            <View style={styles.AppointmentDetailBodyMainArea}>
              {this.state.fetchAppointment.other_name != "" ? (
                <View style={styles.AppointmentDetailBodyArea}>
                  <Text style={styles.AppointmentDetailBodyHeading}>
                    {CONSTANT.AppointmentDetailPagePatientName}
                  </Text>
                  {this.state.fetchAppointment && (
                    <Text style={styles.AppointmentDetailBodyText}>
                      {this.state.fetchAppointment.other_name}
                    </Text>
                  )}
                </View>
              ) : null}

              {this.state.fetchAppointment.email != "" ? (
                <View style={styles.AppointmentDetailBodyArea}>
                  <Text style={styles.AppointmentDetailBodyHeading}>
                    Email:
                  </Text>
                  {this.state.fetchAppointment && (
                    <Text style={styles.AppointmentDetailBodyText}>
                      {this.state.fetchAppointment.email}
                    </Text>
                  )}
                </View>
              ) : null}

              {this.state.fetchAppointment.phone != "" ? (
                <View style={styles.AppointmentDetailBodyArea}>
                  <Text style={styles.AppointmentDetailBodyHeading}>
                    Phone No:
                  </Text>
                  {this.state.fetchAppointment && (
                    <Text style={styles.AppointmentDetailBodyText}>
                      {this.state.fetchAppointment.phone}
                    </Text>
                  )}
                </View>
              ) : null}

              {this.state.fetchAppointment.other_relation != "" ? (
                <View style={styles.AppointmentDetailBodyArea}>
                  <Text style={styles.AppointmentDetailBodyHeading}>
                    {CONSTANT.AppointmentDetailPageRelationWithUser}
                  </Text>
                  {this.state.fetchAppointment && (
                    <Text style={styles.AppointmentDetailBodyText}>
                      {this.state.fetchAppointment.other_relation}
                    </Text>
                  )}
                </View>
              ) : null}

              <View style={styles.AppointmentDetailBodyArea}>
                <Text style={styles.AppointmentDetailBodyHeading}>
                  {CONSTANT.AppointmentDetailPageAppointmentLocation}
                </Text>
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailBodyText}>
                    {this.state.fetchAppointment.loc_title}
                  </Text>
                )}
              </View>
              <View style={styles.AppointmentDetailBodyArea}>
                <Text style={styles.AppointmentDetailBodyHeading}>
                  {CONSTANT.AppointmentDetailPageAppointmentDate}
                </Text>
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailBodyText}>
                    {this.state.fetchAppointment.slots}
                  </Text>
                )}
              </View>

              {/* <View style={{marginLeft: 15, marginTop: 15, marginRight: 15}}>
              <Text style={{fontSize: 15}}>{CONSTANT.AppointmentDetailPageCharges}</Text>
              {this.state.fetchAppointment && (
                <Text style={{fontSize: 17}}>
                  {this.state.fetchAppointment.charges}
                </Text>
              )}
            </View> */}
              {this.state.fetchAppointment && (
                <View style={styles.AppointmentDetailBodyArea}>
                  <Text style={styles.AppointmentDetailBodyHeading}>
                    {CONSTANT.AppointmentDetailPageServicesRequired}
                  </Text>
                  <FlatList
                    data={this.state.fetchAppointment.all_sp_serv}
                    keyExtractor={(x, i) => i.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity activeOpacity={0.9}>
                        <View>
                          <Text style={styles.AppointmentDetailBodyText}>
                            {item.specialities} {'\n'}Name: {item.services.name}{'\n'}Price: {item.services.price}{'\n'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              <View style={styles.AppointmentDetailBodyArea}>
                <Text style={styles.AppointmentDetailBodyHeading}>
                  {CONSTANT.AppointmentDetailPageComments}
                </Text>
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailBodyText}>
                    {this.state.fetchAppointment.content}
                  </Text>
                )}
              </View>

              <View style={styles.AppointmentDetailBodyArea}>
                <Text style={styles.AppointmentDetailBodyHeading}>
                  Consultation Fee:
                </Text>
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailBodyText}>
                    {this.state.fetchAppointment.consultation_fee}
                  </Text>
                )}
              </View>

              <View style={styles.AppointmentDetailBodyArea}>
                <Text style={styles.AppointmentDetailBodyHeading}>
                  Total Fee:
                </Text>
                {this.state.fetchAppointment && (
                  <Text style={styles.AppointmentDetailBodyText}>
                    {this.state.fetchAppointment.total_fees}
                  </Text>
                )}
              </View>
            </View>
            {this.state.fetchAppointment.post_status == "pending" && (
              <View style={styles.AppointmentDetailButtonArea}>
                <TouchableOpacity
                  onPress={() => this.ApproveAppointment()}
                  style={styles.AppointmentDetailButtonStyle1}
                >
                  <Text style={styles.AppointmentDetailButtonText}>
                    {CONSTANT.AppointmentDetailPageApprove}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.CancelAppointment()}
                  style={styles.AppointmentDetailButtonStyle2}
                >
                  <Text style={styles.AppointmentDetailButtonText}>
                    {CONSTANT.AppointmentDetailPageReject}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {this.state.fetchAppointment.post_status == "Confirmed" && (
              <View style={{ flexDirection: "row" }}>
                {
                  this.state.Store_type == "doctor" &&
                  <AntIcon
                  onPress={() =>
                    this.props.navigation.navigate("Prescription", {
                      id: params.id
                    })
                  }
                  name="form"
                  color={"#767676"}
                  size={30}
                  style={{ marginLeft: 15, marginTop: 15, marginBottom: 15 }}
                />
                }
               
                <AntIcon
                  onPress={() => this.downloadFile()}
                  name="download"
                  color={"#767676"}
                  size={30}
                  style={{ marginLeft: 15, marginTop: 15, marginBottom: 15 }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(AppointmentDetailPage);
