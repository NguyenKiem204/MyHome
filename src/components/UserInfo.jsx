import React from "react";
import { Box, Text } from "zmp-ui";

const UserInfo = ({ userData }) => {
  if (!userData) return null;
  const displayName =
    userData.name && userData.name.trim() !== "" ? userData.name : "Người dùng";
  const avatarUrl =
    userData.avatar && userData.avatar.trim() !== ""
      ? userData.avatar
      : "/src/static/favicon.png";
  return (
    <Box className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 text-white mt-16">
      <Box className="flex items-center">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-12 h-12 mr-3 rounded-full object-cover bg-white/20"
        />
        <Box className="flex-1">
          <Text className="text-lg font-semibold">{displayName}</Text>
          <Text className="text-sm opacity-80">
            {userData.phoneNumber || ""}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
