import React, { Component } from 'react'
import { TouchableWithoutFeedback, TouchableNativeFeedback, StyleSheet, Image } from 'react-native';
import { getIcon, Metrics } from '../Assets';
import { _OS } from './_OS';

export class Icon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image : this.props.source || getIcon('blank')
        }
    }

    getSize = (type) => {
        switch (type) {
            case 'tiny': return s.tiny
            case 'small': return s.small
            case 'normal': return s.normal
            case 'medium': return s.medium
            case 'large': return s.large
            default: return s.normal
        }
    }


    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({image: newProps.source})
    }
     

    render() {
        const Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)
        return (
            <Touchable onPress={this.props.onPress}>
                <Image
                    style={[this.getSize(this.props.size || 'normal'), this.props.style]}
                    resizeMode={'contain'}
                    source={this.state.image}
                    />
            </Touchable>
        )
    }
}

let s = StyleSheet.create({
    tiny: {
        width: Metrics.icon.tiny,
        height: Metrics.icon.tiny
    },
    small: {
        width: Metrics.icon.small,
        height: Metrics.icon.small
    },
    normal: {
        width: Metrics.icon.normal,
        height: Metrics.icon.normal
    },
    medium: {
        width: Metrics.icon.medium,
        height: Metrics.icon.medium
    },
    large: {
        width: Metrics.icon.large,
        height: Metrics.icon.large
    }
})
