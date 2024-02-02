export default {
  userName: process.env.USERNAME || 'EIN 4137',
  password: process.env.PASSWORD || '123',
  EbrConfig: {
    ebrApiUrl: process.env.EBR_APIURL,
    ebrLineApiUrl: process.env.EBR_LINE_APIURL,
  },
  nmrConfig: {
    nmrApiUrl: process.env.NMR_APIURL,
    nmrLineApiUrl: process.env.NMR_LINE_APIURL,
  },
};
