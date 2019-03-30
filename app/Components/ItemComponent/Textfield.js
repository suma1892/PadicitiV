import React, { Component } from 'react';
import { Animated, View, TextInput, StyleSheet , Image} from 'react-native'
import { Metrics, Fonts, Colors, Scale, getIcon } from '../../Assets';
import { Touchable, TextView as Text, } from '../index'

const 
  COLOR_DEFAULT   = Colors.black,
  COLOR_HIGHLIGHT = Colors.black,
  COLOR_ERROR     = Colors.pastel_red


export default class TextField extends Component {
  constructor(props) { 
    super(props);
    this.updateRef = this.updateRef.bind(this, 'input');  
    this.state = {
      animated  : new Animated.Value(0),
      isError   : false,
      error     : props.String,
      value     : this.props.value,
      password  : this.props.type == 'password' ? true : false,
      passIcon  : 'hide'
    };
  }

  showPassword(){
    if(this.state.passIcon === 'hide') {
      this.setState({passIcon: 'show', password: false})
    } else {
      this.setState({passIcon: 'hide', password: true})
    }
  }

  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/ ;
    if((text || '').length > 0 && reg.test(text) === false){
      return false
    } else {
      return true
    }
  }

  updateRef(name, ref) {
    this[name] = ref
  }
  
  _setFocus = () => {
    Animated.spring(this.state.animated, { toValue: 1 }).start();
  };
  
  _unsetFocus = (e) => {
    Animated.spring(this.state.animated, { toValue: 0 }).start();
    this.props.email && this.props.email(this.validate(this.state.value))
  }

  componentWillReceiveProps(nextProps) {
    const { error} = nextProps; 
    error && this._setFocus(); 
  }

  render() {
    const {
      onChangeText
    } = this.props
    // const labelColor = this.state.animated.interpolate({ inputRange: [0, 1],outputRange: [COLOR_DEFAULT, COLOR_HIGHLIGHT] }),
    //       labelPost  = this.state.animated.interpolate({ inputRange: [0, 1],outputRange: [Metrics.font.medium, (Metrics.font.tiny / 4)] }),
    //       labelSize  = this.state.animated.interpolate({ inputRange: [0, 1],outputRange: [Metrics.font.small, Metrics.font.tiny] })

   
    const { props } = this
    return (
      <View style={[s.frame, props.frameStyle && props.frameStyle]}>
        {/* <Animated.Text 
          style={[
            s.label,
            props.labelStyle && props.labelStyle]}>{props.label && props.label}</Animated.Text> */}
        <View style={{flexDirection:'row'}}>
          <TextInput 
              keyboardType          ={props.keyboardType && props.keyboardType}
              autoFocus             = {props.autoFocus && props.autoFocus}
              autoCorrect           = {false}
              autoCapitalize        = {'none'}
            //   onFocus               = {this._setFocus}
            //   onBlur                = {this._unsetFocus}
              style                 = {[s.input, props.style && props.style]}
              placeholder           = {props.placeholder && props.placeholder}
              underlineColorAndroid = 'rgba(0,0,0,0)'
              secureTextEntry       = {this.state.password}
              value                 = {this.props.value}
              onChangeText={(text) => {
                clearTimeout(this.textTimeout);
                this.textTimeout = setTimeout(() => this.setState({value: text}), 200);
                onChangeText && onChangeText(text);
              }}
              ref                   = {(input) => { this.textInput = input; }}/>
            {this.props.type == 'password' && 
                <Touchable onPress={()=> console.log('')}>
                    <View style={s.center}>
                        <Image
                            source= {getIcon('ic_history')}
                            resizeMode='contain'
                            style={s.imgPassword}
                        />
                    </View>

                </Touchable>
            } 
             {/* <Icon icon={this.state.passIcon} onPress={() => this.showPassword()}/>} */}
          </View>
       
        <Animated.View 
          style={[
            s.line,
            props.error && s.line_error,
          ]}/>

         {props.error && <Animated.Text style={[s.error]}>{props.error}</Animated.Text>}
      </View>
    )
  }
}

const s = StyleSheet.create({
    center:{
        justifyContent :'center',
        alignItems :'center'
    },
    imgPassword:{
        height : Metrics.icon.small,
        width : Metrics.icon.small
    },
  frame:{
    marginVertical    : Metrics.padding.small,
  },
  line:{
    flex            : 1,
    maxHeight       : StyleSheet.hairlineWidth,
    minHeight       : StyleSheet.hairlineWidth,
    backgroundColor : Colors.warm_grey
  },
  label:{
    fontSize        : Fonts.size.regular,
    color           : Colors.black,
    marginBottom    : Metrics.padding.small,
    ...Fonts.regular
  },
  input:{
    flex: 1,
    padding         : 0,
    margin          : 0,
    marginBottom    : Metrics.padding.tiny,
    color           : Colors.black,
    fontSize        : Fonts.size.medium,
    ...Fonts.regular,
    paddingBottom : Metrics.padding.small
  },
  input_active:{
    color           : Colors.black
  },
  error: {
    fontStyle       : 'italic',
    color           : Colors.pastel_red,
  },
  line_error:{
    backgroundColor : Colors.pastel_red,
  }
  
})