'use strict'
// form login and form registration //
const username = document.querySelector('#username')
const password = document.querySelector('#password')
const wrapperLogin = document.querySelector('.wrapper-login')
const wrapperRegistration = document.querySelector('.wrapper-registration')
const btnCreate = document.querySelector('#btn-create')
const createUsernameBtn = document.querySelector('#createUsernameBtn')
const createUsername = document.querySelector('#createUsername')
const btnOut = document.querySelector('#btnOut')
const sectionContent = document.querySelector('#sectionContent')
const formLogin = document.querySelector('.form-login')
const formRegistration = document.querySelector('.form-registration')
const login = document.querySelector('#login')
const error = document.querySelector('.error')
const errorCreate = document.querySelector('.error-create')
formLogin.addEventListener('submit', (e) => {
    e.preventDefault()
})
formRegistration.addEventListener('submit', (e) => {
    e.preventDefault()
})
wrapperRegistration.hidden = true
wrapperLogin.hidden = false
sectionContent.style.display = 'none'
btnCreate.addEventListener('click', () => {
    wrapperRegistration.hidden = false
    wrapperLogin.hidden = true
})
const btnOutClearElement = (parentElement, elemntDelete) => {
    const childElemnt = parentElement.querySelectorAll(elemntDelete)
    for (const child of childElemnt) {
        child.remove()
    }
}
const allInput = document.querySelectorAll('input')
const clearInputValue = () => {
    for (const input of allInput) {
        input.value = null
    }
}
btnOut.addEventListener('click', () => {
    location.hash = ''
    sectionContent.style.display = 'none'
    wrapperLogin.hidden = false
    btnOut.hidden = true
    btnOutClearElement(mySubscription, '.card')
    btnOutClearElement(purchasesBlock, '.purchases')
    clearElement(dataLists)
    listDisplayContainer.style.display = 'none'
    totalPercents.innerHTML = '0'
    clearInputValue()
    for (const key in localStorage) {
        localStorage[key] = ''
    }
})
const urls = [
    'http://157.230.108.157:3000/subscription/income-in-month',
    'http://157.230.108.157:3000/subscription/important-costs',
    'http://157.230.108.157:3000/subscription/money-box',
    'http://157.230.108.157:3000/subscription/subs',
    'http://157.230.108.157:3000/subscription/to-do-cost',
    'http://157.230.108.157:3000/subscription/to-do'
]
const requests = urls.map(url => fetch(url).then(res => res.json()));

const checkCondition = (elem) => elem.id === +localStorage['currentUserId'] && elem.userId === +localStorage['currentUserId']
async function fetchBasePack() {
    const promiseAll = await Promise.all(requests);
    const data = await promiseAll;
    let incomeBlock;
    let importantCostsBlock;
    let moneyBoxBlock;
    const subsBlock = [];
    const toDoCostBlock = [];
    const toDoBlock = [];
    for (const elementData of data) {
        for (const elem of elementData) {
            if (checkCondition(elem) && elem.salary) incomeBlock = elem
            if (checkCondition(elem) && elem.flatRent) importantCostsBlock = elem
            if (checkCondition(elem) && elem.accumulatePercent) moneyBoxBlock = elem
            if (elem.userId === +localStorage.currentUserId && elem.serviceName) subsBlock.push(elem)
            if (elem.userId === +localStorage.currentUserId && elem.payment) toDoCostBlock.push(elem)
            if (elem.userId === +localStorage.currentUserId && elem.listName) toDoBlock.push(elem)
        }
    }
    // incomeBlock drawing
    incomeSalary.value = incomeBlock.salary
    incomeSpinOf.value = incomeBlock.additional
    incomeFreelance.value = incomeBlock.freelance
    localStorage.setItem('incomeSalary', incomeBlock.salary)
    localStorage.setItem('incomeSpinOf', incomeBlock.additional)
    localStorage.setItem('incomeFreelance', incomeBlock.freelance)
    // importantCostsBlock drawing
    costsFlatRent.value = importantCostsBlock.flatRent
    costsHouseServices.value = importantCostsBlock.houseServices
    costsAuto.value = importantCostsBlock.transport
    costsCredit.value = importantCostsBlock.credits
    localStorage.setItem('costsFlatRent', importantCostsBlock.flatRent)
    localStorage.setItem('costsHouseServices', importantCostsBlock.houseServices)
    localStorage.setItem('costsAuto', importantCostsBlock.transport)
    localStorage.setItem('costsCredit', importantCostsBlock.credits)
    // moneyBoxBlock drawing
    moneyBoxRange.value = moneyBoxBlock.accumulatePercent
    accumulationInput.value = moneyBoxBlock.accumulate
    spendInput.value = moneyBoxBlock.spend
    totalPercents.innerHTML = moneyBoxBlock.accumulatePercent
    haveMoney.value = moneyBoxBlock.spend
    localStorage.setItem('accumulatePercent', moneyBoxBlock.accumulatePercent)
    localStorage.setItem('spendInput', moneyBoxBlock.accumulate)
    localStorage.setItem('spend', moneyBoxBlock.spend)
    // subsBlock drawing 
    for (const subs of subsBlock) {
        const addElement = `
            <div class="btn-delete-card"></div>
            <div class="service-name">
            <h1>${subs.serviceName}</h1>
        </div>
        <div class="service-logo">
            <div class="choose-a-logo" id="chooseALogo">
                <div id="logoInner" class="logo-inner">${subs.typeLogo}</div>
            </div>
        </div>
        <div class="content">
            <div class="type-subscription">
                <p>${subs.typeSubscription}</p>
            </div>
            <div class="cost-subscription">
                <span>Цена</span>
                <span>${subs.costSubscription}</span>
                <span>/месяц</span>
            </div>
        </div>
        `
        const card = document.createElement('div')
        card.classList.add('card')
        card.setAttribute('data-systemid', subs.id)
        card.innerHTML = addElement
        mySubscription.appendChild(card)
        btnDeleteSubscription = document.querySelectorAll('.btn-delete-card')
    }
    addEventDeleteBtnSubscriptions()
    // toDoCostBlock drawing
    for (const elem of toDoCostBlock) {
        haveMoney.value -= elem.payment
        const addElement = `
  <input type="number" class="purchases-cost" id="purchasesCost" readonly value="${elem.payment}">
  <input type="text" class="what-purchases" id="whatPurchases" readonly value="${elem.paymentText}">
  <button type="button" class="purchases-delete"></button>
  `
        const purchases = document.createElement('div')
        purchases.classList.add('purchases')
        purchases.setAttribute('data-systemid', elem.id)
        purchases.innerHTML = addElement
        purchasesBlock.appendChild(purchases)
        purchasesDelete = document.querySelectorAll('.purchases-delete')
    }
    addEventDeleteBtnPurchase()
    // toDoBlock drawing
    const currentUserTasksArr = []
    const uniqListNameCurrentUserArr = []
    toDoBlock.filter(elem => {
        if (elem.userId === +localStorage.currentUserId) {
            currentUserTasksArr.push(elem)
        }
    })
    currentUserTasksArr.filter(elem => {
        if (uniqListNameCurrentUserArr.indexOf(elem.listName) === -1) {
            uniqListNameCurrentUserArr.push(elem.listName)
        }
    })
    drawingListName(uniqListNameCurrentUserArr)
    calculationPercents()
    countingAvaibleMoney()
}
async function createBaseFecth() {
    const fetchCreateIncome = await fetch('http://157.230.108.157:3000/subscription/income-in-month', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: +localStorage.currentUserId,
            salary: 0,
            freelance: 0,
            additional: 0,
        })
    })
    const dataFetchCreateIncome = await fetchCreateIncome

    const fetchCreateImportantCost = await fetch('http://157.230.108.157:3000/subscription/important-costs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: +localStorage.currentUserId,
            flatRent: 0,
            houseServices: 0,
            transport: 0,
            credits: 0,
        }),
    })
    const dataFetchCreateImportantCost = await fetchCreateImportantCost

    const fetchCreateMoneyBox = await fetch('http://157.230.108.157:3000/subscription/money-box', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: +localStorage.currentUserId,
            accumulatePercent: 0,
            accumulate: 0,
            subscriptions: 0,
            spend: 0,
        }),
    });
    const dataFetchCreateMoneyBox = await fetchCreateMoneyBox
}
async function logIn() {
    const response = await fetch('http://157.230.108.157:3000/subscription/user')
    const data = await response.json()
    const objAllUsers = {}
    for (const user of data) {
        Object.assign(objAllUsers, { [user.id]: user.login })
    }
    let check = 0
    for (const user in objAllUsers) {
        if (username.value.trim() === objAllUsers[user]) {
            sectionContent.style.display = 'flex'
            wrapperLogin.hidden = true
            btnOut.hidden = false
            localStorage.setItem('currentUser', `${username.value}`)
            localStorage.setItem('currentUserId', `${user}`)
            check = 0
            return
        } else {
            check++
        }
    }
    if (check >= 1) {
        error.innerHTML = 'Такого пользователя не существует'
        username.classList.add('invaild')
        username.addEventListener('focus', () => {
            if (username.classList.contains('invaild')) {
                username.classList.remove('invaild')
                error.innerHTML = ''
                username.value = ''
            }
        })
        return
    }
    clearInputValue()
}

login.addEventListener('click', () => {
    if (username.value === '') return
    (async () => {
        await logIn()
        await fetchBasePack()
        calculationPercents()
        countingAvaibleMoney()
    })();
    localStorage.setItem('locationHash', 'costCalculator')
    location.hash = 'costCalculator'
})

async function createUser() {
    // Создаём пользователя
    const response = await fetch('http://157.230.108.157:3000/subscription/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: `${createUsername.value}`,
        }),
    })
    const data = await response.json()
    if (data.error) {
        errorCreate.innerHTML = 'Такой пользователь уже существует'
        createUsername.classList.add('invaild')
        createUsername.addEventListener('focus', () => {
            if (createUsername.classList.contains('invaild')) {
                createUsername.classList.remove('invaild')
                errorCreate.innerHTML = ''
                createUsername.value = ''
            }
        })
        return
    } else {
        sectionContent.style.display = 'flex'
        wrapperLogin.hidden = true
        btnOut.hidden = false
        wrapperRegistration.hidden = true
        localStorage.setItem('currentUser', `${createUsername.value}`)
        clearInputValue()
    }
    // Получаем и сохраняем id пользователя
    const getUser = await fetch('http://157.230.108.157:3000/subscription/user')
    const dataGetUser = await getUser.json()
    for (const user of dataGetUser) {
        if (user.login === localStorage['currentUser']) localStorage.setItem('currentUserId', `${user.id}`)
    }
    createBaseFecth()
}

createUsernameBtn.addEventListener('click', () => {
    if (!createUsername.value) return
    createUser()
})


if (localStorage.getItem('currentUser') !== '') {
    wrapperRegistration.hidden = true
    wrapperLogin.hidden = true
    sectionContent.style.display = 'flex'
}
//  cost calculator //
const costCalculator = document.querySelector('#costCalculator')
const saveCost = document.querySelector('#saveCost')
//  income block
const incomeSalary = document.querySelector('#incomeSalary')
const incomeSpinOf = document.querySelector('#incomeSpinOf')
const incomeFreelance = document.querySelector('#incomefreelance')
// importatnt cost block
const costsFlatRent = document.querySelector('#costsFlatRent')
const costsHouseServices = document.querySelector('#costsHouseServices')
const costsAuto = document.querySelector('#costsAuto')
const costsCredit = document.querySelector('#costsCredit')
// other cost block
const otherCostSubscriptions = document.querySelector('#otherCostSubscriptions')
const otherCostSeasonTickets = document.querySelector('#otherCostSeasonTickets')
const otherCostMobilePhone = document.querySelector('#otherCostMobilePhone')
// total block
const incomeTotal = document.querySelector('#incomeTotal')
// money
let totalMonth = document.querySelector('#totalMonth')
totalMonth.value = 0
let totalDay = document.querySelector('#totalDay')
totalDay.value = 0
let totalYear = document.querySelector('#totalYear')
totalYear.value = 0
let totalPerMonth
// money box range
const moneyBoxRange = document.querySelector('#moneyBoxRange')
const totalPercents = document.querySelector('#totalPercents')
// accumulation сколько копим
let accumulation = 0
const accumulationInput = document.querySelector('#accumulationInput')
accumulationInput.value = 0
// spend сколько тратим 
const spendInput = document.querySelector('#spendInput')
spendInput.value = 0
// все инпуты
const inputs = document.querySelectorAll('input')
// строка в число
const strToNum = str => str.value ? parseInt(str.value) : 0
// доступно денег в месяц
const countingAvaibleMoney = () => {
    const totalIncomePerMonth = strToNum(incomeSalary) + strToNum(incomeSpinOf) + strToNum(incomeFreelance)
    const totalCostsPerMonth = strToNum(costsFlatRent) + strToNum(costsHouseServices) + strToNum(costsAuto) + strToNum(costsCredit)
    totalPerMonth = totalIncomePerMonth - totalCostsPerMonth
    totalMonth.value = totalPerMonth
    totalDay.value = (totalPerMonth / 30).toFixed()
}
// слушатель изменения инпутов
for (const input of inputs) {
    input.addEventListener('input', () => {
        countingAvaibleMoney()
        calculationPercents()
    })
}
// процент копилки
moneyBoxRange.addEventListener('input', e => {
    totalPercents.innerHTML = e.target.value
    calculationPercents()
})
// сколько накопим
const calculationPercents = () => {
    accumulation = ((totalPerMonth * +moneyBoxRange.value) / 100).toFixed();
    accumulationInput.value = accumulation;
    spendInput.value = totalPerMonth - +accumulation;
    totalYear.value = (+accumulation * 12).toFixed();
}


async function saveCostFunc() {

    // Сохряняем и перезаписываем данные

    const fetchIncomeCost = await fetch(`http://157.230.108.157:3000/subscription/income-in-month/${localStorage['currentUserId']}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            salary: +incomeSalary.value,
            freelance: +incomeSpinOf.value,
            additional: +incomeFreelance.value,
            userId: +localStorage['currentUserId'],
        }),
    })
    const dataIncomeCost = await fetchIncomeCost.json()
    const fetchImportantCost = await fetch(`http://157.230.108.157:3000/subscription/important-costs/${localStorage['currentUserId']}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: +localStorage['currentUserId'],
            flatRent: +costsFlatRent.value,
            houseServices: +costsHouseServices.value,
            transport: +costsAuto.value,
            credits: +costsCredit.value,
        }),
    })
    const dataImportantCost = await fetchImportantCost.json()

    const fetchMoneyBox = await fetch(`http://157.230.108.157:3000/subscription/money-box/${localStorage['currentUserId']}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: +localStorage['currentUserId'],
            accumulatePercent: +moneyBoxRange.value,
            accumulate: +accumulationInput.value,
            subscriptions: 0,
            spend: +spendInput.value,
        }),
    })
    const dataMoneyBoxCost = await fetchMoneyBox.json()

    // Получаем перезаписанные данные

    const getFetchIncomeCost = await fetch(`http://157.230.108.157:3000/subscription/income-in-month?userId=${localStorage['currentUserId']}`)

    const dataGetFetchIncomeCost = await getFetchIncomeCost.json()

    const getFetchImportantCost = await fetch(`http://157.230.108.157:3000/subscription/important-costs?userId=${localStorage['currentUserId']}`)

    const dataGetFetchImportantCost = await getFetchImportantCost.json()

    const getFetchMoneyBox = await fetch(`http://157.230.108.157:3000/subscription/money-box?userId=${localStorage['currentUserId']}`)

    const dataGetFetchMoneyBox = await getFetchMoneyBox.json()
    localStorage['incomeSalary'] = dataGetFetchIncomeCost[0].salary
    localStorage['incomeSpinOf'] = dataGetFetchIncomeCost[0].additional
    localStorage['incomeFreelance'] = dataGetFetchIncomeCost[0].freelance

    localStorage['costsFlatRent'] = dataGetFetchImportantCost[0].flatRent
    localStorage['costsHouseServices'] = dataGetFetchImportantCost[0].houseServices
    localStorage['costsAuto'] = dataGetFetchImportantCost[0].transport
    localStorage['costsCredit'] = dataGetFetchImportantCost[0].credits

    localStorage['accumulatePercent'] = dataGetFetchMoneyBox[0].accumulatePercent
    localStorage['spendInput'] = dataGetFetchMoneyBox[0].accumulate
    localStorage['spend'] = dataGetFetchMoneyBox[0].spend
}

saveCost.addEventListener('click', () => {
    saveCost.setAttribute('disabled', 'true')
    saveCostFunc()
    localStorage['spend'] = +spendInput.value
    haveMoney.value = +localStorage['spend']
    for (const elem of document.querySelectorAll('#purchasesCost')) {
        haveMoney.value -= +elem.value
    }
    saveCost.removeAttribute('disabled')
})
//Menu 
const menu = document.querySelector('#menu')
const menuNav = document.querySelector('.menu-nav')
const menuBtnMobile = document.querySelector('#menuBtnMobile')
menuBtnMobile.addEventListener('click', (e) => {
    if (document.body.offsetWidth <= 490) {
        menuBtnMobile.classList.toggle('menu-btn_active')
        menuNav.classList.toggle('menu-nav_active')
        document.body.classList.toggle('lock')
        menu.classList.toggle('active')
    } else {
        menuBtnMobile.classList.toggle('menu-btn_active')
        menuNav.classList.toggle('menu-nav_active')
    }
})
menu.addEventListener('click', (e) => {
    if (document.body.offsetWidth <= 490 && e.target.tagName === 'LI') {
        menuBtnMobile.classList.toggle('menu-btn_active')
        menuNav.classList.toggle('menu-nav_active')
        document.body.classList.toggle('lock')
        menu.classList.toggle('active')
    }
})

//Subscriptions


const subscriptions = document.querySelector('#subscriptions')
const chooseALogo = document.querySelector('#chooseALogo')
const typesOfLogo = document.querySelector('#typesOfLogo')
const logoInner = document.querySelector('#logoInner')
const typesOfLogo2 = document.querySelector('.types-of-logo')
const addSubscriptions = document.querySelector('#addSubscriptions')
const modalAddSubscrtiption = document.querySelector('#modalAddSubscrtiption')
const mySubscription = document.querySelector('#mySubscription')
const addModalBtn = document.querySelector('#addModalBtn')
const closeModalBtn = document.querySelector('#closeModalBtn')
const serviceName = document.querySelector('#serviceName')
const typeSubscription = document.querySelector('#typeSubscription')
const costSubscription = document.querySelector('#costSubscription')
const selectCurrency = document.querySelector('#selectCurrency')
const content = document.querySelector('.content')
const body = document.querySelector('body')
let btnDeleteSubscription = document.querySelectorAll('.btn-delete-card')
let pdR
const modalPaddingRight = () => {
    const windows = window.innerWidth
    const clientWindow = document.documentElement.clientWidth
    pdR = windows - clientWindow
}
addSubscriptions.addEventListener('click', () => {
    modalAddSubscrtiption.classList.toggle('active')
    content.classList.toggle('active')
    subscriptions.classList.toggle('active')
    modalPaddingRight()
    modalAddSubscrtiption.style.paddingRight = pdR + 'px'
    body.classList.toggle('lock')
    serviceName.value = ''
    typeSubscription.value = ''
    costSubscription.value = ''
    logoInner.innerHTML = 'Bыбрыть лого'
})
chooseALogo.addEventListener('click', (e) => {
    typesOfLogo2.classList.toggle('active')
    const img = document.createElement('img')
    const target = e.target.tagName === 'DIV' ? e.target : e.target.parentElement
    if (!target.lastElementChild) return
    img.src = target.lastElementChild.getAttribute('src')
    logoInner.innerHTML = ''
    logoInner.appendChild(img)
})

async function setSystemId() {
    const response = await fetch(`http://157.230.108.157:3000/subscription/subs?userId=${localStorage['currentUserId']}`)
    const data = await response.json()
    const serviceName = mySubscription.lastElementChild.querySelector('.service-name > h1').innerHTML
    const typeSubscription = mySubscription.lastElementChild.querySelector('.type-subscription > p').innerHTML
    for (const elem of data) {
        if (elem.serviceName === serviceName && elem.typeSubscription === typeSubscription) {
            mySubscription.lastElementChild.setAttribute('data-systemid', elem.id)
        }
    }
}

addModalBtn.addEventListener('click', () => {
    (async function () {
        const response = await fetch('http://157.230.108.157:3000/subscription/subs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: +localStorage['currentUserId'],
                serviceName: serviceName.value,
                typeLogo: logoInner.innerHTML,
                typeSubscription: typeSubscription.value,
                costSubscription: +costSubscription.value,
            }),
        })
        const data = await response.json()
    }())
    const addElement = `
    <div class="btn-delete-card"></div>
    <div class="service-name">
    <h1>${serviceName.value}</h1>
    </div>
    <div class="service-logo">
    <div class="choose-a-logo" id="chooseALogo">
        <div id="logoInner" class="logo-inner">${logoInner.innerHTML}</div>
    </div>
    </div>
    <div class="content">
    <div class="type-subscription">
        <p>${typeSubscription.value}</p>
    </div>
    <div class="cost-subscription">
        <span>Цена</span>
        <span>${costSubscription.value}</span>
        <span>/месяц</span>
    </div>
    </div>
    `
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = addElement
    mySubscription.appendChild(card)
    btnDeleteSubscription = document.querySelectorAll('.btn-delete-card')
    body.style.paddingRight = `0px`
    modalAddSubscrtiption.classList.remove('active')
    content.classList.remove('active')
    subscriptions.classList.remove('active')
    body.classList.remove('lock')
    addEventDeleteBtnSubscriptions()
    setTimeout(setSystemId, 1000)
})
closeModalBtn.addEventListener('click', () => {
    body.style.paddingRight = `0px`
    modalAddSubscrtiption.classList.toggle('active')
    content.classList.remove('active')
    subscriptions.classList.remove('active')
    body.classList.remove('lock')
})
const addEventDeleteBtnSubscriptions = () => {
    for (const btn of btnDeleteSubscription) {
        btn.addEventListener('click', e => {
            btnDeleteSubscription = document.querySelectorAll('.btn-delete-card');
            const systemId = e.target.parentElement.dataset.systemid;
            (async () => {
                const response = await fetch(`http://157.230.108.157:3000/subscription/subs/${systemId}`, { method: 'DELETE' });
                const data = await response;
            })()
            e.target.parentElement.remove()
        })
    }
}


// TO DO Cost 
const ToDoCost = document.querySelector('#ToDoCost')
const createPayments = document.querySelector('#createPayments')
const haveMoney = document.querySelector('#haveMoney')
const howCost = document.querySelector('#howCost')
const whatPay = document.querySelector('#whatPay')
const send = document.querySelector('.send > svg')
const purchasesBlock = document.querySelector('#purchasesBlock')
let purchasesDelete = document.querySelectorAll('.purchases-delete')

const funcAddPurchase = () => {
    const addElement = `
    <input type="number" class="purchases-cost" id="purchasesCost" readonly value="${howCost.value}">
    <input type="text" class="what-purchases" id="whatPurchases" readonly value="${whatPay.value}">
    <button type="button" class="purchases-delete"></button>
    `
    const addedElem = document.createElement('div')
    addedElem.classList.add('purchases')
    addedElem.innerHTML = addElement
    purchasesBlock.appendChild(addedElem)
    haveMoney.value = +haveMoney.value - +howCost.value
    howCost.value = ''
    whatPay.value = ''
    purchasesDelete = document.querySelectorAll('.purchases-delete')
}
send.addEventListener('click', () => {
    if (howCost.value !== '' && whatPay.value !== '') {
        (async () => {
            const response = await fetch('http://157.230.108.157:3000/subscription/to-do-cost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: +localStorage['currentUserId'],
                    total: +haveMoney.value,
                    payment: +howCost.value,
                    paymentText: whatPay.value,
                }),
            })
            const data = await response.json()
            console.log(data);
        })()
        funcAddPurchase()
        addEventDeleteBtnPurchase()
        setTimeout(setSystemIdPurchase, 1000)
    }
})
createPayments.addEventListener('keypress', e => {
    if (e.keyCode === 13 && howCost.value !== '' && whatPay.value !== '') {
        (async () => {
            const response = await fetch('http://157.230.108.157:3000/subscription/to-do-cost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: +localStorage['currentUserId'],
                    total: +haveMoney.value,
                    payment: +howCost.value,
                    paymentText: whatPay.value,
                }),
            })
            const data = await response
        })()
        funcAddPurchase()
        addEventDeleteBtnPurchase()
        setTimeout(setSystemIdPurchase, 1000)
    }
})

async function setSystemIdPurchase() {
    const response = await fetch(`http://157.230.108.157:3000/subscription/to-do-cost?userId=${localStorage['currentUserId']}`)
    const data = await response.json()
    const payment = +purchasesBlock.lastElementChild.querySelector('#purchasesCost').value
    const paymentText = purchasesBlock.lastElementChild.querySelector('#whatPurchases').value
    for (const elem of data) {
        if (elem.payment === payment && elem.paymentText === paymentText) {
            purchasesBlock.lastElementChild.setAttribute('data-systemid', elem.id)
        }
    }
}

const addEventDeleteBtnPurchase = () => {
    for (const btn of purchasesDelete) {
        btn.addEventListener('click', e => {
            purchasesDelete = document.querySelectorAll('.purchases-delete');
            const systemId = e.target.parentElement.dataset.systemid;
            (async () => {
                const response = await fetch(`http://157.230.108.157:3000/subscription/to-do-cost/${systemId}`, { method: 'DELETE' });
                const data = await response
            })()
            let totalHaveMoney = +haveMoney.value
            totalHaveMoney = +e.target.parentElement.firstElementChild.value
            haveMoney.value = +haveMoney.value + totalHaveMoney
            e.target.parentElement.remove()
        })
    }
}


// TO DO

const ToDo = document.querySelector('#ToDo')
const toDoBody = document.querySelector('#toDoBody')
const listsContainer = document.querySelector('#dataLists')
const newListForm = document.querySelector('#newListForm')
const newListInput = document.querySelector('#newListInput')
const deleteListButton = document.querySelector('#deleteListButton')
const listDisplayContainer = document.querySelector('#listDisplayContainer')
const listTitleElement = document.querySelector('#listTitleElement')
const listCountElement = document.querySelector('#listCountElement')
const tasksContainer = document.querySelector('#tasksContainer')
const taskTemplate = document.querySelector('#task-template')
const newTaskForm = document.querySelector('#newTaskForm')
const newTaskInput = document.querySelector('#newTaskInput')
const clearCompleteTasksButton = document.querySelector('#clearCompleteTasksButton')
const dataLists = document.querySelector('#dataLists')

listDisplayContainer.style.display = 'none'

const createTaskFunc = (container, text, id, dataId, complete) => {
    const createDiv = document.createElement('div')
    createDiv.setAttribute('data-listName', localStorage['currentList'])
    createDiv.setAttribute('data-systemId', dataId)
    createDiv.classList.toggle('task')
    createDiv.innerHTML = `
    <input type="checkbox" id="${id}">
    <label for="${id}">
                <span class="custom-checkbox"></span>
                ${text}
    </label>
    `;
    if (complete === true) createDiv.lastElementChild.classList.add('checked')
    container.appendChild(createDiv)
    id++
}
const clearElement = (element) => {
    while (element.firstChild) {
        if (element.firstChild == null) break
        element.removeChild(element.firstChild)
    }
}
newListForm.addEventListener('submit', e => {
    e.preventDefault()
    if (newListInput.value == null || newListInput.value === '') return
    const creatLi = document.createElement('li')
    creatLi.classList.add('list-name')
    creatLi.innerHTML = newListInput.value
    newListInput.value = ''
    dataLists.appendChild(creatLi)
})
const drawingListName = (array) => {
    for (const elem of array) {
        const creatLi = document.createElement('li')
        creatLi.classList.add('list-name')
        creatLi.innerHTML = elem
        dataLists.appendChild(creatLi)
    }
}
newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    (async () => {
        const response = await fetch('http://157.230.108.157:3000/subscription/to-do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: +localStorage['currentUserId'],
                listName: localStorage['currentList'],
                name: newTaskInput.value,
                complete: false,
            }),
        })
        const data = await response;
        console.log(data)
        console.log(data.id)
        localStorage.setItem('TaskId', data.id)
    })()
    const createDiv = document.createElement('div')
    createDiv.setAttribute('data-listName', localStorage['currentList'])
    createDiv.setAttribute('data-systemId', +localStorage['TaskId'])
    createDiv.classList.toggle('task')
    createDiv.innerHTML = `
    <input type="checkbox" id="${Date.now().toString()}">
    <label for="${Date.now().toString()}">
                <span class="custom-checkbox"></span>
                ${newTaskInput.value}
    </label>
    `
    tasksContainer.appendChild(createDiv)
    newTaskInput.value = null
})

dataLists.addEventListener('click', (e) => {
    let currentList
    if (e.target.tagName.toLowerCase() === 'li') {
        currentList = e.target.innerHTML;
        localStorage.setItem('currentList', currentList);
        listDisplayContainer.style.display = '';
        listTitleElement.innerHTML = localStorage.currentList;
        (async () => {
            const response = await fetch('http://157.230.108.157:3000/subscription/to-do');
            const data = await response.json();
            clearElement(tasksContainer)
            const arrCurrentList = [];
            for (const elem of data) {
                if (elem.listName === localStorage.currentList) {
                    arrCurrentList.push(elem)
                }
            }
            let id = 0
            for (const elem of arrCurrentList) {
                createTaskFunc(tasksContainer, elem.name, id, elem.id, elem.complete)
                id++
            }
            console.log(data)
        })()

    }
})

async function toDoSystemId(complete, systemId) {
    const fetchToDoSystemId = await fetch(`http://157.230.108.157:3000/subscription/to-do/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: +localStorage.currentUserId,
            complete: complete,
        }),
    })
    const dataFetchToDoSystemId = await fetchToDoSystemId.json()
    console.log(dataFetchToDoSystemId);
}

let arrInputChecked = [];
tasksContainer.addEventListener('click', e => {
    const target = e.target.tagName === 'LABEL' ? e.target : e.target.parentElement
    if (target.tagName === 'DIV') return
    if (target) {
        target.classList.toggle('checked')
        if (!target.classList.contains('checked')) {
            const systemId = target.parentElement.dataset.systemid;
            (async () => {
                const fetchToDoSystemId = await fetch(`http://157.230.108.157:3000/subscription/to-do/${systemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: +localStorage.currentUserId,
                        complete: false,
                    }),
                })
                const dataFetchToDoSystemId = await fetchToDoSystemId
                console.log(dataFetchToDoSystemId);
            })()
            // toDoSystemId(false,systemId)
        } else {
            const systemId = target.parentElement.dataset.systemid;
            (async () => {
                const fetchToDoSystemId = await fetch(`http://157.230.108.157:3000/subscription/to-do/${systemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: +localStorage.currentUserId,
                        complete: true,
                    }),
                })
                const dataFetchToDoSystemId = await fetchToDoSystemId
                console.log(dataFetchToDoSystemId);
            })()
            // toDoSystemId(true,systemId)
        }
    }
})
const clearCompleteTask = (container, elementDelete) => {
    const childElemnt = container.querySelectorAll(elementDelete)
    for (let i = 0; i < childElemnt.length; i++) {
        childElemnt[i].parentElement.remove()
    }
}
clearCompleteTasksButton.addEventListener('click', e => {
    const arrCheckedElement = []
    const arrCheckLabel = tasksContainer.querySelectorAll('.checked')
    for (const elem of arrCheckLabel) {
        arrCheckedElement.push(elem.parentElement)
    }
    for (const elem of arrCheckedElement) {
        const systemId = elem.dataset.systemid;
        (async () => {
            const fetchToDoSystemId = await fetch(`http://157.230.108.157:3000/subscription/to-do/${systemId}`, { method: 'DELETE' })
            const dataFetchToDoSystemId = await fetchToDoSystemId.json();
        })()
    }
    clearCompleteTask(tasksContainer, '.checked')
})

deleteListButton.addEventListener('click', e => {
    const datalistsArr = dataLists.querySelectorAll('.list-name')
    for (const elem of datalistsArr) {
        if (elem.innerHTML === localStorage['currentList']) elem.remove()
    };
    const deleteList = tasksContainer.querySelectorAll('.task')
    for (const elem of deleteList) {
        const systemId = elem.dataset.systemid;
        (async () => {
            const response = await fetch(`http://157.230.108.157:3000/subscription/to-do/${systemId}`, { method: 'DELETE' })
            const data = await response.json()
        })()
        clearElement(tasksContainer)
    }
    listDisplayContainer.style.display = 'none'
})


const burgerMobileBtn = document.querySelector('#burgerMobileBtn')
const allTasks = document.querySelector('#allTasks')
let count = 1
burgerMobileBtn.addEventListener('click', (e) => {
    if (count === 1) {
        burgerMobileBtn.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
        <h2 class="task-list-title-mobile">Мои списки</h2>
        `
        allTasks.classList.add('show')
        document.body.classList.add('lock')
        document.body.classList.add('body-bgc-to-do-mobile')
        count++
    } else if (count === 2) {
        burgerMobileBtn.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>
        <h2 class="task-list-title-mobile">Мои списки</h2>
        `
        allTasks.classList.remove('show')
        document.body.classList.remove('lock')
        document.body.classList.remove('body-bgc-to-do-mobile')
        count--
    }
})
allTasks.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        burgerMobileBtn.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>
        <h2 class="task-list-title-mobile">Мои списки</h2>
        `
        allTasks.classList.remove('show')
        document.body.classList.remove('lock')
        document.body.classList.remove('body-bgc-to-do-mobile')
        count--
    }
})

const menuNavigaton = document.querySelector('.menu-nav')
let objForMenu = {
    costCalculator: '',
    ToDoCost: 'none',
    ToDo: 'none',
    subscriptions: 'none',
}

menuNavigaton.addEventListener('click', e => {
    const menuPoint = e.target.dataset.pointmenu
    localStorage.locationHash = menuPoint
    location.hash = menuPoint
    document.querySelector(`#${menuPoint}`).style.display = ''
    for (const key in objForMenu) {
        if (key === menuPoint) continue
        document.querySelector(`#${key}`).style.display = 'none'
    }
})

ToDoCost.style.display = 'none'
ToDo.style.display = 'none'
subscriptions.style.display = 'none'
costCalculator.style.display = ''

// Сохранение состояния страницы после перезагрузки 
const changeLocation = () => {
    switch (location.hash) {
        case '#costCalculator':
            costCalculator.style.display = ''
            ToDo.style.display = 'none'
            ToDoCost.style.display = 'none'
            subscriptions.style.display = 'none'
            break;
        case '#subscriptions':
            costCalculator.style.display = 'none'
            ToDo.style.display = 'none'
            ToDoCost.style.display = 'none'
            subscriptions.style.display = ''
            break;
        case '#ToDo':
            costCalculator.style.display = 'none'
            ToDo.style.display = ''
            ToDoCost.style.display = 'none'
            subscriptions.style.display = 'none'
            break;
        case '#ToDoCost':
            costCalculator.style.display = 'none'
            ToDo.style.display = 'none'
            ToDoCost.style.display = ''
            subscriptions.style.display = 'none'
            break;
        default:
            sectionContent.style.display = 'none'
            wrapperLogin.hidden = false
            break;
    }
}
window.addEventListener('hashchange', changeLocation)

if (localStorage['currentUserId'] !== '') {
    (async () => {
        await fetchBasePack()
        calculationPercents()
        countingAvaibleMoney()
    })();
    wrapperLogin.hidden = true
    location.hash = `#${localStorage.locationHash}`
    changeLocation()
}
changeLocation()