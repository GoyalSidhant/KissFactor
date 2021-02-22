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
  ActivityIndicator,
  PanResponder,
  Dimensions,
  AsyncStorage
} from "react-native";
// import { AsyncStorage } from '@react-native-community/async-storage';
import styles from '../styles/DoctreatAppStyles';
import { SwipeRow, List, Content } from "native-base";
import { Input, InputProps, Button } from "react-native-ui-kitten";
import AntIcon from "react-native-vector-icons/AntDesign";
import { withNavigation, DrawerActions } from "react-navigation";
import CustomHeader from "../Header/CustomHeader";
import MultiSelect from "react-native-multiple-select";
import HTML from "react-native-render-html";
import axios from "axios";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import Dash from "react-native-dash";
import * as CONSTANT from "../Constants/Constant";

class SpecialitiesAndServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectSpecialitiesKnown: "",
      projectServicesKnown: "",
      projectServices: [],
      projectAvailableServices: [],
      projectSelectedServiceKnown: [],
      price: "",
      desc: "",
      isLoading: true,
      specialityId:'',
    };
  }
  componentDidMount() {
    this.ProjectSpecialitiesSpinner();
    this.fetchAvailableServices();
  }

  fetchAvailableServices = async () => {
    this.setState({
      isLoading: true
    })
    const id = await AsyncStorage.getItem("projectProfileId");
    const response = await fetch(
      CONSTANT.BaseUrl + "taxonomies/get_list?list=services&profile_id=" + id
    );
    const json = await response.json();
    if (
      Array.isArray(json) &&
      json[0] &&
      json[0].type &&
      json[0].type === "error"
    ) {
      this.setState({ projectAvailableServices: [], isLoading: false }); // empty data set
    } else {
      this.setState({ projectAvailableServices: json, isLoading: false });
    }
  };
  ProjectSpecialitiesSpinner = async () => {
    this.setState({
      isLoading: true
    })
    return fetch(CONSTANT.BaseUrl + "taxonomies/get-specilities", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let ProjectSpecialities = responseJson;
        this.setState({
          ProjectSpecialities,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        })
        console.error(error);
      });
  };
  ProjectServicesSpinner = async () => {
    this.setState({
      isLoading: true
    })
    const {
      ProjectSpecialitiesKnown,
      projectServices,
      projectSpecialityServices
    } = this.state;
    if (ProjectSpecialitiesKnown != "") {
      const response = await fetch(
        CONSTANT.BaseUrl +
        "taxonomies/get_servicess?speciality=" +
        JSON.stringify(ProjectSpecialitiesKnown[0])
      );
      const json = await response.json();
      console.log(json);
      if (Array.isArray(json) && json && json.type && json.type === "error") {
        this.setState({ projectServices: [], isLoading: false }); // empty data set
      } else {
        this.setState({ projectServices: json, isLoading: false });
      }
    }
  };

  AddServicesData = async () => {
    this.setState({
      isLoading: true
    })
    const Uid = await AsyncStorage.getItem("projectProfileId");
    const {
      price,
      desc,
      projectServicesKnown,
      ProjectSpecialitiesKnown
    } = this.state;
    if (price == "" || desc == "") {
      Alert.alert("Oop's", "Please Add Complete Data");
    } else {
      axios
        .post(CONSTANT.BaseUrl + "profile/update_user_specialities", {
          profile_id: Uid,
          speciality: JSON.stringify(ProjectSpecialitiesKnown[0]),
          service: JSON.stringify(projectServicesKnown[0]),
          price: price,
          description: desc
        })
        .then(async response => {
          if (response.status === 200) {
            this.setState({
              isLoading: false
            })
            Alert.alert("Updated Successfully", JSON.stringify(response.data.message));
            this.fetchAvailableServices();
            console.log(response);
          } else if (response.status === 203) {
            this.setState({
              isLoading: false
            })
            Alert.alert("Error" , JSON.stringify(response.data.message));
          }
        })
        .catch(error => {
          this.setState({
            isLoading: false
          })
          Alert.alert(error);
          console.log(error);
        });
    }
  };
  DeleteCompleteSpecilaity = async(id) =>{
    this.setState({
      isLoading: true
    })
    const Uid = await AsyncStorage.getItem("projectUid");
      axios
        .post(CONSTANT.BaseUrl + "profile/delete_user_specialities_services", {
            speciality_id: id,
            user_id: Uid,
            type:'speciality',
        })
        .then(async response => {
          if (response.status === 200) {
            Alert.alert("Success" , JSON.stringify(response.data.message))
            this.setState({isLoading: false})
            this.fetchAvailableServices();
          } else if (response.status === 203) {
            Alert.alert("Oops" , JSON.stringify(response.data.message))
            this.setState({isLoading: false})
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
  }
  DeleteSelectedService = async(servie_id )=> {

    this.setState({
      isLoading: true
    })
    const Uid = await AsyncStorage.getItem("projectUid");
      axios
        .post(CONSTANT.BaseUrl + "profile/delete_user_specialities_services", {
            speciality_id: this.state.specialityId,
            user_id: Uid,
            service_id: servie_id, 
            type:'service',
        })
        .then(async response => {
          if (response.status === 200) {
            Alert.alert("Success" , JSON.stringify(response.data.message))
            this.setState({isLoading: false})
            this.fetchAvailableServices();
          } else if (response.status === 203) {
            Alert.alert("Oops" , JSON.stringify(response.data.message))
            this.setState({isLoading: false})
          }
        })
        .catch(error => {
          Alert.alert(error);
          console.log(error);
        });
  }


  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
        <CustomHeader headerText={CONSTANT.SpecialitiesAndServicesManageServices} />
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
            style={styles.SpecialitiesAndServicesMain}
          >
            <Text
              style={styles.MainHeadingTextStyle}
            >
              {CONSTANT.SpecialitiesAndServicesAddNewService}
            </Text>
            <View style={styles.MultiSelectArea}>
              <MultiSelect
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={value =>
                  this.setState(
                    { projectServices: [], ProjectSpecialitiesKnown: value },
                    this.ProjectServicesSpinner
                  )
                }
                uniqueKey="id"
                items={this.state.ProjectSpecialities}
                selectedItems={this.state.ProjectSpecialitiesKnown}
                borderBottomWidth={0}
                single={true}
                searchInputPlaceholderText={CONSTANT.SpecialitiesAndServicesPickSpeciality}
                onChangeInput={text => console.log(text)}
                selectText={CONSTANT.SpecialitiesAndServicesPickSpeciality}
                styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                displayKey="name"
                submitButtonText={CONSTANT.Submit}
              />
            </View>

            {this.state.projectServices.length >= 1 ? (
              <View>
                <View
                  style={styles.MultiSelectArea}
                >
                  <MultiSelect
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={value =>
                      this.setState({ projectServicesKnown: value })
                    }
                    uniqueKey="id"
                    items={this.state.projectServices}
                    selectedItems={this.state.projectServicesKnown}
                    borderBottomWidth={0}
                    single={true}
                    searchInputPlaceholderText={CONSTANT.SpecialitiesAndServicesPickServices}
                    onChangeInput={text => console.log(text)}
                    selectText={CONSTANT.SpecialitiesAndServicesPickServices}
                    styleMainWrapper={styles.MultiSelectstyleMainWrapper}
                    styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
                    displayKey="name"
                    submitButtonText={CONSTANT.Submit}
                  />
                </View>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder={CONSTANT.SpecialitiesAndServicesPrice}
                  onChangeText={price => this.setState({ price })}
                  style={styles.TextInputLayoutStyle}
                />
                <TextInput
                  multiline={true}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#7F7F7F"
                  placeholder={CONSTANT.Description}
                  onChangeText={desc => this.setState({ desc })}
                  style={styles.TextInputLayoutStyleForDetail}
                />
                <TouchableOpacity
                  onPress={this.AddServicesData}
                  style={styles.MainButtonArea}
                >
                  <Text
                    style={styles.MainButtonText}
                  >
                    {CONSTANT.SpecialitiesAndServicesAddNow}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {this.state.projectAvailableServices && (
            <View>
              <FlatList
                style={styles.SpecialitiesAndServicesFlatlistArea}
                data={this.state.projectAvailableServices}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <Collapse onToggle={()=>this.setState({specialityId:item.id})}
                   style={styles.SpecialitiesAndServicesMain}>
                    <CollapseHeader 
                      style={{flexDirection:"row", alignItems:"center", activeOpacity:0.7}}
                    >
                      <View style={[styles.CollapseHeaderStyle,{width:"78%"}]}>
                        <View>
                          <View style={styles.SpecialitiesAndServicesmainLayoutServices}>
                            <Image
                              resizeMode="cover"
                              style={styles.SpecialitiesAndServicesImageStyle}
                              source={{ uri: item.logo }}
                            />
                            <View
                              style={styles.SpecialitiesAndServicesBorder}
                            />
                            <HTML
                            numberOfLines={1}
                            html={item.title}
                            containerStyle={styles.SpecialitiesAndServicesmainServiceName}
                            imagesMaxWidth={Dimensions.get("window").width}
                          />
                          </View>
                        </View>

                        <AntIcon
                          name="down"
                          color={"#484848"}
                          size={17}
                          style={styles.SpecialitiesAndServicesIconStyle}
                        />
                      </View>
                      <TouchableOpacity onPress={()=> this.DeleteCompleteSpecilaity(item.id)} style={{backgroundColor:'#ff5851' , borderRadius:4, height:70 , width:'15%' ,justifyContent:'center' , alignItems:'center'}}>
                        <AntIcon
                          name="delete"
                          color={"#fff"}
                          size={20}
                        />
                      </TouchableOpacity>
                    </CollapseHeader>
                    <CollapseBody>
                      <View>
                        <FlatList
                          data={
                            this.state.projectAvailableServices[index].services
                          }
                          extraData={this.state}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              //style={styles.SpecialitiesAndServicesCollapseBodyTouchable}
                            >
                              {/* <View style={{ flexDirection: "column" }}>
                                <Text
                                  style={styles.SpecialitiesAndServicesCollapseBodyText}
                                >
                                  {item.title}
                                </Text>
                                <Text
                                  style={styles.SpecialitiesAndServicesCollapseBodyText}
                                >
                                  Price: {item.price}
                                </Text>
                              </View> */}
                              <View style={{flexDirection:'row' , marginLeft:10 , marginRight:10 ,marginBottom:10, backgroundColor:"#f7f7f7" , borderRadius:4}}>
                                {/* <Text style={{paddingLeft:10, borderRadius:2  , height:50 , borderWidth:0.6 , borderColor:'#dddddd'  , marginBottom:10 , paddingTop:15 , width:'70%'}}>Add Experience</Text> */}
                                <TouchableOpacity activeOpacity={0.9} style={{ flexDirection: "column", width:"85%", paddingVertical:5, paddingHorizontal:10 }}>
                                  <Text
                                    style={styles.SpecialitiesAndServicesCollapseBodyText}
                                  >
                                    {item.title}
                                  </Text>
                                  <Text
                                    style={styles.SpecialitiesAndServicesCollapseBodyText}
                                  >
                                    Price: {item.price}$
                                  </Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{backgroundColor:'#3d4461'  , height:50 , width:'15%' ,justifyContent:'center' , flexDirection:'row'}}>
                                  <AntIcon
                                    name="edit"
                                    color={"#fff"}
                                    size={20}
                                    style={{top:15}}
                                  />
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={()=> this.DeleteSelectedService(item.service_id)} style={{backgroundColor:'#ff5851' , borderTopRightRadius:2 ,borderBottomRightRadius:2  , height:50 , width:'15%' ,justifyContent:'center' , flexDirection:'row'}}>
                                  <AntIcon
                                    name="delete"
                                    color={"#fff"}
                                    size={20}
                                    style={{top:15}}
                                  />
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </CollapseBody>
                  </Collapse>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(SpecialitiesAndServices);

// import React, { Component } from "react";
// import {
//   View,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
//   ImageBackground,
//   Text,
//   Alert,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   PanResponder,
//   Dimensions,
//   AsyncStorage
// } from "react-native";
// // import { AsyncStorage } from '@react-native-community/async-storage';
// import styles from "../styles/DoctreatAppStyles";
// import { SwipeRow, List, Content } from "native-base";
// import { Input, InputProps, Button } from "react-native-ui-kitten";
// import AntIcon from "react-native-vector-icons/AntDesign";
// import { withNavigation, DrawerActions } from "react-navigation";
// import CustomHeader from "../Header/CustomHeader";
// import MultiSelect from "react-native-multiple-select";
// import HTML from "react-native-render-html";
// import axios from "axios";
// import {
//   Collapse,
//   CollapseHeader,
//   CollapseBody
// } from "accordion-collapse-react-native";
// import Dash from "react-native-dash";
// import * as CONSTANT from "../Constants/Constant";

// class SpecialitiesAndServices extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ProjectSpecialitiesKnown: [],
//       projectServicesKnown: "",
//       projectServices: [],
//       projectAvailableServices: [],
//       projectSelectedServiceKnown: [],
//       price: "",
//       desc: "",
//       isLoading: false,
//       SpecialitiesArray: [],
//       SpecilaityRefresh: false,
//       ServiceRefresh: false,
//       selectedItems: [],
//     };
//   }
//   componentDidMount() {
//     this.ProjectSpecialitiesSpinner();
//     this.fetchAvailableServices();
//   }
//   fetchAvailableServices = async () => {
//     this.setState({
//       isLoading: true
//     });
//     const id = await AsyncStorage.getItem("projectUid");
//     const response = await fetch(
//       CONSTANT.BaseUrl + "profile/get_user_services_specialities?user_id=" + id
//     );
//     const json = await response.json();
    
//     if (
//       Array.isArray(json) &&
//       json[0] &&
//       json[0].type &&
//       json[0].type === "error"
//     ) {
//       this.setState({ SpecialitiesArray: [], isLoading: false }); // empty data set
//     } else {
//       this.setState({ SpecialitiesArray: json.specialities_services, isLoading: false});
//     }

    

    
//   };

//   ProjectSpecialitiesSpinner = async () => {
//     this.setState({
//       isLoading: true
//     });
//     return fetch(CONSTANT.BaseUrl + "taxonomies/get-specilities", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json"
//       }
//     })
//       .then(response => response.json())
//       .then(responseJson => {
//         let ProjectSpecialities = responseJson;
       
//         this.setState({
//           ProjectSpecialities,
//           isLoading: false
//         });
//         // this.ProjectServicesSpinner();
//       })
//       .catch(error => {
//         this.setState({
//           isLoading: false
//         });
//         console.error(error);
//       });
//   };
//   ProjectServicesSpinner = async () => {
//     this.setState({
//       isLoading: true
//     });
//     const {
//       ProjectSpecialitiesKnown,
//       projectServices,
//       projectSpecialityServices
//     } = this.state;
//     if (ProjectSpecialitiesKnown != "") {
//       const response = await fetch(
//         CONSTANT.BaseUrl +
//           "taxonomies/get_servicess?speciality=" +
//           JSON.stringify(ProjectSpecialitiesKnown[0])
//       );
//       const json = await response.json();
//       if (Array.isArray(json) && json && json.type && json.type === "error") {
//         this.setState({ projectServices: [], isLoading: false }); // empty data set
//       } else {
//         this.setState({ projectServices: json, isLoading: false });
//       }
//     } else {
//       //Alert.alert("Please add data")
//     }
//   };
//   fetchServices = () => {
//     if (this.state.ProjectSpecialitiesKnown != "") {
//       this.ProjectServicesSpinner();
//     } else {
//       Alert.alert("Oops", "Please select a speciality.");
//     }
//   };
//   AddSpeciality = () => {
//       const {
//         ProjectSpecialitiesKnown,
//       } = this.state;

//       this.state.SpecialitiesArray.push({
//        id: this.state.ProjectSpecialitiesKnown.toString(),
//        title: "",
//       //  services: this.state.projectServices
//       });
//       //Alert.alert("Alert" , JSON.stringify(this.state.ProjectSpecialitiesKnown))
//       this.setState({
//         SpecilaityRefresh: true,
//       });
//       // Alert.alert("Data" , JSON.stringify(this.state.ProjectSpecialitiesKnown))
//        console.log("This is main speciality array" , this.state.SpecialitiesArray)
//   };
//   HandleSpecialityDeleteForm = (index)=> {
//     this.state.SpecialitiesArray.splice(index , 1)
//     this.setState({
//       SpecilaityRefresh: true,
//     });
//   }
//   HandleServicesDeleteForm = (item , index) => {
//     this.state.SpecialitiesArray[index].services.splice(index , 1)
//     this.setState({
//       ServiceRefresh: true,
//     });
//   }
//   selectedItems = selectedItems => {
//     if(this.state.SpecialitiesArray.length > 0) {
//       // this.state.CustomSelectValue = this.state.SpecialitiesArray[0].id
//       this.setState({
//         CustomSelectValue: this.state.SpecialitiesArray[0].id
//       });
//       alert('IF', JSON.stringify(this.state.CustomSelectValue))
//     } else {
//       // this.state.CustomSelectValue = this.state.ProjectSpecialitiesKnown
//       this.setState({
//         CustomSelectValue: this.state.selectedItems
//       });
//       alert('ELSE', selectedItems)
//     }
//   }

//   render() {
//     const { isLoading } = this.state;
//     const { selectedItems } = this.state;
//     return (
//       <View style={styles.container}>
//         <StatusBar backgroundColor="#f7f7f7" barStyle="dark-content" />
//         <CustomHeader
//           headerText={CONSTANT.SpecialitiesAndServicesManageServices}
//         />
//         {isLoading ? (
//           <View style={styles.ActivityIndicatorAreaStyle}>
//             <ActivityIndicator
//               size="small"
//               color={CONSTANT.primaryColor}
//               style={styles.ActivityIndicatorStyle}
//             />
//           </View>
//         ) : null}
//         <ScrollView>
//           <View
//             style={{
//               backgroundColor: "#fff",
//               borderColor: "#fff",
//               borderRadius: 4,
//               borderWidth: 0.6,
//               marginHorizontal: 10,
//               marginVertical: 15,
//               elevation: 3,
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.2,
//               shadowColor: "#000"
//             }}
//           >
//             <Text style={{ fontWeight: "700", fontSize: 18, padding: 10 }}>
//               Manage Services:
//             </Text>
//             <View
//               style={{
//                 borderBottomColor: "#767676",
//                 borderBottomWidth: 0.5
//               }}
//             />
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 margin: 10
//               }}
//             >
//               <Text style={{ fontWeight: "700", fontSize: 15 }}>
//                 Offered Services:
//               </Text>
//               <TouchableOpacity
//                 onPress={() => this.AddSpeciality()}
//               >
//               <Text
//                 style={{ fontWeight: "700", fontSize: 15, color: "skyblue" }}
//               >
//                 Add New
//               </Text>
//               </TouchableOpacity>
             
//             </View>

//             {/* <View
//               style={{
//                 borderColor: "#767676",
//                 borderRadius: 4,
//                 borderWidth: 0.4,
//                 margin: 10,
//                 padding: 10
//               }}
//             > */}

//             <FlatList
//               legacyImplementation={true}
//               data={this.state.SpecialitiesArray}
//               extraData={this.state.SpecilaityRefresh}
//               renderItem={({ item, index }) => (
                
//                 <View
//                   style={{
//                     borderColor: "#767676",
//                     borderRadius: 4,
//                     borderWidth: 0.4,
//                     margin: 10,
//                     padding: 10
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContet: "space-between"
//                     }}
//                   >
//                     <View style={{ width: "85%" }}>
//                       <MultiSelect
//                         ref={component => {
//                           this.multiSelect = component;
//                         }}
                        
//                         uniqueKey="id"
//                         items={this.state.ProjectSpecialities}
//                         selectedItems={selectedItems}
//                         borderBottomWidth={0}
//                         onSelectedItemsChange={value =>
//                           this.setState({
//                             projectServices: [],
//                             ProjectSpecialitiesKnown: value
//                           } , console.log("Hello" , this.state.ProjectSpecialitiesKnown))
//                         }
//                         single={true}
//                         searchInputPlaceholderText={CONSTANT.SpecialitiesAndServicesPickSpeciality}
//                         onChangeInput={text => console.log(text)}
//                         selectText={CONSTANT.SpecialitiesAndServicesPickSpeciality}
//                         styleMainWrapper={styles.MultiSelectstyleMainWrapper}
//                         styleDropdownMenuSubsection={
//                           styles.MultiSelectstyleDropdownMenuSubsection
//                         }
//                         displayKey="name"
//                         submitButtonText={CONSTANT.Submit}
//                       />
//                     </View>
//                     <TouchableOpacity
//                       onPress={()=> this.HandleSpecialityDeleteForm(index)}
//                         style={{
//                           backgroundColor: "#ff5851",
//                           width: "15%",
//                           height: 60,
//                           justifyContent: "center",
//                           alignItems: "center",
//                           borderRadius: 4
//                         }}
//                       >
//                       <AntIcon name="delete" color={"#fff"} size={20} />
//                     </TouchableOpacity>
//                   </View>
//                   <TouchableOpacity
//                     onPress={() => this.fetchServices()}
//                     style={styles.CustomButtonRightArea}
//                   >
//                     <Text style={styles.MainButtonText}>Add Services</Text>
//                   </TouchableOpacity>
                  
//                     <FlatList
//                       data={this.state.SpecialitiesArray[index].services}
//                       extraData={this.state.ServiceRefresh}
//                       renderItem={({ item, index }) => (
//                         <View
//                           style={{
//                             backgroundColor:'#eee',
//                             borderColor: "#767676",
//                             borderRadius: 4,
//                             borderWidth: 0.4,
//                             margin: 10,
//                             padding: 10
//                           }}
//                         >
//                           <View
//                             style={{
//                               flexDirection: "row",
//                               justifyContent: "space-between",
//                               alignItems: "center"
//                             }}
//                           >
//                             <View>
//                               <Text style={{ fontSize: 16 }}>
//                                 {item.title}{" "}
//                               </Text>
//                             </View>

//                             <View
//                               style={{
//                                 flexDirection: "row",
//                                 justifyContent: "space-between",
//                                 alignItems: "center"
//                               }}
//                             >
//                               <Text style={{ fontSize: 16, marginRight: 10 }}>
//                                 {item.price_fromated}
//                               </Text>
//                               <View
//                                 // onPress={() => this.HandleEditForm()}
//                                 style={{
//                                   backgroundColor: "#3d4461",
//                                   padding: 10,
//                                   justifyContent: "center",
//                                   alignItems: "center"
//                                 }}
//                               >
//                                 <AntIcon name="edit" color={"#fff"} size={20} />
//                               </View>
//                               <TouchableOpacity
//                                 onPress={() => this.HandleServicesDeleteForm(   item, index)}
//                                 style={{
//                                   backgroundColor: "#ff5851",
//                                   padding: 10,
//                                   justifyContent: "center",
//                                   alignItems: "center"
//                                 }}
//                               >
//                                 <AntIcon
//                                   name="delete"
//                                   color={"#fff"}
//                                   size={20}
//                                 />
//                               </TouchableOpacity>
//                             </View>
//                           </View>
//                           <View
//                             style={{
//                               borderBottomColor: "#767676",
//                               borderBottomWidth: 0.5,
//                               marginVertical: 10
//                             }}
//                           />
//                           <View>
//                             <View
//                               style={{
//                                 marginLeft: 5,
//                                 marginBottom: 10,
//                                 width: "98%"
//                               }}
//                             >
//                               <MultiSelect
//                                 ref={component => {
//                                   this.multiSelect = component;
//                                 }}
//                                 onSelectedItemsChange={value =>
//                                   this.setState({ projectServicesKnown: value })
//                                 }
//                                 uniqueKey="id"
//                                 items={this.state.projectServices}
//                                 selectedItems={this.state.projectServicesKnown = [item.id]}
//                                 borderBottomWidth={0}
//                                 single={true}
//                                 searchInputPlaceholderText={
//                                   CONSTANT.SpecialitiesAndServicesPickServices
//                                 }
//                                 onChangeInput={text => console.log(text)}
//                                 selectText={
//                                   CONSTANT.SpecialitiesAndServicesPickServices
//                                 }
//                                 styleMainWrapper={
//                                   styles.MultiSelectstyleMainWrapper
//                                 }
//                                 styleDropdownMenuSubsection={
//                                   styles.MultiSelectstyleDropdownMenuSubsection
//                                 }
//                                 displayKey="name"
//                                 submitButtonText={CONSTANT.Submit}
//                               />
//                             </View>
//                             <TextInput
//                               underlineColorAndroid="transparent"
//                               placeholderTextColor="#7F7F7F"
//                               placeholder={
//                                 CONSTANT.SpecialitiesAndServicesPrice
//                               }
//                               onChangeText={price => this.setState({ price })}
//                               defaultValue={item.price_fromated}
//                               style={{
//                                 height: 50,
//                                 width: "98%",
//                                 backgroundColor: "#ffffff",
//                                 paddingRight: 10,
//                                 paddingLeft: 10,
//                                 borderRadius: 2,
//                                 borderWidth: 0.6,
//                                 borderColor: "#dddddd",
//                                 color: "#323232",
//                                 marginLeft: 5,
//                                 marginBottom: 10,
//                                 fontFamily: CONSTANT.PoppinsMedium
//                               }}
//                             />
//                             <TextInput
//                               multiline={true}
//                               underlineColorAndroid="transparent"
//                               placeholderTextColor="#7F7F7F"
//                               placeholder={CONSTANT.Description}
//                               onChangeText={desc => this.setState({ desc })}
//                               defaultValue={item.description}
//                               style={{
//                                 height: 150,
//                                 width: "98%",
//                                 backgroundColor: "#ffffff",
//                                 paddingRight: 10,
//                                 paddingLeft: 10,
//                                 borderRadius: 2,
//                                 borderWidth: 0.6,
//                                 borderColor: "#dddddd",
//                                 color: "#323232",
//                                 marginLeft: 5,
//                                 marginBottom: 10,
//                                 fontFamily: CONSTANT.PoppinsMedium
//                               }}
//                             />
//                           </View>
//                         </View>
//                       )}
//                     />
//                   {/* ) : null} */}
//                 </View>
//               )}
//             />

//             {/* <View
//                 style={{ flexDirection: "row", justifyContet: "space-between" }}
//               >
//                 <View style={{ width: "85%" }}>
//                   <MultiSelect
//                     ref={component => {
//                       this.multiSelect = component;
//                     }}
//                     onSelectedItemsChange={value =>
//                       this.setState(
//                         {
//                           projectServices: [],
//                           ProjectSpecialitiesKnown: value
//                         },
                        
//                       )
//                     }
//                     uniqueKey="id"
//                     items={this.state.ProjectSpecialities}
//                     selectedItems={this.state.ProjectSpecialitiesKnown}
//                     borderBottomWidth={0}
//                     single={true}
//                     searchInputPlaceholderText={
//                       CONSTANT.SpecialitiesAndServicesPickSpeciality
//                     }
//                     onChangeInput={text => console.log(text)}
//                     selectText={CONSTANT.SpecialitiesAndServicesPickSpeciality}
//                     styleMainWrapper={styles.MultiSelectstyleMainWrapper}
//                     styleDropdownMenuSubsection={
//                       styles.MultiSelectstyleDropdownMenuSubsection
//                     }
//                     displayKey="name"
//                     submitButtonText={CONSTANT.Submit}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     backgroundColor: "#ff5851",
//                     width: "15%",
//                     height: 60,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: 4
//                   }}
//                 >
//                   <AntIcon name="delete" color={"#fff"} size={20} />
//                 </View>
//               </View>
//               <TouchableOpacity
//                 onPress={() => this.fetchServices()}
//                 style={styles.CustomButtonRightArea}
//               >
//                 <Text style={styles.MainButtonText}>Add Services</Text>
//               </TouchableOpacity>
//               {this.state.projectServices.length >= 1 ? (
//               <View
//                 style={{
//                   borderColor: "#767676",
//                   borderRadius: 4,
//                   borderWidth: 0.4,
//                   margin: 10,
//                   padding: 10,
//                 }}
//               >
//                 <View style={{ flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems:'center'}}>
//                 <View>
//                   <Text style={{fontSize:16}}>Service title </Text>
//                 </View>

//                 <View style={{ flexDirection: "row" , justifyContent:'space-between' , alignItems:'center' }}>
//                   <Text style={{fontSize:16 , marginRight:10}}>Price</Text>
//                   <View
//                     // onPress={() => this.HandleEditForm()}
//                     style={{
//                       backgroundColor: '#3d4461',
//                       padding:10,
//                       justifyContent: 'center',
//                       alignItems:'center',
//                     }}
//                   >
//                     <AntIcon name="edit" color={"#fff"} size={20} />
//                   </View>
//                   <TouchableOpacity
//                     onPress={() => this.HandleExpDeleteForm(index)}
//                     style={{
//                       backgroundColor: '#ff5851',
//                       padding:10,
//                       justifyContent: 'center',
//                       alignItems:'center',
//                     }}
//                   >
//                     <AntIcon name="delete" color={"#fff"} size={20} />
//                   </TouchableOpacity>
//                 </View>
              
//               </View>
//               <View
//               style={{
//                 borderBottomColor: "#767676",
//                 borderBottomWidth: 0.5,
//                 marginVertical:10
//               }}
//               />
//               <View>
//                 <View
//                   style={{
//                     marginLeft: 5, 
//                     marginBottom: 10,
//                     width:'98%'
//                   }}
//                 >
//                   <MultiSelect
//                     ref={component => {
//                       this.multiSelect = component;
//                     }}
//                     onSelectedItemsChange={value =>
//                       this.setState({ projectServicesKnown: value })
//                     }
//                     uniqueKey="id"
//                     items={this.state.projectServices}
//                     selectedItems={this.state.projectServicesKnown}
//                     borderBottomWidth={0}
//                     single={true}
//                     searchInputPlaceholderText={CONSTANT.SpecialitiesAndServicesPickServices}
//                     onChangeInput={text => console.log(text)}
//                     selectText={CONSTANT.SpecialitiesAndServicesPickServices}
//                     styleMainWrapper={styles.MultiSelectstyleMainWrapper}
//                     styleDropdownMenuSubsection={styles.MultiSelectstyleDropdownMenuSubsection}
//                     displayKey="name"
//                     submitButtonText={CONSTANT.Submit}
//                   />
//                 </View>
//                 <TextInput
//                   underlineColorAndroid="transparent"
//                   placeholderTextColor="#7F7F7F"
//                   placeholder={CONSTANT.SpecialitiesAndServicesPrice}
//                   onChangeText={price => this.setState({ price })}
//                   style={{
//                     height: 50,
//                     width:'98%',
//                     backgroundColor:"#ffffff",
//                     paddingRight:10,
//                     paddingLeft: 10,
//                     borderRadius: 2,
//                     borderWidth: 0.6,
//                     borderColor: "#dddddd",
//                     color: "#323232",
//                     marginLeft: 5,
//                     marginBottom: 10,
//                     fontFamily:CONSTANT.PoppinsMedium,
//                   }}
//                 />
//                 <TextInput
//                   multiline={true}
//                   underlineColorAndroid="transparent"
//                   placeholderTextColor="#7F7F7F"
//                   placeholder={CONSTANT.Description}
//                   onChangeText={desc => this.setState({ desc })}
//                   style={{
//                     height: 50,
//                     width:'98%',
//                     backgroundColor:"#ffffff",
//                     paddingRight:10,
//                     paddingLeft: 10,
//                     borderRadius: 2,
//                     borderWidth: 0.6,
//                     borderColor: "#dddddd",
//                     color: "#323232",
//                     marginLeft: 5,
//                     marginBottom: 10,
//                     fontFamily:CONSTANT.PoppinsMedium,
//                   }}
//                 />

//               </View>
       
//               </View>
//                ) : null}
//             </View> */}
//           </View>

//           <TouchableOpacity style={styles.CustomButtonRightArea}>
//             <Text style={styles.MainButtonText}>Update Services</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>
//     );
//   }
// }
// export default withNavigation(SpecialitiesAndServices);
