const moment = require('moment');
const convertTime = require('../modules/convert-time');

/*eslint-disable*/
module.exports = async (params, app) => {

  const {
    name,
    totalIncoming,
    incomingDuration,
    outboundTotal,
    outboundDuration,
    agents
  } = params;

  const totalTalkTime = incomingDuration + outboundDuration;
  const totalCalls = totalIncoming + outboundTotal;


  //if the huntlist had no traffic we will not send a report for now.
  if(!(totalCalls > 0)){
    return null;
  }

  //build the agent rows with agents data for the huntlist
  let agentHTML = '';
  let allIncoming = 0;
  let allOutbound = 0;
  let allCalls = 0;
  let allDuration = 0;
  for(let agent in agents){
    if(agents.hasOwnProperty(agent)){

      const {name, totalIncoming, incomingDuration, totalOutbound, outboundDuration} = agents[agent];
      const totalDuration = incomingDuration + outboundDuration;
      const totalAgentCalls = totalIncoming + totalOutbound;

      allIncoming += totalIncoming;
      allOutbound += totalOutbound;
      allCalls += totalAgentCalls;
      allDuration += totalDuration;

      agentHTML +=
        `
          <tr class="text-center" style="" align="center">
            <td class="text-blue text-left" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; color: #467fcf; padding: 4px 12px 4px 0;" align="left">${name}</td>
            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;">${totalIncoming}</td>
            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;">${totalOutbound}</td>
            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;">${totalAgentCalls}</td>
            <td class="font-strong" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;">${convertTime(totalDuration)}</td>
          </tr>
        `;

    }
  }


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
              <span class="preheader" style="font-size: 0; padding: 0; display: none; max-height: 0; mso-hide: all; line-height: 0; color: transparent; height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;">Your VOXO manager call report</span>
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
                                  <table class="icon icon-lg bg-green-lightest " cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0; border-collapse: separate; width: 72px; border-radius: 50%; line-height: 100%; font-weight: 300; height: 72px; font-size: 48px; text-align: center;" bgcolor="#eff8e6">
                                    <tr>
                                      <td valign="middle" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                        <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/green/pie-chart.png" class=" va-middle" width="40" height="40" alt="check" style="line-height: 100%; border: 0 none; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; display: block; width: 40px; height: 40px;" />
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                  <tr>
                                    <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                      <h1 class="text-center m-0" style="font-weight: 300; font-size: 28px; line-height: 130%; margin: 0;" align="center">Daily Manager Summary</h1>
                                      <h4 style="font-weight: 600; font-size: 16px; margin: 0 0 .5em;">Hunt List - ${name}</h4>
                                      <p class="text-center mt-sm mb-0 text-muted" style="color: #9eb0b7; margin: 8px 0 0;" align="center">${moment().subtract(1, 'days').format("dddd, MMMM Do YYYY")} CST</p>
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
                                                  <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/blue/phone-outgoing.png" class=" va-middle" width="24" height="24" alt="map-pin" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                                  <div class="mt-xs" style="margin-top: 4px;">${outboundTotal}</div>
                                                  <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Outgoing</div>
                                                </td>
                                                <td class="col-mobile-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;"></td>
                                                <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                                  <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/green/phone-incoming.png" class=" va-middle" width="24" height="24" alt="clock" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                                  <div class="mt-xs" style="margin-top: 4px;">${totalIncoming}</div>
                                                  <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Incoming</div>
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
                                                  <div class="mt-xs" style="margin-top: 4px;">${convertTime((totalTalkTime / totalCalls))}</div>
                                                  <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Avg Duration</div>
                                                </td>
                                                <td class="col-mobile-spacer" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 24px;"></td>
                                                <td class="col-mobile text-center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" align="center" valign="top">
                                                  <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/yellow/clock.png" class=" va-middle" width="24" height="24" alt="thumbs-up" style="line-height: 100%; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; border: 0 none;" />
                                                  <div class="mt-xs" style="margin-top: 4px;">${convertTime(totalTalkTime)}</div>
                                                  <div class="font-sm text-muted" style="color: #9eb0b7; font-size: 13px;">Total Talk Time</div>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="content pb-md" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 16px;">
                                      <h4 style="font-weight: 600; font-size: 16px; margin: 0 0 .5em;">Agent Details</h4>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="content pt-0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0 48px 40px;">
                                      <table class="table" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                        <tr class="text-center" style="" align="center">
                                          <th class="text-left" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="left">Agent</th>
                                          <th style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;">Incoming</th>
                                          <th style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;">Outbound</th>
                                          <th style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;">Total Calls</th>
                                          <th class="text-right" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="right">Total Dur</th>
                                        </tr>
                                        ${agentHTML}
                                        <tr class="font-strong text-center text-red border-top" style="color: #cd201f; font-weight: 600; border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;" align="center">
                                          <td class="text-left h4 text-default" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 16px; color: #444444; margin: 0 0 .5em; padding: 4px 12px 4px 0;" align="left">Total</td>
                                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;">${allIncoming}</td>
                                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;">${allOutbound}</td>
                                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px;">${allCalls}</td>
                                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 0 4px 12px;">${convertTime(allDuration)}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                      <p style="margin: 0 0 1em;">If you are looking for more detailed reporting, please click below to login to the portal.</p>
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
    </html>
  `;

  return html;
};
