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
  // console.log('swipe:handleGesture', _);
  const _ = slideConfig;
  const { target } = event;
  const { slide } = target.closest('[data-slide]').dataset;

  const isRotated = document.querySelector('[data-rotated]').dataset.rotated === 'true';
  _.isRotated = isRotated;

  _.current = parseInt(slide, 10);

  _.leftToRight = options.touchstartX < options.touchendX;
  _.rightToLeft = options.touchstartX > options.touchendX;

  _.hasMetMinimumDistance = calculateMeetingMinimumDistance(options);

  _.canGoPrev = _.current > _.first;
  _.canGoNext = _.current < _.last;

  _.isSwipeNext = _.isRotated ? _.leftToRight : _.rightToLeft;
  _.isSwipePrev = _.isRotated ? _.rightToLeft : _.leftToRight;

  const id = { current: _.current, target: _.current };

  if (_.isSwipePrev && _.hasMetMinimumDistance) {
    id.target = _.canGoPrev ? _.current - 1 : id.current;
  }

  if (_.isSwipeNext && _.hasMetMinimumDistance) {
    id.target = _.canGoNext ? _.current + 1 : id.current;
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
