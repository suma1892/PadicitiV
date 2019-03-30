import React, { Component } from 'react'
import { Platform, View, KeyboardAvoidingView, StyleSheet, Image, Text } from 'react-native'
import s from '../Styles'
import { Metrics, Colors, Fonts} from '../../Assets/index'
import  { Touchable }  from '../index'


const ButtonComponent = (props) => {
    // const getBtnType = type => (type === 'border' ? s.typeBtnBorder : {})
    // const getTxtType = type => (type === 'border' ? s.typeTxtBorder : {})

    const getpadding = typePadding => (typePadding ==='fullsize' ? style.buttonpadding : style.button)
    return (
        <Touchable onPress={props.onPress}>
            <View style={[ getpadding(props.typePadding),
                    props.style && props.style]}>
                <Text style={[style.text]}>{props.text || props.children}</Text>
            </View>
        </Touchable>    
    )
}


const style = StyleSheet.create({
    buttonpadding:{
        zIndex          : 1,
        justifyContent  : 'center',
        backgroundColor :  Colors.tangerine,
        paddingVertical : Metrics.padding.normal * .65,
        alignItems      : 'center',
    },
    button:{
        shadowColor       : 'black',
        shadowOffset      : {width: 0,height: 0},
        shadowOpacity     : .5,
        shadowRadius      : 2,
        elevation         : 1,
        zIndex          : 1,
        justifyContent  : 'center',
        alignItems      : 'center',
        backgroundColor: Colors.tangerine,
        borderRadius: 4,
        paddingVertical : Metrics.padding.normal * .5,
        marginVertical  : Metrics.padding.small,
        marginHorizontal: Metrics.padding.normal,
    },
    text:{
        fontFamily: Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize: Fonts.size.large,
        letterSpacing: 0,
        //textAlign: "left",
        color: Colors.white
    },
   
})

export default ButtonComponent