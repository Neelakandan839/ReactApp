export const SCREENS = {
  AUTH: {
    name: 'Authentication'
  },
  HOMESCREEN: {
    name: 'HomeScreen',
  },
  LEAVESCREEN: {
    name: 'LeaveScreen',
  },
  PERMISSIONSCREEN: {
    name: 'PermissionScreen',
  },
  MISSPUNCHSCREEN: {
    name: 'MissPunchScreen'
  },
  ONDUTYSCREEN: {
    name: 'OnDutyScreen'
  },
  COMPOFFSCREEN: {
    name: 'CompOffScreen'
  },
};

export const APPROVAL_ACTIONS = {
  APPROVE:"approve",
  REJECT:"reject"
}

export const PLACEHOLDER_VALUES = () => ({
  USERNAME: 'User',
  EMAIL: 'user@alliancein.com',
})

export const ERROR_TEXT = {
  GENERIC_SOMETHINGWRONG: "Something's wrong with this. Please re-enter",
  EMPTY_FIELD: 'Looks like you forgot this',
  INCORRECT_NAME_OR_PASSWORD: 'Incorrect email or password',
  EMAIL_WRONGFORMAT: 'Email should be in example@email.com format',
  EMAIL_ALREADYTAKEN: 'This email is already taken',
  EMAIL_NOTREGISTERED: 'We couldnt find this email. Please Sign Up',
  EMAIL_NOTCONFIRMED: 'Your email is yet to be confirmed. Please contact our support',
  PASSWORD_WRONGFORMAT: 'Should have atleast 8 characters and 1 number',
  PASSWORD_ALTEAST8CHARS: 'Should have atleast 8 characters',
  PASSWORD_ALTEAST1NUM: 'Should have atleast 1 number',
  PASSWORD_RESETREQUIRED: 'Reset required. Please contact our support',
  USERNAME_WRONGFORMAT: 'Invalid employee Id',
  USERNAME_NUMCHARS: 'Should be between 3 and 20 characters',
  EMAIL_OR_PWD_WRONGFORMAT: 'Invalid username or password!',
  TOAST_SOMETHINGWENTWRONG: 'Something went wrong. Please try again',
  BIO_MAX100CHARS: 'Too long! Not more than 100 characters',
  EXPTITLE_NUMCHARS: 'Should be between 3 and 20 characters',
  EXPTITLE_WRONGFORMAT: 'Only letters with spaces in middle here',
};

// export const HR_ADMIN = [
//   'C89E9F074B5F4BBEBF28331A395A0BDF',
//   '6A3B9B1E665845D4B1027CFB4703F358',
//   '6E1087DB8B614F198CF3344542190CEC',
// ];
