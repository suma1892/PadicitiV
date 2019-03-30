import React, { Component } from 'react'
import { TouchableNativeFeedback, TouchableOpacity, Animated, Text, View, StyleSheet, Easing, Platform } from 'react-native'
import { Colors, Metrics, Fonts } from '../Components'

export default class NavBotItemComponent extends Component {
    constructor() {
        super();
        this.state = { isClicked: false,spinValue:new Animated.Value(0) };
        this.rotateAnimated = new Animated.Value(0);
    }

    // RENDER VIEWS
    _renderIcon(source,spin) {
        var tintColors = !this.props.active ? Colors.warm_grey : Colors.tangerine
        if (this.props.label === '')
            return (<Animated.Image source={source} style={[styles.imageBig, { transform: [{ rotate: spin }] }]} />);
        else        
            return (<Animated.Image source={source} style={[styles.image, { tintColor: tintColors }]} />);
    }
   
    _renderLabel() {
        var tintColors = !this.props.active ? Colors.gray : Colors.tangerine
        if (this.props.label !== '')
            return (<Text style={[styles.label, { color:tintColors }]}>{this.props.label}</Text>)
    }
    _renderView(spin) {
        return (
            <View style={styles.frame}>
                {this._renderIcon(this.props.icon_def,spin)}
                {this._renderLabel(this.props.label)}

                
            </View>
        )
    }


    // HANDLE ONPRESS()
    _onPress() {
        if (!this.props.label) {
            if (this.state.isClicked) {
                this.setState({ isClicked: false })
                Animated.timing(this.state.spinValue,{ toValue: 0,duration: 200,easing: Easing.linear,useNativeDriver: true }).start()
            } else {
                this.setState({ isClicked: true })
                Animated.timing(this.state.spinValue,{ toValue: 1,duration: 200,easing: Easing.linear,useNativeDriver: true }).start()
            }
        }
        this.props.onPress(); 
    }
    
    render() {
        const spin = this.state.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] })
        const TouchableComponent = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback
        return (
            <TouchableComponent style={styles.touchable} onPress={() => this._onPress()}>
                {this._renderView(spin)}
            </TouchableComponent>
        )
    }
}

var styles = StyleSheet.create({
    touchable:{
        flex: 1,
        alignItems: 'center',
    },
    frame: {
        flex: 1,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    label: {
        fontSize: 12,
        color: '#FFF',
        bottom: 6,
    },
    image: {
        width:18,
        height: 18,
        marginBottom: 6,
    },
    imageBig: {
        width:18,
        height: 18,
    },
    notif: {
        position: 'absolute',
        right: 7,
        top: 7, 
        width: 19,
        height: 19,
        alignItems: 'center',
        backgroundColor: '#af2d25',
        justifyContent: 'center',
        borderRadius: 50
    },
   
})
