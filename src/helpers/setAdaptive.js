export default (columns) => {
  const widthView = document.documentElement.clientWidth;
  document.body.style.setProperty('--border-collapse', 'separate');
  document.body.style.setProperty('--width-cell', '32px');
  document.body.style.setProperty('--border-cell', '3px solid rgb(36, 66, 56)');
  document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
  if (widthView < 1140) {
    if (columns > 25) {
      document.body.style.setProperty('--width-cell', '28px');
      document.body.style.setProperty('--border-cell', '2px solid rgb(107, 214, 179)');
    }
  }
  if (widthView < 870) {
    if (columns >= 25) {
      document.body.style.setProperty('--width-cell', '25px');
      document.body.style.setProperty('--border-collapse', 'collapse');
      document.body.style.setProperty('--border-cell', '1px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
    } else if (columns >= 16 && columns < 25) {
      document.body.style.setProperty('--width-cell', '28px');
    }
  }
  if (widthView < 480) {
    if (columns >= 25) {
      document.body.style.setProperty('--width-cell', '17px');
      document.body.style.setProperty('--border-collapse', 'collapse');
      document.body.style.setProperty('--border-cell', '1px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
    } else if (columns >= 16 && columns < 25) {
      document.body.style.setProperty('--width-cell', '24px');
      document.body.style.setProperty('--border-collapse', 'collapse');
      document.body.style.setProperty('--border-cell', '1px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
    }
  }
};
