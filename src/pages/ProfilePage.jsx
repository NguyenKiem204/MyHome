import React, { useState } from "react";
import { Box, Page, Text, Avatar, Button, Modal, Input } from "zmp-ui";
import {
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
import { useNavigate } from "zmp-ui";
import { clearTokens } from "../services/auth";
import useAuthStore from "../store/useAuthStore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const syncAuth = useAuthStore((state) => state.syncAuth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [avatar, setAvatar] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Refresh thông tin người dùng từ store
  const refreshUserInfo = async () => {
    setRefreshing(true);
    await syncAuth();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      clearTokens();
      navigate("/building-selector", { replace: true });
    } catch (error) {
      clearTokens();
      navigate("/building-selector", { replace: true });
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

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

  // Chỉ cập nhật local, không gửi lên server
  const saveEdit = () => {
    // Nếu muốn cập nhật lên store, cần thêm action updateUser trong useAuthStore
    setShowEditModal(false);
  };

  const profileMenuItems = [
    {
      id: "account",
      title: "Tài khoản và bảo mật",
      icon: <Shield size={20} />,
      path: "/profile/security",
      action: () => {
        console.log("Navigate to security page");
      },
    },
    {
      id: "payment",
      title: "Phương thức thanh toán",
      icon: <CreditCard size={20} />,
      path: "/profile/payment",
      action: () => {
        console.log("Navigate to payment page");
      },
    },
    {
      id: "history",
      title: "Lịch sử hoạt động",
      icon: <Calendar size={20} />,
      path: "/profile/history",
      action: () => {
        console.log("Navigate to history page");
      },
    },
    {
      id: "logout",
      title: "Đăng xuất",
      icon: <LogOut size={20} />,
      color: "#EF4444",
      action: handleLogoutClick,
    },
  ];

  // Lấy avatar để hiển thị
  const getDisplayAvatar = () => {
    if (avatar?.preview) return avatar.preview;
    if (user?.avatar) return user.avatar;
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
              className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`}
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

        <Box className="mb-4">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            {user?.name || "Người dùng"}
          </Text>
          {user?.zaloId && (
            <Text className="text-sm text-gray-500">
              Zalo ID: {user.zaloId}
            </Text>
          )}
        </Box>

        <Button
          variant="secondary"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mx-auto"
          onClick={() => handleEdit("name", user?.name || "")}
        >
          <div className="flex items-center gap-2">
            <Edit size={15} />
            <span>Chỉnh sửa</span>
          </div>
        </Button>
      </Box>

      {/* Thông tin cá nhân */}
      <Box className="px-4 py-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Thông tin cá nhân
        </Text>

        <Box className="bg-white rounded-lg shadow-sm">
          <Box
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("email", user?.email || "")}
          >
            <Box className="flex items-center gap-3">
              <Mail size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Email</Text>
                <Text className="font-medium text-gray-900">
                  {user?.email || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>

          <Box
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("phoneNumber", user?.phoneNumber || "")}
          >
            <Box className="flex items-center gap-3">
              <Phone size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Số điện thoại</Text>
                <Text className="font-medium text-gray-900">
                  {user?.phoneNumber || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>

          <Box
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() =>
              handleEdit("address", user?.buildings?.[0]?.Address || "")
            }
          >
            <Box className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Địa chỉ</Text>
                <Text className="font-medium text-gray-900">
                  {user?.buildings?.[0]?.Address || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>

          <Box
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => handleEdit("birthdate", user?.birthdate || "")}
          >
            <Box className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-500" />
              <Box>
                <Text className="text-sm text-gray-500">Ngày sinh</Text>
                <Text className="font-medium text-gray-900">
                  {user?.birthdate || "Chưa cập nhật"}
                </Text>
              </Box>
            </Box>
            <Edit size={16} className="text-gray-400" />
          </Box>
        </Box>
      </Box>

      {/* Thông tin tòa nhà */}
      {user?.buildings?.length > 0 && (
        <Box className="px-4 py-2">
          <Box className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-sm font-medium text-blue-800 mb-2">
              🏢 Thông tin tòa nhà
            </Text>
            <Box>
              <Text className="font-medium text-blue-900">
                {user.buildings[0].BuildingName}
              </Text>
              <Text className="text-xs text-blue-600">
                {user.buildings[0].Address}
              </Text>
            </Box>
          </Box>
        </Box>
      )}

      {/* Profile Menu */}
      <Box className="px-4 pb-20">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Cài đặt tài khoản
        </Text>

        <Box className="bg-white rounded-lg shadow-sm">
          {profileMenuItems.map((item, index) => (
            <Box
              key={item.id}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
                index !== profileMenuItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              onClick={item.action}
            >
              <Box className="flex items-center gap-3">
                <Box className={item.color ? `text-red-500` : `text-gray-500`}>
                  {item.icon}
                </Box>
                <Text
                  className={`font-medium ${
                    item.color ? "text-red-500" : "text-gray-900"
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
        title={`Chỉnh sửa ${
          editField === "name"
            ? "tên"
            : editField === "email"
            ? "email"
            : editField === "phoneNumber"
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
            label={`Nhập ${
              editField === "name"
                ? "tên"
                : editField === "email"
                ? "email"
                : editField === "phoneNumber"
                ? "số điện thoại"
                : editField === "address"
                ? "địa chỉ"
                : "ngày sinh"
            } mới`}
            type={
              editField === "email"
                ? "email"
                : editField === "phoneNumber"
                ? "tel"
                : editField === "birthdate"
                ? "date"
                : "text"
            }
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
          />
        </Box>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        title="Xác nhận đăng xuất"
        onClose={() => setShowLogoutModal(false)}
        actions={[
          {
            text: "Hủy",
            onClick: () => setShowLogoutModal(false),
            disabled: loggingOut,
          },
          {
            text: loggingOut ? "Đang đăng xuất..." : "Đăng xuất",
            onClick: handleLogout,
            primary: true,
            danger: true,
            disabled: loggingOut,
          },
        ]}
      >
        <Box className="p-4">
          <Box className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut size={24} className="text-red-600" />
            </div>
            <Box>
              <Text className="font-medium text-gray-900 mb-1">
                Bạn có chắc chắn muốn đăng xuất?
              </Text>
              <Text className="text-sm text-gray-600">
                Bạn sẽ cần đăng nhập lại để sử dụng ứng dụng.
              </Text>
            </Box>
          </Box>

          {loggingOut && (
            <Box className="flex items-center justify-center mt-4">
              <div className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mr-2"></div>
              <Text className="text-sm text-gray-600">Đang xử lý...</Text>
            </Box>
          )}
        </Box>
      </Modal>
    </Page>
  );
};

export default ProfilePage;
