import { activateCurrentSlide, disableMenus, slideConfig } from './actions';

const calculateMeetingMinimumDistance = (options) => {
  let { distance } = options;
  const { minimumSwipeDistance } = options;
  if (distance.toString().charAt(0) === '-') {
    distance = Math.abs(distance);
  }
  return distance >= minimumSwipeDistance;
};

const handleGesture = async (event, options) => {
  const { target } = event;
  const { slide } = target.closest('[data-slide]').dataset;

  slideConfig.current = parseInt(slide, 10);

  slideConfig.leftToRight = options.touchstartX < options.touchendX;
  slideConfig.rightToLeft = options.touchstartX > options.touchendX;

  slideConfig.hasMetMinimumDistance = calculateMeetingMinimumDistance(options);

  slideConfig.canGoPrev = slideConfig.current > slideConfig.first;
  slideConfig.canGoNext = slideConfig.current < slideConfig.last;

  slideConfig.isSwipeNext = slideConfig.isRotated ? slideConfig.leftToRight : slideConfig.rightToLeft;
  slideConfig.isSwipePrev = slideConfig.isRotated ? slideConfig.rightToLeft : slideConfig.leftToRight;

  const id = { current: slideConfig.current, target: slideConfig.current };

  if (slideConfig.isSwipePrev && slideConfig.hasMetMinimumDistance) {
    id.target = slideConfig.canGoPrev ? slideConfig.current - 1 : id.current;
  }

  if (slideConfig.isSwipeNext && slideConfig.hasMetMinimumDistance) {
    id.target = slideConfig.canGoNext ? slideConfig.current + 1 : id.current;
  }

  await disableMenus();
  await activateCurrentSlide(id);
};

const init = () => {
  const options = {
    zone: document.querySelector('[data-slideshow]'),
    touchstartX: 0,
    touchendX: 0,
    minimumSwipeDistance: window.innerWidth / 5.75,
  };

  options.zone.addEventListener('touchstart', (event) => {
    options.touchstartX = event.changedTouches[0].screenX;
  }, false);

  options.zone.addEventListener('touchend', (event) => {
    options.touchendX = event.changedTouches[0].screenX;
    options.distance = options.touchstartX - options.touchendX;
    handleGesture(event, options);
  }, false);
};

export default init;
