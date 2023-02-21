import { printLine, embedExtension } from './modules';
import './modules/phoneParse';
import './modules/script';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

window.addEventListener('load', () => {
  setTimeout(() => {
    embedExtension();
  }, 5000);
});
