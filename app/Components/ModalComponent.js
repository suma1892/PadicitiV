import React, { Component }         from 'react'
import PropTypes                    from 'prop-types'
import { Image, 
         View,
         StyleSheet,
         ScrollView,
         TouchableWithoutFeedback,
         TouchableNativeFeedback }  from "react-native"
import { Scale, Colors, getIcon, Fonts, Metrics } from '../Assets'
import Text from './TextView'
import Touchable from './Touchable'
import { _OS } from './_OS';
import Modal                        from "react-native-modal";
//import ImageCropPicker from 'react-native-image-crop-picker';
//import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

//const Touchable = _OS(TouchableWithoutFeedback, TouchableNativeFeedback)


export default class ModalComponent extends Component {
    static propTypes = {
        active              : PropTypes.bool.isRequired,
        children            : PropTypes.node,
        type                : PropTypes.oneOf(["context", "filter", "fullscreen", "modal", "message", 'media', 'document','confirm','more', null, '']),
        onClose             : PropTypes.func.isRequired,
        onSubmit            : PropTypes.func,
        navbar              : PropTypes.bool
      };
    
      static defaultProps = {
        active              : false,
        type                : "modal",
        navbar              : false
      };

    constructor(props) {
        super(props);
        this.state = {
            active : this.props.active,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            active: newProps.active
        })   
    }


    getTypeStyle=() => {
        switch (this.props.type) {
            case 'centext':
                return styles.context
            case 'filter':
                return styles.filter
            case 'fullscreen':
                return styles.fullscreen
            case 'modal':
                return styles.modal
            case 'message':
                return styles.message
            case 'media':
                return styles.media
            case 'document':
                return styles.media
            case 'confirm':
                return styles.modal
            case 'more':
                return styles.fullmore
            
        }
    }

    setAction=(press) => {
        if (press === 'close') {
            this.props.onClose(false)
        } else {
            this.props.onSubmit(function () { this.props.onClose(false) })
        }
    }
    _renderIcon=(icon, press, style) => (
            <Touchable onPress={() => this.setAction(press)}>
                <View style={styles.iconPress}>
                    <Image
                        style={[styles.icon, style]}
                        resizeMode={'contain'}
                        source={icon}/>
                </View>
            </Touchable>
        )

    _renderTypeHeader=(type, title) => {
        var frameTitle, 
            viewTitle, 
            textTitle, 
            iconStyle  = {}
        switch (type) {
            case 'filter':
                frameTitle  = { backgroundColor: Colors.red }
                viewTitle   = {}
                textTitle   = { color:Colors.white }
                iconStyle   = { tintColor: Colors.white }
                break
            case 'modal':
                frameTitle  = {}
                viewTitle   = {}
                textTitle   = styles.titleWhite
                iconStyle   = {}
                break
            case 'media':
                frameTitle = {}
                viewTitle = {}
                textTitle = styles.titleWhite
                iconStyle = {}
                break
            case 'confirm':
                frameTitle = {}
                viewTitle = {}
                textTitle = styles.titleWhite
                iconStyle = {}
                break
            case 'document':
                frameTitle = {}
                viewTitle = {}
                textTitle = styles.titleWhite
                iconStyle = {}
                break
            case 'fullscreen':
                frameTitle  = { backgroundColor: Colors.red, height:Metrics.headerModal }
                viewTitle   = {}
                textTitle   = { color:Colors.white, textAlign: 'center' }
                iconStyle   = { tintColor: Colors.white }
                break
            case 'more':
                frameTitle  = {}
                viewTitle   = {}
                textTitle   = {}
                iconStyle   = {}
                break
            case 'context':
                frameTitle  = { backgroundColor: Colors.red, height:Metrics.headerModal }
                viewTitle   = {}
                textTitle   = { color:Colors.white }
                iconStyle   = { tintColor: Colors.white }
                break
        }
        return (
            <View style={[styles.header, frameTitle]}>
                {(this.props.type === 'filter' || this.props.type === 'fullscreen') && this.props.onClose && this._renderIcon(getIcon('ic_arrow_back'), 'close', iconStyle)}
                <View style={[styles.titleView, viewTitle]}>
                    <Text boldQuicksand style={[styles.titleText, textTitle]}>{title}</Text>
                </View>
                {(this.props.type === 'filter' || this.props.type === 'fullscreen') && this.props.onSubmit && this._renderIcon(getIcon('ic_arrow_back'), 'submit', iconStyle)}
                {(this.props.type !== 'filter' && this.props.type !== 'fullscreen') && this.props.onClose && this._renderIcon(getIcon('ic_arrow_back'), 'close', iconStyle)}
            </View>
        )
    }

    // _selectSourceImage = (type) => {
    //     if (type === 'camera') {
    //         ImageCropPicker.openCamera({}).then((image) => {
    //             let data = { ...image, label: { id: null, title: null } }
    //             this.props.onSubmit( data, () => { this.props.onClose(false) })
    //         })
    //     } else {
    //         ImageCropPicker.openPicker({}).then((image) => {
    //             let data = { ...image, label: { id: null, title: null } }
    //             this.props.onSubmit( data, () => { this.props.onClose(false) })
    //         })
    //     }
    // }

    // _selectSourceDocument = (type) => {
    //     if (type === 'camera') {
    //         ImageCropPicker.openCamera({}).then((image) => {
    //             let data = { ...image, label: { id: null, title: null } }
    //             this.props.onSubmit( data, () => { this.props.onClose(false) })
    //         })
    //     } else {
    //         DocumentPicker.show({filetype: [DocumentPickerUtil.allFiles()],}, (error, res) => {
    //             this.props.onSubmit( res, () => { this.props.onClose(false) })
    //         })
    //     }
    // }


    render() {   
        var prop  = this.props
        var backdropColor, 
            animationIn, 
            animationOut, 
            context
        switch (prop.type) {
            case 'context':
                backdropColor = 'transparent'
                animationIn   = 'fadeIn'
                animationOut  = 'fadeOut'
                context       = true
                break
            default:
                backdropColor = Colors.overlay
                animationIn   = 'slideInUp'
                animationOut  = 'slideOutDown'
                context       = false
                break
        } 
            
        if (prop.type === 'more') {
            return (
                <Modal 
                    style               = {[{ padding:0, margin:0, marginBottom: this.props.navbar ? Metrics.navBot : 0 }, this.props.style]}
                    animationIn         = {animationIn}
                    animationOut        = {animationOut}
                    animationInTiming   = {300}
                    animationOutTiming  = {600}
                    isVisible           = {this.state.active}
                    onBackButtonPress   = {() => this.props.onClose(false)}
                    onBackdropPress     = {() => this.props.onClose(false)}
                    backdropColor       = {backdropColor}>
                    <View style={[styles.frame, this.getTypeStyle(), this.props.style]}>
                        <View >
                            {prop.children}
                        </View>
                    </View>
                </Modal>
            )
        } 
        else{
            return (
                <Modal 
                style               = {{ padding:0, margin:0, marginBottom: this.props.navbar ? Metrics.navBot : 0 }}
                animationIn         = {animationIn}
                animationOut        = {animationOut}
                animationInTiming   = {300}
                animationOutTiming  = {600}
                isVisible           = {this.state.active}
                onBackButtonPress   = {() => this.props.onClose(false)}
                onBackdropPress     = {() => this.props.onClose(false)}
                backdropColor       = {backdropColor}>
                {context ?
                    prop.children :
                    <View style={[styles.frame, this.getTypeStyle()]}>
                        {this.props.type !== 'confirm' && this._renderTypeHeader(prop.type, prop.title)}
                            <ScrollView 
                                keyboardShouldPersistTaps='always'
                                alwaysBounceHorizontal={false}
                                alwaysBounceVertical={false}
                                style={[styles.content]}> 
                                {prop.children}
                                
                                {prop.type === 'confirm' && <View style={styles.confirm_section}>
                                    <View style={{flex:1}} />
                                    <Touchable onPress={()=> this.props.onClose(false)}>
                                        <View style={styles.btn_confrim}><Text  style={[styles.text_confrim]}>TIDAK</Text></View></Touchable>
                                    <Touchable onPress={()=> { this.props.onClose(false); this.props.onConfirm() }}>
                                        <View style={styles.btn_confrim}><Text style={[styles.text_confrim, {color: Colors.red}]}>YA</Text></View></Touchable>
                                </View>}
                            </ScrollView>
                    </View>
                }
            </Modal>
            )
        }
    }
}


const styles = StyleSheet.create({
    fullmore:{
        margin                  : 0,
        position                : 'absolute',
        //top                     : Metrics.headerModal,
        left                    : 0,
        right                   : 0,
        bottom                  : 0,
        backgroundColor         : Colors.white,
        maxHeight               : Metrics.screenHeight - Metrics.headerModal,
    },
    confirm_section:{
        flexDirection           : 'row',
        paddingHorizontal       : Metrics.sizePad / 2,
        paddingBottom           : Metrics.sizePad,
    },
    btn_confrim:{
        paddingHorizontal       : Metrics.sizePad,
        paddingVertical         : Metrics.sizePad / 2,
        marginHorizontal        : Metrics.sizePad / 2,  
        minWidth                : Metrics.sizePad * 5,
        backgroundColor         : Colors.white,
        borderRadius            : 2
    },
    text_confrim:{
        flex                    :1,
        textAlign               :'center',
        color                   : Colors.gray
    },
    itemMedia:{
        padding                 : Metrics.sizePad,
        alignItems              : 'center',
        borderBottomWidth       : 1,
        borderBottomColor       : Colors.whitesmoke,
    },
    frame:{
        padding                 : 0,
    },
    content:{
        padding                 : 0,
        margin                  : 0,
    },
    modal:{
        marginHorizontal        : Metrics.screenWidth * 0.05,
        maxHeight               : Metrics.screenHeight * .9,
        backgroundColor         : Colors.white,
        borderRadius            : 2,
        overflow                : 'hidden',
        marginTop               : _OS(20,0)
    },
    media:{
        marginHorizontal        : Metrics.screenWidth  * 0.2,
        maxHeight               : Metrics.screenHeight * .9,
        backgroundColor         : Colors.white,
        borderRadius            : 3,
        overflow                : 'hidden',
        marginTop               : Metrics.sizePad / 2,
    },
    filter:{
        backgroundColor         : Colors.white,
        //maxHeight               : Metrics.screenHeight - _OS(20,Metrics.statusBar),
        overflow                : 'hidden',
        position                : 'absolute',
        bottom                  : 0,
        left                    : 0,
        right                   : 0,
    },
    fullscreen:{
        margin                  : 0,
        position                : 'absolute',
        top                     : _OS(20,0),
        left                    : 0,
        right                   : 0,
        bottom                  : 0,
        //backgroundColor         : Colors.white,
        maxHeight               : Metrics.screenHeight - _OS(20,0),
    },
    icon:{
        // height                  : Metrics.icons.tiny,
        // width                   : Metrics.icons.tiny,
        // tintColor               : Colors.gunmetal
    },
    iconPress:{
        paddingVertical         : Metrics.sizePad,
        paddingHorizontal       : Metrics.sizePad * 1.2,
    },
    header:{
        flexDirection           : 'row',
        justifyContent          : 'center',
        alignItems              : 'center',
        borderBottomWidth       : 1,
        borderColor             : Colors.whitesmoke
    },
    titleView:{
        flex                    : 1,
        justifyContent          : 'center',
        paddingLeft             : Metrics.sizePad
    },

    titleModal:{
        color                   : Colors.red
    },
    titleFilter:{

    },
    colorPrimay:{
        color                   : Colors.red
    },
    titleText:{
        color                   : Colors.red
    }
})
