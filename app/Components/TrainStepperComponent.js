import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Scale, Colors, getIcon, Fonts } from '../Assets'

import TextView from './TextView'
import { Icon } from './IconComponent'

export class TrainStepper extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    onPress = (slug) => {
        let { props } = this
        switch (slug) {
            case 'min':
                if (props.value > props.min) props.onPress(props.value - 1)
                break
            case 'plus':
                if (props.value < props.max) props.onPress(props.value + 1)
        }
    }

    render() {
        let { props } = this
        return (
            <View style={[s.stepper_frame, props.style || {}]}>
                <TextView style={s.stepper_label}>{props.label} {props.extra_label && <TextView style={s.extra_label}>{props.extra_label}</TextView>}</TextView>
                <View style={s.stepper_box}>
                    <Icon
                        onPress={() => this.onPress('min')}
                        source={getIcon('ic_circle_min')} size='small'
                        // style={props.value === props.min && { tintColor: Colors.warm_grey }} 
                        />
                    <TextView style={s.stepper_value}>{String(props.value || 0)}</TextView>
                    <Icon
                        onPress={() => this.onPress('plus')}
                        source={getIcon('ic_circle_plus')}
                        size='small'
                        // style={props.value === props.max && { tintColor: Colors.warm_grey }} 
                        />
                </View>
            </View>
        )
    }
}


const s = StyleSheet.create({
    stepper_frame: {
        marginVertical: Scale(8),
    },
    stepper_box: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        backgroundColor: Colors.white,
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(8),
        alignItems: 'center',
    },

    stepper_label: {
        color: Colors.slate_gray,
        marginBottom: Scale(4),
        fontSize: Fonts.size.regular
    },
    extra_label:{
        color: Colors.slate_gray,
        fontSize: Fonts.size.small
    },

    stepper_value: {
        flex:1,
        textAlign: 'center',
        marginHorizontal: Scale(8),
        fontSize: Fonts.size.medium
    }
})
