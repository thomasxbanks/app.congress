import getCssValue from 'lxl.utils/get-css-value';
import makeElementIsActive from 'lxl.utils/make-element-is-active';
import makeElementNotActive from 'lxl.utils/make-element-not-active';
import numberizeValue from 'lxl.utils/numberize-value';
import { handleButtonDisability, showGivenSlide, showSlide } from './actions';
import swipe from './swipe';

const init = () => {
  console.log('slideshow');
  const slideshow = document.querySelector('[data-slideshow]');
  const header = document.querySelector('body>header');
  const footer = document.querySelector('body>footer');
  const heights = {
    header: numberizeValue(getCssValue(header, 'height')),
    footer: numberizeValue(getCssValue(footer, 'height')),
  };
  slideshow.style.height = `calc(100vh - ${heights.header + heights.footer}px)`;

  const buttons = [...document.querySelectorAll('[data-nav]')];
  const slides = [...document.querySelectorAll('[data-slide]')];
  const menu = [...document.querySelectorAll('[data-menu]')];

  buttons.forEach((element) => {
    element.addEventListener('click', showSlide);
  });

  menu.forEach((element, index) => {
    element.addEventListener('click', showGivenSlide);
    if (index === 0) {
      makeElementIsActive(element);
    } else {
      makeElementNotActive(element);
    }
  });

  slides.forEach((element, index) => {
    if (index === 0) {
      makeElementIsActive(element);
    } else {
      element.classList.add('moveOffScreenRight');
    }
  });

  handleButtonDisability();
  swipe();
};

export default init;
