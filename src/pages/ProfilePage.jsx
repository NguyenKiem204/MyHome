// src/pages/ProfilePage.jsx
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
} from "lucide-react";
import "../css/profile.css";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0981234567",
    address: "Hà Nội, Việt Nam",
    birthdate: "01/01/1990",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [avatar, setAvatar] = useState();
  useEffect(() => {
    return () => avatar && URL.revokeObjectURL(avatar.preview);
  }, [avatar]);
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

  return (
    <Page className="profile-page">
      <Box className="profile-header">
        <Box className="avatar-container">
          <Avatar
            className="profile-avatar"
            size={100}
            src={avatar?.preview || "https://via.placeholder.com/100"}
          />
          <Box className="avatar-edit-btn">
            <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
              <Camera size={16} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImage(e)}
              />
            </label>
          </Box>
        </Box>
        <Text className="profile-name">{profileData.name}</Text>
        <Button
          variant="secondary"
          className="edit-profile-btn"
          onClick={() => handleEdit("name", profileData.name)}
          suffixIcon={<Edit size={16} />}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <Box className="profile-details">
        <Text className="section-title">Thông tin cá nhân</Text>
        <List divider={false}>
          <List.Item
            title="Email"
            prefix={<Mail size={20} />}
            suffix={
              <Box
                className="info-edit"
                onClick={() => handleEdit("email", profileData.email)}
              >
                <Text>{profileData.email}</Text>
                <Edit size={16} />
              </Box>
            }
          />
          <List.Item
            title="Số điện thoại"
            prefix={<Phone size={20} />}
            suffix={
              <Box
                className="info-edit"
                onClick={() => handleEdit("phone", profileData.phone)}
              >
                <Text>{profileData.phone}</Text>
                <Edit size={16} />
              </Box>
            }
          />
          <List.Item
            title="Địa chỉ"
            prefix={<MapPin size={20} />}
            suffix={
              <Box
                className="info-edit"
                onClick={() => handleEdit("address", profileData.address)}
              >
                <Text>{profileData.address}</Text>
                <Edit size={16} />
              </Box>
            }
          />
          <List.Item
            title="Ngày sinh"
            prefix={<Calendar size={20} />}
            suffix={
              <Box
                className="info-edit"
                onClick={() => handleEdit("birthdate", profileData.birthdate)}
              >
                <Text>{profileData.birthdate}</Text>
                <Edit size={16} />
              </Box>
            }
          />
        </List>
      </Box>

      <Box className="profile-menu">
        <Text className="section-title">Cài đặt tài khoản</Text>
        <List divider={false}>
          {profileMenuItems.map((item) => (
            <List.Item
              key={item.id}
              title={item.title}
              prefix={item.icon}
              suffix={item.id !== "logout" ? <ChevronRight size={16} /> : null}
              onClick={() => (window.location.href = item.path)}
              titleClassName={item.color ? { color: item.color } : {}}
            />
          ))}
        </List>
      </Box>

      {/* Modal chỉnh sửa thông tin */}
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
        <Box className="edit-modal-content">
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
          />
        </Box>
      </Modal>
    </Page>
  );
};

export default ProfilePage;
