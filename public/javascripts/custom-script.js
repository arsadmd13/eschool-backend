function addStream(){
  const players = Array.from(document.querySelectorAll('video')).map(p => new Plyr(p));
}

function sendData(){
  let frame = document.getElementById('iframe');
  frame.contentWindow.postMessage(document.getElementById('username').value, 'https://nameless-plateau-81910.herokuapp.com');
}