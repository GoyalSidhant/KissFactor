import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Text,
  Image,
  Alert,
  PermissionsAndroid
} from "react-native";
import styles from '../../styles/DoctreatAppStyles';
import StarRating from "react-native-star-rating";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import RNFetchBlob from "rn-fetch-blob";
import * as CONSTANT from "../../Constants/Constant";
class DownloadCard extends Component {

  FileDownload = () => {
    const { dirs } = RNFetchBlob.fs;
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
      .fetch('GET', this.props.Url, {})
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
  render() {
   
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={()=> this.downloadFile()}
        style={styles.downloadContainer}>
        <View style={styles.downloadMain}>
          <View style={styles.downloadImageArea}>
            <Image
              resizeMode={"cover"}
              style={styles.downloadImageStyle}
              source={require("../../../Assets/Images/Download.png")}
            />
          </View>  
          <View style={styles.downloadTextArea}>
            <Text
              numberOfLines={1}
              style={styles.downloadTextstyle1}
            >
              {this.props.name}(sdgsdbklsdjhlsddgj.dghkdfsghdslkfghds)
            </Text>
            <Text
              numberOfLines={1}
              style={styles.downloadTextstyle2}
            >
              {this.props.size}
            </Text>
          </View>
          <View
            style={styles.downloadIconArea}
          >
            <AntIcon
              name="download"
              color={"#484848"}
              size={15}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default withNavigation(DownloadCard);
