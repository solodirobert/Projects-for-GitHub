'use strict';

/*
//EXTRAGE CONTINUTUL DIN CLASA 'message'
console.log(document.querySelector('.message').textContent);
//INLOCUIESTE TEXTUL DIN SELECTOR CU UN ALT TEXT
document.querySelector('.message').textContent = '🎉 Correct Number';

document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 10;

document.querySelector('.guess').value = 23;
console.log(document.querySelector('.guess').value);
*/

//DEFINE SECRET NUMBER
//SET Number randomly 1 to 20
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

//'click' - numele evenimentului
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);

  //when the textbox is empty
  if (!guess) {
    //document.querySelector('.message').textContent = '⛔ No number';
    displayMessage('⛔ No number');
    //When player wins
  } else if (guess === secretNumber) {
    //document.querySelector('.message').textContent = '🎉 Correct Number';
    displayMessage('🎉 Correct Number');
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    //Setting highscore
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = score;
    }
    //When guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      //   document.querySelector('.message').textContent =
      //     guess > secretNumber ? '📈 To high' : '📉 To low';
      score--;
      displayMessage(guess > secretNumber ? '📈 To high' : '📉 To low');
      document.querySelector('.score').textContent = score;
    } else {
      //   document.querySelector('.message').textContent = '😢 You lost the game';
      displayMessage('😢 You lost the game');
      document.querySelector('.score').textContent = 0;
      document.querySelector('body').style.backgroundColor = 'red';
      document.querySelector('.number').style.width = '30rem';
    }
  }
  //When guess is to high
  //   } else if (guess > secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent = '📈 To high';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     } else {
  //       document.querySelector('.message').textContent = '😢 You lost the game';
  //       document.querySelector('.score').textContent = 0;
  //       document.querySelector('body').style.backgroundColor = 'red';
  //       document.querySelector('.number').style.width = '30rem';
  //     }

  //     //When guess is to low
  //   } else if (guess < secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent = '📉 To low';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     } else {
  //       document.querySelector('.message').textContent = '😢 You lost the game';
  //       document.querySelector('.score').textContent = 0;
  //       document.querySelector('body').style.backgroundColor = 'red';
  //       document.querySelector('.number').style.width = '30rem';
  //     }
});

//Setting the AGAIN button
document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  const guess = Number(document.querySelector('.guess').value);

  console.log(document.querySelector('.score').textContent);
  //document.querySelector('.message').textContent = 'Start guessing...';
  displayMessage('Start guessing...');
  document.querySelector('.number').textContent = '?';
  document.querySelector('.score').textContent = score;
  document.querySelector('.highscore').textContent = highscore;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = '';
});
