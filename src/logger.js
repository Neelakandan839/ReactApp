import { logger, consoleTransport } from 'react-native-logs';
import store from './store';

function getDateAndTime(date) {
  if (!date || !(date instanceof Date)) {
    date = new Date();
  }

  // zero-pad a single zero if needed
  const zp = function zp(val) {
    return val <= 9 ? `0${val}` : `${val}`;
  };

  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  const h = date.getHours();
  const min = date.getMinutes();
  const s = date.getSeconds();
  return `${y}-${zp(m)}-${zp(d)} ${zp(h)}:${zp(min)}:${zp(s)}`;
}

const customTransport = (props) => {
  // Do here whatever you want with the log message
  // You can use any options setted in config.transportOptions
  // Eg. a console log: console.log(props.level.text, props.msg)
  const state = store.getState();
  const email = state?.app?.userContext?.email || 'user@unshots.com';
  let message = JSON.stringify(props.rawMsg);
  if (props.rawMsg instanceof Error) {
    message = props?.rawMsg?.message || 'App Error';
  } else if (props?.rawMsg?.apiResponse) {
    message = '';
  }

  let fmt = `${getDateAndTime()} ${props?.level?.text?.toUpperCase?.()} ${email}: ${message}`;
  if (props.rawMsg instanceof Error) {
    const err = props.rawMsg;
    fmt = `${fmt}\n${err.stack}`;
  } else if (props?.rawMsg?.apiResponse) {
    fmt = `${fmt}\n${JSON.stringify(props?.rawMsg?.apiResponse, null, 2)}`;
  }

  // logDnaLogger.log(fmt, props?.level?.text || 'info');
};

const defaultConfig = {
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  },
  severity: 'debug',
  transport: [consoleTransport /* customTransport */],
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: (d) => getDateAndTime(d),
  printLevel: true,
  printDate: true,
  enabled: true,
};

export default logger.createLogger(defaultConfig);
