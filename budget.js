const budgetDate = document.querySelector('#container-date')
const budgetTotal = document.getElementById('grandTotal')
const totalInc = document.getElementById('totalInc')
const totsExpense = document.getElementById('totalExp')
const totalPerc = document.getElementById('totalPercent')
const select = document.getElementById('IncExp')
const mainInp = document.getElementById('mainAccess')
const numb = document.getElementById('numb')
const bigIcon = document.getElementById('bigIcon')
const incomeList = document.querySelector('.incomeList__inner')
const expenseList = document.querySelector('.expenseList__inner')
const focs = Array.from(document.querySelectorAll('.foc'))

/* Default */
deFunc()

let checkOps = '+'
let incomeBud = []
let expenseBud = []
let budget = {
  income: 0,
  expense: 0,
  percentage: 0,
  total: 0
}


/* Calulate New Budget */
const newBudget = (name, value, budg) => {

  /* Create obj */
  const obj = {
    name,
    value
  }

  /* Calculate for percentage */
  if (checkOps === '-') {
    let perc = Math.round((obj.value / budget.income) * 100)
    obj.percent = perc
  }


  /* Add to budget */
  budg.push(obj)

  /* General Calculations */
  genCalc(budg)

  return obj
}

const updateBudget = (total, curBud, eachbud, eachOut) => {
  let modTotal = modify(`${total}`)
  let modBudg = modify(`${curBud}`)
  
  /* Display Total Budget */
  budgetTotal.innerText = budget.total < 0 ? `- ${modTotal.slice(1)}.00` : `+ ${modTotal}.00`

  /* Diplay Total Inc or Exp  */
  eachOut.innerText = `${modBudg}.00`

  /* Display Total percent */
  totalPerc.innerText = budget.percentage === 0 || budget.percentage === Infinity || budget.percentage > 100 ? `___` : budget.percentage + '%'

  /* Each Inc or Exp */
  let modifyBud = modify(`${eachbud.value}`)
  checkOps === '+' ?
    (modifyBud = `+ ${modifyBud}`,
      eachModify(modifyBud, eachbud, incomeList, 'incomeList')) :
    (modifyBud = `- ${modifyBud}`,
      eachModify(modifyBud, eachbud, expenseList, 'expenseList')) 
}


bigIcon.addEventListener('click', () => {
  if (mainInp.value.trim() !== '' && numb.value.trim() !== '') {

    /* Get Current Inc Or Exp */
    let name = mainInp.value
    let value = parseFloat(numb.value)
  
    /* Calculate New Budget */
    let budg
    checkOps === '+' ?
      /* Add Budget income */
      (budg = newBudget(name, value, incomeBud),

      /* Update Budget income */
      updateBudget(budget.total, budget.income, budg, totalInc)) :

      /* Add Budget expense */
      (budg = newBudget(name, value, expenseBud),

      /* Update Budget expense */
      updateBudget(budget.total, budget.expense, budg, totsExpense)) ;

    /* Clear main and numb */
    mainInp.value = ''
    numb.value = ''
  }

})

const closeFunc = (element, curID, curForm) => {

  curForm === 'income' ? 
    (
      /* Remove Elemnt from budget */
      incomeBud = incomeBud.filter((cur, id) => curID !== id),

      /* Calculate Changes */
      genCalc(incomeBud)
    ) :
    (
      /* Remove Elemnt from budget */
      expenseBud = expenseBud.filter((cur, id) => curID !== id),

      /* Calculate Changes */
      genCalc(expenseBud)
    );

  /* Modify Changes */
  let modTotal = modify(`${budget.total}`);
  let modInc = modify(`${budget.income}`);
  let modExp = modify(`${budget.expense}`);
  
  /* Update Total */
  budgetTotal.innerText = budget.total < 0 ? `- ${modTotal.slice(1)}.00` : `+ ${modTotal}.00`

  /* Update Inc & Exp */
  totalInc.innerHTML = `${modInc}.00`
  totsExpense.innerHTML = `${modExp}.00`

  /* Update Percentage */
  totalPerc.innerText = budget.percentage === 0 || budget.percentage === Infinity || budget.percentage > 100 ? `___` : budget.percentage + '%' 
  
  /* Update Each List */
  element.remove()

  /* Update Each Percentage */
  udpatePerc()
}

/* Cancel Icons */
document.addEventListener('click', e => {
  if (e.target.classList.contains('incomeList-each__icon')) {
    const incs = Array.from(document.querySelectorAll('.incomeList-each__icon'))
    incs.forEach((inc, id) => {
      if (inc === e.target) {
        closeFunc(e.target.parentNode.parentNode.parentNode, id, 'income')
      }
    })

  } else if (e.target.classList.contains('expenseList-each__icon')) {
    const exps = Array.from(document.querySelectorAll('.expenseList-each__icon'))
    exps.forEach((exp, id) => {
      if (exp === e.target) {
        closeFunc(e.target.parentNode.parentNode.parentNode, id, 'expense')
      }
    })
  }
})

/* Close Function */


/* General Calculation */
function genCalc(curBud) {
  let all = 0
  let percs = 0

  /* Calculate for income and expense */  
  curBud.forEach(bud => {
    all += bud.value
  })

  curBud == expenseBud ?
    budget.expense = all :
    budget.income = all;
  
  /* Get Total */
  budget.total = budget.income - budget.expense

  /* Recalculating All Percentages */
  expenseBud.forEach(exp => {
    let perc = Math.round((exp.value / budget.income) * 100)
    exp.percent = perc

    percs += exp.percent
  })

  budget.percentage = percs
}

/* Modify */
function modify(str) {
  if (str.length >= 4) {
    let here = str.split('')
    let ret = []
    let localstr = ''
    for (var i = here.length - 1; i >= 0; i--) {
      localstr = here[i] + localstr
      if (localstr.length === 3) {
        ret.unshift(localstr)
        if (i !== 0 && here[i - 1] !== '-') ret.unshift(',')
        localstr = ''
      } else {
        if (i === 0) {
          ret.unshift(localstr)
          localstr = ''
        }
      }
    }

    return ret.join('')
  } else { return str }
}

function eachModify(val, each, parent, str) {
  let eachDiv = document.createElement('div')
  eachDiv.setAttribute('class', `${str}__inner-each`) 

  let cent = each.percent === 0 || each.percent === Infinity || each.percent > 100 ? true : false
  let tage = ''

  if (cent) {
    tage = '___'
  } else {
    tage = `${each.percent}%`
  }

  eachDiv.innerHTML = `<div class="${str}-each__head"><p class="${str}-name">${each.name}</p></div><div class="${str}-each__body"><div class="${str}-each__body-number"><p class="${str}-numb">${val}.00</p></div><div class="${str}-each__body-perc"><p class="${str}-perc">${tage}</p></div><div class="${str}-each__body-icon"><ion-icon name="close-circle-outline" class="${str}-each__icon"></ion-icon></div></div>`

  parent.append(eachDiv) 
  
  /* Updating Percentages */
  udpatePerc()
}

function udpatePerc() {
  if (expenseBud.length > 0) {
    let listPerc = Array.from(document.querySelectorAll('.expenseList-perc'))

    listPerc.forEach((list, ind) => {
      let cent = expenseBud[ind].percent === 0 || expenseBud[ind].percent === Infinity || expenseBud[ind].percent > 100 ? true : false
      let tage = ''

      if (cent) {
        tage = '___'
      } else {
        tage = `${expenseBud[ind].percent}%`
      }

      list.innerHTML = `${tage}`
    })
  }
}

/* Listening For select */
select.addEventListener('change', cur => {

  checkOps = cur.target.value

  /* Big Icon Style */
  checkOps === '+' ? 
    bigIcon.style.color = '#28B9B5' : 
    bigIcon.style.color = '#FF5049';

  /* Style Select */
  bordChanges(select)
})


/* Input Body & Select styles */
focs.forEach(cur => cur.addEventListener('focusin', bordChanges.bind(this, cur)));

focs.forEach(cur => cur.addEventListener('focusout', () => {
  cur.style.borderColor = '#0000001c';
}));


function bordChanges(foc) {
  checkOps === '+' ?
    foc.style.borderColor = '#28B9B5' :
    foc.style.borderColor = '#FF5049';
}

function deFunc() {
  budgetTotal.innerText = '- 0.00'
  totalInc.innerText = ' 0.00'
  totsExpense.innerText = ' 0.00'
  totalPerc.innerText = '___'
}


/* Get Budget Date */
const currentDate = () => {
  const curMonth = new Date().toLocaleString(
    'default', { month: 'long'}
  )
  const curYear = new Date().getFullYear()

  budgetDate.innerHTML = `${curMonth} ${curYear}`;
}

currentDate()