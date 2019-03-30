import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Fonts, Scale, Colors } from '../Assets'

import TextView from './TextView'
import Touchable from './Touchable'

export class TrainButton extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let { props } = this

        return (
            <Touchable onPress={props.onPress}>
                <View style={s.btn_frame}>
                    <TextView style={s.btn_text}>{props.children}</TextView>
                </View>
            </Touchable>
        )
    }
}

const s = StyleSheet.create({
    btn_frame: {
        backgroundColor: Colors.pizzaz,
        margin: Scale(16),
        borderRadius: Scale(4),
        justifyContent: 'center',
        alignItems: 'center',
        padding: Scale(8)
    },
    btn_text: {
        ...Fonts.bold,
        color: Colors.white,
        fontSize: Fonts.size.large,
    },
})
