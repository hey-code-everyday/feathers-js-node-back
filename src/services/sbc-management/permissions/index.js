//permissions related to array of commands that can be submitted to kamailio API
//based on existing portal / voxo api user roles.

module.exports = {

  resyncDevices: ['1', '3', '5','7'],
  extStatus: ['1', '3', '5'],
  kamStats: ['1'],
  kamTenantServer: ['1'],
  kamProcesses: ['1'],
  kamUptime: ['1'],
  kamExtension: ['1', '3', '5','7'],
  kamReloadTable: ['1'],
  bustHtable: ['1'],
  kamTenantExtensions: ['1', '3'],
  tenantServer: ['1']
};
