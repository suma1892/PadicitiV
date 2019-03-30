import {getIcon} from '../Assets'
import {STRING} from '../Utils'
module.exports = ArrayValue = {
ArrayNavBar() {
    return [
      {
        id: "0",
        title: "Home",
        notifCount: 0,
        slug: "home",
        source:getIcon('ic_home')
      },
      {
        id: "1",
        title: "My Booking",
        notifCount: 0,
        slug: "my_trip",
        source: getIcon('ic_trip'),
      },
      {
        id: "2",
        title: "Promos",
        notifCount: 0,
        slug: "promos",
        source: getIcon('ic_promo'),
      },
      {
        id: "3",
        title: "More",
        notifCount: 10,
        slug: "more",
        source: getIcon('ic_more_nav'),
      }
    ];
  },
  ArrayNavBarList() {
    return [
      {
        id: "0",
        title: "Urutkan",
        notifCount: 0,
        slug: "urutkan",
        source:getIcon('ic_home')
      },
      {
        id: "1",
        title: "Filter",
        notifCount: 0,
        slug: "filter",
        source: getIcon('ic_trip'),
      },
      {
        id: "2",
        title: "Ganti Tanggal",
        notifCount: 0,
        slug: "ganti_tanggal",
        source: getIcon('ic_promo'),
      },
    ];
  },
  ArrayDashBoard() {
    return [
      {
        id: "0",
        title: "FLIGHT",
        slug: "flight",
        source:getIcon('ic_flight')
      },{
        id: "1",
        title: "TRAIN",
        slug: "train",
        source: getIcon('ic_train'),
      },{
        id: "2",
        title: "HOTEL",
        slug: "hotel",
        source: getIcon('ic_hotel'),
      },{
        id: "3",
        title: "BUS",
        slug: "bus",
        source: getIcon('ic_bus'),
      },{
        id: "4",
        title: "FLIGHT INT'L",
        slug: "flight_int",
        source: getIcon('ic_flight_int'),
      },{
        id: "5",
        title: "PLN",
        slug: "pln",
        source: getIcon('ic_pln'),
      }
      ,{
        id: "6",
        title: "Jet Ski",
        slug: "jetski",
        source: getIcon('ic_jetski'),
      }
      ,{
        id: "7",
        title: " ",
        slug: " ",
        source: getIcon('ic'),
      }
      // ,{
      //   id: "6",
      //   title: "TOURS",
      //   slug: "tours",
      //   source: getIcon('ic'),
      // },{
      //   id: "7",
      //   title: "MORE",
      //   slug: "more",
      //   source: getIcon('ic'),
      // }
    ];
  },ArrayMoreProduct() {
    return [
      {
        id: "0",
        title: "FLIGHT",
        slug: "flight",
        source:getIcon('ic_flight')
      },{
        id: "1",
        title: "TRAIN",
        slug: "train",
        source: getIcon('ic_train'),
      },{
        id: "2",
        title: "HOTEL",
        slug: "hotel",
        source: getIcon('ic_hotel'),
      },{
        id: "3",
        title: "BUS",
        slug: "bus",
        source: getIcon('ic_bus'),
      },{
        id: "4",
        title: "PULSA",
        slug: "pulsa",
        source: getIcon('ic_pulsa'),
      },{
        id: "5",
        title: "PELNI",
        slug: "pelni",
        source: getIcon('ic_pelni'),
      },{
        id: "6",
        title: "TOURS",
        slug: "tours",
        source: getIcon('ic_tours'),
      },{
        id: "7",
        title: "PLN",
        slug: "pln",
        source: getIcon('ic_pln'),
      },{
        id: "8",
        title: "FLIGHT INT'L",
        slug: "flight_int",
        source: getIcon('ic_flight_int'),
      },
      {
        id: "9",
        title: "JET SKI",
        slug: "jetski",
        source: getIcon('ic_jetski'),
      }
    ];
  },DataPemesan() {
    return [
      {
        title: "Semua data E-Ticketing akan dikirim melalui Email pemesan.",
      },{
        title: "Nomor Handphone digunakan untuk informasi semua yang berkaitan dengan reservasi dan keberangkatan.",
      },
    ];
  },FiledDataClient() {
    return [
      {
        title: STRING.Label.client_name,
        name: 'client_name',
        slug : 'input',
        holder : STRING.Label.client_name_holder,
      },{
        title: STRING.Label.client_email,
        name : 'client_email',
        slug : 'input',
        holder : STRING.Label.client_email_holder,
  
      },{
        title: STRING.Label.client_phonde,
        name: 'client_phone',
        slug : 'number',
        holder : STRING.Label.client_phonde_holder,
  
      },
    ];
  },FiledDataPassanger() {
    return [
      {
        title: STRING.Label.adult_passenger,
        slug : 'adult'
      },{
        title: STRING.Label.title,
        name: 'adult_title',
        slug: 'option'
      },{
        title: STRING.Label.full_name,
        name: 'adult_full_name',
        slug: 'input'
      }
    ];
  },FiledDataPassangerInter() {
    return [
      {
        title: STRING.Label.adult_passenger,
        slug : 'adult'
      },{
        title: STRING.Label.title,
        name: 'adult_title',
        slug: 'option'
      },{
        title: STRING.Label.full_name,
        name: 'adult_full_name',
        slug: 'input'
      }
      // ,{
      //   title: STRING.Label.country_pass,
      //   name: 'adult_nationality',
      //   slug: 'input'
      // }
      // ,{
      //   title: STRING.Label.issuingCountry,
      //   name: 'adult_issuingCountry',
      //   slug: 'input'
      // }
      ,{
        title: STRING.Label.passport,
        name: 'adult_passport',
        slug: 'input'
      },{
        title: STRING.Label.expiryPassport,
        name: 'adult_expiryPassport',
        slug: 'option_brithdate'
      }
    ];
  },FiledDataChild() {
    return [
      {
        title: STRING.Label.child_passenger,
        slug : 'child'
      },{
        title: STRING.Label.title,
        name: 'child_title',
        slug: 'option'
      },{
        title: STRING.Label.full_name,
        name: 'child_full_name',
        slug: 'input'
      },{
        title: STRING.Label.brith_date,
        name: 'child_brith_date',
        slug: 'option_brithdate'
      },
    ];
  },FiledDataChildInter() {
    return [
      {
        title: STRING.Label.child_passenger,
        slug : 'child'
      },{
        title: STRING.Label.title,
        name: 'child_title',
        slug: 'option'
      },{
        title: STRING.Label.full_name,
        name: 'child_full_name',
        slug: 'input'
      },{
        title: STRING.Label.brith_date,
        name: 'child_brith_date',
        slug: 'option_brithdate'
      }
      // ,{
      //   title: STRING.Label.country_pass,
      //   name: 'child_nationality',
      //   slug: 'input'
      // }
      // ,{
      //   title: STRING.Label.issuingCountry,
      //   name: 'child_issuingCountry',
      //   slug: 'input'
      // }
      ,{
        title: STRING.Label.passport,
        name: 'child_passport',
        slug: 'input'
      },{
        title: STRING.Label.expiryPassport,
        name: 'child_expiryPassport',
        slug: 'option_brithdate'
      }
    ];
  },FiledDataInfant() {
    return [
      {
        title: STRING.Label.infant_passenger,
        slug : 'infant'
      },{
        title: STRING.Label.title,
        name: 'infant_title',
        slug: 'option'
      },{
        title: STRING.Label.full_name,
        name: 'infant_full_name',
        slug: 'input'
      },{
        title: STRING.Label.brith_date,
        name: 'infant_brith_date',
        slug: 'option_brithdate'
      },
    ];
  },FiledDataInfantInter() {
    return [
      {
        title: STRING.Label.infant_passenger,
        slug : 'infant'
      },{
        title: STRING.Label.title,
        name: 'infant_title',
        slug: 'option'
      },{
        title: STRING.Label.full_name,
        name: 'infant_full_name',
        slug: 'input'
      },{
        title: STRING.Label.brith_date,
        name: 'infant_brith_date',
        slug: 'option_brithdate'
      }
      // ,{
      //   title: STRING.Label.country_pass,
      //   name: 'infant_nationality',
      //   slug: 'input'
      // }
      // ,{
      //   title: STRING.Label.issuingCountry,
      //   name: 'infant_issuingCountry',
      //   slug: 'input'
      // }
      ,{
        title: STRING.Label.passport,
        name: 'infant_passport',
        slug: 'input'
      },{
        title: STRING.Label.expiryPassport,
        name: 'infant_expiryPassport',
        slug: 'option_brithdate'
      }
    ];
  }, TermAndCondition() {
    return [
      {
        title: "Nama Penumpang rute internasional harus tepat dan sesuai Paspor, sedangkan domestik dapat sesuai KTP/SIM/Paspor. Karena setelah ini data penumpang tidak bisa diubah kembali.",
      },{
        title: "Nomor identitas dapat menggunakan KTP/SIM/Paspor/Kartu Pelajar.",
      },{
        title: "Nomor handphone yang diisikan harus benar untuk keperluan informasi keberangkatan.",
      },{
        title: "Jika tidak memiliki nomor handphone, penumpang dapat menggunakan nomor handphone keluarga atau kerabat dekat.",
      },{
        title: "KAMI TIDAK BERTANGGUNG JAWAB ATAS KESALAHAN PENGISIAN DATA PADA SAAT PENUKARAN TIKET ASLI.",
      },
    ];
  }, 
  TitleAdult() {
    return [
      {
        label: "Tuan",
        title : "Mr",
        gender : "M",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: true,
        slug : 'Adult'
      },{
        label: "Nyonya",
        title : "Mrs",
        gender : "F",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: false

      },{
        label: "Nona",
        title : "Miss",
        gender : "F",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: false
      }
    ];
  },
  TitleChild() {
    return [
      {
        label: "Tuan",
        title : "Mr",
        gender : "M",
        slug : "Child",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: true
      },{
        label: "Nona",
        title : "Miss",
        gender : "F",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: false
      }
    ];
  },
  TitleInfant() {
    return [
      {
        label: "Tuan",
        title : "Mr",
        gender : "M",
        slug : "Infant",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: true
      },{
        label: "Nona",
        title : "Miss",
        gender : "F",
        size: 20,
        color: '#dddddd',
        color_lable: 'black',
        selected: false
      }
    ];
  }
}