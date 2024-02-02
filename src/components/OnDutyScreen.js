import React, { useState, useEffect, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  HStack,
  VStack,
  Checkbox,
  Box,
  Menu,
  Pressable,
  Radio,
  Modal,
  Center,
  TextArea,
  Button,
  Input,
  Spinner,
  useToast,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather, AntDesign, Entypo } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { setUserFilter, unsetUserFilter, setUserSearch, unsetUserSearch } from '../reduxSlices/app';
import { SCREENS, APPROVAL_ACTIONS } from '../appConstants';
import {
  useGetOnDutyDataQuery,
  useApproveOnDutyMutation,
  useGetADUserDataQuery,
} from '../reduxSlices/apiSlice';

function OnDutyCard({
  item,
  setShowRejectPopup,
  approveOnDuty,
  isSelected,
  setSelectedData,
  approverId,
}) {
  const lastItemId = useRef(item?.id);
  if (item.id !== lastItemId.current) {
    lastItemId.current = item?.id;
  }

  const [showMore, setShowMore] = useState([]);
  const toast = useToast();
  const selectData = (id) => {
    // console.log(`vvvvvvvvvvvvvvv   ${id}`);
    setSelectedData((prevSelectedData) => {
      if (prevSelectedData.includes(id)) {
        const arr = prevSelectedData?.filter((el) => el !== id);
        return [...arr];
      }
      return [...prevSelectedData, id];
    });
  };

  const durationTimeFormat = (time) => {
    const splittedTime = time?.split('T');

    const finalTime = splittedTime?.[1]?.split(':');

    return `${finalTime?.[0]}:${finalTime?.[1]}`;
  };

  const dateFormat = (d) => {
    const splitedDate = d?.split('/');
    const date = new Date(`${splitedDate?.[2]}-${splitedDate?.[1]}-${splitedDate?.[0]}`)
      .toString()
      .split(' ');

    return `${date?.[2]} ${date?.[1]}`;
  };

  const punchTimeFormat = (time) => {
    if (!time) {
      return '00:00';
    }
    const splittedTime = time?.split('T');

    const finalTime = splittedTime?.[1]?.split(':');

    return `${finalTime?.[0]}:${finalTime?.[1]}`;
  };
  return (
    <VStack m={8} p={4} mx={6} my={2} bgColor="#fff" borderRadius="18px">
      <HStack py={2}>
        <Checkbox
          value={item?.id}
          onChange={() => {
            selectData(lastItemId?.current || '');
          }}
          isChecked={isSelected}
          accessibilityLabel="select od data"
          size="md"
          style={{
            backgroundColor: isSelected ? '#F9B800' : '#fff',
            borderRadius: 8,
            borderColor: '#000',
            borderWidth: 1,
          }}
        />
        <Text
          fontWeight="semibold"
          style={{
            fontSize: 14,
            color: '#000',
            opacity: isSelected ? 0.5 : 1,
          }}
          px={2}
        >
          {item?.employeename || ''}
        </Text>
      </HStack>
      <HStack style={{ opacity: isSelected ? 0.5 : 1 }}>
        <Text style={{ fontSize: 12, color: '#644A00' }}>({item?.ondutypurpose || ''})</Text>
      </HStack>
      <HStack py={2} alignItems="center" style={{ opacity: isSelected ? 0.5 : 1 }}>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={24}
          color="rgba(137, 98, 1, 1)"
          style={{
            backgroundColor: 'rgba(249, 184, 0, 0.15)',
            borderRadius: 100,
            padding: 6,
          }}
        />

        <Text pl={1} fontWeight="semibold" style={{ color: '#212121', fontSize: 14 }} mr={10}>
          {dateFormat(item?.ondutydate) || ''}
        </Text>

        <Entypo
          name="back-in-time"
          size={24}
          color="rgba(137, 98, 1, 1)"
          style={{
            backgroundColor: 'rgba(249, 184, 0, 0.15)',
            borderRadius: 100,
            padding: 6,
          }}
        />

        <Text pl={1} fontWeight="semibold" style={{ color: '#212121', fontSize: 14 }}>
          {`${durationTimeFormat(item?.ondutyfromtime)} - ${durationTimeFormat(
            item?.ondutytotime,
          )}`}
        </Text>
      </HStack>
      <HStack
        py={2}
        style={{
          display: showMore?.includes(item?.id) ? 'flex' : 'none',
          opacity: isSelected ? 0.5 : 1,
        }}
      >
        <Text style={{ color: '#757575', fontSize: 14 }}> Punch In : </Text>
        <Text fontWeight="semibold" style={{ color: '#212121', fontSize: 14 }} mr={5}>
          {punchTimeFormat(item?.punchpunchin) || ''}
        </Text>

        <Text style={{ color: '#757575', fontSize: 14 }}> Punch Out : </Text>
        <Text fontWeight="semibold" style={{ color: '#212121', fontSize: 14 }}>
          {punchTimeFormat(item?.punchpunchout) || ''}
        </Text>
      </HStack>
      <HStack
        py={2}
        style={{
          display: showMore?.includes(item?.id) ? 'flex' : 'none',
          opacity: isSelected ? 0.5 : 1,
        }}
      >
        <Text style={{ color: '#757575', fontSize: 14 }}> Location : </Text>
        <Text fontWeight="semibold" style={{ color: '#212121', fontSize: 14 }} mr={5}>
          {item?.ondutylocation || ''}
        </Text>
      </HStack>

      <HStack
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          opacity: isSelected ? 0.5 : 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (isSelected) {
              return;
            }
            setShowMore((c) => {
              if (c?.includes(item?.id)) {
                return c?.filter((ids) => ids !== item?.id);
              }
              c.push(item?.id);
              return [...c];
            });
          }}
        >
          <Text
            style={{
              color: '#B88700',
              display: 'flex',
              borderBottomWidth: 1,
              borderBottomColor: '#B88700',
              borderStyle: 'solid',
            }}
          >
            {showMore?.includes(item?.id) ? 'Less Details' : 'More Details'}
          </Text>
        </TouchableOpacity>
        <HStack py={2}>
          <Button
            onPress={() => {
              if (isSelected) {
                return;
              }
              setSelectedData([item?.id]);
              setShowRejectPopup(true);
            }}
            mr={2}
            h={10}
            color="#000"
            style={{ backgroundColor: '#D0D0D0', borderRadius: 10 }}
            _text={{ fontSize: 14, color: '#000' }}
          >
            Reject
          </Button>
          <Button
            onPress={() => {
              if (isSelected) {
                return;
              }
              const approvalData = {
                data: [
                  {
                    id: item?.id,
                    action: APPROVAL_ACTIONS?.APPROVE,
                    reason: '',
                  },
                ],
                approverId,
              };

              approveOnDuty(approvalData)
                .then(() => {
                  toast.show({
                    id: item?.id,
                    variant: 'solid',
                    description: 'Approved Successfully!',
                    isClosable: true,
                    placement: 'top',
                    duration: 1000,
                    style: {
                      backgroundColor: 'green',
                    },
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            h={10}
            _text={{ fontSize: 14 }}
            style={{ backgroundColor: '#0B8E00', borderRadius: 10 }}
          >
            Approve
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
OnDutyCard.propTypes = {
  item: PropTypes.object.isRequired,
  setShowRejectPopup: PropTypes.func.isRequired,
  approveOnDuty: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  approverId: PropTypes.string.isRequired,
};

const MemoizedOnDutyCard = memo(OnDutyCard);

function MyApprovals() {
  const { filter, search, userContext } = useSelector((st) => st.app);
  const [refreshing, setRefreshing] = useState(false);

  const { data: ADUserData = [] } = useGetADUserDataQuery({
    employeeId: userContext?.employeeId,
  });

  const approverId = ADUserData?.[0]?.id;
  const toast = useToast();
  const {
    data: onDuty = [],
    isSuccess,
    refetch,
  } = useGetOnDutyDataQuery(approverId, { skip: !approverId });

  const [selectedData, setSelectedData] = useState([]);

  const [isSelectAll, setIsSelectedAll] = useState(false);

  const [onDutyData, setOnDutyData] = useState('');

  const [showBtn, setShowBtn] = useState(false);

  const [showRejectPopup, setShowRejectPopup] = useState(false);

  const [isSelectAllLoading, setIsSelectAllLoading] = useState(false);

  const [approveOnDuty] = useApproveOnDutyMutation();

  const handleClickLoading = () => {
    setIsSelectAllLoading(true);
    setTimeout(() => {
      setIsSelectAllLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (!refreshing) {
      return;
    }
    refetch();
  }, [refreshing, refetch]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // const selectAll = (isChecked) => {
  //   setSelectedData([]);
  //   if (isChecked) {
  //     console.log(isChecked);
  //     console.log(onDutyData?.length);
  //     setSelectedData(() => {
  //       const ids = [];
  //       onDutyData?.map((data) => {
  //         return ids?.push(data?.id);
  //       });
  //       return ids;
  //     });
  //   } else if (!isChecked) {
  //     setSelectedData([]);
  //   }
  // };

  useEffect(() => {
    if (isSelectAll) {
      setSelectedData([]);
      return setSelectedData(() => {
        const ids = [];
        onDutyData?.map((data) => {
          return ids?.push(data?.id);
        });
        return ids;
      });
    }
    return setSelectedData([]);
  }, [isSelectAll, onDutyData]);

  useEffect(() => {
    if (selectedData.length > 0) {
      setShowBtn(true);
    } else {
      setShowBtn(false);
    }
  }, [selectedData]);

  const approveOnDuties = async (action, reason) => {
    const approvalData = {};
    approvalData.data = [];
    approvalData.approverId = approverId;
    selectedData?.map((item) => {
      approvalData?.data?.push({
        id: item,
        action,
        reason,
      });
      return approvalData;
    });

    try {
      await approveOnDuty(approvalData).unwrap();
      setShowRejectPopup(false);
      setSelectedData([]);
      setIsSelectedAll(false);
      toast.show({
        id: 'toast',
        variant: 'solid',
        description:
          action === APPROVAL_ACTIONS?.APPROVE
            ? 'Approved Successfully!'
            : 'Rejected Successfully!',
        isClosable: true,
        placement: 'top',
        duration: 1000,
        style: {
          backgroundColor: action === APPROVAL_ACTIONS?.APPROVE ? 'green' : 'grey',
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isSuccess || onDuty.length === 0) {
      return;
    }
    setOnDutyData(onDuty?.filter((o) => o?.ondutystatus === 'PFMA' || o?.ondutystatus === 'PFHA'));
  }, [isSuccess, onDuty]);

  useEffect(() => {
    setOnDutyData((l) => {
      const filteredData = [...l];

      if (filter === 'name') {
        filteredData?.sort((a, b) => a?.employeename?.localeCompare(b?.employeename));
      } else if (filter === 'newest') {
        filteredData?.sort(
          (a, b) =>
            new Date(
              `${b?.ondutydate?.split('/')?.[2]}-${b?.ondutydate?.split('/')?.[1]}-${b?.ondutydate?.split('/')?.[0]
              }`,
            ) -
            new Date(
              `${a?.ondutydate?.split('/')?.[2]}-${a?.ondutydate?.split('/')?.[1]}-${a?.ondutydate?.split('/')?.[0]
              }`,
            ),
        );
      } else if (filter === 'oldest') {
        filteredData?.sort(
          (a, b) =>
            new Date(
              `${a?.ondutydate?.split('/')?.[2]}-${a?.ondutydate?.split('/')?.[1]}-${a?.ondutydate?.split('/')?.[0]
              }`,
            ) -
            new Date(
              `${b?.ondutydate?.split('/')?.[2]}-${b?.ondutydate?.split('/')?.[1]}-${b?.ondutydate?.split('/')?.[0]
              }`,
            ),
        );
      }
      return filteredData;
    });
  }, [filter]);

  useEffect(() => {
    if (onDuty.length === 0) {
      return;
    }

    if (search.length === 0) {
      setOnDutyData(
        onDuty?.filter((o) => o?.ondutystatus === 'PFMA' || o?.ondutystatus === 'PFHA'),
      );
    }
    setOnDutyData(() => {
      const data = onDuty?.filter((o) => o?.ondutystatus === 'PFMA' || o?.ondutystatus === 'PFHA');

      const searchLowerCase = search.toLowerCase();

      const filteredData = (data || []).filter((f) => {
        const identifier = f?.employeename?.toLowerCase();
        if (searchLowerCase.length === 1) {
          return identifier.startsWith(searchLowerCase);
        }
        return identifier.includes(searchLowerCase);
      });
      return filteredData;
    });
  }, [search, onDuty]);

  return (
    <View>
      {onDutyData?.length === 0 ? (
        <ApprovalScreen />
      ) : (
        <View w="100%" h="100%" pb={3}>
          {isSelectAllLoading ? (
            <Spinner mx={6} my={4} alignSelf="flex-start" color="#F9B800" />
          ) : (
            <HStack mx={6} my={4} justifyContent="space-between" alignItems="center">
              <Checkbox
                value="selectAll"
                onChange={(isChecked) => {
                  setIsSelectedAll(isChecked);
                  handleClickLoading();
                }}
                accessibilityLabel="select all od"
                isChecked={onDutyData?.length === selectedData?.length && onDutyData?.length > 0}
                style={{
                  backgroundColor:
                    onDutyData?.length === selectedData?.length && onDutyData?.length > 0
                      ? '#000'
                      : '#fff',
                  borderColor:
                    onDutyData?.length === selectedData?.length && onDutyData?.length > 0
                      ? '#fff'
                      : '#000',
                  borderWidth: 1,
                  fontWeight: 'semibold',
                }}
              >
                Select All
              </Checkbox>

              <HStack display={showBtn ? 'flex' : 'none'}>
                <Button
                  onPress={() => setShowRejectPopup(true)}
                  bg="#FFF"
                  borderRadius={10}
                  mx={3}
                  _text={{ color: '#212121', fontWeight: 'semibold' }}
                  style={{
                    borderColor: '#212121',
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    height: 41,
                  }}
                >
                  Reject
                </Button>
                <RejectScreen
                  approveOnDuties={approveOnDuties}
                  showRejectPopup={showRejectPopup}
                  setShowRejectPopup={setShowRejectPopup}
                  setSelectedData={setSelectedData}
                />
                <Button
                  onPress={() => approveOnDuties(APPROVAL_ACTIONS?.APPROVE, '')}
                  bg="#000"
                  borderRadius={10}
                  _text={{ color: '#FFF', fontWeight: 'semibold' }}
                  style={{
                    borderColor: '#212121',
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    height: 41,
                  }}
                >
                  Approve
                </Button>
              </HStack>
            </HStack>
          )}
          <FlashList
            data={onDutyData}
            estimatedItemSize={200}
            renderItem={({ item }) => {
              const isSelected = selectedData?.includes?.(item?.id);
              return (
                <MemoizedOnDutyCard
                  item={item}
                  isSelected={isSelected}
                  setSelectedData={setSelectedData}
                  approveOnDuty={approveOnDuty}
                  setShowRejectPopup={setShowRejectPopup}
                  approverId={approverId}
                />
              );
            }}
            extraData={selectedData}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        </View>
      )}
    </View>
  );
}

function MyRequest() {
  return (
    <View w="100%" mt="40%">
      <VStack
        py={16}
        justifyContent="center"
        bg="#fff"
        alignSelf="center"
        style={{ width: '60%' }}
        borderRadius="22px"
      >
        <Text color="#000" textAlign="center" fontSize={14}>
          Coming soon...
        </Text>
      </VStack>
    </View>
  );
}

export default function OnDutyScreen() {
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();

  const [onDutyData, setOnDutyData] = useState([]);
  const [filter, setFilter] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const { userContext } = useSelector((st) => st.app);
  const { data: ADUserData = [] } = useGetADUserDataQuery({
    employeeId: userContext?.employeeId,
  });

  const approverId = ADUserData?.[0]?.id;

  const { data: onDuty = [], isSuccess } = useGetOnDutyDataQuery(approverId, { skip: !approverId });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setOnDutyData(onDuty?.filter((o) => o?.ondutystatus === 'PFMA' || o?.ondutystatus === 'PFHA'));
  }, [isSuccess, onDuty]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserFilter(filter));
  }, [filter, dispatch]);
  return (
    <View h="100%">
      <VStack
        px={5}
        pt={16}
        pb={4}
        bg="#F9B800"
        style={{
          height: '15%',
        }}
      >
        {isSearchEnabled ? (
          <HStack alignItems="center">
            <TouchableOpacity
              onPress={() => {
                setIsSearchEnabled(false);
                dispatch(unsetUserSearch());
              }}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Input
              w="100%"
              color="#303030"
              _light={{ fontSize: 16 }}
              variant="unstyled"
              placeholder="  Search.."
              onChangeText={(text) => {
                dispatch(setUserSearch(text));
              }}
            />
          </HStack>
        ) : (
          <HStack justifyContent="space-between">
            <HStack alignItems="center">
              <TouchableOpacity
                onPress={() => {
                  dispatch(unsetUserFilter());
                  navigation.navigate(SCREENS.HOMESCREEN.name);
                }}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
              </TouchableOpacity>

              <Text px={3} fontWeight="semibold" style={{ fontSize: 16, color: '#212121' }}>
                On Duty
              </Text>
              <HStack
                py={1}
                px={2}
                display={onDutyData?.length === 0 ? 'none' : 'flex'}
                justifyContent="center"
                alignItems="center"
                bg="rgba(100, 74, 0, 0.75)"
                style={{ borderRadius: 9 }}
              >
                <Entypo name="dot-single" size={25} color="#F9B800" />
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 14,
                  }}
                >
                  {onDutyData?.length || 0} Pending
                </Text>
              </HStack>
            </HStack>
            <HStack>
              <TouchableOpacity onPress={() => setIsSearchEnabled(true)}>
                <Feather style={{ paddingHorizontal: 15 }} name="search" size={24} color="black" />
              </TouchableOpacity>
              <Box alignItems="center">
                <Menu
                  w="150"
                  py={2}
                  borderRadius={17}
                  trigger={(triggerProps) => {
                    return (
                      <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <AntDesign name="filter" size={24} color="black" />
                      </Pressable>
                    );
                  }}
                >
                  <Menu.Item px={0}>
                    <HStack
                      pb={2}
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottomWidth={1}
                      borderStyle="solid"
                      borderColor="#896201"
                    >
                      <Text style={{ color: '#000' }}> Sort </Text>

                      <MaterialCommunityIcons name="window-close" size={24} color="black" />
                    </HStack>
                  </Menu.Item>
                  <Menu.Item px={0} py={1} onPress={() => setFilter('name')}>
                    <HStack justifyContent="space-between" alignItems="center" w="100%">
                      <Text> Name </Text>
                      <Radio.Group
                        onChange={(nextValue) => {
                          setFilter(nextValue);
                        }}
                        name="myRadioGroup1"
                        accessibilityLabel="Name"
                        value={filter}
                      >
                        <Radio aria-label="Name" value="name" my={1} size="sm" />
                      </Radio.Group>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item px={0} py={1} onPress={() => setFilter('newest')}>
                    <HStack justifyContent="space-between" alignItems="center" w="100%">
                      <Text> Newest first </Text>
                      <Radio.Group
                        onChange={(nextValue) => {
                          setFilter(nextValue);
                        }}
                        value={filter}
                        name="myRadioGroup2"
                        accessibilityLabel="newestFirst"
                      >
                        <Radio aria-label="newestFirst" value="newest" my={1} size="sm" />
                      </Radio.Group>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item px={0} py={1} onPress={() => setFilter('oldest')}>
                    <HStack justifyContent="space-between" alignItems="center" w="100%">
                      <Text> Oldest first </Text>
                      <Radio.Group
                        onChange={(nextValue) => {
                          setFilter(nextValue);
                        }}
                        value={filter}
                        name="myRadioGroup3"
                        accessibilityLabel="oldestFirst"
                      >
                        <Radio aria-label="oldestFirst" value="oldest" my={1} size="sm" />
                      </Radio.Group>
                    </HStack>
                  </Menu.Item>
                </Menu>
              </Box>
            </HStack>
          </HStack>
        )}
      </VStack>
      <VStack
        style={{
          flex: 1,
          height: '85%',
        }}
      >
        <Tab.Navigator
          initialRouteName="My Approvals"
          screenOptions={{
            tabBarActiveTintColor: '#fff',
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: '#F9B800' },
            tabBarInactiveTintColor: '#614A00',
          }}
        >
          <Tab.Screen name="My Approvals" component={MyApprovals} />
          <Tab.Screen name="My Request" component={MyRequest} />
        </Tab.Navigator>
      </VStack>
    </View>
  );
}

function ApprovalScreen() {
  return (
    <View w="100%" pt="60%">
      <Text mt={6} color="#000" textAlign="center" fontSize={14}>
        No records found!
      </Text>
      {/* <VStack
        py={8}
        justifyContent="center"
        bg="#fff"
        alignSelf="center"
        style={{ width: '60%' }}
        borderRadius="22px"
      >
        <AntDesign name="checkcircleo" style={{ alignSelf: 'center' }} size={80} color="#0B8E00" />
        <Text mt={6} color="#0B8E00" textAlign="center" fontSize={14}>
          All OnDuties are approved
        </Text>
      </VStack> */}
    </View>
  );
}

function RejectScreen({ showRejectPopup, setShowRejectPopup, approveOnDuties, setSelectedData }) {
  const [rejectReason, setRejectReason] = useState('');
  return (
    <Center>
      <Modal isOpen={showRejectPopup} onClose={() => setShowRejectPopup(false)}>
        <Modal.Content maxWidth="400px" style={{ borderRadius: 23, height: 285, width: 312 }}>
          <VStack px={4} py={6}>
            <Text alignSelf="center" style={{ color: '#000', fontSize: 18, fontWeight: 600 }}>
              Reject the approval?
            </Text>
            <Text
              pt={6}
              pb={2}
              style={{
                color: '#757575',
                fontWeight: 500,
                fontSize: 14,
                alignSelf: 'flex-start',
              }}
            >
              Mention the reason
            </Text>

            <TextArea
              borderRadius={6}
              value={rejectReason}
              onChangeText={(text) => setRejectReason(text)}
              placeholder="Enter the description"
              w="100%"
            />

            <HStack py={6} w="100%" justifyContent="space-between">
              <Button
                onPress={() => {
                  setSelectedData([]);
                  setShowRejectPopup(false);
                  setRejectReason('');
                }}
                bg="#FFF"
                w="45%"
                _text={{ color: '#896201' }}
                borderRadius={14}
                borderWidth={1}
                borderStyle="solid"
                borderColor="#896201"
              >
                Cancel
              </Button>

              <Button
                onPress={() => {
                  approveOnDuties(APPROVAL_ACTIONS?.REJECT, rejectReason);
                  setSelectedData([]);
                  setRejectReason('');
                }}
                bg="#F9B800"
                _text={{ color: '#000' }}
                borderRadius={14}
                w="45%"
              >
                Submit
              </Button>
            </HStack>
          </VStack>
        </Modal.Content>
      </Modal>
    </Center>
  );
}
RejectScreen.propTypes = {
  showRejectPopup: PropTypes.bool.isRequired,
  setShowRejectPopup: PropTypes.func.isRequired,
  approveOnDuties: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
};
