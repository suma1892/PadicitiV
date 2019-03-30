import React, { Component } from 'react'
import { View, StyleSheet, TextInput,Image } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Scale, Colors, getIcon, Fonts, Metrics } from '../Assets'

import TextView from './TextView'
import { Icon } from './IconComponent'
import Touchable from './Touchable'
import moment from 'moment';
// import reactotronReactNative from 'reactotron-react-native';
import ModalDropdown from '../Components/ModalDropdown';

export class IJDKForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datepicker: false,
        }
    }

    onPress = () => {

        switch (this.props.type) {
            case 'date': return this.setState({datepicker: true})
            default: this.props.onPress()
        }

    }
    
    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label}>{this.props.label}</TextView>
                <Touchable onPress={() => this.onPress()}>
                    <View style={s.item_box}>
                        {this.props.icon_left && <Icon source={getIcon(this.props.icon_left || 'ic_train')} size='small' style={s.item_icon} />}
                        {!this.props.value && this.props.placeholder && <TextView style={s.item_placeholder}>{this.props.placeholder}</TextView>}
                        {this.props.value && <TextView style={s.item_value}>{this.props.value}</TextView>}
                    </View>
                </Touchable>

                <DateTimePicker
                    minimumDate ={moment().add(props.minYear ? props.minYear : -2 , 'years').toDate()}
                    maximumDate ={props.maxYear ? moment().add(props.maxYear, 'years').toDate() : moment().toDate()}
                    isVisible   ={this.state.datepicker}
                    onConfirm   ={date => this.setState({datepicker: false}, () => this.props.onPress(date))}
                    onCancel    ={() => this.setState({datepicker: false})}/>
            </View>
        )
    }
}

export class IJDKInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }


    _isChar = (value) => {
        // if (/^\d+$/.test(value))
            this.props.onChangeText(value)
    }
    // _isChar = (value) => {
    //     if (/^\d+$/.test(value))
    //         this.props.onChangeText(value + '1')
    // }

    _handleKeyPress = (e) => {
        console.log(e.nativeEvent.key);
    }

    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label_input}>{props.label}</TextView>
                <Touchable onPress={props.onPress}>
                    <View style={s.item_box_input}>
                        {props.icon_left && <Icon source={getIcon(props.icon_left || 'ic_train')} size='small' style={s.item_icon} />}
                        <TextInput
                            underlineColorAndroid   = 'rgba(0,0,0,0)'
                            keyboardType            = {props.type === 'number' ? 'numeric' : props.type === 'email' ? 'email-address' : 'default'}
                            autoCapitalize          = {props.autoCapitalize || 'none'}
                            autoCorrect             = {false}
                            style                   = {s.item_input}
                            onChangeText            = {(e) => { this._isChar(e) }}
                            placeholder             = {props.placeholder} 
                            value                   = {props.value}
                            />
                    </View>
                </Touchable>
                {props.error && <TextView style={s.item_error}>{props.error}</TextView>}
            </View>
        )
    }
}

export class IJDKOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    _isChar = (value) => {
      
        this.props.onChangeText(value)
    }

    _handleKeyPress = (e) => {
        console.log(e.nativeEvent.key);
    }

    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label_input}>{props.label}</TextView>
                <Touchable onPress={props.onPress}>
                    <View style={[s.item_box_input,{padding:Scale(8)}]}>
                        {props.icon_left && <Icon source={getIcon(props.icon_left || 'ic_train')} size='small' style={s.item_icon} />}
                       

                            <TextView style={[s.item_label_input, {flex : 1}]}>{props.value}</TextView>

                            {props.icon_right && <Icon source={getIcon(props.icon_right || 'ic_train')} size='small' style={[s.item_icon,{tintColor : props.tintColor ? props.tintColor : Colors.slate_gray}]} />}
                    </View>
                </Touchable>
                {props.error && <TextView style={s.item_error}>{props.error}</TextView>}
            </View>
        )
    }
}

const toCurrency = ( value ) => {
    value = Math.round(toNumber(value || '0'))
    let result = '',
        values = value.toString().split('').reverse().join('')
    for (let i = 0; i < values.length; i++) if (i % 3 === 0) result += values.substr(i, 3) + ','
    return result.split('', result.length - 1).reverse().join('')
}

const toNumber = value => value.replace(new RegExp('[^0-9]','g'),'')


export class IJDKDropdown extends Component {
    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label_input}>{this.props.label}</TextView>
                <Touchable onPress={props.onPress}>
                    <View style={s.item_box}>
                        {this.props.icon_left && <Icon source={getIcon(this.props.icon_left || 'ic_train')} size='small' style={[s.item_icon]} />}
                        {this.props.placeholder && <TextView style={s.item_placeholder_input}>{this.props.placeholder}</TextView>}
                        {this.props.value && <TextView style={s.item_value}>{this.props.value}</TextView>}
                        {/* <TextInput /> */}
                    </View>
                </Touchable>
            </View>
        )
    }
}



export class IJDKDropdownInput extends Component {
    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label_input}>{this.props.label}</TextView>
                <Touchable>
                    <View style={s.styleDropdown}>
                        <View style={{flex:1}}>
                            <ModalDropdown 
                                style={s.containerDropdown}
                                options={props.options}
                                textStyle ={s.item_inputs}
                                defaultValue = {props.placeholder}
                                dropdownStyle ={s.drowdownStyle}
                                dropdownTextStyle ={{color:Colors.black, fontSize:Fonts.size.regular}}
                            />
                            </View>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Image
                                source={getIcon('ic_arrow_down')}
                                style={s.iconArrowdown}
                                resizeMode='contain'
                            />
                        </View>
                    </View> 
                </Touchable>
                
            </View>
        )
    }
}

const s = StyleSheet.create({
    iconArrowdown:{
        height:Metrics.icon.small,
        width: Metrics.icon.small
    },
    styleDropdown:{
        flexDirection:'row',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        paddingHorizontal: Metrics.padding.small,
    },
    dropdownTextStyle:{
        padding: Scale(8),
        color: 'red',
        fontSize: 27,
    },
    item_inputs:{
        flex: 1,
        paddingVertical: Scale(8),
        color: Colors.gray,
        fontSize: Fonts.size.regular,
    },
    drowdownStyle:{
        width : Metrics.screenWidth/1.2,
        height : Metrics.icon.large*1.55,
        borderWidth: Metrics.border,
        borderColor: Colors.border
    },
    containerDropdown:{
        // borderWidth: 1,
        // borderColor: Colors.border,
        // borderRadius: Scale(4),
        // paddingHorizontal: Metrics.padding.tiny,
        justifyContent: 'center',
        flex:1,
    },
    item_error:{
        color: Colors.red,
        fontStyle: 'italic'
    },  
    item_frame: {
        marginVertical: Scale(8),
    },
    item_label: {
        color: Colors.slate_gray,
        marginBottom: Scale(4),
        fontSize: Fonts.size.regular
    },
    item_label_input: {
        color: Colors.warm_grey,
        marginBottom: Scale(4),
        fontSize: Fonts.size.regular,
    },
    item_placeholder: {
        color: Colors.warm_grey,
        fontSize: Fonts.size.medium
    },
    item_placeholder_input: {
        color: Colors.black,
        fontSize: Fonts.size.medium
    },
    item_value: {
        fontSize: Fonts.size.medium
    },
    item_box: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        backgroundColor: Colors.white,
        padding: Scale(8),
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_box_input:{
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_input:{
        flex: 1,
        padding: Scale(8),
    },
    item_icon: {
        tintColor  : Colors.slate_gray,
        marginRight: Scale(8),
    },
})
