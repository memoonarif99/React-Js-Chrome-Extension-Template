import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../../app';

export const embedExtension = () => {
  const mainApp = document.getElementById('app');
  console.log('===>whatsapp id ', mainApp);
  const firstChild = mainApp.firstChild;
  const innerDiv = document.querySelector('#app>div>div>div:nth-child(4)');

  const wacd = document.createElement('div');
  wacd.id = 'wacd-app';

  if (!document.body.contains(wacd)) {
    innerDiv.appendChild(wacd);
    ReactDOM.render(<App />, wacd);
  }
};
