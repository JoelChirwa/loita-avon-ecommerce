import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiBell, FiBellOff, FiCheck, FiX, FiInfo, FiShoppingBag, FiTruck, FiStar } from 'react-icons/fi';
import { subscribeToPush, getNotifications } from '../redux/slices/notificationSlice';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subscription, notifications } = useSelector((state) => state.notifications);

  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    newProducts: true,
    promotions: true,
    newsletter: false,
  });

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Check if already subscribed
    if (subscription) {
      setIsSubscribed(true);
    }

    // Load notifications
    if (user) {
      dispatch(getNotifications());
    }
  }, [subscription, user, dispatch]);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);

    try {
      // Check browser support
      if (!('Notification' in window)) {
        toast.error('Your browser does not support notifications');
        setIsLoading(false);
        return;
      }

      if (!('serviceWorker' in navigator)) {
        toast.error('Your browser does not support service workers');
        setIsLoading(false);
        return;
      }

      if (!import.meta.env.VITE_VAPID_PUBLIC_KEY) {
        toast.error('Notification system not configured');
        setIsLoading(false);
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // Subscribe to push
        const pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
        });

        // Send subscription to server
        await dispatch(subscribeToPush(pushSubscription)).unwrap();
        setIsSubscribed(true);
        toast.success('Push notifications enabled successfully!');

        // Show test notification
        new Notification('Loita Shop', {
          body: 'Notifications enabled! You will receive updates about your orders and new products.',
          icon: '/logo192.png',
        });
      } else if (permission === 'denied') {
        toast.error('Notification permission denied. Please enable it in your browser settings.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          setIsSubscribed(false);
          toast.success('Push notifications disabled');
        }
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast.error('Failed to disable notifications');
    }
  };

  const handleTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from Loita Shop!',
        icon: '/logo192.png',
        badge: '/logo192.png',
      });
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first');
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Preference updated');
  };

  const notificationTypes = [
    {
      key: 'orderUpdates',
      icon: FiShoppingBag,
      title: 'Order Updates',
      description: 'Get notified about order status changes, shipping updates, and delivery confirmations',
    },
    {
      key: 'newProducts',
      icon: FiStar,
      title: 'New Products',
      description: 'Be the first to know about new Avon products added to our store',
    },
    {
      key: 'promotions',
      icon: FiTruck,
      title: 'Promotions & Offers',
      description: 'Receive notifications about special deals, discounts, and exclusive offers',
    },
    {
      key: 'newsletter',
      icon: FiBell,
      title: 'Newsletter',
      description: 'Get beauty tips, product recommendations, and company updates via email',
    },
  ];

  const getPermissionStatus = () => {
    switch (notificationPermission) {
      case 'granted':
        return { text: 'Enabled', color: 'text-green-600', bg: 'bg-green-100' };
      case 'denied':
        return { text: 'Blocked', color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { text: 'Not Set', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const status = getPermissionStatus();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Manage how you receive updates from Loita Shop</p>
      </div>

      {/* Browser Notification Status */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${status.bg} rounded-full flex items-center justify-center`}>
              {notificationPermission === 'granted' ? (
                <FiBell className={`w-6 h-6 ${status.color}`} />
              ) : (
                <FiBellOff className={`w-6 h-6 ${status.color}`} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Push Notifications</h2>
              <p className="text-sm text-gray-600">
                Status: <span className={`font-semibold ${status.color}`}>{status.text}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {!isSubscribed || notificationPermission !== 'granted' ? (
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enabling...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>Enable Notifications</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleTestNotification}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Test Notification
                </button>
                <button
                  onClick={handleDisableNotifications}
                  className="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Disable</span>
                </button>
              </>
            )}
          </div>
        </div>

        {notificationPermission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <FiInfo className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-800 font-semibold mb-1">Notifications are blocked</p>
              <p className="text-red-700 text-sm">
                To enable notifications, you need to allow them in your browser settings. 
                Click the lock icon in the address bar and change notification permissions to &quot;Allow&quot;.
              </p>
            </div>
          </div>
        )}

        {notificationPermission === 'default' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-blue-800 text-sm">
                Enable push notifications to receive real-time updates about your orders, new products, and exclusive offers directly to your device.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
        <p className="text-gray-600 mb-6">Choose what notifications you want to receive</p>

        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div
              key={type.key}
              className="flex items-start justify-between p-4 border-2 border-gray-100 rounded-lg hover:border-pink-200 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-linear-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <type.icon className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[type.key]}
                  onChange={() => handlePreferenceChange(type.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Support Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Browser Support</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <FiCheck className="w-4 h-4 text-green-600" />
            <span>Notifications: {('Notification' in window) ? 'Supported' : 'Not Supported'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheck className="w-4 h-4 text-green-600" />
            <span>Service Worker: {('serviceWorker' in navigator) ? 'Supported' : 'Not Supported'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheck className="w-4 h-4 text-green-600" />
            <span>Push API: {('PushManager' in window) ? 'Supported' : 'Not Supported'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
