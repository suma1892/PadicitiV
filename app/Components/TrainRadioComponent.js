import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Scale, Colors, Fonts } from '../Assets'

import TextView from './TextView'
import Touchable from './Touchable'

export class TrainRadio extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    onPress = () => {
        let { value, currentValue, onPress} = this.props
        if (value !== currentValue) onPress(value)
    }

    render() {
        let { value, currentValue, text} = this.props

        return (
            <View style={[s.radio_frame, this.props.style && this.props.style]}>
                <Touchable onPress={() => this.onPress()} borderless>
                    <View style={{flexDirection:'row', paddingHorizontal: Scale(4), justifyContent: 'center', alignItems: 'center'}}>
                        <View style={[s.radio, value === currentValue && s.radio_active]}>
                            <Animated.View style={[s.radio_, value === currentValue && s.radio_active_]} />
                        </View>
                        <TextView style={[s.radio_text]}>{text}</TextView>
                    </View>
                </Touchable>
            </View>
        )
    }
}


const s = StyleSheet.create({
    radio_frame: {
        flexDirection: 'row',
        borderRadius: Scale(50),
        paddingVertical: Scale(4),
    },
    radio: {
        width: Scale(18),
        height: Scale(18),
        backgroundColor: Colors.warm_grey,
        padding: 2,
        borderRadius: Scale(9),
        marginRight: Scale(8),
    },
    radio_active: {
        backgroundColor: Colors.pizzaz,
    },
    radio_active_: {
        backgroundColor: Colors.transparent,
    },
    radio_: {
        borderRadius: Scale(8),
        flex: 1,
        borderColor: 'white',
        backgroundColor: Colors.white,
        borderWidth: 3,
    },
    radio_text: {
        fontSize: Fonts.size.medium
    },
})
