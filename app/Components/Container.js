import React, { Component } from 'react'
import { Platform, View, KeyboardAvoidingView } from 'react-native'


export default class Container extends Component {
    render() {

    return Platform.OS === 'ios' ? (
            <KeyboardAvoidingView {...this.props} style={[this.props.style && this.props.style]} behavior='padding'>
                {this.props.children}
            </KeyboardAvoidingView>
        ) : (
            <View {...this.props} style={[this.props.style && this.props.style]}>
                {this.props.children}
            </View>
        )
    }
}
  
