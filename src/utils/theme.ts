// 动态生成element主题
const defaultTheme = '#1D52E6';
const theme = {
  originalTheme: '#409EFF', // element官方默认主题色
  defaultTheme: defaultTheme, // 系统默认主题色
  userTheme: localStorage.getItem('theme') || defaultTheme, // 用户自定义主题色
  setTheme(themeValue?: string) {
    return new Promise<void>(async (resolve, reject) => {
      // 用户本地保存的的主题色
      this.userTheme = themeValue ? themeValue : this.userTheme;
      const mixColor = (color: any, tint: number) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        if (tint === 0) {
          return [red, green, blue].join(',');
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));

          const redStr = red.toString(16);
          const greenStr = green.toString(16);
          const blueStr = blue.toString(16);

          return `#${redStr}${greenStr}${blueStr}`;
        }
      };
      const formatRgbColor = (color: any) => {
        let red = parseInt(color.slice(0, 2), 16).toString();
        let green = parseInt(color.slice(2, 4), 16).toString();
        let blue = parseInt(color.slice(4, 6), 16).toString();
        return { red, green, blue };
      };
      const rgbClor = formatRgbColor(this.userTheme.substring(1));
      // const el = document.documentElement;
      // el.style['--el-color-primary'] = userTheme;
      document.body.style.setProperty('--base-color', this.userTheme);
      document.body.style.setProperty('--el-color-primary', this.userTheme);
      document.body.style.setProperty('--base-color-rgb-red', rgbClor.red);
      document.body.style.setProperty('--base-color-rgb-green', rgbClor.green);
      document.body.style.setProperty('--base-color-rgb-blue', rgbClor.blue);
      let lightColor = '';
      /* 修改了主题色 需要同时修改对应的--el-color-primary-[1-9]计算方式是按照百分比混入白色 */
      for (let i = 1; i <= 9; i++) {
        lightColor = mixColor(this.userTheme.substring(1), i / 10);
        document.body.style.setProperty(`--el-color-primary-light-${i}`, lightColor);
        // el.style[`--el-color-primary-light-${i}`] = lightColor;
      }

      //存入localStorage
      localStorage.setItem('theme', this.userTheme);
      resolve();
    });
  }
};
export default theme;
