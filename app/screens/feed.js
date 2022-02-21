import React from 'react';
import {
    StyleSheet, Modal, Pressable,
    useEffect, Button, Divider,
    useState, KeyboardAvoidingView,
    Text, Keyboard, AsyncStorage,
    View, Alert, Image, SafeAreaView, 
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';

import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link, useHistory } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { NavigationContainer,useNavigation,} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { parse } from 'react-native-svg';
import { color } from 'react-native-elements/dist/helpers';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors';
import HomePage from './home';
import ProfilePage from './profile';
import AddPostsPage from './addPosts';
import NotificationPage from './notification';
import SearchPage from './search';
import Welcome from './WelcomeScreen';
import AddPlant from './addPlant';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathBox=((screenWidth+screenHeight)/20);
const mathFontInputs=((screenWidth+screenHeight)/70);
const mathIconSize=((screenWidth+screenHeight)/47);
const mathBellSize=((screenWidth+screenHeight)/50);
const mathFontHeader=((screenWidth+screenHeight)/45);


function MyHome() {
    const navigation=useNavigation();
    const Tab = createBottomTabNavigator();
    const [loading, setLoading] = React.useState(true);

    const [user, setUser] = React.useState({
        username: '',
    });
    const [token, setToken] = React.useState({
        access_token: ''
    })
    const [userId, setUserId] = React.useState({
        id: 0
    });    
    const readData = async () => {
        try {

            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            var decode = jwt_decode(refresh_token);
            var id = parseInt(decode.user_id);
            setUserId({id});
            setToken({ access_token });
        } catch (e) {
            alert(e+'  '+'Failed to fetch the data from storage');
            setToken({access_token:null});
        }
           
    }
    React.useEffect(() => {
        readData();
    }, [setUser, setUserId, setToken]);


    return (

        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.secondary,
                },
                headerStatusBarHeight:45,

            }} >
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    tabBarStyle:{
                        height:110,
                        position:'absolute',
                        top:"91%",
                    },
                    title: <CustomTabBar />,
                    tabBarIconStyle: { 
                        marginBottom:17,
                    },
                    tabBarLabel: '',
                    tabBarInactiveBackgroundColor: colors.secondary,
                    tabBarActiveBackgroundColor: colors.secondary,
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.black,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="home"
                            color={color}
                            size={mathIconSize}
                        />
                    ),
                }}
            />
            {token.access_token === null ?(null)
            :(
            <Tab.Screen name="Add" 
                component={AddPostsPage}
                options={{
                    tabBarStyle:{
                        height:110,
                        position:'absolute',
                        top:"91%",
                    },
                    title: <CustomTabBar/>,
                    tabBarIconStyle: {
                        marginBottom:17,
                    },
                    tabBarLabel: '',
                    tabBarInactiveBackgroundColor: colors.secondary,
                    tabBarActiveBackgroundColor: colors.secondary,
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.black,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="plus-box"
                            color={color}
                            size={mathIconSize}
                        />
                    ),
                }}
            />)}
            <Tab.Screen name="Profile"  
                initialParams={{ userid:userId.id}}      
                component={ProfilePage}
                options={{
                    tabBarStyle:{
                        height:110,
                        position:'absolute',
                        top:"91%",
                    },
                    headerShown:false,
                    tabBarIconStyle: {
                         marginBottom:17
                    },
                    tabBarLabel: '',
                    tabBarInactiveBackgroundColor: colors.secondary,
                    tabBarActiveBackgroundColor: colors.secondary,
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.black,

                    tabBarIcon:({ color, size }) => (
                        <MaterialCommunityIcons
                            name="account"
                            color={color}
                            size={mathIconSize}
                        />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}

function CustomTabBar() {
    const history=useHistory();
    const navigation = useNavigation();
    return (<>
    
        <View style={{
            justifyContent: "center",
            flexDirection: "row",
        }}>

            <TouchableOpacity 
                //onPress={() => history.push('/feed')}
                style={{
                    //justifyContent: "flex-start",
                }}
            > 
                <Text  
                    style={{
                        marginRight:"73%",
                        //marginTop: "1%",
                        color: colors.white,
                        fontWeight: 'bold',
                        fontSize:mathFontHeader,
                    }}
                >
                    Branch
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}
                style={{
                    top: "14%",
                    position: 'absolute',
                    left:"93%",
                }}
            >
                <Text>
                <MaterialCommunityIcons
                        name="bell"
                        color={colors.white}
                        size={mathBellSize}
                    />
                </Text>
            </TouchableOpacity>
        </View>
   
    </>);
}


export default function Feed(props) {

    const Stack = createNativeStackNavigator();


    return (<>
        
        <NavigationContainer>
            <Stack.Navigator 
            screenOptions={{
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight:"bold" },
                headerStyle: {
                    backgroundColor: colors.secondary,
                },
            }}>
                <Stack.Screen name="main" component={MyHome}
                    options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Notification"
                    component={NotificationPage}
                />
                <Stack.Screen name="/"
                    component={Welcome}
                />
                <Stack.Screen name="/feed"
                    component={HomePage}/>
                <Stack.Screen name="OthersProfile"
                    component={ProfilePage}
                  
                    options={({ route }) => ({
                        title: route.params.name,
                        headerBackTitle: '',
                    })}
                />
                <Stack.Screen name="Search"
                    component={SearchPage}
                />
                <Stack.Screen name="/addPlant"
                    component={AddPlant}
                    options={({ route }) => ({
                        title:'Connect Your Plant',
                    })}
                />
            </Stack.Navigator>

        </NavigationContainer>

    </>);
}

const styles = StyleSheet.create({


centeredView: {
   flex: 1,
   justifyContent: 'flex-end',
   

},
modalView: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    opacity: 0.95,
    padding: 5,
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 150,        
},

});
