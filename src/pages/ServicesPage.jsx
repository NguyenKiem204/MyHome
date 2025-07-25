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
import useAuthStore from "../store/useAuthStore";
import api from "../services/api";

const BuildingServicesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [actionType, setActionType] = useState(null);
  const user = useAuthStore((state) => state.user);
  const [confirmationMessage, setConfirmationMessage] = useState("");

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
      parking: "#4F46E5",
      fitness: "#F59E0B",
      cleaning: "#8B5CF6",
      entertainment: "#14B8A6",
      meeting: "#6366F1",
      food: "#F97316",
      shopping: "#EF4444",
      maintenance: "#6B7280",
      moving: "#10B981",
    };
    return colors[category] || "#6B7280";
  };

  const checkUserRegistration = (service, userId) => {
    if (!service.service_registrations || !userId) {
      return null;
    }

    const userRegistrations = service.service_registrations.filter(
      (reg) => reg.resident?.id == userId
    );

    if (userRegistrations.length > 0) {
      const latestRegistration = userRegistrations.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      
      return latestRegistration;
    }

    return null;
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/building-services", {
        params: {
          "populate[service_registrations][populate]": "resident",
        },
      });

      if (response.data && response.data.data) {
        const servicesWithStatus = response.data.data.map((service) => {
          const userRegistration = checkUserRegistration(service, user?.id);

          const registrationStatus = userRegistration ? {
            id: userRegistration.id,
            status: userRegistration.statusRegister,
            startDate: userRegistration.start_date,
            endDate: userRegistration.end_date,
            appTransId: userRegistration.app_trans_id,
            createdAt: userRegistration.createdAt,
            isActive: userRegistration.statusRegister === "Đã đăng kí",
            isPending: userRegistration.statusRegister === "Chờ thanh toán",
            isCancelled: userRegistration.statusRegister === "Đã hủy",
          } : null;

          return {
            ...service,
            isRegistered: registrationStatus,
            canRegister: !registrationStatus || registrationStatus.isCancelled,
            canCancel: registrationStatus && (registrationStatus.isActive || registrationStatus.isPending),
          };
        });

        setServices(servicesWithStatus);
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
  }, [user]);

  const openSnackbar = ({ text, type, duration }) => {
    console.log(`Snackbar: ${text} (${type})`);
  };

  const handleRegisterService = async (service) => {
    if (!user) {
      openSnackbar({
        text: "Vui lòng đăng nhập để đăng ký dịch vụ",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (service.isRegistered && service.isRegistered.isActive) {
      openSnackbar({
        text: "Bạn đã đăng ký dịch vụ này rồi",
        type: "info",
        duration: 3000,
      });
      return;
    }

    setCurrentService(service);
    setActionType("register");

    const message = `Bạn có chắc chắn muốn đăng ký dịch vụ "${service.name}"?\nGiá: ${
      new Intl.NumberFormat("vi-VN").format(service.price)
    }đ/${service.unit}`;

    setConfirmationMessage(message);
    setShowConfirmation(true);
  };

  const handleCancelService = (service) => {
    if (!service.canCancel) {
      openSnackbar({
        text: "Không thể hủy dịch vụ này",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    setCurrentService(service);
    setActionType("cancel");
    setConfirmationMessage(
      `Bạn có chắc chắn muốn hủy đăng ký dịch vụ "${service.name}"?`
    );
    setShowConfirmation(true);
  };

  const handlePaymentService = async (service) => {
    if (!service.isRegistered || !service.isRegistered.isPending) {
      return;
    }

    try {
      setPaymentLoading(service.id);
      const response = await api.post("/service-registration/payment", {
        registrationId: service.isRegistered.id,
        appTransId: service.isRegistered.appTransId,
      });

      if (response.data?.payment_url) {
        window.location.href = response.data.payment_url;
        return;
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
      setPaymentLoading(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!currentService || !actionType || !user) return;

    setShowConfirmation(false);
    setLoading(true);
    setError(null);

    try {
      if (actionType === "register") {
        const response = await api.post("/service-registration/register", {
          buildingServiceId: currentService.id,
          residentId: user.id,
        });
        if (response.data?.order_url) {
          window.location.href = response.data.order_url;
          return;
        }
      } else {
        await api.post(
          `/service-registration/${currentService.isRegistered.id}/cancel`
        );
      }

      await fetchServices();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error:", err);
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

  const getFilteredServices = () => {
    return services.filter((service) => {
      switch (activeTab) {
        case "all":
          return true;
        case "registered":
          return service.isRegistered && service.isRegistered.isActive;
        case "pending":
          return service.isRegistered && service.isRegistered.isPending;
        case "free":
          return service.price === 0 || 
                 service.price?.toString().includes("Miễn phí");
        default:
          return service.category === activeTab;
      }
    });
  };

  const filteredServices = getFilteredServices();

  const renderRegistrationStatus = (service) => {
    if (!service.isRegistered) {
      return (
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
      );
    }

    const { status, isActive, isPending } = service.isRegistered;
    
    return (
      <Box className="flex items-center gap-2">
        <Text
          className={`text-xs ${
            isActive ? "text-green-500" : 
            isPending ? "text-orange-500" : 
            "text-gray-500"
          }`}
        >
          {status}
        </Text>
        
        {isActive && (
          <Button
            variant="text"
            size="small"
            className="text-red-500 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelService(service);
            }}
          >
            Hủy
          </Button>
        )}
        
        {isPending && (
          <Button
            variant="text"
            size="small"
            className="text-blue-500 text-xs font-medium"
            disabled={paymentLoading === service.id}
            onClick={(e) => {
              e.stopPropagation();
              handlePaymentService(service);
            }}
          >
            {paymentLoading === service.id ? "Đang xử lý..." : "Thanh toán"}
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Page className="bg-gray-50 py-5">
      <Box className="px-4 pt-4 pb-2 bg-white">
        <Text.Title className="text-xl font-bold text-gray-800">
          Dịch vụ tiện ích
        </Text.Title>
      </Box>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="zmp-tabs-custom bg-white sticky top-0 z-10 mt-2"
      >
        <Tabs.Tab key="all" label="Tất cả" />
        <Tabs.Tab key="registered" label="Đã đăng ký" />
        <Tabs.Tab key="pending" label="Chờ thanh toán" />
        <Tabs.Tab key="parking" label="Đỗ xe" />
        <Tabs.Tab key="fitness" label="Thể thao" />
        <Tabs.Tab key="cleaning" label="Vệ sinh" />
        <Tabs.Tab key="food" label="Ẩm thực" />
        <Tabs.Tab key="free" label="Miễn phí" />
      </Tabs>

      {error && (
        <Box className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 mt-2 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <Text className="text-sm">{error}</Text>
        </Box>
      )}

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
                      {service.price
                        ? `${new Intl.NumberFormat("vi-VN").format(service.price)}đ/${service.unit || "lần"}`
                        : "Miễn phí"}
                    </Text>
                  </Box>
                  
                  <Text className="text-xs text-gray-500 mt-1">
                    {service.description}
                  </Text>
                  
                  <Box className="mt-3 flex justify-between items-center">
                    <Text className="text-xs text-gray-500 flex items-center">
                      <Users size={12} className="mr-1" />
                      {service.userCount || 0} người dùng
                    </Text>
                    
                    {renderRegistrationStatus(service)}
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

      <Sheet
        visible={showServiceDetail}
        onClose={() => setShowServiceDetail(false)}
        className="zmp-sheet-custom"
      >
        {currentService && (
          <Box className="pb-8">
            <Box
              className="p-6 text-white"
              style={{
                backgroundColor: getServiceColor(currentService.category),
              }}
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
                    {currentService.price
                      ? `${new Intl.NumberFormat("vi-VN").format(
                          currentService.price
                        )}đ/${currentService.unit || "lần"}`
                      : "Miễn phí"}
                  </Text>
                </Box>
              </Box>
            </Box>

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
                    {currentService.location || "Chưa cập nhật"}
                  </Text>
                  <Text className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">🕒</span> Giờ hoạt động:{" "}
                    {currentService.operatingHours || "24/7"}
                  </Text>
                </Box>
              </Box>

              {currentService.features &&
                currentService.features.length > 0 && (
                  <Box className="space-y-3">
                    <Text className="text-sm font-semibold text-gray-800">
                      Tính năng chính
                    </Text>
                    <Box className="space-y-2">
                      {currentService.features.map((feature, index) => (
                        <Box key={index} className="flex items-start space-x-2">
                          <CheckCircle
                            size={16}
                            className="mt-0.5 flex-shrink-0"
                            style={{
                              color: getServiceColor(currentService.category),
                            }}
                          />
                          <Text className="text-sm text-gray-700">
                            {feature}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

              <Button
                fullWidth
                className={`mt-4 ${
                  currentService.isRegistered && currentService.isRegistered.isActive
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "text-white"
                }`}
                style={
                  !(currentService.isRegistered && currentService.isRegistered.isActive)
                    ? {
                        backgroundColor: getServiceColor(
                          currentService.category
                        ),
                      }
                    : {}
                }
                onClick={() => {
                  if (currentService.isRegistered && currentService.isRegistered.isActive) {
                    handleCancelService(currentService);
                  } else {
                    handleRegisterService(currentService);
                  }
                  setShowServiceDetail(false);
                }}
              >
                {currentService.isRegistered && currentService.isRegistered.isActive 
                  ? "Hủy đăng ký" 
                  : "Đăng ký ngay"}
              </Button>
            </Box>
          </Box>
        )}
      </Sheet>

      <Modal
        visible={showConfirmation}
        title={
          actionType === "cancel" ? "Xác nhận hủy đăng ký" : "Xác nhận đăng ký"
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
        <Box className="flex items-start space-x-3 p-4">
          {actionType === "cancel" ? (
            <AlertTriangle
              size={24}
              className="text-yellow-500 flex-shrink-0"
            />
          ) : (
            <Info size={24} className="text-blue-500 flex-shrink-0" />
          )}
          <Text className="text-sm text-gray-700 whitespace-pre-line">
            {confirmationMessage}
          </Text>
        </Box>
      </Modal>

      <Sheet
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        className="zmp-sheet-custom"
      >
        {currentService && (
          <Box
            className="p-6 rounded-lg"
            style={{
              backgroundColor: getServiceColor(currentService.category),
            }}
          >
            <Box className="flex items-center justify-center mb-4">
              <CheckCircle size={48} className="text-white" />
            </Box>
            <Text className="text-lg font-semibold text-white mb-4 text-center">
              {actionType === "register"
                ? "Đăng ký thành công!"
                : "Hủy đăng ký thành công!"}
            </Text>
            <Text className="text-white mb-6 text-center">
              Dịch vụ "{currentService.name}" đã được{" "}
              {actionType === "register" ? "đăng ký" : "hủy đăng ký"} thành
              công.
            </Text>
            <Button
              fullWidth
              className="bg-white bg-opacity-20 text-white border-white"
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