/*!
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
'use strict';

var YAHOO_WEATHER_API_ENDPOINT = 'https://query.yahooapis.com/' +
  'v1/public/yql?q=select%20*%20from%20weather.forecast%20where%' +
  '20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where' +
  '%20text%3D%22london%2C%20uk%22)&format=json&env=store%3A%2F%2' +
  'Fdatatables.org%2Falltableswithkeys';

function showNotification(title, body, icon, data) {
  console.log('showNotification');
  // Firefox has an issue with showing a notification with the icon from
  // the Yaho API
  // (i.e. http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif)
  // HTTP, CORs or Size issue.
  var notificationOptions = {
    body: body,
    icon: icon ? icon : '/images/touch/chrome-touch-icon-192x192.png',
    tag: 'simple-push-demo-notification',
    data: data,
    sound: '0935.ogg',
    vibrate: [300, 100, 400]

  };
  return self.registration.showNotification(title, notificationOptions);
}

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
  if (event.data) {
    console.log('message data', event.data);
    console.log('message data', event.data.text);
    var output = event.data.text();
    console.log(output);
  }

  // Since this is no payload data with the first version
  // of Push notifications, here we'll grab some data from
  // an API and use it to populate a notification
  event.waitUntil(
    fetch(YAHOO_WEATHER_API_ENDPOINT)
      .then(function(response) {
        if (response.status !== 200) {
          // Throw an error so the promise is rejected and catch() is executed
          throw new Error('Invalid status code from weather API: ' +
            response.status);
        }

        // Examine the text in the response
        return response.json();
      })
      .then(function(data) {
        console.log('Weather API data: ', data);
        if (data.query.count === 0) {
          // Throw an error so the promise is rejected and catch() is executed
          throw new Error();
        }

        var title = 'What\'s the weather like in London?';
        var message = data.query.results.channel.item.condition.text;
        var icon = data.query.results.channel.image.url ||
          'images/touch/chrome-touch-icon-192x192.png';

        // Add this to the data of the notification
        var urlToOpen = data.query.results.channel.link;

        var notificationFilter = {
          tag: 'simple-push-demo-notification'
        };

        var notificationData = {
          url: urlToOpen
        };
        var soundData = {
          sound : 'test.mp3'
        }

        var vibrationData = {
          vibrate: [300, 100, 400]
        }

        if (!self.registration.getNotifications) {
          return showNotification(title, message, icon, notificationData, soundData, vibrationData);
        }

        // Check if a notification is already displayed
        return self.registration.getNotifications(notificationFilter)
          .then(function(notifications) {
            if (notifications && notifications.length > 0) {
              // Start with one to account for the new notification
              // we are adding
              var notificationCount = 1;
              for (var i = 0; i < notifications.length; i++) {
                var existingNotification = notifications[i];
                if (existingNotification.data &&
                  existingNotification.data.notificationCount) {
                  notificationCount +=
                    existingNotification.data.notificationCount;
                } else {
                  notificationCount++;
                }
                existingNotification.close();
              }
              message = 'You have ' + notificationCount +
                ' weather updates.';
              notificationData.notificationCount = notificationCount;
            }

            return showNotification(title, message, icon, notificationData, soundData, vibrationData);
          });
      })
      .catch(function(err) {
        console.error('A Problem occured with handling the push msg', err);

        var title = 'An error occured';
        var message = 'We were unable to get the information for this ' +
          'push message';

        return showNotification(title, message);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.url;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzZXJ2aWNlLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgWUFIT09fV0VBVEhFUl9BUElfRU5EUE9JTlQgPSAnaHR0cHM6Ly9xdWVyeS55YWhvb2FwaXMuY29tLycgK1xyXG4gICd2MS9wdWJsaWMveXFsP3E9c2VsZWN0JTIwKiUyMGZyb20lMjB3ZWF0aGVyLmZvcmVjYXN0JTIwd2hlcmUlJyArXHJcbiAgJzIwd29laWQlMjBpbiUyMChzZWxlY3QlMjB3b2VpZCUyMGZyb20lMjBnZW8ucGxhY2VzKDEpJTIwd2hlcmUnICtcclxuICAnJTIwdGV4dCUzRCUyMmxvbmRvbiUyQyUyMHVrJTIyKSZmb3JtYXQ9anNvbiZlbnY9c3RvcmUlM0ElMkYlMicgK1xyXG4gICdGZGF0YXRhYmxlcy5vcmclMkZhbGx0YWJsZXN3aXRoa2V5cyc7XHJcblxyXG5mdW5jdGlvbiBzaG93Tm90aWZpY2F0aW9uKHRpdGxlLCBib2R5LCBpY29uLCBkYXRhKSB7XHJcbiAgY29uc29sZS5sb2coJ3Nob3dOb3RpZmljYXRpb24nKTtcclxuICAvLyBGaXJlZm94IGhhcyBhbiBpc3N1ZSB3aXRoIHNob3dpbmcgYSBub3RpZmljYXRpb24gd2l0aCB0aGUgaWNvbiBmcm9tXHJcbiAgLy8gdGhlIFlhaG8gQVBJXHJcbiAgLy8gKGkuZS4gaHR0cDovL2wueWltZy5jb20vYS9pL2JyYW5kL3B1cnBsZWxvZ28vL3VoL3VzL25ld3Mtd2VhLmdpZilcclxuICAvLyBIVFRQLCBDT1JzIG9yIFNpemUgaXNzdWUuXHJcbiAgdmFyIG5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XHJcbiAgICBib2R5OiBib2R5LFxyXG4gICAgaWNvbjogaWNvbiA/IGljb24gOiAnL2ltYWdlcy90b3VjaC9jaHJvbWUtdG91Y2gtaWNvbi0xOTJ4MTkyLnBuZycsXHJcbiAgICB0YWc6ICdzaW1wbGUtcHVzaC1kZW1vLW5vdGlmaWNhdGlvbicsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgc291bmQ6ICcwOTM1Lm9nZycsXHJcbiAgICB2aWJyYXRlOiBbMzAwLCAxMDAsIDQwMF1cclxuXHJcbiAgfTtcclxuICByZXR1cm4gc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbih0aXRsZSwgbm90aWZpY2F0aW9uT3B0aW9ucyk7XHJcbn1cclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncHVzaCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgY29uc29sZS5sb2coJ1JlY2VpdmVkIGEgcHVzaCBtZXNzYWdlJywgZXZlbnQpO1xyXG4gIGlmIChldmVudC5kYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZygnbWVzc2FnZSBkYXRhJywgZXZlbnQuZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZygnbWVzc2FnZSBkYXRhJywgZXZlbnQuZGF0YS50ZXh0KTtcclxuICAgIHZhciBvdXRwdXQgPSBldmVudC5kYXRhLnRleHQoKTtcclxuICAgIGNvbnNvbGUubG9nKG91dHB1dCk7XHJcbiAgfVxyXG5cclxuICAvLyBTaW5jZSB0aGlzIGlzIG5vIHBheWxvYWQgZGF0YSB3aXRoIHRoZSBmaXJzdCB2ZXJzaW9uXHJcbiAgLy8gb2YgUHVzaCBub3RpZmljYXRpb25zLCBoZXJlIHdlJ2xsIGdyYWIgc29tZSBkYXRhIGZyb21cclxuICAvLyBhbiBBUEkgYW5kIHVzZSBpdCB0byBwb3B1bGF0ZSBhIG5vdGlmaWNhdGlvblxyXG4gIGV2ZW50LndhaXRVbnRpbChcclxuICAgIGZldGNoKFlBSE9PX1dFQVRIRVJfQVBJX0VORFBPSU5UKVxyXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgLy8gVGhyb3cgYW4gZXJyb3Igc28gdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgYW5kIGNhdGNoKCkgaXMgZXhlY3V0ZWRcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZSBmcm9tIHdlYXRoZXIgQVBJOiAnICtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEV4YW1pbmUgdGhlIHRleHQgaW4gdGhlIHJlc3BvbnNlXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdXZWF0aGVyIEFQSSBkYXRhOiAnLCBkYXRhKTtcclxuICAgICAgICBpZiAoZGF0YS5xdWVyeS5jb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgLy8gVGhyb3cgYW4gZXJyb3Igc28gdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgYW5kIGNhdGNoKCkgaXMgZXhlY3V0ZWRcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRpdGxlID0gJ1doYXRcXCdzIHRoZSB3ZWF0aGVyIGxpa2UgaW4gTG9uZG9uPyc7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBkYXRhLnF1ZXJ5LnJlc3VsdHMuY2hhbm5lbC5pdGVtLmNvbmRpdGlvbi50ZXh0O1xyXG4gICAgICAgIHZhciBpY29uID0gZGF0YS5xdWVyeS5yZXN1bHRzLmNoYW5uZWwuaW1hZ2UudXJsIHx8XHJcbiAgICAgICAgICAnaW1hZ2VzL3RvdWNoL2Nocm9tZS10b3VjaC1pY29uLTE5MngxOTIucG5nJztcclxuXHJcbiAgICAgICAgLy8gQWRkIHRoaXMgdG8gdGhlIGRhdGEgb2YgdGhlIG5vdGlmaWNhdGlvblxyXG4gICAgICAgIHZhciB1cmxUb09wZW4gPSBkYXRhLnF1ZXJ5LnJlc3VsdHMuY2hhbm5lbC5saW5rO1xyXG5cclxuICAgICAgICB2YXIgbm90aWZpY2F0aW9uRmlsdGVyID0ge1xyXG4gICAgICAgICAgdGFnOiAnc2ltcGxlLXB1c2gtZGVtby1ub3RpZmljYXRpb24nXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG5vdGlmaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgICAgICB1cmw6IHVybFRvT3BlblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHNvdW5kRGF0YSA9IHtcclxuICAgICAgICAgIHNvdW5kIDogJ3Rlc3QubXAzJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHZpYnJhdGlvbkRhdGEgPSB7XHJcbiAgICAgICAgICB2aWJyYXRlOiBbMzAwLCAxMDAsIDQwMF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2VsZi5yZWdpc3RyYXRpb24uZ2V0Tm90aWZpY2F0aW9ucykge1xyXG4gICAgICAgICAgcmV0dXJuIHNob3dOb3RpZmljYXRpb24odGl0bGUsIG1lc3NhZ2UsIGljb24sIG5vdGlmaWNhdGlvbkRhdGEsIHNvdW5kRGF0YSwgdmlicmF0aW9uRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiBhIG5vdGlmaWNhdGlvbiBpcyBhbHJlYWR5IGRpc3BsYXllZFxyXG4gICAgICAgIHJldHVybiBzZWxmLnJlZ2lzdHJhdGlvbi5nZXROb3RpZmljYXRpb25zKG5vdGlmaWNhdGlvbkZpbHRlcilcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG5vdGlmaWNhdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG5vdGlmaWNhdGlvbnMgJiYgbm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgLy8gU3RhcnQgd2l0aCBvbmUgdG8gYWNjb3VudCBmb3IgdGhlIG5ldyBub3RpZmljYXRpb25cclxuICAgICAgICAgICAgICAvLyB3ZSBhcmUgYWRkaW5nXHJcbiAgICAgICAgICAgICAgdmFyIG5vdGlmaWNhdGlvbkNvdW50ID0gMTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vdGlmaWNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGlzdGluZ05vdGlmaWNhdGlvbiA9IG5vdGlmaWNhdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdOb3RpZmljYXRpb24uZGF0YSAmJlxyXG4gICAgICAgICAgICAgICAgICBleGlzdGluZ05vdGlmaWNhdGlvbi5kYXRhLm5vdGlmaWNhdGlvbkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNvdW50ICs9XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdOb3RpZmljYXRpb24uZGF0YS5ub3RpZmljYXRpb25Db3VudDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ05vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBtZXNzYWdlID0gJ1lvdSBoYXZlICcgKyBub3RpZmljYXRpb25Db3VudCArXHJcbiAgICAgICAgICAgICAgICAnIHdlYXRoZXIgdXBkYXRlcy4nO1xyXG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbkRhdGEubm90aWZpY2F0aW9uQ291bnQgPSBub3RpZmljYXRpb25Db3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNob3dOb3RpZmljYXRpb24odGl0bGUsIG1lc3NhZ2UsIGljb24sIG5vdGlmaWNhdGlvbkRhdGEsIHNvdW5kRGF0YSwgdmlicmF0aW9uRGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0EgUHJvYmxlbSBvY2N1cmVkIHdpdGggaGFuZGxpbmcgdGhlIHB1c2ggbXNnJywgZXJyKTtcclxuXHJcbiAgICAgICAgdmFyIHRpdGxlID0gJ0FuIGVycm9yIG9jY3VyZWQnO1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gJ1dlIHdlcmUgdW5hYmxlIHRvIGdldCB0aGUgaW5mb3JtYXRpb24gZm9yIHRoaXMgJyArXHJcbiAgICAgICAgICAncHVzaCBtZXNzYWdlJztcclxuXHJcbiAgICAgICAgcmV0dXJuIHNob3dOb3RpZmljYXRpb24odGl0bGUsIG1lc3NhZ2UpO1xyXG4gICAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdub3RpZmljYXRpb25jbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgdmFyIHVybCA9IGV2ZW50Lm5vdGlmaWNhdGlvbi5kYXRhLnVybDtcclxuICBldmVudC5ub3RpZmljYXRpb24uY2xvc2UoKTtcclxuICBldmVudC53YWl0VW50aWwoY2xpZW50cy5vcGVuV2luZG93KHVybCkpO1xyXG59KTtcclxuIl0sImZpbGUiOiJzZXJ2aWNlLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
