'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-11-25T23:36:17.929Z',
    '2022-11-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
  // currency: 'LEI',
  // locale: 'ro-RO',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// ======= 5️⃣ - 6️⃣ CREATING DOM ELEMENTS (BANKIST APP)=================

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Function for formatting currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(Math.abs(value));
};

const displayMovements = function (acc, sort = false) {
  // Empty container
  containerMovements.innerHTML = '';

  // Sorting
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // Call format currency function
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // Create template
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
    </div>
    `;
    // Inserto in html file
    // utilizam 'afterBegin' deoarece vrem sa afisam ultimele valori primele
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// 🔟 Calculate balance and print (BANKIST APP) =====================
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // Stocam valoarea in account current
  acc.balance = balance;

  // Call format currency function
  const formattedBalance = formatCur(balance, acc.locale, acc.currency);

  // labelBalance.textContent = `${balance.toFixed(2)} €`;
  labelBalance.textContent = `${formattedBalance}`;
};

// ======= 1️⃣2️⃣ Calculate display summary (BANKIST APP) =============

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Call format currency function
  const formattedInc = formatCur(incomes, acc.locale, acc.currency);
  labelSumIn.textContent = `${formattedInc}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Call format currency function
  const formattedOut = formatCur(out, acc.locale, acc.currency);
  labelSumOut.textContent = `${formattedOut}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // selectam valorle >= 1
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  // Call format currency function
  const formattedInt = formatCur(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${formattedInt}`;
};

// ======= 8️⃣ COMPUTING USERNAMES (BANKIST APP) ========================

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    // Adaugam un nou atribut "username" in obiectele din array-ul accounts
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

// Update User Interface
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // display balance
  calcDisplayBalance(acc);

  // display symmary
  calcDisplaySummary(acc);
};

// Log Out Timer Function
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 second, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = '0';
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

////////////////////////////////////////////////////////
///// Event handler
let currentAccount, timer;

// // FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// ======= 1️⃣4️⃣ IMPLEMENTING LOGIN (BANKIST APP) =====================

btnLogin.addEventListener('click', function (e) {
  // Prevent form for submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Current day when we log in

    // ============== 5️⃣ Internationalizing Dates (Intl) ===============
    // Experimenting with API
    // 💢 CREATING DATE BY THEIR COUNTRY
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // long
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    /////////////////////////5️⃣ Pana aici ///////////////////////////////

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // Pentru a scoate focus de pe pin input
    inputLoginPin.blur();

    // Calling log out timer function
    // 1. Check if timer exist so we can clear it
    if (timer) clearInterval(timer);
    // 2. Calling function
    timer = startLogOutTimer();

    containerApp.style.opacity = '1';

    // Update UI
    updateUI(currentAccount);
  }
});

// ======= 1️⃣5️⃣ IMPLEMENTING TRANSFERS (BANKIST APP) =================

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear fields
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// ================ 1️⃣7️⃣ REQUEST LOAN (BANKIST APP) =================

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);

    // Clear input filed
    inputLoanAmount.value = '';
  }
});

// ======= 1️⃣6️⃣ THE FIND INDEX METHOD (BANKIST APP) =================

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // findIndex() -  return the index specified
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    // Delete.account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = '0';
  }

  // Clear fields
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort button

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);

  // Change value of sorted
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// =============== 1️⃣ Converting and Checking Numbers ==============

// console.log(23 === 23.0); // true

// // Base 10: 0 to 9. || 1/10 = 0.1. 3/10= 3.33333
// // Binary base 2: 0 1

// console.log(0.1 + 0.2); // 0.30000000000000004
// console.log(0.1 + 0.2 === 0.3); // false

// // Convert string to number

// // With Number()
// console.log(Number('23')); // 23

// // With + operator
// console.log(+'23'); // 23

// // Parsing
// // regex - 10 (for Base) and 2 (for Binary)
// console.log(Number.parseInt('30px', 10)); // 30

// // ❗❗❗ Trebuie sa inceapa cu un numar
// console.log(Number.parseInt('e30', 10)); // NaN

// console.log(Number.parseInt('2.5rem')); // 2
// console.log(Number.parseFloat('2.5rem')); // 2.5

// // Check if value is NaN
// console.log(Number.isNaN(20)); //false
// console.log(Number.isNaN('20')); //false
// console.log(Number.isNaN(+'20x')); //true
// console.log(Number.isNaN(23 / 0)); //true because return infinity

// // Checking if value is number
// console.log(Number.isFinite(20)); //true
// console.log(Number.isFinite('20')); //false
// console.log(Number.isFinite(+'20x')); //false
// console.log(Number.isFinite(23 / 0)); //false

// console.log(Number.isInteger(23)); //true
// console.log(Number.isInteger(23.0)); //true
// console.log(Number.isInteger(23 / 0)); //false

// =============== 2️⃣ Math and Rounding ======================

// // sqrt - radacina patrata a unui numar
// console.log(Math.sqrt(25)); // 5
// console.log(25 ** (1 / 2)); // 5
// console.log(8 ** (1 / 3)); // 2

// // max()
// console.log(Math.max(5, 18, 23, 11, 2)); // 23
// console.log(Math.max(5, 18, '23', 11, 2)); // 23
// console.log(Math.max(5, 18, '23px', 11, 2)); // NaN

// // min
// console.log(Math.max(5, 18, 23, 11, 2)); // 2

// // Aria unui cerc cu radius de 10px
// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// // random()
// console.log(Math.trunc(Math.random() * 6) + 1);

// // Random function
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max-min) -> min...max

// console.log(randomInt(10, 20));

// // Rounding integers
// console.log(Math.trunc(23.3)); // 23

// console.log(Math.round(23.3)); // 23
// console.log(Math.round(23.9)); // 24

// console.log(Math.ceil(23.3)); // 24
// console.log(Math.ceil(23.9)); // 24

// console.log(Math.floor(23.3)); // 23
// console.log(Math.floor(23.9)); // 23

// console.log(Math.trunc(-23.3)); // -23
// console.log(Math.floor(-23.3)); // -24

// // Rounding decimals
// // toFixed always return a string
// console.log((2.7).toFixed(0)); // '3'
// console.log((2.7).toFixed(3)); // '2.700'
// console.log((2.345).toFixed(2)); // '2.35'
// // Convert string to number
// console.log(+(2.345).toFixed(2)); // 2.35

// =============== 3️⃣ The Remainder Operator (%) =====================

// console.log(5 % 2); // 1
// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(8 % 3); // 2
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(6 % 2); // 0
// console.log(6 / 2); // 6 = 2 * 3 + 0

// // Verificare numar par
// const isEven = n => n % 2 === 0;
// console.log(isEven(8)); // true
// console.log(isEven(23)); // false
// console.log(isEven(514)); // true

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0,2,4,6,8,...
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0,3,6,9...
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// ================= 3️⃣ Numeric Separators (_) =====================

// // 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.1415;
// console.log(PI); // 3.1415

// // Does not work like this 👇
// console.log(Number('230_000')); // NaN
// console.log(parseInt('230_000')); // 230

// ================= 3️⃣ Working with BigInt =====================

// Biggest number in JS that can be represented
// console.log(2 ** 53 - 1); // 9007199254740991
// console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// // n Transform a regular number to Big Int number
// console.log(43563456456456456465435n);
// console.log(BigInt(43563456456456456465435));

// // Operations
// console.log(10000n + 10000n); // 20000n
// console.log(1234231412421446754645n * 1000000n);

// // Does not work 👇
// // console.log(Math.sqrt(16n));

// // NU POTI sa calculezi big number cu numar normal
// const huge = 234326346435645364536n;
// const num = 23;
// // console.log(huge * num);
// console.log(huge * BigInt(num));

// // Exceptions
// console.log(20n > 15); // true
// console.log(20n === 20); // false
// console.log(typeof 20n); // bigint
// console.log(20n == '20'); // true

// console.log(huge + ' is REALLY big!!!'); // 234326346435645364536 is REALLY big!!!

// // Divisions

// // Return the closest BIgInt
// console.log(10n / 3n); // 3n

// ================= 3️⃣ Creating dates =====================

// Create a date
// 1.
// const now = new Date();
// console.log(now);

// // 2.
// console.log(new Date('Nov 28 2022 14:18:59'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 31));

// console.log(new Date(0)); // Thu Jan 01 1970 02:00:00 GMT+0200 (Eastern European Standard Time)

// // convert day to miliseconds
// // 3 days later
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); // Sun Jan 04 1970 02:00:00 GMT+0200 (Eastern European Standard Time)

// // Working with dates
// const future = new Date(2037, 10, 19, 15, 23, 5);
// console.log(future); // Thu Nov 19 2037 15:23:05 GMT+0200 (Eastern European Standard Time)
// console.log(future.getFullYear()); // 2037
// console.log(future.getMonth()); // 10
// console.log(future.getDate()); // 19
// // getDay() - returneaza ziua din saptamna respectiva
// console.log(future.getDay()); // 4
// console.log(future.getHours()); // 15
// console.log(future.getMinutes()); // 23
// console.log(future.getSeconds()); // 5

// // convert date to string
// console.log(future.toISOString()); //2037-11-19T13:23:05.000Z

// // Cat timp a timp a trecut de atunci pana in prezent
// console.log(future.getTime()); // 2142249785000
// console.log(new Date(2142249785000)); // Thu Nov 19 2037 15:23:05 GMT+0200 (Eastern European Standard Time)

// // Time stamp for now time
// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future); //Mon Nov 19 2040 15:23:05 GMT+0200 (Eastern European Standard Time)

// ================= 4️⃣ Operations With Dates =====================

// const future = new Date(2037, 10, 19, 15, 23, 5);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

// const day1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
// console.log(day1); // 10

// ============== 6️⃣ Internationalizing Numbers (Intl) ===============

// const num = 3654654.23;

// // const options = { style: 'unit', unit: 'mile-per-hour' };
// // const options = { style: 'percent', unit: 'celsius' };
// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EUR',
//   // useGrouping: false,
// };

// console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Romania: ', new Intl.NumberFormat('ro-RO', options).format(num));
// console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('Japan: ', new Intl.NumberFormat('ja-JP', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

// ============== 7️⃣ Timers_ setTimeout and setInterval =============

// setTimeout(function, time in miliseconds, arguments)
// const ingredients = ['olives', 'spinach'];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}🍕`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// // Delete timer
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// // setInterval
// // setInterval(function () {
// //   const now = new Date();
// //   console.log(now);
// // }, 15000);

// // Real time clock
// const sec = setInterval(() => {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const min = `${now.getMinutes()}`.padStart(2, 0);
//   const sec = `${now.getSeconds()}`.padStart(2, 0);
//   console.log(`${hour}:${min}:${sec}`);
// }, 1000);
// console.log(sec);
