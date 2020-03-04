import makeElementNotActive from 'lxl.utils/make-element-not-active';

const init = () => {
  console.log('screensaver');

  const element = document.querySelector('[data-screensaver]');
  const { delay } = element.dataset;
  let timer;

  const screensaver = () => {
    makeElementNotActive(element);
    clearTimeout(timer);
    timer = setTimeout(() => {
      const hasActiveModals = [...document.querySelectorAll('[data-modal]')].filter((modal) => modal.dataset.active === 'true').length > 0;
      element.dataset.active = !hasActiveModals;
    }, delay || 5000);
  };

  screensaver();

  document.body.addEventListener('touchstart', screensaver);
  document.body.addEventListener('touchmove', screensaver);
  document.body.addEventListener('touchend', screensaver);
};

export default init;
