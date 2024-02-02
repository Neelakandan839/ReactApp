import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import base64 from 'base-64';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://erp.alliancein.com/allianceerp',
    prepareHeaders: async (headers, { getState }) => {
      const state = getState();

      let basicAuth;
      if (headers.map.authorization) {
        basicAuth = headers?.map?.authorization;
      } else {
        basicAuth = `Basic ${base64.encode(
          `${state?.app?.userContext?.employeeId}:${state?.app?.userContext?.password}`,
        )}`;
      }

      headers.set('Authorization', `${basicAuth}`);

      // headers.set(
      //   'Authorization',
      //   `Basic ${base64.encode(
      //     `${state?.app?.userContext?.employeeId}:${state?.app?.userContext?.password}`,
      //   )}`,
      // );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getEmployeeData: builder.query({
      // query: ({ employeeId }) => ({
      //   url: `/org.openbravo.service.json.jsonrest/SHR_Employee?_where=employeeId='${employeeId}'`,
      // }), 
      query({ employeeId, password }) {
        return {
          url: `/org.openbravo.service.json.jsonrest/SHR_Employee?_where=employeeId='${employeeId}'`,
          headers: {
            Authorization: `Basic ${base64.encode(`${employeeId}:${password}`)}`,
          },
        };
      },
      transformResponse: (res) => res.response.data,
    }),
    getADUserData: builder.query({
      query: ({ employeeId }) => ({
        url: `/org.openbravo.service.json.jsonrest/ADUser?_where=username='${employeeId}'`,
      }),
      transformResponse: (res) => res.response.data,
    }),
    getLeaveData: builder.query({
      query: (params) => ({
        url: `/org.openbravo.service.json.jsonrest/SHR_Leave?_where=leaveStatus='Pending' and leaveFromDate>='${params.fromDate}' and leaveFromDate<='${params.toDate}' and sHRHead='${params.approverId}'`,
      }),
      transformResponse: (res) => res.response.data,
    }),
    getPermissionData: builder.query({
      query: (approverId) => ({
        url: `/org.openbravo.service.json.jsonrest/shr_permission_v?_where=perstatus='WFMA' and sHREmployee='${approverId}'`,
      }),
      transformResponse: (res) => res.response.data,
    }),
    getOnDutyData: builder.query({
      query: (approverId) => ({
        url: `/org.openbravo.service.json.jsonrest/shr_onduty_v?_where=ondutystatus in ('PFHA','PFMA') and user='${approverId}'`,
      }),
      transformResponse: (res) => res.response.data,
    }),
    getRegularizationData: builder.query({
      query: (approverId) => ({
        url: `/org.openbravo.service.json.jsonrest/shr_regularization_v?_where=regstatus='WFMA' and sHREmployee='${approverId}'`,
      }),
      transformResponse: (res) => res.response.data,
    }),
    getCompOffData: builder.query({
      query: (approverId) => ({
        url: `/org.openbravo.service.json.jsonrest/shr_compoff_v?_where=status='Waiting' and sHREmployee='${approverId}'`,
      }),
      transformResponse: (res) => res.response.data,
    }),
    approveLeave: builder.mutation({
      query: (approvalData = {}) => ({
        url: '/ws/com.sysfore.humanresource.LeaveMobileApproval',
        method: 'POST',
        body: approvalData?.data,
      }),
      transformResponse: (res) => res.result,
      onQueryStarted: async (approvalData, { dispatch, queryFulfilled }) => {
        const params = approvalData?.params;
        const leavePatchResult = dispatch(
          apiSlice.util.updateQueryData('getLeaveData', params, (draft) => {
            if (!Array.isArray(draft)) {
              return;
            }
            approvalData?.data?.forEach((data) => {
              const leave = draft.find((user) => user.id === data.id);
              if (!leave) {
                return;
              }

              if (leave && data.action === 'approve') {
                leave.leaveStatus = 'Approved';
              } else {
                leave.leaveStatus = 'Rejected';
              }
            });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          leavePatchResult.undo();
        }
      },
    }),
    approvePermission: builder.mutation({
      query: (approvalData = {}) => ({
        url: '/ws/com.sysfore.humanresource.PermissionMobileApproval',
        method: 'POST',
        body: approvalData?.data,
      }),
      transformResponse: (res) => res.result,
      onQueryStarted: async (approvalData, { dispatch, queryFulfilled }) => {
        const approverId = approvalData?.approverId;

        const permissionPatchResult = dispatch(
          apiSlice.util.updateQueryData('getPermissionData', approverId, (draft) => {
            if (!Array.isArray(draft)) {
              return;
            }
            approvalData?.data?.forEach((data) => {
              const permission = draft.find((user) => user.id === data.id);

              if (!permission) {
                return;
              }

              if (permission && data.action === 'approve') {
                permission.perstatus = 'Approved';
              } else {
                permission.perstatus = 'Rejected';
              }
            });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          permissionPatchResult.undo();
        }
      },
    }),
    approveRegularization: builder.mutation({
      query: (approvalData = {}) => ({
        url: '/ws/com.sysfore.humanresource.RegularizationMobileApproval',
        method: 'POST',
        body: approvalData?.data,
      }),
      transformResponse: (res) => res.result,
      onQueryStarted: async (approvalData, { dispatch, queryFulfilled }) => {
        const approverId = approvalData?.approverId;

        const regularizationPatchResult = dispatch(
          apiSlice.util.updateQueryData('getRegularizationData', approverId, (draft) => {
            if (!Array.isArray(draft)) {
              return;
            }
            approvalData?.data?.forEach((data) => {
              const regularization = draft.find((user) => user.id === data.id);

              if (!regularization) {
                return;
              }

              if (regularization && data.action === 'approve') {
                regularization.regstatus = 'Approved';
              } else {
                regularization.regstatus = 'Rejected';
              }
            });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          regularizationPatchResult.undo();
        }
      },
    }),
    approveOnDuty: builder.mutation({
      query: (approvalData = {}) => ({
        url: '/ws/com.sysfore.humanresource.OnDutyMobileApproval',
        method: 'POST',
        body: approvalData?.data,
      }),
      transformResponse: (res) => res.result,
      onQueryStarted: async (approvalData, { dispatch, queryFulfilled }) => {
        const approverId = approvalData?.approverId;

        const onDutyPatchResult = dispatch(
          apiSlice.util.updateQueryData('getOnDutyData', approverId, (draft) => {
            if (!Array.isArray(draft)) {
              return;
            }
            approvalData?.data?.forEach((data) => {
              const onDuty = draft.find((user) => user.id === data.id);
              if (!onDuty) {
                return;
              }

              if (onDuty && data.action === 'approve') {
                onDuty.ondutystatus = 'Approved';
              } else {
                onDuty.ondutystatus = 'Rejected';
              }
            });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          onDutyPatchResult.undo();
        }
      },
    }),
    approveCompensatoryOff: builder.mutation({
      query: (approvalData = {}) => ({
        url: '/ws/com.sysfore.humanresource.CompoffMobileApproval',
        method: 'POST',
        body: approvalData?.data,
      }),
      transformResponse: (res) => res.result,
      onQueryStarted: async (approvalData, { dispatch, queryFulfilled }) => {
        const approverId = approvalData?.approverId;
        const compensatoryOffPatchResult = dispatch(
          apiSlice.util.updateQueryData('getCompOffData', approverId, (draft) => {
            if (!Array.isArray(draft)) {
              return;
            }
            approvalData?.data?.forEach((data) => {
              const compensatoryOff = draft.find((user) => user.id === data.id);

              if (!compensatoryOff) {
                return;
              }

              if (compensatoryOff && data.action === 'approve') {
                compensatoryOff.status = 'Approved';
              } else {
                compensatoryOff.status = 'Rejected';
              }
            });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          compensatoryOffPatchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetLeaveDataQuery,
  useGetCompOffDataQuery,
  useGetOnDutyDataQuery,
  useGetPermissionDataQuery,
  useGetRegularizationDataQuery,
  useApproveLeaveMutation,
  useApproveCompensatoryOffMutation,
  useApproveOnDutyMutation,
  useApprovePermissionMutation,
  useApproveRegularizationMutation,
  useGetEmployeeDataQuery,
  useGetADUserDataQuery,
} = apiSlice;
