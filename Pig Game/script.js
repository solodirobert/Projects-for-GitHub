'use strict';

//---SELECTING ELEMENTS
//'El' de la element
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
//Formatul de sus este cel standard si cel recomandat
//Functioneaza doar pentru ID-uri 'getElementById'
// getElementById e mult mai rapid decat querySelector
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores;
let currentScore;
let activePlayer;
let playing;

const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  //SET VALUE 0 TO SCORE ELEMENT 0 AND 1
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  //ADDING HIDDEN CLASS TO DICE ELEMENT
  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};

init();

const switchPlayer = function () {
  //Daca player activ este 0 schimbam in 1
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  // toggle() ADD CLASS if is NOT there REMOVE CLASS if IS there
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

//IMPLEMENTING THE ROLLING DICE FUNCTIONALITY
btnRoll.addEventListener('click', function () {
  //Prima data verificam daca playing is true
  if (playing) {
    // 1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // 3. Check for rolled 1,
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      //Getting active player dinamically
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // Switch to nex player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    //1. Add current score to active player's score
    // scores[1] = scores[1] + currentScore
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //2. Check if player's score is >= 100
    //Finish game
    if (scores[activePlayer] >= 100) {
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      //Removing the dice
      diceEl.classList.add('hidden');
    } else {
      //Switch to the next player
      switchPlayer();
    }
  }
});

//SET NEW GAME BUTTON
btnNew.addEventListener('click', init);
