const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.tenants = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('users-tenants')._find({
        paginate: false,
        query: {
          userId: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, tenant => tenant.userId, '[]');
    }, {context});

    context._loaders.queues = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('queue-managers')._find({
        paginate: false,
        query: {
          userId: {$in: getUniqueKeys(keys)}
        },
      });
      return getResultsByKey(keys, result, queue => queue.userId, '[]');
    }, {context});
  },
  joins: {
    tenants: () => async (user, context) => {
      const results = await context._loaders.tenants.load(user.id);
      user.tenantIds = results ? results.map(item => item.tenantId) : [];
    },
    queues: () => async (user, context) => {
      const results = await context._loaders.queues.load(user.id);
      user.adminQueues = results ? results.map(item => item.queueId) : [];
    }
  }
};

exports.resolverGet = {
  joins: {

    extensions: () => async (user, context) => {

      const sequelize = context.app.get('sequelizeClient');
      const getUserResolverQuery = await sequelize.query(
        `SELECT
          ex_extensions.ex_id as id,
          ex_extensions.ex_name as name,
          ex_extensions.ex_number as number,
          ex_extensions.ex_cidnum as callerId,
          ex_extensions.ex_te_id as tenantId,
          ex_extensions.ex_dnd as dnd,
          ex_extensions.ex_tech_id as sipFriendId,
          sipfriends.secret as peerSecret,
          sipfriends.defaultuser as peerName,
          sipfriends.accountcode as tenantCode,
          st_states.st_state as status,
          st_states.st_peername as hostServer,
          mf_mailtofaxes.mf_cidnum as faxNumber,
          mf_mailtofaxes.mf_id as mailToFaxId,
          voicemail.uniqueid as voicemailId,
          pb_phonebooks.pb_id as omniaPhonebookId,
          ph_phones.ph_id as deviceId,
          queue_member.queue_name as queueMemberId,
          aq_allowed_queue_member.aq_queue_name as queueAllowedId
        FROM
          ex_extensions
          INNER JOIN sipfriends on sipfriends.id = ex_extensions.ex_tech_id
          LEFT JOIN st_states on st_states.st_extension = sipfriends.defaultuser
          LEFT JOIN mf_mailtofaxes on ex_extensions.ex_email = mf_mailtofaxes.mf_email
          LEFT JOIN voicemail on ex_extensions.ex_number = voicemail.mailbox AND ex_extensions.ex_te_id = voicemail.te_id
          LEFT JOIN pb_phonebooks on ex_extensions.ex_te_id = pb_phonebooks.pb_te_id AND pb_phonebooks.pb_name = CONCAT('OMNIA', '-', ex_extensions.ex_id)
          LEFT JOIN ph_phones on ex_extensions.ex_id = ph_phones.ph_line1_ex_id
          LEFT JOIN queue_member on queue_member.member_device = sipfriends.defaultuser
          LEFT JOIN aq_allowed_queue_member on aq_allowed_queue_member.aq_member_device = sipfriends.defaultuser
        WHERE
          ex_email = '${user.email}';`,
        {type: sequelize.QueryTypes.SELECT}
      );

      if(getUserResolverQuery.length){
        let devices = [], queues1 = [], queues2=[];
        for(let i = 0; i < getUserResolverQuery.length; i++){
          devices.push(getUserResolverQuery[i].deviceId);
          queues1.push(+getUserResolverQuery[i].queueMemberId);
          queues2.push(+getUserResolverQuery[i].queueAllowedId);
        }

        let queueIds = [...queues1, ...queues2];
        queueIds = queueIds.filter((value, index, self) => self.indexOf(value) === index);

        const {sipFriendId, id, name, tenantId, tenantCode, number, status,
          hostServer, peerName, peerSecret, dnd, callerId, voicemailId, omniaPhonebookId, faxNumber, mailToFaxId} = getUserResolverQuery[0];

        user.faxEnabled = !!mailToFaxId;
        user.faxNumber = faxNumber ? faxNumber : null;

        user.myExtension = {
          id,
          name,
          tenantId,
          tenantCode,
          number,
          sipFriendId,
          status,
          hostServer,
          peerName,
          peerSecret,
          dnd,
          callerId,
          voicemailId,
          omniaPhonebookId,
          devices,
          queueIds
        };
      }
    }
  }
};
