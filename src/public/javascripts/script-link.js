const urx = document.getElementById('uri');
const nxtUrx = document.getElementById('uri-next');
urx.setAttribute('href', location.href);
urx.innerText = location.href;
const newPath = Math.random().toString().substr(2, 5)
    .concat(location.pathname.split('/')
        .slice(2)
        .join('/')
        .substring(2, 5))
    .concat('.html');
nxtUrx.setAttribute('href', newPath);
