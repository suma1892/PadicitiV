import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from './index';
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
export default class RadioButton extends Component
{
    constructor()
    {
        super();
    }

   

    

    render()
    {
        return(
            <TouchableComponent onPress = { this.props.onClick } activeOpacity = { 0.8 } style = { styles.radioButton }>
                <View style = {{ flexDirection: 'row',  alignItems: 'center',}}>
                <View style = {[ styles.radioButtonHolder, { height: this.props.button.size, width: this.props.button.size, borderColor: this.props.button.selected ? Colors.tangerine : this.props.button.color }]}>
                {
                    (this.props.button.selected)
                    ?
                        (<View style = {[ styles.radioIcon, { height: this.props.button.size / 2, width: this.props.button.size / 2, backgroundColor: Colors.tangerine }]}></View>)
                    :
                        null
                }
                </View>
                <Text style = {[ styles.label, { color: this.props.button.color_lable }]}>{ this.props.button.label }</Text>
            </View>

            </TouchableComponent>
        );
    }
}

const styles = StyleSheet.create(
{
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25
    },

    radioButton:
    {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    radioButtonHolder:
    {
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    radioIcon:
    {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    label:
    {
        marginLeft: 10,
        fontSize: 20
    },

    selectedTextHolder:
    {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    selectedText:
    {
        fontSize: 18,
        color: 'white'
    }
});