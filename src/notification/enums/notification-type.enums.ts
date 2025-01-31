export enum NotificationType {
    FOLLOW = 'follow',
    POST = 'post',
    PROFILE_REMINDER = 'profile-reminder',
    SYSTEM_ALERT = 'system-alert',
    MESSAGE = 'message',
    OTHER = 'other',
  }
  
  // Mapping NotificationType to readable messages
  export const NotificationMessages: Record<NotificationType, { title: string; body: string }> = {
    [NotificationType.FOLLOW]: {
      title: 'New Follower!',
      body: 'Someone just followed you. Check your followers list!',
    },
    [NotificationType.POST]: {
      title: 'New Post Alert!',
      body: 'A user you follow has posted something new.',
    },
    [NotificationType.PROFILE_REMINDER]: {
      title: 'Complete Your Profile!',
      body: 'Your profile is incomplete. Update it to get the best experience.',
    },
    [NotificationType.SYSTEM_ALERT]: {
      title: 'System Alert',
      body: 'Important system update. Check now!',
    },
    [NotificationType.MESSAGE]: {
      title: 'New Message',
      body: 'You have received a new message. Open your inbox.',
    },
    [NotificationType.OTHER]: {
      title: 'Notification',
      body: 'You have a new notification.',
    },
  };
  