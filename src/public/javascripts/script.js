'use strict';

var urx = document.getElementById('uri');
var nxtUrx = document.getElementById('uri-next');
urx.setAttribute('href', location.href);
urx.innerText = location.href;
var newPath = Math.random().toString().substr(2, 5)
    + location.pathname.split('/').slice(2).join('/').substring(2, 5) + '.html';
nxtUrx.setAttribute('href', newPath);
