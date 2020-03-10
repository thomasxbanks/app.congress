// This contains functions used to access the tracking API
import slides from '../../../slides';

let currentSessionId;

const trackingURL = document.documentElement.dataset.trackingurl || 'http://localhost:8080';

export const trackingLogEvent = (page, source) => {
  console.log('trackingLogEvent', page, source);
  fetch(`${trackingURL}/log/${currentSessionId}/${page}/${source}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).catch((err) => {
    console.error('[TRACKING] Unable to log event.', err);
  });
};

export const trackingStartSession = () => {
  fetch(`${trackingURL}/sessionstart`, {
    method: 'POST',
  }).then((res) => res.json()).then((response) => {
    console.log(response);

    currentSessionId = response.token;

    console.log(`[TRACKING] Starting new session with UUID of ${currentSessionId}`);

    sessionStorage.setItem('lxl_sessionID', currentSessionId);

    const current = parseInt(document.querySelector('[data-slide][data-active="true"]').dataset.slide, 10) || 0;
    trackingLogEvent(slides[current].tracking, 'session.start');

  }).catch((err) => {
    console.error('[TRACKING] Unable to start session.', err);

  });
};

export const trackingCloseSession = () => {
  if (currentSessionId != null) {
    fetch(`${trackingURL}/sessionClose/${currentSessionId}`, {
      method: 'POST',
    }).catch((err) => {
      console.error('[TRACKING] Unable to close session.', err);

    });
  }
};
