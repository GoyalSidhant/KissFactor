import React, { Component } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Text , Image  , Dimensions} from "react-native";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as CONSTANT from '../Constants/Constant';
import styles from '../styles/DoctreatAppStyles';

class TopCategoryCard extends Component {
  render() {
    return (
      <View style={styles.TopCategoryCardcontainer}>
      
        <View style={[ styles.CardMainView, {backgroundColor: this.props.colorCode} ]}>
        <View style={styles.ThirdLayerStyle}>
        </View>
        <View style={styles.SecondLayerStyle}>
         </View>
         <View style={styles.FirstLayerStyle}>
         <Image resizeMode={'contain'} style={styles.CatImageStyle}
          source={this.props.imageUri}
        />
         </View>
        <Text numberOfLines={1} style={styles.CardMainViewText}>{this.props.name}</Text>
       </View>
    
      </View>
    );
  }
}
export default TopCategoryCard;
