import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage,Alert as Confirmation
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    TextView as Text ,NearPlace, CardReviewHotel,
    Button,CheckBox,
    Touchable,
    ButtonComponent, Loading} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { NearDestination , HotelType } from '../../Utils/dummy'
import { Function, STRING, array, STRING_TR,Validaton } from '../../Utils'
const backAction = NavigationActions.back({key:''}) 
import { API, getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile } from '../../Services/JsonService'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            term_condition: false,
            loading : false

        });
    }

    componentDidMount(){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.setState({client_name : Function.JsonParse(UserData).client_name, client_email : Function.JsonParse(UserData).client_email, client_phone: Function.JsonParse(UserData).client_phone })
            } else {

                AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                    if (CustomerData !== null) {
                        this.setState({ client_name: Function.JsonParse(CustomerData).client_name, client_email: Function.JsonParse(CustomerData).client_email, client_phone: Function.JsonParse(CustomerData).client_phone })
                    }
                })
            }
        })
    }

    Confirmation(){
        Confirmation.alert(
            'Pesanan Anda sudah benar ?',
            'Anda tidak akan bisa mengubah detail pesanan setelah melanjutkan kehalaman pembayaran. Tetap lanjutkan ?',
            [
              {text: 'Periksa Kembali', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Ya, Lanjutkan', onPress: () => this.action()},
            ],
            { cancelable: false }
          )
    }

    action(){
        var i = 0;
        var A = 0;
        var G = 0;
        var status = true;
        const {params} = this.props.navigation.state;
        // for(var i = 0; i< ){}
        
        while (i < array.FiledDataClient().length) {
            this.setState({[array.FiledDataClient()[i].name +'_error'] : null })
            if (!this.state[array.FiledDataClient()[i].name]){
                console.log('clien')
                    status = false;
                   this.setState({[array.FiledDataClient()[i].name +'_error'] : STRING.Label.please_fill_in })
                }

                if (array.FiledDataClient()[i].name === 'client_email') {
                    console.log(Validaton.Email(this.state[array.FiledDataClient()[i].name]))
                    if (Validaton.Email(this.state[array.FiledDataClient()[i].name])) {
                        Status = false
                        this.setState({ [array.FiledDataClient()[i].name + '_error']: Validaton.Email(this.state[array.FiledDataClient()[i].name]) })
                    }
                }
    
                if (array.FiledDataClient()[i].name === 'client_name') {
    
                    if (Validaton.Character(this.state[array.FiledDataClient()[i].name])) {
                        Status = false
                        this.setState({ [array.FiledDataClient()[i].name + '_error']: Validaton.Character(this.state[array.FiledDataClient()[i].name]) })
                    }
                }
            
            i++;
        }
        while (G < params.Parameter.roomCount) {
                this.setState({ ['adult_full_name_error'+(G+1)]: null })
                if ( !this.state['adult_full_name'+(G+1)] ) {
                    console.log('Passs')
                    status = false;
                    this.setState({ ['adult_full_name_error'+(G+1)]: STRING.Label.please_fill_in })
                }

                if (Validaton.Character(this.state['adult_full_name' + (G + 1)])) {
                    Status = false
                    this.setState({ ['adult_full_name_error' + (G + 1)]: Validaton.Character(this.state['adult_full_name' + (G + 1)]) })
                }
            G++
        }
        // if (!this.state.term_condition){
        //     console.log('term_condition')
        //     status = false;
        //     this.setState({term_condition_error : false})
        //     this.setState({term_condition_error : Colors.red})
        // }
        if (status) {

            AsyncStorage.getItem('UserData', (err, UserData) => {
                if (UserData) {
                    this.Auth()
                } else {
    
                    AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                        if (CustomerData) {
                            this.Auth()
                        } else {
                            this.Auth('nonMember')
                        }
                    })
                }
            })
        }
    }

    Auth = (type) => {
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = type === 'nonMember' ? getURL('url_post_nonMember_Hotel') :getURL('url_post_book_hotel')
            let param =  type === 'nonMember' ?  Parameter.Nonmember(this.state) : Parameter.CheckOutHotel(params.Parameter, this.state)
            
            JSONPostFile(url, param).then((Respone) => {
                console.log(Respone)
                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: false }, ()=>{
                            switch(type){
                                case 'nonMember':
                                Function.SaveDataJson('CustomerData', Function.JsonString({
                                    clientId: Respone.userId,
                                    client_name: Respone.fullName,
                                    client_email: Respone.email,
                                    client_phone: Respone.phoneNumber,
                                }))
                                this.Auth()
                                break
                                default:
                                this.props.navigation.navigate('BookingDetail', {data : Respone, dataPlus : params.data, dataParam:params.Parameter ,state : this.state})
                                break
                            }
                           
                        })
                        break
                    default:
                        this.setState({ loading: false }, () => {
                        
                        })
                        // Alert(Respone.inRespMsg)
                        break
                }

            }).catch((err) => {
                this.setState({ loading: false }, () => {
                    this.backAndroid()
                })

                console.log('err >>> ' + err)
            })
        } catch (Error) {
            this.setState({ loading: false }, () => {
                this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }

    backAndroid() {
        this.props.navigation.dispatch(backAction)
        return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
    }

    View(key, ArrayView) {
        return (
            <View key={key}>
                <Text
                    style={[s.title_itemField, {marginTop : 8}]}
                    text={'Tamu '+ (key + 1)} />
                {ArrayView.map((item, i) => (
                            
                    <View>
                        {i !== 0 && i !== 1 && <CheckBox
                            onPress={() => this.setState({['CheckBoxName_'+ (key + 1)] : !this.state['CheckBoxName_'+(key + 1)]}, () =>{this.setState({[item.name+(key + 1)]: this.state['CheckBoxName_'+ (key + 1)] ? this.state.client_name : null })})}
                            label={STRING.Label.check_box_guest}
                            value={this.state['CheckBoxName_'+ (key + 1)]} />}

                        {i !== 0 && i !== 1 && <Text
                            style={[s.titleLable, { marginBottom: 0, marginTop: 4 }]}
                            text={item.title} />}

                        {i !== 0 && i !== 1 && <ItemField
                            style={{ marginBottom: 0, marginTop: 4 }}
                            type={'input'}
                            holder={item.holder}
                            value={this.state[item.name + (key + 1)]}
                            onChangeText={text => this.setState({[item.name+(key + 1)]: text })}
                            error = {this.state[item.name+'_error'+(key + 1)]}
                        />}
                    </View>
                ))}
            </View>
        )}

    render() {
        const { dispatch  , navigate} = this.props.navigation;
        const { loadImage } = this.state;
        const star =Array.from({length :5})
        const {params} = this.props.navigation.state;
        let AdultView = []
        let ChildView = []
        let InfantView = []
        if (this.state.search_param !== null) {
            for (let a = 0; a < params.Parameter.roomCount; a++) {
                AdultView.push(this.View(a, array.FiledDataPassanger()))
            }
        }
        return (
            <Container style={s.container}>
                 <Toolbar
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = {STRING_TR.CHECKOUT.TOOLBAR_TITLE}
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                    />
                  <ScrollView>
                    <View style={[style.section]}>
                        <Headertitle
                            title = {params.data.destination.title}
                        />
                        <View style={style.detailContainer}>
                            <View style={style.detail}>
                                <Text style={s.valueNormal}>{params.data.hotelName}</Text>
                                <Text style={s.fontGraytiny}>{params.data.checkInDate}</Text>
                                <Text style={s.fontGrayNormal}>{params.data.offerTypeName}</Text>
                            </View>
                            <View style={[{justifyContent :'center', top :-10}]}>
                                <ItemField
                                    type='resetbutton'
                                    onPress={()=> this.backAndroid()}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={style.section}>
                        <Headertitle
                            title = {STRING.Label.client}
                        /> 
                        {/* {array.DataPemesan().map((item, i)=>(
                            <ItemField
                                type='infodata'
                                text={item.title}
                            />
                        ))} */}
                    
                        <View style={{marginTop : Metrics.padding.normal}}>
                            {array.FiledDataClient().map((item, i) => (
                                item.name === 'client_phone' ? 
                                <ItemField
                                numeric
                                type='input'
                                label = {item.title}
                                holder= {item.holder}
                                value={this.state[item.name]}
                                onChangeText={text => this.setState({[item.name]: text })} 
                                error = {this.state[item.name+'_error']}
                            /> :
                                <ItemField
                                    type='input'
                                    label = {item.title}
                                    holder= {item.holder}
                                    value={this.state[item.name]}
                                    onChangeText={text => this.setState({[item.name]: text })} 
                                    error = {this.state[item.name+'_error']}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={style.section}>
                        <Headertitle
                                title = {STRING.Label.Guest}
                            />
                         {AdultView}
                        {/* {ChildView}
                        {InfantView} */}
                    </View>
                    <View style={style.sectionCondition}>
                            {/* <View style={{paddingHorizontal : Metrics.padding.normal}}>
                                <Headertitle
                                        title = {STRING.Label.terms_and_conditions}
                                    />
                            </View>
                            <View style={s.backgroundCondition}>
                                {array.TermAndCondition().map((item, i)=>(
                                    <ItemField
                                        background
                                        type='infodata'
                                        text={item.title}
                                    />
                                ))}
                        </View>
                        <View style={style.check_box}>
                            <CheckBox
                                    onPress={() => this.setState({term_condition : !this.state.term_condition})}
                                    label={STRING.Label.check_box}
                                    Bordererror = {this.state.term_condition_error}
                                    value={this.state.term_condition} />
                        </View> */}
                        <Button
                            onPress={()=> this.Confirmation()}
                            text = {STRING.Label.more}
                        />
                    </View>
                  </ScrollView>
                  <Loading
                    text={STRING.Label.waitting_for_Booking}
                    visible={this.state.loading}
                />
             </Container>
        )
    }
}

const Headertitle = props => (
    <View style={style.paddingV}>
         {props.title && <Text ellipsizeMode='tail' numberOfLines={1} style={s.fontBlue}>{props.title}</Text>}
    </View>
)


const style = StyleSheet.create({
    check_box:{
        flex:1,
        paddingVertical: Metrics.padding.normal,
        //paddingHorizontal: Metrics.padding.normal
    },
    sectionCondition:{
        flex:1,
        paddingVertical : Metrics.padding.small,
        borderBottomColor : Colors.borderColor,
        borderBottomWidth : Metrics.border
    },
    detailContainer:{
        flex:1,
        flexDirection :'row'
    },
    detail:{
        flex :1,
        justifyContent :'center'
    },
    paddingV:{
        marginBottom : Metrics.padding.small,

    },
   address:{
    paddingHorizontal : Metrics.padding.normal,
    paddingVertical : Metrics.padding.small
   },
   headertitle:{
       alignItems :'center'
   },
   section :{
    paddingHorizontal : Metrics.padding.normal,
    paddingVertical : Metrics.padding.small,
    borderBottomColor : Colors.borderColor,
    borderBottomWidth :2
   },

})

