import React, { Component } from 'react'
import { Image, TouchableNativeFeedback, TouchableWithoutFeedback, View, StyleSheet, Platform } from 'react-native'
import { Colors, Metrics, getIcon, _OS } from '../Assets'

export default class ToolbarComponent extends Component {
    render() {
        const {
            arrow_back,
        } = this.props
        const TouchableComponent = Platform.OS === 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        return (
            <View style={[styles.toolbar_frame, this.props.style]}>
                {arrow_back &&
                    <TouchableComponent
                        onPress={this.props.onPress} >
                        <Image
                            style={[styles.icon]}
                            resizeMode='contain'
                            source={getIcon('ic_arrow_back')}
                        />
                    </TouchableComponent>}
                {this.props.View || this.props.children}
                {this.props.Icon}
            </View>
        )
    }
}


var styles = StyleSheet.create({
    toolbar_frame: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: Metrics.normalPadding,
        paddingRight: Metrics.normalPadding,
        paddingTop: _OS(20, 0),
        height: 56.6 + _OS(20, 0),
        backgroundColor: Colors.blumine
    },
    icon: {
        marginRight: Metrics.normalPadding,
        width: 24,
        height: 24,
    }
})