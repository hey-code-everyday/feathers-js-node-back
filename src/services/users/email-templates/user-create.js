module.exports = (result, rawPass) => {

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

        <style>
          body {
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
        </style>
      </head>

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
                  <span class="preheader" style="font-size: 0; padding: 0; display: none; max-height: 0; mso-hide: all; line-height: 0; color: transparent; height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;">Your VOXO Admin portal invite information</span>
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
                                      <!-- Confirmation notification -->
                                    <tr>
                                     <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;"></td>
                                    </tr>
                                    <tr>
                                      <td valign="middle" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                        <img src="https://s3.amazonaws.com/miscdts/voxo-assets/email/images/illustrations/undraw_report_mx0a.png" alt="" height="160" class="img-illustration" style="line-height: 100%; border: 0 none; outline: none; text-decoration: none; vertical-align: baseline; font-size: 0; max-width: 240px; max-height: 160px; width: auto; height: auto;" />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="content pb-0" align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                        <h1 class="text-center m-0" style="font-weight: 300; font-size: 28px; line-height: 130%; margin: 0;" align="center">You've been invited!</h1>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 40px 48px 0;">
                                        <p style="margin: 0 0 1em;">You've been invited to use Omnia on behalf of your company. VOXO is a unified communications solution that will help you work more effectively. Besides using your office extension from your deskphone, you can take calls from anywhere using the softphones for iOS, Android, Mac and Windows.</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 0;">
                                        <h2 style="margin: 0 0 1em;">Your VOXO Extension</h2>
                                        <ul>
                                          <li>Your extension number is <strong>${result.extension}</strong></li>
                                          <li>You can retrieve your voice mail by dialing <strong>*97</strong></li>
                                          <li>You can record a personalized greeting by following the voice prompts in your mailbox</li>
                                        </ul>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 0;">
                                        <h2 style="margin: 0 0 1em;">Using the VOXO Mobile & Desktop App</h2>
                                        <p>With the VOXO mobile and desktop app you can make and receive calls, view the presence of your colleagues, transfer calls and take your work on the go.</p>
                                        <div style="text-align: center;">
                                          <a href="https://play.google.com/store/apps/details?id=com.voxo.voxo.android" target="_blank" ><img style="width: 128px; height: 128px;" height="128" width="128" src="https://miscdts.s3.amazonaws.com/android_store.png" alt="Android"></a>
                                          <a href="https://itunes.apple.com/us/app/voxo-mobility/id1434645492?mt=8" target="_blank" ><img style="width: 128px; height: 128px;" height="128" width="128" src="https://miscdts.s3.amazonaws.com/ios_store.png" alt="iOS"></a>
                                        </div>
                                        <p>If you a viewing this email on your mobile device and have already downloaded the app, <a href="https://voxo.co/mobile-code?code=csc:${result.email}:${rawPass}@VOXO" target="_blank">tap here to sign in</a> or scan the code below on the sign in page of the mobile app if you are viewing this on your desktop.</p>
                                        <div style="text-align: center;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=csc:${result.email}:${rawPass}@VOXO"></div>
                                        <p>To login to the Desktop app use the login details below</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px;">
                                      <table class="list" cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                        <tr class="list-item">
                                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-top: 0; padding-bottom: 8px;">Email</td>
                                          <td class="text-muted-dark" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-top: 0; padding-bottom: 8px; color: #728c96;">${result.email}</td>
                                        </tr>
                                        <tr class="list-item" style="border-top-width: 1px; border-top-color: #f0f0f0; border-top-style: solid;">
                                          <td style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-top: 8px; padding-bottom: 0;">Password</td>
                                          <td class="text-muted-dark" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding-top: 8px; padding-bottom: 0; color: #728c96;">${rawPass}</td>
                                        </tr>
                                      </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 40px;">
                                        <table cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                          <tr>
                                            <td align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                              <table cellpadding="0" cellspacing="0" border="0" class="bg-blue rounded w-auto" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: separate; width: auto; color: #ffffff; border-radius: 3px;" bgcolor="#467fcf">
                                                <tr>
                                                  <td align="center" valign="top" class="lh-1" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 100%;">
                                                    <a href="https://app.voxo.co" class="btn bg-blue border-blue" style="color: #ffffff; padding: 12px 32px; border: 1px solid #467fcf; text-decoration: none; white-space: nowrap; font-weight: 600; font-size: 16px; border-radius: 3px; line-height: 100%; display: block; -webkit-transition: .3s background-color; transition: .3s background-color; background-color: #467fcf;">
                                                      <span class="btn-span" style="color: #ffffff; font-size: 16px; text-decoration: none; white-space: nowrap; font-weight: 600; line-height: 100%;">Desktop Login</span>
                                                    </a>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 48px 0;">
                                        <p style="margin: 0 0 1em;">We recommend you change this password before logging in. To do this, go to the URL above and click <strong style="font-weight: 600;">Change Password</strong> on the login page and enter the new details.</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 48px 0;">
                                        <p style="margin: 0 0 1em;">Click here to install the <a href="https://chrome.google.com/webstore/detail/voxo-quick-dial/ckohnlaiommapdclfdndapcofmkacino?hl=en-US"><strong style="font-weight: 600;">VOXO Quick Dial</strong></a> Chrome plugin which allows you to quickly dial telephone numbers on websites via Omnia.</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 0;">
                                        <h2 style="margin: 0 0 1em;">Try VOXO Meet</h2>
                                        <p>You can send customers and colleagues your personal Meeting URL and arrange on-demand or scheduled web meetings.</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 40px;">
                                        <table cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                          <tr>
                                            <td align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                              <table cellpadding="0" cellspacing="0" border="0" class="bg-teal rounded w-auto" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: separate; width: auto; color: #ffffff; border-radius: 3px;" bgcolor="#28beae">
                                                <tr>
                                                  <td align="center" valign="top" class="lh-1" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 100%;">
                                                    <a href="https://meet.voxo.co" class="btn bg-teal border-blue" style="color: #ffffff; padding: 12px 32px; border: 1px solid #28beae; text-decoration: none; white-space: nowrap; font-weight: 600; font-size: 16px; border-radius: 3px; line-height: 100%; display: block; -webkit-transition: .3s background-color; transition: .3s background-color; background-color: #28beae;">
                                                      <span class="btn-span" style="color: #ffffff; font-size: 16px; text-decoration: none; white-space: nowrap; font-weight: 600; line-height: 100%;">Try VOXO Meet</span>
                                                    </a>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb-0 content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 0;">
                                        <h2 style="margin: 0 0 1em;">Need Help?</h2>
                                        <p>Learn more about these products from our helpful videos found on our support page and if you have any questions, feel free to <a href="mailto:support@voxo.co">email</a> or chat with our team to get fanatical support</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="content" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 48px 40px;">
                                        <table cellspacing="0" cellpadding="0" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: collapse; width: 100%;">
                                          <tr>
                                            <td align="center" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;">
                                              <table cellpadding="0" cellspacing="0" border="0" class="bg-teal rounded w-auto" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; border-collapse: separate; width: auto; color: #ffffff; border-radius: 3px;" bgcolor="#28beae">
                                                <tr>
                                                  <td align="center" valign="top" class="lh-1" style="font-family: Open Sans, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 100%;">
                                                    <a href="https://support.voxo.co/en/articles/3959525-omnia-by-voxo" class="btn bg-orange border-blue" style="color: #ffffff; padding: 12px 32px; border: 1px solid #fd8e35; text-decoration: none; white-space: nowrap; font-weight: 600; font-size: 16px; border-radius: 3px; line-height: 100%; display: block; -webkit-transition: .3s background-color; transition: .3s background-color; background-color: #fd8e35;">
                                                      <span class="btn-span" style="color: #ffffff; font-size: 16px; text-decoration: none; white-space: nowrap; font-weight: 600; line-height: 100%;">Helpful Videos</span>
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
