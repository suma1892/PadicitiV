import React, { Component } from 'react'
import { View,
     Image,
    StyleSheet,
    Switch,TextInput,
     } from 'react-native'

import PropTypes from 'prop-types'
import s from '../Styles'
import {Metrics, Colors, getIcon, Fonts} from '../../Assets'
import { Scale, Touchable, TextView as Text, CheckBox,  } from '../index'
    

export class ItemField extends Component {
    static propTypes = {
        label       : PropTypes.any,
        placeholder : PropTypes.any,
        onChange    : PropTypes.func,
        onChangeText: PropTypes.func,
        children    : PropTypes.node,
        value       : PropTypes.any,
        onPress     : PropTypes.func,
        disabled    : PropTypes.bool,
        smallSize   : PropTypes.bool,
        type        : PropTypes.string,
        selected    : PropTypes.any,
        password    : PropTypes.bool,
        numeric     : PropTypes.bool,
        phone       : PropTypes.bool,
        error       : PropTypes.any,
        numberOfstar : PropTypes.any
    }
    
    _renderLabel() {
        if (this.props.label) return <Text  style={s.label} >{this.props.label}</Text>
    }

    _renderPlaceholder() {
        if (this.props.placeholder) return <Text style={[s.placeholder, { flex: 1 }]} ellipsizeMode='tail'  numberOfLines={2}>{this.props.placeholder}</Text>
    }
    _renderValue(x) {
        if (this.props.value) return <Text style={[s.valueInput,{ flex: 1}]} ellipsizeMode='tail' numberOfLines={x || 0}>{this.props.value}</Text>
    }

    _renderOption(){
        return(
            <View style={[s.marginNormal, this.props.style && this.props.style ]}>
                    {this._renderLabel()}
                    <Touchable onPress={this.props.onPress}>
                        <View style={[s.rowInput, s.rectangel, {padding : Metrics.padding.small, marginTop: Metrics.padding.small}]}>
                            <Image
                                style={[s.imgInput]}
                                resizeMethod='scale'
                                source={this.props.images}
                            />
                             {this._renderPlaceholder()}
                             {this._renderValue(1)}
                        </View>
                    </Touchable>
            </View>
        )
    }
    _renderInputItem(){
        return (
            <View style={[{marginBottom: Metrics.padding.tiny}, this.props.style && this.props.style ]}>
                {this.props.label && <Text  style={[s.label,{color : Colors.warm_grey}]} >{this.props.label}</Text>}
                    <View style={s.inputTextContainer}>
                        <TextInput
                            style={s.inputText}
                            placeholder={this.props.holder}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.props.value}
                            onChangeText={this.props.onChangeText}
                            keyboardType={this.props.numeric ? 'numeric' : this.props.phone ? 'phone-pad' : 'default'}
                        />
                    </View>
                    {this.props.error && <Text style={[s.textError]}>{this.props.error}</Text>}
                </View>
        )
    }
    _renderReset(){
        return(
            <Touchable onPress={this.props.onPress}>
                <View style={s.close}>
                    <Text style={s.itemClose}>DETAIL</Text>
                </View>
            </Touchable>
            )
    }
   
    _renderInfoData(){
        return(
                <View style={{paddingBottom: Metrics.padding.tiny}}>
                    <View style={[{flexDirection :'row'}]}>
                        <Text style={s.dotDocument}>• </Text>
                        {this.props.text && <Text style={[s.fontGrayNormal, {flex:1}]}>{this.props.text}</Text>}
                    </View>
                </View>
        )
    }

    _renderItemCalendar(){
        return(
            <Touchable onPress={this.props.onPress} >
                <View style={s.rowInput}>
                    <Image
                        style={s.imgInput}
                        resizeMethod='scale'
                        source={getIcon('ic_calendar')}
                    />
                    {this.props.valueCalendar && <Text style={s.valueCalendar}>{this.props.valueCalendar}</Text>}
                </View>
            </Touchable>
        )
    }

    _renderViewGuest(){
        return (
            <View style={{flexDirection :'row'}}>
                {this.props.number && <View style={{paddingRight :Metrics.padding.tiny}}> 
                    <Text>{this.props.number}</Text>
                </View>}
                <View>
                   {this.props.name && <Text style={s.valueNormal}>{this.props.name}</Text>}
                    {this.props.email && <Text style={s.fontGrayNormal}>{this.props.email}</Text>}
                    {this.props.phone_client && <Text style={s.fontGrayNormal}>{this.props.phone_client}</Text>}
                </View>
            </View>
        )
    }

    _renderCheckbox() {
        return (
            <Touchable onPress={() => this.props.onPress(!this.props.value)}>
                <View style={[s.itemView]}>
                    <View style={[s.itemField]}>
                        
                        <View style={[s.checkbox, { backgroundColor: this.props.value ? Colors.tangerine : Colors.white }]}>
                            <Image 
                                source={getIcon('ic_checked')}
                                resizeMode={'contain'}
                                style={s.imgCheckbox}
                                />
                        </View>
                        <View style={[{flex :1, marginLeft : Metrics.padding.normal}]}>
                            {this.props.label && <Text style={[s.fontSmall]}>{this.props.label}</Text>}
                        </View>
                    </View>
                </View>
            </Touchable>
        )
    }
    _renderCheckboxImage() {

        const star =Array.from({length : this.props.numberOfstar})
        return (
            <Touchable onPress={() => this.props.onPress(this.props.value)}>
                <View style={[s.itemView]}>
                    <View style={[s.itemField]}>
                        
                        <View style={[s.checkbox, { backgroundColor: Colors.white }]}>
                            <Image 
                                source={getIcon('ic_checked')}
                                resizeMode={'contain'}
                                style={[s.imgCheckbox,{tintColor :  this.props.value === this.props.selected ? Colors.tangerine : Colors.white}]}
                                />
                        </View>
                        <View style={{flex:1, marginLeft: Metrics.padding.normal}}>
                                 <View style={{flexDirection :'row'}}>
                                    {star.map ((_, i) =>
                                        <Image
                                            key={i}
                                            source={getIcon('ic_star')}
                                            style={s.starBig}
                                            resizeMode='contain'
                                    /> 
                                    ) }
                                </View>
                        </View>
                    </View>
                </View>
            </Touchable>
        )
    }

    _renderOptionMenu(){
        return(
            <Touchable onPress={this.props.onPress}>
                    <View style={[ss.optionMenu, this.props.style && this.props.style ]}>
                            <View style={{flex:1}}>
                            {this.props.label && 
                                <Text style={ss.labelMenu}>{this.props.label}</Text>}
                            </View>

                            {this.props.value && 
                                <Text style={[ss.labelMenu, {marginRight : 8}]}>{this.props.value}</Text>}

                            <View style={ss.center}>
                                <Image
                                    source ={getIcon('ic_arrow_right')}
                                    resizeMode ='contain'
                                    style= {ss.imgArray}
                                />
                            </View>
                    </View>
            </Touchable>
        )
    }

    _renderLableOption(){
        return(
            <Touchable onPress={this.props.onPress}>
                    <View style={ss.optionMenu}>
                            <View style={{flex:1}}>
                            {this.props.label && 
                                <Text style={ss.labelMenu}>{this.props.label}</Text>}
                            </View>

                            {this.props.value && 
                                <Text style={[ss.labelMenu, {marginRight : 8}]}>{this.props.value}</Text>}

                    </View>
            </Touchable>
        )
    }

    render() {
        switch (this.props.type) {
            case 'option':
                return this._renderOption()
            case 'input':
                return this._renderInputItem()
            case 'resetbutton':
                return this._renderReset()
            case 'infodata':
                return this._renderInfoData()
            case 'itemCalendar':
                return this._renderItemCalendar()
            case 'viewGuest':
                return this._renderViewGuest()
            case 'checkbox':
                return this._renderCheckbox()
            case 'checkboxImage':
                return this._renderCheckboxImage()
            case 'optionMenu':
                return this._renderOptionMenu()
            case 'Lableoption':
                return this._renderLableOption()
            
        }
    }
}



var ss = StyleSheet.create({
    imgArray:{
        width: Metrics.icon.small,
        height: Metrics.icon.small,
    },
    center:{
        justifyContent      : 'center',
        alignItems          : 'center'
    },
    labelMenu:{
        fontFamily : Fonts.regular.fontFamily,
        fontSize : Fonts.size.medium,
        color : Colors.black,

    },
    optionMenu:{
        paddingHorizontal : Metrics.padding.normal,
        paddingVertical : Metrics.padding.normal,
        flexDirection : 'row',
        borderTopWidth : Metrics.border,
        borderTopColor : Colors.border,
        borderBottomWidth : Metrics.border,
        borderBottomColor : Colors.border,
        backgroundColor: Colors.white
    }
})

