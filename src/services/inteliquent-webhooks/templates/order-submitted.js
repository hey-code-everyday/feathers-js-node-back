const staticTemplates = require('../partials/email-partials');
const orderDetailsTemplate = require('../partials/order-details');
const numberDetailsTemplate = require('../partials/number-details');
const orderLink = require('../partials/order-link');
const {iq_authenticate, iq_getOrderDetail} = require('../../../inteliquent/api');
const getIqParams = require('../../../inteliquent/inteliquent-params');

module.exports = async (data, params, app) => {

  //query the order here
  const iqParams = await getIqParams(app);
  const accessToken = await iq_authenticate(iqParams);
  const orderDetails = await iq_getOrderDetail(data.orderId, accessToken, iqParams);

  //build html email template
  const html =
        `
         ${staticTemplates.DOCTYPE}
         <html xmlns="http://www.w3.org/1999/xhtml">
            ${staticTemplates.HEAD.META}
            ${staticTemplates.HEAD.STYLES}
            <body class="bg-body" style="font-size: 15px; margin: 0; padding: 0; line-height: 160%; mso-line-height-rule: exactly; color: #444444; width: 100%; font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;" bgcolor="#f5f7fb">
                <center>
                    <table class="main bg-body" width="100%" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" bgcolor="#f5f7fb">
                      <tr>
                        <td align="center" valign="top" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                            ${staticTemplates.LOGO_HEADER}
                            <div class="main-content">
                              <table class="box" cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%; border-radius: 3px; -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); border: 1px solid #f0f0f0;" bgcolor="#ffffff">
                                <tr>
                                  <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                    <table cellpadding="0" cellspacing="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                       <!-- Order Submitted notification -->
                                        <tr>
                                            <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                                <table class="icon icon-lg bg-yellow-lightest " cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0; border-collapse: separate; width: 72px; border-radius: 50%; line-height: 100%; font-weight: 300; height: 72px; font-size: 48px; text-align: center;" bgcolor="#fef9e7">
                                                    <tr>
                                                        <td valign="middle" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                                            <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/icons/yellow/info.png" class=" va-middle" width="40" height="40" alt="check" style="line-height: 100%; border: 0 none; outline: none; text-decoration: none; vertical-align: middle; font-size: 0; display: block; width: 40px; height: 40px;" />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                                <h1 class="text-center m-0" style="font-weight: 300; font-size: 28px; line-height: 130%; margin: 0;" align="center">Port order processing</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px;">
                                                <p style="margin: 0 0 1em;">Order <strong style="font-weight: 600;">${data.orderId}</strong> has been submitted successfully. You will receive notifications via email as your order progresses. You can also access the order anytime by going to https://app.voxo.co/number-porting. If you have questions <a href="mailto:support@voxo.co" style="color: #467fcf; text-decoration: none;">shoot us an email</a>.</p>
                                            </td>
                                        </tr>
                                        <!-- Order Details -->
                                         ${orderDetailsTemplate(orderDetails, params)}
                                        <!-- Number Details -->
                                        ${numberDetailsTemplate(orderDetails)}
                                        <!-- Table Legend -->
                                        ${staticTemplates.LEGEND}
                                        <!-- Dynamic Order Link -->
                                        ${orderLink(orderDetails, params)}
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            ${staticTemplates.FOOTER}
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
