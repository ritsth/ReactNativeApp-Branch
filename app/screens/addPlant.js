import React from 'react';
import {
    StyleSheet, Modal,useReducer,
    useEffect, Button, RefreshControl,
    useState, KeyboardAvoidingView,
    Text, Keyboard,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link, useHistory } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation, useRoute, } from '@react-navigation/native';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import jwt_decode from 'jwt-decode';
import Gradient from "javascript-color-gradient";
import * as ImagePicker from 'expo-image-picker';

import colors from '../config/colors';



const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathFontoptions=((screenWidth+screenHeight)/80);

export default function AddPlant(){
    /*const reducer = (
        state: Device[],
        action: { type: 'ADD_DEVICE'; payload: Device } | { type: 'CLEAR' },
      ): Device[] => {
        switch (action.type) {
          case 'ADD_DEVICE':
            const { payload: device } = action;
      
            // check if the detected device is not already added to the list
            if (device && !state.find((dev) => dev.id === device.id)) {
              return [...state, device];
            }
            return state;
          case 'CLEAR':
            return [];
          default:
            return state;
        }
    };*/
    const manager = new BleManager();
  //const [scannedDevices, dispatch] = React.useReducer(reducer, []);
  const [isLoading, setIsLoading] = React.useState(false);

  const scanDevices = () => {
    // display the Activityindicator
    setIsLoading(true);

    // scan devices
    manager.startDeviceScan(null, null, (error, device) => {
     if (error) {
       return alert(error);
      }
      // if a device is detected add the device to the list by dispatching the action into the reducer
      //if (scannedDevice) {
        //dispatch({ type: 'ADD_DEVICE', payload: scannedDevice });
      //}
    }); 

    // stop scanning devices after 5 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsLoading(false);
    }, 7000);
  };
    
    const [image, setImage] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    //const [selectedValue, setSelectedValue] = React.useState('1');
    const [plantName, onChangePlantName] = React.useState(null);
    const [plantType, onChangePlantType] = React.useState(null);

    const [profilePhoto, setProfilePhoto] = React.useState({
        profile: [{
            id: '',
            user: '',
            Profile_photo: ''
        }],
    });
    const [userData, setUserData] = React.useState({
        user: [{
            id: '',
            username: '',
            first_name: '',
            last_name: '',
            date_joined: '',
            email: '',
        }],
    });
    const [plantData, setPlantData] = React.useState({
        plant: [{
            id: '',
            user: '',
            user_name2: '',
            name_text: '',
            type_text: '',
            pub_date: '',
            plant_img: ''
        }]
    });

    const [user, setUser] = React.useState({
        username: '',
    })
    const [userId, setUserId] = React.useState({
        id: ''
    })
    const [token, setToken] = React.useState({
        access_token: ''
    })
    const readData = async () => {
        try {
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            var decode = jwt_decode(refresh_token);
            const Id = parseInt(decode.user_id);
            setUserId({ id: Id });
            setToken({ access_token });
        } catch (e) {
            alert(e+'  '+'Failed to fetch the data from storage');
            setToken({access_token :null});
        }
    };
    const baseURL = 'https://branchappxzy.herokuapp.com/';
    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        headers: {
            Authorization: token.access_token
                ? 'JWT ' + token.access_token
                : null,
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
    });

    React.useEffect(() => {
        /*const subscription = manager.onStateChange((state) => {
            //alert(state)
            if (state === 'PoweredOn') {
                alert(state)
                //scanDevices();
                subscription.remove();
            }
        }, true);*/
        //scanDevices();
        //alert(JSON.stringify(manager.state()));
        readData();
        /*
        axios.get('https://branchappxzy.herokuapp.com/users/').then((res) => {
            const Data = res.data;
            setUserData({ user: Data });
            setLoading(false);
        });

        axios.get('https://branchappxzy.herokuapp.com/profile_photo/').then((res) => {
            const Data = res.data;
            setProfilePhoto({ profile: Data });
            setLoading(false);
        });*/
        axiosInstance.get('plants/').then((res) => {
            const data = res.data;
            setPlantData({ plant: data });
            setLoading(false);
        });

    }, [setProfilePhoto, setUserData,
        setLoading,setPlantData
    ]);


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (<>
        {token.access_token == null?(
            <View>
                <Text>
                    Login First or make an acc to post
                </Text>
            </View>
        ):(
        
            <ScrollView keyboardShouldPersistTaps={'handled'} scrollEnabled={true}>
                <View onPress={Keyboard.dismiss} >
                    <Text
                        style={{
                            color: colors.secondary,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginTop:30,
                            marginLeft:10
                        }}
                    >
                        Select your plant: 
                    </Text>  
                    <View style={styles.inner} >
                        {/*
                        <Text 
                            style={{
                                fontSize:30
                            }}>
                            Login
                        </Text>
                        */} 
                        {/*<Picker
                            selectedValue={selectedValue}
                            style={{
                                borderWidth:1.5,
                                borderColor: "lightgrey",
                                borderRadius:90
                            }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                        
                            {plantData.plant.filter(p => p.user == userId.id).map((plant) =>
                                
                                <Picker.Item required key={plant.id}
                                    value={plant.id}
                                    label={plant.type_text}
                                />
                            )}
                            
                        </Picker>*/}

                        <View style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop:30
                        }}>
                        {image &&<>
                            <Image source={{ uri: image }}
                                style={{
                                    width: 70,
                                    height: 70,
                                }}
                            />
                                <View 
                                    style={{ 
                                        width:"80%" ,

                                    }}
                                >
                                    <TextInput 
                                        placeholder="Name of your plant"
                                        style={styles.textInput}
                                        onChangeText={onChangePlantName}

                                    />
                                    <TextInput 
                                        placeholder="Plant's type"
                                        style={styles.textInput}
                                        onChangeText={onChangePlantType}

                                    />
                                </View>
                            </>}
                            
                        </View>
                    </View>
                    <Text
                        style={{
                            color: colors.secondary,
                            fontSize: 20,
                            padding: 10,
                            fontWeight: "bold"
                        }}
                    >
                        Select your plants photo: 
                    </Text>  
                    <TouchableOpacity onPress={pickImage}>
                        <ImageBackground 
                            style={{
                                padding: 20,
                                margin: 15,
                            }}
                            borderRadius={10}
                            source={{ uri: 'https://i.pinimg.com/564x/c6/d0/93/c6d0938708ca400c8fbec7ce2add9d3c.jpg' }}>
                            <View
                                style={{
                                    //flex: 1,
                                    //alignItems: 'center',
                                    justifyContent: 'center',
                                

                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.black,
                                        fontSize: 15,
                                    }}
                                >
                                    Upload from
                                </Text>  
                                <Text
                                    style={{
                                        color: colors.black,
                                        fontWeight: 'bold',
                                        fontSize: 25,
                                        marginLeft:15
                                    }}
                                >
                                    Gallery
                                </Text>  
                                

                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    
                        <View style={{
                            backgroundColor:colors.secondary,
                            borderRadius: 30,
                            width:"80%",
                            alignSelf: "center",
                            marginTop:20
                        }}>
                            <Button
                                color={colors.white}
                                onPress={scanDevices}
                                title='Add Plant'
                            />
                        </View>

                </View>
            </ScrollView>
        )}
    </>);
}

const styles = StyleSheet.create({

    inner: {
        padding:10,
    },

    textInput: {
        fontSize: 18,
        height: 35,
        borderColor: colors.black,
        borderBottomWidth:1,
        marginTop: 10,
        marginBottom:15,
        marginLeft:15,
    },
});
