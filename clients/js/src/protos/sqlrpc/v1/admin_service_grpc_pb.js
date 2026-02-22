// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var sqlrpc_v1_admin_service_pb = require('../../sqlrpc/v1/admin_service_pb.js');
var buf_validate_validate_pb = require('../../buf/validate/validate_pb.js');
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var sqlrpc_v1_enums_pb = require('../../sqlrpc/v1/enums_pb.js');
var sqlrpc_v1_types_pb = require('../../sqlrpc/v1/types_pb.js');

function serialize_sqlrpc_v1_CreateAPIKeyRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.CreateAPIKeyRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.CreateAPIKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CreateAPIKeyRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.CreateAPIKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CreateAPIKeyResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.CreateAPIKeyResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.CreateAPIKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CreateAPIKeyResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.CreateAPIKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CreateDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.CreateDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.CreateDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CreateDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.CreateDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CreateDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.CreateDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.CreateDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CreateDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.CreateDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CreateUserRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.CreateUserRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.CreateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CreateUserRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.CreateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_CreateUserResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.CreateUserResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.CreateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_CreateUserResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.CreateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DeleteAPIKeyRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.DeleteAPIKeyRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.DeleteAPIKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DeleteAPIKeyRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.DeleteAPIKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DeleteAPIKeyResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.DeleteAPIKeyResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.DeleteAPIKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DeleteAPIKeyResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.DeleteAPIKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DeleteDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.DeleteDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.DeleteDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DeleteDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.DeleteDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DeleteDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.DeleteDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.DeleteDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DeleteDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.DeleteDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DeleteUserRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.DeleteUserRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.DeleteUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DeleteUserRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.DeleteUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_DeleteUserResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.DeleteUserResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.DeleteUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_DeleteUserResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.DeleteUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_GetServerInfoRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.GetServerInfoRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.GetServerInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_GetServerInfoRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.GetServerInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListAPIKeysRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ListAPIKeysRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListAPIKeysRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListAPIKeysRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ListAPIKeysRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListAPIKeysResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ListAPIKeysResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListAPIKeysResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListAPIKeysResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ListAPIKeysResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListDatabasesRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ListDatabasesRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListDatabasesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListDatabasesRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ListDatabasesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListDatabasesResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ListDatabasesResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListDatabasesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListDatabasesResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ListDatabasesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListUsersRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ListUsersRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListUsersRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ListUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ListUsersResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ListUsersResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.ListUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ListUsersResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ListUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_LoginRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.LoginRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_LoginRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_LoginResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.LoginResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_LoginResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_LogoutRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.LogoutRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.LogoutRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_LogoutRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.LogoutRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_LogoutResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.LogoutResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.LogoutResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_LogoutResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.LogoutResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_MountDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.MountDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.MountDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_MountDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.MountDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_MountDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.MountDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.MountDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_MountDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.MountDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_ServerInfo(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.ServerInfo)) {
    throw new Error('Expected argument of type sqlrpc.v1.ServerInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_ServerInfo(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.ServerInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UnMountDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UnMountDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.UnMountDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UnMountDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UnMountDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UnMountDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UnMountDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.UnMountDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UnMountDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UnMountDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UpdateDatabaseRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UpdateDatabaseRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.UpdateDatabaseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UpdateDatabaseRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UpdateDatabaseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UpdateDatabaseResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UpdateDatabaseResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.UpdateDatabaseResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UpdateDatabaseResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UpdateDatabaseResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UpdatePasswordRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UpdatePasswordRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.UpdatePasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UpdatePasswordRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UpdatePasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UpdatePasswordResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UpdatePasswordResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.UpdatePasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UpdatePasswordResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UpdatePasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UpdateUserRoleRequest(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UpdateUserRoleRequest)) {
    throw new Error('Expected argument of type sqlrpc.v1.UpdateUserRoleRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UpdateUserRoleRequest(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UpdateUserRoleRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqlrpc_v1_UpdateUserRoleResponse(arg) {
  if (!(arg instanceof sqlrpc_v1_admin_service_pb.UpdateUserRoleResponse)) {
    throw new Error('Expected argument of type sqlrpc.v1.UpdateUserRoleResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqlrpc_v1_UpdateUserRoleResponse(buffer_arg) {
  return sqlrpc_v1_admin_service_pb.UpdateUserRoleResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// =============================================================================
// ADMIN SERVICE DEFINITION
// =============================================================================
//
// *
// AdminService provides the control plane for the platform.
// It manages the lifecycle of tenant databases, user identities, and API keys.
var AdminServiceService = exports.AdminServiceService = {
  // *
// User Management: List.
// Returns all system users and their assigned roles.
listUsers: {
    path: '/sqlrpc.v1.AdminService/ListUsers',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.ListUsersRequest,
    responseType: sqlrpc_v1_admin_service_pb.ListUsersResponse,
    requestSerialize: serialize_sqlrpc_v1_ListUsersRequest,
    requestDeserialize: deserialize_sqlrpc_v1_ListUsersRequest,
    responseSerialize: serialize_sqlrpc_v1_ListUsersResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ListUsersResponse,
  },
  // *
// User Management: Create.
// Provisions a new user identity in the platform.
createUser: {
    path: '/sqlrpc.v1.AdminService/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.CreateUserRequest,
    responseType: sqlrpc_v1_admin_service_pb.CreateUserResponse,
    requestSerialize: serialize_sqlrpc_v1_CreateUserRequest,
    requestDeserialize: deserialize_sqlrpc_v1_CreateUserRequest,
    responseSerialize: serialize_sqlrpc_v1_CreateUserResponse,
    responseDeserialize: deserialize_sqlrpc_v1_CreateUserResponse,
  },
  // *
// User Management: Update Role.
// Modifies the RBAC tier for an existing user.
updateUserRole: {
    path: '/sqlrpc.v1.AdminService/UpdateUserRole',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.UpdateUserRoleRequest,
    responseType: sqlrpc_v1_admin_service_pb.UpdateUserRoleResponse,
    requestSerialize: serialize_sqlrpc_v1_UpdateUserRoleRequest,
    requestDeserialize: deserialize_sqlrpc_v1_UpdateUserRoleRequest,
    responseSerialize: serialize_sqlrpc_v1_UpdateUserRoleResponse,
    responseDeserialize: deserialize_sqlrpc_v1_UpdateUserRoleResponse,
  },
  // *
// User Management: Delete.
// Permanently removes a user and invalidates all their associated API keys.
deleteUser: {
    path: '/sqlrpc.v1.AdminService/DeleteUser',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.DeleteUserRequest,
    responseType: sqlrpc_v1_admin_service_pb.DeleteUserResponse,
    requestSerialize: serialize_sqlrpc_v1_DeleteUserRequest,
    requestDeserialize: deserialize_sqlrpc_v1_DeleteUserRequest,
    responseSerialize: serialize_sqlrpc_v1_DeleteUserResponse,
    responseDeserialize: deserialize_sqlrpc_v1_DeleteUserResponse,
  },
  // --- API Key Management ---
//
// *
// API Key Management: List.
// Returns all active API keys for a specific user.
listAPIKeys: {
    path: '/sqlrpc.v1.AdminService/ListAPIKeys',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.ListAPIKeysRequest,
    responseType: sqlrpc_v1_admin_service_pb.ListAPIKeysResponse,
    requestSerialize: serialize_sqlrpc_v1_ListAPIKeysRequest,
    requestDeserialize: deserialize_sqlrpc_v1_ListAPIKeysRequest,
    responseSerialize: serialize_sqlrpc_v1_ListAPIKeysResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ListAPIKeysResponse,
  },
  // *
// API Key Management: Create.
// Provisions a new secure API key for authentication.
createAPIKey: {
    path: '/sqlrpc.v1.AdminService/CreateAPIKey',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.CreateAPIKeyRequest,
    responseType: sqlrpc_v1_admin_service_pb.CreateAPIKeyResponse,
    requestSerialize: serialize_sqlrpc_v1_CreateAPIKeyRequest,
    requestDeserialize: deserialize_sqlrpc_v1_CreateAPIKeyRequest,
    responseSerialize: serialize_sqlrpc_v1_CreateAPIKeyResponse,
    responseDeserialize: deserialize_sqlrpc_v1_CreateAPIKeyResponse,
  },
  // *
// API Key Management: Delete.
// Revokes a specific API key immediately.
deleteAPIKey: {
    path: '/sqlrpc.v1.AdminService/DeleteAPIKey',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.DeleteAPIKeyRequest,
    responseType: sqlrpc_v1_admin_service_pb.DeleteAPIKeyResponse,
    requestSerialize: serialize_sqlrpc_v1_DeleteAPIKeyRequest,
    requestDeserialize: deserialize_sqlrpc_v1_DeleteAPIKeyRequest,
    responseSerialize: serialize_sqlrpc_v1_DeleteAPIKeyResponse,
    responseDeserialize: deserialize_sqlrpc_v1_DeleteAPIKeyResponse,
  },
  // --- Database Control Plane ---
//
// *
// Database Lifecycle: List.
// Returns all managed tenant databases in the platform.
listDatabases: {
    path: '/sqlrpc.v1.AdminService/ListDatabases',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.ListDatabasesRequest,
    responseType: sqlrpc_v1_admin_service_pb.ListDatabasesResponse,
    requestSerialize: serialize_sqlrpc_v1_ListDatabasesRequest,
    requestDeserialize: deserialize_sqlrpc_v1_ListDatabasesRequest,
    responseSerialize: serialize_sqlrpc_v1_ListDatabasesResponse,
    responseDeserialize: deserialize_sqlrpc_v1_ListDatabasesResponse,
  },
  // *
// Database Lifecycle: Create.
// Provisions a new, isolated SQLite database for a tenant.
createDatabase: {
    path: '/sqlrpc.v1.AdminService/CreateDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.CreateDatabaseRequest,
    responseType: sqlrpc_v1_admin_service_pb.CreateDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_CreateDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_CreateDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_CreateDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_CreateDatabaseResponse,
  },
  // *
// Database Lifecycle: Update.
// Modifies non-destructive configuration for an existing tenant.
updateDatabase: {
    path: '/sqlrpc.v1.AdminService/UpdateDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.UpdateDatabaseRequest,
    responseType: sqlrpc_v1_admin_service_pb.UpdateDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_UpdateDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_UpdateDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_UpdateDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_UpdateDatabaseResponse,
  },
  // *
// Database Lifecycle: Delete.
// Permanently removes the database file and its tenant registration.
deleteDatabase: {
    path: '/sqlrpc.v1.AdminService/DeleteDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.DeleteDatabaseRequest,
    responseType: sqlrpc_v1_admin_service_pb.DeleteDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_DeleteDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_DeleteDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_DeleteDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_DeleteDatabaseResponse,
  },
  // *
// Database Lifecycle: Mount existing.
// Registers and attaches an existing SQLite file into the platform.
mountDatabase: {
    path: '/sqlrpc.v1.AdminService/MountDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.MountDatabaseRequest,
    responseType: sqlrpc_v1_admin_service_pb.MountDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_MountDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_MountDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_MountDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_MountDatabaseResponse,
  },
  // *
// Database Lifecycle: Unmount.
// Gently removes an active database from the platform without deleting the
// file.
unMountDatabase: {
    path: '/sqlrpc.v1.AdminService/UnMountDatabase',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.UnMountDatabaseRequest,
    responseType: sqlrpc_v1_admin_service_pb.UnMountDatabaseResponse,
    requestSerialize: serialize_sqlrpc_v1_UnMountDatabaseRequest,
    requestDeserialize: deserialize_sqlrpc_v1_UnMountDatabaseRequest,
    responseSerialize: serialize_sqlrpc_v1_UnMountDatabaseResponse,
    responseDeserialize: deserialize_sqlrpc_v1_UnMountDatabaseResponse,
  },
  // --- Platform Utilities ---
//
// *
// Platform Info.
// Returns global system metadata, versioning, and status.
getServerInfo: {
    path: '/sqlrpc.v1.AdminService/GetServerInfo',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.GetServerInfoRequest,
    responseType: sqlrpc_v1_admin_service_pb.ServerInfo,
    requestSerialize: serialize_sqlrpc_v1_GetServerInfoRequest,
    requestDeserialize: deserialize_sqlrpc_v1_GetServerInfoRequest,
    responseSerialize: serialize_sqlrpc_v1_ServerInfo,
    responseDeserialize: deserialize_sqlrpc_v1_ServerInfo,
  },
  // *
// Authentication: Login.
// Authenticates credentials and yields a session token/API key.
login: {
    path: '/sqlrpc.v1.AdminService/Login',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.LoginRequest,
    responseType: sqlrpc_v1_admin_service_pb.LoginResponse,
    requestSerialize: serialize_sqlrpc_v1_LoginRequest,
    requestDeserialize: deserialize_sqlrpc_v1_LoginRequest,
    responseSerialize: serialize_sqlrpc_v1_LoginResponse,
    responseDeserialize: deserialize_sqlrpc_v1_LoginResponse,
  },
  // *
// Authentication: Logout.
// Terminates the active session.
logout: {
    path: '/sqlrpc.v1.AdminService/Logout',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.LogoutRequest,
    responseType: sqlrpc_v1_admin_service_pb.LogoutResponse,
    requestSerialize: serialize_sqlrpc_v1_LogoutRequest,
    requestDeserialize: deserialize_sqlrpc_v1_LogoutRequest,
    responseSerialize: serialize_sqlrpc_v1_LogoutResponse,
    responseDeserialize: deserialize_sqlrpc_v1_LogoutResponse,
  },
  // *
// User Management: Update Password.
// Enables a user to modify their own credential or an admin to reset it.
updatePassword: {
    path: '/sqlrpc.v1.AdminService/UpdatePassword',
    requestStream: false,
    responseStream: false,
    requestType: sqlrpc_v1_admin_service_pb.UpdatePasswordRequest,
    responseType: sqlrpc_v1_admin_service_pb.UpdatePasswordResponse,
    requestSerialize: serialize_sqlrpc_v1_UpdatePasswordRequest,
    requestDeserialize: deserialize_sqlrpc_v1_UpdatePasswordRequest,
    responseSerialize: serialize_sqlrpc_v1_UpdatePasswordResponse,
    responseDeserialize: deserialize_sqlrpc_v1_UpdatePasswordResponse,
  },
};

exports.AdminServiceClient = grpc.makeGenericClientConstructor(AdminServiceService, 'AdminService');
// --- User & Role Management ---
