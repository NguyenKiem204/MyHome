import React from "react";
import { Box, Text } from "zmp-ui";
import {
  User,
  MessageSquare,
  FileText,
  Grid,
  Bell,
  Settings,
} from "lucide-react";

const FeatureCards = ({ navigate }) => {
  const featureCards = [
    {
      id: 1,
      title: "Tài khoản",
      icon: <User size={28} />,
      path: "/profile",
      color: "#3B82F6",
      bgColor: "#DBEAFE",
    },
    {
      id: 2,
      title: "Phản ánh",
      icon: <MessageSquare size={28} />,
      path: "/feedback",
      color: "#F59E0B",
      bgColor: "#FFFBEB",
    },
    {
      id: 3,
      title: "Blog",
      icon: <FileText size={28} />,
      path: "/blogs",
      color: "#10B981",
      bgColor: "#D1FAE5",
    },
    {
      id: 4,
      title: "Dịch vụ",
      icon: <Grid size={28} />,
      path: "/services",
      color: "#EF4444",
      bgColor: "#FEE2E2",
    },
    {
      id: 5,
      title: "Cài đặt",
      icon: <Settings size={28} />,
      path: "/settings",
      color: "#6366F1",
      bgColor: "#EEF2FF",
    },
    {
      id: 6,
      title: "Thông báo",
      icon: <Bell size={28} />,
      path: "/notifications",
      color: "#8B5CF6",
      bgColor: "#EDE9FE",
    },
  ];

  return (
    <Box className="mt-6">
      <Box className="flex items-center mb-4">
        <Grid className="mr-2 text-gray-700" size={20} />
        <Text className="text-lg font-semibold text-gray-800">
          Tính năng chính
        </Text>
      </Box>

      <Box className="grid grid-cols-2 gap-4">
        {featureCards.map((feature) => (
          <Box
            key={feature.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            style={{
              backgroundColor: feature.bgColor,
              borderColor: feature.color + "20",
            }}
            onClick={() => navigate(feature.path)}
          >
            <Box className="flex flex-col items-center text-center">
              <Box className="mb-3" style={{ color: feature.color }}>
                {feature.icon}
              </Box>
              <Text className="text-sm font-medium text-gray-700">
                {feature.title}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeatureCards;
