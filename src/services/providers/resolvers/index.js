exports.resolverGet = {
  joins: {
    sipFriends: () => async (provider, context) => {
      provider.sipfriends = await context.app.service('sipfriends').find({paginate: false, query: {id: provider.techId}});
    }
  }
};
