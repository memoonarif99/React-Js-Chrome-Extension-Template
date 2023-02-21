'use strict';

import {
  OPEN_SUPPORT_CHAT_EVENT,
  SET_ANALYTICS_EVENT,
  CONTACTS_INITIALIZED_EVENT,
} from '../../config/constants';

(() => {
  const PHONE_URL =
    'https://exports.statfluence.com/rest/v1/file/send-to-phone';
  // const EMAIL_URL = "http://localhost:5000/user/sendEmail";
  const EMAIL_URL = 'https://whatsappcontacts.herokuapp.com/user/sendEmail';

  let responseStatus;
  const styleForPopupError =
    'padding: 20px; width:300px; height:40px; background-color: white; position:absolute; bottom:10px;right:10px; z-index:105; text-align: center; display: none; align-items: flex-end; color:#9b3e3e; border-radius: 2px;   border: 1px solid #9b3e3e;';
  const textForPopupError = 'Error has been detected. Please, try again.';

  addFoneParsFile();
  /* loads background file*/
  function addFoneParsFile() {
    injectJs(chrome.runtime.getURL('/dist/foneParse.js'));
  }
  /* create a file and add to the markup */
  function injectJs(a) {
    let c = document.createElement('script');
    c.type = 'text/javascript';
    c.src = a;
    (document.head || document.body || document.documentElement).appendChild(c);
    const popup = document.createElement('div');
    popup.setAttribute('id', 'popup');
    (document.body || document.documentElement).appendChild(popup);
  }

  const analyticsEvents = [];
  let isPageInitialized = false;

  window.addEventListener(SET_ANALYTICS_EVENT, (event) => {
    analyticsEvents.push(event.detail);
  });

  window.addEventListener(CONTACTS_INITIALIZED_EVENT, (event) => {
    isPageInitialized = true;
  });

  /* when loading background fil takes all groups and labels */
  let getContentDataModule = (function () {
    let PublicInterface = {};
    window.addEventListener('FromPage', (event) => {
      PublicInterface.groupsCollection = event.detail.groups;
      PublicInterface.labelsCollection = event.detail.labels;
    });

    return PublicInterface;
  })();

  window.addEventListener('save-number', (event) => {
    const isSameUser = localStorage.getItem('my-number') === event.detail;
    if (!isSameUser && event.detail) {
      savePhoneNumber(event.detail);
      chrome.runtime.sendMessage({
        name: 'my-number',
        data: localStorage.getItem('my-number'),
      });
    }
  });

  function validationPopup(response) {
    let elem = document.getElementById('popup');
    if (!response.ok) {
      elem.style.cssText = styleForPopupError;
      elem.innerText = textForPopupError;
      elem.style.display = 'block';
      setTimeout(() => {
        elem.style.display = 'none';
      }, 4000);
    }
  }
  function sendPhone(file, name, phone) {
    const formData = new FormData();

    formData.append('phone', phone);
    formData.append('file', file, name);

    fetch(PHONE_URL, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      validationPopup(response);
    });
  }

  async function sendEmail(file, name, email, format) {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('file', file, name);
    formData.append('format', format);
    console.log('format::', format);

    fetch(EMAIL_URL, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      validationPopup(response);
    });
  }

  function sendEmailOrPhone(type, format, name, email) {
    if (type == 'Phone') {
      const phone = localStorage.getItem('userPhone');
      if (format === 'Csv') {
        setTimeout(() => {
          const data = JSON.parse(localStorage.getItem('users'));

          const blob = new Blob(['\uFEFF' + data], {
            type: 'text/csv;charset=utf-8;',
          });
          // const blob = new Blob([data], {
          //   type: "text/csv;charset=utf-8;"
          // });

          sendPhone(blob, name + '.csv', phone);
        }, 1000);
      } else if (format === 'vCart') {
        setTimeout(() => {
          const data = JSON.parse(localStorage.getItem('users'));
          const blob = new Blob([data], {
            type: 'text/x-vcard',
          });

          sendPhone(blob, name + '.vcf', phone);
        }, 1000);
      }
    }
    if (type == 'Email') {
      if (format === 'Csv') {
        setTimeout(() => {
          let data = JSON.parse(localStorage.getItem('users'));

          const blob = new Blob(['\uFEFF' + data], {
            type: 'text/csv;charset=utf-8;',
          });
          // const blob = new Blob([data], {
          //   type: "text/csv;charset=utf-8;"
          // });

          sendEmail(blob, name + '.csv', email, 'csv');
        }, 1000);
      } else if (format === 'vCart') {
        setTimeout(() => {
          const data = JSON.parse(localStorage.getItem('users'));

          const blob = new Blob([data], {
            type: 'text/x-vcard',
          });

          sendEmail(blob, name, email, 'vcf');
        }, 1000);
      }
    }
  }

  const NUMBER_URL = 'https://whatsappcontacts.herokuapp.com/number/saveNumber';

  async function savePhoneNumber(phoneNo) {
    await fetch(NUMBER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_no: phoneNo }),
    })
      .then((response) => response.json())
      .then((res) => {
        localStorage.setItem('my-number', phoneNo);
        chrome.runtime.sendMessage({ name: 'saved-number', data: phoneNo });
      })
      .catch((err) => {});
  }

  /* receive and process the message */
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.name === 'support-chat') {
      const event = new CustomEvent(OPEN_SUPPORT_CHAT_EVENT, {
        detail: request,
      });

      window.dispatchEvent(event);
    }

    if (request.name === 'chat') {
      const chats = new CustomEvent('ExportContacts', {
        detail: request,
      });

      window.dispatchEvent(chats);

      if (request.typeSend === 'Phone' || request.typeSend === 'Email') {
        sendEmailOrPhone(
          request.typeSend,
          request.format,
          'WhatsApp All Groups Contacts',
          request.email
        );
      }
    }

    if (request.name === 'ContactsFromSpecificGroup') {
      responseStatus = getContentDataModule.groupsCollection;
    }

    if (request.name === SET_ANALYTICS_EVENT) {
      responseStatus = analyticsEvents.splice(0, analyticsEvents.length);
    }

    if (request.name === CONTACTS_INITIALIZED_EVENT) {
      responseStatus = isPageInitialized;
    }

    if (request.name === 'GetGroupParticipants') {
      const groups = new CustomEvent('ExportGroups', {
        detail: request,
      });

      window.dispatchEvent(groups);

      const name =
        request.groupname === 'All Groups'
          ? 'WhatsApp All Groups Contacts'
          : 'WhatsApp From Specific Group Contacts';

      sendEmailOrPhone(request.typeSend, request.format, name, request.email);
    }

    if (request.name === 'send-status') {
      const status = new CustomEvent('SetStatus', {
        detail: request.text,
      });

      window.dispatchEvent(status);
    }

    if (request.name === 'input-chat-btn') {
      const link = document.createElement('a');
      link.href = `https://web.whatsapp.com/send?phone=${request.data}`;

      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();
      link.remove();
    }

    sendResponse({ dataResponse: responseStatus });
  });
})();
