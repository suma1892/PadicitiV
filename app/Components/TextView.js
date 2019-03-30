import React, { Component } from 'react'
import { Text, } from 'react-native';
import { Colors, Scale, Fonts } from './index';

export default class TextView extends Component {
    render() {
        const {
            ellipsize,
            numberOfLines,
            children,
            style,
            text
        } = this.props

        return (
            (!!children || !!text) ? 
                <Text
                    {...this.props}
                    style = {[{
                        ...Fonts.regular,
                        fontSize: Scale(12),
                        color: Colors.black}, style || {}]} 
                    ellipsizeMode={ellipsize && 'tail'}
                    numberOfLines={ellipsize && (numberOfLines || 1)}>
                    {children || text}
                </Text>
            : null
        )
    }
}