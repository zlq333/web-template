import theme from '@/utils/theme';
function getLayout(): Layout {
  let storageData = localStorage.getItem('layout');
  let defaultConfig: Layout = {
    theme: theme.userTheme,
    layout: 'MIX',
    style: 'is-light',
    isCollapse: false,
    fullScreen: true,
    showBreadcrumd: true,
    showTabs: true,
    showRefresh: true,
    animation: 'zoom-narrow',
    enableAnimation: true
  };
  if (storageData === undefined || storageData === null || storageData == '') {
    return defaultConfig;
  } else {
    try {
      let userConfig: Layout = JSON.parse(storageData);
      userConfig = { ...defaultConfig, ...userConfig };
      if (userConfig.style !== 'is-dark' && userConfig.style !== 'is-light') userConfig.style = 'is-light';
      localStorage.setItem('layout', JSON.stringify(userConfig));
      return userConfig;
    } catch (e) {
      localStorage.setItem('layout', JSON.stringify(defaultConfig));
      return defaultConfig;
    }
  }
}

export default getLayout();
