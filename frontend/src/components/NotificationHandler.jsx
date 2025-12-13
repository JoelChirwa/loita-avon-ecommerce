import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToPush, addNotification } from '../redux/slices/notificationSlice';

const NotificationHandler = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return;
    }

    // Request notification permission
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          // Only subscribe if VAPID key is available
          if (!import.meta.env.VITE_VAPID_PUBLIC_KEY) {
            console.log('VAPID public key not configured. Push notifications disabled.');
            return;
          }

          // Register service worker
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          // Subscribe to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY
            ),
          });

          // Send subscription to backend
          dispatch(subscribeToPush(subscription));
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    requestPermission();

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION') {
        dispatch(addNotification(event.data.notification));
      }
    });
  }, [user, dispatch]);

  return null;
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default NotificationHandler;
