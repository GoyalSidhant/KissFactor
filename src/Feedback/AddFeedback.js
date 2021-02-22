import React, { Component } from 'react';
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
} from 'react-native';
import styles from '../styles/DoctreatAppStyles';
import { SwipeRow, List, Content } from 'native-base';
import { Input, InputProps, Button } from 'react-native-ui-kitten';
import { RadioGroup } from "react-native-btr";
import AntIcon from 'react-native-vector-icons/AntDesign';
import { withNavigation, DrawerActions } from 'react-navigation';
import CustomHeader from '../Header/CustomHeader';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import Dash from 'react-native-dash';
import * as CONSTANT from '../Constants/Constant';

class AddFeedback extends Component {
  constructor(props) {
    super(props);
    (this.state = {
      radioButtonsforStartAs: [
        {
          label: "Yes",
          value: "yes",
          checked: true,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7
        },
        {
          label: "No",
          value: "not",
          checked: false,
          color: "#323232",
          disabled: false,
          width: "33.33%",
          size: 7
        },
      ]
    });
  }
  componentDidMount() {
  }

  render() {
    let selectedItemforStartAs = this.state.radioButtonsforStartAs.find(e => e.checked == true);
    selectedItemforStartAs = selectedItemforStartAs
      ? selectedItemforStartAs.value
      : this.state.radioButtonsforStartAs[0].value;
    return (
      <View style={styles.addFeedbackContainer}>
        <CustomHeader headerText={CONSTANT.AddFeedback} />
        <ScrollView>
          <View>
            <Text style={styles.addFeedbackText}>{CONSTANT.AddFeedbackIRecommendThisDoctor}</Text>
            <View style={styles.AddFeedbackRadioArea}>
              <RadioGroup
                color={CONSTANT.primaryColor}
                labelStyle={styles.RadioLabelStyle}
                radioButtons={this.state.radioButtonsforStartAs}
                onPress={radioButtons => this.setState({ radioButtons })}
                style={styles.RadioButtonStyle}
              />
            </View>

          </View>
        </ScrollView>

      </View>
    );
  }
}
export default withNavigation(AddFeedback);
