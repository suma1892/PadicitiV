import React, { Component }                     from 'react'
import PropTypes                                from 'prop-types'
import { Image, View,
         TouchableOpacity, StyleSheet, Modal, Easing, ScrollView, Text}  from "react-native"
import { Colors, Metrics, Fonts }               from '../Assets'
// import styles                                   from './ComponentStyle'
import { TextView }                                 from './index';
import * as Animation                           from 'react-native-animatable'



export default class DialogComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active : this.props.active,
        };
    }
    
    _renderIcon(icon, action ){            
        return(
            <TouchableOpacity style={styles.dialogIconTouchable} onPress={action} >
                <Image style={styles.dialogIcon} resizeMode='contain' source={icon}/>
            </TouchableOpacity>
        )
    }
    

    _setAnimated=(x,y)=>{
        console.log('this.props.active')
        console.log(this.props.active)
        if(!this.props.active){
            x.transitionTo({opacity: 0},500)
            y.transitionTo({top: Metrics.screenHeight},500)
            setTimeout(() => { x.transitionTo({top: Metrics.screenHeight*2},10) }, 300);
        } 
        else {
            x.transitionTo({top: 0},0.1) 
            setTimeout(() => { 
                x.transitionTo({opacity: 1},300)
                y.transitionTo({top: 0},100) 
            }, 10)
        }      
    }

    componentWillReceiveProps(newProps){
        if(this.mounted) this.props.active
    }

    componentDidMount(){
        this.mounted = true; 
        this._setAnimated(this.refs.overlay,this.refs.modal)
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    componentDidUpdate(){
        this._setAnimated(this.refs.overlay,this.refs.modal)
    }

    render() {   
        var prop            = this.props
        var top             = prop.top ? prop.top : 0
        var bottom          = prop.bottom ? prop.bottom : 0
        var left            = prop.left ? prop.left : 0
        var right           = prop.right ? prop.right : 0
        var horizontalProp  = this.prop
        switch(prop.position){
            case 'top'      : pos = ['center', 'flex-start'];break
            case 'left'     : pos = ['flex-start', 'center'];break
            case 'right'    : pos = ['flex-end', 'center']  ;break
            case 'bottom'   : pos = ['center', 'flex-end']  ;break
            default         : pos = ['center', 'center']    ;break
        }
        
        return (
            <Animation.View ref={'overlay'} style={[styles.dialogOverlay, {alignItems: pos[0], justifyContent: pos[1], top: Metrics.screenHeight, bottom: prop.navbar ? Metrics.navBarHeight : 0}]}>
                <Animation.View ref={'modal'} style={[styles.dialogModal, (prop.fullwidth && styles.fullwidth),(prop.fullheight && styles.fullheight)]}>

                       
                        <View style={styles.dialogTitle}>
                        
                            {this.props.action && this._renderIcon(require('../Assets/Icons/ic_close.png'),  () => this.props.close())}
                            <View style={{flex:1, justifyContent:'center'}}>
                                <TextView style={[styles.dialogTextTitle,this.props.action && {textAlign:'center'}]}>{this.props.title}</TextView>
                            </View>
                            {this.props.action && this._renderIcon(require('../Assets/Icons/ic_checked.png'),  () => this.props.action())}
                            {!this.props.action && this._renderIcon(require('../Assets/Icons/ic_close.png'), () => this.props.close())}
                        </View>
                      
                    <ScrollView style={[styles.dialogContent]}>
                        {this.props.children}
                    </ScrollView>
                </Animation.View>
            </Animation.View>
      
            
        );
    
    }
}
const posAbsolute = {
    position                : 'absolute',
    left                    : 0,
    top                     : 0,
    right                   : 0,
    bottom                  : 0,
}
const styles = StyleSheet.create({
    dialogOverlay:{
        flex                    : 1,
        zIndex                  : 100000,
        backgroundColor         : Colors.overlay,
        overflow                : 'hidden',
        ...posAbsolute,
    },
    dialogModal:{
        backgroundColor         : Colors.background,
        width                   : Metrics.screenWidth*.8,
        shadowColor             : '#000000',
        shadowOffset            : { width: 0, height: 0},
        shadowOpacity           : 0.3,
        shadowRadius            : 3,
        elevation               : 20,
        zIndex                  : 100,
    },
    dialogTextTitle:{
        fontSize                : Metrics.font.small,
        color                   : Colors.white,
        padding  : Metrics.sizePad,
        justifyContent          : 'center'
    },
    dialogContent:{
        paddingHorizontal       : Metrics.sizePad * 1.5,
        paddingVertical         : Metrics.sizePad,
    },
    fullheight:{
        height                   : Metrics.screenHeight
    },
    dialogTitle:{
        flexDirection           : 'row',
        justifyContent          : 'center',
        backgroundColor         : Colors.blue,
        alignItems              : 'center'
        
    },
    dialogIconTouchable:{
        justifyContent          : 'center',
        height                  : Metrics.icon.medium*1.25,
        width                   : Metrics.icon.medium*1.25,
        alignItems              : 'center'
    },
    dialogIcon:{
        height                  : Metrics.icon.tiny,
        width                   : Metrics.icon.tiny,
        tintColor               : Colors.white
    },
});