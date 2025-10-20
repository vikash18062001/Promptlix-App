import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  async initPush() {
    console.log('Initializing Push Notifications...');

    // 1️⃣ Request permission
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.error('❌ Push permission not granted');
      return;
    }

    // 2️⃣ Register device with FCM
    await PushNotifications.register();

    // 3️⃣ Handle device token and subscribe to topic
    PushNotifications.addListener('registration', async (token) => {
      console.log('✅ FCM Token:', token.value);

      if (Capacitor.getPlatform() === 'android') {
        try {
          await FCM.subscribeTo({ topic: 'allSubscribers' });
          console.log('Subscribed to topic: allSubscribers');
        } catch (err) {
          console.error('Topic subscription failed', err);
        }
      }
    });

    // 4️⃣ Foreground notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('📩 Notification received:', notification);
    });

    // 5️⃣ Notification taps
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('📲 Notification tapped:', notification);
    });
  }
}
