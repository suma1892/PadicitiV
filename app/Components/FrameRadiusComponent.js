import React, { Component } from 'react'
import { TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Animated, Dimensions, Text, View, Image, StyleSheet, Easng, Platform } from 'react-native'
import { Colors, Metrics, Fonts } from '../Components'
import PropTypes from 'prop-types'

export default class FrameRadiusComponent extends Component {
    constructor() {
        super();
    }

    // HANDLE ONPRESS()
    _onPress() {
        this.props.onPress(); 
    }
    

    render() {
        const TouchableComponent = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback
        return (
            <View style={[styles.rectangle8, this.props.style]}>
                {this.props.View}
                </View>
        )
    }
}


var styles = StyleSheet.create({
    rectangle8: {
        height: 40,
        borderRadius: 4,
        marginTop : 4,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
    },
})