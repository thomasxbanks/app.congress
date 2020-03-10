import makeElementNotActive from 'lxl.utils/make-element-not-active';
import { activateCurrentSlide, slideConfig } from './navigation/actions';
import { trackingCloseSession, trackingStartSession } from './tracking';

const init = () => {
  console.log('screensaver');

  const element = document.querySelector('[data-screensaver]');
  const { delay } = element.dataset;
  let hasActiveSession = false;
  let timer;
  const screensaver = () => {
    makeElementNotActive(element);
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const hasActiveModals = [...document.querySelectorAll('[data-modal]')].filter((modal) => modal.dataset.active === 'true').length > 0;
      element.dataset.active = !hasActiveModals;
      hasActiveSession = sessionStorage.getItem('lxl_sessionID');
      const startNewSession = !hasActiveSession;
      if (startNewSession) {
        const currentSlideID = parseInt(document.querySelector('[data-slide][data-active="true"]').dataset.slide, 10);
        await trackingCloseSession();
        await activateCurrentSlide({ current: currentSlideID, target: slideConfig.first });
        await trackingStartSession();
      }
    }, delay || 5000);
  };

  screensaver();

  document.body.addEventListener('touchstart', screensaver);
  document.body.addEventListener('touchmove', screensaver);
  document.body.addEventListener('touchend', screensaver);
};

export default init;
