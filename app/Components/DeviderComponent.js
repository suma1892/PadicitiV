import React, { Component }                     from 'react'
import PropTypes                                from 'prop-types'
import { View, StyleSheet }                                 from "react-native"
import { Colors, Metrics }                      from '../Assets'



export default class DividerComponent extends Component {
    render() {
        return (
            <View style={[styles.divider, this.props.style && {...this.props.style}]}/>
        );
    }
}
const styles = StyleSheet.create({
divider:{
    
}
})