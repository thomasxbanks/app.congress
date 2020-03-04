import disableButton from 'lxl.utils/make-button-is-disabled';
import enableButton from 'lxl.utils/make-button-not-disabled';
import makeElementIsActive from 'lxl.utils/make-element-is-active';
import makeElementNotActive from 'lxl.utils/make-element-not-active';
import config from '../../config';
import { moveSlideOffLeft, moveSlideOffRight, moveSlideOnLeft, moveSlideOnRight } from './animations';

export const revealContent = (element) => {
  const title = element.querySelector('[data-title]');
  const content = element.querySelector('[data-content]');
  const footer = element.querySelector('[data-footer]');
  // console.log('revealContent', title || 'no title', content || 'no content', footer || 'no footer');
  if (title) {
    title.classList.add(config.animations.title);
  }
  if (content) {
    content.classList.add(config.animations.content);
  }
  if (footer) {
    footer.classList.add(config.animations.footer);
  }
};

export const hideContent = (element) => {
  const title = element.querySelector('[data-title]');
  const content = element.querySelector('[data-content]');
  const footer = element.querySelector('[data-footer]');
  // console.log('hideContent', title || 'no title', content || 'no content', footer || 'no footer');
  if (title) {
    title.classList.remove(config.animations.title);
  }
  if (content) {
    content.classList.remove(config.animations.content);
  }
  if (footer) {
    footer.classList.remove(config.animations.footer);
  }
};

export const handleButtonDisability = () => {
  const buttons = [...document.querySelectorAll('[data-nav]')];
  const menus = [...document.querySelectorAll('[data-menu]')];
  const button = {
    prev: buttons.filter((btn) => btn.dataset.direction === 'prev')[0],
    next: buttons.filter((btn) => btn.dataset.direction === 'next')[0],
  };
  const els = [...document.querySelectorAll('[data-slide]')];
  const current = parseInt(document.querySelector('[data-slide][data-active="true"]').dataset.slide, 10) || 0;
  const slides = {
    first: 0,
    last: els.length - 1,
    current,
  };

  if (slides.current > slides.first) {
    enableButton(button.prev);
  } else {
    disableButton(button.prev);
  }

  if (slides.current < slides.last) {
    enableButton(button.next);
  } else {
    disableButton(button.next);
  }

  menus.forEach((menu) => {
    const id = parseInt(menu.dataset.uid, 10);
    if (id === slides.current) {
      disableButton(menu);
    } else {
      enableButton(menu);
    }
  });
};

export const animateSlides = async (slides, id) => {
  // Log for debugging
  // console.log('animateSlides', currentElement.dataset.id, targetElement.dataset.id);

  // Define variables for calculations
  const currentSlideID = id.current;
  const targetSlideID = id.target;
  const currentElement = slides.current;
  const targetElement = slides.target;

  // Control the animation direction
  if (targetSlideID > currentSlideID) {
    /*
      If the target slide has a higher index than the current slide,
      then we're going forwards through the slides from the
      first slide to the last slide
    */
    // animate out the current slide
    moveSlideOffLeft(currentElement);

    // animate in the new slide
    moveSlideOnRight(targetElement);

  } else if (targetSlideID < currentSlideID) {
    /*
      If the target slide has a lower index than the current slide,
      then we're going backwards through the slides from the
      last slide to the first slide
    */
    // animate out the current slide
    moveSlideOffRight(currentElement);

    // animate in the new slide
    moveSlideOnLeft(targetElement);

  } else {
    /*
      In the unlikely event the target slide has the same index than the current slide,
      then we're not moving at all!
    */
  }
  // reveal content on the new slide
  await revealContent(targetElement);

  // Hide the content on the old slide to trigger the animation on page load
  await hideContent(currentElement);

  // Disable old slide
  await makeElementNotActive(currentElement);

  // Enable new slide
  await makeElementIsActive(targetElement);

  // Disable/enable navigation
  await handleButtonDisability();
};


export const slides = {
  first: 0,
  last: [...document.querySelectorAll('[data-slide]')].length - 1,
  isRotated: document.querySelector('[data-rotation-container]').dataset.rotated === 'true',
};

export const disableMenus = () => {
  const menus = [...document.querySelectorAll('[data-menu]')];
  menus.forEach((menu) => {
    makeElementNotActive(menu);
  });
};

export const activateCurrentSlide = async (id) => {
  const slides = {
    current: document.querySelector(`[data-slide="${id.current}"]`),
    target: document.querySelector(`[data-slide="${id.target}"]`),
  };
  const menus = [...document.querySelectorAll('[data-menu]')];
  await animateSlides(slides, id);
  menus.filter((el) => parseInt(el.dataset.uid, 10) === id.target).forEach((menu) => makeElementIsActive(menu));
};

export const showSlide = async (event) => {
  const { target } = event;
  const { direction } = target.dataset;
  const id = {
    current: parseInt(document.querySelector('[data-slide][data-active="true"]').dataset.slide, 10),
  };
  // await hideSlides();
  await disableMenus();
  if (direction === 'prev') {
    id.target = id.current - 1;
  }
  if (direction === 'next') {
    id.target = id.current + 1;
  }
  console.log(id);
  await activateCurrentSlide(id);
  await handleButtonDisability();
};

export const showGivenSlide = async (event) => {
  const { target } = event;
  const { uid } = target.dataset;
  const id = { current: parseInt(document.querySelector('[data-slide][data-active="true"]').dataset.slide, 10), target: parseInt(uid, 10) };
  // await hideSlides();
  await disableMenus();
  await activateCurrentSlide(id);
  await handleButtonDisability();
};
