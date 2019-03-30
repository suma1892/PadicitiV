import React, { Component } from 'react'
import { TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Animated, Dimensions, Text, View, Image, StyleSheet, Easng, Platform } from 'react-native'
import { Colors, Metrics, Fonts, Mainstyles } from '../Components'
import PropTypes from 'prop-types'

export default class ListItemComponent extends Component {
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
            <TouchableComponent style={styles.touchable} onPress={() => this._onPress()}>
                <View style={{flex: 1}}>
                    <View style={styles.frame}>
                        <Image source={this.props.icons} style={styles.images} />
                        <Text style={styles.label}>{this.props.label}</Text>
                    </View>
                </View>
            </TouchableComponent>
        )
    }
}


var styles = StyleSheet.create({
    touchable:{
        flex: 1  
    },
    frame: {
        paddingHorizontal: Metrics.normalPadding,
        paddingVertical: Metrics.normalPadding/2,
        flexDirection: 'row',
        alignItems: 'center',

    },
    label: {
        fontSize: Fonts.size.regular,
        color: Colors.secondary
    },
    images: {
        width: Metrics.icon.small,
        height: Metrics.icon.small,
        marginRight: Metrics.baseMargin
    },
    divider:{
        height: 1,
        flex: 1,
        backgroundColor: Colors.whitesmoke,
        marginHorizontal: Metrics.normalPadding,
    }
})