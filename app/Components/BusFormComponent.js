import React, { Component } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Scale, Colors, getIcon, Fonts } from '../Assets'

import TextView from './TextView'
import { Icon } from './IconComponent'
import Touchable from './Touchable'

export class BusForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datepicker: false
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
                        <Icon source={getIcon(this.props.icon_left || 'ic_train')} size='small' style={s.item_icon} />
                        {!this.props.value && this.props.placeholder && <TextView style={s.item_placeholder}>{this.props.placeholder}</TextView>}
                        {this.props.value && <TextView style={s.item_value}>{this.props.value}</TextView>}
                    </View>
                </Touchable>

                <DateTimePicker
                    isVisible   ={this.state.datepicker}
                    onConfirm   ={date => this.setState({datepicker: false}, () => this.props.onPress(date))}
                    onCancel    ={() => this.setState({datepicker: false})}/>
            </View>
        )
    }
}

export class TrainInput extends Component {

    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label_input}>{props.label}</TextView>
                <Touchable onPress={props.onPress}>
                    <View style={s.item_box_input}>
                        {props.icon_left && <Icon source={getIcon(props.icon_left || 'ic_train')} size='small' style={s.item_icon} />}
                        <TextInput
                            keyboardType={props.type === 'number' ? 'numeric' : props.type === 'email' ? 'email-address' : 'default'}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            autoCapitalize='none'
                            autoCorrect ={false}
                            style       ={s.item_input}
                            onChangeText={props.onChangeText}
                            placeholder ={props.placeholder} 
                            value       ={props.value}
                            />
                    </View>
                </Touchable>
                {props.error && <TextView style={s.item_error}>{props.error}</TextView>}
            </View>
        )
    }
}

export class TrainDropdown extends Component {
    render() {
        let { props } = this
        return (
            <View style={[s.item_frame, props.style && props.style]}>
                <TextView style={s.item_label_input}>{this.props.label}</TextView>
                <Touchable onPress={props.onPress}>
                    <View style={s.item_box}>
                        {this.props.icon_left && <Icon source={getIcon(this.props.icon_left || 'ic_train')} size='small' style={s.item_icon} />}
                        {!this.props.value && this.props.placeholder && <TextView style={s.item_placeholder_input}>{this.props.placeholder}</TextView>}
                        {this.props.value && <TextView style={s.item_value}>{this.props.value}</TextView>}
                        <TextInput />
                    </View>
                </Touchable>
            </View>
        )
    }
}


const s = StyleSheet.create({
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
        marginRight: Scale(8),
    },
})
