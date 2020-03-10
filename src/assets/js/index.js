import modal from './modules/modal';
import navigation from './modules/navigation';
import rotate from './modules/rotate';
import screensaver from './modules/screensaver';

const lang = navigator.language || navigator.language || 'en-GB';
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'CET';

document.documentElement.lang = lang;
document.documentElement.setAttribute('tz', tz);

const init = async () => {
  console.log('init');
  modal();
  screensaver();
  navigation();
  rotate();
};

window.onload = init;
