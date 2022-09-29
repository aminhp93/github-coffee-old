// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD10PnOvnUmemjEhTLJuDKQ7-oUiMd2e38',
  authDomain: 'reactjs-with-redux.firebaseapp.com',
  projectId: 'reactjs-with-redux',
  storageBucket: 'reactjs-with-redux.appspot.com',
  messagingSenderId: '37847634387',
  appId: '1:37847634387:web:ef0e42e463e2a333c0df26',
  measurementId: 'G-JPBLGYGNZ1',
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
