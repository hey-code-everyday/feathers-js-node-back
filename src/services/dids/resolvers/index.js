const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;
const deRef = require('../../../ref/destinations-reference');

exports.resolverFind = {
  before: context => {
    context._loaders.destinations = new BatchLoader( async(keys, context) => {
      const result = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          typeIdSrc: {$in: getUniqueKeys(keys)},
          de_type_src: {$in: deRef.DID}
        }
      });
      return getResultsByKey(keys, result, destinations => destinations.typeIdSrc, '[]');
    }, {context});
    context._loaders.tenants = new BatchLoader( async (keys, context) => {
      const result = await context.app.service('tenants')._find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, tenants => tenants.id, '');
    }, {context});
  },
  joins: {
    destinations: () => async (did, context) => {
      let foundPrimary = false;
      const primaryDes = ['CONDITION', 'EXT', 'HUNTLIST', 'IVR', 'MEETME', 'QUEUE', 'VOICEMAIL'];
      const destinations = await context._loaders.destinations.load(did.id);
      if(destinations){
        for(let i = 0; i<destinations.length; i++){
          if(destinations[i].tenantId === did.tenantId){
            if(primaryDes.includes(destinations[i].typeDst)){
              foundPrimary = true;
              break;
            }
            if(foundPrimary){
              break;
            }
          }
        }
      }
      did.useStatus = foundPrimary ? 'Unavailable' : 'Available';
    },
    tenants: () => async (did, context) => {
      const tenant = await context._loaders.tenants.load(did.tenantId);
      did.tenantName = tenant ? tenant.name : '';
    }
  }
};

exports.resolverGet = {
  joins: {
    destinations: () => async (did, context) => {
      let foundPrimary = false;
      const primaryDes = ['CONDITION', 'EXT', 'HUNTLIST', 'IVR', 'MEETME', 'QUEUE', 'VOICEMAIL'];
      const destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: did.tenantId, de_type_src: {$in: deRef.DID}, typeIdSrc: did.id
        }
      });
      for(let i = 0; i<destinations.length; i++){
        if(primaryDes.includes(destinations[i].typeDst)){
          foundPrimary = true;
          break;
        }
        if(foundPrimary){
          break;
        }
      }
      did.de_destinations = destinations;
      did.useStatus = foundPrimary ? 'Unavailable' : 'Available';
    },
    emergExtensions: () => async (did, context) => {
      did.emergExtensions = await context.app.service('extensions')._find({paginate: false, query: {emergencyCidNum: did.number}});
    }
  }
};
