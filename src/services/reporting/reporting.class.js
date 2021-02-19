const sgMail = require('@sendgrid/mail');
const getReports = require('./modules/get-reports');
const getTenants = require('./modules/get-tenants');
const getUserExtensions = require('./modules/get-user-extensions');
const getEmails = require('./modules/get-emails');
const queryInfo = require('./modules/query-info');
const queryExits = require('./modules/query-exits');
const queryLastWeek = require('./modules/queue-last-week');
const queryLastMonth = require('./modules/queue-last-month');
const extTemplate = require('./templates/ext-report');
const managerTemplate = require('./templates/manager-report');
const managerWeeklyTemplate = require('./templates/manager-weekly-report');
const managerMonthlyTemplate = require('./templates/manager-monthly-report');
const queueManagerDailyTemplate = require('./templates/queue-manager-daily-report');
const queueManagerWeeklyTemplate = require('./templates/queue-manager-weekly-report');
const queueManagerMonthlyTemplate = require('./templates/queue-manager-monthly-report');
const queryTheHunt = require('./modules/the-hunt');
const huntListTemplateDaily = require('./templates/hunt-list-daily-report');
const groupBy = require('lodash/groupBy');
const emailGroups = require('./constants');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {

    const {type} = params.query;
    if (type === 'DAILY_USER') {
      this.dailyUserReport(params);
    }
    if (type === 'WEEKLY_MANAGER') {
      this.weeklyManagerReport(params);
    }
    if (type === 'MONTHLY_MANAGER') {
      this.monthlyManagerReport(params);
    }
    if(type === 'DAILY_HUNTLIST'){
      this.dailyHuntListReport(params);
    }
    return [{msg: 'how bout twinkle?'}];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return {id};
  }

  async dailyUserReport(params) {
    const {type} = params.query;
    const reports = await getReports(type, this.app);

    //query all the tenants in one go.
    const tenantIds = Object.keys(reports);
    const tenants = await getTenants(tenantIds, this.app);

    //looping through all the tenants
    for (let i = 0; i < tenants.length; i++) {
      const currentTenant = tenants[i];
      let managerEmails = [];
      let legacyEmails = [];
      try {
        const reportParams = JSON.parse(reports[currentTenant.id.toString()][0].parameters);
        managerEmails = reportParams.managers;
        legacyEmails = reportParams.hasOwnProperty('legacy') ? reportParams.legacy : [];
      } catch (err) {
        managerEmails = [];
        legacyEmails = [];
      }

      const extParams = await getUserExtensions(
        {
          tenantId: currentTenant.id,
          tenantCode: currentTenant.tenantCode
        },
        this.app
      );

      const emailRes = await getEmails({tenantId: currentTenant.id, numbers: extParams}, this.app);
      const {emailRef, extNumArray, agentNamesArray, extNameKey} = emailRes;

      const callQuery = await queryInfo(
        {
          tenantId: currentTenant.id,
          extNumArray,
          tenantCode: currentTenant.tenantCode,
          queues: currentTenant.queues,
          agentNames: agentNamesArray,
          extNameKey
        },
        'DAILY',
        this.app
      );
      const {outgoing, incoming, pauses, endings, starts, queueData, missed} = callQuery;


      // console.log(incoming);
      // console.log(queueData);

      //loop through users with emails and generate and email report.
      const sgApiKey = await this.getApiKey();
      sgMail.setApiKey(sgApiKey);
      console.log(`::: DAILY EXTENSION REPORTS - Tenant ${currentTenant.tenantCode} :::`);
      for (let user in emailRef) {
        if (emailRef.hasOwnProperty(user)) {
          const currentUser = emailRef[user][0];
          const userExt = currentUser.number.toString();

          const params = {
            tenantName: currentTenant.name,
            number: currentUser.number,
            extName: currentUser.name,
            outgoing: outgoing[userExt],
            incoming: incoming[userExt],
            pauses: pauses[userExt],
            endings: endings[userExt],
            starts: starts[userExt],
            missed: missed[userExt],
            interval: 'DAILY'
          };

          //build email and fire away.
          const html = await extTemplate(params);
          if (html !== null) {
            console.log('sending the email to: ' + currentUser.email);
            const msg = {
              to: currentUser.email,
              from: 'noreply@voxo.co',
              subject: 'Daily Report Extension #' + currentUser.number,
              html: html
            };
            sgMail.send(msg);
          }
        }
      }

      const exitByKeyData = await queryExits(this.app, queueData.queueStats);


      //build up the manager reports and send to users receiving reports for queueID
      const queueIds = Object.keys(queueData.queueStats);
      const queueManagers = await this.app.service('queue-managers').find({paginate: false, query: {queueId: {$in: queueIds}}});
      const queueManagerGroups = groupBy(queueManagers, 'queueId');

      const managerParams = {
        incoming,
        outgoing,
        missed,
        pauses,
        queueData,
        extNameKey,
        exitByKeyData,
        interval: 'DAILY'
      };

      //build queue manager email templates (THE NEW WAY)
      // const queueManagerHTML = await managerTemplate(managerParams);
      //foreach queue build email templates and send
      for(let i = 0; i < queueIds.length; i++){
        let queueManagerEmails = [];
        const currentId = queueIds[i];
        const currentName = queueData.queueStats[currentId].queueName;
        if(queueManagerGroups.hasOwnProperty(queueIds[i])) {
          queueManagerEmails = queueManagerGroups[currentId].filter(item => item.receiveReports);
        }
        if(queueManagerEmails.length){
          const queueManagerHTML = await queueManagerDailyTemplate(managerParams, currentId);
          if(queueManagerHTML){
            console.log(`::: DAILY QUEUE MANAGER REPORT EMAILS - ${currentName} :::`);
            for(let i = 0; i < queueManagerEmails.length; i++){
              console.log('sending to: ' + queueManagerEmails[i].userEmail);
              const msg = {
                to: queueManagerEmails[i].userEmail,
                from: 'noreply@voxo.co',
                subject: `Daily Manager Report - ${currentName}`,
                html: queueManagerHTML
              };
              sgMail.send(msg);
            }
          }
        }
      }

      //build manager email template (THIS IS THE OLD WAY)
      if(legacyEmails.length){
        const managerHtml = await managerTemplate(managerParams);
        console.log('::: LEGACY REPORTS FOR BAD PEOPLE :::');
        if (managerHtml) {
          for (let i = 0; i < legacyEmails.length; i++) {
            console.log('sending the email to: ' + legacyEmails[i]);
            const msg = {
              to: legacyEmails[i],
              from: 'noreply@voxo.co',
              subject: 'Daily Manager Report',
              html: managerHtml
            };
            sgMail.send(msg);
          }
        }
      }

    }
  }

  async weeklyManagerReport(params) {
    const {type} = params.query;
    const reports = await getReports(type, this.app);

    //query all the tenants in one go.
    const tenantIds = Object.keys(reports);
    const tenants = await getTenants(tenantIds, this.app);

    //looping through all the tenants
    for (let i = 0; i < tenants.length; i++) {
      const currentTenant = tenants[i];
      let managerEmails = [];
      let legacyEmails = [];
      try {
        const reportParams = JSON.parse(reports[currentTenant.id.toString()][0].parameters);
        managerEmails = reportParams.managers;
        legacyEmails = reportParams.hasOwnProperty('legacy') ? reportParams.legacy : [];
      } catch (err) {
        managerEmails = [];
        legacyEmails = [];
      }

      const extParams = await getUserExtensions(
        {
          tenantId: currentTenant.id,
          tenantCode: currentTenant.tenantCode
        },
        this.app
      );

      const emailRes = await getEmails({tenantId: currentTenant.id, numbers: extParams}, this.app);
      const {extNumArray, agentNamesArray, extNameKey} = emailRes;

      //RIGHT HERE WE CAN PASS A DYNAMIC RANGE VARIABLE
      const callQuery = await queryInfo(
        {
          tenantId: currentTenant.id,
          extNumArray,
          tenantCode: currentTenant.tenantCode,
          queues: currentTenant.queues,
          agentNames: agentNamesArray,
          extNameKey
        },
        'WEEKLY',
        this.app
      );
      const {outgoing, incoming, pauses, queueData, missed} = callQuery;

      const lastWeekQuery = await queryLastWeek(
        {
          tenantId: currentTenant.id,
          agentNames: agentNamesArray,
          queueData
        },
        this.app
      );
      const {finalQueueData} = lastWeekQuery;

      const exitByKeyData = await queryExits(this.app, queueData.queueStats);

      //build up the manager reports and send to users receiving reports for queueID
      const queueIds = Object.keys(queueData.queueStats);
      const queueManagers = await this.app.service('queue-managers').find({paginate: false, query: {queueId: {$in: queueIds}}});

      const queueManagerGroups = groupBy(queueManagers, 'queueId');

      //build manager email template.
      const managerParams = {
        incoming,
        outgoing,
        missed,
        pauses,
        queueData: finalQueueData,
        extNameKey,
        exitByKeyData,
        interval: 'WEEKLY'
      };

      const sgApiKey = await this.getApiKey();
      sgMail.setApiKey(sgApiKey);
      for(let i = 0; i < queueIds.length; i++){
        let queueManagerEmails = [];
        const currentId = queueIds[i];
        const currentName = queueData.queueStats[currentId].queueName;
        if(queueManagerGroups.hasOwnProperty(queueIds[i])) {
          queueManagerEmails = queueManagerGroups[currentId].filter(item => item.receiveReports);
        }
        if(queueManagerEmails.length){
          const queueManagerHTML = await queueManagerWeeklyTemplate(managerParams, currentId);
          if(queueManagerHTML){
            console.log(`::: WEEKLY QUEUE MANAGER REPORT EMAILS - ${currentName} :::`);
            for(let i = 0; i < queueManagerEmails.length; i++){
              console.log('sending to: ' + queueManagerEmails[i].userEmail);
              const msg = {
                to: queueManagerEmails[i].userEmail,
                from: 'noreply@voxo.co',
                subject: `Weekly Manager Report - ${currentName}`,
                html: queueManagerHTML
              };
              sgMail.send(msg);
            }
          }
        }
      }

      //THIS IS THE OLD WAY. WILL REMOVE SOON!
      if(legacyEmails.length){
        const managerHtml = await managerWeeklyTemplate(managerParams);
        if (managerHtml) {
          for (let i = 0; i < legacyEmails.length; i++) {
            console.log('sending the email to: ' + legacyEmails[i]);
            const msg = {
              to: legacyEmails[i],
              from: 'noreply@voxo.co',
              subject: 'Weekly Manager Report',
              html: managerHtml
            };
            sgMail.send(msg);
          }
        }
      }

    }
  }

  async monthlyManagerReport(params) {
    const {type} = params.query;
    const reports = await getReports(type, this.app);

    //query all the tenants in one go.
    const tenantIds = Object.keys(reports);
    const tenants = await getTenants(tenantIds, this.app);

    //looping through all the tenants
    for (let i = 0; i < tenants.length; i++) {
      const currentTenant = tenants[i];
      let managerEmails = [];
      let legacyEmails = [];
      try {
        const reportParams = JSON.parse(reports[currentTenant.id.toString()][0].parameters);
        managerEmails = reportParams.managers;
        legacyEmails = reportParams.hasOwnProperty('legacy') ? reportParams.legacy : [];
      } catch (err) {
        managerEmails = [];
        legacyEmails = [];
      }

      const extParams = await getUserExtensions(
        {
          tenantId: currentTenant.id,
          tenantCode: currentTenant.tenantCode
        },
        this.app
      );

      const emailRes = await getEmails({tenantId: currentTenant.id, numbers: extParams}, this.app);
      const {extNumArray, agentNamesArray, extNameKey} = emailRes;

      //RIGHT HERE WE CAN PASS A DYNAMIC RANGE VARIABLE
      const callQuery = await queryInfo(
        {
          tenantId: currentTenant.id,
          extNumArray,
          tenantCode: currentTenant.tenantCode,
          queues: currentTenant.queues,
          agentNames: agentNamesArray,
          extNameKey
        },
        'MONTHLY',
        this.app
      );
      const {outgoing, incoming, pauses, queueData, missed} = callQuery;

      // console.log(missed);

      const lastMonthQuery = await queryLastMonth(
        {
          tenantId: currentTenant.id,
          agentNames: agentNamesArray,
          queueData
        },
        this.app
      );
      const {finalQueueData} = lastMonthQuery;

      const exitByKeyData = await queryExits(this.app, queueData.queueStats);

      //build up the manager reports and send to users receiving reports for queueID
      const queueIds = Object.keys(queueData.queueStats);
      const queueManagers = await this.app.service('queue-managers').find({paginate: false, query: {queueId: {$in: queueIds}}});

      const queueManagerGroups = groupBy(queueManagers, 'queueId');

      //build manager email template.
      const managerParams = {
        incoming,
        outgoing,
        pauses,
        queueData: finalQueueData,
        extNameKey,
        exitByKeyData,
        interval: 'MONTHLY'
      };

      const sgApiKey = await this.getApiKey();
      sgMail.setApiKey(sgApiKey);
      for(let i = 0; i < queueIds.length; i++){
        let queueManagerEmails = [];
        const currentId = queueIds[i];
        const currentName = queueData.queueStats[currentId].queueName;
        if(queueManagerGroups.hasOwnProperty(queueIds[i])) {
          queueManagerEmails = queueManagerGroups[currentId].filter(item => item.receiveReports);
        }
        if(queueManagerEmails.length){
          const queueManagerHTML = await queueManagerMonthlyTemplate(managerParams, currentId);
          if(queueManagerHTML){
            console.log(`::: MONTHLY QUEUE MANAGER REPORT EMAILS - ${currentName} :::`);
            for(let i = 0; i < queueManagerEmails.length; i++){
              console.log('sending to: ' + queueManagerEmails[i].userEmail);
              const msg = {
                to: queueManagerEmails[i].userEmail,
                from: 'noreply@voxo.co',
                subject: `Monthly Report - ${currentName}`,
                html: queueManagerHTML
              };
              sgMail.send(msg);
            }
          }
        }
      }

      //THIS IS THE OLD WAY MAN
      if(legacyEmails.length){
        const managerHtml = await managerMonthlyTemplate(managerParams);
        if (managerHtml) {
          for (let i = 0; i < legacyEmails.length; i++) {
            console.log('sending the email to: ' + legacyEmails[i]);
            const msg = {
              to: legacyEmails[i],
              from: 'noreply@voxo.co',
              subject: 'Monthly Manager Report',
              html: managerHtml
            };
            sgMail.send(msg);
          }
        }
      }
    }
  }

  async dailyHuntListReport (params) {
    const {type} = params.query;

    const reports = await getReports(type, this.app);
    //query all the tenants in one go.
    const tenantIds = Object.keys(reports);
    const tenants = await getTenants(tenantIds, this.app);

    const sgApiKey = await this.getApiKey();
    sgMail.setApiKey(sgApiKey);
    for(let i = 0; i < tenants.length; i++){

      const queryParams = {interval: 'DAILY', tenantId: tenants[i].id, tenantCode: tenants[i].tenantCode};
      const queryInfo = await queryTheHunt(queryParams, this.app);

      //for every huntlist group returned loop through and generate the report and blast it out.
      for(let huntlist in queryInfo){
        if(queryInfo.hasOwnProperty(huntlist)){

          const reportHTML = await huntListTemplateDaily(queryInfo[huntlist], this.app);
          if(reportHTML){
            try {
              const emails = emailGroups[tenants[i].id][huntlist];

              console.log('::: HUNTLIST DAILY REPORTS :::');
              for (let k = 0; k < emails.length; k++) {
                console.log('sending the email to: ' + emails[k]);
                const msg = {
                  to: emails[k],
                  from: 'noreply@voxo.co',
                  subject: `Daily Hunt List Report - ${queryInfo[huntlist].name}`,
                  html: reportHTML
                };
                sgMail.send(msg);
              }
            } catch (e){
              console.log('we have no email reference man');
            }
          }

        }
      }
    }

  }

  async getApiKey (){
    const settings = await this.app.service('tenant-settings')._find({paginate: false, query: {code: 'SENDGRIDAPIKEY'}});
    return settings[0].value;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
