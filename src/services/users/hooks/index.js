const {Forbidden, BadRequest} = require('@feathersjs/errors');
const sgMail = require('@sendgrid/mail');
const generator = require('generate-password');
const mailTemplate = require('../email-templates/user-create');

//validation params
const validate = require('@feathers-plus/validate-joi');
const {schema, schema_UPDATE, joiOptions} = require('../validation/schema');

//apply search filter
exports.applyFilter = function () {
  return async context => {
    const {filter} = context.params.query;

    if (filter) {
      if (filter.length) {
        if(context.params.query.hasOwnProperty('$or')){
          for(let i = 0; i < context.params.query.$or.length; i++){
            context.params.query.$or[i] = {
              ...context.params.query.$or[i],
              email: {$like: `%${filter}%`}
            };
          }
        } else{
          context.params.query.$or = [
            {email: {$like: `%${filter}%`}}
          ];
        }
      }
    }

    delete context.params.query.filter;

    return context;
  };
};

//Password Generator For User Create and Patch Methods
exports.generatePassword = function () {
  return async context => {
    //always generate pw on create. check generation on reset password flag for patch method.
    if (context.method === 'create' || (context.method === 'patch' && context.data.resetPassword)) {
      context.rawPass = context.data.password = generator.generate({
        length: 12,
        numbers: true,
        uppercase: true
      });
      context.resetPass = true;
    }
    return context;
  };
};

//Assign, update, delete tenant assignments for account admins
exports.updateTenants = function () {
  return async context => {
    const {method} = context;
    const {id} = context.result;

    const {tenantIds, userRole} = method === 'remove' ? context.result : context.data;

    if(tenantIds){
      await context.app.service('users-tenants').remove(null, {
        query: {
          userId: id
        }
      });

      if(+userRole === 3 && method !== 'remove'){
        const bulkData = tenantIds.map( (tenant) => {
          return {
            userId: id,
            tenantId: tenant
          };
        });

        await context.app.service('users-tenants').create(bulkData);
      }
    }
    return context;
  };
};

//Assign, update, delete extension for the user
exports.updateExtension = function () {
  return async context => {
    const {method} = context;
    let {userRole, tenantId, extension, email} = method === 'remove' ? context.result : context.data;
    const extensionService = context.app.service('extensions');

    //set extension stuff in result object
    if(extension === undefined){extension = '';}
    context.result.extension = extension.length ? extension : 'NOT ASSIGNED';

    //force home tenant and extension requirement if not super
    //if this request is coming from internal it is a pw reset or something. we will ignore this stuff.
    if(+userRole !== 1 && context.provider !== undefined){
      if(!tenantId || !extension.length){
        throw new BadRequest('You Must Assign a Home Tenant and Extension!');
      }
    }

    if(method === 'remove'){
      //check for extension that needs email to be wiped
      const oldExtension = await extensionService.find({
        query: {
          email
        }
      });

      if(oldExtension.length){
        //remove email from the old extension field.
        extensionService.patch(oldExtension[0].id, {email: null});
        context.result.extPeer = oldExtension[0].peerName;
        //user was delete so let's blow away that old omnia phonebook

        //remove phonebook OMNIA-EXTENSIONID
        const phonebook = await context.app.service('phonebooks')._remove(null, {
          query: {
            name: `OMNIA-${oldExtension[0].id}`
          }
        });
        if(phonebook.length){

          const phonebookId = phonebook[0].id;
          //remove phone-phonebooks where phonebook id = above id
          context.app.service('phone-phonebooks')._remove(null, {
            query: {
              phonebookId
            }
          });
          //remove phonebook layouts where phonebook id = above id
          context.app.service('phonebook-layouts')._remove(null, {
            query: {
              phonebookId
            }
          });
          //remove phonebook entries where phonebook id = above id
          const removeEntries = await context.app.service('phonebook-entries')._remove(null, {
            query: {
              phonebookId
            }
          });
          const entryIds = removeEntries.map( entry => entry.id);
          //remove phonebook details where entry id in the above ids
          context.app.service('phonebook-details')._remove(null, {
            query: {
              phonebookEntryId: {$in: entryIds}
            }
          });
        }
      }
    } else{
      if(tenantId && extension.length){
        //check for old extension that needs to be wiped
        const oldExtension = await extensionService.find({
          query: {
            email
          }
        });

        if(oldExtension.length){
          if(oldExtension[0].number === extension && oldExtension[0].tenantId === tenantId){
            context.params.assignedExt = oldExtension[0].id;
            context.params.extName = oldExtension[0].name.replace(' ', '_');
            context.params.extPeer = oldExtension[0].peerName;
            return context;
          } else{
            extensionService.patch(oldExtension[0].id, {email: null});
            //this means their extension changed. we have to blow away the old phonebook data please
            //remove phonebook OMNIA-EXTENSIONID
            const phonebook = await context.app.service('phonebooks')._remove(null, {
              query: {
                name: `OMNIA-${oldExtension[0].id}`
              }
            });
            if(phonebook.length){

              const phonebookId = phonebook[0].id;
              //remove phone-phonebooks where phonebook id = above id
              context.app.service('phone-phonebooks')._remove(null, {
                query: {
                  phonebookId
                }
              });
              //remove phonebook layouts where phonebook id = above id
              context.app.service('phonebook-layouts')._remove(null, {
                query: {
                  phonebookId
                }
              });
              //remove phonebook entries where phonebook id = above id
              const removeEntries = await context.app.service('phonebook-entries')._remove(null, {
                query: {
                  phonebookId
                }
              });
              const entryIds = removeEntries.map( entry => entry.id);
              //remove phonebook details where entry id in the above ids
              context.app.service('phonebook-details')._remove(null, {
                query: {
                  phonebookEntryId: {$in: entryIds}
                }
              });
            }
          }
        }

        if(method !== 'remove'){
          //assign to new extension
          const newExtension = await extensionService.find({
            query: {
              number: extension,
              tenantId
            }
          });
          if(newExtension.length){
            extensionService.patch(newExtension[0].id, {email});
            context.params.assignedExt = newExtension[0].id;
            context.params.extName = newExtension[0].name.replace(' ', '_');
            context.params.extPeer = newExtension[0].peerName;
          }
        }
      }
    }
    return context;
  };
};

//Assign, update, delete the queues for account admins and queue managers
exports.updateQueues = function () {
  return async context => {
    const {method} = context;
    let {userRole, adminQueues} = method === 'remove' ? context.result : context.data;
    const userId = context.result.id;

    if(adminQueues){
      //always remove the old ones
      await context.app.service('queue-managers')._remove(null, {
        query: {
          userId
        }
      });

      if(method !== 'remove' && (+userRole === 7 || +userRole === 3)){
        let bulkItems = adminQueues.map( item => {
          return {
            userId,
            queueId: item
          };
        });

        if(bulkItems.length){
          await context.app.service('queue-managers')._create(bulkItems);
        }

        //we need to go ahead and add them to allowed members table as well.
        if(+userRole === 7){
          const {assignedExt, extPeer, extName} = context.params;

          if(assignedExt){
            const userInterface = `Local/AG-000-NF-${assignedExt}@fromotherpbx`;
            const stateInterface = `Custom:${extPeer}`;

            bulkItems = [];
            bulkItems = adminQueues.map( item => {
              return {
                membername: extName,
                queueName: item,
                interface: userInterface,
                stateInterface,
                penalty: 0,
                paused: 0,
                memberdevice: extPeer,
                loggedIn: 0
              };
            });
            if(bulkItems.length){

              await context.app.service('queuemembers-allowed').remove(null, {
                query: {
                  memberdevice: extPeer
                }
              });

              context.app.service('queuemembers-allowed')._create(bulkItems);
            }
          }
        }
      }
    }

    return context;
  };
};

//Verifies that the Result is Viewable By the User Requesting The Record
exports.userGetAuth = function () {
  return async context => {
    const {tenantIds, userRole} = context.params.user;
    const userId = +context.params.user.id;
    const recordId = context.result.id;
    const resultTenant = context.result.tenantId;
    const resultRole = context.result.userRole;

    //everyone can fetch their own profile
    if (userId === recordId) {
      return context;
    }

    //super admin can do whatever they want
    if (+userRole === 1) {
      return context;
    }

    //these roles can only fetch themselves
    if ((+userRole === 5 || +userRole === 7) && (userId !== recordId)) {
      throw new Forbidden('Not Authorized. You can only access your own profile');
    }

    //at this point, we have handled basic users. on to account admin
    const basicUserAuthorized = tenantIds.includes(resultTenant);

    //basic users can be returned if you have access to their assigned tenant
    if ((+resultRole === 5 || +resultRole === 7) && basicUserAuthorized) {
      return context;
    }

    //otherwise you cannot access their profile
    if ((+resultRole === 5 || +resultRole === 7) && !basicUserAuthorized) {
      throw new Forbidden('You may not access users for this tenant. Call Fred.');
    }

    //never return a platform admin to any other role
    if(+resultRole === 1){
      throw new Forbidden('You may not access this user!');
    }

    //admins can only match other admins that have the same subset of tenant access.
    const userRecordTenants = context.result.tenantIds;
    const usersNotAllowed = userRecordTenants.filter(id => tenantIds.indexOf(id) < 0);

    if (usersNotAllowed.length) {
      throw new Forbidden('You may not access this user!');
    }
    return context;
  };
};

//Verifies that the user is authorized for creation based on User Create Request Body
exports.userCreateAuth = function () {
  return async context => {
    const requestingUser = context.params.user;
    const {tenantIds, userRole, tenantId, adminQueues} = context.data;
    const allTenantIds = [...tenantIds, tenantId];

    //we have to query tenants to be sure these ids actually exist. we can't assign orphan pivots. could give unintended access
    const tenants = await context.app.service('tenants')._find({
      paginate: false,
      query: {
        id: {$in: allTenantIds}
      }
    });
    const validTenants = tenants.map(tenant => tenant.id);

    //if level 3 user is being created there must be at least one valid tenant.
    if(+userRole === 3 && !tenantIds.length){
      throw new BadRequest('You Must Assign At Least One Account!');
    }

    //we have to query queues to be sure they are on the tenant and exist
    const queues = await context.app.service('queues')._find({
      paginate: false,
      query: {
        id: {$in: adminQueues},
        tenantId
      }
    });
    context.data.adminQueues = queues.map(queue => queue.id);

    //these roles require tenant assignment
    if (+userRole === 5 || +userRole === 7) {
      if (!(tenantId && validTenants.includes(tenantId))) {
        throw new BadRequest('Basic User Creation. Invalid Tenant Assignment!');
      }
    }

    //this role requires admin queues to be provided
    if(+userRole === 7 && !context.data.adminQueues.length){
      throw new BadRequest('Queue Manager Creation. You Must Assign Queues!');
    }

    //just forcing on valid tenant ids from posted ids
    if (+requestingUser.userRole === 1 && +userRole === 3) {
      context.data.tenantIds = tenantIds.filter(id => validTenants.includes(id));
    }

    //if a level 3 user tried to assign the new account a tenant they are not authorized for
    if(+requestingUser.userRole === 3){
      if(!requestingUser.tenantIds.includes(tenantId)){
        throw new Forbidden('Invalid Tenant Assignment. You cannot assign a user to this account.');
      }
    }

    //only allows tenant ids that the admin is authorized for to be passed for the new admin.
    if (+requestingUser.userRole === 3 && +userRole === 3) {
      const allowedTenants = validTenants.filter(id => requestingUser.tenantIds.includes(id));
      context.data.tenantIds = allowedTenants.filter(id => tenantIds.includes(id));
    }

    //only super admin can create another super admin.
    if (+requestingUser.userRole === 3 && +userRole === 1) {
      throw new Forbidden('You Are Not Authorized to Create A User With This Role');
    }

    return context;
  };
};

//Verifies that users can only remove record if authorized
exports.userDeleteAuth = function () {
  return async context => {
    const recordId = context.id;
    const reqUserId = context.params.user.id;
    const { userRole, tenantIds } = context.params.user;

    if(recordId === reqUserId){
      return context;
    }

    if(+userRole !== 1 ){

      let userToDelete = await context.app.service('users').find({
        paginate: false,
        query: {
          id: recordId
        }
      });
      userToDelete = userToDelete[0];

      if(+userToDelete.userRole === 1){
        throw new Forbidden('You cannot delete this user!');
      }

      if(+userToDelete.userRole === 5 || +userToDelete.userRole === 7){
        return context;
      }

      if(+userToDelete.userRole === 3){
        const mismatchedTenants = userToDelete.tenantIds.filter( id => !tenantIds.includes(id));
        if(mismatchedTenants.length){
          throw new Forbidden('You cannot delete this user!');
        }
      }
    }
    return context;
  };

};

//Verifies that users only get who they are authorized to see for the Find Request
exports.userFindAuth = function () {
  return async context => {

    const {userRole, tenantIds} = context.params.user;
    const {tenantId} = context.params.query;
    const userId = context.params.user.id;

    //super admins can do what they want.
    if(+userRole === 1){

      //this is to make sure we also grab any account admins for this tenant, regardless of their home tenant.
      if(tenantId){
        const adminUsers = await context.app.service('users-tenants')._find({paginate: false, query: {tenantId}});
        const adminsIdArray = adminUsers.map( user => user.userId);

        delete context.params.query.tenantId;

        context.params.query = {
          ...context.params.query,
          $or: [
            {id: {$in: adminsIdArray}},
            {tenantId}
          ]
        };
      }

      return context;
    }

    //User Role 5 and 7 Can Only Return Themselves
    if (+userRole === 5 || +userRole === 7) {
      context.params.query.id = userId;
      return context;
    }

    //Other Users are Restricted Based On Their Assigned Tenants
    if (+userRole !== 1) {

      const idArray = tenantIds ? tenantIds : [];
      const allowedUsers = await context.app.service('users-tenants')._find({paginate: false, query: {tenantId}});
      let usersIdArray = allowedUsers.map((user) => user.userId);
      if (!usersIdArray.length) {
        throw new Forbidden('Not Authorized');
      }

      //get unique id array to query against the user tenants table again.
      let uniqueUserIds = usersIdArray.filter(function (id, index) {
        return usersIdArray.indexOf(id) === index;
      });

      //get all the userTenants records for Each Unverified allowed user
      const allUsersTenants = await context.app.service('users-tenants').find({paginate: false, query: {userId: {$in: uniqueUserIds}}});
      let allUsersTenantsResults = allUsersTenants.map(user => user);

      //add all user ids that have a mismatched tenant to a "to be removed" array
      let idsToRemove = [];
      for (let i = 0; i < allUsersTenantsResults.length; i++) {
        if (!idArray.includes(allUsersTenantsResults[i].tenantId) && !idsToRemove.includes(allUsersTenantsResults[i].userId)) {
          idsToRemove.push(allUsersTenantsResults[i].userId);
        }
      }

      //creates verified user array that we can query against.
      let filteredAllowedUsers = uniqueUserIds.filter(id => !idsToRemove.includes(id));
      if (!filteredAllowedUsers.length) {
        throw new Forbidden('Not Authorized');
      }

      if(!context.params.query.userRole){
        context.params.query.userRole = {
          $ne: 1
        };
      }

      context.params.query = {
        ...context.params.query,
        $or: [
          {id: {$in: filteredAllowedUsers}},
          {tenantId, userRole: {$in: ['5', '7']}}
        ]
      };
    }

    return context;
  };
};

//Verifies that a User is Authorized to Make this Update Request
exports.userUpdateAuth = function () {
  return async context => {

    const requestingUser = context.params.user;
    const recordId = context.id;
    const {tenantIds, userRole, tenantId, adminQueues} = context.data;

    const isMe = +requestingUser.id === +recordId;
    const roleChange = +requestingUser.userRole !== +userRole;
    const tenantChange = +requestingUser.tenantId !== +tenantId;

    //user cannot change their own role
    if(isMe && roleChange){
      throw new Forbidden('You cannot change your own role. That is silly.');
    }

    //these users can only update themselves
    if((+requestingUser.userRole === 5 || +requestingUser.userRole === 7) && !isMe){
      throw new Forbidden('Not Authorized. You can only update your own profile!');
    }

    //if updating themselves, these users cannot change role or account assignment
    if(+requestingUser.userRole === 5 || +requestingUser.userRole === 7){
      if(tenantChange || roleChange){
        throw new Forbidden('You can update your profile, but you cannot change your assigned account or role!');
      } else{
        return context;
      }
    }

    //if we made it here we have passed the basics user cases
    //platform admin updating account admin
    if(+requestingUser.userRole === 1 && +userRole === 3){

      const tenants = await context.app.service('tenants')._find({
        paginate: false,
        query: {
          id: {$in: tenantIds}
        }
      });
      context.data.tenantIds = tenants.map(tenant => tenant.id);

      //remove old records so we can just add new
      await context.app.service('users-tenants')._remove(null, {
        query: {
          userId: recordId
        }
      });
    }

    //account admin auth
    if(+requestingUser.userRole === 3){

      //cannot give super admin access to anyone.
      if(+userRole === 1){
        throw new Forbidden('You cannot upgrade accounts to this role!');
      }

      let userRecord = await context.app.service('users').find({
        paginate: false,
        query: {
          id: recordId
        }
      });
      userRecord = userRecord[0];

      //cannot make changes to a super admin account
      if(+userRecord.userRole === 1){
        throw new Forbidden('You cannot update an account with this role.');
      }

      //allow basic user update if tenant is in tenant ids
      if((+userRecord.userRole === 5 || +userRecord.userRole === 7) && !requestingUser.tenantIds.includes(+userRecord.tenantId)){
        throw new Forbidden('You cannot update users for this account');
      }

      //level 5 user can be updated as long as tenant assignment is valid
      if(+userRole === 5 && requestingUser.tenantIds.includes(tenantId)){
        return context;
      }

      //remaining roles are queue manager and account admin. we need queues for both.
      const validQueues = await context.app.service('queues')._find({
        paginate: false,
        query: {
          tenantId,
          id: {$in: adminQueues}
        }
      });
      context.data.adminQueues = validQueues.map( queue => queue.id );

      //level 7 user can be updated but we need to be sure the queues are ok
      if(+userRole === 7 && requestingUser.tenantIds.includes(tenantId)){
        return context;
      }

      //level 3 user make sure there is not a mismatched tenant
      if(+userRecord.userRole === 3){
        const mismatchedTenants = userRecord.tenantIds.filter( id => !requestingUser.tenantIds.includes(id));

        if(mismatchedTenants.length){
          throw new Forbidden('You cannot update this user');
        }

        const allowedTenants = tenantIds.filter( id => requestingUser.tenantIds.includes(id));
        const validTenants = await context.app.service('tenants')._find({
          paginate: false,
          query: {
            id: {$in: allowedTenants}
          }
        });
        context.data.tenantIds = validTenants.map( tenant => tenant.id);

        //remove old records so we can just add new
        await context.app.service('users-tenants')._remove(null, {
          query: {
            userId: recordId
          }
        });
      }
    }
    return context;
  };
};

//User Creation Validation
exports.validateCreate = function () {
  return validate.form(schema, joiOptions);
};

//User Patch Validation
exports.validateUpdate = function () {
  return validate.form(schema_UPDATE, joiOptions);
};

//Hook That First the Email Invite to User
exports.welcomeEmail = function () {
  return async context => {
    const {method, resetPass} = context;

    if (method === 'create' || (method === 'patch' && resetPass)) {
      const {result, rawPass} = context;

      const html = await mailTemplate(result, rawPass);

      //fetch the sendgrid api key from db
      const settings = await context.app.service('tenant-settings')._find({paginate: false, query: {code: 'SENDGRIDAPIKEY'}});
      const sgApiKey = settings[0].value;

      sgMail.setApiKey(sgApiKey);
      const msg = {
        to: result.email,
        from: 'noreply@voxo.co',
        subject: 'Welcome to the VOXO Portal!',
        html: html
      };
      sgMail.send(msg);
    }
    return context;
  };
};

