
export const moveSlideOffLeft = (element) => {
  // console.log('moveSlideOffLeft', element);
  element.classList.remove('moveOnScreenLeft', 'moveOnScreenRight');
  element.classList.add('moveOffScreenLeft');
};

export const moveSlideOnLeft = (element) => {
  // console.log('moveSlideOnLeft', element);
  element.classList.remove('moveOffScreenLeft', 'moveOffScreenRight');
  element.classList.add('moveOnScreenRight');
};

export const moveSlideOnRight = (element) => {
  // console.log('moveSlideOnRight', element);
  element.classList.remove('moveOffScreenRight');
  element.classList.add('moveOnScreenLeft');
};

export const moveSlideOffRight = (element) => {
  // console.log('moveSlideOffRight', element);
  element.classList.remove('moveOnScreenLeft', 'moveOnScreenRight');
  element.classList.add('moveOffScreenRight');
};
