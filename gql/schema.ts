const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
    type: String
    name: String
    phone: String
    uid: String
    pw: String
    email: String
    company: String
    position: String
    code: String
    accountName: String
    accountBank: String
    accountNum: String
}
type Bugo {
    bugoId: Int
    funeral: Funeral
    deceased: Deceased
    imprintTime: String
    buried: String
    sangjus: String
    writer: String
}
type Funeral {
    name: String
    address: String
    x: String
    y: String
    binso: String
}
type Deceased {
    name: String
    time: String
    age: String
    gender: String
}
type Sangju {
    odid: String
    bugoId: Int
    name: String
    relation: String
    phone: String
    accountName: String
    accountBank: String
    accountNum: String
}
type Flower {
    id: ID
    category: Int
    name: String
    price: Int
    discountRate: String
    originalPrice: Int
    deliveryFee: Int
    imgUrl: String
}

type BugoAndSangjus {
    bugo: Bugo
    sangjus: [Sangju]
}
type FAQ {
    category: String
    question: String
    answer: String
}


type BugoAndAccount {
    odid: String
    bugoId: Int
    deceasedName: String
    funeralName: String
    binso: String
    accountName: String
    accountBank: String
    accountNum: String
    sangjuName: String
}

type BugoMsg {
    bugoId: Int
    sender: String
    msg: String
}

type Account {
    name: String
    bank: String
    num: String
}

type AppliedServiceForMaster {
    sangju: String
    deceasedName: String
    accountName: String
    accountBank: String
    accountNum: String
    calcPrice: Int
}

type BugoAndCalc {
    bugoId: Int
    sangju: String
    deceasedName: String
    funeralName: String
    binso: String
    imprintTime: String
    calcPrice: Int
}

type LogFlower {
    odid: String
    orderTime: String
    bugoId: Int
    flowerId: String
    flowerName: String
    flowerPrice: Int
    imgUrl: String
    calcPrice: Int
    sangju: String
    deceasedName: String
}
type CommonLogFlower {
    send: [LogFlower]
    received: [LogFlower]
}

type OrderInfo {
    sender: NamePhone
    receiver: NamePhone
    deliveryFee: Int
    billingMethod: String
    destination: String
    memo: String
}

type NamePhone {
    name: String
    phone: String
}

type MasterInfo {
    name: String
    phone: String
    uid: String
    primaryValue: String
    email: String
    company: String
    position: String
    code: String
}

type CountForMain {
    cntMoney: String
    cntSangju: String
    cntUser: String
}

type Query {
    login(uid: String, pw: String, deviceKind: String, deviceKey: String): String
    loginNormal(name: String, phone: String, deviceKey: String, deviceKind: String, primaryValue: String, privateNum: String): String
    getTypeByToken(token: String): Int
    getAppliedBugoAndAccount(token: String): [BugoAndAccount]
    getMyCalcAccount(token: String): Account
    getMyCalcPrice(token: String): Int
    getBugoList(token: String, bugoId: Int, searchKeyword: String, page: Int): [Bugo]
    getAppliedSangju(token: String, bugoId: Int): [Sangju]
    getMyBugoList(token: String, page: Int): [Bugo]
    getMsgByBugoId(bugoId: Int): [BugoMsg]
    getFlowerByCategory(token: String, category: String, page: Int): [Flower]
    getMyFlower(token: String): CommonLogFlower
    getFlowerById(fid: Int): Flower
    getFlowerSenderByBugoId(bugoId: Int): [String]
    getFAQ: [FAQ]
    appliedService(token: String): [AppliedServiceForMaster]
    bugoListOfMaster(token: String): [BugoAndCalc]
    flowerOfMaster(token: String): [LogFlower]
    flowerOrderData(token: String, odid: String): OrderInfo
    totalSangju: Int
    myName(token: String): String
    myPhone(token: String): String
    myInfo(token: String): NamePhone
    getMaster(token: String): MasterInfo
    etcContent(title: String): String
    countForMain: CountForMain
    test(x: Int, y: Int): String
}

input UserInput {
    type: Int
    name: String
    phone: String
    uid: String
    pw: String
    email: String
    company: String
    position: String
    code: String
    deviceKind: String
    deviceKey: String
    primaryValue: String
    privateNum: String
}
input BugoInput {
    funeral: FuneralInput
    deceased: DeceasedInput
    imprintTime: String
    buried: String
    sangjus: String
}
input FuneralInput {
    name: String
    address: String
    x: String
    y: String
    binso: String
}
input DeceasedInput {
    name: String
    time: String
    age: String
    gender: String
}
input SangjuInput {
    name: String
    relation: String
    phone: String
}
input AccountInput {
    name: String
    bank: String
    num: String
}
input DestinationInput {
    address: String
    detail: String
    memo: String
}
input BillingFlowerInput {
    id: String
    name: String
    price: Int
    deliveryFee: Int
}
input LogFlowerInput {
    bugoId: Int
    deceasedName: String
    sangju: SangjuInput
    phrases: [String]
    destination: DestinationInput
    orderPerson: NamePhoneInput
    flower: BillingFlowerInput
    billing: BillingInput
}
input NamePhoneInput {
    name: String
    phone: String
}
input MoneyServiceInput {
    bugoId: Int
    account: AccountInput
    sangju: NamePhoneInput
    billing : BillingInput
}
input BillingInput {
    method: String!
    depositInfo: DepositInfo
    bizTalkType: String
    mid: String
}
input DepositInfo {
    checkedEmail: Boolean
    email: String
    checkedBill: Boolean
    billType: String
    billValue: String
}
input MasterInput {
    name: String
    uid: String
    pw: String
    phone: String
    code: String
    email: String
    company: String
    position: String
}

type ResultObj {
    code: Int
    msg: String
}
type Mutation {
    registerUser(input: UserInput): Boolean
    confirmCode(code: String): Boolean
    confirmPayment(mid: String): ResultObj
    checkId(uid: String): Boolean
    checkDI(di: String): Boolean
    updateMaster(input: MasterInput): Boolean
    appliableSangju(bugoId: Int , sangju: NamePhoneInput): Boolean
    registerAccount(token: String, account: AccountInput, mode: String, odid: String): ResultObj
    confirmAccount(token: String, account: AccountInput): Boolean
    addMsg(token: String, sender: String, msg: String, bugoId: Int): Boolean
    createBugo(token: String, input: BugoInput): Int
    updateBugo(token: String, bugoId: Int, input: BugoInput): Boolean
    deleteBugo(token: String, bugoId: Int): Boolean
    sendAccount(token: String, mode: String, phone: String, odid: String): Boolean
    paymentFlower(token: String, input: LogFlowerInput): ResultObj
    appliedLog(token: String, input: MoneyServiceInput): ResultObj
    counsel(token: String, email: String, content: String): Boolean
    leave(token: String, memo: String): Boolean
    plusCount(countType: String): Boolean
    test: Boolean
}
`);
