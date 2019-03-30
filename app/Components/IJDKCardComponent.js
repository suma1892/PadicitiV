import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    TouchableNativeFeedback, Image
} from 'react-native'
import {
    Scale,
    Colors,
    getIcon,
    Metrics,
    Fonts,
} from '../Assets'
import moment from 'moment';

import { Function } from '../Utils'
import { Icon } from './IconComponent'
import Text from './TextView'
import { _OS } from './_OS';
import QRCode from 'react-native-qrcode'
// import { Alert } from '.';


export class CardIJDKV2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        let {
            name,
            seats,
            price,
            train_class,
            depart_time,
            arrive_time,
            orgCode,
            desCode,
            duration,
            stopover,
            onPress,
            onPressMore
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)

        return (
                <View style={[s.card_frame, seats <= 0 && {backgroundColor: Colors.whitesmoke}]}>
                    <View style={[s.card_row]}>
                        <View style={[s.card_left]}>
                            <Text style={[s.card_train_name]}>
                                <Text>{name} {'-'} </Text>
                                {<Text style={[s.card_seats_green, seats <= 0 && s.card_seats_red]}>{seats}</Text>}
                            </Text>
                            <View style={[s.card_row]}>
                                <View style={[s.card_routes]}>
                                    {depart_time && <Text style={s.card_route_time}>{depart_time}</Text>}
                                    {orgCode && <Text style={s.card_route_code}>({orgCode})</Text>}
                                </View>
                                <View style={[s.card_routes]}>
                                    {arrive_time && <Text style={s.card_route_time}>{arrive_time}</Text>}
                                    {desCode && <Text style={s.card_route_code}>({desCode})</Text>}
                                </View>
                            </View>
                        </View>
                        <View style={[s.card_right]}>
                            {price && <Text style={[s.card_price]}>IDR {Function.convertToPrice(price)}</Text>}
                            {train_class && <Text style={[s.card_class]}>{train_class}</Text>}
                        </View>
                    </View>
                </View>
        )
    }
}


export class CardIJDK extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        let {
            name,
            seats,
            price,
            train_class,
            depart_time,
            arrive_time,
            orgCode,
            desCode,
            duration,
            stopover,
            onPress,
            onPressMore
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)
        
        return (
            <Touchable onPress={()=> seats !== 0 && onPress()}>
                <View style={[s.card_frame, seats <= 0 && {backgroundColor: Colors.whitesmoke}]}>
                    <View style={[s.card_row]}>
                        <View style={[s.card_left]}>
                            <Text style={[s.card_train_name]}>
                                <Text>{name} {'-'}</Text>
                                {<Text style={[s.card_seats_green, seats <= 0 && s.card_seats_red]}> {seats} {"Seats"}</Text>}
                            </Text>
                            <View style={[s.card_row]}>
                                <View style={[s.card_routes]}>
                                    {depart_time && <Text style={s.card_route_time}>{depart_time}</Text>}
                                    {orgCode && <Text style={s.card_route_code}>({orgCode})</Text>}
                                </View>
                                <View style={[s.card_routes]}>
                                    {arrive_time && <Text style={s.card_route_timeV2}>{arrive_time}</Text>}
                                    {desCode && <Text style={s.card_route_code}>({desCode})</Text>}
                                </View>
                            </View>
                        </View>
                        <View style={[s.card_right]}>
                            {price && <Text style={[s.card_price]}>IDR {Function.convertToPrice(price)}</Text>}
                            {train_class && <Text style={[s.card_class]}>{train_class}</Text>}
                        </View>
                    </View>
                </View>
            </Touchable>
        )
    }
}

export class CardQR extends Component {
    constructor(props) {
        super(props);
        this.state={
        showTheThing:false
        }
        }
    


    render() {
        let {
            name,
            seats,
            price,
            train_class,
            depart_time,
            arrive_time,
            orgCode,
            desCode,
            eventDate,
            duration,
            stopover,
            onPress,
            onPressMore,
            Seats,
            status
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)
        
        if (status === "N" || status === "X"){
            this.state.showTheThing = false            
        }else{
            this.state.showTheThing = true
        }
        return (
            <Touchable onPress={()=> seats !== 0 && onPress()}>
                <View style={[s.card_frame, seats <= 0 && {backgroundColor: Colors.whitesmoke}]}>
                    <View style={[s.card_row]}>
                        <View style={[s.card_left]}>
                        <View style={[s.card_routes]}>
                                    {depart_time && <Text style={s.card_route_time}>{depart_time}</Text>}
                                    {orgCode && <Text style={s.card_route_code}>({orgCode})</Text>}
                        </View>
                            <Text style={[s.card_train_name]}>
                                <Text>{name}{' - '}{seats}</Text>
                            </Text>
                            
                            <View style={[s.card_row]}>
                                
                                <View style={[s.card_routes]}>
                                    {desCode && <Text style={s.card_route_code}>({desCode})</Text>}
                                </View>
                            </View>
                            <View style={s.card_left}>
                            <View>
                                {eventDate && <Text style={s.card_train_name}>{"Event Date : "+ moment(eventDate).format("DD MMMM YYYYY")}</Text>}
                            </View>
                            </View>
                            <View style={s.card_left}>
                            <View>
                                {eventDate && <Text style={s.card_train_name}>{"Seat(s) : "+ Seats}</Text>}
                            </View>
                            </View>
                            {<View style={s.card_mid}>
                            {this.state.showTheThing && <QRCode
                                value={arrive_time}
                                size={150}
                                bgColor='black'
                                fgColor='white'/>}
                            </View>}
                        </View>
                        <View style={[s.card_right]}>
                            {price && <Text style={[s.card_price]}>{Function.convertToPrice(price)}</Text>}
                            {train_class && <Text style={[s.card_class]}>{train_class}</Text>}
                        </View>
                    </View>
                </View>
            </Touchable>
        )
    }
}



export class CardShortPax extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let { props } = this
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)


        return (
            <View style={[s.card_pax_frame]}>
                {props.index && <Text style={s.name}>{props.index}.</Text>}
                <View style={s.card_pax_content}>
                    {props.name     && <Text style={s.name}>{props.name}</Text>}
                    {props.num_id && <Text style={[s.sub_text, { ellipsizeMode: 'tail', color: '#888888' }]}
                        ellipsizeMode={'tail'}
                        numberOfLines={1}
                    >{props.num_id}</Text>}

                    <View style = {{flexDirection : 'row'}}>

                    <View style={{width : this.props.widthDest ? this.props.widthDest:Metrics.screenWidth/3}}>
                     <Text style={[s.sub_text, {ellipsizeMode : 'tail', color : '#888888'}]}
                    ellipsizeMode = {'tail'}
                    numberOfLines = {1}
                    >{props.org}</Text>

                    </View>
                    {props.seat && <View style={{width : this.props.widthSeat ? this.props.widthSeat  :Metrics.screenWidth/2.5, alignItems : 'flex-end', justifyContent : 'flex-end'}}>
                    <Text style={[s.sub_text, {ellipsizeMode : 'tail', color : '#888888'}]}>{props.seat}</Text>
                    </View>}
                    </View>
                </View>

                <View style={[s.card_pax_content,{flex : 1}]}>
                {/* {(props.num_id && props.onPressChangeSeat)  &&  */}
                {/* <Touchable onPress={props.onPressChangeSeat}>
                    <View style={{flex:1, justifyContent : 'flex-end', alignItems : 'flex-end'}}>
                        <View style={s.btn_short_dtl}>
                            <Text style={s.btn_short_dtl_txt}>Pindah Kursi</Text>
                        </View>
                    </View>
                </Touchable> */}
                {/* } */}
                </View>
            </View>
        )
    }
}


export class CardSortIJDK extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: 'http://facebook.github.io/react-native/',
        }
    }
 

    render() {
        let { props } = this
        let {
            train_name,
            onPress,
            onPressDetil,
            title,
            route,
            discount,
            date,
            nodetail,
            bookCode,
            alldetil
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)
        let mp = discount.toString()
        if (discount <= 0){
            mp = ""
        }else{
            mp = "( Discount "+Function.convertToPrice(discount)+" )"
        }
        return (
            
            <View style={{ flexDirection: 'row' }}>

                <View style={[s.card_frame_short, {flex :1}]}>
                    <View style={{flex: 1, flexDirection: 'row' }}>
                        <View >
                            <Text style={s.short_type}>{title}</Text>
                        </View>
                        {alldetil && <Touchable onPress={onPressDetil}>
                            <View style={[{ flex: 1, alignItems: 'flex-end' }]}>
                                <View style={[s.btn_short_dtl]}>
                                    <Text style={s.btn_short_dtl_txt}>DETAIL</Text>
                                </View>
                            </View>
                        </Touchable>}
                    </View>

                    <Text style={s.short_route}>{route}</Text>
                    <Text style={s.short_date}>{date}</Text>
                    <Text style={s.short_route}>{train_name}{mp}</Text>
                </View>


                {nodetail && <Touchable onPress={onPress}>
                    <View style={s.dtl_absolute}>
                        <View style={s.btn_short_dtl}>
                            <Text style={s.btn_short_dtl_txt}>DETAIL</Text>
                        </View>
                    </View>
                </Touchable>}
                {bookCode && <Touchable onPress={onPress}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: Scale(16), paddingVertical: Scale(8) }}>
                        <Text style={[s.short_type]}>{'Kode Boking'}</Text>
                        <View style={{ flex: 1, paddingVertical: Metrics.padding.small }}>
                            <QRCode
                                text={bookCode}
                                size={60}
                                bgColor='#000'
                                fgColor='#FFF'
                            />
                        </View>
                        <Text style={[s.short_route, { fontSize: Scale(16), color: Colors.tangerine }]}>{bookCode}</Text>
                    </View></Touchable>}
            </View>
            
        )
    }
}



export class CardSortTrain1 extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: 'http://facebook.github.io/react-native/',
        }
    }
 

    render() {
        let { props } = this
        let {
            train_name,
            onPress,
            onPressDetil,
            title,
            route,
            date,
            BookConfirm,
            nodetail,
            bookCode,
            alldetil
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)

        return (
            
            <View style={{ flexDirection: 'row' }}>

                <View style={[s.card_frame_short, {flex :1}]}>
                    <View style={{flex: 1, flexDirection: 'row' }}>
                        <View >
                            <Text style={s.short_type}>{title}</Text>
                        </View>
                    </View>

                    <Text style={s.short_route}>{route}</Text>
                    <Text style={s.short_date}>{date}</Text>
                    <Text style={s.short_date}>{BookConfirm}</Text>
                </View>

                {bookCode && <Touchable onPress={onPress}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: Scale(16), paddingVertical: Scale(8) }}>
                        <Text style={[s.short_type]}>{'Kode Boking'}</Text>
                        <View style={{ flex: 1, paddingVertical: Metrics.padding.small }}>
                            <QRCode
                                text={bookCode}
                                size={60}
                                bgColor='#000'
                                fgColor='#FFF'
                            />
                        </View>
                        <Text style={[s.short_route, { fontSize: Scale(16), color: Colors.tangerine }]}>{bookCode}</Text>
                    </View></Touchable>}
            </View>
            
        )
    }
}


export class CardSortV3 extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: 'http://facebook.github.io/react-native/',
        }
    }
 

    render() {
        let { props } = this
        let {
            train_name,
            onPress,
            onPressDetil,
            title,
            route,
            date,
            BookConfirm,
            nodetail,
            bookCode,
            alldetil
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)

        return (
            
            <View style={{ flexDirection: 'row' }}>

                <View style={[s.card_frame_short, {flex :1}]}>
                    <View style={{flex: 1, flexDirection: 'row' }}>
                        <View >
                            <Text style={s.short_type}>{title}</Text>
                        </View>
                        
                    </View>

                    <Text style={s.short_route}>{route}</Text>
                    <Text style={s.short_date}>{date}</Text>
                    <Text style={s.short_date}>{BookConfirm}</Text>
                </View>


                {nodetail && <Touchable onPress={onPress}>
                    <View style={s.dtl_absolute}>
                        <View style={s.btn_short_dtl}>
                            <Text style={s.btn_short_dtl_txt}>DETAIL</Text>
                        </View>
                    </View>
                </Touchable>}
                {bookCode && <Touchable onPress={onPress}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: Scale(16), paddingVertical: Scale(8) }}>
                        <Text style={[s.short_type]}>{'Kode Boking'}</Text>
                        <View style={{ flex: 1, paddingVertical: Metrics.padding.small }}>
                            <QRCode
                                text={bookCode}
                                size={60}
                                bgColor='#000'
                                fgColor='#FFF'
                            />
                        </View>
                        <Text style={[s.short_route, { fontSize: Scale(16), color: Colors.tangerine }]}>{bookCode}</Text>
                    </View></Touchable>}
            </View>
            
        )
    }
}




export class CardSortPelni1 extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
         
        }
    }
 

    render() {
        let { props } = this
        let {
            train_name,
            onPress,
            title,
            route,
            date,
            image,
            time
        } = this.props
        let Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)

        return (
            <Touchable onPress={onPress}>
            <View style={{marginHorizontal: Metrics.padding.normal, marginVertical: Metrics.padding.small}}>
                <Text style={s.short_type}>{title}</Text>
                <View style ={{flexDirection :'row'}}>
                    <View style={{paddingVertical: Metrics.padding.small}}>
                        {image && <Image
                            source={image}
                            resizeMode='contain'
                            style={s.imgPelni}
                        />}
                    </View>
                    <View style={[s.card_frame_short_pelni]}>
                        <Text style={s.short_route}>{route}</Text>
                        <Text style={s.short_date}>{date}</Text>
                        <Text style={s.short_date}>{time}</Text>
                    </View>
                </View>
            </View>
            </Touchable>
        )
    }
}


const s = StyleSheet.create({
    sub_text: {
        color: "#222222",
        fontSize: Scale(13)
    },
    card_pax_content:{
        paddingLeft: Scale(8),
    },
    name:{
        fontSize: Scale(14),
        lineHeight: 24,
        letterSpacing: 0,
        color: "#222222"
    },
    card_pax_frame:{

        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
        flexDirection: 'row',
    },
    short_type: {
        fontSize: Fonts.size.regular,
        color: Colors.blumine,
        marginBottom: Scale(8),
    },
    short_route: {
        fontSize: Fonts.size.medium,
        lineHeight: Fonts.size.medium * 1.5,
    },
    short_date: {
        fontSize: Fonts.size.small,
        lineHeight: Fonts.size.small * 1.5,
    },
    short_train: {
        fontSize: Fonts.size.small,
        lineHeight: Fonts.size.small * 1.5,
        color: Colors.warm_grey
    },
    btn_short_dtl: {
        backgroundColor: Colors.transparent,
        borderColor: Colors.pizzaz,
        borderWidth: Scale(1),
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(2),
        borderRadius: Scale(3),
    },
    dtl_absolute:{
        position: 'absolute',
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Scale(16)

    },
    btn_short_dtl_txt:{
        color: Colors.pizzaz
    },
    card_frame: {
        padding: Metrics.sizePad
    },
    card_frame_short: {
        paddingHorizontal:Scale(16),
        paddingVertical: Scale(8),
    },
    card_row: {
        flexDirection: 'row',

    },
    card_left: {
        flex: 1,
        left:0
    },text_right: {
        textAlign: 'left'
    },
    card_right: {
        alignItems: 'flex-end',
    },
    card_mid:{
        alignItems:'center'
    },
    card_separator_route: {
        width: Scale(10),
        height: Scale(2),
        alignSelf: 'center',
        backgroundColor: Colors.blumine,
        marginRight: Scale(8),
    },
    card_seats_green: {
        color: Colors.apple,
        fontSize: Fonts.size.small
    },
    card_seats_red:{
        color: Colors.red,
        fontSize: Fonts.size.small
    },
    card_route_time: {
        fontSize: Fonts.size.medium,
    },
    card_route_timeV2: {
        fontSize: Fonts.size.small,
    },
    card_route_code: {
        color: Colors.warm_grey,
        fontSize: Fonts.size.tiny
    },
    card_train_name: {
        marginBottom: Scale(4),
    },
    card_routes: {
        marginRight: Scale(8),
        marginBottom: Scale(4),
    },
    card_class: {
        color: Colors.warm_grey,
        fontSize: Fonts.size.small,
    },
    card_stopover: {
        color: Colors.warm_grey
    },
    card_price: {
        alignItems: 'flex-end',
        fontSize: Scale(14),
        color: Colors.pizzaz,
        ...Fonts.bold,
    },
    card_view_detail: {
        color: Colors.blumine
    },
    card_view_info: {
        color: "orange"
    },
    card_view_detail1: {
        color: "green"
    }
})
