import React, { Component } from 'react'
import { Image, Text, View, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors, Metrics } from '../Assets';
import TextView from './TextView'
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
export default class CheckBox extends Component
{
    constructor()
    {
        super();
    }

   

    

    render()
    {
        return(
            <TouchableComponent onPress={() => this.props.onPress(!this.props.value)}>
               <View style={[style_.itemView]}>
                    <View style={[style_.itemField]}>
                        {/* {this._renderLabel()} */}
                        <View style={[style_.checkbox, { backgroundColor:  Colors.white, borderColor : this.props.Bordererror ? Colors.red : Colors.warm_grey}]}>
                            <Image 
                                source={require('../Assets/Icons/ic_checkbox.png')}
                                resizeMode={'contain'}
                                style={[style_.imgCheckbox, {tintColor           :this.props.value ?  Colors.tangerine : Colors.white}]}
                                />
                        </View>
                        <TextView
                            style={{
                                fontSize: 16, color: Colors.warm_grey,marginLeft : 8
                            }}
                            text={this.props.label}
                        />
                         
                    </View>
                    <TextView style={{marginLeft: Metrics.icon.small * 0.9 + 7, color: Colors.pizzaz}}> {this.props.labelCondition}</TextView>
                    {this.props.error && <Text style={[style_.textError]}>{this.props.error}</Text>}
                </View>
            </TouchableComponent>
        );
    }
}

const style_ = StyleSheet.create(
{
    itemView:{
        ...setPadding, 
        ...borderDivider,
        ...fieldHeight,
        paddingHorizontal   : Metrics.sizePad,
        
        backgroundColor     : Colors.white,
        flex                :1

    },
    itemField:{
        flex                : 1,
        flexDirection       : 'row',
        // justifyContent      : 'center',
        alignItems          : 'center'
    },
    checkbox:{
        borderRadius        : 2,
        borderColor         : Colors.warm_grey,
        borderWidth         : 2,
        justifyContent      : 'center',
        alignItems          : 'center',
        width               : Metrics.icon.small * 0.9,
        height              : Metrics.icon.small * 0.9,
    },
    imgCheckbox:{
        maxWidth            : Metrics.icon.tiny * 0.8,
        maxHeight           : Metrics.icon.tiny * 0.8,
        tintColor           :  Colors.tangerine 
    },
})

const setPadding = {
    paddingVertical     : Metrics.sizePad / 2,
    paddingHorizontal   : 0
}
const borderDivider = {
    borderBottomWidth   : 1,
    borderColor         : Colors.whitesmoke
}
const fieldHeight = {
    minHeight           : Metrics.fieldHeight * 0.9
}