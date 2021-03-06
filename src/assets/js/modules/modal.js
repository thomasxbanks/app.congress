import lockScroll from 'lxl.utils/lock-scroll';
import makeElementIsActive from 'lxl.utils/make-element-is-active';
import makeElementNotActive from 'lxl.utils/make-element-not-active';
import unlockScroll from 'lxl.utils/unlock-scroll';
import { trackingLogEvent } from './tracking';

const openModal = async (event) => {
  const { target } = event;
  const { modal } = target.dataset;
  const element = document.querySelector(`#modal-${modal}`);
  await makeElementIsActive(element);
  await lockScroll();
  await trackingLogEvent(modal, 'modal.open');
};

const closeModal = async (event) => {
  const { target } = event;
  const { modal } = target.dataset;
  const element = document.querySelector(`#modal-${modal}`);
  await makeElementNotActive(element);
  await unlockScroll();
  await trackingLogEvent(modal, 'modal.close');
};

const init = () => {
  const modalOpenTriggers = [...document.querySelectorAll('[data-modal-open]')];
  const modalCloseTriggers = [...document.querySelectorAll('[data-modal-close]')];

  if (modalOpenTriggers && modalCloseTriggers) {
    modalOpenTriggers.forEach((trigger) => {
      trigger.addEventListener('click', openModal);
    });
    modalCloseTriggers.forEach((trigger) => {
      trigger.addEventListener('click', closeModal);
    });
  }
};

export default init;
