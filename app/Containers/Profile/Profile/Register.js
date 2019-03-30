import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry,Platform
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    TextView as Text,
    Fonts, Touchable, TextField, Button, Loading,Alert } from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Function, STRING, array } from '../../Utils'
import { API, getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile } from '../../Services/JsonService'

const backAction = NavigationActions.back({key:''}) 



export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            parameter: {email     : null,
            password  : null,
            fullName : null,
            phoneNumber : null,
            resCode : 'padiciti',
            restype : 'rs_onl',
            deviceRegistered : Platform.OS == 'ios' ? 'IOS' : 'Android',
            },
            passwordConfirm : null,
            loading : false
        });
    }

    backAndroid() {
        this.props.navigation.dispatch(backAction)
        return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
    }

    action() {
        var i = 0
        var status = true
        this.setState({parameter: {email     : null,
            password  : null,
            fullName : null,
            phoneNumber : null,
            resCode : 'padiciti',
            restype : 'rs_onl',
            deviceRegistered : Platform.OS == 'ios' ? 'IOS' : 'Android',
            },passwordConfirm : null,})
        while (i < Object.keys(this.state.parameter).length) {

            this.setState({ [Object.keys(this.state.parameter)[i] + '_error']: null })
            if (!this.state.parameter[Object.keys(this.state.parameter)[i]]) {
                status = false
                this.setState({ [Object.keys(this.state.parameter)[i] + '_error']: STRING.Label.please_fill_in })
            }
            i++
        }
        this.setState({passwordConfirm_error : null})
        if (this.state.passwordConfirm !== this.state.parameter.password ) {
            status = false
            this.setState({passwordConfirm_error : STRING.Warrning.confirmPassword})
        }
        if (status) {
            this.Auth()
        }
    }

    Auth = (type) => {
        try {
            this.setState({ loading: true })
            let url = getURL('url_register_user')
            
            JSONPostFile(url, this.state.parameter).then((Respone) => {
                console.log(Respone)
                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: false }, ()=>{
                            // Function.SaveDataJson('UserData',Function.JsonString({
                            //     clientId     : Respone.userId,
                            //     client_name  : Respone.fullName,
                            //     client_email : Respone.email,
                            //     client_phone : Respone.phoneNumber
                            // }))
                            Alert(Respone.inRespMsg)
                            this.backAndroid()
                            // this.props.navigation.navigate('LandingPageProfile')
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
                })

                console.log('err >>> ' + err)
            })
        } catch (Error) {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }
   
    render() {
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                 <Toolbar
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       ='Register'
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                    />
                    <ScrollView style={{flex:1}}>
                       <View style={[s.center, ss.headlineContainer]}>
                                <Text style={[ss.fontRegular, ss.headlinefont]}>{STRING.Label.welcome_register}</Text>
                                <Text style={[ss.fontRegular, ss.headlinefont]}>{STRING.Label.assign}</Text>
                       </View>
                       {/* <View>
                            <ButtonComponent
                                    onPressGoogle = {()=> console.log('')}
                                    onPressFb = {()=> console.log('')}
                            />
                       </View> */}
                       {/* <View style={ss.orContainer}>
                           <Text style={s.fontRegularGray}>━  or  ━</Text>
                       </View> */}

                       <View style={s.marginNormal}>
                            <TextField 
                                    //email         = {error => this.setState({error})}
                                    type          = 'input'
                                    onChangeText  = {fullName => this.state.parameter.fullName = fullName}
                                    placeholder  =  {STRING.Label.account_name}
                                    value         = {this.state.parameter.fullName}
                                    error = {this.state.fullName_error}
                                    />
                            <TextField 
                                    // email         = {error => this.setState({error})}
                                    onChangeText  = {email => this.state.parameter.email = email}
                                    type          = 'email'
                                    placeholder  =  {STRING.Label.email_address}
                                    value         = {this.state.parameter.email}
                                    error = {this.state.email_error}
                                    />
                            <TextField 
                                onChangeText  = {phoneNumber => this.state.parameter.phoneNumber = phoneNumber}
                                placeholder  =  {STRING.Label.account_hp}
                                value         = {this.state.parameter.phoneNumber}
                                error ={this.state.phoneNumber_error}
                                />
                            <TextField 
                                type          = 'password'
                                onChangeText  = {password => this.state.parameter.password = password}
                                placeholder  =  {STRING.Label.password}
                                value         = {this.state.parameter.password}
                                error = {this.state.password_error}
                                />
                            <TextField 
                                type          = 'password'
                                onChangeText  = {passwordConfirm => this.setState({passwordConfirm : passwordConfirm})}
                                placeholder  =  {STRING.Label.repeatPassword}
                                value         = {this.state.passwordConfirm}
                                error ={this.state.passwordConfirm_error}
                                />

                            
                        </View>
                        <Button
                            style={ss.button}
                            onPress={()=> this.action()}
                            text = {STRING.Label.signUp}
                        />
                </ScrollView>
                <Loading
                    text={STRING.Label.waitting_for_Login}
                    visible={this.state.loading}
                />
             </Container>
        )
    }
}



  const ButtonComponent = (props) => {
    return (
        <View style={ss.buttonComponent}>
            <View style={[{marginRight : Metrics.padding.normal, flex:1}]}>
                <Touchable onPress={props.onPressGoogle}>
                    <View style={ss.buttonGo}>
                        <View style={ss.content}>
                            <View style={{marginRight : Metrics.padding.tiny}}>
                                <Image
                                    source= {{uri: 'http://www.seeicons.com/images/iconstore/512/seeicons__579ca0f30e4cd.png'}}
                                    resizeMode ='contain'
                                    style={ss.imgGoogle}
                                />
                            </View>
                            <Text style={[ss.textGo]}>Google</Text>
                        </View>
                    </View>
                </Touchable>
            </View>
            <View style={[{marginLeft : Metrics.padding.normal, flex:1}]}>
                <Touchable onPress={props.onPressFb}>
                    <View style={ss.buttonFb}>
                        <View style={ss.content}>
                            <View style={{marginRight : Metrics.padding.tiny}}>
                                <Image
                                    source= {{uri: 'https://vignette.wikia.nocookie.net/carciphona/images/5/51/Fb.png/revision/latest?cb=20170317182253'}}
                                    resizeMode ='contain'
                                    style={ss.imgFb}
                                />
                            </View>
                            <Text style={[ss.textFb]}>Facebook</Text>
                        </View>
                    </View>
                </Touchable>
            </View>
            
        </View>
    )
}

const ss = StyleSheet.create({
    fontRegular:{
        fontFamily : Fonts.bold.fontFamily,
        fontWeight: Fonts.bold.fontWeight,
        fontSize : Fonts.size.medium,
    },
    signUpContainer:{
        paddingVertical : Metrics.padding.small,
        paddingHorizontal :Metrics.padding.normal,
        justifyContent :'center',
        alignItems :'center',
       marginTop : Metrics.padding.normal
    },
    forget:{
        fontFamily : Fonts.regular.fontFamily,
        fontSize : Fonts.size.regular,
        color: Colors.tangerine
    },
    forgetContainer:{
        paddingVertical : Metrics.padding.small,
        paddingHorizontal :Metrics.padding.normal,
        justifyContent :'center',
        alignItems :'center',
        marginBottom : Metrics.padding.large
    },
    button :{
        marginVertical : Metrics.padding.normal,
        borderRadius : 100
    },
    orContainer:{
        paddingVertical : Metrics.padding.small,
        justifyContent  : 'center',
        alignItems      : 'center',
    },
    content:{
        flexDirection:'row',
        justifyContent  : 'center',
        alignItems      : 'center',
    },
    buttonComponent:{
        //flex :1,
        flexDirection :'row',
        paddingHorizontal : Metrics.padding.normal,
    },
    imgGoogle:{
        width : Metrics.icon.small,
        height : Metrics.icon.small
    },
    imgFb:{
        width : Metrics.icon.small,
        height : Metrics.icon.small,
        tintColor : Colors.white
    },
    textGo:{
        fontFamily: Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize: Fonts.size.medium,
        letterSpacing: 0,
        color: Colors.black
    },
    textFb:{
        fontFamily: Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize: Fonts.size.medium,
        letterSpacing: 0,
        color: Colors.white
    },
    buttonGo:{
        flex:1,
        shadowColor       : 'black',
        shadowOffset      : {width: 0,height: 0},
        shadowOpacity     : .5,
        shadowRadius      : 2,
        elevation         : 1,
        zIndex          : 1,
        justifyContent  : 'center',
        alignItems      : 'center',
        backgroundColor: Colors.whitesmoke,
        borderRadius: 4,
        paddingVertical : Metrics.padding.normal * .5,
        marginVertical  : Metrics.padding.small,
        paddingHorizontal: Metrics.padding.normal,
    },
    buttonFb:{
        flex:1,
        shadowColor       : 'black',
        shadowOffset      : {width: 0,height: 0},
        shadowOpacity     : .5,
        shadowRadius      : 2,
        elevation         : 1,
        zIndex          : 1,
        justifyContent  : 'center',
        alignItems      : 'center',
        backgroundColor: Colors.blue,
        borderRadius: 4,
        paddingVertical : Metrics.padding.normal * .5,
        marginVertical  : Metrics.padding.small,
        paddingHorizontal: Metrics.padding.normal,
    },
    headlineContainer:{
        paddingVertical : Metrics.padding.normal,
        paddingHorizontal :Metrics.padding.large*1.9,
        justifyContent :'center',
        alignItems :'center'
    },
    headlinefont:{
        textAlign :'center'
    }

})

