import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,KeyboardAvoidingView,
    Image, 
    Platform, WebView,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking 
} from 'react-native'
import {Colors, Metrics, Toolbar, TextView, Touchable,Alert, Loading } from '../../Components'

import {NavigationActions } from 'react-navigation';
import moment from 'moment'
import {Function, navigateTo, STRING} from '../../Utils'
import {getIcon, _OS } from '../../Assets';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
import { getURL } from '../../Services/API'
import { JSONGetFile, JSONPostFile } from '../../Services/JsonService'
export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email : null,
            password : null,
            confirm_password : null,
            email_error: null,
            password_error : null,
            confirm_password_error : null,
            see_password : true,
            see_confirm_password_error : true,
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
    }
   
    backAndroid() {
        navigateTo('Login' ,this.props.dispatch,this.props.navigation,null )
        return true
    }

    onChangePassword (type, value ){
       
        if (type === 'password'){
            this.setState({ confirm_password_error: null, password_error: null, password: value})
            if (value !== this.state.confirm_password){
                this.setState({ confirm_password_error: 'Password tidak sesuai'})
            } 

        } else {
            this.setState({ confirm_password_error: null, password_error: null, confirm_password: value})
            if (value !== this.state.password){
                this.setState({ confirm_password_error: 'Password tidak sesuai'})
            } 
        }
        
        }

    

    NextPage(){
        let {email,password, confirm_password} = this.state
        var Status = true
        this.setState({
            email_error : null,
            password_error : null,
            confirm_password_error : null
        })
        let regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (!(regex_email.test(email))){
                Status = false
                this.setState({ email_error: 'Format Email salah' })}    
        if (!email) {
                Status = false
                this.setState({ email_error: 'Email harus diisi' })}
        if (!password){
                Status = false
                this.setState({ password_error: 'Password harus diisi' })} 
        if (!password){
                Status = false
                this.setState({ confirm_password_error: 'Confirmation password harus diisi' })}
        if (password !== confirm_password){
                Status = false
                this.setState({ confirm_password_error: 'Password tidak sesuai', password_error: 'Password tidak sesuai'})} 

                if (Status) {
                    this.ForgotPassword()
               }

    }

    ForgotPassword(){
        this.setState({ loading: true })
        let url =  getURL('url_forgot_pass')
        let param = {email: this.state.email, resCode: 'padiciti',newPassword : this.state.password}
        try{
            JSONPostFile(url, param).then((Respone) => {
                console.log(Respone)
                switch (Respone.respCode) {
                    
                    case '0':
                    this.setState({ loading: false }, () => {
                        Alert(Respone.inRespMsg)
                        this.backAndroid();
                    })
                    
                        break
                    default:
                        this.setState({ loading: false }, () => {
                            Alert(Respone.inRespMsg)
                        })
                        break
                }
    
            }).catch((err) => {
                this.setState({ loading: false }, () => {
                    // this.backAndroid()
                    Alert(STRING.Warrning.no_connection)
                })
            })
        } catch(err){
            this.setState({ loading: false }, () => {
                // this.backAndroid()
                Alert(STRING.Warrning.no_connection)
            })
        }
       
    }

    render() {
        const ComponentView = _OS(KeyboardAvoidingView, View)
        return (
            <ComponentView style={styles.frame} behavior='padding' >
                <View style={{ width : Metrics.screenWidth, height: Scale(150), backgroundColor: '#3b65d6', marginBottom : Scale(16) }} >
                    <Image
                        source={getIcon('layer_1')}
                        resizeMode={'stretch'}
                        style={{
                            position: 'absolute', 
                            width: Metrics.screenWidth,
                            height: Scale(145),
                            tintColor: '#4778fb'
                        }}/>

                    <Toolbar
                        arrow_back
                        style={{ backgroundColor: 'transparent' }}
                        onPress={() => this.backAndroid()}
                        View={<TextView
                                style={styles.lableTitle}
                                text={"Forgot your password?"}
                            />}
                    />
                    <View style={{ marginLeft: Scale(16), paddingRight: Scale(16) }} >
                        <TextView style={{
                            fontSize: Scale(14),
                            fontWeight: "normal",
                            fontStyle: "normal",
                            lineHeight: Scale(24),
                            letterSpacing: 0,
                            color: "#ffffff"
                        }}>Please enter your email address and new password you wish to use, then check your email to follow next instruction.</TextView>
                        </View>
                </View>
                <ScrollView style={{flex:1}}  keyboardShouldPersistTaps='always'>
                <View style={{flex:1}}>
                <InputText
                    valueEmail={this.state.email}
                    onChangeTextEmail={(e) => { this.setState({ email: e }) }}
                    placeholderEmail={"Email"}
                    email_error={this.state.email_error}
                    keyboardType={'email-address'}
                    secureTextEntry={false}
                />
                <InputText
                    Image
                    onPress={() => this.setState({see_password: !this.state.see_password})}
                    valueEmail={this.state.password}
                    onChangeTextEmail={(e) => { this.onChangePassword('password', e)}}
                    placeholderEmail={"New Password"}
                    email_error={this.state.password_error}
                    keyboardType={'password'}
                    tintColor = {this.state.see_password ? Colors.blue : "#888888"}
                    secureTextEntry={this.state.see_password}
                />

                <InputText
                    Image
                    onPress={() => this.setState({see_confirm_password_error: !this.state.see_confirm_password_error})}
                    valueEmail={this.state.confirm_password}
                    onChangeTextEmail={(e) => { this.onChangePassword('confirm_password', e)}}
                    placeholderEmail={"Confirmation your New Password"}
                    email_error={this.state.confirm_password_error}
                    keyboardType={'password'}
                    tintColor = {this.state.see_confirm_password_error ? Colors.blue : "#888888" }
                    secureTextEntry={this.state.see_confirm_password_error}
                />

                <Button
                onPress ={() => this.NextPage()}/> 
                <Loading
                    text={"Harap tunggu"}
                    visible={this.state.loading} />  
                </View>   
                </ScrollView>  
            </ComponentView>
            

        );
    }
}

const InputText = props => (
    <View style={{ paddingTop: Scale(16),paddingRight: Scale(16), paddingLeft: Scale(16) }}>
        <View style={{
            borderRadius: Scale(6),
            borderStyle: "solid",
            borderWidth: Scale(2),
            paddingLeft: Scale(8),
            borderColor: "#dddddd",
        }} >
        <View style ={{flexDirection :'row'}}>
            <TextInput style={{ height: Scale(40), width: Metrics.screenWidth- Scale(70), color: "#000000" }}
                onChangeText={props.onChangeTextEmail}
                value={props.valueEmail}
                placeholder={props.placeholderEmail}
                keyboardType={props.keyboardType}
                secureTextEntry ={props.secureTextEntry}
                underlineColorAndroid='rgba(0,0,0,0)' />

                {props.Image && <Touchable onPress={props.onPress}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={getIcon('ic_visibility_off')}
                            resizeMode='contain'
                            style={{
                                height: Metrics.icon.small,
                                width: Metrics.icon.small,
                                tintColor: props.tintColor
                            }}
                        />
                    </View>

                </Touchable>}
                </View>
        </View>
        {props.email_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.email_error}</TextView>}
    </View>
   
)

const Button = props => (
    
    <View style={{marginLeft: Scale(16), marginRight: Scale(16), marginTop: Scale(28)}} >
        <TouchableComponent onPress={props.onPress}>
            <View style={{ height: Scale(50), borderRadius: Scale(29.5), backgroundColor: "#00c783", justifyContent : 'center', alignItems : 'center' }}>
                    <TextView style={{ marginLeft: Scale(8), fontSize: Scale(14), color: "#ffffff" }}>{'SUBMIT'}</TextView>
            </View>
        </TouchableComponent>
    </View>

)


const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(18), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(16),
        bottom: Scale(8),
        color: Colors.blue
    }
});
AppRegistry.registerComponent("padiciti", () => ForgotPassword);
