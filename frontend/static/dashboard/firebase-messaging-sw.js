importScripts( 'https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js' )
importScripts( 'https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js' )

firebase.initializeApp({ 
  apiKey: "AIzaSyBc-g8QJCsPgkrgselCtYCKFG4YZI1osR8",
  authDomain: "alkademi-8f6ef.firebaseapp.com",
  projectId: "alkademi-8f6ef",
  storageBucket: "alkademi-8f6ef.appspot.com",
  messagingSenderId: "149445901109",
  appId: "1:149445901109:web:080e605101f85b8ea4ea7c",
  measurementId: "G-NQ3S9XFE2C"
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

const call = {
  async updateFCM(token) {
    // console.log('FCM: ', token)
    const response = await this.$store.dispatch("Auth/updateFCM", {
      fcm: token,
    });
  
    if (!response.status) {
      console.log("Error Setting FCM", response.message);
    }
  }
}

// messaging.onMessage((payload) => {
//   console.log('ON MESSAGE: ', payload)
// })

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.senderName;
  const notificationOptions = {
    body: payload.data.message,
    icon: payload.data.senderPhoto == null || payload.data.senderPhoto == "" || payload.data.senderPhoto == undefined ? './logo.png' : payload.data.senderPhoto,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: 'vibration-sample'
  };

  // messaging.getToken().then((current_token) => {
  //   if (current_token) {
  //     // call.updateFCM(current_token)
  //   }
  // }).catch((err) => {
  //     console.error("Failed Retrieve Token with error", err);
  // });

  // self.window.localStorage.setItem('backgroundMessage', '0')

  self.addEventListener('notificationclick', function(event) {
      var url = "https://alkademi.id/"
  
      event.notification.close(); // Android needs explicit close.
      event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
  
          // Check if there is already a window/tab open with the target URL
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
  
            // If so, just focus it.
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
  
          // If not, then open the target URL in a new window/tab.
          if (clients.openWindow) {
            return clients.openWindow(url + "dashboard");
          }
        })
      );
    });

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

// messaging.setBackgroundMessageHandler(payload => {
//   // Customize notification here
//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     body: payload.data.message,
//     icon: './logo.png',
//     vibrate: [200, 100, 200, 100, 200, 100, 200],
//     tag: 'vibration-sample'
//   };

//   messaging.getToken().then((current_token) => {
//     if (current_token) {
//       call.setFcmToken(current_token)
//     }
//   })
//   .catch((err) => {
//     console.error("Failed Retrieve Token with error", err);
//   });

  // self.addEventListener('notificationclick', function(event) {
  //   var url = "https://dev.alkademi.id/dashboard/"

  //   event.notification.close(); // Android needs explicit close.
  //   event.waitUntil(
  //     clients.matchAll({type: 'window'}).then( windowClients => {

  //       // Check if there is already a window/tab open with the target URL
  //       for (var i = 0; i < windowClients.length; i++) {
  //         var client = windowClients[i];

  //         // If so, just focus it.
  //         if (client.url === url && 'focus' in client) {
  //           return client.focus();
  //         }
  //       }

  //       // If not, then open the target URL in a new window/tab.
  //       if (clients.openWindow) {
  //         return clients.openWindow(url + "user/notification");
  //       }
  //     })
  //   );
  // });

  // self.addEventListener('notificationclick', function(event) {
  //   var url = "https://dev.alkademi.id/dashboard/"

  //   event.notification.close(); // Android needs explicit close.
  //   event.waitUntil(
  //     clients.matchAll({type: 'window'}).then( windowClients => {

  //       // Check if there is already a window/tab open with the target URL
  //       for (var i = 0; i < windowClients.length; i++) {
  //         var client = windowClients[i];

  //         // If so, just focus it.
  //         if (client.url === url && 'focus' in client) {
  //           return client.focus();
  //         }
  //       }

  //       // If not, then open the target URL in a new window/tab.
  //       if (clients.openWindow) {
  //         return clients.openWindow(url + "user/notification");
  //       }
  //     })
  //   );
  // });

//   return self.registration.showNotification( notificationTitle, notificationOptions )
// })