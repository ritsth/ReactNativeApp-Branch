import React from 'react';
import {
    StyleSheet, Picker,
    useEffect, Button,
    useState, KeyboardAvoidingView,
    Text, Keyboard, AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';

import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors';
import Posts from './posts';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathFontoptions=((screenWidth+screenHeight)/80);
export default function AddPostsPage({ route }) {
    const [image, setImage] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [selectedValue, setSelectedValue] = React.useState('1');

    const [status, onChangeStatus] = React.useState(null);
    const [password, onChangePassword] = React.useState(null);

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
        plantData.plant.filter(p => p.user == userId.id)!=null?
        (
            <View
            style={{
                justifyContent:"center",
                alignItems:"center"
            }}
        >
            <Text
                style={{
                    alignSelf:'center',
                    fontSize:mathFontoptions,
                }}
            
            >                
                <Button color="black" title="You haven't yet connected any of your plant"/>
                <Button title="add your plant first." 
                //onPress={handlePushLogin} 
                />  
            </Text>
        </View>
        )
        :(
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
                        <Picker
                            selectedValue={selectedValue}
                            style={{
                                borderWidth:1.5,
                                borderColor: "lightgrey",
                                borderRadius:90
                            }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                        {/* <Picker.Item 
                                enabled={false}
                                value='1'
                                label="Select the plants type"
                            />*/}
                            {plantData.plant.filter(p => p.user == userId.id).map((plant) =>
                                
                                <Picker.Item required key={plant.id}
                                    value={plant.id}
                                    label={plant.type_text}
                                />
                            )}
                            
                        </Picker>
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
                                <View style={{ width:300 }}>
                                    <TextInput 
                                    placeholder="Write a caption ..."
                                    style={styles.textInput}
                                    onChangeText={onChangeStatus}

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
                                //onPress={() => setModalViewComment(true)}
                                title='Post'
                            />
                        </View>
                    {/*
                    <ImageBackground
                        style={{
                            padding: 20,
                            margin: 10,
                        }}
                        borderRadius={10}
                        source={{
                            uri: 'https://i.pinimg.com/564x/8f/8f/52/8f8f528a8aa964eb01bb6c8f116699c3.jpg' }}>
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
                                Capture from
                            </Text>
                            <Text
                                style={{
                                    color: colors.black,
                                    fontWeight: 'bold',
                                    fontSize: 25,
                                    marginLeft: 15
                                }}
                            >
                                Camera
                            </Text>
                            {image &&
                                <Image source={{ uri: image }}
                                    style={{
                                        width: 200,
                                        height: 200
                                    }}
                                />}

                        </View>
                    </ImageBackground>
                    */}
                </View>
            </ScrollView>
        ))}
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
        marginLeft:15
    },
});