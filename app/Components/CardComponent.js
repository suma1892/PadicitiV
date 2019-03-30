import React, { Component } from 'react'
import { TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Animated, Alert, Dimensions, View, Image, StyleSheet, Easng, Platform, TouchableWithoutFeedback } from 'react-native'
import { TextView as Text, Mainstyles, getIcon, getAirlineLogo, Touchable, Button } from '../Components'
import { Metrics, Colors, Fonts } from '../Assets'
import PropTypes from 'prop-types'
import s from './Styles'
import { Scale } from '../Assets/index';
// import CardComponentDetail from '.CardComponentDetail'
// import { Actions } from 'react-native-router-flux';
// import Alert from './Alert';
export default class CardComponent extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        return (
            <View>
                <TouchableComponent style={styles.touchable} onPress={() => this._onPress()}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <View style={styles.View_bgActive}>
                            <Image
                                style={[styles.bgActive]}
                                resizeMethod='scale'
                                source={getIcon(this.props.ic_bg)}/>
                            <Image
                                style={[styles.ic_pulsa]}
                                resizeMode='contain'
                                source={this.props.icons}/>

                        </View>
                        <Text style={styles.flight} ellipsize>{this.props.label}</Text>
                    </View>
                </TouchableComponent>
            </View>
        )
    }
}

export class CardCall extends Component {
    constructor() {
        super();
    }

    render() {
        const {
            numberCard,
            validThru,
            image,
            line
        } = this.props
        return (
            <Touchable onPress={this.props.onPressDelete}>
            <View style ={{marginRight : Metrics.padding.small, marginLeft : Metrics.padding.small,backgroundColor: Colors.white}}>
            <View style={{
                paddingVertical: Metrics.padding.normal,
                flex: 1,
                flexDirection: 'row',
                backgroundColor: Colors.white}}>
            {image && <View style={s.center}>
                            <Image
                                source={image}
                                resizeMode='contain'
                                style={{height : Scale(30), width : Scale(30), tintColor : Colors.gray, marginRight : Scale(16)}}
                            />
                </View>}
                <View style={{ flex: 1 }}>
                    {numberCard &&
                        <View style={styles.lineHeight}>
                            <Text style={s.fontMedium}>{numberCard}</Text>
                        </View>
                    }
                    {validThru && <Text style={s.fontSmallGray}>{validThru}</Text>}
                </View>
                
            </View>
            <View style ={{height :  Scale(2), width : Metrics.screenWidth, backgroundColor : Colors.whitesmoke}}/>
            </View>
            </Touchable>


        )
    }

    
}


export class CardComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            overlay: false,
        }
    }
    _onPress() {
        this.props.onPress();
    }

    _onChoose() {
        this.setState({ overlay: !this.state.overlay })
    }
    render() {
        const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        return (
            <View>
                <Touchable onPress={this.props.onChoose}>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* {this.state.overlay &&
                            <View style={[styles.ContainerChoose,{height : 90, width: 120} ]}>
                        </View>} */}
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <View style={styles.View_bgActive}>
                                <Image
                                    style={[styles.bgActive]}
                                    resizeMethod='scale'
                                    source={getIcon('ic_bg_active')}
                                />
                                <Image
                                    style={[styles.ic_pulsa]}
                                    resizeMode='contain'
                                    source={this.props.icons}
                                />

                            </View>
                            <Text style={styles.flights}>{this.props.label}</Text>
                        </View>

                    </View>
                </Touchable>
            </View>
        )
    }
}


export class CardRecentSearch extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        const {
            destination,
            date,
            guest
        } = this.props

        return (
            <Touchable onPress={() => this._onPress()}>
                <View style={s.cardRecent}>
                    <View style={s.row}>
                        <View style={{ paddingHorizontal: Metrics.padding.tiny }}>
                            <Image
                                source={getIcon('ic_history')}
                                resizeMode='contain'
                                style={[s.ImgRecent]}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={s.destination}>
                                {destination && <Text style={s.valueNormal}>{destination}</Text>}
                                {date && <Text style={s.fontGraytiny}>{date}</Text>}
                                {guest && <Text style={s.fontGraytiny}>{guest} +tamu</Text>}
                            </View>
                        </View>
                        <View style={s.iconNext}>
                            <Image
                                source={getIcon('ic_arrow_right')}
                                style={[s.imgInput]}
                                resizeMode='contain'
                            />
                        </View>

                    </View>
                </View>
            </Touchable>

        )
    }
}

export class CardListHotel extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        const {
            destination,
            hotel_name,
            reviews,
            old_price,
            new_price,
            image,
            stars_count
        } = this.props
        const star = Array.from({ length: stars_count })
        return (
            <Touchable onPress={() => this._onPress()}>
                <View style={s.card_listHotel}>
                    <View style={s.row}>
                        {image && <Image
                            source={{ uri: image }}
                            resizeMode='cover'
                            style={s.imgHotel}
                        />}
                        <View style={[{ flex: 1, paddingLeft: Metrics.padding.tiny }]}>
                            <View style={styles.destination}>
                                {hotel_name && <Text style={[s.valueNormal, s.lineHeight]}>{hotel_name}</Text>}
                                <View style={s.lineHeight}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {star.map((_, i) =>
                                            <Image
                                                key={i}
                                                source={getIcon('ic_star')}
                                                style={s.star}
                                                resizeMode='contain'
                                            />)}
                                    </View>
                                </View>
                                <View style={[{ flexDirection: 'row' }, s.lineHeight]}>
                                    <View style={s.paddingSmall}>
                                        <Image
                                            source={getIcon('ic_place')}
                                            style={s.star}
                                            resizeMode='contain'
                                        />
                                    </View>
                                    {destination && <Text style={[s.valueSmall]}>{destination}</Text>}
                                </View>

                                <View style={[{ flexDirection: 'row' }, s.lineHeight]}>
                                    {/* <Image
                                        source={getIcon('ic_star')}
                                        style={s.star}
                                        resizeMode='contain'
                                    /> */}
                                    {reviews && <Text style={s.lable_two}>{reviews} reviews</Text>}
                                </View>
                                {old_price && <Text style={[s.old_price]}>{old_price}</Text>}
                                {new_price && <Text style={s.new_price}>{new_price}</Text>}
                            </View>
                            {/* </View> */}
                        </View>
                    </View>
                </View>
            </Touchable>

        )
    }
}

export class NearPlace extends Component {
    constructor() {
        super();
    }

    render() {
        const {
            id,
            destination_name,
            distance
        } = this.props
        const star = Array.from({ length: 3 })
        return (

            <View style={s.card_nearPlace}>
                <View style={[s.row]}>
                    <View style={s.circle_number}>
                        {id && <Text style={[s.valueNormal, { color: 'white' }]}>{id}</Text>}
                    </View>
                    <View style={s.paddNormal}>
                        {destination_name && <Text style={s.valueNormal}>{destination_name}</Text>}
                        {distance && <Text style={s.valueNormalGray}>{distance}</Text>}
                    </View>
                </View>
            </View>

        )
    }
}


export class CardReviewHotel extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        const {
            type,
            guest,
            add,
            old_price,
            new_price,
            image
        } = this.props
        const star = Array.from({ length: 3 })
        return (

            <View style={s.card_listHotel}>
                <Touchable onPress={() => this._onPress()}>
                    <View style={s.row}>
                        {image && <Image
                            source={{ uri: image }}
                            resizeMode='cover'
                            style={s.imgHotel}
                        />}
                        <View style={[{ flex: 1, paddingLeft: Metrics.padding.tiny }]}>

                            <View style={styles.destination}>
                                {type && <Text style={[s.valueNormalBold]}>{type}</Text>}
                                {guest && <Text style={s.fontGrayNormal}>Jumlah Tamu {guest} orang</Text>}
                                {add && <Text style={s.addfasilities}>{add}</Text>}
                                {/* <Touchable onPress={() => this._onPress()}>
                                    <View style={styles.padding}>
                                        <Text style={s.notice}>Kebijakan Pembatan Berlaku</Text>
                                    </View>
                                </Touchable> */}
                                {old_price && <Text style={[s.old_price]}>{old_price}</Text>}
                                {new_price && <Text style={s.new_price}>{new_price}</Text>}

                                {/* <Button style ={{marginBottom : Scale(16)}}
                                onPress={this.props.onPress}>
                                    Pesan
                    </Button> */}
                            </View>
                        </View>

                    </View>
                </Touchable>
            </View>


        )
    }
}


export class CardCreditCard extends Component {
    constructor() {
        super();
    }

    _onPress() {
        this.props.onPressDelete();
    }
    render() {
        const {
            numberCard,
            validThru,
            image,
        } = this.props
        return (
            <View style={styles.cardCredit}>
                <View style={{ flex: 1 }}>
                    {image &&
                        <View style={styles.paddDelete}>
                            <Image
                                source={{ uri: image }}
                                resizeMode='contain'
                                style={styles.imgCard}
                            />
                        </View>
                    }
                    {numberCard &&
                        <View style={styles.lineHeight}>
                            <Text style={s.fontMedium}>{numberCard}</Text>
                        </View>
                    }
                    {validThru && <Text style={s.fontSmallGray}>Valid Thru {validThru}</Text>}
                </View>
                <View style={s.center}>
                    <Touchable onPress={this._onPress()}>
                        <View style={s.close}>
                            <Text style={s.itemClose}>DELETE</Text>
                        </View>
                    </Touchable>
                </View>
            </View>


        )
    }
}


export class CardPessanger extends Component {
    constructor() {
        super();
      }
      
    _onPress() {
        this.props.onPressEdit();
        // Alert.alert("haloo");
        // Actions.CardComponentDetail({text: this.state.text });
    }

   
    render() {
        const {
            name
        } = this.props
        return (
            <View style={styles.cardPass}>
                <View style={{ flex: 1 }}>
                    {name && <Text style={styles.fontRegular}>{name}</Text>}
                </View>
                <View style={s.center}>
                    <TouchableOpacity onPress={this._onPress()}>
                    <View style={s.close}>
                    <Text style={s.itemClose}>EDIT12</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


        )
    }
}


export class CardMyTrip extends Component {
    constructor() {
        super();
    }

    _onPress() {
        this.props.onPressEdit();
    }

    Colors_Status(status) {
        switch (status.toLowerCase()) {
            case 'y':
                return '#25b80e'
            case 'n':
                return '#ffff'
            case 'x':
                return '#D17A08'
            case 'c':
                return '#D17A08'
            case 'p':
                return '#0000AA'
            case 'f':
                return '#DD0000'
            case 'fp':
                return '#DD0000'
            case 'fb':
                return '#DD0000'
            default:
                return '#DD0000'
        }
    }

    TXT_Status(status) {
        switch (status.toLowerCase()) {
            case 'y':
                return 'PAID'
            case 'n':
                return 'PAYMENT LIMIT'
            case 'x':
                return 'EXPIRED'
            case 'c':
                return 'CANCEL'
            case 'p':
                return 'ON PROGRESS'
            case 'f':
                return 'PAYMENT FAILED'
            case 'fp':
                return 'PAYMENT FAILED'
            case 'fb':
                return 'ON PROGRESS'
            default:
                return 'WAITING FOR PAYMENT'
        }
    }

    getImage(nameArmada) {
        switch (nameArmada) {
            case "Lion Air":
                return getAirlineLogo('sl')
            case "Garuda":
                return getAirlineLogo('ga')

        }
    }

    render() {
        const {
            date,
            type,
            img,
            nameArmada,
            img_maskapai,
            checkin_time,
            from,
            airport_from,
            checkout_time,
            to,
            airport_to,
            status,
            trn_code,
            transactiontime
        } = this.props
        return (
            <Touchable onPress={this.props.onPress}>
                <View style={styles.v_history}>
                    {img &&<View style={styles.center}>
                        <View style={styles.imgContainer}>
                             <Image
                                source={img}
                                resizeMode='contain'
                                style={styles.imghistory}
                            />
                        </View>
                    </View>}
                    <View style={[styles.detail]}>
                        {date && <Text style={styles.date}>{date}</Text>}
                        {trn_code && <Text style={{fontSize : Scale(12)}}>{trn_code}</Text>}
                        <View style={styles.center_}>
                            {img_maskapai && <Image
                                source={img_maskapai}
                                resizeMode='contain'
                                style={styles.imgArmada}
                            />}
                            <View>
                                <Text style={{ color: Colors.gray, width: Scale(200) }}>{nameArmada}</Text>
                            </View>
                        </View>
                        <View style={styles.padding}>
                            <Text style={styles.dateFlight}>{checkin_time}  {from}</Text>
                            {airport_from && <Text style={styles.textAirport}>{airport_from}</Text>}
                        </View>
                        <View style={styles.padding}>
                            <Text style={styles.dateFlight}>{checkout_time}  {to}</Text>
                            {airport_to && <Text style={styles.textAirport}>{airport_to}</Text>}
                        </View>
                        <View style={[styles.v_history, { padding : status.toLowerCase() === 'n' ? Scale(8) : 0,width: Metrics.screenWidth - Scale(125), height : Scale(30), justifyContent : null,alignItems:  'center', borderRadius: status.toLowerCase() === 'n' ? Scale(6) : 0 ,borderColor : status.toLowerCase() === 'n' ? '#4778fb' : null, borderBottomWidth: 0, borderTopColor: null, borderTopWidth: 0 , backgroundColor : status.toLowerCase() === 'n' ? '#4778fb' : null}]}>
                            {/* <Text style={[styles.textAirport, , {fontSize : Scale(16)}]}>{'Tiket : '}</Text> */}
                            <Text style={[styles.textAirport, { fontSize: Scale(12), color: this.Colors_Status(status) }]}>{this.TXT_Status(status)} {status.toLowerCase() === 'n' ? transactiontime : null}</Text>
                        </View>
                    </View>

                    <View style={{
        width: Metrics.icon.normal,
        overflow: 'hidden',
        // backgroundColor: Colors.blue,
        // borderRadius: (Metrics.icon.medium * 1.3) / 2,
        padding: Metrics.padding.normal,
        // marginVertical: Metrics.padding.small,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',}}>
                            { <Image
                                source={getIcon('ic_arrow_right')}
                                resizeMode='contain'
                                style={[styles.imghistory,{tintColor: Colors.tangerine}]}
                            />}
                        </View>

                </View>
            </Touchable>
        )
    }
}

export class CardPromos extends Component {
    constructor() {
        super();
    }

    _onPress() {
        this.props.onPressEdit();
    }
    render() {
        const {
            imgPromos,
            title,
        } = this.props
        return (
            <Touchable onPress={this.props.onPress}>
                <View style={styles.v_promos}>

                    {imgPromos && <Image
                        source={imgPromos}
                        resizeMode='cover'
                        style={styles.imgPromos}
                    />}
                    <View style={{ height: Metrics.navBot, backgroundColor: Colors.white, borderBottomLeftRadius: Metrics.padding.small, borderBottomRightRadius: Metrics.padding.small, paddingHorizontal: Metrics.padding.medium, paddingTop: Metrics.padding.small }}>
                        <Text style={{ color: Colors.black, marginTop: Metrics.padding.small }}>{title ? title : '-'}</Text>
                    </View>
                </View>
            </Touchable>
        )
    }
}


export class CardModalDate extends Component {
    constructor() {
        super();
    }

    render() {
        const {
            dayName,
            date,
            month,
            price,
            overlay,
            onPress
        } = this.props
        return (
            <Touchable onPress={onPress}>
                <View style={[styles.containerDate, overlay && {borderColor : Colors.tangerine} ]}>
                    {dayName && <Text style={[styles.dayName , overlay && {color : Colors.tangerine}]}>{dayName.slice(0,3)}</Text>}
                    {date && <Text  style={[styles.date, overlay && {color : Colors.tangerine}]}>{date.slice(0,3)}</Text>}
                    {month && <Text style={[styles.month, overlay && {color : Colors.tangerine}]}>{month.slice(0,3)}</Text>}
                    {price && <Text style={[styles.price, overlay && {color : Colors.tangerine}]}>{price}</Text>}
                </View>
            </Touchable>
        )
    }
}

var styles = StyleSheet.create({
    date:{
        fontSize: Metrics.font.regular,
        fontFamily: Fonts.bold.fontFamily,
    },
    month:{
        fontSize: Metrics.font.small
    },
    price:{
        fontSize: Metrics.font.small,
        fontFamily: Fonts.bold.fontFamily,
        marginTop: Metrics.padding.small
    },
    dayName:{
        fontSize: Metrics.font.regular
    },
    containerDate:{
        //height: Metrics.icon.large*3,
        //width: Metrics.icon.large*2,
        backgroundColor: Colors.white,
        paddingVertical: Metrics.padding.small,
        paddingHorizontal: Metrics.icon.small,
        borderWidth : 2,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius :6
        
    },
    ContainerChoose: {
        position: 'absolute',
        height: Metrics.icon.normal * 2.4,
        width: Metrics.icon.normal * 2.4,
        borderWidth: Scale(2),
        borderColor: Colors.tangerine,
        borderRadius: Scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textAirport: {
        color: Colors.gray
    },
    padding: {
        marginBottom: Metrics.padding.tiny,
    },
    center_: {
        //justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        //marginHorizontal: Metrics.padding.medium,
        borderRightColor: Colors.border,
        borderRightWidth: 2,
        width: Metrics.screen.width / 5
    },
    dateFlight: {
        fontFamily: Fonts.regular.fontFamily,
        fontWeight: Fonts.regular.fontWeight,
        fontSize: Fonts.size.regular,
    },
    imgArmada: {
        height: Metrics.icon.normal,
        width: Metrics.icon.normal,
        marginRight: Metrics.padding.small
    },
    imgPromos: {
        height: Metrics.screenHeight / 4,
        resizeMode: 'stretch',
        borderTopLeftRadius: Metrics.padding.small,
        borderTopRightRadius: Metrics.padding.small
    },
    date: {
        fontFamily: Fonts.bold.fontFamily,
        fontWeight: Fonts.bold.fontWeight,
        fontSize: Fonts.size.regular,


    },
    detail: {
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small,
        justifyContent: 'center',
        flex: 1,
    },
    imgContainer: {
        height: Metrics.icon.normal,
        width: Metrics.icon.normal,
        overflow: 'hidden',
        backgroundColor: Colors.blue,
        borderRadius: (Metrics.icon.medium * 1.3) / 2,
        padding: Metrics.padding.small,
        marginVertical: Metrics.padding.small,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imghistory: {
        width: Metrics.icon.tiny,
        height: Metrics.icon.tiny,
        tintColor: Colors.white
    },
    v_history: {
        flex: 1,
        flexDirection: 'row',
        // borderBottomColor: Colors.border,
        // borderBottomWidth: 2,
        // borderTopColor: Colors.border,
        // borderTopWidth: 2,

    },
    v_promos: {
        flex: 1,
        borderRadius: 10,
        marginRight: Metrics.padding.normal,
        marginLeft: Metrics.padding.normal,
        marginTop: Metrics.padding.normal,

    },
    fontRegular: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.medium,
    },
    cardPass: {
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.normal,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white
    },
    lineHeight: {
        marginVertical: Metrics.padding.small,
    },
    imgCard: {
        width: Metrics.icon.small * 1.2,
        height: Metrics.icon.small * 1.2
    },
    paddDelete: {
        width: Metrics.icon.large * .7,
        borderWidth: Metrics.border,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    cardCredit: {
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.normal,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.white
    },
    padding: {
        paddingTop: Metrics.padding.tiny,
        paddingBottom: Metrics.padding.tiny / 2
    },
    touchable: {
        flex: 1
    },
    bgActive: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Scale(60),
        height: Scale(60),

    },
    View_bgActive: {
        marginTop: Scale(8),
        marginRight: Scale(8),
        marginLeft: Scale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ic_pulsa: {
        width: 19,
        height: 28,
        position: 'absolute',
    },
    bgActiveText: {
        marginRight: Scale(16),
        marginLeft: Scale(16),
        marginTop: Scale(4),
        justifyContent: 'center',
        alignItems: 'center',
        width: Scale(64),
    },
    flight: {
        fontSize: Scale(9),
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: 'center',
        color: "#000000"
    },
    flights: {
        fontSize: Scale(11),
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: 'center',
        color: "#000000",
        paddingBottom: Metrics.padding.tiny,
    },
})