import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Tabs, Modal, Sheet } from "zmp-ui";
import {
  Car,
  ShoppingCart,
  Utensils,
  Wrench,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Wifi,
  Dumbbell,
  Waves,
  Baby,
  Calendar,
  Package,
  Truck,
} from "lucide-react";
import api from "../services/api";

const BuildingServicesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [actionType, setActionType] = useState(null); // 'register' hoặc 'cancel'

  // Map category strings to Lucide icons
  const categoryIcons = {
    parking: <Car size={28} />,
    fitness: <Dumbbell size={28} />,
    cleaning: <Package size={28} />,
    entertainment: <Baby size={28} />,
    meeting: <Users size={28} />,
    food: <Utensils size={28} />,
    shopping: <ShoppingCart size={28} />,
    maintenance: <Wrench size={28} />,
    moving: <Truck size={28} />,
  };

  const getServiceIcon = (category) => {
    return categoryIcons[category] || <Info size={28} />;
  };

  const getServiceColor = (category) => {
    const colors = {
      parking: "#4F46E5", // Indigo
      fitness: "#F59E0B", // Amber
      cleaning: "#8B5CF6", // Purple
      entertainment: "#14B8A6", // Teal
      meeting: "#6366F1", // Indigo
      food: "#F97316", // Orange
      shopping: "#EF4444", // Red
    };
    return colors[category] || "#6B7280"; // Default gray
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/building-services");
      if (response.data && response.data.data) {
        setServices(response.data.data);
      } else {
        setError("Không thể tải danh sách dịch vụ.");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleRegisterService = (service) => {
    setCurrentService(service);
    setActionType('register');
    
    // Nếu là dịch vụ miễn phí hoặc giá thị trường, đăng ký luôn
    if (
      service.price?.includes("Miễn phí") ||
      service.price?.includes("Giá thị trường")
    ) {
      handleConfirmAction();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCancelService = (service) => {
    setCurrentService(service);
    setActionType('cancel');
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    if (!currentService || !actionType) return;

    setShowConfirmation(false);
    setLoading(true);
    setError(null);

    const endpoint = actionType === 'cancel'
      ? `/building-services/${currentService.id}/cancel`
      : `/building-services/${currentService.id}/register`;

    try {
      const response = await api.post(endpoint);
      
      // Kiểm tra response status thay vì response.data.success
      if (response.status === 200 || response.status === 201) {
        // Cập nhật trạng thái service trong state local
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === currentService.id 
              ? { 
                  ...service, 
                  isRegistered: actionType === 'register' ? true : false 
                }
              : service
          )
        );
        
        // Cập nhật currentService để hiển thị đúng trong success modal
        setCurrentService(prev => ({
          ...prev,
          isRegistered: actionType === 'register' ? true : false
        }));
        
        setShowSuccess(true);
      } else {
        setError("Thao tác thất bại.");
      }
    } catch (err) {
      console.error("Error during service action:", err);
      setError(
        "Có lỗi xảy ra trong quá trình xử lý yêu cầu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const openServiceDetail = (service) => {
    setCurrentService(service);
    setShowServiceDetail(true);
  };

  const filteredServices = services.filter((service) => {
    if (activeTab === "all") return true;
    if (activeTab === "registered") return service.isRegistered;
    if (activeTab === "free")
      return (
        service.price?.includes("Miễn phí") ||
        service.price?.includes("Giá thị trường")
      );
    return service.category === activeTab;
  });

  return (
    <Page className="bg-gray-50 py-5">
      {/* Header */}
      <Box className="px-4 pt-4 pb-2 bg-white">
        <Text.Title className="text-xl font-bold text-gray-800">
          Dịch vụ tiện ích
        </Text.Title>
      </Box>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="zmp-tabs-custom bg-white sticky top-0 z-10 mt-2"
      >
        <Tabs.Tab key="all" label="Tất cả" />
        <Tabs.Tab key="registered" label="Đã đăng ký" />
        <Tabs.Tab key="parking" label="Đỗ xe" />
        <Tabs.Tab key="fitness" label="Thể thao" />
        <Tabs.Tab key="cleaning" label="Vệ sinh" />
        <Tabs.Tab key="food" label="Ẩm thực" />
        <Tabs.Tab key="free" label="Miễn phí" />
      </Tabs>

      {/* Error Message */}
      {error && (
        <Box className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 mt-2 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <Text className="text-sm">{error}</Text>
        </Box>
      )}

      {/* Services List */}
      <Box className="p-4 grid grid-cols-1 gap-3 mb-10">
        {loading ? (
          Array(4)
            .fill()
            .map((_, index) => (
              <Box
                key={index}
                className="animate-pulse bg-white rounded-lg p-4 flex items-center space-x-3"
              >
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
                <Box
                  className="p-3 rounded-lg flex-shrink-0 text-white"
                  style={{ backgroundColor: getServiceColor(service.category) }}
                >
                  {getServiceIcon(service.category)}
                </Box>
                <Box className="flex-1 min-w-0">
                  <Box className="flex justify-between items-start space-x-2">
                    <Text className="text-sm font-medium text-gray-800 truncate">
                      {service.name}
                    </Text>
                    <Text className="text-xs font-semibold text-blue-500 whitespace-nowrap">
                      {service.price}
                    </Text>
                  </Box>
                  <Text className="text-xs text-gray-500 mt-1">
                    {service.description}
                  </Text>
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
            <Box
              className="p-6 text-white"
              style={{ backgroundColor: getServiceColor(currentService.category) }}
            >
              <Box className="flex items-center space-x-4">
                <Box className="p-3 bg-white bg-opacity-20 rounded-lg">
                  {getServiceIcon(currentService.category)}
                </Box>
                <Box>
                  <Text className="text-xl font-bold">
                    {currentService.name}
                  </Text>
                  <Text className="text-white text-opacity-90">
                    {currentService.price}
                  </Text>
                </Box>
              </Box>
            </Box>

            {/* Content */}
            <Box className="p-6 space-y-6">
              <Text className="text-gray-700">
                {currentService.description}
              </Text>

              <Box className="space-y-3">
                <Text className="text-sm font-semibold text-gray-800">
                  Thông tin dịch vụ
                </Text>
                <Box className="space-y-2">
                  <Text className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">📍</span> Vị trí:{" "}
                    {currentService.location}
                  </Text>
                  <Text className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">🕒</span> Giờ hoạt động:{" "}
                    {currentService.operatingHours}
                  </Text>
                </Box>
              </Box>

              <Box className="space-y-3">
                <Text className="text-sm font-semibold text-gray-800">
                  Tính năng chính
                </Text>
                <Box className="space-y-2">
                  {currentService.features?.map((feature, index) => (
                    <Box key={index} className="flex items-start space-x-2">
                      <CheckCircle
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: getServiceColor(currentService.category) }}
                      />
                      <Text className="text-sm text-gray-700">{feature}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Action Button */}
              <Button
                fullWidth
                className={`mt-4 ${
                  currentService.isRegistered
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "text-white"
                }`}
                style={
                  !currentService.isRegistered
                    ? { backgroundColor: getServiceColor(currentService.category) }
                    : {}
                }
                onClick={() => {
                  if (currentService.isRegistered) {
                    handleCancelService(currentService);
                  } else {
                    handleRegisterService(currentService);
                  }
                  setShowServiceDetail(false);
                }}
              >
                {currentService.isRegistered ? "Hủy đăng ký" : "Đăng ký ngay"}
              </Button>
            </Box>
          </Box>
        )}
      </Sheet>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        title={
          actionType === 'cancel'
            ? "Xác nhận hủy đăng ký"
            : "Xác nhận đăng ký"
        }
        onClose={() => setShowConfirmation(false)}
        actions={[
          {
            text: "Hủy",
            onClick: () => setShowConfirmation(false),
          },
          {
            text: "Xác nhận",
            onClick: handleConfirmAction,
            primary: true,
          },
        ]}
      >
        {currentService && (
          <Box className="flex items-start space-x-3 p-4">
            {actionType === 'cancel' ? (
              <AlertTriangle
                size={24}
                className="text-yellow-500 flex-shrink-0"
              />
            ) : (
              <Info size={24} className="text-blue-500 flex-shrink-0" />
            )}
            <Text className="text-sm text-gray-700">
              {actionType === 'cancel'
                ? `Bạn có chắc chắn muốn hủy đăng ký dịch vụ "${
                    currentService.name
                  }"?${
                    !currentService.price?.includes("Miễn phí") &&
                    !currentService.price?.includes("Giá thị trường")
                      ? " Lưu ý: Phí đã thanh toán sẽ không được hoàn lại."
                      : ""
                  }`
                : `Bạn có chắc chắn muốn đăng ký dịch vụ "${
                    currentService.name
                  }"?${
                    !currentService.price?.includes("Miễn phí") &&
                    !currentService.price?.includes("Giá thị trường")
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
            <Box
              className="p-4 rounded-full mb-4"
              style={{ backgroundColor: getServiceColor(currentService.category) }}
            >
              <CheckCircle size={40} className="text-white" />
            </Box>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {actionType === 'register'
                ? "Đăng ký thành công!"
                : "Hủy đăng ký thành công!"}
            </Text>
            <Text className="text-gray-600 mb-6">
              {actionType === 'register'
                ? `Bạn đã đăng ký thành công dịch vụ "${currentService.name}". Vui lòng liên hệ quản lý tòa nhà để biết thêm chi tiết.`
                : `Bạn đã hủy đăng ký dịch vụ "${currentService.name}". Cảm ơn bạn đã sử dụng dịch vụ.`}
            </Text>
            <Button
              fullWidth
              className="text-white"
              style={{ backgroundColor: getServiceColor(currentService.category) }}
              onClick={() => setShowSuccess(false)}
            >
              Đóng
            </Button>
          </Box>
        )}
      </Sheet>
    </Page>
  );
};

export default BuildingServicesPage;