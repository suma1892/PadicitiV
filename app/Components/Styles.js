import { StyleSheet } from 'react-native';
import { Colors,
    Metrics,
    Scale, 
    getIcon,
    Fonts, 
    } from '../Assets'
import { _OS } from './_OS'
// font :14 -Black
const fontGrayNormal ={
    color: Colors.benam,
    fontSize : Fonts.size.small
}

// font :14 - Gray
const fontGraysmall ={
    color: Colors.warm_grey,
    fontSize : Fonts.size.small
}

//font : 12 -Gray
const fontGraytiny ={
    color: Colors.gray,
    fontSize : Fonts.size.small
} 

const shadow = {
        shadowColor                 : '#000000',
        shadowOffset                : { width: 0, height: 1},
        shadowOpacity               : 0.2,
        shadowRadius                : 1,
        elevation                   : 2,
}
const divider = {
    borderBottomColor : Colors.borderColor,
    borderBottomWidth : Metrics.border
}

const fontRegular= {
        fontFamily : Fonts.regular.fontFamily,
        fontSize : Fonts.size.large,
}

const fontRegularGray= {
    fontFamily : Fonts.regular.fontFamily,
    fontSize : Fonts.size.large,
    color : Colors.warm_grey
}

const fontMedium= {
    fontFamily : Fonts.regular.fontFamily,
    fontSize : Fonts.size.large,
}

const fontSmall = {
    fontFamily : Fonts.regular.fontFamily,
    fontSize : Fonts.size.regular,
}
const fontSmallGray = {
    fontFamily : Fonts.regular.fontFamily,
    fontSize : Fonts.size.regular,
    color : Colors.warm_grey
}
export default StyleSheet.create({
    fontRegularGray:{
        ...fontRegularGray
    },
    itemAdd:{
        fontFamily : Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize : Fonts.size.small,
        color : Colors.white
    },
    addContainer:{
        alignItems          : 'center',
        left                : 0,
        marginHorizontal    :Metrics.padding.small,
        paddingHorizontal : Metrics.padding.small,
        paddingVertical : Metrics.padding.tiny/2,
        borderWidth : 2,
        borderColor : Colors.tangerine,
        borderRadius :6,
        backgroundColor :Colors.tangerine
    },
    fontMedium:{
        ...fontMedium
    },
    center:{
        justifyContent      : 'center',
        alignItems          : 'center'
    },
    fontSmallGray:{
        ...fontSmallGray
    },
    fontSmall :{
        ...fontSmall
    },
    imgCheckbox:{
        maxWidth            : Metrics.icon.tiny*0.8,
        maxHeight           : Metrics.icon.tiny*0.8,
        //tintColor           : Colors.black
    },
    checkbox:{
        borderRadius        : 5,
        borderColor         : Colors.warm_grey,
        borderWidth         : 2,
        justifyContent      : 'center',
        alignItems          : 'center',
        width               : Metrics.icon.small*0.8,
        height              : Metrics.icon.small*0.8,
    },
    itemField:{
        flex                : 1,
        flexDirection       : 'row',
        justifyContent      : 'center',
        alignItems          : 'center'
    },
    itemView:{
        paddingHorizontal: Metrics.padding.normal,
        backgroundColor     : Colors.white,
        flex                :1

    },
    backgroundCondition:{
        backgroundColor: Colors.yellow,
        paddingHorizontal : Metrics.padding.normal,
        paddingVertical : Metrics.padding.small,
        //marginRight : Metrics.padding.normal
    },
    valueCalendar:{
        height: Metrics.icon.normalSmall,
        fontFamily : Fonts.regular.fontFamily,
        fontSize : Fonts.size.medium,
        color: '#222222'
    },
    titleLable: {
        fontFamily: Fonts.regular.fontFamily,
        marginTop: Metrics.padding.normal,
        fontSize: Fonts.size.medium,
        color: Colors.warm_grey
    },
    title_itemField:{
            fontFamily: Fonts.regular.fontFamily,
            fontSize: Fonts.size.medium,
            bottom: Metrics.padding.small,
            color: Colors.blue
    },
    View_itemField:{
        backgroundColor: Colors.white,
        padding: Metrics.padding.normal,
        marginTop: Metrics.padding.small,
    },
    inputText:{
            flex: 1,
            padding         : 0,
            margin          : 0,
            marginVertical  : Metrics.padding.tiny,
            color           : Colors.black,
            fontSize        : Fonts.size.medium,
            borderWidth :Metrics.border,
            borderColor : Colors.borderColor,
            height : Metrics.icon.normal,
            paddingHorizontal: Metrics.padding.small,
            borderRadius : 6
    },
    itemClose:{
        fontFamily : Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize : Fonts.size.small,
        color : Colors.tangerine
    },
    close:{
        alignItems          : 'center',
        left                : 0,
        marginHorizontal    :Metrics.padding.small,
        paddingHorizontal : Metrics.padding.small,
        paddingVertical : Metrics.padding.tiny/2,
        borderWidth : 2,
        borderColor : Colors.tangerine,
        borderRadius :6
    },
    textError:{
        fontStyle       : 'italic',
        color           : Colors.pastel_red,
    },
    inputTexContainer:{
       
        justifyContent : 'center'
    },
    textDot :{
        fontFamily : Fonts.regular.fontFamily,
        fontSize : Fonts.size.regular,
        color : Colors.warm_grey
    },
    dotDocument:{
        fontWeight: 'bold',
        fontSize : Fonts.size.medium,
        color : Colors.warm_grey,
        paddingRight : Metrics.padding.tiny
    },
    fontBlue :{
        ...fontRegular,
        color : 'blue'
    },
    notice:{
        fontFamily : Fonts.light.fontFamily,
        color: Colors.tangerine
    },
    addfasilities:{
        color: Colors.apple,
        fontSize : Fonts.size.small
    },
    valueNormalBold :{
        fontFamily: Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize: Fonts.size.regular,
        letterSpacing: 0,
        textAlign: "left",
        color : Colors.boldAvenir
    },
    centerItem:{
        justifyContent :'center',
        alignItems :'center'
    },
    valueNormalGray :{
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.regular,
        color : Colors.benam
    },
    paddNormal:{
        paddingHorizontal : Metrics.padding.normal
    },
    circle_number:{
        marginTop : Metrics.padding.tiny,
        width : Metrics.icon.tiny*1.2,
        height : Metrics.icon.tiny*1.2,
        borderRadius :(Metrics.icon.tiny*1.2)/2,
        backgroundColor : 'green',
        justifyContent :'center',
        alignItems : 'center'
    },
    card_nearPlace:{
        height  : Metrics.icon.medium,
        paddingVertical :  Metrics.padding.small,
        paddingHorizontal: Metrics.padding.normal,
   
    },
  imgMap:{
    height  : (Metrics.screen.width / 2.3),
    width   : Metrics.screen.width,
},
    img_hotel:{
        height                  : (Metrics.screen.width / 1.7),
        width                   : Metrics.screen.width,
    },
    textCheck:{
        fontSize : Fonts.size.regular
     },
     cardcheck:{
         ...divider,
       height : Metrics.icon.normal*1.2,
       width : Metrics.screen.width ,
       alignItems: 'center',
       justifyContent :'center',
       
     },
     container_check:{
        height : Metrics.icon.normal*1.2,
       width : Metrics.screen.width/7,
       position    : 'absolute',
       alignItems: 'flex-end',
       justifyContent :'center',
       marginHorizontal : Metrics.padding.normal,
       alignSelf: 'flex-end',  
     },
     checklist:{
         height : Metrics.icon.small,
         width : Metrics.icon.small,
         right: Metrics.padding.normal,
         
     },
   main: {
       flexDirection: 'row',
       marginHorizontal: Metrics.padding.normal,
       paddingVertical: Metrics.padding.small,
   },
   labelCheck:{
       flex: 1,
       justifyContent: 'center',
       height : Metrics.icon.normal
   },
   active:{
       backgroundColor : 'red',
       flex: 1,
       margin: 2 + StyleSheet.hairlineWidth,
       borderRadius: Metrics.padding.small
   },
   subtext:{
       fontSize: Metrics.font.medium,
       color: Colors.placeholder
   },
    section:{
        paddingBottom : Metrics.padding.tiny
    },
    headerText:{
        fontFamily : Fonts.bold.fontFamily,
        fontWeight : Fonts.bold.fontWeight,
        fontSize : Fonts.size.medium,
        color : Colors.boldAvenir
    },
    divider :{
        ...divider
    },
    valueSmall :{
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.regular,
        color: Colors.boldAvenir
    },
    lineHeight :{
        paddingBottom : Metrics.padding.tiny/1
    },
    lineHeightFix :{
        paddingVertical : Metrics.padding.tiny
    },
    card_listHotel:{
        height  : Metrics.icon.medium*3,
        paddingVertical :  Metrics.padding.small,
        paddingHorizontal: Metrics.padding.normal,
        borderBottomColor : Colors.borderColor,
        borderBottomWidth : Metrics.border,
    },
    iconNext:{
        justifyContent :'center'
    },
    destination:{
        paddingHorizontal : Metrics.padding.small,
        flex:1,
        justifyContent:'center'
    },
    ImgRecent:{
        height : Metrics.icon.normalSmall,
        width : Metrics.icon.normalSmall,
        paddingHorizontal : Metrics.padding.small,
        marginLeft : Metrics.padding.small,
        paddingVertical : Metrics.padding.normal
    },
    cardRecent:{
        flex:1,
        justifyContent:'center',
        minHeight  : Metrics.icon.medium,
        marginVertical: Metrics.padding.tiny,
        borderWidth : Metrics.border,
        borderColor : '#dddddd',
        paddingVertical : Metrics.padding.small,
    },
    old_price :{
        fontSize :Fonts.size.small,
        color : Colors.darkgray,
        textDecorationLine : 'line-through',
        textDecorationStyle : 'solid'
    },
    new_price :{
        fontSize :Fonts.size.regular,
        color : Colors.tangerine
    },
    starBig:{
        height : Metrics.icon.tiny,
        width : Metrics.icon.tiny,
        marginRight: Metrics.padding.tiny
    },
    star:{
        height : Metrics.icon.tiny*.7,
        width : Metrics.icon.tiny*.7
    },
    starpad:{
        height : Metrics.icon.tiny*.7,
        width : Metrics.icon.tiny*.7,
        
    },
    paddingSmall :{
        paddingRight : Metrics.padding.tiny/1,
        paddingTop : Metrics.padding.tiny/1
    },
    imgHotel:{
        height : Metrics.icon.large*1.9,
        width : Metrics.icon.large*1.8,
        marginRight : Metrics.padding.small,
    },
    sectionTitle: {
        color: '#204a8b',
        fontSize: Fonts.size.regular,
        opacity: 0.8,
    },
    destination:{
        paddingHorizontal : Metrics.padding.small,
        flex:1,
        justifyContent:'center'
    },
    ImgRecent:{
        height : Metrics.icon.small,
        width : Metrics.icon.small,
        padding : Metrics.padding.tiny
    },
    rectangelSide:{
        height: Metrics.icon.normal,
        borderRightColor : Colors.warm_grey,
        borderRightWidth :Metrics.border
   },
    lable_one: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.regular,
        color: Colors.black
    },
    lable_two: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.small,
        color: Colors.warm_grey
    },
    sectionContainerItem: {
        paddingHorizontal : Metrics.padding.small,
        height: Metrics.icon.normal*1.4,
        justifyContent: 'center',
        borderBottomWidth: Metrics.border,
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        paddingHorizontal : Metrics.padding.small,
        height: Metrics.icon.normal,
        justifyContent: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: '#f2f2f2',
    },
    toolbar:{
        left              : 0,
        right             : 0,
        top               : 0,
        zIndex            : 3 ,
      },
    valueNormal :{
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.regular,
        letterSpacing: 0,
        textAlign: "left",
    },
    fontGrayNormal:{
        ...fontGrayNormal
    },
    fontGraysmall:{
        ...fontGraysmall
    },
    fontGraytiny:{
        ...fontGraytiny
    },
    lableNumber: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize : Fonts.size.regular,
        marginHorizontal : Metrics.padding.normal,
        alignItems: 'center',
        textAlign: "left",
        color: Colors.boldAvenir
    },
    rectangel:{
        //height: Metrics.icon.normal,
        paddingVertical: Metrics.padding.tiny,
        borderRadius: 4,
        borderStyle: "solid",
        borderColor : Colors.borderColor,
        borderWidth :2
   },
    valueInput:{
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.medium,
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.boldAvenir
    },
    placeholder:{
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.medium,
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.warm_grey
    },
    imgInput :{
        marginHorizontal : Metrics.padding.small,
        resizeMode: 'contain',
        width: Metrics.icon.small,
        height: Metrics.icon.small
    },
    rowInput:{
        flexDirection :'row',
        alignItems: 'center'
    },
    marginNormal:{
        marginHorizontal : Metrics.padding.normal,
        marginVertical  : Metrics.padding.small
    },
    label: {
        fontFamily: Fonts.regular.fontFamily,
        color: Colors.slate_gray,
        //marginBottom: Scale(4),
        fontSize: Fonts.size.regular,
        letterSpacing: 0,
        textAlign: "left",
    },
    toolbar:{
        left              : 0,
        right             : 0,
        top               : 0,
        zIndex            : 3 ,
      },
    row:{
        flex:1,
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    
    
});