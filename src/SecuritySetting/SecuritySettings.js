import React, { Component } from "react";
import { View, StyleSheet, StatusBar, ScrollView,Switch, Text, TouchableOpacity, TextInput, Image, FlatList,ActivityIndicator, PanResponder, Alert, Dimensions } from "react-native";
import { withNavigation, DrawerActions } from 'react-navigation';
import {ScrollableTabView, DefaultTabBar} from '@valdio/react-native-scrollable-tabview'
import CustomHeader from '../Header/CustomHeader';
import * as CONSTANT from '../Constants/Constant';

import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import AccountSecuritySetting from './AccountSecuritySetting';
import ManageEmailNotification from './ManageEmailNotification';
import axios from "axios";
import styles from '../styles/DoctreatAppStyles';
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

class SecuritySettings extends Component {
    state={
      switchfeaturedValue: false,
      sendSwitchFeaturedValue: "",
    }
    
  render() {

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={CONSTANT.SecuritySettingHeaderText} />
        <ScrollableTabView 
          tabBarTextStyle={styles.tabBarTextStyle} 
          tabBarUnderlineStyl={styles.tabBarUnderlineStyl} 
          tabBarActiveTextColor="#3d4461" 
          style={styles.tabBarStyle} 
          showsHorizontalScrollIndicator={false}
        >
          <ChangePassword  tabLabel={CONSTANT.SecuritySettingTabPassword} />
          <DeleteAccount tabLabel={CONSTANT.SecuritySettingTabAccount} />
          <AccountSecuritySetting tabLabel={CONSTANT.SecuritySettingTabSecurity} />
          <ManageEmailNotification tabLabel={CONSTANT.SecuritySettingTabEmail} />
        </ScrollableTabView>
      </View>
    );
  }
}
export default withNavigation(SecuritySettings);
