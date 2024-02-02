import axios from 'axios';
import base64 from 'base-64';
import config from './config';

let ebData;

export default async function getEbData() {
  const { userName, password } = config;
  const credentials = base64.encode(`${userName}:${password}`);

  const headers = {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };

  try {
    ebData = await axios.get(
      'https://testerp.alliancein.com/allianceerp/org.openbravo.service.json.jsonrest/WEC_Ebr',
      {
        headers,
      },
    );
    // console.log(ebData);
  } catch (error) {
    console.error(error);
  }
  return ebData;
}
