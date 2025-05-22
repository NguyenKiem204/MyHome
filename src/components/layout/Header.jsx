// src/components/layout/Header.jsx
import React from "react";
import { Box, Header as ZMPHeader, useNavigate } from "zmp-ui";
import { ChevronLeft, Bell, Search } from "lucide-react";
import "../../css/style.css";
const Header = () => {
  const navigate = useNavigate();
  const isHomePage = window.location.pathname === "/";

  return (
    <ZMPHeader
      className="custom-header"
      title="My Home"
      showBackIcon={!isHomePage}
      leftIcon={!isHomePage && <ChevronLeft size={24} />}
      onBackClick={() => navigate(-1)}
      
    >
      <Box className="header-actions">
        <Box 
          className="header-action-btn"
          onClick={() => navigate('/search')}
        >
          <Search size={22} />
        </Box>
        <Box 
          className="header-action-btn"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={22} />
        </Box>
      </Box>
    </ZMPHeader>
  );
};

export default Header;