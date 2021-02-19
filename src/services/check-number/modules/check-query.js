module.exports = async (params, app) => {
  const sequelize = app.get('sequelizeClient');
  const { number, tenantId, mac } = params.query;

  let query;

  if (number) {
    query =
      'SELECT Count(*) AS howmany \n' +
      "FROM   (SELECT 'EXT'     AS tbl, \n" +
      '               ex_id     AS id, \n' +
      '               ex_number AS number \n' +
      '        FROM   ex_extensions \n' +
      "        WHERE  ex_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'CONFERENCE' AS tbl, \n" +
      '               cr_id        AS id, \n' +
      '               cr_number    AS number \n' +
      '        FROM   cr_conferencerooms \n' +
      "        WHERE  cr_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'HUNTLIST' AS tbl, \n" +
      '               hu_id      AS id, \n' +
      '               hu_number  AS number \n' +
      '        FROM   hu_huntlists \n' +
      "        WHERE  hu_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'PAGING'  AS tbl, \n" +
      '               pa_id     AS id, \n' +
      '               pa_number AS number \n' +
      '        FROM   pa_paginggroups \n' +
      "        WHERE  pa_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'FLOW'    AS tbl, \n" +
      '               fl_id     AS id, \n' +
      '               fl_number AS number \n' +
      '        FROM   fl_flows \n' +
      "        WHERE  fl_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'FEATURE' AS tbl, \n" +
      '               fe_id     AS id, \n' +
      '               fe_code   AS number \n' +
      '        FROM   fe_features \n' +
      "        WHERE  fe_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'QUEUE'   AS tbl, \n" +
      '               qu_id     AS id, \n' +
      '               qu_number AS number \n' +
      '        FROM   qu_queues \n' +
      "        WHERE  qu_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'SHORTNUMBER' AS tbl, \n" +
      '               sn_id         AS id, \n' +
      '               sn_number     AS number \n' +
      '        FROM   sn_shortnumbers \n' +
      "        WHERE  sn_te_id = '" +
      tenantId +
      "' \n" +
      '        UNION \n' +
      "        SELECT 'CONDUIT' AS tbl, \n" +
      '               tc_id     AS id, \n' +
      "               '34344'   AS number \n" +
      '        FROM   tc_tenantconduits \n' +
      "        WHERE  tc_te_id = '" +
      tenantId +
      "' \n" +
      "               AND '" +
      number +
      "' LIKE Concat(tc_prefix, '%')) AS numbers \n" +
      "WHERE  ( tbl <> 'EXT' \n" +
      "          OR id <> '' ) \n" +
      '       AND number IS NOT NULL \n' +
      "       AND number = '" +
      number +
      "'";
  } else if (mac) {
    query = `SELECT Count(*) AS howmany FROM ph_phones WHERE ph_mac = '${mac}'`;
  }
  const checkQuery = await sequelize
    .query(query, { type: sequelize.QueryTypes.SELECT })
    .then((res) => res[0].howmany);

  return !!checkQuery;
};
