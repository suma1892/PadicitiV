import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image,
    Platform, WebView,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking
} from 'react-native'
import { Colors, Metrics, Toolbar, TextView, RadioButtons, DialogComponent, Touchable,Alert , Loading} from '../../Components'

import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Function,STRING } from '../../Utils'
import { getIcon } from '../../Assets';
import { getURL } from '../../Services/API'
import { JSONGetFile, JSONPostFile } from '../../Services/JsonService'
import DateTimePicker from 'react-native-modal-datetime-picker';
import array from '../../Utils/array'
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: null,
            text : null,
            id_tour: 0,
            title : null,
            full_name: null,
            phone_num: null,
            email: null,
            full_name_error : null,
            phone_num_error : null,
            email_error : null,
            title : 'Mr',
            radioItemsArray : [],
            filterActive : false,
            isDateTimePickerVisible: false,
            dateParam : Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'DDMMYYYY'),
            month : Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'MMM'),
            year : Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'YYYY'),
            loading : false
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
       this.CheckUser ()
    }
    
    CheckUser (){
        const { params } = this.props.navigation.state;
        this.setState({id_tour : params.idTour}, ()=>{
            AsyncStorage.getItem('UserData', (err, UserData) => {
                if (UserData) {
                    this.setState({clientId: Function.JsonParse(UserData).clientId })
                } else {
                    AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                        if (CustomerData !== null) {
                            this.setState({clientId : Function.JsonParse(CustomerData).clientId})
                        }
                    })
                }
            })
        })
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }

  

    Stars(value) {
        var stars = value + 1
        for (var i = 0; i < 5; i++) {
            this.setState({ ['stars_' + (i + 1)]: false })
        }
        if (value === 0){
            this.setState({ ['stars_' + value]: !this.state['stars_' + value] })
        } else {
            for (var i = 0; i < stars; i++) {
                this.setState({ ['stars_' + i]: true })
            }
        }
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ month: moment(date).format('MMM').toString(), year :  moment(date).format('YYYY').toString(), dateParam : moment(date).format('DDMMYYYY').toString()})
        this._hideDateTimePicker();
    };

    GetReview(){
        const { navigation } = this.props
        let parameter = null
        let stars = 0

        for (var i = 0; i < 5; i++) {
           if (this.state['stars_' + i]) stars = i+1
        }
        var url = getURL('url_review_tour', url)
        this.setState({ loading: true })
        var param = {id_tour: this.state.id_tour,
                        id_user: this.state.clientId,
                        date: this.state.dateParam,
                        descrip: this.state.text,
                        experince: stars}
    
        JSONPostFile(url, param).then((Respone) => {
            console.log(Respone)
            switch (Respone.respCode) {
                
                case '0':
                this.setState({ loading: false })

                
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ slug: 'review'})
                    break
                default:
                    this.setState({ loading: false }, () => {
                        Alert(STRING.Warrning.no_connection)
                    })
                   
                    break
            }

        }).catch((err) => {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
                Alert(STRING.Warrning.no_connection)
            })
        })
       
    }

    render() {
        return (
            <View style={styles.frame} >
                <View style={{backgroundColor: '#3b65d6' }} >

                    <Toolbar
                        arrow_back
                        style={{ backgroundColor: 'transparent' }}
                        onPress={() => this.backAndroid()}
                        View={<TextView
                            style={styles.lableTitle}
                            text={"Write a review"}
                        />}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: Scale(8) }}>

                        <TitleLayout
                            num={'1'}
                            lbl={'When did you travel on tour?'} />

                        <View style={{ marginLeft: Scale(50), flexDirection: 'row', marginBottom: Scale(16) }}>
                            <View style={{ width: Metrics.screenHeight / 6 }}>
                                <TextRadio
                                    onPress={() =>  this.setState({ isDateTimePickerVisible: true})}
                                    Value={this.state.month} />
                            </View>

                            <View style={{ width: Metrics.screenHeight / 6, marginLeft: Scale(16) }}>
                                <TextRadio
                                    onPress={() =>  this.setState({ isDateTimePickerVisible: true})}
                                    Value={this.state.year} />
                            </View>
                        </View>

                        <TitleLayout
                            num={'2'}
                            lbl={'How would you rate the overall experience?'} />

                        <View style={{ marginLeft: Scale(50), flexDirection: 'row'  }}>
                        {Array.from({ length: 5 }).map((_, i) =>(
                        <Stars
                        onPress={()=>  this.Stars(i)}
                        Value ={this.state['stars_'+i]}/>))}
                        </View>

                        <TitleLayout
                            num={'3'}
                            lbl={'Write your review'} />
                        <View style={{ marginLeft: Scale(50) }}>

                            <View style={{
                                height: Scale(100),
                                borderRadius: 6,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#dddddd",
                                padding : Scale(8)
                            }}>
                            <TextInput
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            />

                            </View>
                            
                        </View>

                        <TouchableComponent onPress={() => this.GetReview()}>
                            <View style={{ height: Scale(50), borderRadius: 29.5, backgroundColor: "#00c783", margin: Scale(8), justifyContent: 'center', alignItems: 'center', marginTop: Scale(16) }}>
                                <TextView style={{ fontSize: Scale(14), color: "#ffffff", marginLeft: Scale(16) }}>SUBMIT REVIEW</TextView>
                            </View>
                        </TouchableComponent>
                    </View>
                    
                </ScrollView>

               <DateTimePicker
                    minimumDate={moment(new Date()).subtract(3, 'year').toDate()}
                    maximumDate={moment(new Date()).toDate()}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <Loading
                    text={STRING.Label.waitting_for_Login}
                    visible={this.state.loading} />
            </View>


        );
    }
}

const TextRadio= props =>(
<Touchable onPress ={props.onPress}>
<View style={{
    height: Scale(40),
    flex : 1,
    borderRadius: Scale(6),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    flexDirection :'row',
    paddingLeft : Scale(8),
    alignItems :'center',
}}>

    <TextView style={{
        fontSize: 14,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    }} >{props.Value}</TextView>

<View style={{flex : 1, alignItems: 'flex-end', padding: 8 }}>
<Image
style={{ height: Scale(15), width: Scale(15), marginLeft: Scale(8)}}
resizeMode='contain'
tintColor={Colors.gray}
source={getIcon('ic_arrow_down')}
/>
</View>
</View>
</Touchable>
)

const TitleLayout =     props =>(
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom : Scale(8)}}>
                            <View style={{
                                width: Scale(35),
                                height: Scale(35),
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#aaaaaa",
                                borderRadius: Scale(35) / 2,
                                justifyContent:'center',
                                alignItems: 'center'
                            }}>
                                <TextView style={{fontSize: Scale(18), color: "#aaaaaa" }}>{props.num}</TextView>
                            </View>
                            <View>
                            <TextView style={{ fontSize: Scale(14), color: "#000000", marginLeft: Scale(16) }}>{props.lbl}</TextView>
                            {props.lbJpg && <TextView style={{ width: Metrics.screenWidth/1.2, fontSize: Scale(14), color: "#666666", marginLeft: Scale(16) }}>{'You can upload any of these formats: JPG, PNG'}</TextView>}
                            </View>
                    </View>
)

const Stars =props =>(
    <Touchable
    onPress ={props.onPress}>
    <View style ={{
        width: Scale(40),
        height: Scale(40),
        borderRadius: 6,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
        alignItems :'center',
        justifyContent : 'center',
        marginRight : Scale(14)
   }}>

   <Image style={{width: 30, height: 30}}
   source={getIcon(props.Value? 'ic_star_yellow' : 'star_emphty' )}/>
   </View>
   </Touchable>
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
AppRegistry.registerComponent("padiciti", () => Review);
