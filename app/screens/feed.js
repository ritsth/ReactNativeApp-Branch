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
import { NativeRouter, Route, Link } from 'react-router-native';
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



function MyHome() {
    const Tab = createBottomTabNavigator();
    const [loading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState({
        username: '',
    });

    const [token, setToken] = React.useState({
        access_token: ''
    })
    const [userId, setUserId] = React.useState({
        id: ''
    });    
    const readData = async () => {
        try {
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            setToken({ access_token })
            var decode = jwt_decode(refresh_token);
            var id = parseInt(decode.user_id);
            setUserId({id})
            setLoading(false)
        } catch (e) {
            alert(e);
            alert('Failed to fetch the data from storage');
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
                    backgroundColor: colors.secondary
                },
            }} >
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    title: <CustomTabBar />,
                    tabBarIconStyle: { marginTop: 8 },
                    tabBarLabel: '',
                    tabBarInactiveBackgroundColor: colors.secondary,
                    tabBarActiveBackgroundColor: colors.secondary,
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.black,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="home"
                            color={color}
                            size={30}
                        />
                    ),
                }}
            />
            <Tab.Screen name="Add" 
                component={AddPostsPage}
                options={{
                    title: <CustomTabBar/>,
                    tabBarIconStyle: { marginTop: 8 },
                    tabBarLabel: '',
                    tabBarInactiveBackgroundColor: colors.secondary,
                    tabBarActiveBackgroundColor: colors.secondary,
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.black,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="plus-box"
                            color={color}
                            size={30}
                        />
                    ),
                }}
            />
            <Tab.Screen name="Profile"
                initialParams={{ userid: loading == false?(userId.id):(1) }}
                component={ProfilePage}
                options={{
                    headerShown:false,
                    tabBarIconStyle: { marginTop: 8 },
                    tabBarLabel: '',
                    tabBarInactiveBackgroundColor: colors.secondary,
                    tabBarActiveBackgroundColor: colors.secondary,
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.black,

                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="account"
                            color={color}
                            size={30}
                        />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}

function CustomTabBar() {

    const navigation = useNavigation();
    return (<>
    
        <View style={{
            alignItems: "flex-start",
            flexDirection: "row",
        }}>

            
            <TouchableOpacity onPress={() => navigation.navigate('/')}> 
        
                <Text  
                    style={{
                        marginRight: 300,
                        marginTop: 5,
                        color: colors.white,
                        fontWeight: 'bold',
                        fontSize: 25,
                    }}
                >
                    Branch
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}
                style={{
                    top: 8,
                    position: 'absolute',
                    left:350,
                }}
            >
                <Text>
                <MaterialCommunityIcons
                        name="bell"
                        color={colors.white}
                        size={25}
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
            <Stack.Navigator screenOptions={{
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
