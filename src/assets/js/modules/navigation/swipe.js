import { activateCurrentSlide, disableMenus, slides } from './actions';

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

  slides.current = parseInt(slide, 10);

  slides.leftToRight = options.touchstartX < options.touchendX;
  slides.rightToLeft = options.touchstartX > options.touchendX;

  slides.hasMetMinimumDistance = calculateMeetingMinimumDistance(options);

  slides.canGoPrev = slides.current > slides.first;
  slides.canGoNext = slides.current < slides.last;

  slides.isSwipeNext = slides.isRotated ? slides.leftToRight : slides.rightToLeft;
  slides.isSwipePrev = slides.isRotated ? slides.rightToLeft : slides.leftToRight;

  const id = { current: slides.current, target: slides.current };
  let variant;

  if (slides.isSwipePrev && slides.hasMetMinimumDistance) {
    id.target = slides.canGoPrev ? slides.current - 1 : id.current;
    variant = 'swipe_prev';
  }

  if (slides.isSwipeNext && slides.hasMetMinimumDistance) {
    id.target = slides.canGoNext ? slides.current + 1 : id.current;
    variant = 'swipe_next';
  }

  await disableMenus();
  await activateCurrentSlide(id);
};

const init = () => {
  const options = {
    zone: document.querySelector('[data-slideshow]'),
    touchstartX: 0,
    touchendX: 0,
    minimumSwipeDistance: 250,
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
