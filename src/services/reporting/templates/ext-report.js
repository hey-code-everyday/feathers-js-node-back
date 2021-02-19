const moment = require('moment');
const convertTime = require('../modules/convert-time');

module.exports = (params) => {

  const noCalls = typeof params.outgoing === 'undefined' && typeof params.incoming === 'undefined';
  const noSession = typeof params.starts === 'undefined' && typeof params.endings === 'undefined';

  if (noCalls && noSession) {
    return null;
  }

  // Initialize Groups Stats Object By Hour
  let stats = {
    '12AM': {
      timeRange: '12AM - 01AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '01AM': {
      timeRange: '01AM - 02AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '02AM': {
      timeRange: '02AM - 03AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '03AM': {
      timeRange: '03AM - 04AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '04AM': {
      timeRange: '04AM - 05AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '05AM': {
      timeRange: '05AM - 06AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '06AM': {
      timeRange: '06AM - 07AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '07AM': {
      timeRange: '07AM - 08AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundAvg: 0,
      inboundDuration: 0,
    },
    '08AM': {
      timeRange: '08AM - 09AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '09AM': {
      timeRange: '09AM - 10AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '10AM': {
      timeRange: '10AM - 11AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '11AM': {
      timeRange: '11AM - 12PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '12PM': {
      timeRange: '12PM - 01PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '01PM': {
      timeRange: '01PM - 02PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '02PM': {
      timeRange: '02PM - 03PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '03PM': {
      timeRange: '03PM - 04PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '04PM': {
      timeRange: '04PM - 05PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '05PM': {
      timeRange: '05PM - 06PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '06PM': {
      timeRange: '06PM - 07PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '07PM': {
      timeRange: '07PM - 08PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '08PM': {
      timeRange: '08PM - 09PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '09PM': {
      timeRange: '09PM - 10PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '10PM': {
      timeRange: '10PM - 11PM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
    '11PM': {
      timeRange: '11PM - 12AM',
      totalCalls: 0,
      totalOutbound: 0,
      outboundAvg: 0,
      outboundDuration: 0,
      totalInbound: 0,
      inboundDuration: 0,
    },
  };

  let pauseInfo = {
    'Break': 0,
    'Lunch': 0,
    'Account Review': 0,
    'Meeting': 0,
    'Personal': 0,
    'Other': 0
  };

  //1. Loop through outgoing and get some totals
  let totalOutCalls = 0;
  let totalOutDuration = 0;
  if (typeof params.outgoing !== 'undefined') {
    for (let i = 0; i < params.outgoing.length; i++) {
      const currentGroupOut = params.outgoing[i];
      totalOutCalls += parseInt(currentGroupOut.totalCalls);
      totalOutDuration += parseInt(currentGroupOut.minutesOut) * 60;

      //as we loop through update the hourly stats object
      stats[currentGroupOut.hour].totalOutbound += parseInt(currentGroupOut.totalCalls);
      stats[currentGroupOut.hour].totalCalls += parseInt(currentGroupOut.totalCalls);
      stats[currentGroupOut.hour].outboundDuration += parseInt(currentGroupOut.minutesOut) * 60;
      stats[currentGroupOut.hour].outboundAvg += parseInt(currentGroupOut.avgDurationOut) * 60;
    }
  }

  //2. Loop through incoming and get some totals
  let totalInCalls = 0;
  let totalInDuration = 0;
  if (typeof params.incoming !== 'undefined') {
    for (let i = 0; i < params.incoming.length; i++) {
      const currentGroupIn = params.incoming[i];
      const callDuration = parseInt(currentGroupIn.data2);
      totalInCalls++;
      totalInDuration += callDuration;

      //as we loop through update the hourly stats object
      //if a queue call we need to make sure we get the correct hour since we are using complete events
      if (currentGroupIn.hasOwnProperty('queuename')) {
        const waitTime = parseInt(currentGroupIn.data1);
        const callerTime = waitTime + callDuration;
        const completeTime = currentGroupIn.time;
        const inboundHour = moment.utc(completeTime).subtract(callerTime, 'seconds').format('hhA');
        stats[inboundHour].totalInbound++;
        stats[inboundHour].totalCalls++;
        stats[inboundHour].inboundDuration += callDuration;
      } else {
        stats[currentGroupIn.hour].totalInbound++;
        stats[currentGroupIn.hour].totalCalls++;
        stats[currentGroupIn.hour].inboundDuration += callDuration;
      }
    }
  }
  const summaryDuration = totalOutDuration + totalInDuration;

  //3. Finally have to figure out a way to group outgoing and incoming by time slot.
  let statsHTML = '';
  for (let statHour in stats) {
    if (stats.hasOwnProperty(statHour)) {
      const currentStatGroup = stats[statHour];
      if (currentStatGroup.totalCalls > 0) {
        statsHTML +=
          `
          <tr>
            <td class="text-blue" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; color: #467fcf; padding: 4px 12px 4px 0;">${currentStatGroup.timeRange}</td>
            <td class="text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;" align="center">${currentStatGroup.totalInbound}</td>
            <td class="text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;" align="center">${currentStatGroup.totalOutbound}</td>
            <td class="text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;" align="center"><strong style="font-weight: 600;">${currentStatGroup.totalOutbound + currentStatGroup.totalInbound}</strong></td>
            <td class="text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;" align="center">${convertTime(Math.round((currentStatGroup.outboundDuration + currentStatGroup.inboundDuration) / (currentStatGroup.totalOutbound + currentStatGroup.totalInbound)))}</td>
            <td class="text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 0 4px 12px;" align="center">${convertTime(currentStatGroup.outboundDuration + currentStatGroup.inboundDuration)}</td>
          </tr>
          `;
      }
    }
  }

  //4. Loop through our Pause Data to Figure Up Our Total Pause Times By Reason Slot.
  let totalPauseTime = 0;
  let sessionStartTime = 'N/A';
  let sessionEndTime = 'N/A';
  let workDayTime = 'N/A';
  if (typeof params.pauses !== 'undefined') {
    for (let i = 0; i < params.pauses.length; i++) {
      const currentPauseGroup = params.pauses[i];
      const groupReason = currentPauseGroup['reason'];
      if (pauseInfo.hasOwnProperty(groupReason)) {
        pauseInfo[groupReason] += currentPauseGroup['length'];
      } else {
        pauseInfo['Other'] += currentPauseGroup['length'];
      }
      totalPauseTime += currentPauseGroup['length'];
    }
  }

  if (typeof params.starts !== 'undefined') {
    sessionStartTime = moment.utc(params.starts[0].time).format('h:mm A');
  }

  if (typeof params.endings !== 'undefined') {
    const endsLength = params.endings.length;
    sessionEndTime = moment.utc(params.endings[endsLength - 1].time).format('h:mm A');
    if (typeof params.starts !== 'undefined') {
      const sessionLength = moment.utc(params.endings[endsLength - 1].time, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment.utc(params.starts[0].time, 'YYYY-MM-DDTHH:mm:ssZ'), 'seconds');
      workDayTime = moment.utc(moment.duration(sessionLength, 'seconds').asMilliseconds()).format('H:mm');
    }
  }

  //show pause block even if agent had no pause
  let pauseHTML = '';
  pauseHTML +=
    `
      <!-- Start Pause stuff -->
      <tr>
        <td class="content pb-sm" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 8px;">
          <table class="row" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; table-layout: fixed;">
            <tr>
              <td class="col text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                <table class="row" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; table-layout: fixed; height: 100%;">
                  <tr>
                    <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                      <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/green/home.png" class=" va-middle" width="24" height="24" alt="map-pin" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                      <div class="mt-xs" style="margin-top: 4px;">${sessionStartTime}</div>
                      <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Logged In</div>
                    </td>
                    <td class="col-mobile-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;"></td>
                    <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                      <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/red/home.png" class=" va-middle" width="24" height="24" alt="clock" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                      <div class="mt-xs" style="margin-top: 4px;">${sessionEndTime}</div>
                      <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Logged Out</div>
                    </td>
                  </tr>
                </table>
              </td>
              <td class="col-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;" valign="top"></td>
              <td class="col text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                <table class="row" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; table-layout: fixed; height: 100%;">
                  <tr>
                    <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                      <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/blue/headphones.png" class=" va-middle" width="24" height="24" alt="trending-up" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                      <div class="mt-xs" style="margin-top: 4px;">${workDayTime}</div>
                      <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Work Day</div>
                    </td>
                    <td class="col-mobile-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;"></td>
                    <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                      <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/blue/pause.png" class=" va-middle" width="24" height="24" alt="thumbs-up" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                      <div class="mt-xs" style="margin-top: 4px;">${moment.utc(moment.duration(totalPauseTime, 'seconds').asMilliseconds()).format('H \\hr mm \\min')}</div>
                      <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Work Day - Pause</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
            <h4 class="mt-xl" style="font-weight: 600; font-size: 16px; margin: 48px 0 .5em;">Pause Detail</h4>
            <table class="table list mt-lg" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; margin-top: 24px;">
                <tr>
                    <th colspan="2" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;">Reason</th>
                    <th class="text-right" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="right">Duration</th>
                </tr>
                <tr class="list-item">
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0px 8px 0;">
                        <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/break.png" width="20" height="25" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" />
                    </td>
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 8px 0px;">Break</td>
                    <td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0 8px 12px;" align="right">${convertTime(pauseInfo['Break'])}</td>
                </tr>
                <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0px 8px 0;">
                        <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/lunch.png" width="20" height="25" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" />
                    </td>
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 8px 0px;">Lunch</td>
                    <td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0 8px 12px;" align="right">${convertTime(pauseInfo['Lunch'])}</td>
                </tr>
                <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0px 8px 0;">
                        <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/accountreview.png" width="20" height="25" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" />
                    </td>
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 8px 0px;">Account Review</td>
                    <td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0 8px 12px;" align="right">${convertTime(pauseInfo['Account Review'])}</td>
                </tr>
                <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0px 8px 0;">
                        <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/meeting.png" width="20" height="25" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" />
                    </td>
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 8px 0px;">Meeting</td>
                    <td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0 8px 12px;" align="right">${convertTime(pauseInfo['Meeting'])}</td>
                </tr>
                <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0px 8px 0;">
                        <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/personal.png" width="20" height="25" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" />
                    </td>
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 8px 0px;">Personal</td>
                    <td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0 8px 12px;" align="right">${convertTime(pauseInfo['Personal'])}</td>
                </tr>
                <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0px 8px 0;">
                        <img src="https://miscdts.s3.amazonaws.com/voxo-assets/email/images/icons/other.png" width="20" height="25" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" />
                    </td>
                    <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 8px 0px;">Other</td>
                    <td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 0 8px 12px;" align="right">${convertTime(pauseInfo['Other'])}</td>
                </tr>
                <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                    <td colspan="2" class="text-right font-strong h4 m-0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 16px; margin: 0; padding: 8px 12px 0 0;" align="right">Total</td>
                    <td class="font-strong h4 m-0 text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 16px; margin: 0; padding: 8px 0 0 12px;" align="right">${convertTime(totalPauseTime)}</td>
                </tr>
            </table>
        </td>
      </tr>
      <!-- End Pause stuff -->
      `;


  //5. Calculate our session metrics based on the end data coming in.

  //html that we will build to return for email.
  const html =
    `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">

    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta content="telephone=no" name="format-detection" />
    <title></title>
    <style type="text/css" data-premailer="ignore">
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700);
    </style>
    <style data-premailer="ignore">
        @media screen and (max-width: 600px) {
            u+.body {
                width: 100vw !important;
            }
        }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
    </style>
    <!--[if mso]>
      <style type="text/css">
        body, table, td {
        \tfont-family: Arial, Helvetica, sans-serif !important;
        }
        img {
        \t-ms-interpolation-mode: bicubic;
        }
        .box {
        \tborder-color: #eee !important;
        }
      </style>
    <![endif]-->

<style>body {
margin: 0; padding: 0; background-color: #f5f7fb; font-size: 15px; line-height: 160%; mso-line-height-rule: exactly; color: #444444; width: 100%;
}
body {
font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;
}
img {
border: 0 none; line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0;
}
a:hover {
text-decoration: underline;
}
.btn:hover {
text-decoration: none;
}
.btn.bg-bordered:hover {
background-color: #f9fbfe !important;
}
a.bg-blue:hover {
background-color: #3a77cc !important;
}
a.bg-azure:hover {
background-color: #37a3f1 !important;
}
a.bg-indigo:hover {
background-color: #596ac9 !important;
}
a.bg-purple:hover {
background-color: #9d50e8 !important;
}
a.bg-pink:hover {
background-color: #f55f91 !important;
}
a.bg-red:hover {
background-color: #c01e1d !important;
}
a.bg-orange:hover {
background-color: #fd8e35 !important;
}
a.bg-yellow:hover {
background-color: #e3b90d !important;
}
a.bg-lime:hover {
background-color: #73cb2d !important;
}
a.bg-green:hover {
background-color: #56ab00 !important;
}
a.bg-teal:hover {
background-color: #28beae !important;
}
a.bg-cyan:hover {
background-color: #1596aa !important;
}
a.bg-gray:hover {
background-color: #95a9b0 !important;
}
a.bg-secondary:hover {
background-color: #ecf0f2 !important;
}
.img-hover:hover img {
opacity: .64;
}
@media only screen and (max-width: 560px) {
  body {
    font-size: 14px !important;
  }
  .content {
    padding: 24px !important;
  }
  .content-image-text {
    padding: 24px !important;
  }
  .content-image {
    height: 100px !important;
  }
  .content-image-text {
    padding-top: 96px !important;
  }
  h1 {
    font-size: 24px !important;
  }
  .h1 {
    font-size: 24px !important;
  }
  h2 {
    font-size: 20px !important;
  }
  .h2 {
    font-size: 20px !important;
  }
  h3 {
    font-size: 18px !important;
  }
  .h3 {
    font-size: 18px !important;
  }
  .col {
    display: table !important; width: 100% !important;
  }
  .col-spacer {
    display: table !important; width: 100% !important;
  }
  .col-spacer-xs {
    display: table !important; width: 100% !important;
  }
  .col-spacer-sm {
    display: table !important; width: 100% !important;
  }
  .col-hr {
    display: table !important; width: 100% !important;
  }
  .row {
    display: table !important; width: 100% !important;
  }
  .col-hr {
    border: 0 !important; height: 24px !important; width: auto !important; background: transparent !important;
  }
  .col-spacer {
    width: 100% !important; height: 24px !important;
  }
  .col-spacer-sm {
    height: 16px !important;
  }
  .col-spacer-xs {
    height: 8px !important;
  }
  .chart-cell-spacer {
    width: 4px !important;
  }
  .text-mobile-center {
    text-align: center !important;
  }
  .d-mobile-none {
    display: none !important;
  }
}
</style></head>

    <body class="bg-body" style="font-size: 15px; margin: 0; padding: 0; line-height: 160%; mso-line-height-rule: exactly; color: #444444; width: 100%; font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" bgcolor="#f5f7fb">
      <center>
        <table class="main bg-body" width="100%" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" bgcolor="#f5f7fb">
          <tr>
            <td align="center" valign="top" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
              <!--[if (gte mso 9)|(IE)]>
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" valign="top" width="640">
              <![endif]-->
              <span class="preheader" style="font-size: 0; padding: 0; display: none; max-height: 0; mso-hide: all; line-height: 0; color: transparent; height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;">Your VOXO Agent call report for ${params.extName}</span>
              <table class="wrap" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; max-width: 640px; text-align: left;">
                <tr>
                  <td class="p-sm" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px;">
                    <table cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                      <tr>
                        <td class="py-lg" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-top: 24px; padding-bottom: 24px;">
                          <table cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                            <tr>
                              <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                <a href="#" style="color: #467fcf; text-decoration: none;"><img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/voxo-logo.png" width="116" height="21" alt="" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; border: 0 none;" /></a>
                              </td>
                              <!--<td class="text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="right">
                                <a href="#" class="text-muted-light font-sm" style="color: #bbc8cd; text-decoration: none; font-size: 13px;">
                                    View online
                                </a>
                              </td>-->
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <div class="main-content">
                      <table class="box" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; border-radius: 3px; -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); border: 1px solid #f0f0f0;" bgcolor="#ffffff">
                        <tr>
                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                            <table cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                              <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                  <table class="icon icon-lg bg-blue-lightest " cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0; border-collapse: separate; width: 72px; border-radius: 50%; line-height: 100%; font-weight: 300; height: 72px; font-size: 48px; text-align: center;" bgcolor="#edf2fa">
                                      <tr>
                                          <td valign="middle" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                              <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/blue/pie-chart.png" class=" va-middle" width="40" height="40" alt="check" style="line-height: 100%; border: 0 none; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; display: block; width: 40px; height: 40px;" />
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                              <tr>
                                <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                  <h1 class="text-center m-0" style="font-weight: 300; font-size: 28px; line-height: 130%; margin: 0;" align="center">${params.interval} Summary</h1>
                                  <p class="text-center mt-sm mb-0 text-muted" style="color: #9eb0b7; margin: 8px 0 0;" align="center">${moment().subtract(1, 'days').format('dddd, MMMM Do YYYY')} CST</p>
                                </td>
                              </tr>
                              <tr>
                                <td class="content pt-0 border-bottom" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-bottom-width: 1px; border-bottom-color: #f0f0f0; border-bottom-style: solid; padding: 0 48px 40px;">
                                  <table class="row mt-xl" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; table-layout: fixed; margin-top: 48px;">
                                    <tr>
                                      <td class="col text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                        <table class="row" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; table-layout: fixed; height: 100%;">
                                          <tr>
                                            <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                              <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/blue/arrow-up-right.png" class=" va-middle" width="24" height="24" alt="map-pin" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                              <div class="mt-xs" style="margin-top: 4px;">${totalOutCalls} calls</div>
                                              <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Total Outgoing</div>
                                            </td>
                                            <td class="col-mobile-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;"></td>
                                            <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                              <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/green/arrow-down-left.png" class=" va-middle" width="24" height="24" alt="clock" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                              <div class="mt-xs" style="margin-top: 4px;">${totalInCalls} calls</div>
                                              <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Total Incoming</div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td class="col-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;" valign="top"></td>
                                      <td class="col text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                        <table class="row" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; table-layout: fixed; height: 100%;">
                                          <tr>
                                            <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                              <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/gray/clock.png" class=" va-middle" width="24" height="24" alt="trending-up" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                              <div class="mt-xs" style="margin-top: 4px;">${convertTime(Math.round(summaryDuration / (totalOutCalls + totalInCalls)))}</div>
                                              <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Avg Duration</div>
                                            </td>
                                            <td class="col-mobile-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;"></td>
                                            <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                              <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/yellow/clock.png" class=" va-middle" width="24" height="24" alt="thumbs-up" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                              <div class="mt-xs" style="margin-top: 4px;">${convertTime(summaryDuration)}</div>
                                              <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Total Duration</div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              ${pauseHTML}
                              <tr>
                                <td class="content border-top" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid; padding: 40px 48px;">
                                  <h4 style="font-weight: 600; font-size: 16px; margin: 0 0 .5em;">${params.extName} (${params.number}) Details</h4>
                                  <p style="margin: 0 0 1em;">${moment().subtract(1, 'days').format('dddd, MMMM Do YYYY')} CST</p>
                                </td>
                              </tr>
                              <tr>
                                  <td class="content pt-0 pb-0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0 48px;">
                                    <table class="table" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                      <tr>
                                        <th class="text-left" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="left">Date/Time</th>
                                        <th class="text-center" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="center">Inbound</th>
                                        <th class="text-center" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="center">Outbound</th>
                                        <th class="text-center" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="center">Total</th>
                                        <th class="text-center" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="center">Avg Dur</th>
                                        <th class="text-right" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="right">Total Dur</th>
                                      </tr>
                                      <!--stats rows-->
                                      ${statsHTML}
                                    </table>
                                  </td>
                              </tr>
                              <tr>
                                <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                  <p style="margin: 0 0 1em;">If you are looking for more detailed reporting on a per user or per call queue basis, please click below to login to the portal.</p>
                                </td>
                              </tr>
                              <tr>
                                <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px;">
                                  <table cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                    <tr>
                                      <td align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                        <table cellpadding="0" cellspacing="0" border="0" class="bg-blue rounded w-auto" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: separate; width: auto; color: #ffffff; border-radius: 3px;" bgcolor="#467fcf">
                                          <tr>
                                            <td align="center" valign="top" class="lh-1" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 100%;">
                                              <a href="https://portal.voxo.co" class="btn bg-blue border-blue" style="color: #ffffff; padding: 12px 32px; border: 1px solid #467fcf; text-decoration: none; white-space: nowrap; font-weight: 600; font-size: 16px; border-radius: 3px; line-height: 100%; display: block; -webkit-transition: .3s background-color; transition: .3s background-color; background-color: #467fcf;">
                                                  <span class="btn-span" style="color: #ffffff; font-size: 16px; text-decoration: none; white-space: nowrap; font-weight: 600; line-height: 100%;">Login Now</span>
                                              </a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <table cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                      <tr>
                        <td class="py-xl" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-top: 48px; padding-bottom: 48px;">
                          <table class="font-sm text-center text-muted" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; color: #9eb0b7; text-align: center; font-size: 13px;">
                            <tr>
                              <td align="center" class="pb-md" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-bottom: 16px;">
                                <table class="w-auto" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: auto;">
                                  <tr>
                                    <td class="px-sm" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-right: 8px; padding-left: 8px;">
                                      <a href="https://www.facebook.com/voxoco" style="color: #467fcf; text-decoration: none;">
                                          <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/facebook-square.png" class=" va-middle" width="24" height="24" alt="social-facebook-square" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                      </a>
                                    </td>
                                    <td class="px-sm" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-right: 8px; padding-left: 8px;">
                                      <a href="https://twitter.com/voxollc" style="color: #467fcf; text-decoration: none;">
                                          <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/twitter.png" class=" va-middle" width="24" height="24" alt="social-twitter" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                      </a>
                                    </td>
                                    <td class="px-sm" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-right: 8px; padding-left: 8px;">
                                      <a href="https://github.com/voxoco" style="color: #467fcf; text-decoration: none;">
                                          <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/github.png" class=" va-middle" width="24" height="24" alt="social-github" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                      </a>
                                    </td>
                                    <td class="px-sm" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-right: 8px; padding-left: 8px;">
                                      <a href="https://www.youtube.com/channel/UCd4HH8LtYnHVYcT56XLVWwQ" style="color: #467fcf; text-decoration: none;">
                                          <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/youtube.png" class=" va-middle" width="24" height="24" alt="social-youtube" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-lg" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-right: 24px; padding-left: 24px;">
                                  If you have any questions, feel free to message us at <a href="mailto:support@voxo.co" class="text-muted" style="color: #9eb0b7; text-decoration: none;">support@voxo.co</a>.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
                    </td>
                  </tr>
                </table>
              <![endif]-->
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>`;


  return html;

};
