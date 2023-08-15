export default (columns) => {
  const widthView = document.documentElement.clientWidth;
  document.body.style.setProperty('--border-collapse', 'separate');
  document.body.style.setProperty('--width-cell', '32px');
  document.body.style.setProperty('--border-cell', '3px solid rgb(36, 66, 56)');
  document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
  document.body.style.setProperty('--font-size', '16px');
  if (widthView < 1140) {
    if (columns > 25) {
      document.body.style.setProperty('--width-cell', '28px');
      document.body.style.setProperty('--border-cell', '2px solid rgb(107, 214, 179)');
    }
  }
  if (widthView < 870) {
    if (columns >= 19) {
      document.body.style.setProperty('--width-cell', '25px');
      document.body.style.setProperty('--border-collapse', 'collapse');
      document.body.style.setProperty('--border-cell', '1px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
    } else if (columns >= 16 && columns < 25) {
      document.body.style.setProperty('--width-cell', '28px');
    }
  }
  if (widthView < 480) {
    if (columns >= 19) {
      document.body.style.setProperty('--font-size', '8px');
      document.body.style.setProperty('--width-cell', '16px');
      document.body.style.setProperty('--border-collapse', 'collapse');
      document.body.style.setProperty('--border-cell', '0.2px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--border-cell-top', '0.2px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--border-cell-left', '0.2px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--outline-open', '0.2px solid rgb(107, 214, 179)');
    } else if (columns >= 12 && columns < 19) {
      document.body.style.setProperty('--font-size', '10px');
      document.body.style.setProperty('--width-cell', '20px');
      document.body.style.setProperty('--border-collapse', 'collapse');
      document.body.style.setProperty('--border-cell', '1px solid rgb(107, 214, 179)');
      document.body.style.setProperty('--outline-open', '1px solid rgb(107, 214, 179)');
    }
  }
};
