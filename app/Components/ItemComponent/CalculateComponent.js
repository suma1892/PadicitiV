import React, { Component } from 'react'
import { Platform, View, KeyboardAvoidingView, StyleSheet, Image } from 'react-native'
import s from '../Styles'
import { Colors, Metrics, Fonts} from '../../Assets/index'
import { getIcon, Scale, Touchable,  TextView as Text} from '../index'

export default class CalculateComponent extends Component {
    _renderLabel() {
        if (this.props.label) return <Text  style={[style.label]} >{this.props.label}</Text>
    }

    render() {
    return  (
        <View style={[this.props.style && this.props.style ]}>
        {this._renderLabel()}
        <View style={[style.defaultBorder, this.props.border && this.props.border]}>
            <Touchable onPress={this.props.onPressMinus}>
                <Image      
                    style={[style.plus_minus]}
                    resizeMethod='scale'
                    source={getIcon('ic_minus')}
                />
            </Touchable>
            {this.props.number && <View>
                <Text style={s.lableNumber}>{this.props.number}</Text>
                </View>}
            <Touchable onPress={this.props.onPressPlus}>
                <Image      
                    style={[style.plus_minus]}
                    resizeMethod='scale'
                    source={getIcon('ic_plus')}
                />
            </Touchable>
        </View>
    </View>
        )
    }
}
  
const style = StyleSheet.create({
    defaultBorder :{
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center' ,
        height: Metrics.icon.normal,
        borderRadius: 4,
        // borderStyle: "solid",
        // borderRightColor: Colors.borderColor,
        // borderRightWidth: 2,
    },
    plus_minus: {
        resizeMode: 'contain',
        width: Metrics.icon.small,
        height: Metrics.icon.small,
        paddingHorizontal : Metrics.padding.small
    },
    label: {
        fontFamily: Fonts.regular.fontFamily,
        color: Colors.slate_gray,
        fontSize: Fonts.size.regular,
        letterSpacing: 0,
        textAlign: "left",
        marginBottom: Metrics.padding.small,
    },
})