Notification.requestPermission();
var swRegistration = undefined;

var registerWebPush = document.getElementById("registerWebPush");
registerWebPush.onclick = function() {
  // Notification.requestPermission();
  // registerServiceWorker();
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
            .register('/sw.js')
            .then(function(swReg) { 
                console.log("Service Worker Registered", swReg); 
                swRegistration = swReg;
                initialiseUI();
              })
            .catch(function(err) { console.log("Service Worker error:" + JSON.stringify(err))});
  }
};

function initialiseUI() {
var pushButton = document.getElementById("pushButton");
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.')
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
// TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}