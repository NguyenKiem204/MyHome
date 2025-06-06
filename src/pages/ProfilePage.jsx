import React, { useRef, useState, useEffect } from "react";
import { Box, Page, Text, Avatar, Button, List, Modal, Input } from "zmp-ui";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  LogOut,
  Camera,
  ChevronRight,
  Shield,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { getUserInfo } from "zmp-sdk/apis";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "Người dùng",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
  });

  const [zaloUserInfo, setZaloUserInfo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [avatar, setAvatar] = useState();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Lấy thông tin người dùng từ ZMP SDK
  const fetchUserInfo = async () => {
    try {
      setUserDataLoading(true);
      
      const userInfoResponse = await getUserInfo({});
      
      if (userInfoResponse.userInfo) {
        const { id, name, avatar } = userInfoResponse.userInfo;
        
        const zaloInfo = {
          id: id,
          name: name || "Người dùng",
          avatar: avatar || null,
        };
        
        setZaloUserInfo(zaloInfo);
        
        // Cập nhật profileData với thông tin từ Zalo
        setProfileData(prevData => ({
          ...prevData,
          name: zaloInfo.name,
          // Giữ lại các thông tin khác nếu đã có
        }));
        
        console.log("Zalo user info loaded:", zaloInfo);
      }
    } catch (error) {
      console.error("Error fetching Zalo user info:", error);
    } finally {
      setUserDataLoading(false);
    }
  };

  // Refresh thông tin người dùng
  const refreshUserInfo = async () => {
    setRefreshing(true);
    await fetchUserInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserInfo();
    
    return () => avatar && URL.revokeObjectURL(avatar.preview);
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatar(file);
  };

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    setProfileData({
      ...profileData,
      [editField]: editValue,
    });
    setShowEditModal(false);
  };

  const profileMenuItems = [
    {
      id: "account",
      title: "Tài khoản và bảo mật",
      icon: <Shield size={20} />,
      path: "/profile/security",
    },
    {
      id: "payment",
      title: "Phương thức thanh toán",
      icon: <CreditCard size={20} />,
      path: "/profile/payment",
    },
    {
      id: "history",
      title: "Lịch sử hoạt động",
      icon: <Calendar size={20} />,
      path: "/profile/history",
    },
    {
      id: "logout",
      title: "Đăng xuất",
      icon: <LogOut size={20} />,
      path: "/logout",
      color: "#EF4444",
    },
  ];

  // Lấy avatar để hiển thị
  const getDisplayAvatar = () => {
    if (avatar?.preview) return avatar.preview;
    if (zaloUserInfo?.avatar) return zaloUserInfo.avatar;
    return "https://via.placeholder.com/100";
  };

  return (
    <Page className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <Box className="bg-white px-6 py-8 text-center border-b border-gray-200 mt-16">
        {/* Refresh Button */}
        <Box className="absolute top-20 right-4">
          <Button
            variant="secondary"
            size="small"
            className="p-2 bg-gray-100 rounded-full"
            onClick={refreshUserInfo}
            disabled={refreshing}
          >
            <RefreshCw 
              size={16} 
              className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} 
            />
          </Button>
        </Box>

        <Box className="relative inline-block mb-4">
          <Avatar
            className="w-24 h-24 mx-auto shadow-lg rounded-full"
            size={96}
            src={getDisplayAvatar()}
          />

          <Box className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Camera size={16} className="text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e)}
              />
            </label>
          </Box>
        </Box>

        {userDataLoading ? (
          <Box className="mb-4">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </Box>
        ) : (
          <Box className="mb-4">
            <Text className="text-xl font-bold text-gray-900 mb-2">
              {profileData.name}
            </Text>
            {zaloUserInfo?.id && (
              <Text className="text-sm text-gray-500">
                Zalo ID: {zaloUserInfo.id}
              </Text>
            )}
          </Box>
        )}

        <Button
          variant="secondary"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mx-auto"
          onClick={() => handleEdit("name", profileData.name)}
          disabled={userDataLoading}
        >
          <div className="flex items-center gap-2">
            <Edit size={15} />
            <span>Chỉnh sửa</span>
          </div>
        </Button>
      </Box>

      {/* Zalo Info Section */}
      {zaloUserInfo && (
        <Box className="px-4 py-4">
          <Box className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-sm font-medium text-blue-800 mb-2">
              📱 Thông tin Zalo
            </Text>
            <Box className="flex items-center gap-3">
              {zaloUserInfo.avatar && (
                <Avatar
                  className="w-10 h-10 border-2 border-blue-200"
                  size={40}
                  src={zaloUserInfo.avatar}
                />
              )}
              <Box>
                <Text className="font-medium text-blue-900">
                  {zaloUserInfo.name}
                </Text>
                <Text className="text-xs text-blue-600">
                  Đã liên kết với Zalo
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Profile Details */}
      <Box className="px-4 py-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Thông tin cá nhân
        </Text>

        <Box className="bg-white rounded-lg shadow-sm">
          <Box
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("email", profileData.email)}
          >
            <Box className="flex items-center gap-3">
              <Mail size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Email</Text>
                <Text className="font-medium text-gray-900">
                  {profileData.email || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>

          <Box
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("phone", profileData.phone)}
          >
            <Box className="flex items-center gap-3">
              <Phone size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Số điện thoại</Text>
                <Text className="font-medium text-gray-900">
                  {profileData.phone || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>

          <Box
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("address", profileData.address)}
          >
            <Box className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Địa chỉ</Text>
                <Text className="font-medium text-gray-900">
                  {profileData.address || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>

          <Box
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("birthdate", profileData.birthdate)}
          >
            <Box className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Ngày sinh</Text>
                <Text className="font-medium text-gray-900">
                  {profileData.birthdate || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Box className="px-4 pb-20">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Cài đặt tài khoản
        </Text>

        <Box className="bg-white rounded-lg shadow-sm">
          {profileMenuItems.map((item, index) => (
            <Box
              key={item.id}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${index !== profileMenuItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
                }`}
              onClick={() => (window.location.href = item.path)}
            >
              <Box className="flex items-center gap-3">
                <Box className={item.color ? `text-red-500` : `text-gray-500`}>
                  {item.icon}
                </Box>
                <Text
                  className={`font-medium ${item.color ? "text-red-500" : "text-gray-900"
                    }`}
                >
                  {item.title}
                </Text>
              </Box>
              {item.id !== "logout" && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        title={`Chỉnh sửa ${editField === "name"
            ? "tên"
            : editField === "email"
              ? "email"
              : editField === "phone"
                ? "số điện thoại"
                : editField === "address"
                  ? "địa chỉ"
                  : "ngày sinh"
          }`}
        onClose={() => setShowEditModal(false)}
        actions={[
          {
            text: "Hủy",
            onClick: () => setShowEditModal(false),
          },
          {
            text: "Lưu",
            onClick: saveEdit,
            primary: true,
          },
        ]}
      >
        <Box className="p-4">
          <Input
            label={`Nhập ${editField === "name"
                ? "tên"
                : editField === "email"
                  ? "email"
                  : editField === "phone"
                    ? "số điện thoại"
                    : editField === "address"
                      ? "địa chỉ"
                      : "ngày sinh"
              } mới`}
            type={
              editField === "email"
                ? "email"
                : editField === "phone"
                  ? "tel"
                  : editField === "birthdate"
                    ? "date"
                    : "text"
            }
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            placeholder={editField === "name" && zaloUserInfo?.name ? 
              `Tên hiện tại từ Zalo: ${zaloUserInfo.name}` : 
              undefined
            }
          />
          
          {editField === "name" && zaloUserInfo?.name && (
            <Text className="text-xs text-gray-500 mt-2">
              💡 Tên này sẽ ghi đè tên từ Zalo trong ứng dụng
            </Text>
          )}
        </Box>
      </Modal>
    </Page>
  );
};

export default ProfilePage;