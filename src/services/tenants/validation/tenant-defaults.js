//tenant defaults for creation hook

module.exports = {
  TENANT: {
    alertEmail: 'NULL',
    paymentType: 'Post Paid',
    disabled: '0',
    maxChannels: -1,
    allowAnyCallerIdForEmerg: 'on',
    te_cl_id: 0,
    te_rp_id: 6,
    te_billingcode: 'NULL',
    te_prefixbillingcode: 'NULL',
    te_provisioningdir: 'NULL',
    te_recordingstorage: '',
    te_recordinghost: '',
    te_recordinguser: '',
    te_recordingpassword: '',
    te_recordingdirectory: '',
    te_defaultrrid: -1
  },

  SETTINGS: {
    ADDITIONALDESTINATIONPEER: 'caller',
    CALLWAITING: 'yes',
    DEFAULTCALLERIDCF: 'ORIGINAL',
    DEFAULTTIMEOUTCF: '30',
    DIALBYNAMEALWAYSPLAY: 'no',
    DIALBYNAMEUSENAMES: 'all',
    DIALBYNAMEUSEVMGREETING: 'yes',
    DIALTIMEOUT: '180',
    EXTDIALTIMEOUT: '15',
    FAKERINGING: 'on',
    FAXOUTPREFIX: '2329',
    INTERNALRING: 'Bellcore-dr2',
    MAXCALLDURATION: '28800',
    ONINTERNALCALLBUSY: 'askforreservation',
    PAGEINUSE: 'CHECK',
    PARKTIMEOUT: '120',
    QUEUERING: 'Bellcore-dr4',
    RECORDINGBEEP: 'on',
    SMSSTORE: 'yes',
    TRANSFERRING: 'Bellcore-dr1',
    VMAUTORECOVER: 'no',
    VMSAMEPASSWORD: 'no',
    WEBCALLS: 'no',
    WORKINGHOURS: '0'
  },

  PARKINGLOTS: {
    start: '71',
    end: '74',
    host: 'NULL'
  }
};
