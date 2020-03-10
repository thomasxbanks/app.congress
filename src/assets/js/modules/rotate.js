const handleRotateScreen = () => {
  const element = document.querySelector('[data-rotation-container]');
  const rotated = element.dataset.rotated === 'true';
  element.dataset.rotated = !rotated;
};

const addEventWatcher = () => {
  const rotationButtons = [...document.querySelectorAll('[data-rotate]')];
  rotationButtons.forEach((button) => {
    button.addEventListener('click', handleRotateScreen);
  });
};

const init = () => {
  const rotationContainer = document.createAttribute('data-rotation-container');
  document.body.setAttributeNode(rotationContainer);
  document.body.dataset.rotated = false;
  addEventWatcher();
};

export default init;
