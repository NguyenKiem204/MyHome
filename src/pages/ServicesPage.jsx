// src/pages/ServicesPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Tabs, Icon, Modal, Switch, Sheet } from "zmp-ui";
import { 
  Bell, Shield, Cloud, CreditCard, Zap, Check, X, 
  CheckCircle, AlertTriangle, Info, Coffee, Globe, Users, BookOpen
} from "lucide-react";
// import "../css/services.css";

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Danh sách tiện ích mẫu
  const sampleServices = [
    {
      id: 1,
      name: "Thông báo nhanh",
      description: "Nhận thông báo tức thì về các cập nhật và sự kiện quan trọng",
      icon: <Bell size={28} />,
      color: "#4F46E5",
      category: "notification",
      isRegistered: true,
      price: "Miễn phí",
      features: [
        "Thông báo tức thì",
        "Tùy chỉnh loại thông báo",
        "Đồng bộ đa thiết bị",
        "Lịch sử thông báo"
      ],
      userCount: "5.2K",
    },
    {
      id: 2,
      name: "Bảo mật nâng cao",
      description: "Bảo vệ tài khoản và dữ liệu cá nhân với lớp bảo mật bổ sung",
      icon: <Shield size={28} />,
      color: "#10B981",
      category: "security",
      isRegistered: false,
      price: "20.000đ/tháng",
      features: [
        "Xác thực hai lớp",
        "Kiểm tra bảo mật định kỳ",
        "Mã hóa dữ liệu",
        "Kiểm soát quyền truy cập"
      ],
      userCount: "3.8K",
    },
    {
      id: 3,
      name: "Cloud Premium",
      description: "Lưu trữ và đồng bộ hóa dữ liệu không giới hạn trên đám mây",
      icon: <Cloud size={28} />,
      color: "#6366F1",
      category: "storage",
      isRegistered: false,
      price: "30.000đ/tháng",
      features: [
        "5GB dung lượng lưu trữ",
        "Đồng bộ tự động",
        "Chia sẻ file nhanh chóng",
        "Sao lưu và phục hồi"
      ],
      userCount: "4.5K",
    },
    {
      id: 4,
      name: "Thanh toán tự động",
      description: "Thiết lập thanh toán tự động cho các dịch vụ định kỳ",
      icon: <CreditCard size={28} />,
      color: "#F59E0B",
      category: "payment",
      isRegistered: false,
      price: "Miễn phí",
      features: [
        "Thanh toán tự động",
        "Lịch sử giao dịch",
        "Thông báo trước khi thanh toán",
        "Quản lý hóa đơn"
      ],
      userCount: "2.1K",
    },
    {
      id: 5,
      name: "Tăng tốc ứng dụng",
      description: "Tối ưu hóa hiệu suất và giảm thời gian tải ứng dụng",
      icon: <Zap size={28} />,
      color: "#EC4899",
      category: "performance",
      isRegistered: false,
      price: "15.000đ/tháng",
      features: [
        "Tối ưu bộ nhớ cache",
        "Giảm thời gian tải",
        "Tiết kiệm pin",
        "Chế độ tiết kiệm dữ liệu"
      ],
      userCount: "1.8K",
    },
    {
      id: 6,
      name: "Hỗ trợ ưu tiên",
      description: "Nhận hỗ trợ kỹ thuật ưu tiên từ đội ngũ chuyên gia",
      icon: <Users size={28} />,
      color: "#8B5CF6",
      category: "support",
      isRegistered: false,
      price: "25.000đ/tháng",
      features: [
        "Hỗ trợ 24/7",
        "Thời gian phản hồi nhanh",
        "Tư vấn cá nhân hóa",
        "Hỗ trợ qua nhiều kênh"
      ],
      userCount: "1.2K",
    },
    {
      id: 7,
      name: "Lớp học trực tuyến",
      description: "Truy cập các khóa học và tài liệu học tập trực tuyến",
      icon: <BookOpen size={28} />,
      color: "#0EA5E9",
      category: "education",
      isRegistered: false,
      price: "50.000đ/tháng",
      features: [
        "Khóa học đa dạng",
        "Chứng chỉ hoàn thành",
        "Tài liệu chi tiết",
        "Diễn đàn trao đổi"
      ],
      userCount: "2.7K",
    },
    {
      id: 8,
      name: "Tiện ích quốc tế",
      description: "Mở rộng trải nghiệm với các tính năng quốc tế",
      icon: <Globe size={28} />,
      color: "#14B8A6",
      category: "global",
      isRegistered: false,
      price: "35.000đ/tháng",
      features: [
        "Hỗ trợ đa ngôn ngữ",
        "Thanh toán quốc tế",
        "Tương thích đa quốc gia",
        "Cập nhật tin tức toàn cầu"
      ],
      userCount: "1.9K",
    },
  ];

  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      setServices(sampleServices);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRegisterService = (service) => {
    setCurrentService(service);
    
    if (service.price === "Miễn phí") {
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
    // Cập nhật trạng thái đăng ký
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
    if (activeTab === "free") return service.price === "Miễn phí";
    return service.category === activeTab;
  });

  return (
    <Page className="services-page">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="services-tabs"
      >
        <Tabs.Tab key="all" label="Tất cả" />
        <Tabs.Tab key="registered" label="Đã đăng ký" />
        <Tabs.Tab key="free" label="Miễn phí" />
        <Tabs.Tab key="premium" label="Premium" />
      </Tabs>
      
      <Box className="services-list">
        {loading ? (
          Array(4).fill().map((_, index) => (
            <Box key={index} className="service-card service-card-skeleton">
              <Box className="service-icon-skeleton"></Box>
              <Box className="service-content-skeleton">
                <Box className="service-title-skeleton"></Box>
                <Box className="service-desc-skeleton"></Box>
              </Box>
            </Box>
          ))
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Box 
              key={service.id} 
              className="service-card"
              onClick={() => openServiceDetail(service)}
            >
              <Box 
                className="service-icon" 
                style={{ backgroundColor: service.color }}
              >
                {service.icon}
              </Box>
              <Box className="service-content">
                <Box className="service-header">
                  <Text className="service-name">{service.name}</Text>
                  <Text className="service-price">{service.price}</Text>
                </Box>
                <Text className="service-description">{service.description}</Text>
                <Box className="service-footer">
                  <Text className="service-users">
                    <Users size={14} />
                    {service.userCount} người dùng
                  </Text>
                  {service.isRegistered ? (
                    <Button
                      className="service-button registered"
                      variant="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelService(service);
                      }}
                    >
                      <Check size={16} /> Đã đăng ký
                    </Button>
                  ) : (
                    <Button
                      className="service-button"
                      size="small"
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
          ))
        ) : (
          <Box className="empty-services">
            <Text>Không có tiện ích nào phù hợp</Text>
          </Box>
        )}
      </Box>
      
      {/* Modal chi tiết tiện ích */}
      <Sheet
        visible={showServiceDetail}
        onClose={() => setShowServiceDetail(false)}
        height={400}
        mask
        handler
        swipeToClose
      >
        {currentService && (
          <Box className="service-detail">
            <Box 
              className="service-detail-header"
              style={{ backgroundColor: currentService.color }}
            >
              <Box className="service-detail-icon">
                {currentService.icon}
              </Box>
              <Text className="service-detail-name">{currentService.name}</Text>
              <Text className="service-detail-price">{currentService.price}</Text>
            </Box>
            
            <Box className="service-detail-content">
              <Text className="service-detail-description">
                {currentService.description}
              </Text>
              
              <Box className="service-features">
                <Text className="feature-title">Tính năng chính</Text>
                <Box className="feature-list">
                  {currentService.features.map((feature, index) => (
                    <Box key={index} className="feature-item">
                      <Check size={16} color={currentService.color} />
                      <Text>{feature}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Box className="service-detail-footer">
                {currentService.isRegistered ? (
                  <Button
                    className="service-action-btn cancel-btn"
                    onClick={() => handleCancelService(currentService)}
                  >
                    Hủy đăng ký
                  </Button>
                ) : (
                  <Button
                    className="service-action-btn register-btn"
                    style={{ backgroundColor: currentService.color }}
                    onClick={() => handleRegisterService(currentService)}
                  >
                    Đăng ký ngay
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Sheet>
      
      {/* Modal xác nhận */}
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
          <Box className="confirmation-content">
            {currentService.isRegistered ? (
              <Box className="confirmation-message">
                <AlertTriangle size={24} color="#F59E0B" />
                <Text>
                  Bạn có chắc chắn muốn hủy đăng ký tiện ích "{currentService.name}"?
                  {currentService.price !== "Miễn phí" && " Lưu ý rằng bạn sẽ không được hoàn phí đã thanh toán."}
                </Text>
              </Box>
            ) : (
              <Box className="confirmation-message">
                <Info size={24} color="#3B82F6" />
                <Text>
                  Bạn có chắc chắn muốn đăng ký tiện ích "{currentService.name}"?
                  {currentService.price !== "Miễn phí" && ` Phí dịch vụ là ${currentService.price}.`}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Modal>
      
      {/* Sheet thông báo thành công */}
      <Sheet
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        {currentService && (
          <Box className="success-sheet">
            <Box 
              className="success-icon"
              style={{ backgroundColor: currentService.color }}
            >
              <CheckCircle size={40} />
            </Box>
            <Text className="success-title">
              {currentService.isRegistered ? "Đăng ký thành công!" : "Hủy đăng ký thành công!"}
            </Text>
            <Text className="success-message">
              {currentService.isRegistered
                ? `Bạn đã đăng ký thành công tiện ích "${currentService.name}". Bạn có thể sử dụng ngay bây giờ.`
                : `Bạn đã hủy đăng ký tiện ích "${currentService.name}". Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`}
            </Text>
            <Button 
              className="success-btn"
              fullWidth
              style={{ backgroundColor: currentService.color }}
              onClick={() => setShowSuccess(false)}
            >
              {currentService.isRegistered ? "Bắt đầu sử dụng" : "Đóng"}
            </Button>
          </Box>
        )}
      </Sheet>
    </Page>
  );
};

export default ServicesPage;