import React from 'react';
import {
    StyleSheet, Pressable,
    useEffect, Button, AsyncStorage,
    useState, KeyboardAvoidingView,
    Text, Keyboard, Modal,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import axios from 'axios';
import { Card, ListItem, Icon } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { NavigationContainer, useNavigation,NavigationEvents } from '@react-navigation/native';
import jwt_decode from 'jwt-decode';
import { acc } from 'react-native-reanimated';

import colors from '../config/colors';
import Comments from './comments';


const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

export default function Posts({posts}) {

    const pub_date = (new Date(posts.pub_date)).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$1 $2, $3');
    const navigation = useNavigation();
    const [commentText, onChangeCommentText] = React.useState(null);
    const [modalOptions, setModalOptions] = React.useState(false);
    const [modalViewComment, setModalViewComment] = React.useState(false);
    const [modalPostComment, setModalPostComment] = React.useState(false);

    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [profilePhoto, setProfilePhoto] = React.useState({
        data: [{
            user: '',
            Profile_photo: '',
        }]
    })

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

    const [commentData, setCommentData] = React.useState({
        comments: [{
            comment_text: '',
            pub_date: '',
            user: '',
            user_name1: '',
            id: '',
            post: ''
        }],
    });


    const [user, setUser] = React.useState({
        username: '',
    })

    const [userId, setUserId] = React.useState({
        id: ''
    })
    const [token, setToken] = React.useState({
        access_token:''
    })
    const readData = async () => {
        try {
            const user = await AsyncStorage.getItem('@username');
            setUser({ username: user });
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            var decode = jwt_decode(refresh_token);
            const Id = parseInt(decode.user_id);
            setUserId({ id: Id });
            setToken({ access_token });
        } catch (e) {
            alert(e);
            alert('Failed to fetch the data from storage');
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
    const render = () => {
        axiosInstance.get('comment/').then((res) => {
            const Data = res.data;
            setCommentData({ comments: Data });
            setLoading(false);
        }).catch((err) => {
            setError(true)
        });
    };
    React.useEffect(() => {

        /*
        axios.get('users/').then((res) => {
            const Data = res.data;
            setUserData({ user: Data });
            setLoading(false);
        }).catch((err) => {
            setError(true)
        });*/
        readData();
        render();

        axiosInstance.get(`profile_photo/${posts.user}/`).then((res) => {
            const Data = res.data;
            setProfilePhoto({ data: Data });
            setLoading(false);
        }).catch((err) => {
            if (err = 'Request failed with status code 500') {
                setError(true)
            }
        });

    }, [setProfilePhoto, setUserData,
        setCommentData,
        setLoading,setError
    ]);

    const postComment = async (e) => {
        try {
            await axiosInstance.post('comment/', {
                comment_text: commentText,
                post: posts.id
            }).then((res) => {
                setModalPostComment(false);
                setModalViewComment(false);
                render();
            });
        } catch(err){
            alert(JSON.stringify(err));
        }

    };

    const deletePost = (e) => {
        try {
            axiosInstance.delete(`allPosts/${posts.id}/`).then((res) => {
                setModalVisible(false);
            });
        } catch (err) {
            alert(JSON.stringify(err));
        }

    };
    const editPost = (e) => {
        alert("under Construction");
    };
    const linkToOthers = () => {
        navigation.navigate('OthersProfile', {
            userid: posts.user,
            name: posts.user_name3
        })

    }
    return (
     
        <View 
            style={styles.container}>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalOptions}
          
            >
                <View style={styles.centeredView} >
                    <View style={styles.modalView}>
               
                            <Divider 
                                style={{
                                    borderWidth: 0.3,
                                    width: 375,
                                    borderColor: "grey",
                                    padding: 8,
                                    borderLeftColor: "white",
                                    borderRightColor: "white",
                                    borderTopColor:"white"
                                }} 
                            >
                                <Button 
                                    onPress={deletePost}
                                    color="red"
                                    title='Delete'
                                />
                            </Divider>
                            <Divider style={{
                                borderWidth: 0.3,
                                width: 375,
                                borderColor: "grey",
                                padding: 8,
                                borderLeftColor: "white",
                                borderRightColor: "white",
                                borderBottomColor: "white",
                                borderTopWidth: 0.1,
                                
                            }} >
                            <Button
                                color="black"
                                onPress={editPost}
                                title='Edit'
                            />
                            </Divider>

                    </View>
                </View>

                <View style={{
                    bottom: 270,
                    alignItems: "center",

                }} >
                    <View style={{
                        margin: 20,
                        borderRadius: 15,
                        backgroundColor: "white",
                        opacity:1,
                        padding: 5,
                        alignItems: "center",
                        shadowColor: "black",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowRadius: 50,
                        elevation: 17
                    }}>
                        <Divider style={{
                            borderWidth: 0.3,
                            width: 375,
                            borderColor: "grey",
                            padding: 7,
                            borderLeftColor: "white",
                            borderRightColor: "white",
                            borderTopWidth: 0.1,
                            borderBottomColor: "white"
                        }} >
                            <Button
                                color="black"
                                onPress={() => setModalVisible(!modalOptions)}
                                title='Cancel'
                            />
                        </Divider>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPostComment}>
             
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.avoidingView}
                >
                    <View style={styles.CommentView} >
                        <View style={styles.CommentModal}>

                            <ScrollView keyboardShouldPersistTaps={'always'}
                                onScrollEndDrag={() => setModalPostComment(false)} >
                                <View style={{
                                    flexDirection: "row",
                                    marginTop: 15,
                                }}>
                         
                                    <MaterialCommunityIcons
                                        name="dots-horizontal"
                                        size={27}
                                        onPress={() => setModalPostComment(false)}
                                     />
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginLeft:95
                                        }}>
                                    
                                        Add comment
                                    </Text>
                                </View>
                                <TextInput 
                                    autoFocus={true}
                                    placeholder="Drop your thoughts on this plant ..."
                                    style={styles.commentInput}
                                    onChangeText={onChangeCommentText}
                                    onSubmitEditing={postComment}

                                />
                                <View style={{
                                    fontWeight: "bold",
                                    backgroundColor: colors.secondary,
                                    borderRadius: 30,
                                    alignSelf: "flex-end",
                                    padding: 3,
                                }}>
                                    <Button 
                                        onPress={postComment}
                                        color="white"
                                        title='Post'
                                    />
                                </View>
                            </ScrollView>

                        </View>
                    </View>
                </KeyboardAvoidingView>

            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalViewComment}>

                <KeyboardAvoidingView onPress={Keyboard.dismiss}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.avoidingView}
                >
                    <View style={styles.CommentView} >
                        <View style={styles.postCommentModal}>

                            <View style={{
                                flexDirection: "row",
                                marginTop: 18,
                                margin: 10
                            }}>
                                <MaterialCommunityIcons
                                    name="dots-horizontal"
                                    size={27}
                                    onPress={() => setModalViewComment(false)}
                                />
                                <ScrollView keyboardShouldPersistTaps={'handled'}
                                    onScrollEndDrag={() => setModalViewComment(false)} >

                                    <Text 
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            left: 115
                                        }}>

                                        Comments
                                        </Text>
                                </ScrollView>
                            </View>

                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                {loading == false ?
                                    (commentData.comments.filter((filter) => filter.post == posts.id).map((comment) => {
                                        return (
                                            <Comments  
                                                key={comment.id}
                                                comment={comment}
                                                posts={posts}
                                                width={40}
                                                height={40}
                                                fontSize={16}
                                                fontSize2={14}
                                                fontSize3={18.5}
                                                margin={10}
                                                marginBottom={0}
                                                bottom={25}
                                            />
                                        )
                                    })) :
                                    (<Text style={{
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                    }}
                                    >LOADING ...</Text>)}
                            </ScrollView>


                            <View
                                style={{
                                    marginBottom: 15,
                                    flexDirection: 'row',
                                    margin: 5
                                }}>

                                <Image
                                    source={{
                                        uri: loading == false ?
                                            (`${profilePhoto.data.Profile_photo}`) :
                                            ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                                    }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 50,
                                        marginRight: 10,
                                        marginTop: 7
                                    }}
                                />
                                <TextInput
                                    autoFocus={true}
                                    placeholder="Add a comment"
                                    onChangeText={onChangeCommentText}
                                    style={{
                                        fontSize: 16.5,
                                        top: 5,
                                        borderColor: "lightgrey",
                                        borderWidth: 0.4,
                                        width: 300,
                                        height: 45,
                                        padding: 10,
                                        borderRadius: 40,

                                    }}
                                    onSubmitEditing={postComment}
                                />
                                <View style={{ 
                                    marginTop: 10,
                                }}>
                                    <Button
                                        onPress={postComment}
                                        title='Post'
                                    />
                                </View>
                            </View>
                       
                        </View>
                    </View>
                </KeyboardAvoidingView>

            </Modal>

            <Card key={posts.id}
                containerStyle={{
                    width: 390,
                    borderColor: "grey",
                    borderWidth: 0,
                    borderBottomWidth: 0.5,
                    borderRightWidth: 0.5,
                }}
            > 
                
                <View
                    style={styles.cardTop}
                >
                    <TouchableOpacity
                            onPress={linkToOthers}>    
                            <Image
                                source={{
                                    uri: loading == false ?
                                        (`${profilePhoto.data.Profile_photo}`) :
                                        ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                                }}
                                style={styles.userPhoto}
                            />
                    </TouchableOpacity>
                    <Text style={{
                        marginTop: 9,
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>
                        {posts.user_name3}
                    </Text>                        
                </View>                    
                
                {userId.id == posts.user ? (
                    <Text
                        onPress={() => setModalOptions(true)}
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 320
                        }}
                    >
                        <MaterialCommunityIcons
                            name="dots-horizontal"
                            size={25}
                        />
                    </Text>

                ) : (null)}                    
                        
                
                <Card.Divider style={{
                        borderWidth: 0.1,
                        borderColor: "grey",
                    }}
                />
                <Card.Image
                    style={styles.postImg}
                    source={{ uri: `${posts.post_img}` }}
                />

                <Text style={{
                    marginBottom: 8,
                    marginTop: 10,
                    fontSize: 15,
                    fontWeight:'900',
                    color:"#4169E1"
                }}>
                    {posts.type_name}
      
                </Text>
                <Text style={{
                    marginBottom: 4,
                    fontSize:17
                }}>
                    {posts.status}
                    

                </Text>
                <Text
                    style={{
                        opacity: 0.5,
                        fontSize: 13.5,
                    }}
                >
                    {pub_date}
                </Text>
                <TouchableOpacity
                    onPress={() => setModalPostComment(true)}>
                    <View
                        style={{
                            marginTop:10,
                            flexDirection: 'row'
                        }}>

                        <Image 
                            source={{
                                uri: loading == false ?
                                    (`${profilePhoto.data.Profile_photo}`) :
                                    ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                            }}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 50,
                                marginBottom: 5,
                                marginRight: 8,
                            }}
                        />
                        <Text
                            style={{
                                opacity: 0.7,
                                fontSize: 16.5,
                                color: "grey",
                                top: 5
                            }}
                        >
                            Add a comment
                        </Text>

                    </View>
                </TouchableOpacity>
                {loading == false ?
                    (commentData.comments.filter((filter) => filter.post == posts.id).map((comment,i,array) => {
                        if (i + 1 === array.length) {return (
                            
                            <Comments
                                key={comment.id}
                                comment={comment}
                                posts={posts}
                                width={30}
                                height={30}
                                fontSize={15}
                                fontSize2={12.5}
                                fontSize3={17.5}
                                margin={15}
                                marginBottom={0}
                                lines={2}
                                bottom={15}
                            />
                        )}
                    })) :
                    (<Text style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}
                    >LOADING ...</Text>)}

                {commentData.comments.filter((filter) => filter.post == posts.id).length > 1 ? (
                    <View style={{
                        backgroundColor: '#F0F0F0',
                        borderRadius: 30,
                        width:210,
                        alignSelf: "center"
                    }}>
                        <Button
                            onPress={() => setModalViewComment(true)}
                            title='SEE ALL COMMENTS'
                        />
                    </View>
                ): (null)}

            </Card>
        
        </View>

    );
}
const styles = StyleSheet.create({
    avoidingView: {
        flex: 1,
    },
    container: {
        flex:1,
        marginBottom: 20,
    },
    postImg: {
        height: ITEM_HEIGHT,
        width: ITEM_WIDTH
    },
    cardTop: {
        flexDirection:'row'
    },
    userPhoto: {
        width: 36,
        height: 36,
        borderRadius: 50,
        marginBottom: 10,
        marginRight: 10,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    modalView: {

        margin:20,
        borderRadius:15,
        backgroundColor: "white",
        opacity:0.95,
        padding: 5,
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 100,
        elevation: 17
    },

    commentInput: {
        fontSize: 17,
        height: 50,
        margin: 15,
        width: 350,
    },
    CommentView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    CommentModal: {
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


    postCommentModal: {
        height:400,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "white",
        opacity: 0.95,
        padding: 5,
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 150,
    },
});
