import React, { useState } from "react";
import { Box, Text, Button } from "zmp-ui";
import { Building2, ChevronRight, Search, MapPin, Home } from "lucide-react";
import { useNavigate } from "zmp-ui";

const BuildingSelector = ({ buildings }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Box className="max-w-md mx-auto px-4">
        {/* Header Section */}
        <Box className="text-center mb-8 pt-16">
          <Box className="relative inline-block mb-4">
            <Building2 size={48} className="text-blue-600 animate-bounce" />
          </Box>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Chọn tòa nhà của bạn
          </Text>
          <Text className="text-gray-600">
            Vui lòng chọn tòa nhà bạn đang sinh sống
          </Text>
        </Box>

        {/* Search Section */}
        <Box className="relative mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm tòa nhà..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </Box>

        {/* Buildings List */}
        <Box className="space-y-4">
          {filteredBuildings.map((building, index) => (
            <Box
              key={building.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-gray-100 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200"
              onClick={() => navigate("/login")}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <Box className="flex">
                <Box className="w-24 h-24 relative">
                  <img
                    src={building.image}
                    alt={building.name}
                    className="w-full h-full object-cover"
                  />
                  <Box className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
                </Box>
                <Box className="flex-1 p-4">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {building.name}
                  </Text>
                  <Box className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin size={14} className="mr-1" />
                    <Text className="line-clamp-1">{building.address}</Text>
                  </Box>
                  <Text className="text-xs text-gray-500">
                    {building.totalApartments} căn hộ
                  </Text>
                </Box>
                <Box className="flex items-center px-4">
                  <ChevronRight
                    size={20}
                    className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Empty State */}
        {filteredBuildings.length === 0 && (
          <Box className="text-center py-12">
            <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </Box>
            <Text className="text-gray-600 font-medium mb-2">
              Không tìm thấy tòa nhà
            </Text>
            <Text className="text-gray-500 text-sm mb-4">
              Vui lòng thử lại với từ khóa khác
            </Text>
            <Button
              variant="text"
              className="text-blue-600 font-medium"
              onClick={() => setSearchQuery("")}
            >
              Xem tất cả tòa nhà
            </Button>
          </Box>
        )}

        {/* Contact Support */}
        <Box className="mt-8 text-center pb-8">
          <Text className="text-sm text-gray-500">
            Không tìm thấy tòa nhà của bạn?
          </Text>
          <Button
            variant="text"
            className="text-white-600 font-medium mt-2"
            onClick={() => navigate("/contact")}
          >
            Liên hệ hỗ trợ
          </Button>
        </Box>
      </Box>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default BuildingSelector;
