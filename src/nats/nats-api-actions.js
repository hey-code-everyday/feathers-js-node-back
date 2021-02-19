const app = require('../app');
const {natsClient} = require('./nats-adapter');

module.exports = () => {

  natsClient.subscribe('actions.api', async (msg, reply) => {

    const parsedMessage = JSON.parse(msg);

    switch (parsedMessage.action){
    case 'getQueueChannelIds':
      if(reply){
        const res = await getQueueChannelIds();
        natsClient.publish(reply, JSON.stringify({data: {queueIds: res}}));
      }
      break;
    case 'pollConferences':
      pollConfChannels();
      break;
    default:
      break;
    }
  });

};

const getQueueChannelIds = async () => {
  const appChannels = app.channels;
  let queueIds = [];

  //adds all the queue ids to send actions for.
  const regEx = new RegExp("(queues\\/)[0-9]*");
  for(let i = 0; i < appChannels.length; i++){
    if(regEx.test(appChannels[i])){
      if(app.channel(appChannels[i]).length){
        if(appChannels[i].split('/')[1] !== 'undefined'){
          queueIds.push(appChannels[i].split('/')[1]);
        }
      }
    }
  }

  return queueIds;
};

const pollConfChannels = async () => {
  const appChannels = app.channels;

  for(let i = 0; i < appChannels.length; i++){
    if(appChannels[i].match(/(conferences\/)/g)){
      const channelParts = appChannels[i].split('/')
      const bridgeId = channelParts[2];
      const server = channelParts[1];

      natsClient.publish(`actions.presence.${server}`, JSON.stringify({
        action: 'amiAction',
        data: {
          action: 'bridgeinfo',
          actionid: `conferences/${server}/${bridgeId}`,
          bridgeuniqueid: bridgeId
        }
      }));
    }
  }
}

