import React, { Component} from "react"
import {
    AppRegistry,
    View,
    FlatList,
    StyleSheet,
    Animated,NavigationIOS, AsyncStorage
} from "react-native"
import PropTypes from 'prop-types'

import NavBotItem   from '../Components/NavBotItemComponentsList'
// import ListItem     from '../Components/ListItemComponent'
import { Colors, Metrics, getIcon } from '../Assets'
import ArrayNav     from '../Utils/array';
// import { NavigationActions } from 'react-navigation';
// import STRING                   from '../Util/string'
export default class NavigationBottom extends Component { 
    constructor() {
        super();
        this.state = {
            isClicked       : false,
            slideUpDown     : new Animated.Value(0),
            fadeInOut       : new Animated.Value(0),
            GroupName       : null
        };
    }

    componentWillMount(){
    }

    handleClick(x){
       const navigate = this.props.navigate
        switch (x){
            case '0':
                // this._navigateTo('Dashboard')
                break;
            case '1':
                // this._navigateTo('Notification')
                break;
            case '2':
               
                break;
            case '3':
            // this._navigateTo('ProfileScreen')
            break;
            default: 
                // console.log(x)
                break
        }
    }

    // SET INTERPOLATE ANIMATED TRANSITION
    _setInterpolate = (x,y) => {
       return this.state.slideUpDown.interpolate({inputRange: [0, 1],outputRange: [x, y]})
    }


    render() {

        var NavSubAddMenu =[
            {
                icon    : getIcon('ic_home'),
                label   : 'Home',
                slug    : 'home',
                onPress : undefined,
            },{
                icon    : getIcon('ic_trip'),
                label   : 'My Booking',
                slug    : 'my_trip',
                onPress : undefined,
            },
            {
                icon    : getIcon('ic_promo'),
                label   : 'Promos',
                slug    : 'promos',
                onPress : undefined,
            },{
                icon    : getIcon('ic_more'),
                label   : 'More',
                slug    : 'more',
                onPress : undefined,
            }
        ]



        // SET ANIMATED TRANSITION
        const overlay     = this._setInterpolate(Colors.transparent, Colors.overlay)
        const hideOverlay = this.state.fadeInOut.interpolate({inputRange: [0, 1],outputRange: [0, Metrics.screenHeight]})
       
        return (
            <Animated.View >
                <View style={styles.navBar} >
                <View style ={styles.Line}>
                            </View>
                    <FlatList
                        data={this.props.array}
                        renderItem={({item, index}) => (
                           
                            <NavBotItem
                                label={item.title}
                                active={this.props.active === item.slug ? true : false}
                                icon_def={(item.source)}
                                onPress={() => this.handleClick(item.id)} />
                        )}
                        keyExtractor={(item, index) => index}
                        numColumns={ArrayNav.ArrayNavBarList().length} />
                </View>
                <Animated.View style={[styles.ComponentNavBottom,{backgroundColor: overlay, height: hideOverlay} ]}></Animated.View>
                
            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    ComponentNavBottom:{
        backgroundColor: Colors.overlay,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 900,

    },
    navBar: {
        backgroundColor: Colors.white,
        height: Metrics.navBot,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    SubNavBar:{
        backgroundColor: Colors.background,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 900,
    },Line : {
        height: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd"
      },
})