const {BadRequest} = require('@feathersjs/errors');
const moment = require('moment');

exports.checkReportParams = function () {
  return async context => {

    const {tenantId, start, end } = context.params.query;

    if(!tenantId){
      throw new BadRequest('Invalid Params. Must Include tenantId!');
    }

    if(!start){
      throw new BadRequest('Invalid Params. Must Include start');
    }

    if(!end){
      throw new BadRequest('Invalid Params. Must Include end');
    }


    if(start.length < 10 || end.length < 10) {
      throw new BadRequest('Bad Date Format');
    }
    const diffMax = 10;

    //check and may sure difference in days is less than 10
    const startTime = moment(start);
    const endTime = moment(end);
    const timeDiff = endTime.diff(startTime, 'days');
    if(timeDiff > diffMax){
      throw new BadRequest(`Date Range Max is ${diffMax} Days!`);
    }

    //set query for date range specified and execute
    const queryStart = startTime.format('YYYY-MM-DD HH:mm:ss');
    const queryEnd = endTime.format('YYYY-MM-DD HH:mm:ss');
    context.params.query = {
      tenantId,
      start: {$gte: queryStart, $lte: queryEnd},
      $sort: {
        start: 1
      }
    };

    return context;
  };
};

exports.plotData = function () {
  return async context => {

    const { type } = context.params.query;

    if(type === 'plotData'){
      const { result } = context;

      let dateArray = [];
      let groupedOutgoing = {};
      let groupedIncoming = {};
      let groupedInternal = {};
      let groupedTotal = {};
      let outgoingData = [];
      let incomingData = [];
      let internalData = [];
      let totalData = [];

      result.forEach((d) => {
        let reportDate = new Date(d.start);
        let formattedDate = reportDate.getMonth() + 1 + '-' + reportDate.getDate();
        dateArray.push(formattedDate);

        if (d.direction === 'OUT') {
          if (!groupedIncoming.hasOwnProperty(formattedDate)) {
            groupedIncoming[formattedDate] = 0;
          }
          if (!groupedOutgoing.hasOwnProperty(formattedDate)) {
            groupedOutgoing[formattedDate] = 0;
          }
          if (!groupedInternal.hasOwnProperty(formattedDate)) {
            groupedInternal[formattedDate] = 0;
          }
          groupedOutgoing[formattedDate]++;
        }

        if (d.direction === 'IN') {
          if (!groupedOutgoing.hasOwnProperty(formattedDate)) {
            groupedOutgoing[formattedDate] = 0;
          }
          if (!groupedIncoming.hasOwnProperty(formattedDate)) {
            groupedIncoming[formattedDate] = 0;
          }
          if (!groupedInternal.hasOwnProperty(formattedDate)) {
            groupedInternal[formattedDate] = 0;
          }
          groupedIncoming[formattedDate]++;
        }
        if (d.direction === 'INTERNAL') {
          if (!groupedOutgoing.hasOwnProperty(formattedDate)) {
            groupedOutgoing[formattedDate] = 0;
          }
          if (!groupedIncoming.hasOwnProperty(formattedDate)) {
            groupedIncoming[formattedDate] = 0;
          }
          if (!groupedInternal.hasOwnProperty(formattedDate)) {
            groupedInternal[formattedDate] = 0;
          }
          groupedInternal[formattedDate]++;
        }

        if (!groupedTotal.hasOwnProperty(formattedDate)) {
          groupedTotal[formattedDate] = 0;
        }
        groupedTotal[formattedDate]++;
      });

      //this is our unique date range for our x-axis
      let uniqueDateArray = dateArray.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      //create the data arrays pairing with the dates
      for (let key in groupedOutgoing) {
        outgoingData.push(groupedOutgoing[key]);
      }
      for (let key in groupedIncoming) {
        incomingData.push(groupedIncoming[key]);
      }
      for (let key in groupedTotal) {
        totalData.push(groupedTotal[key]);
      }
      for (let key in groupedInternal) {
        internalData.push(groupedInternal[key]);
      }

      context.result = {
        uniqueDateArray,
        totalData,
        outgoingData,
        incomingData,
        internalData
      };

    }

    return context;
  };

};
