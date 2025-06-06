// src/pages/BuildingServicesPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Tabs, Icon, Modal, Switch, Sheet } from "zmp-ui";
import {
  Car, ShoppingCart, Utensils, Wrench, Users, Shield,
  Check, X, CheckCircle, AlertTriangle, Info, Wifi,
  Dumbbell, Waves, Baby, Calendar, Package, Truck
} from "lucide-react";

const BuildingServicesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Danh sách dịch vụ tiện ích tòa nhà/chung cư
  const buildingServices = [
    {
      id: 1,
      name: "Dịch vụ đậu xe",
      description: "Đăng ký chỗ đậu xe cố định trong hầm/bãi đỗ xe của tòa nhà",
      icon: <Car size={28} />,
      color: "#4F46E5",
      category: "parking",
      isRegistered: true,
      price: "800.000đ/tháng",
      features: [
        "Chỗ đậu xe cố định",
        "An ninh 24/7",
        "Camera giám sát",
        "Thẻ từ ra vào tự động"
      ],
      userCount: "156",
      location: "Tầng B1-B2",
      operatingHours: "24/7"
    },
    {
      id: 2,
      name: "Dịch vụ giữ xe máy",
      description: "Khu vực giữ xe máy an toàn với bảo vệ và camera giám sát",
      icon: <Shield size={28} />,
      color: "#10B981",
      category: "parking",
      isRegistered: false,
      price: "200.000đ/tháng",
      features: [
        "Khu vực riêng biệt",
        "Bảo vệ 24/7",
        "Bảo hiểm xe máy",
        "Rửa xe miễn phí 2 lần/tháng"
      ],
      userCount: "324",
      location: "Tầng trệt",
      operatingHours: "5:00 - 23:00"
    },
    {
      id: 3,
      name: "Dịch vụ gym & fitness",
      description: "Phòng tập gym hiện đại với đầy đủ thiết bị và huấn luyện viên",
      icon: <Dumbbell size={28} />,
      color: "#F59E0B",
      category: "fitness",
      isRegistered: false,
      price: "500.000đ/tháng",
      features: [
        "Thiết bị gym hiện đại",
        "Huấn luyện viên cá nhân",
        "Lớp học nhóm",
        "Khăn tắm và nước uống miễn phí"
      ],
      userCount: "89",
      location: "Tầng 5",
      operatingHours: "5:00 - 22:00"
    },
    {
      id: 4,
      name: "Hồ bơi & spa",
      description: "Hồ bơi trong nhà với dịch vụ spa và massage thư giãn",
      icon: <Waves size={28} />,
      color: "#0EA5E9",
      category: "fitness",
      isRegistered: false,
      price: "1.200.000đ/tháng",
      features: [
        "Hồ bơi 4 mùa",
        "Jacuzzi và sauna",
        "Dịch vụ massage",
        "Khu vực thư giãn"
      ],
      userCount: "67",
      location: "Tầng 6",
      operatingHours: "6:00 - 22:00"
    },
    {
      id: 5,
      name: "Dịch vụ vệ sinh nhà",
      description: "Dịch vụ dọn dẹp, vệ sinh căn hộ định kỳ chuyên nghiệp",
      icon: <Wrench size={28} />,
      color: "#8B5CF6",
      category: "cleaning",
      isRegistered: false,
      price: "300.000đ/lần",
      features: [
        "Đội ngũ chuyên nghiệp",
        "Dụng cụ và hóa chất chuyên dùng",
        "Linh hoạt lịch hẹn",
        "Bảo hiểm tài sản"
      ],
      userCount: "143",
      location: "Tại căn hộ",
      operatingHours: "8:00 - 18:00"
    },
    {
      id: 6,
      name: "Dịch vụ giặt ủi",
      description: "Giặt ủi quần áo chuyên nghiệp, giao nhận tận nơi",
      icon: <Package size={28} />,
      color: "#EC4899",
      category: "cleaning",
      isRegistered: false,
      price: "25.000đ/kg",
      features: [
        "Giặt khô và giặt ướt",
        "Giao nhận tận căn hộ",
        "Bảo quản quần áo cẩn thận",
        "Dịch vụ ủi chuyên nghiệp"
      ],
      userCount: "201",
      location: "Tầng 2",
      operatingHours: "7:00 - 19:00"
    },
    {
      id: 7,
      name: "Khu vui chơi trẻ em",
      description: "Khu vui chơi an toàn cho trẻ em với nhiều trò chơi hấp dẫn",
      icon: <Baby size={28} />,
      color: "#14B8A6",
      category: "entertainment",
      isRegistered: false,
      price: "100.000đ/lần",
      features: [
        "Khu vui chơi an toàn",
        "Nhân viên trông nom",
        "Đồ chơi đa dạng",
        "Không gian thoáng mát"
      ],
      userCount: "78",
      location: "Tầng 3",
      operatingHours: "8:00 - 20:00"
    },
    {
      id: 8,
      name: "Phòng họp & sự kiện",
      description: "Cho thuê phòng họp, tổ chức sự kiện với đầy đủ trang thiết bị",
      icon: <Users size={28} />,
      color: "#6366F1",
      category: "meeting",
      isRegistered: false,
      price: "500.000đ/4 giờ",
      features: [
        "Phòng họp hiện đại",
        "Máy chiếu và âm thanh",
        "WiFi tốc độ cao",
        "Dịch vụ trà coffee"
      ],
      userCount: "45",
      location: "Tầng 4",
      operatingHours: "8:00 - 22:00"
    },
    {
      id: 9,
      name: "Dịch vụ đặt đồ ăn",
      description: "Đặt đồ ăn từ các nhà hàng đối tác, giao tận căn hộ",
      icon: <Utensils size={28} />,
      color: "#F97316",
      category: "food",
      isRegistered: false,
      price: "Miễn phí giao hàng",
      features: [
        "Đa dạng nhà hàng đối tác",
        "Giao hàng miễn phí",
        "Đặt hàng qua app",
        "Khuyến mại thường xuyên"
      ],
      userCount: "267",
      location: "Giao tận cửa",
      operatingHours: "6:00 - 23:00"
    },
    {
      id: 10,
      name: "Siêu thị mini",
      description: "Cửa hàng tiện lợi trong tòa nhà với đầy đủ nhu yếu phẩm hàng ngày",
      icon: <ShoppingCart size={28} />,
      color: "#EF4444",
      category: "shopping",
      isRegistered: false,
      price: "Giá thị trường",
      features: [
        "Mở cửa 24/7",
        "Đa dạng sản phẩm",
        "Giá cả cạnh tranh",
        "Giao hàng tận căn hộ"
      ],
      userCount: "412",
      location: "Tầng trệt",
      operatingHours: "24/7"
    },
    {
      id: 11,
      name: "Dịch vụ sửa chữa",
      description: "Sửa chữa đồ điện, nước, điều hòa và các thiết bị trong nhà",
      icon: <Wrench size={28} />,
      color: "#84CC16",
      category: "maintenance",
      isRegistered: false,
      price: "Theo công việc",
      features: [
        "Thợ kỹ thuật chuyên nghiệp",
        "Phản hồi nhanh chóng",
        "Linh kiện chính hãng",
        "Bảo hành dịch vụ"
      ],
      userCount: "189",
      location: "Tại căn hộ",
      operatingHours: "8:00 - 18:00"
    },
    {
      id: 12,
      name: "Dịch vụ chuyển đồ",
      description: "Hỗ trợ chuyển đồ đạc, nội thất trong và ngoài tòa nhà",
      icon: <Truck size={28} />,
      color: "#A855F7",
      category: "moving",
      isRegistered: false,
      price: "200.000đ/giờ",
      features: [
        "Đội ngũ chuyên nghiệp",
        "Xe tải đầy đủ kích cỡ",
        "Bảo hiểm hàng hóa",
        "Dịch vụ đóng gói"
      ],
      userCount: "56",
      location: "Toàn tòa nhà",
      operatingHours: "8:00 - 17:00"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setServices(buildingServices);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRegisterService = (service) => {
    setCurrentService(service);
    if (service.price === "Miễn phí giao hàng" || service.price === "Giá thị trường") {
      handleConfirmRegister();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCancelService = (service) => {
    setCurrentService(service);
    setShowConfirmation(true);
  };

  const handleConfirmRegister = () => {
    setServices(
      services.map((service) =>
        service.id === currentService.id
          ? { ...service, isRegistered: !service.isRegistered }
          : service
      )
    );
    setShowConfirmation(false);
    setShowSuccess(true);
  };

  const openServiceDetail = (service) => {
    setCurrentService(service);
    setShowServiceDetail(true);
  };

  const filteredServices = services.filter((service) => {
    if (activeTab === "all") return true;
    if (activeTab === "registered") return service.isRegistered;
    if (activeTab === "free") return service.price.includes("Miễn phí") || service.price.includes("Giá thị trường");
    return service.category === activeTab;
  });

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Box className="px-4 pt-4 pb-2 bg-white">
        <Text.Title className="text-xl font-bold text-gray-800">Dịch vụ tiện ích</Text.Title>
      </Box>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="zmp-tabs-custom bg-white sticky top-0 z-10  mt-2"
      >
        <Tabs.Tab key="all" label="Tất cả" />
        <Tabs.Tab key="registered" label="Đã đăng ký" />
        <Tabs.Tab key="parking" label="Đỗ xe" />
        <Tabs.Tab key="fitness" label="Thể thao" />
        <Tabs.Tab key="cleaning" label="Vệ sinh" />
      </Tabs>

      {/* Services List */}
      <Box className="p-4 grid grid-cols-1 gap-3 mb-10">
        {loading ? (
          Array(4).fill().map((_, index) => (
            <Box key={index} className="animate-pulse bg-white rounded-lg p-4 flex items-center space-x-3">
              <Box className="h-12 w-12 rounded-full bg-gray-200"></Box>
              <Box className="flex-1 space-y-2">
                <Box className="h-4 bg-gray-200 rounded w-3/4"></Box>
                <Box className="h-3 bg-gray-200 rounded w-full"></Box>
              </Box>
            </Box>
          ))
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Box
              key={service.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              onClick={() => openServiceDetail(service)}
            >
              <Box className="p-4 flex items-start space-x-3">
                <Box className={`${service.color} p-3 rounded-lg flex-shrink-0`}>
                  {service.icon}
                </Box>
                <Box className="flex-1 min-w-0">
                  <Box className="flex justify-between items-start space-x-2">
                    <Text className="text-sm font-medium text-gray-800 truncate">{service.name}</Text>
                    <Text className="text-xs font-semibold text-blue-500 whitespace-nowrap">
                      {service.price}
                    </Text>
                  </Box>
                  <Text className="text-xs text-gray-500 mt-1">{service.description}</Text>
                  <Box className="mt-3 flex justify-between items-center">
                    <Text className="text-xs text-gray-500 flex items-center">
                      <Users size={12} className="mr-1" />
                      {service.userCount} người dùng
                    </Text>
                    {service.isRegistered ? (
                      <Button
                        variant="text"
                        size="small"
                        className="text-green-500 text-xs font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelService(service);
                        }}
                      >
                        <span className="flex items-center">
                          <CheckCircle size={14} className="mr-1" />
                          Đã đăng ký
                        </span>
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterService(service);
                        }}
                      >
                        Đăng ký
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Box className="flex flex-col items-center justify-center py-10">
            <Text className="text-gray-500">Không có dịch vụ nào phù hợp</Text>
          </Box>
        )}
      </Box>

      {/* Service Detail Sheet */}
      <Sheet
        visible={showServiceDetail}
        onClose={() => setShowServiceDetail(false)}
        className="zmp-sheet-custom"
      >
        {currentService && (
          <Box className="pb-8">
            {/* Header */}
            <Box className={`${currentService.color} p-6 text-white`}>
              <Box className="flex items-center space-x-4">
                <Box className="p-3 bg-white bg-opacity-20 rounded-lg">
                  {currentService.icon}
                </Box>
                <Box>
                  <Text className="text-xl font-bold">{currentService.name}</Text>
                  <Text className="text-white text-opacity-90">{currentService.price}</Text>
                </Box>
              </Box>
            </Box>

            {/* Content */}
            <Box className="p-6 space-y-6">
              <Text className="text-gray-700">{currentService.description}</Text>

              <Box className="space-y-3">
                <Text className="text-sm font-semibold text-gray-800">Thông tin dịch vụ</Text>
                <Box className="space-y-2">
                  <Text className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">📍</span> Vị trí: {currentService.location}
                  </Text>
                  <Text className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">🕒</span> Giờ hoạt động: {currentService.operatingHours}
                  </Text>
                </Box>
              </Box>

              <Box className="space-y-3">
                <Text className="text-sm font-semibold text-gray-800">Tính năng chính</Text>
                <Box className="space-y-2">
                  {currentService.features.map((feature, index) => (
                    <Box key={index} className="flex items-start space-x-2">
                      <Check size={16} className={`${currentService.color.replace('bg-', 'text-')} mt-0.5 flex-shrink-0`} />
                      <Text className="text-sm text-gray-700">{feature}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Action Button */}
              <Button
                fullWidth
                className={`mt-4 ${currentService.isRegistered ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : currentService.color + ' text-white'}`}
                onClick={() => {
                  if (currentService.isRegistered) {
                    handleCancelService(currentService);
                  } else {
                    handleRegisterService(currentService);
                  }
                  setShowServiceDetail(false);
                }}
              >
                {currentService.isRegistered ? 'Hủy đăng ký' : 'Đăng ký ngay'}
              </Button>
            </Box>
          </Box>
        )}
      </Sheet>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        title={currentService?.isRegistered ? "Xác nhận hủy đăng ký" : "Xác nhận đăng ký"}
        onClose={() => setShowConfirmation(false)}
        actions={[
          {
            text: "Hủy",
            onClick: () => setShowConfirmation(false),
          },
          {
            text: "Xác nhận",
            onClick: handleConfirmRegister,
            primary: true,
          },
        ]}
      >
        {currentService && (
          <Box className="flex items-start space-x-3 p-4">
            {currentService.isRegistered ? (
              <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0" />
            ) : (
              <Info size={24} className="text-blue-500 flex-shrink-0" />
            )}
            <Text className="text-sm text-gray-700">
              {currentService.isRegistered
                ? `Bạn có chắc chắn muốn hủy đăng ký dịch vụ "${currentService.name}"?${!currentService.price.includes("Miễn phí") && !currentService.price.includes("Giá thị trường")
                  ? " Lưu ý: Phí đã thanh toán sẽ không được hoàn lại."
                  : ""
                }`
                : `Bạn có chắc chắn muốn đăng ký dịch vụ "${currentService.name}"?${!currentService.price.includes("Miễn phí") && !currentService.price.includes("Giá thị trường")
                  ? ` Chi phí: ${currentService.price}.`
                  : ""
                }`}
            </Text>
          </Box>
        )}
      </Modal>

      {/* Success Sheet */}
      <Sheet
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        className="zmp-sheet-custom"
      >
        {currentService && (
          <Box className="p-6 flex flex-col items-center text-center">
            <Box className={`${currentService.color} p-4 rounded-full mb-4`}>
              <CheckCircle size={40} className="text-white" />
            </Box>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {!currentService.isRegistered ? "Đăng ký thành công!" : "Hủy đăng ký thành công!"}
            </Text>
            <Text className="text-gray-600 mb-6">
              {!currentService.isRegistered
                ? `Bạn đã đăng ký thành công dịch vụ "${currentService.name}". Vui lòng liên hệ quản lý tòa nhà để biết thêm chi tiết.`
                : `Bạn đã hủy đăng ký dịch vụ "${currentService.name}". Cảm ơn bạn đã sử dụng dịch vụ.`}
            </Text>
            <Button
              fullWidth
              className={`${currentService.color} text-white`}
              onClick={() => setShowSuccess(false)}
            >
              {currentService.isRegistered ? "Đã hiểu" : "Đóng"}
            </Button>
          </Box>
        )}
      </Sheet>
    </Page>
  );
};

export default BuildingServicesPage;