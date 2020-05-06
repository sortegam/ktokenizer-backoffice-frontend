export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Services',
      title: true,
    },
    {
      name: 'Tokenizer',
      url: '/tokenizer',
      icon: 'icon-lock',
      children: [
        {
          name: 'Operations',
          url: '/tokenizer/operations',
          icon: 'icon-list',
        },
      ],
    },
    {
      name: 'Account',
      title: true,
    },
    {
      name: 'Profile',
      url: '/account/profile',
      icon: 'icon-user',
    },
    {
      name: 'Settings',
      url: '/account/settings',
      icon: 'icon-settings',
    },
  ],
};
