import React, { Component } from 'react';

import {
  StyleSheet,
  Image
} from 'react-native';

import {
  Colors,
  Metrics,
  TextView as Text, 
  getIcon,
} from '../index'

export default class CustomMarker extends Component {
  render() {
    return (
      <Image
        style={styles.image}
        source={this.props.pressed ? require('../../Assets/Icons/ic_radio_active.png') : require('../../Assets/Icons/ic_radio_active.png')}
        resizeMode='cover'
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: Metrics.icon.tiny*1.3,
    width: Metrics.icon.tiny*1.3
  }
});
