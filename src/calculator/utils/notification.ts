// 判断浏览器是否支持Notification API
let canUseNotification = false;

if (!('Notification' in window)) {
  console.log('This browser does not support desktop notifications');
} else if (Notification.permission === 'granted') {
  canUseNotification = true;
} else if (Notification.permission !== 'denied') {
  // 如果未授予权限，且未拒绝，则请求权限
  Notification.requestPermission().then((permission) => {
    // 如果用户同意授权，则发送通知
    if (permission === 'granted') {
      canUseNotification = true;
    }
  });
}

export function notify(msg: string, title: string) {
  if (canUseNotification)
    new Notification(title, {
      body: msg // 通知正文
      // icon: 'icon.png' // 通知的图标（可选）
    });
  else {
    alert(msg);
  }
}
