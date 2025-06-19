import React from "react";
import { Box, Text } from "zmp-ui";

const UserInfo = ({ userData }) => {
  const getDisplayName = () => {
    if (!userData) return "Người dùng";
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (userData.firstName) {
      return userData.firstName;
    }
    if (userData.username) {
      return userData.username;
    }
    return "Người dùng";
  };

  return (
    <Box className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 text-white mt-16">
      <Box className="flex items-center">
        {userData?.avatarUrl && (
          <Box className="w-12 h-12 mr-3 rounded-full overflow-hidden border-2 border-white/30">
            <img
              src={userData.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Box>
        )}

        <Box className="flex-1">
          <Text className="text-xl font-bold mb-1">
            {`Xin chào, ${getDisplayName()}! 👋`}
          </Text>
          <Text className="text-blue-100 text-sm">
            Chào mừng bạn trở lại với ứng dụng
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
