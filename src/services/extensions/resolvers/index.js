const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;
const deRef = require('../../../ref/destinations-reference');


exports.resolverFind = {
  before: context => {
    context._loaders.sipFriend = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('sipfriends').find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, sipFriend => sipFriend.id, '');
    }, {context});

    context._loaders.user = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('users')._find({
        paginate: false,
        query: {
          email: {$in: getUniqueKeys(keys)},
        }
      });
      return getResultsByKey(keys, result, user => user.email, '');
    }, {context});
  },

  joins: {
    sipFriend: () => async (extension, context) => {
      const results = await context._loaders.sipFriend.load(extension.techId);
      if (results) {
        const {sipStatus, hostServer, defaultUser, secret} = results;
        extension.extStatus = sipStatus;
        extension.hostServer = hostServer;
        extension.peerName = defaultUser;
        extension.peerSecret = secret;
      }
    },
    user: () => async (extension, context) => {
      const results = await context._loaders.user.load(extension.email);
      extension.avatarPath = null;
      if (results) {
        extension.avatarPath = results.avatarPath;
      }
    },
    customFields: () => async (extension, context) => {
      extension.nameNumber = `${extension.name} - ${extension.number}`;
      if(!extension.branch.length){
        extension.branch = 'Unassigned';
      }
    }
  }
};

exports.resolverGet = {
  joins: {
    sipFriend: () => async (extension, context) => {
      const sipdevice = await context.app.service('sipfriends').find({paginate: false, query: {id: extension.techId}});
      if (sipdevice.length) {
        const {sipStatus, hostServer, defaultUser, secret} = sipdevice[0];
        extension.extStatus = sipStatus;
        extension.hostServer = hostServer;
        // extension.dnd = '';
        extension.peerName = defaultUser;
        extension.peerSecret = secret;
      }
    },
    voicemail: () => async (extension, context) => {
      const voicemails = await context.app.service('voicemails').find({paginate: false, query: {mailbox: extension.number, tenantId: extension.tenantId}});
      extension.voicemails = voicemails.length ? voicemails : null;
    },
    destinations: () => async (extension, context) => {
      extension.de_destinations = await context.app.service('destinations').find({
        paginate: false,
        query: {
          tenantId: extension.tenantId,
          de_type_src: deRef.EXT,
          typeIdSrc: extension.id
        }
      });
    },
  }
};
