import { Platform, Dimensions, StyleSheet, StatusBar } from 'react-native'
import { _OS } from '../Components/_OS'

const { width, height } = Dimensions.get('window')
const screenWidth = width < height ? width : height
const screenHeight = width < height ? height : width

function getAirlineLogo(code) {
    switch (code) {
        case '0b': return require('./Icons/flight/airline_logo_0b.png')
        case '3j': return require('./Icons/flight/airline_logo_3j.png')
        case '3k': return require('./Icons/flight/airline_logo_3k.png')
        case '3u': return require('./Icons/flight/airline_logo_3u.png')
        case '4u': return require('./Icons/flight/airline_logo_4u.png')
        case '5j': return require('./Icons/flight/airline_logo_5j.png')
        case '5y': return require('./Icons/flight/airline_logo_5y.png')
        case '7c': return require('./Icons/flight/airline_logo_7c.png')
        case '7m': return require('./Icons/flight/airline_logo_7m.png')
        case '8m': return require('./Icons/flight/airline_logo_8m.png')
        case '8u': return require('./Icons/flight/airline_logo_8u.png')
        case '9c': return require('./Icons/flight/airline_logo_9c.png')
        case '9k': return require('./Icons/flight/airline_logo_9k.png')
        case '9m': return require('./Icons/flight/airline_logo_9m.png')
        case '9w': return require('./Icons/flight/airline_logo_9w.png')
        case 'a5': return require('./Icons/flight/airline_logo_a5.png')
        case 'a9': return require('./Icons/flight/airline_logo_a9.png')
        case 'aa': return require('./Icons/flight/airline_logo_aa.png')
        case 'ab': return require('./Icons/flight/airline_logo_ab.png')
        case 'ac': return require('./Icons/flight/airline_logo_ac.png')
        case 'af': return require('./Icons/flight/airline_logo_af.png')
        case 'ah': return require('./Icons/flight/airline_logo_ah.png')
        case 'ai': return require('./Icons/flight/airline_logo_ai.png')
        case 'ak': return require('./Icons/flight/airline_logo_ak.png')
        case 'am': return require('./Icons/flight/airline_logo_am.png')
        case 'ar': return require('./Icons/flight/airline_logo_ar.png')
        case 'as': return require('./Icons/flight/airline_logo_as.png')
        case 'av': return require('./Icons/flight/airline_logo_av.png')
        case 'ay': return require('./Icons/flight/airline_logo_ay.png')
        case 'az': return require('./Icons/flight/airline_logo_az.png')
        case 'b6': return require('./Icons/flight/airline_logo_b6.png')
        case 'b8': return require('./Icons/flight/airline_logo_b8.png')
        case 'ba': return require('./Icons/flight/airline_logo_ba.png')
        case 'be': return require('./Icons/flight/airline_logo_be.png')
        case 'bg': return require('./Icons/flight/airline_logo_bg.png')
        case 'bi': return require('./Icons/flight/airline_logo_bi.png')
        case 'bj': return require('./Icons/flight/airline_logo_bj.png')
        case 'bl': return require('./Icons/flight/airline_logo_bl.png')
        case 'bp': return require('./Icons/flight/airline_logo_bp.png')
        case 'br': return require('./Icons/flight/airline_logo_br.png')
        case 'bt': return require('./Icons/flight/airline_logo_bt.png')
        case 'bv': return require('./Icons/flight/airline_logo_bv.png')
        case 'bw': return require('./Icons/flight/airline_logo_bw.png')
        case 'ca': return require('./Icons/flight/airline_logo_ca.png')
        case 'ci': return require('./Icons/flight/airline_logo_ci.png')
        case 'cm': return require('./Icons/flight/airline_logo_cm.png')
        case 'cn': return require('./Icons/flight/airline_logo_cn.png')
        case 'cu': return require('./Icons/flight/airline_logo_cu.png')
        case 'cx': return require('./Icons/flight/airline_logo_cx.png')
        case 'cz': return require('./Icons/flight/airline_logo_cz.png')
        case 'd3': return require('./Icons/flight/airline_logo_d3.png')
        case 'd7': return require('./Icons/flight/airline_logo_d7.png')
        case 'de': return require('./Icons/flight/airline_logo_de.png')
        case 'dj': return require('./Icons/flight/airline_logo_dj.png')
        case 'dl': return require('./Icons/flight/airline_logo_dl.png')
        case 'dp': return require('./Icons/flight/airline_logo_dp.png')
        case 'dy': return require('./Icons/flight/airline_logo_dy.png')
        case 'e4': return require('./Icons/flight/airline_logo_e4.png')
        case 'ec': return require('./Icons/flight/airline_logo_ec.png')
        case 'ek': return require('./Icons/flight/airline_logo_ek.png')
        case 'en': return require('./Icons/flight/airline_logo_en.png')
        case 'ep': return require('./Icons/flight/airline_logo_ep.png')
        case 'et': return require('./Icons/flight/airline_logo_et.png')
        case 'ew': return require('./Icons/flight/airline_logo_ew.png')
        case 'ey': return require('./Icons/flight/airline_logo_ey.png')
        case 'f7': return require('./Icons/flight/airline_logo_f7.png')
        case 'f9': return require('./Icons/flight/airline_logo_f9.png')
        case 'fb': return require('./Icons/flight/airline_logo_fb.png')
        case 'fd': return require('./Icons/flight/airline_logo_fd.png')
        case 'fg': return require('./Icons/flight/airline_logo_fg.png')
        case 'fi': return require('./Icons/flight/airline_logo_fi.png')
        case 'fm': return require('./Icons/flight/airline_logo_fm.png')
        case 'fr': return require('./Icons/flight/airline_logo_fr.png')
        case 'fv': return require('./Icons/flight/airline_logo_fv.png')
        case 'fy': return require('./Icons/flight/airline_logo_fy.png')
        case 'fz': return require('./Icons/flight/airline_logo_fz.png')
        case 'g3': return require('./Icons/flight/airline_logo_g3.png')
        case 'g4': return require('./Icons/flight/airline_logo_g4.png')
        case 'g9': return require('./Icons/flight/airline_logo_g9.png')
        case 'ga': return require('./Icons/flight/airline_logo_ga.png')
        case 'gf': return require('./Icons/flight/airline_logo_gf.png')
        case 'gj': return require('./Icons/flight/airline_logo_gj.png')
        case 'gk': return require('./Icons/flight/airline_logo_gk.png')
        case 'gl': return require('./Icons/flight/airline_logo_gl.png')
        case 'gp': return require('./Icons/flight/airline_logo_gp.png')
        case 'ha': return require('./Icons/flight/airline_logo_ha.png')
        case 'hg': return require('./Icons/flight/airline_logo_hg.png')
        case 'hm': return require('./Icons/flight/airline_logo_hm.png')
        case 'hu': return require('./Icons/flight/airline_logo_hu.png')
        case 'hx': return require('./Icons/flight/airline_logo_hx.png')
        case 'hy': return require('./Icons/flight/airline_logo_hy.png')
        case 'i5': return require('./Icons/flight/airline_logo_i5.png')
        case 'ia': return require('./Icons/flight/airline_logo_ia.png')
        case 'ib': return require('./Icons/flight/airline_logo_ib.png')
        case 'id': return require('./Icons/flight/airline_logo_id.png')
        case 'ig': return require('./Icons/flight/airline_logo_ig.png')
        case 'ij': return require('./Icons/flight/airline_logo_ij.png')
        case 'il': return require('./Icons/flight/airline_logo_il.png')
        case 'in': return require('./Icons/flight/airline_logo_in.png')
        case 'ir': return require('./Icons/flight/airline_logo_ir.png')
        case 'it': return require('./Icons/flight/airline_logo_it.png')
        case 'iw': return require('./Icons/flight/airline_logo_iw.png')
        case 'ix': return require('./Icons/flight/airline_logo_ix.png')
        case 'iz': return require('./Icons/flight/airline_logo_iz.png')
        case 'j2': return require('./Icons/flight/airline_logo_j2.png')
        case 'j9': return require('./Icons/flight/airline_logo_j9.png')
        case 'jl': return require('./Icons/flight/airline_logo_jl.png')
        case 'jp': return require('./Icons/flight/airline_logo_jp.png')
        case 'jq': return require('./Icons/flight/airline_logo_jq.png')
        case 'js': return require('./Icons/flight/airline_logo_js.png')
        case 'jt': return require('./Icons/flight/airline_logo_jt.png')
        case 'ju': return require('./Icons/flight/airline_logo_ju.png')
        case 'jv': return require('./Icons/flight/airline_logo_jv.png')
        case 'jx': return require('./Icons/flight/airline_logo_jx.png')
        case 'ka': return require('./Icons/flight/airline_logo_ka.png')
        case 'kc': return require('./Icons/flight/airline_logo_kc.png')
        case 'kd': return require('./Icons/flight/airline_logo_kd.png')
        case 'ke': return require('./Icons/flight/airline_logo_ke.png')
        case 'kk': return require('./Icons/flight/airline_logo_kk.png')
        case 'kl': return require('./Icons/flight/airline_logo_kl.png')
        case 'km': return require('./Icons/flight/airline_logo_km.png')
        case 'kn': return require('./Icons/flight/airline_logo_kn.png')
        case 'kq': return require('./Icons/flight/airline_logo_kq.png')
        case 'ku': return require('./Icons/flight/airline_logo_ku.png')
        case 'kx': return require('./Icons/flight/airline_logo_kx.png')
        case 'ky': return require('./Icons/flight/airline_logo_ky.png')
        case 'la': return require('./Icons/flight/airline_logo_la.png')
        case 'lg': return require('./Icons/flight/airline_logo_lg.png')
        case 'lh': return require('./Icons/flight/airline_logo_lh.png')
        case 'li': return require('./Icons/flight/airline_logo_li.png')
        case 'ln': return require('./Icons/flight/airline_logo_ln.png')
        case 'lo': return require('./Icons/flight/airline_logo_lo.png')
        case 'ls': return require('./Icons/flight/airline_logo_ls.png')
        case 'lx': return require('./Icons/flight/airline_logo_lx.png')
        case 'ly': return require('./Icons/flight/airline_logo_ly.png')
        case 'md': return require('./Icons/flight/airline_logo_md.png')
        case 'me': return require('./Icons/flight/airline_logo_me.png')
        case 'mf': return require('./Icons/flight/airline_logo_mf.png')
        case 'mh': return require('./Icons/flight/airline_logo_mh.png')
        case 'mk': return require('./Icons/flight/airline_logo_mk.png')
        case 'mm': return require('./Icons/flight/airline_logo_mm.png')
        case 'ms': return require('./Icons/flight/airline_logo_ms.png')
        case 'mu': return require('./Icons/flight/airline_logo_mu.png')
        case 'mv': return require('./Icons/flight/airline_logo_mv.png')
        case 'nf': return require('./Icons/flight/airline_logo_nf.png')
        case 'nh': return require('./Icons/flight/airline_logo_nh.png')
        case 'nt': return require('./Icons/flight/airline_logo_nt.png')
        case 'nz': return require('./Icons/flight/airline_logo_nz.png')
        case 'oa': return require('./Icons/flight/airline_logo_oa.png')
        case 'od': return require('./Icons/flight/airline_logo_od.png')
        case 'ok': return require('./Icons/flight/airline_logo_ok.png')
        case 'oq': return require('./Icons/flight/airline_logo_oq.png')
        case 'or': return require('./Icons/flight/airline_logo_or.png')
        case 'os': return require('./Icons/flight/airline_logo_os.png')
        case 'ou': return require('./Icons/flight/airline_logo_ou.png')
        case 'ox': return require('./Icons/flight/airline_logo_ox.png')
        case 'oz': return require('./Icons/flight/airline_logo_oz.png')
        case 'pa': return require('./Icons/flight/airline_logo_pa.png')
        case 'pd': return require('./Icons/flight/airline_logo_pd.png')
        case 'pf': return require('./Icons/flight/airline_logo_pf.png')
        case 'pg': return require('./Icons/flight/airline_logo_pg.png')
        case 'pk': return require('./Icons/flight/airline_logo_pk.png')
        case 'pr': return require('./Icons/flight/airline_logo_pr.png')
        case 'py': return require('./Icons/flight/airline_logo_py.png')
        case 'qb': return require('./Icons/flight/airline_logo_qb.png')
        case 'qf': return require('./Icons/flight/airline_logo_qf.png')
        case 'qg': return require('./Icons/flight/airline_logo_qg.png')
        case 'qh': return require('./Icons/flight/airline_logo_qh.png')
        case 'qr': return require('./Icons/flight/airline_logo_qr.png')
        case 'qz': return require('./Icons/flight/airline_logo_qz.png')
        case 'r3': return require('./Icons/flight/airline_logo_r3.png')
        case 'r7': return require('./Icons/flight/airline_logo_r7.png')
        case 'rb': return require('./Icons/flight/airline_logo_rb.png')
        case 'rc': return require('./Icons/flight/airline_logo_rc.png')
        case 'ro': return require('./Icons/flight/airline_logo_ro.png')
        case 'sc': return require('./Icons/flight/airline_logo_sc.png')
        case 'sd': return require('./Icons/flight/airline_logo_sd.png')
        case 'si': return require('./Icons/flight/airline_logo_si.png')
        case 'sj': return require('./Icons/flight/airline_logo_sj.png')
        case 'sl': return require('./Icons/flight/airline_logo_sl.png')
        case 'sm': return require('./Icons/flight/airline_logo_sm.png')
        case 'sn': return require('./Icons/flight/airline_logo_sn.png')
        case 'sq': return require('./Icons/flight/airline_logo_sq.png')
        case 'sw': return require('./Icons/flight/airline_logo_sw.png')
        case 'tb': return require('./Icons/flight/airline_logo_tb.png')
        case 'tg': return require('./Icons/flight/airline_logo_tg.png')
        case 'tk': return require('./Icons/flight/airline_logo_tk.png')
        case 'tl': return require('./Icons/flight/airline_logo_tl.png')
        case 'tr': return require('./Icons/flight/airline_logo_tr.png')
        case 'ts': return require('./Icons/flight/airline_logo_ts.png')
        case 'tt': return require('./Icons/flight/airline_logo_tt.png')
        case 'tu': return require('./Icons/flight/airline_logo_tu.png')
        case 'u2': return require('./Icons/flight/airline_logo_u2.png')
        case 'u4': return require('./Icons/flight/airline_logo_u4.png')
        case 'ul': return require('./Icons/flight/airline_logo_ul.png')
        case 'uo': return require('./Icons/flight/airline_logo_uo.png')
        case 'ux': return require('./Icons/flight/airline_logo_ux.png')
        case 'va': return require('./Icons/flight/airline_logo_va.png')
        case 'vn': return require('./Icons/flight/airline_logo_vn.png')
        case 'vs': return require('./Icons/flight/airline_logo_vs.png')
        case 'vx': return require('./Icons/flight/airline_logo_vx.png')
        case 'w3': return require('./Icons/flight/airline_logo_w3.png')
        case 'w5': return require('./Icons/flight/airline_logo_w5.png')
        case 'we': return require('./Icons/flight/airline_logo_we.png')
        case 'wx': return require('./Icons/flight/airline_logo_wx.png')
        case 'wy': return require('./Icons/flight/airline_logo_wy.png')
        case 'x3': return require('./Icons/flight/airline_logo_x3.png')
        case 'xj': return require('./Icons/flight/airline_logo_xj.png')
        case 'xt': return require('./Icons/flight/airline_logo_xt.png')
        case 'y9': return require('./Icons/flight/airline_logo_y9.png')
        case 'ym': return require('./Icons/flight/airline_logo_ym.png')
        case 'z6': return require('./Icons/flight/airline_logo_z6.png')
        case 'zh': return require('./Icons/flight/airline_logo_zh.png')
    }
}
function getIcon(name) {
    switch (name) {
        case 'ic_jetski': return require('./Icons/jet-ski-.png')
        case 'ic_dot': return require('./Icons/dot.png')
        case 'ic_aca_asuransi': return require('./Icons/aca_asuransi.png')
        case 'ic_arrow_back': return require('./Icons/ic_arrow_back.png')
        case 'ic_refund1': return require('./Icons/ic_refund.png')
        case 'ic_delay_protect': return require('./Icons/ic_delay_protect.png')
        case 'ic_arrow_down': return require('./Icons/ic_arrow_down.png')
        case 'ic_arrow_left': return require('./Icons/ic_arrow_left.png')
        case 'ic_arrow_right': return require('./Icons/ic_arrow_right.png')
        case 'ic_arrow_right_': return require('./Icons/ic_arrow_right_.png')
        case 'ic_arrow_thin_right': return require('./Icons/ic_arrow_thin_right.png')
        case 'ic_arrow_up': return require('./Icons/ic_arrow_up.png')
        case 'ic_bg_active_': return require('./Icons/ic_bg_active_.png')
        case 'ic_bg_active': return require('./Icons/ic_bg_active.png')
        case 'ic_bus': return require('./Icons/ic_bus.png')
        case 'ic_calendar_2': return require('./Icons/ic_calendar_2.png')
        case 'ic_calendar_3': return require('./Icons/ic_calendar_3.png')
        case 'ic_calendar': return require('./Icons/ic_calendar.png')
        case 'ic_cash': return require('./Icons/ic_cash.png')
        case 'ic_checkbox': return require('./Icons/ic_checkbox.png')
        case 'ic_checked': return require('./Icons/ic_checked.png')
        case 'ic_circle_min': return require('./Icons/ic_circle_min.png')
        case 'ic_circle_plus': return require('./Icons/ic_circle_plus.png')
        case 'ic_close_': return require('./Icons/ic_close_.png')
        case 'ic_close': return require('./Icons/ic_close.png')
        case 'ic_filter': return require('./Icons/ic_filter.png')
        case 'ic_flight_from': return require('./Icons/ic_flight_from.png')
        case 'ic_flight_return': return require('./Icons/ic_flight_return.png')
        case 'ic_flight': return require('./Icons/ic_flight.png')
        case 'ic_history': return require('./Icons/ic_history.png')
        case 'ic_home': return require('./Icons/ic_home.png')
        case 'ic_hotel_2': return require('./Icons/ic_hotel_2.png')
        case 'ic_hotel_3': return require('./Icons/ic_hotel_3.png')
        case 'ic_hotel': return require('./Icons/ic_hotel.png')
        case 'ic_minus': return require('./Icons/ic_minus.png')
        case 'ic_more': return require('./Icons/ic_more.png')
        case 'ic_pelni': return require('./Icons/ic_pelni.png')
        case 'ic_place': return require('./Icons/ic_place.png')
        case 'ic_plus': return require('./Icons/ic_plus.png')
        case 'ic_group_minus': return require('./Icons/ic_group_minus.png') 
        case 'ic_group_plus' : return require('./Icons/ic_group_plus.png') 
        case 'ic_promo_2': return require('./Icons/ic_promo_2.png')
        case 'ic_promo': return require('./Icons/ic_promo.png')
        case 'ic_pulsa': return require('./Icons/ic_pulsa.png')
        case 'ic_radio_active': return require('./Icons/ic_radio_active.png')
        case 'ic_radio_nonactive': return require('./Icons/ic_radio_nonactive.png')
        case 'ic_round_cancel': return require('./Icons/ic_round_cancel.png')
        case 'ic_scroll_more': return require('./Icons/ic_scroll_more.png')
        case 'ic_search':  return require('./Icons/ic_search.png')  
        case 'ic_sort': return require('./Icons/ic_sort.png')
        case 'ic_star_yellow': return require('./Icons/ic_star_yellow.png')
        case 'ic_star': return require('./Icons/ic_star.png')
        case 'ic_switch': return require('./Icons/ic_switch.png')
        case 'ic_train_2': return require('./Icons/ic_train_2.png')
        case 'ic_train': return require('./Icons/ic_train.png')
        case 'ic_railink': return require('./Icons/ic_railink.png')
        case 'ic_trip': return require('./Icons/ic_trip.png')
        case 'ic-hotel-24hours': return require('./Icons/ic-hotel-24hours.png')
        case 'ic-hotel-ac': return require('./Icons/ic-hotel-ac.png')
        case 'ic-hotel-parking': return require('./Icons/ic-hotel-parking.png')
        case 'ic-hotel-wifi': return require('./Icons/ic-hotel-wifi.png')
        case 'airline_logo_sl': return require('./Icons/flight/airline_logo_sl.png')
        case 'ic_shape': return require('./Icons/ic_shape.png')
        case 'logo_padiciti': return require('./Icons/logo_padiciti.png')
        case 'ic_more_nav': return require('./Icons/ic_more_nav.png')
        case 'ic_tours': return require('./Icons/ic_tours.png')
        case 'ic_kereta_api': return require('./Icons/ic_kereta_api.png')
        case 'ic_pln': return require('./Icons/ic_pln.png')
        case 'ic_elipsis': return require('./Icons/icon_ellipsis_vertical.png')
        case 'ic_time': return require('./Icons/ic_time.png')
        case 'ic_car': return require('./Icons/ic_car.png')
        case 'ic_pass': return require('./Icons/ic_pass.png')
        case 'ic_bagasi': return require('./Icons/ic_bagasi.png')
        case 'ic_user': return require('./Icons/ic_user.png')
        case 'ic_cutlery': return require('./Icons/ic_cutlery.png')
        // case 'ic_phone': return require('./Icons/ic_phone.png')
        case 'ic_whatsapp': return require('./Icons/ic_whatsapp.png')
        case 'ic_headset': return require('./Icons/ic_headset.png')
        case 'ic_email': return require('./Icons/ic_email.png')
        case 'ic_flight_int':  return require('./Icons/ic_flight_int.png')
        case 'calendar': return require('./Icons/calendar.png')
        case 'refund': return require('./Icons/refund.png')
        case 'layer_1' :  return require('./Icons/layer_1.png')
        case 'ic_depart_date' :  return require('./Icons/ic_depart_date.png')
        case 'ic_users' :  return require('./Icons/ic_users.png')

        default: return require('./Icons/ic_blank.png')
    }
}

const Colors = {
    putihapa :'#F1FFFF',
    transparent: 'transparent',
    warm_grey: '#888888',
    white: '#ffffff',
    black: '#212121',
    gray: '#606060',
    darkgray: '#767676',
    blue: '#193f79',
    secondary: 'rgba(44,45,45,1)',
    whitesmoke: 'rgba(245, 245, 245,1)',
    overlay: 'rgba(0,0,0,0.5)',
    tangerine: '#fe8800',
    background: 'rgba(255,255,255,1)',
    pastel_red      : '#F04134',
    benam: '#6b7c93',
    boldAvenir: '#222222',
    borderColor: '#dddddd',

    red: '#f91732',
    apple: '#66B445',
    blumine: '#204A8B',
    pizzaz: '#FE8800',
    border: '#DDDDDD',
    slate_gray: '#6B7C93',
    concrete: '#F2F2F2',
    yellow :'#fff8d2',
}

const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
const Metrics = {
    navBot: Scale(50),
    screenWidth,
    screenHeight,
    normalPadding: Scale(16),
    baseMargin: Scale(10),
    sizePad: Scale(12),
    sizeList: Scale(80),
    headerModal: Scale(Platform.OS === 'ios' ? 44 : 54),
    navBarHeight: Scale(Platform.OS === 'ios' ? 64 : 56),
    statusBar: StatusBar.currentHeight,
     font: {
        tiny: 12,
        small: 14,
        regular: 16,
        medium: 20,
        large: 24,
        xl: 28,
        screenWidth,
        screenHeight,
    },

    padding: {
        tiny: Scale(4),
        small: Scale(8),
        normal: Scale(16),
        medium: Scale(24),
        large: Scale(32),
    },

    icon: {
        tiny: Scale(12),
        small: Scale(18),
        normalSmall: Scale(21),
        normal: Scale(32),
        medium: Scale(40),
        large: Scale(48),
    },

    screen: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        scale: Dimensions.get('window').scale,
    },

    toolbar: 60,
    navbar: 60,
    border: StyleSheet.hairlineWidth,
}

const Fonts = {
    light: {
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'AvenirNextLTProMedium',
        fontWeight: Platform.OS === 'ios' ? '300' : undefined,
    },
    regular: {
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'AvenirNextLTProMedium',
        fontWeight: Platform.OS === 'ios' ? "500" : undefined,
    },
    bold: {
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'AvenirNextLTProDemi',
        fontWeight: Platform.OS === 'ios' ? "600" : undefined,
    },
    size: {
        h1: 38,
        h2: 34,
        h5: 20,
        tiny: Scale(10),
        small: Scale(11.5),
        regular: Scale(13.5),
        medium: Scale(15),
        large: Scale(17.5),
        xtra: Scale(19)
    }
}


const Style = {
    heading: {
        ...Fonts.regular,
        fontSize: Metrics.font.small
    },
    propBold: {
        ...Fonts.bold,
        fontSize: Metrics.font.large
    },
    entity: {
        ...Fonts.regular,
        color: Colors.darkgray,
        fontSize: Metrics.font.small
    },
    value: {
        ...Fonts.regular,
        fontSize: Metrics.font.regular,
        color: Colors.gray
    },
    description: {
        ...Fonts.regular,
        fontSize: Metrics.font.regular
    },
    typeCluster: {
        ...Fonts.light,
        fontSize: Metrics.font.small,
    },
    typeUnit: {
        ...Fonts.regular,
        fontSize: Metrics.font.regular
    },
    priceUnit: {
        ...Fonts.regular,
        fontSize: Metrics.font.regular,
    },
    amount: {
        ...Fonts.bold,
        fontSize: Metrics.font.regular
    },
}


export { getIcon, getAirlineLogo, Fonts, Metrics, Colors, Style, Scale, _OS}
