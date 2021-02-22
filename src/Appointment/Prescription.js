import React, {Component} from 'react';
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
  Alert,
  SafeAreaView,
  AsyncStorage
} from 'react-native';
// import { AsyncStorage } from '@react-native-community/async-storage';
import MultiSelect from "react-native-multiple-select";
import {RadioGroup} from 'react-native-btr';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { withNavigation, DrawerActions } from "react-navigation";
import * as CONSTANT from "../Constants/Constant";
import styles from "../styles/DoctreatAppStyles";
import CustomHeader from "../Header/CustomHeader";
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';

class Prescription extends Component {
  
  state = {
    personalInformationRadioButtons: [
      {
        label: 'Male',
        value: 'male',
        checked: true,
        color: '#323232',
        disabled: false,
        size: 7,
      },
      {
        label: "Female",
        value: 'female',
        checked: false,
        color: '#323232',
        disabled: false,
        size: 7,
      },
    ],
    spinner: false,
    patientLocationSelected:'',
    patientLaboratory_testsSelected:[],
    patientDiseaseSelected:[],
    patientMarital_statusSelected:'',
    patientMedicine_durationSelected:'',
    patientMedicine_usageSelected:'',
    patientMedicine_typesSelected:'',
    patientChildhood_illnessSelected:[],
    patientVital_signsSelected:'',
    patientName:'',
    patientNo:'',
    age:'',
    address:'',
    value:'',
    history:'',
    name:'',
    comment:'',
    commonIssue: [],
    newCommonIssue:[],
    Vitalrefresh: false,
    medicationsList: [],
    medicationsRefresh: false,
  }

  componentDidMount() {
    this.patientLocationSpinner();
    this.patientLaboratory_testsSpinner();
    this.patientDiseaseSpinner();
    this.patientMarital_statusSpinner();
    this.patientMedicine_durationSpinner();
    this.patientMedicine_usageSpinner();
    this.patientMedicine_typesSpinner();
    this.patientChildhood_illnessSpinner();
    this.patientVital_signsSpinner();
  }
  patientLocationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + "taxonomies/get_taxonomy?taxonomy=locations",
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
        let patientLocation = responseJson;
        this.setState({
          patientLocation
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientLaboratory_testsSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=laboratory_tests',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientLaboratory_tests = responseJson;
        this.setState({
          patientLaboratory_tests,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientDiseaseSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=diseases',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientDisease = responseJson;
        this.setState({
          patientDisease,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientMarital_statusSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=marital_status',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientMarital_status = responseJson;
        this.setState({
          patientMarital_status,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientMedicine_durationSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=medicine_duration',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientMedicine_duration = responseJson;
        this.setState({
          patientMedicine_duration,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientMedicine_usageSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=medicine_usage',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientMedicine_usage = responseJson;
        this.setState({
          patientMedicine_usage,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientMedicine_typesSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=medicine_types',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientMedicine_types = responseJson;
        this.setState({
          patientMedicine_types,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientChildhood_illnessSpinner = async () => {
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=childhood_illness',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientChildhood_illness = responseJson;
        this.setState({
          patientChildhood_illness,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  patientVital_signsSpinner = async () => {
    this.setState({
      spinner: true,
    });
    return fetch(
      CONSTANT.BaseUrl  + 'taxonomies/get_taxonomy?taxonomy=vital_signs',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let patientVital_signs = responseJson;
        this.setState({
          patientVital_signs,
          spinner: false,
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({   spinner: false,})
      });
  };
  addCommonIssue =(id) => {
    this.setState({
      Vitalrefresh: true,
    });
    this.state.commonIssue[id] = { name: id, value: this.state.value };
    const result = this.state.commonIssue.filter(key => key != null);
    console.log(result);
    this.setState({
      Vitalrefresh: true,
    });
  }
  addMedicationsList =() => {
    if(this.state.patientMedicine_typesSelected.toString() != '' && this.state.patientMedicine_durationSelected.toString() != '' && this.state.patientMedicine_usageSelected.toString() != ''){
      this.setState({
        medicationsRefresh: true,
      });
      this.state.medicationsList.push({
        name: this.state.name,
        medicine_types: this.state.patientMedicine_typesSelected.toString(),
        medicine_duration: this.state.patientMedicine_durationSelected.toString(),
        medicine_usage: this.state.patientMedicine_usageSelected.toString(),
        detail: this.state.comment,
      });
      this.setState({
        medicationsRefresh: true,
      });
    }else {
      Alert.alert("Oops" , "Please add complete data")
    }
   
  }
  CreatePrescription = async () => {
    this.setState({
      spinner: true,
    });
    let genderItem = this.state.personalInformationRadioButtons.find(
      e => e.checked == true
    );
    genderItem = genderItem
      ? genderItem.value
      : this.state.personalInformationRadioButtons[0].value;

    const { params } = this.props.navigation.state;
    const uid = await AsyncStorage.getItem("projectUid");
    const {
      patientName,
      patientNo,
      age,
      address,
      value,
      history,
      name,
      comment,
      patientLocationSelected,
      patientLaboratory_testsSelected,
      patientDiseaseSelected,
      patientMarital_statusSelected,
      patientMedicine_durationSelected,
      patientMedicine_usageSelected,
      patientMedicine_typesSelected,
      patientChildhood_illnessSelected,
      patientVital_signsSelected,
    } = this.state;
    
    axios.post(CONSTANT.BaseUrl + "prescription/create_prescription", {
      user_id: uid,
      booking_id: params.id,
      patient_name : patientName,
      phone : patientNo,
      age: age,
      address : address,
      location: patientLocationSelected.toString(),
      gender: genderItem,
      marital_status: patientMarital_statusSelected.toString(),
      medical_history: history,
      childhood_illness: patientChildhood_illnessSelected,
      diseases: patientDiseaseSelected ,
      laboratory_tests: patientLaboratory_testsSelected,
      vital_signs: this.state.commonIssue.filter(x => x != null),
      medicine: this.state.medicationsList,
    })
    .then(async response => {
      if (response.status === 200) {
        Alert.alert("Success" , JSON.stringify(response.data.message))
        this.setState({
          spinner: false,
        });
      } else if (response.status === 203) {
        Alert.alert("Oops" , JSON.stringify(response.data.message))
        this.setState({
          spinner: false,
        });
      }
    })
    .catch(error => {
      Alert.alert("Error" , JSON.stringify(error))
    });
  }
  render() {
    const {spinner} = this.state;
    return (
      <SafeAreaView style={styles.container}>
          <CustomHeader headerText={'Prescription'} />
          {spinner ? (
            <Spinner
              visible={this.state.spinner}
              textContent={CONSTANT.BookAppointmentPleaseWait}
              color={'#fff'}
              textStyle={styles.SpinnerTextStyle}
            />
          ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <Text style={styles.MainHeadingTextStyle}>Personal Information:</Text>
            <View>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Patient Name"
                  style={styles.TextInputLayoutStyle}
                  onChangeText={patientName => this.setState({patientName})}>
                </TextInput>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Patient Phone"
                  keyboardType="numeric"
                  style={styles.TextInputLayoutStyle}
                  onChangeText={patientNo => this.setState({patientNo})}>
                </TextInput>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Age"
                  style={styles.TextInputLayoutStyle}
                  onChangeText={age => this.setState({age})}>
                </TextInput>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder="Address"
                  style={styles.TextInputLayoutStyle}
                  onChangeText={address => this.setState({address})}>
                </TextInput>
            </View>
              
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientLocationSelected: value})
                }
                selectedItems={this.state.patientLocationSelected}
                items={this.state.patientLocation}
                uniqueKey="id"
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search Location..."
                onChangeInput={text => console.log(text)}
                selectText="Select Location"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
            <View>
              <RadioGroup
                color="#3fabf3"
                labelStyle={styles.RadioLabelStyle}
                radioButtons={this.state.personalInformationRadioButtons}
                onPress={personalInformationRadioButtons => this.setState({personalInformationRadioButtons})}
                style={styles.RadioButtonStyle}
              />
            </View>
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <Text style={styles.MainHeadingTextStyle}>Marital Status:</Text>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientMarital_statusSelected: value})
                }
                selectedItems={this.state.patientMarital_statusSelected}
                items={this.state.patientMarital_status}
                uniqueKey="id"
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search Marital Status..."
                onChangeInput={text => console.log(text)}
                selectText="Select Marital Status"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <Text style={styles.MainHeadingTextStyle}>Childhood illness:</Text>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientChildhood_illnessSelected: value})
                }
                selectedItems={this.state.patientChildhood_illnessSelected}
                items={this.state.patientChildhood_illness}
                uniqueKey="id"
                borderBottomWidth={0}
                searchInputPlaceholderText="Search illness..."
                onChangeInput={text => console.log(text)}
                selectText="Select illness"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <Text style={styles.MainHeadingTextStyle}>Diseases:</Text>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientDiseaseSelected: value})
                }
                selectedItems={this.state.patientDiseaseSelected}
                items={this.state.patientDisease}
                uniqueKey="id"
                borderBottomWidth={0}
                searchInputPlaceholderText="Search Diseases..."
                onChangeInput={text => console.log(text)}
                selectText="Select Diseases"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <Text style={styles.MainHeadingTextStyle}>Laboratory Tests</Text>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientLaboratory_testsSelected: value})
                }
                selectedItems={this.state.patientLaboratory_testsSelected}
                items={this.state.patientLaboratory_tests}
                uniqueKey="id"
                borderBottomWidth={0}
                searchInputPlaceholderText="Search Laboratory Tests..."
                onChangeInput={text => console.log(text)}
                selectText="Select Laboratory Tests"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
          <View style={{
              flexDirection:"row",
              alignItems:'center',
              justifyContent:'space-between',
              }}>
              <Text style={styles.MainHeadingTextStyle}>Common Issues:</Text>
              <TouchableOpacity onPress={()=> this.addCommonIssue(this.state.patientVital_signsSelected.toString())}>
                <Text style={{color:'#3fabf3', fontWeight:'700', paddingHorizontal:10, paddingTop:10}}>Add New</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientVital_signsSelected: value})
                }
                selectedItems={this.state.patientVital_signsSelected}
                items={this.state.patientVital_signs}
                uniqueKey="id"
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search vital sign..."
                onChangeInput={text => console.log(text)}
                selectText="Select vital sign"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder="Value"
              style={styles.TextInputLayoutStyle}
              onChangeText={value => this.setState({value})}>
            </TextInput>
          
          
<FlatList
            data={this.state.commonIssue.filter(x => x != null)}
            keyExtractor={(x, i) => i.toString()}
            extraData={this.state.Vitalrefresh}
            renderItem={({ item  , index}) => (
              <View  style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                <View style={{flexDirection:'row' ,borderColor: '#767676',
            borderRadius: 4,
            borderWidth: 0.6, padding:7 , marginHorizontal:10 , width:'95%'  , marginVertical:5 }}>
                <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.name}</Text>
                <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10, marginHorizontal:10}}>|</Text>
                <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.value}</Text>
                </View>
                {/* <TouchableOpacity
                  //onPress={() => this.HandleNumberDeleteForm(index)}
                  style={{marginHorizontal:15 , marginVertical:10}}>
                  <AntIcon
                    name="delete"
                    color={'#ff5851'}
                    size={20}
                  />
                </TouchableOpacity> */}
              </View>
             )}
          />
            
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <Text style={styles.MainHeadingTextStyle}>Medical History:</Text>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder="Your Patient Madical History"
              multiline={true}
              style={styles.TextInputLayoutStyleForDetail}
              onChangeText={history => this.setState({history})}>
            </TextInput>
          </View>
          <View style={{backgroundColor:'#f7f7f7', margin:10}}>
            <View style={{
              flexDirection:"row", 
              alignItems:'center', 
              justifyContent:'space-between',
              }}>
              <Text style={styles.MainHeadingTextStyle}>Medications:</Text>
              <TouchableOpacity  onPress={()=> this.addMedicationsList()}>
                <Text style={{color:'#3fabf3', fontWeight:'700', paddingHorizontal:10, paddingTop:10}}>Add New</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder="Name"
              style={styles.TextInputLayoutStyle}
              onChangeText={name => this.setState({name})}>
            </TextInput>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientMedicine_typesSelected: value})
                }
                selectedItems={this.state.patientMedicine_typesSelected}
                items={this.state.patientMedicine_types}
                uniqueKey="id"
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search type..."
                onChangeInput={text => console.log(text)}
                selectText="Select type"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientMedicine_durationSelected: value})
                }
                selectedItems={this.state.patientMedicine_durationSelected}
                items={this.state.patientMedicine_duration}
                uniqueKey="id"
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search medicine duration..."
                onChangeInput={text => console.log(text)}
                selectText="Select medicine duration"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState({patientMedicine_usageSelected: value})
                }
                selectedItems={this.state.patientMedicine_usageSelected}
                items={this.state.patientMedicine_usage}
                uniqueKey="id"
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText="Search medicine usage..."
                onChangeInput={text => console.log(text)}
                selectText="Select medicine usage"
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText="Submit"
                underlineColorAndroid="transparent"
              />
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              placeholderTextColor="#7F7F7F"
              placeholder="Add Comment"
              style={styles.TextInputLayoutStyle}
              onChangeText={comment => this.setState({comment})}>
            </TextInput>

            <FlatList
                data={this.state.medicationsList}
                keyExtractor={(x, i) => i.toString()}
                extraData={this.state.medicationsRefresh}
                renderItem={({ item  , index}) => (
                  <View  style={{flexDirection:'row' , justifyContent:'space-between' , alignItems:'center'}}>
                    <View style={{flexDirection:'row' ,borderColor: '#767676',
            borderRadius: 4,
            borderWidth: 0.6, padding:7 , marginHorizontal:10 , width:'95%'  , marginVertical:5 }}>
                    <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.name}</Text>
                    <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.medicine_types}</Text>
                    <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.medicine_duration}</Text>
                    <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.medicine_usage}</Text>

                    <Text style={{fontSize:15 , fontWeight:'700' , marginHorizontal:15 , marginVertical:10}}>{item.detail}</Text>
                    </View>
                    {/* <TouchableOpacity
                      //onPress={() => this.HandleNumberDeleteForm(index)}
                      style={{marginHorizontal:15 , marginVertical:10}}>
                      <AntIcon
                        name="delete"
                        color={'#ff5851'}
                        size={20}
                      />
                    </TouchableOpacity> */}
                  </View>
                 )}
              />
          </View>  
          <TouchableOpacity onPress={()=> this.CreatePrescription()} style={styles.CustomButtonRightArea}>
            <Text style={styles.MainButtonText}>Save & Update</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default Prescription;
