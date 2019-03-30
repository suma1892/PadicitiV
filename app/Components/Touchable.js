import React, { Component } from 'react'
import { 
    Platform, 
    TouchableNativeFeedback, 
    TouchableWithoutFeedback,
    View
} from 'react-native'


export default class Touchable extends Component {
    render() {
        const 
            props     = this.props

        return  Platform.OS === 'android' ?
            (
                <TouchableNativeFeedback {...props} 
                    background={Platform.Version >= 21 ? TouchableNativeFeedback.Ripple('rgba(0,0,0,.1)', props.borderless) : TouchableNativeFeedback.SelectableBackground()}>
                    {this.props.children}
                </TouchableNativeFeedback>
            ) : (
                <TouchableWithoutFeedback {...props} 
                    onPress={this.props.onPress}>
                    {this.props.children}
                </TouchableWithoutFeedback>
            )
    }
}