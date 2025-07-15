// src/pages/FeedbackPage.jsx
import React, { useState } from "react";
import {
  Box,
  Page,
  Text,
  Input,
  Button,
  Radio,
  Tabs,
  List,
  Icon,
  Sheet,
} from "zmp-ui";
import { Send, Camera, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import api from "../utils/api";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [feedbackType, setFeedbackType] = useState("Suggest");
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const BASE_URL =
    "https://usable-dinosaurs-b795619e4a.strapiapp.com/api/feedbacks";

  const handleSubmit = async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Type: feedbackType,
          Title: subject,
          Content: content,
          PhoneNumber: "0987654321", // Hoặc lấy từ state nếu có input
        }),
      });
      if (response.ok) {
        setSubject("");
        setContent("");
        setFeedbackType("Suggest");
        setShowSuccessSheet(true);
      } else {
        alert("Gửi phản hồi thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi phản hồi!");
      console.error(error);
    }
  };

  const feedbackHistory = [
    {
      id: 1,
      subject: "Đề xuất thêm tính năng thông báo",
      date: "15/05/2025",
      status: "completed",
      type: "suggestion",
    },
    {
      id: 2,
      subject: "Vấn đề về hiển thị giao diện",
      date: "10/05/2025",
      status: "processing",
      type: "problem",
    },
    {
      id: 3,
      subject: "Câu hỏi về chính sách bảo mật",
      date: "01/05/2025",
      status: "completed",
      type: "question",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "processing":
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  return (
    <Page className="bg-gray-50 mt-16 mb-5">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="zmp-tabs-custom"
      >
        <Tabs.Tab key="new" label="Gửi phản ánh">
          <Box className="p-4">
            <Text className="text-xl font-bold mb-6 text-gray-800">
              Gửi phản ánh của bạn
            </Text>

            <Box className="mb-5">
              <Text className="text-sm font-medium mb-2 text-gray-700">
                Loại phản ánh
              </Text>
              <Radio.Group value={feedbackType} onChange={setFeedbackType}>
                <Box className="flex flex-col space-y-2">
                  <Radio value="Suggest" className="flex items-center">
                    <span className="ml-2">Đề xuất</span>
                  </Radio>
                  <Radio value="Issue" className="flex items-center">
                    <span className="ml-2">Sự cố</span>
                  </Radio>
                  <Radio value="Question" className="flex items-center">
                    <span className="ml-2">Câu hỏi</span>
                  </Radio>
                </Box>
              </Radio.Group>
            </Box>

            <Box className="mb-5">
              <Text className="text-sm font-medium mb-2 text-gray-700">
                Tiêu đề
              </Text>
              <Input
                placeholder="Nhập tiêu đề phản ánh"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="zmp-input-custom"
              />
            </Box>

            <Box className="mb-5">
              <Text className="text-sm font-medium mb-2 text-gray-700">
                Nội dung
              </Text>
              <Input.TextArea
                placeholder="Mô tả chi tiết phản ánh của bạn"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="zmp-textarea-custom"
              />
            </Box>

            <Button
              fullWidth
              disabled={!subject || !content}
              onClick={handleSubmit}
              suffixIcon={<Send size={16} />}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              Gửi phản ánh
            </Button>
          </Box>
        </Tabs.Tab>

        <Tabs.Tab key="history" label="Lịch sử phản ánh">
          <Box className="p-4">
            {feedbackHistory.length > 0 ? (
              <List className="space-y-2">
                {feedbackHistory.map((item) => (
                  <List.Item
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm"
                    title={
                      <Box className="flex justify-between items-center w-full">
                        <Text className="font-medium text-gray-800 truncate">
                          {item.subject}
                        </Text>
                        <div className="ml-2 flex-shrink-0">
                          {getStatusIcon(item.status)}
                        </div>
                      </Box>
                    }
                    description={
                      <Box className="mt-1">
                        <Text className="text-sm text-gray-600">
                          {item.date} -{" "}
                          <span
                            className={
                              item.status === "completed"
                                ? "text-green-500"
                                : item.status === "processing"
                                ? "text-yellow-500"
                                : "text-gray-500"
                            }
                          >
                            {item.status === "completed"
                              ? "Đã xử lý"
                              : item.status === "processing"
                              ? "Đang xử lý"
                              : "Chờ xử lý"}
                          </span>
                        </Text>
                      </Box>
                    }
                    onClick={() =>
                      (window.location.href = `/feedback/${item.id}`)
                    }
                  />
                ))}
              </List>
            ) : (
              <Box className="flex flex-col items-center justify-center py-10">
                <Text className="text-gray-500">Bạn chưa có phản ánh nào</Text>
              </Box>
            )}
          </Box>
        </Tabs.Tab>
      </Tabs>

      {/* Sheet thông báo thành công */}
      <Sheet
        visible={showSuccessSheet}
        onClose={() => setShowSuccessSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
        className="zmp-sheet-custom"
      >
        <Box className="p-6 flex flex-col items-center mb-8">
          <Box className="mb-4">
            <CheckCircle size={50} className="text-green-500" />
          </Box>
          <Text className="text-xl font-bold mb-2 text-gray-800">
            Gửi phản ánh thành công!
          </Text>
          <Text className="text-center text-gray-600 mb-6">
            Cảm ơn bạn đã gửi phản ánh. Chúng tôi sẽ xem xét và phản hồi sớm
            nhất có thể.
          </Text>
          <Button
            fullWidth
            onClick={() => {
              setShowSuccessSheet(false);
              setActiveTab("history");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Xem lịch sử phản ánh
          </Button>
        </Box>
      </Sheet>
    </Page>
  );
};

export default FeedbackPage;
