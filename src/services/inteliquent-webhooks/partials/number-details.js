const staticTemplates = require('./email-partials');

module.exports = (orderDetails) => {


  const {tnItem} = orderDetails.tnList;
  let numberHTML = '';
  for (let i = 0; i < tnItem.length; i++) {
    let icon;
    if (tnItem[i].tnStatus === 'Received FOC') {
      icon = staticTemplates.STATUS_ICONS.Confirmed;
    } else if (tnItem[i].tnStatus === 'Complete') {
      icon = staticTemplates.STATUS_ICONS.Complete;
    } else if (tnItem[i].tnStatus === 'Pending') {
      icon = staticTemplates.STATUS_ICONS.Pending;
    } else {
      icon = staticTemplates.STATUS_ICONS.Rejected;
    }

    let date;
    if(tnItem[i].hasOwnProperty('portDt')){
      date = tnItem[i].portDt.split('T')[0];
    }else{
      date = 'Pending';
    }

    numberHTML += `
            <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
              <td class="pr-md w-1p" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; width: 1%; padding: 8px 12px 0 0;">
                ${icon}
              </td>
              <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 8px 12px 0;">
                <span class="text-default" style="color: #444444;">${tnItem[i].tn.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</span>
              </td>
              <td class="font-sm text-muted w-auto text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; color: #9eb0b7; width: auto; font-size: 13px; padding: 8px 0 0 12px;" align="right">${date}</td>
            </tr>
        `;
  }

  return `<tr>
                <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px;">
                    <h4 class="content pb-0" align="center" style="font-weight: 600; font-size: 16px; margin: 0 0 .5em; padding: 40px 48px 0;">Number Details</h4>
                    <table class="table" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                            <tr>
                              <th colspan="1" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;"></th>
                              <th style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;">Number</th>
                              <th class="text-right" style="text-transform: uppercase; font-weight: 600; color: #9eb0b7; font-size: 12px; padding: 0 0 4px;" align="right">Date</th>
                            </tr>
                      ${numberHTML}
                    </table>
                </td>
            </tr>`;

};
