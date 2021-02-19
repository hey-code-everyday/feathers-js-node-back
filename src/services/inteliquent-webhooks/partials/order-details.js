module.exports = (orderDetails, params) => {

  return `<tr>
                <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px;">
                    <h4 class="content pb-0" align="center" style="font-weight: 600; font-size: 16px; margin: 0 0 .5em; padding: 40px 48px 0;">Order Details</h4>
                    <table class="table" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Number</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">${orderDetails.orderId}</td>
                        </tr>
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Account</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">${params.tenantName}</td>
                        </tr>
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Status</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">${orderDetails.orderStatus}</td>
                        </tr>
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Email</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">${params.userEmail}</td>
                        </tr>
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Created Date</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">${orderDetails.createdDate.split('T')[0]}</td>
                        </tr>
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Desired Due Date</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">${orderDetails.desiredDueDate.split('T')[0]}</td>
                        </tr>
                        <tr>
                            <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 4px 12px 4px 0;">Completed Date</td>
                            <td class="font-strong text-right" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 600; padding: 4px 0 4px 12px;" align="right">N/A</td>
                        </tr>
                    </table>
                </td>
            </tr>`;

};
