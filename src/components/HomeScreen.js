import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, HStack, VStack, Box, Image, ScrollView, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SCREENS, APPROVAL_ACTIONS } from '../appConstants';
import { unsetUserContext, unsetUserData } from '../reduxSlices/app';
import {
  useGetLeaveDataQuery,
  useGetPermissionDataQuery,
  useGetCompOffDataQuery,
  useGetOnDutyDataQuery,
  useGetRegularizationDataQuery,
  useApproveLeaveMutation,
  useApprovePermissionMutation,
  useApproveRegularizationMutation,
  useGetADUserDataQuery,
} from '../reduxSlices/apiSlice';

import userProfile from '../../assets/userProfile1.jpg';
import leaveIcon from '../../assets/leave_icon.png';
import permissionIcon from '../../assets/permission_icon.png';
import missPunchIcon from '../../assets/missPunch_icon.png';
import onDutyIcon from '../../assets/onDuty_icon.png';
import compOffIcon from '../../assets/compOff_icon.png';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

  const { userData } = useSelector((st) => st.app);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View
      bg="#fffbe6"
      style={{
        height: '100%',
      }}
    >
      <HStack
        px={5}
        pt={12}
        pb={1}
        bg="#F9B800"
        style={{
          flex: 1,
          height: '25%',
          elevation: 10,
        }}
        justifyContent="space-between"
      >
        <HStack>
          <Box
            width={12}
            height={12}
            style={{
              borderColor: '#212121',
              borderWidth: 1.5,
              borderStyle: 'solid',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
            }}
          >
            <Image
              alt="userProfile"
              source={userProfile}
              style={{ borderRadius: 7, width: '85%', height: '85%' }}
            />
          </Box>
          <VStack px={2} alignItems="center">
            <Text fontWeight="semibold" fontSize={18} style={{ color: '#000', width: '100%' }}>
              {userData?.name || 'Employee'}
            </Text>
            <Text fontSize={14} style={{ color: '#212121', width: '100%' }}>
              {userData?.empCode || 'Emp code'}
            </Text>
          </VStack>
        </HStack>
        <VStack>
          <TouchableOpacity
            onPress={() => {
              dispatch(unsetUserContext(), unsetUserData());
              navigation.goBack();
            }}
          >
            <MaterialIcons
              name="logout"
              size={24}
              color="#B20000"
              style={{ alignSelf: 'center' }}
            />
            <Text fontWeight="semibold" fontSize={14} style={{ color: '#B20000', width: '100%' }}>
              Log out
            </Text>
          </TouchableOpacity>
        </VStack>
      </HStack>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        pt={3}
        pb={6}
        w="100%"
        h="75%"
      >
        <Leaves refreshing={refreshing} />
        <Permission refreshing={refreshing} />
        <MissPunch refreshing={refreshing} />
        <OnDuty refreshing={refreshing} />
        <CompensatoryOff refreshing={refreshing} />
      </ScrollView>
    </View>
  );
}

function Leaves({ refreshing }) {
  const navigation = useNavigation();

  const [isOpenNotification, setIsOpenNotification] = useState(false);

  const [isApprovedAll, setIsApprovedAll] = useState(false);

  const [leaveData, setLeaveData] = useState([]);

  const [dateRange, setDateRange] = useState({});

  const { userData } = useSelector((st) => st.app);

  const approverId = userData?.id;

  useEffect(() => {
    const currentDate = new Date();

    const last37DaysStartDate = new Date();
    last37DaysStartDate.setDate(currentDate.getDate() - 37);

    const toDate = currentDate?.toISOString()?.split('T')?.[0];
    const fromDate = last37DaysStartDate?.toISOString()?.split('T')?.[0];

    setDateRange({
      fromDate,
      toDate,
    });
  }, []);

  const params = {
    approverId,
    ...dateRange,
  };

  const {
    data: leaves = [],
    isSuccess,
    refetch,
  } = useGetLeaveDataQuery(params, {
    skip: !params?.approverId,
  });

  const [approveAllLeaves] = useApproveLeaveMutation();

  const approveLeave = async () => {
    const approvalData = {};
    approvalData.data = [];
    approvalData.params = { approverId, ...dateRange };
    leaveData?.map((item) => {
      return approvalData?.data?.push({
        id: item?.id,
        action: APPROVAL_ACTIONS?.APPROVE,
        reason: '',
      });
    });

    try {
      await approveAllLeaves(approvalData).unwrap();

      setIsApprovedAll(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setLeaveData(leaves?.filter((l) => l?.leaveStatus === 'Pending'));
  }, [isSuccess, leaves]);

  useEffect(() => {
    if (leaveData.length > 0) {
      return setIsApprovedAll(false);
    }
    return setIsApprovedAll(true);
  }, [leaveData]);

  useEffect(() => {
    if (!refreshing) {
      return;
    }
    refetch();
  }, [refreshing, refetch]);

  return (
    <VStack w="100%">
      <VStack
        bg="#fff"
        w="90%"
        mt={4}
        alignSelf="center"
        borderRadius={13}
        style={{
          borderColor: '#C2C2C2',
          borderWidth: 1,
          borderStyle: 'solid',
          elevation: 2,
          overflow: 'hidden',
        }}
      >
        <HStack justifyContent="space-between" px={4} py={3}>
          <HStack alignItems="center">
            <Box
              borderRadius={100}
              p={2}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                borderColor: 'rgba(33, 33, 33, 0.20)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <Image source={leaveIcon} style={{ width: '90%', height: '90%' }} alt="leave_icon" />
            </Box>
            <Text fontWeight="semibold" fontSize={16} pl={2} style={{ color: '#000' }}>
              Leaves
            </Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.LEAVESCREEN.name)}>
            <Box
              borderRadius={100}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                backgroundColor: 'rgba(180, 180, 180, 0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Entypo name="chevron-thin-right" size={20} color="black" />
            </Box>
          </TouchableOpacity>
        </HStack>
        <VStack
          style={{
            display: isOpenNotification ? 'flex' : 'none',
          }}
        >
          <HStack
            alignSelf="center"
            w="90%"
            bg={isApprovedAll ? '#fff' : 'rgba(249, 184, 0, 0.13)'}
            pl={3}
            pr={1}
            py={1}
            my={3}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: isApprovedAll ? '#0B8E00' : 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            {isApprovedAll ? (
              <HStack w="100%" py={1} justifyContent="center" alignItems="center">
                <MaterialCommunityIcons name="check-circle-outline" size={24} color="#0B8E00" />
                <Text
                  fontWeight="semibold"
                  fontSize={12}
                  pl={1}
                  style={{
                    color: '#0B8E00',
                  }}
                >
                  All Approvals completed
                </Text>
              </HStack>
            ) : (
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Text
                    fontWeight="semibold"
                    fontSize={20}
                    pr={1}
                    style={{
                      color: '#F9B800',
                    }}
                  >
                    •
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#212121',
                    }}
                  >
                    Approval pending list -
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#000',
                    }}
                  >
                    {' '}
                    {leaveData?.length || 0}
                  </Text>
                </HStack>
                <Button
                  onPress={() => approveLeave()}
                  bg="#0B8A00"
                  borderRadius={10}
                  _text={{ fontSize: 14, fontWeight: 'semibold' }}
                >
                  Approve all
                </Button>
              </HStack>
            )}
          </HStack>
          {/* <HStack
            alignSelf="center"
            w="90%"
            bg="rgba(249, 184, 0, 0.13)"
            pl={3}
            pr={1}
            py={1}
            my={2}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            <HStack>
              <Text
                fontWeight="semibold"
                fontSize={20}
                pr={1}
                style={{
                  color: '#F9B800',
                }}
              >
                •
              </Text>
              <Text
                fontWeight="semibold"
                fontSize={12}
                py={1}
                style={{
                  color: '#000',
                }}
              >
                You got 10 days LOP
              </Text>
            </HStack>
            <Button bg="#0B8A00" borderRadius={10} _text={{ fontSize: 14, fontWeight: 'semibold' }}>
              Apply
            </Button>
          </HStack> */}
        </VStack>
        <TouchableOpacity onPress={() => setIsOpenNotification(!isOpenNotification)}>
          <HStack bg="#212121" justifyContent="center" alignItems="center">
            {/* <Text
              fontWeight="semibold"
              fontSize={14}
              py={1}
              style={{
                color: '#F9B800',
              }}
            >
              1 notifications
            </Text> */}
            <MaterialIcons
              name={isOpenNotification ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color="#F9B800"
            />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
}
Leaves.propTypes = {
  refreshing: PropTypes.bool,
};
Leaves.defaultProps = {
  refreshing: false,
};

function Permission({ refreshing }) {
  const navigation = useNavigation();
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  const [isApprovedAll, setIsApprovedAll] = useState(false);

  const [permissionData, setPermissionData] = useState([]);

  const { userData } = useSelector((st) => st.app);

  const approverId = userData?.id;

  const {
    data: permission = [],
    isSuccess,
    refetch,
  } = useGetPermissionDataQuery(approverId, {
    skip: !approverId,
  });

  useEffect(() => {
    if (!refreshing) {
      return;
    }
    refetch();
  }, [refreshing, refetch]);

  const [approveAllPermission] = useApprovePermissionMutation();

  const approvePermission = async () => {
    const approvalData = {};
    approvalData.data = [];
    approvalData.approverId = approverId;
    permissionData?.map((item) => {
      return approvalData?.data?.push({
        id: item?.id,
        action: APPROVAL_ACTIONS?.APPROVE,
        reason: item?.purpose || '',
      });
    });

    try {
      await approveAllPermission(approvalData).unwrap();

      setIsApprovedAll(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setPermissionData(permission?.filter((p) => p?.perstatus === 'WFMA'));
  }, [isSuccess, permission]);

  useEffect(() => {
    if (permissionData.length > 0) {
      return setIsApprovedAll(false);
    }
    return setIsApprovedAll(true);
  }, [permissionData]);

  return (
    <VStack w="100%">
      <VStack
        bg="#fff"
        w="90%"
        mt={6}
        alignSelf="center"
        borderRadius={13}
        style={{
          borderColor: '#C2C2C2',
          borderWidth: 1,
          borderStyle: 'solid',
          elevation: 2,
          overflow: 'hidden',
        }}
      >
        <HStack justifyContent="space-between" px={4} py={3}>
          <HStack alignItems="center">
            <Box
              borderRadius={100}
              p={2}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                borderColor: 'rgba(33, 33, 33, 0.20)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <Image
                source={permissionIcon}
                style={{ width: '90%', height: '90%' }}
                alt="leave_icon"
              />
            </Box>
            <Text fontWeight="semibold" fontSize={16} pl={2} style={{ color: '#000' }}>
              Permission
            </Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.PERMISSIONSCREEN.name)}>
            <Box
              borderRadius={100}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                backgroundColor: 'rgba(180, 180, 180, 0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Entypo name="chevron-thin-right" size={20} color="black" />
            </Box>
          </TouchableOpacity>
        </HStack>
        <VStack style={{ display: isOpenNotification ? 'flex' : 'none' }}>
          <HStack
            alignSelf="center"
            w="90%"
            bg={isApprovedAll ? '#fff' : 'rgba(249, 184, 0, 0.13)'}
            pl={3}
            pr={1}
            py={1}
            my={3}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: isApprovedAll ? '#0B8E00' : 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            {isApprovedAll ? (
              <HStack w="100%" py={1} justifyContent="center" alignItems="center">
                <MaterialCommunityIcons name="check-circle-outline" size={24} color="#0B8E00" />
                <Text
                  fontWeight="semibold"
                  fontSize={12}
                  pl={1}
                  style={{
                    color: '#0B8E00',
                  }}
                >
                  All Approvals completed
                </Text>
              </HStack>
            ) : (
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Text
                    fontWeight="semibold"
                    fontSize={20}
                    pr={1}
                    style={{
                      color: '#F9B800',
                    }}
                  >
                    •
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#212121',
                    }}
                  >
                    Approval pending list -
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#000',
                    }}
                  >
                    {' '}
                    {permissionData?.length || 0}
                  </Text>
                </HStack>
                <Button
                  onPress={() => approvePermission()}
                  bg="#0B8A00"
                  borderRadius={10}
                  _text={{ fontSize: 14, fontWeight: 'semibold' }}
                >
                  Approve all
                </Button>
              </HStack>
            )}
          </HStack>
          {/* <HStack
            alignSelf="center"
            w="90%"
            bg="rgba(249, 184, 0, 0.13)"
            pl={3}
            pr={1}
            py={1}
            my={2}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            <HStack>
              <Text
                fontWeight="semibold"
                fontSize={20}
                pr={1}
                style={{
                  color: '#F9B800',
                }}
              >
                •
              </Text>
              <Text
                fontWeight="semibold"
                fontSize={12}
                py={1}
                style={{
                  color: '#000',
                }}
              >
                You got 10 days LOP
              </Text>
            </HStack>
            <Button bg="#0B8A00" borderRadius={10} _text={{ fontSize: 14, fontWeight: 'semibold' }}>
              Apply
            </Button>
          </HStack> */}
        </VStack>
        <TouchableOpacity onPress={() => setIsOpenNotification(!isOpenNotification)}>
          <HStack bg="#212121" justifyContent="center" alignItems="center">
            {/* <Text
              fontWeight="semibold"
              fontSize={14}
              py={1}
              style={{
                color: '#F9B800',
              }}
            >
              1 notifications
            </Text> */}
            <MaterialIcons
              name={isOpenNotification ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color="#F9B800"
            />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
}
Permission.propTypes = {
  refreshing: PropTypes.bool,
};
Permission.defaultProps = {
  refreshing: false,
};

function MissPunch({ refreshing }) {
  const navigation = useNavigation();
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  const [isApprovedAll, setIsApprovedAll] = useState(false);

  const [missPunchData, setMissPunchData] = useState([]);

  const { userData } = useSelector((st) => st.app);

  const approverId = userData?.id;

  const {
    data: missPunch = [],
    isSuccess,
    refetch,
  } = useGetRegularizationDataQuery(approverId, {
    skip: !approverId,
  });

  useEffect(() => {
    if (!refreshing) {
      return;
    }
    refetch();
  }, [refreshing, refetch]);

  const [approveAllMissPunch] = useApproveRegularizationMutation();

  const approveMissPunch = async () => {
    const approvalData = {};
    approvalData.data = [];
    approvalData.approverId = approverId;
    missPunchData?.map((item) => {
      return approvalData?.data?.push({
        id: item?.id,
        action: APPROVAL_ACTIONS?.APPROVE,
        reason: item?.purpose || '',
      });
    });

    try {
      await approveAllMissPunch(approvalData).unwrap();

      setIsApprovedAll(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setMissPunchData(missPunch?.filter((m) => m?.regstatus === 'WFMA'));
  }, [isSuccess, missPunch]);

  useEffect(() => {
    if (missPunchData.length > 0) {
      return setIsApprovedAll(false);
    }
    return setIsApprovedAll(true);
  }, [missPunchData]);

  return (
    <VStack w="100%">
      <VStack
        bg="#fff"
        w="90%"
        mt={6}
        alignSelf="center"
        borderRadius={13}
        style={{
          borderColor: '#C2C2C2',
          borderWidth: 1,
          borderStyle: 'solid',
          elevation: 2,
          overflow: 'hidden',
        }}
      >
        <HStack justifyContent="space-between" px={4} py={3}>
          <HStack alignItems="center">
            <Box
              borderRadius={100}
              p={2}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                borderColor: 'rgba(33, 33, 33, 0.20)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <Image
                source={missPunchIcon}
                style={{ width: '90%', height: '90%' }}
                alt="leave_icon"
              />
            </Box>
            <Text fontWeight="semibold" fontSize={16} pl={2} style={{ color: '#000' }}>
              Miss Punch
            </Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.MISSPUNCHSCREEN.name)}>
            <Box
              borderRadius={100}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                backgroundColor: 'rgba(180, 180, 180, 0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Entypo name="chevron-thin-right" size={20} color="black" />
            </Box>
          </TouchableOpacity>
        </HStack>
        <VStack style={{ display: isOpenNotification ? 'flex' : 'none' }}>
          <HStack
            alignSelf="center"
            w="90%"
            bg={isApprovedAll ? '#fff' : 'rgba(249, 184, 0, 0.13)'}
            pl={3}
            pr={1}
            py={1}
            my={3}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: isApprovedAll ? '#0B8E00' : 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            {isApprovedAll ? (
              <HStack w="100%" py={1} justifyContent="center" alignItems="center">
                <MaterialCommunityIcons name="check-circle-outline" size={24} color="#0B8E00" />
                <Text
                  fontWeight="semibold"
                  fontSize={12}
                  pl={1}
                  style={{
                    color: '#0B8E00',
                  }}
                >
                  All Approvals completed
                </Text>
              </HStack>
            ) : (
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Text
                    fontWeight="semibold"
                    fontSize={20}
                    pr={1}
                    style={{
                      color: '#F9B800',
                    }}
                  >
                    •
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#212121',
                    }}
                  >
                    Approval pending list -
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#000',
                    }}
                  >
                    {' '}
                    {missPunchData?.length || 0}
                  </Text>
                </HStack>
                <Button
                  onPress={() => approveMissPunch()}
                  bg="#0B8A00"
                  borderRadius={10}
                  _text={{ fontSize: 14, fontWeight: 'semibold' }}
                >
                  Approve all
                </Button>
              </HStack>
            )}
          </HStack>
          {/* <HStack
            alignSelf="center"
            w="90%"
            bg="rgba(249, 184, 0, 0.13)"
            pl={3}
            pr={1}
            py={1}
            my={2}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            <HStack>
              <Text
                fontWeight="semibold"
                fontSize={20}
                pr={1}
                style={{
                  color: '#F9B800',
                }}
              >
                •
              </Text>
              <Text
                fontWeight="semibold"
                fontSize={12}
                py={1}
                style={{
                  color: '#000',
                }}
              >
                You got 10 days LOP
              </Text>
            </HStack>
            <Button bg="#0B8A00" borderRadius={10} _text={{ fontSize: 14, fontWeight: 'semibold' }}>
              Apply
            </Button>
          </HStack> */}
        </VStack>
        <TouchableOpacity onPress={() => setIsOpenNotification(!isOpenNotification)}>
          <HStack bg="#212121" justifyContent="center" alignItems="center">
            {/* <Text
              fontWeight="semibold"
              fontSize={14}
              py={1}
              style={{
                color: '#F9B800',
              }}
            >
              1 notifications
            </Text> */}
            <MaterialIcons
              name={isOpenNotification ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color="#F9B800"
            />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
}
MissPunch.propTypes = {
  refreshing: PropTypes.bool,
};
MissPunch.defaultProps = {
  refreshing: false,
};

function OnDuty({ refreshing }) {
  const navigation = useNavigation();
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isApprovedAll, setIsApprovedAll] = useState(false);

  const [onDutyData, setOnDutyData] = useState([]);

  const { userContext } = useSelector((st) => st.app);

  const { data: ADUserData = [] } = useGetADUserDataQuery({
    employeeId: userContext?.employeeId,
  });

  const approverId = ADUserData?.[0]?.id;

  const {
    data: onDuty = [],
    isSuccess,
    refetch,
  } = useGetOnDutyDataQuery(approverId, { skip: !approverId });

  useEffect(() => {
    if (!refreshing) {
      return;
    }
    refetch();
  }, [refreshing, refetch]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setOnDutyData(onDuty?.filter((o) => o?.ondutystatus === 'PFMA' || o?.ondutystatus === 'PFHA'));
  }, [isSuccess, onDuty]);

  useEffect(() => {
    if (onDutyData.length > 0) {
      return setIsApprovedAll(false);
    }
    return setIsApprovedAll(true);
  }, [onDutyData]);

  return (
    <VStack w="100%">
      <VStack
        bg="#fff"
        w="90%"
        mt={6}
        alignSelf="center"
        borderRadius={13}
        style={{
          borderColor: '#C2C2C2',
          borderWidth: 1,
          borderStyle: 'solid',
          elevation: 2,
          overflow: 'hidden',
        }}
      >
        <HStack justifyContent="space-between" px={4} py={3}>
          <HStack alignItems="center">
            <Box
              borderRadius={100}
              p={2}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                borderColor: 'rgba(33, 33, 33, 0.20)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <Image source={onDutyIcon} style={{ width: '90%', height: '90%' }} alt="leave_icon" />
            </Box>
            <Text fontWeight="semibold" fontSize={16} pl={2} style={{ color: '#000' }}>
              On Duty
            </Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation?.navigate?.(SCREENS?.ONDUTYSCREEN?.name)}>
            <Box
              borderRadius={100}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                backgroundColor: 'rgba(180, 180, 180, 0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Entypo name="chevron-thin-right" size={20} color="black" />
            </Box>
          </TouchableOpacity>
        </HStack>
        <VStack style={{ display: isOpenNotification ? 'flex' : 'none' }}>
          <HStack
            alignSelf="center"
            w="90%"
            bg={isApprovedAll ? '#fff' : 'rgba(249, 184, 0, 0.13)'}
            pl={3}
            pr={1}
            py={1}
            my={3}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: isApprovedAll ? '#0B8E00' : 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            {isApprovedAll ? (
              <HStack w="100%" py={1} justifyContent="center" alignItems="center">
                <MaterialCommunityIcons name="check-circle-outline" size={24} color="#0B8E00" />
                <Text
                  fontWeight="semibold"
                  fontSize={12}
                  pl={1}
                  style={{
                    color: '#0B8E00',
                  }}
                >
                  All Approvals completed
                </Text>
              </HStack>
            ) : (
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Text
                    fontWeight="semibold"
                    fontSize={20}
                    pr={1}
                    style={{
                      color: '#F9B800',
                    }}
                  >
                    •
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#212121',
                    }}
                  >
                    Approval pending list -
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#000',
                    }}
                  >
                    {' '}
                    {onDutyData?.length || 0}
                  </Text>
                </HStack>
                <Button
                  onPress={() => navigation.navigate(SCREENS.ONDUTYSCREEN.name)}
                  borderRadius={10}
                  bg="#fff"
                  px={6}
                  _text={{ fontSize: 14, fontWeight: 'semibold', color: '#0B8E00' }}
                  style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#0B8E00' }}
                >
                  View
                </Button>
              </HStack>
            )}
          </HStack>
          {/* <HStack
            alignSelf="center"
            w="90%"
            bg="rgba(249, 184, 0, 0.13)"
            pl={3}
            pr={1}
            py={1}
            my={2}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            <HStack>
              <Text
                fontWeight="semibold"
                fontSize={20}
                pr={1}
                style={{
                  color: '#F9B800',
                }}
              >
                •
              </Text>
              <Text
                fontWeight="semibold"
                fontSize={12}
                py={1}
                style={{
                  color: '#000',
                }}
              >
                You got 10 days LOP
              </Text>
            </HStack>
            <Button bg="#0B8A00" borderRadius={10} _text={{ fontSize: 14, fontWeight: 'semibold' }}>
              Apply
            </Button>
          </HStack> */}
        </VStack>
        <TouchableOpacity onPress={() => setIsOpenNotification(!isOpenNotification)}>
          <HStack bg="#212121" justifyContent="center" alignItems="center">
            {/* <Text
              fontWeight="semibold"
              fontSize={14}
              py={1}
              style={{
                color: '#F9B800',
              }}
            >
              View
            </Text> */}
            <MaterialIcons
              name={isOpenNotification ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color="#F9B800"
            />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
}
OnDuty.propTypes = {
  refreshing: PropTypes.bool,
};
OnDuty.defaultProps = {
  refreshing: false,
};

function CompensatoryOff({ refreshing }) {
  const navigation = useNavigation();
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isApprovedAll, setIsApprovedAll] = useState(false);

  const [compOffData, setCompOffData] = useState([]);

  const { userData } = useSelector((st) => st.app);

  const approverId = userData?.id;

  const {
    data: compOff = [],
    isSuccess,
    refetch,
  } = useGetCompOffDataQuery(approverId, {
    skip: !approverId,
  });

  useEffect(() => {
    if (!refreshing) {
      return;
    }
    refetch();
  }, [refreshing, refetch]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setCompOffData(compOff?.filter((c) => c?.status === 'Waiting'));
  }, [isSuccess, compOff]);

  useEffect(() => {
    if (compOffData.length > 0) {
      return setIsApprovedAll(false);
    }
    return setIsApprovedAll(true);
  }, [compOffData]);

  return (
    <VStack w="100%">
      <VStack
        bg="#fff"
        w="90%"
        mt={6}
        mb={12}
        alignSelf="center"
        borderRadius={13}
        style={{
          borderColor: '#C2C2C2',
          borderWidth: 1,
          borderStyle: 'solid',
          elevation: 2,
          overflow: 'hidden',
        }}
      >
        <HStack justifyContent="space-between" px={4} py={3}>
          <HStack alignItems="center">
            <Box
              borderRadius={100}
              p={2}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                borderColor: 'rgba(33, 33, 33, 0.20)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <Image
                source={compOffIcon}
                style={{ width: '90%', height: '90%' }}
                alt="leave_icon"
              />
            </Box>
            <Text fontWeight="semibold" fontSize={16} pl={2} style={{ color: '#000' }}>
              Compensatory Off
            </Text>
          </HStack>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.COMPOFFSCREEN.name)}>
            <Box
              borderRadius={100}
              style={{
                height: 40,
                width: 40,
                overflow: 'hidden',
                backgroundColor: 'rgba(180, 180, 180, 0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Entypo name="chevron-thin-right" size={20} color="black" />
            </Box>
          </TouchableOpacity>
        </HStack>
        <VStack style={{ display: isOpenNotification ? 'flex' : 'none' }}>
          <HStack
            alignSelf="center"
            w="90%"
            bg={isApprovedAll ? '#fff' : 'rgba(249, 184, 0, 0.13)'}
            pl={3}
            pr={1}
            py={1}
            my={3}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: isApprovedAll ? '#0B8E00' : 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            {isApprovedAll ? (
              <HStack w="100%" py={1} justifyContent="center" alignItems="center">
                <MaterialCommunityIcons name="check-circle-outline" size={24} color="#0B8E00" />
                <Text
                  fontWeight="semibold"
                  fontSize={12}
                  pl={1}
                  style={{
                    color: '#0B8E00',
                  }}
                >
                  All Approvals completed
                </Text>
              </HStack>
            ) : (
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack>
                  <Text
                    fontWeight="semibold"
                    fontSize={20}
                    pr={1}
                    style={{
                      color: '#F9B800',
                    }}
                  >
                    •
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#212121',
                    }}
                  >
                    Approval pending list -
                  </Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={12}
                    py={1}
                    style={{
                      color: '#000',
                    }}
                  >
                    {' '}
                    {compOffData?.length || 0}
                  </Text>
                </HStack>
                <Button
                  onPress={() => navigation.navigate(SCREENS.COMPOFFSCREEN.name)}
                  bg="#fff"
                  borderRadius={10}
                  px={6}
                  _text={{ fontSize: 14, fontWeight: 'semibold', color: '#0B8E00' }}
                  style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#0B8E00' }}
                >
                  View
                </Button>
              </HStack>
            )}
          </HStack>
          {/* <HStack
            alignSelf="center"
            w="90%"
            bg="rgba(249, 184, 0, 0.13)"
            pl={3}
            pr={1}
            py={1}
            my={2}
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderColor: 'rgba(0, 108, 181, 0.10)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
            }}
          >
            <HStack>
              <Text
                fontWeight="semibold"
                fontSize={20}
                pr={1}
                style={{
                  color: '#F9B800',
                }}
              >
                •
              </Text>
              <Text
                fontWeight="semibold"
                fontSize={12}
                py={1}
                style={{
                  color: '#000',
                }}
              >
                You got 10 days LOP
              </Text>
            </HStack>
            <Button bg="#0B8A00" borderRadius={10} _text={{ fontSize: 14, fontWeight: 'semibold' }}>
              Apply
            </Button>
          </HStack> */}
        </VStack>
        <TouchableOpacity onPress={() => setIsOpenNotification(!isOpenNotification)}>
          <HStack bg="#212121" justifyContent="center" alignItems="center">
            {/* <Text
              fontWeight="semibold"
              fontSize={14}
              py={1}
              style={{
                color: '#F9B800',
              }}
            >
              View
            </Text> */}
            <MaterialIcons
              name={isOpenNotification ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color="#F9B800"
            />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
}
CompensatoryOff.propTypes = {
  refreshing: PropTypes.bool,
};
CompensatoryOff.defaultProps = {
  refreshing: false,
};
