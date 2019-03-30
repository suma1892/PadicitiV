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
import { Colors, Metrics, Toolbar, TextView, RadioButtons, DialogComponent } from '../../Components'

import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Function } from '../../Utils'
import { getIcon } from '../../Assets';
import array from '../../Utils/array'
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class DetilTraveler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title : null,
            full_name: null,
            phone_num: null,
            email: null,
            full_name_error : null,
            phone_num_error : null,
            email_error : null,
            title : 'Mr',
            radioItems : array.TitleAdult(),
            filterActive : false
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        let { navigation } = this.props
        const { params } = navigation.state;
        this.setState({title : params.data.title,full_name: params.data.name, 
        phone_num: params.data.phone_num,
        gander : params.data.gander,
        email: params.data.email,radioItems : params.slug === 'adult' ? array.TitleAdult() : array.TitleChild() })

        var ArrayradioItems = this.state.radioItems
        this.setState({ filterActive: false })
        ArrayradioItems.map((item, index) => {
            item.selected = false;
            if (item.title === params.data.title){
                this.state.radioItems[index].selected = true;
            }
        });
    }
    

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }

    changeActiveRadioButton(index) {
        var ArrayradioItems = this.state.radioItems
        this.setState({ filterActive: false })
        ArrayradioItems.map((item) => {
            item.selected = false;
        });
        this.state.radioItems[index].selected = true;
       this.state.title = this.state.radioItems[index].title


    }

    SaveData() {
        let { full_name, phone_num, email } = this.state
        this.setState({
            full_name_error : null,
            phone_num_error : null,
            email_error : null
        })
        var Status = true
        let regex_alphabet = /^[a-z ,.'-]+$/i,
            regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!full_name) {
            Status = false
            this.setState({ full_name_error: 'Nama harus diisi' })}
        if (!(regex_alphabet.test(full_name))) {
            Status = false
            this.setState({ full_name_error: 'Nama harus alfabet' })}
        if (!email) {
            Status = false
            this.setState({ email_error: 'Email harus diisi' })}
        if (!(regex_email.test(email))){
            Status = false
            this.setState({ email_error: 'Format Email salah' })}
        if (!phone_num){
            Satus = false
            this.setState({ phone_num_error: 'No. Handphone harus diisi' })}
        if (Status) {
            let { navigation } = this.props
            const { params } = navigation.state;
            console.log('Bajigurr >>> ' + this.state.title)
            navigation.goBack()
            navigation.state.params.ActivityResult({ slug: params.slug, position:  params.position, data : {title : this.state.title, name  : this.state.full_name, gander : this.state.title.gender, email : this.state.email,phone_num : this.state.phone_num } })
        }
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
                            text={"Detail Traveler Info"}
                        />}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <CententsContactInfo
                            Title = {this.state.title}
                            onPressTitle ={() => this.setState({ filterActive: true})}
                            onChangeTextFullName={(e) => { this.setState({ full_name: e }) }}
                            valueFullName={this.state.full_name}
                            placeholderFullName={'Full Name'}
                            onChangeTextNumber={(e) => { this.setState({ phone_num: e }) }}
                            placeholderNumber={'Number'}
                            valueNumber={this.state.phone_num}
                            onChangeTextEmail={(e) => { this.setState({ email: e }) }}
                            valueEmail={this.state.email}
                            placeholderEmail={'Email'}
                            full_name_error ={this.state.full_name_error}
                            phone_num_error ={this.state.phone_num_error}
                            email_error ={this.state.email_error}
                        />

                        <TouchableComponent onPress={() => this.SaveData()}>
                        <View style={{ height: Scale(50), borderRadius: 29.5, backgroundColor: "#00c783", margin: Scale(8), justifyContent: 'center', alignItems: 'center' }}>
                            <TextView style={{ fontSize: Scale(14), color: "#ffffff", marginLeft: Scale(16) }}>SAVE DATA</TextView>
                        </View>
                        </TouchableComponent>
                    </View>
                    
                </ScrollView>

                <DialogComponent
                            active={this.state.filterActive}
                            open={() => this.setState({ filterActive: true })}
                            close={() => this.setState({ filterActive: false })}
                            title={'Title'}
                            // action  = {() => this.Confirmation()} 
                            position='center'
                        >
                            {this.state.radioItems.map((item, key) => (
                                <View style={{ padding: Metrics.sizePad }}>
                                    <RadioButtons key={key} button={item}
                                        onClick={this.changeActiveRadioButton.bind(this, key)}
                                    />
                                </View>
                            ))}

                        </DialogComponent>
            </View>


        );
    }
}


const CententsContactInfo =     props =>(
    <View style={{ padding: Scale(8), backgroundColor: Colors.white }}>
        <View style={{
            borderRadius: Scale(6),
            borderStyle: "solid",
            borderWidth: Scale(2),
            height: Scale(45),
            borderColor: "#00c783",
            flexDirection: 'row',
            padding: Scale(8),
            marginTop: Scale(8)
        }} >
        <TouchableComponent onPress={props.onPressTitle}>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', paddingLeft : Scale(8) }}>
                <View style={{flex:1, width: (Metrics.screenWidth / 2) + Scale(100), justifyContent: 'center' }}>
                    <TextView style={{fontSize: Scale(12), color: "#000000" }}>{props.Title}</TextView>
                </View>

                <View style={{ width: (Metrics.screenWidth / 2) - Scale(140), justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Image
                        style={{ tintColor:Colors.gray,height: Scale(15), width: Scale(15), marginLeft: Scale(8) }}
                        resizeMode='contain'
                        source={getIcon('ic_arrow_down')}
                    />
                </View>
            </View>
        </TouchableComponent>

        </View>
        <View style={{ marginLeft: Scale(20), backgroundColor: Colors.white, position: 'absolute', marginTop: Scale(6) }}>
            <TextView style={{ fontSize: Scale(12), color: "#00c783" }}>Title</TextView>
        </View>

        <View style={{
            flex: 1,
            borderRadius: Scale(6),
            borderStyle: "solid",
            borderWidth: Scale(2),
            borderColor: "#dddddd",
            marginTop: Scale(8),
            paddingLeft : Scale(8)
        }} >
            <TextInput style={{ height: Scale(40), color: "#000000" }}
                onChangeText={props.onChangeTextFullName}
                value={props.valueFullName}
                placeholder={props.placeholderFullName}
                underlineColorAndroid='rgba(0,0,0,0)' />
        </View>

       {props.full_name_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.full_name_error}</TextView>}

        <View style={{
            height: Scale(45), borderRadius: Scale(6), marginTop: Scale(8),
            borderStyle: "solid", borderWidth: Scale(1), borderColor: "#dddddd", padding: Scale(8)
        }}>

            <View style={{ flex: Metrics.screenWidth / 6, flexDirection: 'row', alignItems: 'center' }}>
                <TextView style={{ fontSize: Scale(14), color: "#000000" }}>+62</TextView>
                <Image
                    style={{tintColor:Colors.gray, height: Scale(15), width: Scale(15), marginLeft: Scale(8) }}
                    resizeMode='contain'
                    source={getIcon('ic_arrow_down')}
                />

                <View style={{ height: Scale(25), width: Scale(2), marginTop: Scale(8), marginLeft: Scale(8), backgroundColor: "#dddddd" }} />
                <TextInput style={{ height: Scale(60), width: (Metrics.screenWidth / 1.4), color: "#000000", marginRight: Scale(30) }}
                    onChangeText={props.onChangeTextNumber}
                    keyboardType={'numeric'}
                    placeholder={props.placeholderNumber}
                    value={props.valueNumber}
                    underlineColorAndroid='rgba(0,0,0,0)' />
            </View>
        </View>

        {props.phone_num_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.phone_num_error}</TextView>}


        <View style={{
             flex:1,
             borderRadius: Scale(6),
             borderStyle: "solid",
             borderWidth: Scale(2),
             paddingLeft : Scale(8),
             borderColor: "#dddddd",
             marginTop : Scale(8)
        }} >
            <TextInput style={{ height: Scale(40), color: "#000000" }}
                onChangeText={props.onChangeTextEmail}
                value={props.valueEmail}
                placeholder={props.placeholderEmail}
                keyboardType={'email-address'}
                underlineColorAndroid='rgba(0,0,0,0)' />
        </View>

        {props.email_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.email_error}</TextView>}

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
AppRegistry.registerComponent("padiciti", () => DetilTraveler);
