import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  VStack,
  Input,
  Image,
  Button,
  FormControl,
  Pressable,
  Icon,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { SCREENS, ERROR_TEXT } from '../appConstants';
import authImg from '../../assets/authImg.png';
import { setUserContext, setUserData } from '../reduxSlices/app';
import { useGetEmployeeDataQuery } from '../reduxSlices/apiSlice';

function checkLoginPasswordErrors(password) {
  if (!password) {
    return ERROR_TEXT.EMPTY_FIELD;
  }
  if (typeof password !== 'string') {
    return ERROR_TEXT.GENERIC_SOMETHINGWRONG;
  }

  return '';
}

function checkEmployeeIdErrors(employeeId) {
  if (!employeeId) {
    return ERROR_TEXT.EMPTY_FIELD;
  }
  if (typeof employeeId !== 'string') {
    return ERROR_TEXT.GENERIC_SOMETHINGWRONG;
  }
  if (!/^(?:\d{4}|[A-Z]{3} \d{4})$/.test(employeeId)) {
    return ERROR_TEXT.USERNAME_WRONGFORMAT;
  }

  return '';
}

export default function AuthScreen() {
  const navigation = useNavigation();
  const [values, setValues] = useState({
    employeeId: '',
    password: '',
  });
  const [isDirty, setIsDirty] = useState({
    employeeId: false,
    password: false,
  });
  const [errorMsgs, setErrorMsgs] = useState({
    employeeId: '',
    password: '',
  });

  // const [isInternetConnected, setIsInternetConnected] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  // const { userContext } = useSelector((st) => st.app);

  // const employeeId = values?.employeeId;

  const {
    data: employeeData = [],
    isError,
    // isSuccess,
    // isFetching,
    // refetch,
    error,
  } = useGetEmployeeDataQuery(
    { employeeId: values?.employeeId, password: values?.password },
    { skip: !values?.employeeId },
  );

  // useEffect(() => {
  //   if (!error) {
  //     setIsInternetConnected(true);
  //     return;
  //   }
  //   setIsInternetConnected(!(error?.error?.split(':')?.[1]?.trim() === 'Network request failed'));
  //   console.log(isInternetConnected);
  // }, [error, isInternetConnected]);

  // console.log(error?.error?.split(':')?.[1]?.trim() === 'Network request failed');
  // useEffect(() => {
  //   if (employeeId) {
  //     refetch();
  //   }
  // }, [employeeId, refetch, userContext?.password, userContext?.employeeId]);

  useEffect(() => {
    if (isDirty.employeeId) {
      setErrorMsgs((m) => ({
        ...m,
        employeeId: checkEmployeeIdErrors(values.employeeId),
      }));
    }
    if (isDirty.password) {
      setErrorMsgs((m) => ({
        ...m,
        password: checkLoginPasswordErrors(values.password),
      }));
    }
  }, [isDirty, values]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!errorMsgs?.employeeId || !errorMsgs?.password) {
      return;
    }
    setIsLoading(false);
  }, [errorMsgs]);

  // useEffect(() => {
  //   if (isFetching) {
  //     return;
  //   }
  //   if (!isSuccess && isError && userContext?.employeeId) {
  //     setIsLoading(false);
  //     setErrorMsgs({
  //       employeeId: ERROR_TEXT?.EMAIL_OR_PWD_WRONGFORMAT,
  //       password: ERROR_TEXT?.EMAIL_OR_PWD_WRONGFORMAT,
  //     });
  //   }
  // }, [isFetching, isSuccess, isError, userContext]);

  // useEffect(() => {
  //   if (employeeData.length === 0 || !isSuccess || !userContext.employeeId || isFetching) {
  //     return;
  //   }

  //   // console.log(employeeData[0]);

  //   const userData = {
  //     id: employeeData?.[0]?.id || '',
  //     name: `${employeeData?.[0]?.firstName} ${employeeData?.[0]?.lastName}` || '',
  //     empCode: employeeData?.[0]?.employeeId || '',
  //   };

  //   dispatch(setUserData(userData));
  //   navigation.navigate(SCREENS.HOMESCREEN.name);

  //   setErrorMsgs({
  //     employeeId: '',
  //     password: '',
  //   });
  //   setIsDirty({
  //     employeeId: false,
  //     password: false,
  //   });
  //   setValues({
  //     employeeId: '',
  //     password: '',
  //   });

  //   setIsLoading(false);
  // }, [employeeData, navigation, dispatch, isSuccess, userContext, isFetching]);

  const _login = async () => {
    setIsLoading(true);
    await dispatch(setUserContext(values));

    if (errorMsgs?.employeeId || errorMsgs?.password) {
      setIsLoading(false);
      return;
    }
    if (!values.employeeId || !values.password) {
      setErrorMsgs((m) => ({
        ...m,
        employeeId: checkEmployeeIdErrors(values?.employeeId),
      }));
      setErrorMsgs((m) => ({
        ...m,
        password: checkLoginPasswordErrors(values.password),
      }));
      return;
    }

    if (employeeData.length === 0 || isError) {
      setIsLoading(false);
      setErrorMsgs({
        employeeId: ERROR_TEXT?.EMAIL_OR_PWD_WRONGFORMAT,
        password: ERROR_TEXT?.EMAIL_OR_PWD_WRONGFORMAT,
      });
      return;
    }

    try {
      const userData = {
        id: employeeData?.[0]?.id || '',
        name: `${employeeData?.[0]?.firstName} ${employeeData?.[0]?.lastName}` || '',
        empCode: employeeData?.[0]?.employeeId || '',
      };

      await dispatch(setUserData(userData));
      navigation.navigate(SCREENS.HOMESCREEN.name);

      setErrorMsgs({
        employeeId: '',
        password: '',
      });
      setIsDirty({
        employeeId: false,
        password: false,
      });
      setValues({
        employeeId: '',
        password: '',
      });

      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        position: 'relative',
        backgroundColor: '#F9B800',
        height: '100%',
      }}
    >
      <View
        justifyContent="flex-end"
        alignItems="center"
        style={{
          height: '40%',
        }}
      >
        <Image source={authImg} alt="auth Img" size="2xl" />
      </View>
      <View
        borderTopRightRadius={40}
        borderTopLeftRadius={40}
        px={6}
        style={{
          backgroundColor: '#fff',
          height: '60%',
        }}
      >
        <VStack>
          <Text
            fontWeight="semibold"
            mt={25}
            fontSize={22}
            style={{ color: '#000', textAlign: 'center' }}
          >
            Welcome !
          </Text>
          <Text
            mt={1}
            fontSize={14}
            style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%', textAlign: 'center' }}
          >
            Please log in to continue
          </Text>
          {/* {!isInternetConnected ? (
            <Text mt={1} fontSize={14} style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              No Internet!
            </Text>
          ) : (
            ''
          )} */}
          <FormControl mt={8} mb={6} isInvalid={errorMsgs?.employeeId}>
            <Input
              h={44}
              fontSize={14}
              borderColor="#757575"
              borderWidth={1}
              borderStyle="solid"
              borderRadius={14}
              bg="#EEE"
              variant="outline"
              placeholder="Employee ID"
              type="text"
              onBlur={() => {
                setIsDirty((d) => ({
                  ...d,
                  employeeId: true,
                }));
              }}
              onChangeText={(text) => {
                setValues({ ...values, employeeId: text });
              }}
              value={values?.employeeId || ''}
            />
            <FormControl.ErrorMessage>{errorMsgs?.employeeId || ''}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={errorMsgs?.password}>
            <Input
              h={44}
              bg="#EEE"
              fontSize={14}
              borderColor="#757575"
              borderWidth={1}
              borderStyle="solid"
              borderRadius={14}
              variant="outline"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              InputRightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />}
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
              onBlur={() => {
                setIsDirty((d) => ({
                  ...d,
                  password: true,
                }));
              }}
              onChangeText={(text) => {
                setValues({ ...values, password: text });
              }}
              value={values?.password || ''}
            />
            <FormControl.ErrorMessage>{errorMsgs?.password || ''}</FormControl.ErrorMessage>
          </FormControl>
          <Button
            onPress={() => _login()}
            h={44}
            my={3}
            borderRadius={14}
            bg="#000"
            _text={{ color: '#F9B800', fontSize: '16px', fontWeight: 'semibold' }}
            isLoading={isLoading}
          >
            Log in
          </Button>
        </VStack>
        <VStack>
          <Text
            mt={1}
            fontSize={14}
            style={{ color: 'rgba(0, 0, 0, 0.85)', width: '100%', textAlign: 'center' }}
          >
            Powered by
          </Text>
          <Text
            fontWeight="semibold"
            fontSize={20}
            style={{ color: '#000', width: '100%', textAlign: 'center' }}
          >
            Openbravo ERP - Alliance
          </Text>
        </VStack>
      </View>
    </View>
  );
}
