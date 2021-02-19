exports.resolverGet = {
  joins: {
    rules: () => async (profile, context) => {
      profile.rules = await context.app.service('dialing-rules').find({paginate: false, query: {routingProfileId: profile.id}});
    }
  }
};
