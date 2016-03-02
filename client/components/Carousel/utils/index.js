/*eslint-disable*/
// adapted from: http://blogs.msdn.com/b/giorgio/archive/2009/04/14/how-to-detect-ie8-using-javascript-client-side.aspx
const getIE = () => {
  let rv = -1; // Return value assumes failure.
  if (navigator.appName === 'Microsoft Internet Explorer') {
    const ua = navigator.userAgent,
          re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');

    if (re.exec(ua) !== null) rv = parseFloat(RegExp.$1);
  }

  return rv;
}


const getTransition = (distance, speed) => {
  // speed expressed in px/second
  // returns milliseconds
  return distance / speed * 1000;
}

const support3d = () => {
  const v = getIE();
  return v > -1 ? v > 9 : true;
}

export {getIE, getTransition, support3d}
