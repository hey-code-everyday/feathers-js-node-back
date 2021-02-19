const pdf = require('pdf-creator-node');
const moment = require('moment');

module.exports = async (params) => {

  const html =
  `
    <html>
      <head>
        <mate charest="utf-8" />
        <title>Hello world!</title>
      </head>
      <body>
        <table style="border-collapse: collapse;">
          <thead>
            <th></th>
            <th></th>
            <th></th>
          </thead>
          <tbody>
            <tr style="height: 140px;">
              <td style="width: 125px; text-align:center; border: 1px solid #000; font-size: 26pt;">
                FAX
              </td>
              <td style="vertical-align: top; border: 1px solid #000;">
                <table style="border-collapse: collapse;">
                  <thead>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width: 175px; font-weight: bold; padding-left: 10px; font-size: 11pt;">To:</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width: 175px; font-weight: bold; padding-left: 10px; font-size: 11pt;">From:</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width:175px; font-weight: bold; padding-left: 10px; font-size: 11pt;">Contact No:</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width: 175px; font-weight: bold; padding-left: 10px; font-size: 11pt;">Date:</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="width: 175px; font-weight: bold; padding-left: 10px; font-size: 11pt;">Pages:</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="vertical-align: top; border: 1px solid #000;">
                <table style="border-collapse: collapse;">
                  <thead>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width: 200px; padding-left: 10px; font-size: 11pt;">${numberFormatter(params.faxTo)}</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width: 200px; padding-left: 10px; font-size: 11pt;">${params.faxFromName}</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width:200px; padding-left: 10px; font-size: 11pt;">${numberFormatter(params.faxFrom)}</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="border-bottom: 1px solid #000; width: 200px; padding-left: 10px; font-size: 11pt;">${moment().format('MM-DD-YYYY h:mm A')}</td>
                    </tr>
                    <tr style="height: 35px;">
                      <td style="width: 300px; padding-left: 10px; font-size: 11pt;">${params.pages}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 20px; font-size: 11pt;">
          ${params.coverMessage}
        </p>
      </body>
    </html>
  `;

  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '20mm',
      contents: '<div style="text-align: center;">Fax Cover Sheet</div>'
    },
    footer: {
      height: '1mm',
      contents: {}
    }
  };

  const document = {
    html,
    data: {},
    path: params.outputDirectory
  };

  await pdf.create(document, options);

  function numberFormatter(number){
    return number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

};
