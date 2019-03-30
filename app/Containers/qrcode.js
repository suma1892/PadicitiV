import React, { Component } from 'react'
import QRCode from 'react-native-qrcode';
import { _OS } from '../Assets';

import {
    AppRegistry,
    StyleSheet,
    View,
    TextInput, KeyboardAvoidingView,
} from 'react-native';
import { 
  TextView as Text, 
  Toolbar,Scale,Colors
} from '../Components'

export default class qrcode extends Component {
  state = {
    text: null,
  };

  componentDidMount(){
    const { navigation } = this.props
    const { params } = navigation.state
      this.setState({text : params.book_code})
  }

  render() {
    const { navigation } = this.props
    const ComponentView = _OS(KeyboardAvoidingView, View)
    return (
      <ComponentView style={{flex: 1, backgroundColor: 'white'}}>
      <Toolbar  
      arrow_back
      onPress ={ () => navigation.goBack()}>
      <View>
          <Text style={styles.toolbar_title}>{'Kode Boking ' + this.state.text}</Text>
      </View>
  </Toolbar>
      <View style={styles.container}>
        {this.state.text && <QRCode
          value={this.state.text}
          size={Scale(300)}
          bgColor='black'
          fgColor='white'/>}
      </View>
      </ComponentView>
    );
  };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
  toolbar_title: {
    fontSize: Scale(18),
    color: Colors.white
},
});

AppRegistry.registerComponent("padiciti", () => Qr_Code);
