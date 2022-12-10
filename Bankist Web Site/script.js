'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////////////
// 🔵 Implementing smooth Scrolling

btnScroll.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);
  // console.log(
  //   'height/width',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling

  // ✋ OLD SCHOOL
  // window.scrollTo(
  //   // current position + current scroll
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //  👍 MODER WAY
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////////////////////////////
// 🔵 Page navigation

// Implementing smooth scroll to href

// ⛔ Not good
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);

//     // Smoothing selector
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// GOOD WAY 👇
// Steps of EVENT DELEGATION
// 1. Add event listener to common parent element
// 2. Determine what element origined the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);

    // Smoothing selector
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////////////////////////////////////////
// 🔵 Tabbed component

tabsContainer.addEventListener('click', function (e) {
  // catre elementul parinte
  const clicked = e.target.closest('.operations__tab');
  // console.log('click');

  // Guard clause
  if (!clicked) return;

  // Active tab
  // 1. Remove the class for all tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // 2. Adding the class to the tab we clicked
  clicked.classList.add('operations__tab--active');

  // Active content
  // 1. Remove class from all contents
  tabsContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );

  // Activate content area
  // 2. Add class to content
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////////////////////////////
// 🔵 Menu Fade animation (Passing Argumnets to Event Handlers)

// opac - opacity
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // We use 'this' for bind method
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argumnet into handler"
// we use bind() - return a new function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////////////////////
// 🔵 Sticky navigation

// using scroll events (BUT ITS BAD PRACTICE FOR PERFORMANCE)
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   // console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

////////////////////////////////////////////////////////////////////////
// 🔵 Sticky navigation (Intersection Observer API)

// entries este un array cu mai multe valori threshold
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   // procent
//   // 0 - se declanseaza atunci cand elementul vizat nu se mai afla in viewport
//   // 1 - se declanseaza cand este vizibil 100% in viewport
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// // Target element: section1
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // Cand se va declansa evenimentul. La 90% din header
  // Just visual margin
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////////////////////////////////////////////////////////////////////////
// 🔵 Reveal sections (Reveal Elements on Scroll)

// Select all sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // add section--hidden to all sections
  // section.classList.add('section--hidden');
});

////////////////////////////////////////////////////////////////////////
// 🔵 Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  entry.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////////////////////////////
// 🔵 Building a Slider Component

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const bntLeft = document.querySelector('.slider__btn--left');
  const bntRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlide = slides.length;

  // Creating dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Function active dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Punem slide-urile una langa alta
  // function go to slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // function next slide
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    //current slide 1: -100%, 0%, 100%, 200%
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  // Initialization
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  // Next slide
  bntRight.addEventListener('click', nextSlide);
  bntLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    // with short circuiting
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//// Selecting, creating adn Deleting Elements

// Selecting elements
// Select the entire document element
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// // returneaza primul element cu clasa header
// const header = document.querySelector('.header');
// // returneaza toate elementele cu clasa header
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// // select element with id section--1
// document.getElementById('section--1');

// // select elements with name tag button
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// // select elements with class name btn
// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements
// // 💢 insertAdjacentHTML => Check bankist app

// const message = document.createElement('div');
// message.classList.add('cookie-message');

// // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // add element to first child
// // header.prepend(message);

// // add element to last child
// header.append(message);
// // ❗ Putem folosi prepend() si append() ca sa mutam elementele

// // Ca sa afisam elementul in mai multe locuri
// // header.append(message.cloneNode(true));

// // Insert before header element
// // header.before(message);

// // Insert after header element
// // header.after(message);

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // NEW WAY
//     message.remove();

//     // OLD WAY
//     // message.parentElement.removeChild(message);
//   });

// 💢 Using insertAdjacentHTML

// const buttonOK = document.createElement('div');
// buttonOK.classList.add('fake');
// const button = '<button class="btn button-fake">OK</button>';
// header.insertAdjacentHTML('afterbegin', button);

// document.querySelector('.button-fake').addEventListener('click', function () {
//   button.parentElement.removeChild(button);
// });

///////////////////////////////////////////////////////////////////////
//// Styles, Attributes and Classes

// Styles
// Applying in-line styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '80%';

// // console.log(getComputedStyle(message).height); // 50px

// // Adding +40px to height. NEW HEIGHT = 80px
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// console.log(getComputedStyle(message).height); // 50px

// // Changing the color
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);

// // Changing value
// logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);

// // Set attribute
// logo.setAttribute('company', 'Bankist');

// // GEt src from logo properly using getAttribute()
// console.log(logo.src); // http://127.0.0.1:8080/img/logo.png
// console.log(logo.getAttribute('src')); // img/logo.png

// // GEt adress from link properly using getAttribute()
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // http://127.0.0.1:8080/?#
// console.log(link.getAttribute('href')); // #

// // Data attributes
// // we need to transform to camelCase so we can get the value
// console.log(logo.dataset.versionNumber); // 3.0

// // Classes
// logo.classList.add('c');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// // dont use className because will overwrite all classes values with jonas
// // logo.className = 'jonas';

///////////////////////////////////////////////////////////////////////
//// Types of Events and Event Handlers

// const h1 = document.querySelector('h1');

// // ⚡ mouseenter

// const alertH1 = function (e) {
//   alert('addEcentListener: Great! You are reading the heading :D');

//   // Remove event listener
//   // h1.removeEventListener('mouseenter', alertH1);
// };
// // On hover
// h1.addEventListener('mouseenter', alertH1);

// // Remove event listener dupa un anumit timp
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// // ALSO you can do like this 👇
// // h1.onmouseenter = function (e) {
// //   alert('addEcentListener: Great! You are reading the heading :D');
// // };

// ///////////////////////////////////////////////////////////////////////
// //// Event Propagation in Practice

// // rgb(255,255,255)
// // Creating random color function
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// // EVENT BUBBLING
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // e.target ne arata unde s-a intamplat evenimentul
//   console.log('LINK', e.target, e.currentTarget);

//   // Stop propagation - in practice in not a good idea but you can do it
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

// ///////////////////////////////////////////////////////////////////////
// //// DOM Traversing

// const h1 = document.querySelector('h1');

// // Going downawrds: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Goind upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children); // get all siblings
// [...h1.parentElement.children].forEach(function (el) {
//   // facem elementele cu 5% mai mici fata de h1
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// ///////////////////////////////////////////////////////////////////////
// //// Lifecycle DOM

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('page fully loaded', e);
// });

// // window.addEventListener('beforeunload', function (e) {
// //   e.preventDefault();
// //   console.log(e);
// //   e.returnValue = '';
// // });
