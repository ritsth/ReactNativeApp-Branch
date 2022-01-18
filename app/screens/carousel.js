import React, { Component } from 'react';
import {
    StyleSheet,
    useEffect, Button,
    useState, KeyboardAvoidingView,
    Text, Keyboard,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import axios from 'axios';
import { scrollInterpolator, animatedStyles } from '../config/animation_slide';
import { Card, ListItem, Icon } from 'react-native-elements'


const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);


export default class MyCarousel extends Component {

    state = {
        index: 0,
        all_posts: [{
            id: '',
            status: '',
            pub_date: '',
            post_img: '',
            type: '',
            user: '',
            user_name3: '',
            type_name: ''
        }],
    }

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this)
    }
    componentDidMount() {

        const Url = `https://branchappxzy.herokuapp.com/allPosts/`;
        axios.get(Url).then((res) => {
            const data = res.data;
            this.setState({ all_posts: data });

        });

    }
    _renderItem({ all_posts}) {
        return (
            < Card >
                <View style={styles.cardTop}>
                    <Image
                        source={{ uri: 'https://i.pinimg.com/564x/34/4c/ae/344caefd02f3689d50c53f779eacf1f4.jpg' }}
                        style={styles.userPhoto}
                    />
                    <Text style={{
                        marginTop: 9,
                        fontWeight: 'bold',
                        fontSize: 18
                    }}>

                        {this.state.all_posts[this.state.index].user_name3}
                    </Text>
                </View>
                <Card.Divider />
                <Card.Image
                    source={{ uri: `${this.state.all_posts[this.state.index].post_img}` }} />

                <Text style={{
                    marginBottom: 10,
                    marginTop: 10
                }}>
                    The idea with React Native Elements is more about component structure than actual design.
                                </Text>
                <Button
                    icon={<Icon name='code' color='#000000' />}
                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title='VIEW NOW'
                />
            </Card>
             
        );
    }

    render() {
        return (
            <View>
             
                    <Carousel
                        layout={'stack'}
                        ref={(c) => this.carousel = c}
                        data={this.state.all_posts}
                        renderItem={this._renderItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        containerCustomStyle={styles.carouselContainer}
                        inactiveSlideShift={0}
                        onSnapToItem={(index) => this.setState({ index })}
                        scrollInterpolator={scrollInterpolator}
                        slideInterpolatedStyle={animatedStyles}
                        useScrollView={true}
                        removeClippedSubviews={true}
                    />
        

                <Text style={styles.counter}
                >
                    {this.state.index}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 50
    },
    cardTop: {
        flexDirection: "row",
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginBottom: 10,
        marginRight: 10,
    },


    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue'
    },
    itemLabel: {
        color: 'white',
        fontSize: 24
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
