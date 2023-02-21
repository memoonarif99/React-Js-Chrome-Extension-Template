/* global chrome */
import {
  SET_ANALYTICS_EVENT,
  ANALYTICS_CATEGORIES,
  ANALYTICS_ACTIONS,
  CONTACTS_INITIALIZED_EVENT,
} from '../../config';

// const {
//   SET_ANALYTICS_EVENT,
//   CONTACTS_INITIALIZED_EVENT,
// } = require('./popup/constants');

localStorage.setItem('UrlSite', window.location.href);

(() => {
  window.Ue = {};
  let parsingInterval;
  let refreshGroupsIntervalId = null;
  let parseGroupsIntervalId = null;

  init();

  function getStore(e) {
    var t,
      o = 0,
      storeMatchers = [
        {
          id: 'Store',
          conditions: function (e) {
            return e['default'] && e['default'].Chat && e['default'].Msg
              ? e['default']
              : null;
          },
        },
        {
          id: 'MediaCollection',
          conditions: function (e) {
            return e['default'] &&
              e['default'].prototype &&
              (void 0 !== e['default'].prototype.processFiles ||
                void 0 !== e['default'].prototype.processAttachments)
              ? e['default']
              : null;
          },
        },
        {
          id: 'MediaProcess',
          conditions: function (e) {
            return e.BLOB ? e : null;
          },
        },
        {
          id: 'Wap',
          conditions: function (e) {
            return e.createGroup ? e : null;
          },
        },
        {
          id: 'ServiceWorker',
          conditions: function (e) {
            return e['default'] && e['default'].killServiceWorker ? e : null;
          },
        },
        {
          id: 'State',
          conditions: function (e) {
            return e.STATE && e.STREAM ? e : null;
          },
        },
        {
          id: 'GroupInvite',
          conditions: function (e) {
            return e.queryGroupInviteCode ? e : null;
          },
        },
        {
          id: 'WapDelete',
          conditions: function (e) {
            return e.sendConversationDelete &&
              2 == e.sendConversationDelete.length
              ? e
              : null;
          },
        },
        {
          id: 'Presence2',
          conditions: function (e) {
            return e.setPresenceAvailable && e.setPresenceUnavailable
              ? e
              : null;
          },
        },
        {
          id: 'Conn',
          conditions: function (e) {
            return e['default'] && e['default'].ref && e['default'].refTTL
              ? e['default']
              : null;
          },
        },
        {
          id: 'WapQuery',
          conditions: function (e) {
            return e.queryExist
              ? e
              : e['default'] && e['default'].queryExist
              ? e['default']
              : null;
          },
        },
        {
          id: 'CryptoLib',
          conditions: function (e) {
            return e.decryptE2EMedia ? e : null;
          },
        },
        {
          id: 'OpenChat',
          conditions: function (e) {
            return e['default'] &&
              e['default'].prototype &&
              e['default'].prototype.openChat
              ? e['default']
              : null;
          },
        },
        {
          id: 'UserConstructor',
          conditions: function (e) {
            return e['default'] &&
              e['default'].prototype &&
              e['default'].prototype.isServer &&
              e['default'].prototype.isUser
              ? e['default']
              : null;
          },
        },
        {
          id: 'SendTextMsgToChat',
          conditions: function (e) {
            return e.sendTextMsgToChat ? e.sendTextMsgToChat : null;
          },
        },
        {
          id: 'SendSeen',
          conditions: function (e) {
            return e.sendSeen ? e.sendSeen : null;
          },
        },
        {
          id: 'sendDelete',
          conditions: function (e) {
            return e.sendDelete ? e.sendDelete : null;
          },
        },
        {
          id: 'addAndSendMsgToChat',
          conditions: function (e) {
            return e.addAndSendMsgToChat ? e.addAndSendMsgToChat : null;
          },
        },
        {
          id: 'sendMsgToChat',
          conditions: function (e) {
            return e.sendMsgToChat ? e.sendMsgToChat : null;
          },
        },
        {
          id: 'Catalog',
          conditions: function (e) {
            return e.Catalog ? e.Catalog : null;
          },
        },
        {
          id: 'ReadSeen',
          conditions: function (e) {
            return e.sendSeen ? e : null;
          },
        },
        {
          id: 'bp',
          conditions: function (e) {
            return e['default'] &&
              e['default'].toString &&
              e['default']
                .toString()
                .includes('binaryProtocol deprecated version')
              ? e['default']
              : null;
          },
        },
        {
          id: 'MsgKey',
          conditions: function (e) {
            return e['default'] &&
              e['default'].toString &&
              e['default']
                .toString()
                .includes('MsgKey error: id is already a MsgKey')
              ? e['default']
              : null;
          },
        },
        {
          id: 'Parser',
          conditions: function (e) {
            return e.convertToTextWithoutSpecialEmojis ? e['default'] : null;
          },
        },
        {
          id: 'Builders',
          conditions: function (e) {
            return e.TemplateMessage && e.HydratedFourRowTemplate ? e : null;
          },
        },
        {
          id: 'Me',
          conditions: function (e) {
            return e.PLATFORMS && e.Conn ? e['default'] : null;
          },
        },
        {
          id: 'CallUtils',
          conditions: function (e) {
            return e.sendCallEnd && e.parseCall ? e : null;
          },
        },
        {
          id: 'Identity',
          conditions: function (e) {
            return e.queryIdentity && e.updateIdentity ? e : null;
          },
        },
        {
          id: 'MyStatus',
          conditions: function (e) {
            return e.getStatus && e.setMyStatus ? e : null;
          },
        },
        {
          id: 'ChatStates',
          conditions: function (e) {
            return e.sendChatStatePaused &&
              e.sendChatStateRecording &&
              e.sendChatStateComposing
              ? e
              : null;
          },
        },
        {
          id: 'GroupActions',
          conditions: function (e) {
            return e.sendExitGroup && e.localExitGroup ? e : null;
          },
        },
        {
          id: 'Features',
          conditions: function (e) {
            return e.FEATURE_CHANGE_EVENT && e.features ? e : null;
          },
        },
        {
          id: 'MessageUtils',
          conditions: function (e) {
            return e.storeMessages && e.appendMessage ? e : null;
          },
        },
        {
          id: 'WebMessageInfo',
          conditions: function (e) {
            return e.WebMessageInfo && e.WebFeatures ? e.WebMessageInfo : null;
          },
        },
        {
          id: 'createMessageKey',
          conditions: function (e) {
            return e.createMessageKey && e.createDeviceSentMessage
              ? e.createMessageKey
              : null;
          },
        },
        {
          id: 'Participants',
          conditions: function (e) {
            return e.addParticipants &&
              e.removeParticipants &&
              e.promoteParticipants &&
              e.demoteParticipants
              ? e
              : null;
          },
        },
        {
          id: 'WidFactory',
          conditions: function (e) {
            return e.numberToWid && e.createWid && e.createWidFromWidLike
              ? e
              : null;
          },
        },
        {
          id: 'Base',
          conditions: function (e) {
            return e.setSubProtocol && e.binSend && e.actionNode ? e : null;
          },
        },
        {
          id: 'Base2',
          conditions: function (e) {
            return e.supportsFeatureFlags &&
              e.parseMsgStubProto &&
              e.binSend &&
              e.subscribeLiveLocation
              ? e
              : null;
          },
        },
        {
          id: 'Versions',
          conditions: function (e) {
            return e.loadProtoVersions &&
              e['default'][15] &&
              e['default'][16] &&
              e['default'][17]
              ? e
              : null;
          },
        },
        {
          id: 'Sticker',
          conditions: function (e) {
            return e['default'] && e['default'].Sticker
              ? e['default'].Sticker
              : null;
          },
        },
        {
          id: 'Contact',
          conditions: function (e) {
            var models = e['default'] && e['default'].models;

            return e['ContactCollection'] && models ? e['default'] : null;
          },
        },
        {
          id: 'Chat',
          conditions: function (e) {
            var models = e['default'] && e['default'].models;
            return e.ChatCollection && models ? e['default'] : null;
          },
        },
        {
          id: 'MediaUpload',
          conditions: function (e) {
            return e['default'] && e['default'].mediaUpload
              ? e['default']
              : null;
          },
        },
        {
          id: 'UploadUtils',
          conditions: function (e) {
            return e['default'] && e['default'].encryptAndUpload
              ? e['default']
              : null;
          },
        },
      ];
    for (t in e) {
      var value = e[t];

      if ('object' == typeof value && null !== value) {
        var module = Object.values(value)[0];

        if ('object' == typeof module) {
          for (var prop in ((module = {}), value)) {
            module.value = e(prop);

            if (module.value) {
              storeMatchers.forEach(function (matcher) {
                if (matcher.conditions && !matcher.foundedModule) {
                  try {
                    var a = matcher.conditions(module.value);

                    if (a !== null) {
                      o++;
                      matcher.foundedModule = a;
                    }
                  } catch (e) {
                    //
                  }
                }
              });
            } else {
              module = {
                value: module.value,
              };
            }
          }

          var aaa = (e = storeMatchers.find(function (e) {
            return 'Store' === e.id;
          }));
          var bbb = (window[Ue] = e.foundedModule ? e.foundedModule : {});

          storeMatchers.splice(storeMatchers.indexOf(e), 1),
            storeMatchers.forEach(function (e) {
              if (e.foundedModule) {
                window[Ue][e.id] = e.foundedModule;
              } else {
              }
            });

          var ccc = (window[Ue].sendMessage = function () {
            return window[Ue].SendTextMsgToChat.apply(
              window[Ue],
              [this].concat(Array.from(arguments))
            );
          });

          var ddd =
            window[Ue].MediaCollection &&
            (window[Ue].MediaCollection.prototype.processFiles =
              window[Ue].MediaCollection.prototype.processFiles ||
              window[Ue].MediaCollection.prototype.processAttachments) &&
            window[Ue];

          return aaa, bbb, ccc, ddd;
        }
      }
    }
  }

  function getModules() {
    // webpackChunkbuild - global window variable, exposed by webpack
    // In order to receive access to webpack inner modules
    // we need to call:
    // `webpackChunkbuild.push([ModuleId], [[ModuleId]]_, callback)`
    // Webpack will call our callback function with `__webpack_require` variable
    // which will contain all needed data
    const e = 'parasite' + Date.now();

    console.log(
      webpackChunkwhatsapp_web_client,
      ' in webpackChunkwhatsapp_web_client'
    );
    if ('function' == typeof webpackChunkwhatsapp_web_client) {
      var t = {};
      webpackChunkwhatsapp_web_client(
        [],
        ((t[e] = function (e, t, a) {
          return getStore(a);
        }),
        t),
        [e]
      );
    } else {
      const pushObject = [
        [e],
        [[e]],
        function (webpackRequire) {
          return getStore(webpackRequire);
        },
      ];
      webpackChunkwhatsapp_web_client.push(pushObject);
    }
  }

  function init() {
    let parseAttemptsCount = 0;
    parsingInterval = setInterval(function () {
      parseAttemptsCount++;
      if (
        (getModules(),
        (window[Ue] && window[Ue].Chat && window[Ue].Conn) ||
          (window[Ue] && window[Ue].Chat))
      ) {
        initFrame();
      } else if (parseAttemptsCount === 15) {
        dispatchAnalyticsEvent({
          action: ANALYTICS_ACTIONS.modulesLoadFailed,
          category: ANALYTICS_CATEGORIES.parseStats,
          value: parseAttemptsCount,
        });
      }
    }, 1000);
  }

  function initFrame() {
    try {
      var contacts = window[Ue].Contact._models.filter((contact) => {
        return (
          contact.__x_isUser &&
          contact.__x_isWAContact &&
          contact.__x_isMyContact
        );
      });

      const mappedChatGroups = getMappedGroups();

      if (contacts.length > 0 && mappedChatGroups.length > 0) {
        // if at least groups or contacts were loaded and parsed
        // that means that WhatsApp bundle is initialized
        // and we can clear our parse-bundle interval
        clearInterval(parsingInterval);
      }

      if (contacts.length || mappedChatGroups.length) {
        removeListeners();
        addListeners();
      }

      if (mappedChatGroups.length > 0) {
        clearInterval(parseGroupsIntervalId);
      }

      if (!mappedChatGroups.length > 0) {
        // if contacts were loaded but groups are still empty
        // that means that WhatsApp is still loading groups
        // and we need to set interval in order to get all lazy-loaded groups
        setParseGroupsInterval();
      }

      dispatchGroupsToPopup(mappedChatGroups);

      if (mappedChatGroups.length > 0) {
        // if groups were loaded and parsed
        // start refreshing groups contacts
        onGroupsParsed();
      }

      dispatchAnalyticsEvent({
        action: ANALYTICS_ACTIONS.modulesInitialized,
        category: ANALYTICS_CATEGORIES.parseStats,
        label: `
            Contacts:${contacts.length};
            Groups:${mappedChatGroups.length};
          `,
      });
    } catch (e) {
      const error = {
        action: ANALYTICS_ACTIONS.exception,
        exDescription: e.message,
        exFatal: false,
      };

      dispatchAnalyticsEvent(error);
    }
  }

  function onGroupsParsed() {
    refreshGroupsContacts();
    setRefreshGroupsInterval();
  }

  function setParseGroupsInterval() {
    if (parseGroupsIntervalId) {
      clearInterval(parseGroupsIntervalId);
    }

    const parseGroupsIntervalId = setInterval(getMappedGroups, 4 * 1000);
    const groups = getMappedGroups();

    if (groups.length > 0) {
      onGroupsParsed();
      clearInterval(parseGroupsIntervalId);
      dispatchGroupsToPopup(groups);
    }
  }

  function dispatchGroupsToPopup(groups) {
    try {
      const event = new CustomEvent('FromPage', {
        detail: { groups },
      });

      window.dispatchEvent(event);
    } catch (error) {
      //
    }
  }

  function getMappedGroups() {
    try {
      const groups = getChatGroups();

      return groups.map((group) => {
        const participantsCount =
          group.__x_groupMetadata.participants._models.length;
        const groupUserId = group.__x_id.user;

        return {
          groupID: groupUserId,
          groupName: group.__x_name || group.__x_formattedTitle,
          accountType: 'group',
          accountLabels: group.__x_labels || [],
          participantsCount,
          isLoaded: !group.__x_groupMetadata.stale,
        };
      });
    } catch (error) {
      console.log('error getting groups: ', error);
    }
  }

  function getChatGroups() {
    try {
      return window[Ue].Chat._models.filter((chat) => {
        return chat.__x_isGroup;
      });
    } catch (error) {
      //
    }
  }

  function refreshGroupsContacts() {
    try {
      const groups = getChatGroups();
      const mappedChatGroups = getMappedGroups();
      const loadContactsPromises = [];
      groups.forEach((group) => {
        const groupId = group.__x_id;
        const metadata = window[Ue].GroupMetadata.get(groupId);

        if (metadata.stale) {
          const promise = window[Ue].GroupMetadata.update(groupId);

          loadContactsPromises.push(promise);
        }
      });

      Promise.all(loadContactsPromises).finally(() => {
        const updatedGroups = getMappedGroups();

        dispatchGroupsToPopup(updatedGroups);
        sendInitializedEvent();
      });
      dispatchSaveNumberEvent();

      dispatchGroupsToPopup(mappedChatGroups);
    } catch (error) {
      //
    }
  }

  function setRefreshGroupsInterval() {
    try {
      if (refreshGroupsIntervalId) {
        //todo: add clearInterval(refreshGroupsIntervalId);
      }

      refreshGroupsIntervalId = setInterval(refreshGroupsContacts, 4 * 1000);
    } catch (error) {
      //
    }
  }

  function sendInitializedEvent() {
    const event = new CustomEvent(CONTACTS_INITIALIZED_EVENT);

    window.dispatchEvent(event);
  }

  // EXPORT

  function addListeners() {
    window.addEventListener('ExportContacts', exportChats);
    window.addEventListener('ExportGroups', exportGroups);
    window.addEventListener('SetStatus', setStatus);
    window.addEventListener('support-chat', openSupportChat);
  }

  function removeListeners() {
    window.removeEventListener('ExportContacts', exportChats);
    window.removeEventListener('ExportGroups', exportGroups);
    window.removeEventListener('SetStatus', setStatus);
    window.removeEventListener('support-chat', openSupportChat);
  }

  function openSupportChat() {
    const link = document.createElement('a');

    link.href = 'https://web.whatsapp.com/send?phone=442032877454';
    link.style.display = 'none';

    document.body.appendChild(link);

    link.click();
    link.remove();
  }

  function exportChats(event) {
    if (event.detail.type === 'all' && event.detail.format === 'Csv') {
      const nameFile = 'WhatsApp All Contacts.csv';
      const windowChatModels = window[Ue].Chat._models;
      let windowContactModels = window[Ue].Contact.getFilteredContacts();

      const arrayOfItems = [['Name', 'Phone 1 - Value', 'Group Membership']];

      for (let g = 0; g < windowChatModels.length; g++) {
        (f = windowChatModels[g]),
          f.__x_isUser &&
            ((h = f.__x_contact.__x_name),
            (windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            arrayOfItems
              .push([
                windowContactModels == undefined && h == undefined
                  ? 'w ' + f.toString()
                  : h
                  ? h
                  : windowContactModels,
                '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                '* myContacts',
              ])
              .toString());
      }

      if (event.detail.typeSend === 'Download') {
        dataToCSV(arrayOfItems, nameFile, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(dataToCSV(arrayOfItems));

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(dataToCSV(arrayOfItems));

        return;
      }
    }

    if (event.detail.type === 'chat' && event.detail.format === 'Csv') {
      const windowChatModels = window[Ue].Chat._models;
      const nameFile = 'WhatsApp Saved Contacts.csv';
      const arrayOfItems = [['Name', 'Phone 1 - Value', 'Group Membership']];
      let windowContactModels = window[Ue].Contact.getFilteredContacts();

      for (g = 0; g < windowChatModels.length; g++) {
        (f = windowChatModels[g]),
          f.__x_isUser &&
            1 == f.contact.__x_isMyContact &&
            ((h = f.__x_contact.__x_name),
            (windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            arrayOfItems.push([
              h,
              '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
              '* myContacts',
            ]));
      }

      if (event.detail.typeSend === 'Download') {
        dataToCSV(arrayOfItems, nameFile, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(dataToCSV(arrayOfItems));

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(dataToCSV(arrayOfItems));

        return;
      }
    }

    if (event.detail.type === 'non-chat' && event.detail.format === 'Csv') {
      const windowChatModels = window[Ue].Chat._models;
      const nameFile = 'WhatsApp Non-Saved Contacts.csv';
      const arrayOfItems = [['Name', 'Phone 1 - Value', 'Group Membership']];
      let windowContactModels = window[Ue].Contact.getFilteredContacts();

      for (g = 0; g < windowChatModels.length; g++) {
        (f = windowChatModels[g]),
          f.__x_isUser &&
            0 == f.contact.__x_isMyContact &&
            ((windowContactModels = f.__x_contact.__x_notifyName),
            // (h = f.__x_contact.__x_name),
            (f = f.__x_contact.__x_id.user),
            arrayOfItems.push([
              windowContactModels == undefined
                ? 'w ' + f.toString()
                : windowContactModels,
              '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
              '* myContacts',
            ]));
      }

      if (event.detail.typeSend === 'Download') {
        dataToCSV(arrayOfItems, nameFile, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(dataToCSV(arrayOfItems));

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(dataToCSV(arrayOfItems));

        return;
      }
    }

    if (event.detail.type === 'all' && event.detail.format === 'vCart') {
      const fileName = 'WhatsApp All Contacts';
      const windowChatModels = window[Ue].Chat._models;
      let windowContactModels = window[Ue].Contact.getFilteredContacts();
      const all = [];

      for (g = 0; g < windowChatModels.length; g++) {
        (f = windowChatModels[g]),
          f.__x_isUser &&
            ((h = f.__x_contact.__x_name),
            (e = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            (name =
              e == undefined && h == undefined
                ? 'w ' + f.toString()
                : h
                ? h
                : e),
            all.push({
              version: '3.0',
              n: undefined ? 'w ' + f.toString() : name,
              fn: undefined ? 'w ' + f.toString() : name,
              CATEGORIES: 'myContacts',
              tel: [
                {
                  value: '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                  type: 'cell',
                },
              ],
            }));
      }

      if (event.detail.typeSend === 'Download') {
        vCard.export(all, fileName, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(vCard.dump(all), fileName);

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(vCard.dump(all), fileName);

        return;
      }
    }

    if (event.detail.type === 'chat' && event.detail.format === 'vCart') {
      const all = [];
      const windowChatModels = window[Ue].Chat._models;
      let windowContactModels = window[Ue].Contact.getFilteredContacts();
      const fileName = 'WhatsApp Saved Contacts';

      for (g = 0; g < windowChatModels.length; g++) {
        (f = windowChatModels[g]),
          f.__x_isUser &&
            1 == f.contact.__x_isMyContact &&
            ((h = f.__x_contact.__x_name),
            (windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            all.push({
              version: '3.0',
              n:
                windowContactModels == undefined
                  ? 'w ' + f.toString()
                  : h
                  ? h
                  : windowContactModels,
              fn:
                windowContactModels == undefined
                  ? 'w ' + f.toString()
                  : h
                  ? h
                  : windowContactModels,
              CATEGORIES: 'myContacts',
              tel: [
                {
                  value: '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                  type: 'cell',
                },
              ],
            }));
      }

      if (event.detail.typeSend === 'Download') {
        vCard.export(all, fileName, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(vCard.dump(all), fileName);

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(vCard.dump(all), fileName);

        return;
      }
    }

    if (event.detail.type === 'non-chat' && event.detail.format === 'vCart') {
      const fileName = 'WhatsApp Non-Saved Contacts';
      const all = [];
      const windowChatModels = window[Ue].Chat._models;
      let windowContactModels = window[Ue].Contact.getFilteredContacts();

      for (g = 0; g < windowChatModels.length; g++) {
        (f = windowChatModels[g]),
          f.__x_isUser &&
            0 == f.contact.__x_isMyContact &&
            ((windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            (c = f),
            all.push({
              version: '3.0',
              n: windowContactModels
                ? windowContactModels
                : 'w ' + f.toString(),
              fn: windowContactModels
                ? windowContactModels
                : 'w ' + f.toString(),
              CATEGORIES: 'myContacts',
              tel: [
                {
                  value: '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                  type: 'cell',
                },
              ],
            }));
      }

      if (event.detail.typeSend === 'Download') {
        vCard.export(all, fileName, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(vCard.dump(all), fileName);

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(vCard.dump(all), fileName);
      }
    }
  }

  // Export from ALL groups
  function exportGroups(event) {
    const chatModels = [];

    try {
      if (event.detail.groupname === 'All Groups') {
        window[Ue].Chat._models
          .filter(({ __x_isGroup }) => __x_isGroup)
          .forEach((chat) => {
            chat.__x_groupMetadata.participants._models.forEach(
              (participant) => {
                const index = chatModels.findIndex(
                  (m) => m.__x_id.user === participant.__x_id.user
                );

                if (index < 0) {
                  chatModels.push(participant);
                }
              }
            );
          });
      } else {
        const index = window[Ue].Chat._models.findIndex(
          (chat) => chat.__x_id.user === event.detail.groupname
        );
        const chat = window[Ue].Chat._models[index];

        chat.__x_groupMetadata.participants._models.forEach((p) => {
          chatModels.push(p);
        });
      }
    } catch (e) {
      const error = {
        action: ANALYTICS_ACTIONS.exception,
        exDescription: e.message,
        exFatal: false,
      };

      dispatchAnalyticsEvent(error);
    }

    if (event.detail.type === 'all' && event.detail.format === 'Csv') {
      const nameFile = 'WhatsApp All Contacts.csv';
      const arrayOfItems = [['Name', 'Phone 1 - Value', 'Group Membership']];

      for (g = 0; g < chatModels.length; g++) {
        let f = chatModels[g];

        // if (f.__x_id.user != window[Ue].Conn.__x_wid.user) {
        // if (
        //   f.__x_id.user !=
        //   window[Ue].Me._events["change:pushname"][0].ctx.__x_id.user
        // ) {
        if (f.__x_id.user != window[Ue].Status._models[0].__x_id.user) {
          (h = f.__x_contact.__x_name),
            (windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            arrayOfItems
              .push([
                windowContactModels == undefined && h == undefined
                  ? 'w ' + f.toString()
                  : h
                  ? h
                  : windowContactModels,
                '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                '* myContacts',
              ])
              .toString();
        }
      }
      if (event.detail.typeSend === 'Download') {
        dataToCSV(arrayOfItems, nameFile, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(dataToCSV(arrayOfItems));

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(dataToCSV(arrayOfItems));

        return;
      }
    }

    if (event.detail.type === 'all' && event.detail.format === 'vCart') {
      const fileName = 'WhatsApp All Contacts';
      const all = [];

      for (g = 0; g < chatModels.length; g++) {
        let f = chatModels[g];
        // if (f.__x_id.user != window[Ue].Conn.__x_wid.user) {
        // if (
        //   f.__x_id.user !=
        //   window[Ue].Me._events["change:pushname"][0].ctx.__x_id.user
        // ) {
        if (f.__x_id.user != window[Ue].Status._models[0].__x_id.user) {
          (h = f.__x_contact.__x_name),
            (e = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            (name =
              e == undefined && h == undefined
                ? 'w ' + f.toString()
                : h
                ? h
                : e),
            all.push({
              version: '3.0',
              n: undefined ? 'w ' + f.toString() : name,
              fn: undefined ? 'w ' + f.toString() : name,
              CATEGORIES: 'myContacts',
              tel: [
                {
                  value: '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                  type: 'cell',
                },
              ],
            });
        }
      }

      if (event.detail.typeSend === 'Download') {
        vCard.export(all, fileName, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(vCard.dump(all), fileName);

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(vCard.dump(all), fileName);

        return;
      }
    }

    if (event.detail.type === 'chat' && event.detail.format === 'Csv') {
      const nameFile = 'WhatsApp Saved Contacts.csv';
      const arrayOfItems = [['Name', 'Phone 1 - Value', 'Group Membership']];

      for (g = 0; g < chatModels.length; g++) {
        let f = chatModels[g];

        // if (f.__x_id.user != window[Ue].Conn.__x_wid.user) {
        // if (
        //   f.__x_id.user !=
        //   window[Ue].Me._events["change:pushname"][0].ctx.__x_id.user
        // ) {

        if (f.__x_id.user != window[Ue].Status._models[0].__x_id.user) {
          1 == f.contact.__x_isMyContact &&
            ((h = f.__x_contact.__x_name),
            (windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            arrayOfItems.push([
              h,
              '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
              '* myContacts',
            ]));
        }
      }

      if (event.detail.typeSend === 'Download') {
        dataToCSV(arrayOfItems, nameFile, true);
        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(dataToCSV(arrayOfItems));

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(dataToCSV(arrayOfItems));

        return;
      }
    }

    if (event.detail.type === 'chat' && event.detail.format === 'vCart') {
      const all = [];
      const fileName = 'WhatsApp Saved Contacts';

      for (g = 0; g < chatModels.length; g++) {
        let f = chatModels[g];

        // if (f.__x_id.user != window[Ue].Conn.__x_wid.user) {
        // if (
        //   f.__x_id.user !=
        //   window[Ue].Me._events["change:pushname"][0].ctx.__x_id.user
        // ) {
        if (f.__x_id.user != window[Ue].Status._models[0].__x_id.user) {
          1 == f.contact.__x_isMyContact &&
            ((h = f.__x_contact.__x_name),
            (windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            all.push({
              version: '3.0',
              n:
                windowContactModels == undefined
                  ? 'w ' + f.toString()
                  : h
                  ? h
                  : windowContactModels,
              fn:
                windowContactModels == undefined
                  ? 'w ' + f.toString()
                  : h
                  ? h
                  : windowContactModels,
              CATEGORIES: 'myContacts',
              tel: [
                {
                  value: '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                  type: 'cell',
                },
              ],
            }));
        }
      }

      if (event.detail.typeSend === 'Download') {
        vCard.export(all, fileName, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(vCard.dump(all), fileName);

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(vCard.dump(all), fileName);

        return;
      }
    }

    if (event.detail.type === 'non-chat' && event.detail.format === 'Csv') {
      const nameFile = 'WhatsApp Non-Saved Contacts.csv';
      const arrayOfItems = [['Name', 'Phone 1 - Value', 'Group Membership']];

      for (g = 0; g < chatModels.length; g++) {
        let f = chatModels[g];

        // if (f.__x_id.user != window[Ue].Conn.__x_wid.user) {
        // if (
        //   f.__x_id.user !=
        //   window[Ue].Me._events["change:pushname"][0].ctx.__x_id.user
        // ) {
        if (f.__x_id.user != window[Ue].Status._models[0].__x_id.user) {
          0 == f.contact.__x_isMyContact &&
            ((windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            arrayOfItems.push([
              windowContactModels == undefined
                ? 'w ' + f.toString()
                : windowContactModels,
              '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
              '* myContacts',
            ]));
        }
      }

      if (event.detail.typeSend === 'Download') {
        dataToCSV(arrayOfItems, nameFile, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(dataToCSV(arrayOfItems));

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(dataToCSV(arrayOfItems));

        return;
      }
    }

    if (event.detail.type === 'non-chat' && event.detail.format === 'vCart') {
      const fileName = 'WhatsApp Non-Saved Contacts.csv';
      const all = [];

      for (g = 0; g < chatModels.length; g++) {
        let f = chatModels[g];
        // if (f.__x_id.user != window[Ue].Conn.__x_wid.user) {
        // if (
        //   f.__x_id.user !=
        //   window[Ue].Me._events["change:pushname"][0].ctx.__x_id.user
        // ) {
        if (f.__x_id.user != window[Ue].Status._models[0].__x_id.user) {
          0 == f.contact.__x_isMyContact &&
            ((windowContactModels = f.__x_contact.__x_notifyName),
            (f = f.__x_contact.__x_id.user),
            (c = f),
            all.push({
              version: '3.0',
              n: windowContactModels
                ? windowContactModels
                : 'w ' + f.toString(),
              fn: windowContactModels
                ? windowContactModels
                : 'w ' + f.toString(),
              CATEGORIES: 'myContacts',
              tel: [
                {
                  value: '+' + f.replace(/(\d)(?=(\d{1})+(\D|$))/, '$1 '),
                  type: 'cell',
                },
              ],
            }));
        }
      }

      if (event.detail.typeSend === 'Download') {
        vCard.export(all, fileName, true);

        return;
      }

      if (event.detail.typeSend === 'Email') {
        sendEmail(vCard.dump(all), fileName);

        return;
      }

      if (event.detail.typeSend === 'Phone') {
        sendPhone(vCard.dump(all), fileName);

        return;
      }
    }
  }

  function setStatus(event) {
    const t = event.detail;
    const vt = atob('c3RhdHVzQGJyb2FkY2FzdA==');
    const e = new window[Ue].UserConstructor(vt, {
      intentionallyUsePrivateConstructor: !0,
    });

    window[Ue].Chat._find(e)
      .then(function (e) {
        e.sendMessage = e.sendMessage
          ? e.sendMessage
          : function () {
              return window[Ue].sendMessage.apply(this, arguments);
            };
        e.sendMessage(t);
      })
      .catch((err) => console.log('error in _find: ', err));
  }

  function sendEmail(file) {
    localStorage.removeItem('userPhone');
    localStorage.removeItem('users');
    localStorage.setItem('users', JSON.stringify(file));
  }

  function sendPhone(file) {
    const dataToUser = window[Ue];

    localStorage.removeItem('userPhone');
    localStorage.removeItem('users');

    // localStorage.setItem("userPhone", "+" + dataToUser.Conn.__x_wid.user);

    // localStorage.setItem(
    //   "userPhone",
    //   "+" + dataToUser.Me._events["change:pushname"][0].ctx.__x_id.user
    // );
    localStorage.setItem(
      'userPhone',
      '+' + dataToUser.Status._models[0].__x_id.user
    );
    localStorage.setItem('users', JSON.stringify(file));
  }

  // UTILS

  var version = {
    TWO: '2.1',
    THREE: '3.0',
    FOUR: '4.0',
  };

  var vCard = {
    Version: version,
    Entry: {
      ADDRESS: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'ADR',
        format: ';;{0};{2};{4};{1};{3}',
        '@comment': 'usage: addAdr(street, code, city, country, state)',
      },
      AGENT: { version: [version.TWO, version.THREE], key: 'AGENT' },
      ANNIVERSARY: { version: [version.FOUR], key: 'ANNIVERSARY' },
      BIRTHDAY: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'BDAY',
      },
      CALENDARADDURI: { version: [version.FOUR], key: 'CALADRURI' },
      CALENDARURI: { version: [version.FOUR], key: 'CALURI' },
      CATEGORIES: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'CATEGORIES',
      },
      CLASS: { version: [version.THREE], key: 'CLASS' },
      CLIENTPIDMAP: { version: [version.FOUR], key: 'CLIENTPIDMAP' },
      EMAIL: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'EMAIL',
      },
      FBURL: { version: [version.FOUR], key: 'FBURL' },
      FORMATTEDNAME: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'FN',
      },
      GENDER: { version: [version.FOUR], key: 'GENDER' },
      GEO: { version: [version.TWO, version.THREE, version.FOUR], key: 'GEO' }, // FIXME two differents formats
      IMPP: { version: [version.THREE, version.FOUR], key: 'IMPP' },
      // TODO: KEY
      KIND: { version: [version.FOUR], key: 'KIND' },
      LABEL: { version: [version.TWO, version.THREE], key: 'LABEL' },
      // TODO: LOGO
      MAILER: { version: [version.TWO, version.THREE], key: 'MAILER' },
      MEMBER: { version: [version.FOUR], key: 'MEMBER' },
      NAME: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'N',
        format: '{1};{0};;{2}',
        '@comment': 'usage: addName(firstname, lastname, title)',
      },
      NICKNAME: { version: [version.THREE, version.FOUR], key: 'NICKNAME' },
      NOTE: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'NOTE',
      },
      ORGANIZATION: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'ORG',
      },
      // TODO: PHOTO
      PRODID: { version: [version.THREE, version.FOUR], key: 'PRODID' },
      PROFILE: { version: [version.TWO, version.THREE], key: 'PROFILE' },
      RELATED: { version: [version.FOUR], key: 'RELATED' },
      REVISION: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'REV',
      },
      ROLE: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'ROLE',
      },
      SORTSTRING: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'SORT-STRING',
      },
      // TODO: SOUND
      SOURCE: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'SOURCE',
      },
      PHONE: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'TEL',
      },
      TITLE: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'TITLE',
      },
      TIMEZONE: {
        version: [version.TWO, version.THREE, version.FOUR],
        key: 'TZ',
      }, // FIXME: two differents formats
      UID: { version: [version.TWO, version.THREE, version.FOUR], key: 'UID' },
      URL: { version: [version.TWO, version.THREE, version.FOUR], key: 'URL' },
      XML: { version: [version.FOUR], key: 'XML' },
    },
    Type: {
      HOME: 'HOME',
      WORK: 'WORK',
      CELL: 'CELL',
      MAIN: 'MAIN',
      OTHER: 'OTHER',
    },
    create: function (version) {
      for (var key in this.Version) {
        if (this.Version[key] === version) return new Card(version);
      }
      throw new Error('Unknown vCard version');
    },
    dump: function (cards) {
      var cardsLength = cards.length;
      var cardsStr = '';

      for (var cardsIndex = 0; cardsIndex < cardsLength; cardsIndex++) {
        var card = cards[cardsIndex];

        var str = 'BEGIN:VCARD\n';

        for (var key in card) {
          var entry = card[key];

          if (typeof entry === 'function') continue;

          if (Object.prototype.toString.call(entry) === '[object Array]') {
            for (var i = 0, l = entry.length; i < l; i++) {
              var e = entry[i];
              str +=
                key.toUpperCase() +
                (e.type ? ';TYPE=' + e.type.toUpperCase() + ':' : ':') +
                e.value +
                '\n';
            }
          } else if (typeof entry === 'object') {
            str +=
              key.toUpperCase() +
              (entry.type ? ';TYPE=' + entry.type.toUpperCase() + ':' : ':') +
              entry.value +
              '\n';
          } else {
            str += key.toUpperCase() + ':' + entry + '\n';
          }
        }

        str += 'END:VCARD';
        cardsStr += str + '\n';
      }

      dispatchAnalyticsEvent({
        action: ANALYTICS_ACTIONS.fileExport,
        category: ANALYTICS_CATEGORIES.userActions,
        value: (cards && cards.length) || 0,
      });

      return cardsStr;
    },
    export: function (card, name, force) {
      var a = document.createElement('a');
      a.download = name + '.vcf';
      a.textContent = name;

      if (Blob) {
        var blob = new Blob([this.dump(card)], { type: 'text/vcard' });
        a.href = URL.createObjectURL(blob);
      } else {
        a.href = 'data:text/vcard;base64,' + this.btoa(this.dump(card));
      }

      force && a.click();
      return a;
    },
    btoa: function (str) {
      str = unescape(encodeURIComponent(str));

      if (!btoa) {
        var b64c =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        var i,
          res = '',
          length = str.length;
        for (i = 0; i < length - 2; i += 3) {
          res += b64c[str.charCodeAt(i) >>> 2];
          res +=
            b64c[
              ((str.charCodeAt(i) & 3) << 4) | (str.charCodeAt(i + 1) >>> 4)
            ];
          res +=
            b64c[
              ((str.charCodeAt(i + 1) & 15) << 2) |
                (str.charCodeAt(i + 2) >>> 6)
            ];
          res += b64c[str.charCodeAt(i + 2) & 63];
        }

        if (length % 3 === 2) {
          res += b64c[str.charCodeAt(i) >>> 2];
          res +=
            b64c[
              ((str.charCodeAt(i) & 3) << 4) | (str.charCodeAt(i + 1) >>> 4)
            ];
          res += b64c[(str.charCodeAt(i + 1) & 15) << 2];
          res += '=';
        } else if (length % 3 === 1) {
          res += b64c[str.charCodeAt(i) >>> 2];
          res += b64c[(str.charCodeAt(i) & 3) << 4];
          res += '==';
        }

        return res;
      } else {
        return btoa(str);
      }
    },
  };

  var Card = function (version) {
    this.version = version;

    for (var key in vCard.Entry) {
      var property = vCard.Entry[key];

      if (!property.version || property.version.indexOf(version) < 0) continue;

      var fn = 'add' + key[0].toUpperCase() + key.slice(1).toLowerCase();

      Card.prototype[fn] = (function (key, format) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          var lastArg = args.length > 0 ? args[args.length - 1] : undefined;

          var model = vCard.Type.hasOwnProperty(lastArg)
            ? args.slice(0, args.length - 1)
            : args;
          var value =
            (format &&
              format.replace(/\{([0-9]*)\}/g, function (match, parameter) {
                return model[parseInt(parameter)] || '';
              })) ||
            model[0];

          this.add(key, value, vCard.Type.hasOwnProperty(lastArg) && lastArg);
        };
      })(property.key, property.format);
    }

    this.add = function (entry, value, type) {
      var key = typeof entry === 'object' && entry.key ? entry.key : entry;

      !this[key] && (this[key] = []);
      var e = { value: value };
      type && (e.type = type);

      this[key].push(e);
    };
  };

  window.vCard = vCard;

  function dataToCSV(a, type = 'Contacts', force = false) {
    const contacts = a;

    for (var b = '', c = 0; c < a.length; c++) {
      for (var e = a[c], d = '', g = 0; g < e.length; g++) {
        var f = null === e[g] || void 0 === e[g] ? '' : e[g].toString();
        e[g] instanceof Date && (f = e[g].toLocaleString());
        f = f.replace(/"/g, '""');

        0 <= f.search(/("|,|\n)/g) && (f = '"' + f + '"');
        0 < g && (d += ',');
        d += f;
      }
      b += d + '\n';
    }

    dispatchAnalyticsEvent({
      action: ANALYTICS_ACTIONS.fileExport,
      category: ANALYTICS_CATEGORIES.userActions,
      value: (contacts && contacts.length) || 0,
    });

    if (!force) {
      return b;
    }

    c = new Blob(['\uFEFF' + b], {
      type: 'text/csv;charset=utf-8,%EF%BB%BF;',
    });
    // c = new Blob([b], {
    //   type: "text/csv;charset=utf-8;",
    // });
    navigator.msSaveBlob
      ? navigator.msSaveBlob(c, type)
      : ((a = document.createElement('a')),
        void 0 !== a.download &&
          ((c = URL.createObjectURL(c)),
          a.setAttribute('href', c),
          a.setAttribute('download', type),
          (a.style.visibility = 'hidden'),
          document.body.appendChild(a),
          a.click(),
          document.body.removeChild(a)));
  }

  function dispatchAnalyticsEvent(detail) {
    const event = new CustomEvent(SET_ANALYTICS_EVENT, { detail });

    window.dispatchEvent(event);
  }

  function dispatchSaveNumberEvent() {
    if (window[Ue] && window[Ue].Status._models.length > 0) {
      const event = new CustomEvent('save-number', {
        detail: window[Ue] && window[Ue].Status._models[0].__x_id.user,
      });
      window.dispatchEvent(event);
    }
  }
})();
