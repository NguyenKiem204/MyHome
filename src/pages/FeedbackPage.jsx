// src/pages/FeedbackPage.jsx
import React, { useState, useEffect } from "react";
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
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [feedbackType, setFeedbackType] = useState("Suggest");
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const user = useAuthStore((state) => state.user);

  const BASE_URL = "/feedbacks";

  const handleSubmit = async () => {
    try {
      const data = {
        data: {
          Type: feedbackType,
          Title: subject,
          Content: content,
          Resident: user?.id,
        },
      };
      const response = await api.post(BASE_URL, data);
      if (response.status === 200 || response.status === 201) {
        setSubject("");
        setContent("");
        setFeedbackType("Suggest");
        setShowSuccessSheet(true);
        fetchFeedbackHistory();
      } else {
        alert("Gửi phản hồi thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi phản hồi!");
      console.error(error);
    }
  };

  // Lấy lịch sử feedback từ API
  const fetchFeedbackHistory = async () => {
    if (!user?.id) return;
    setLoadingHistory(true);
    try {
      const res = await api.get(`/feedbacks?Resident=${user.id}`);
      const list = res.data?.data || res.data || [];
      setFeedbackHistory(list);
    } catch (err) {
      setFeedbackHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Tự động load khi vào tab history
  useEffect(() => {
    if (activeTab === "history") {
      fetchFeedbackHistory();
    }
    // eslint-disable-next-line
  }, [activeTab, user?.id]);

  // Sửa getStatusIcon để dùng StatusFeedback
  const getStatusIcon = (status, size = 16) => {
    if (!status || status === "Chưa xử lý" || status === null) {
      return <AlertCircle size={size} className="text-gray-400" />;
    }
    if (status === "Đang xử lý") {
      return <Clock size={size} className="text-yellow-500" />;
    }
    if (status === "Đã xử lý" || status === "completed") {
      return <CheckCircle size={size} className="text-green-500" />;
    }
    return <AlertCircle size={size} className="text-gray-400" />;
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
            {loadingHistory ? (
              <Box className="flex flex-col items-center justify-center py-10">
                <Text className="text-gray-500">Đang tải...</Text>
              </Box>
            ) : feedbackHistory.length > 0 ? (
              <div className="space-y-4">
                {feedbackHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 transition hover:shadow-lg cursor-pointer border border-gray-100"
                    onClick={() => {
                      setSelectedFeedback(item);
                      setShowDetail(true);
                    }}
                  >
                    {/* Icon trạng thái lớn */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(item.StatusFeedback, 32)}
                    </div>
                    {/* Nội dung feedback */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Text className="font-semibold text-gray-900 truncate text-base">
                          {item.Title || item.title}
                        </Text>
                        <span
                          className={
                            !item.StatusFeedback ||
                            item.StatusFeedback === "Chưa xử lý" ||
                            item.StatusFeedback === null
                              ? "text-gray-400 font-medium"
                              : item.StatusFeedback === "Đang xử lý"
                              ? "text-yellow-500 font-medium"
                              : "text-green-500 font-medium"
                          }
                        >
                          {!item.StatusFeedback ||
                          item.StatusFeedback === "Chưa xử lý" ||
                          item.StatusFeedback === null
                            ? "Chờ xử lý"
                            : item.StatusFeedback}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                      {item.Content || item.content ? (
                        <div className="text-gray-700 text-sm line-clamp-2">
                          {item.Content || item.content}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Box className="flex flex-col items-center justify-center py-10">
                <Text className="text-gray-500">Bạn chưa có phản ánh nào</Text>
              </Box>
            )}
          </Box>
        </Tabs.Tab>
      </Tabs>

      {/* Sheet chi tiết feedback */}
      <Sheet
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        autoHeight
        mask
        handler
        swipeToClose
        className="zmp-sheet-custom"
      >
        {selectedFeedback && (
          <Box className="p-6 flex flex-col gap-2">
            <Text className="text-xl font-bold mb-2 text-gray-800">
              {selectedFeedback.Title}
            </Text>
            <Text className="text-gray-600 mb-2">
              Ngày gửi:{" "}
              {selectedFeedback.createdAt
                ? new Date(selectedFeedback.createdAt).toLocaleString()
                : ""}
            </Text>
            <Text className="mb-2">
              <b>Trạng thái:</b>{" "}
              {selectedFeedback.StatusFeedback || "Chờ xử lý"}
            </Text>
            <Text className="mb-2">
              <b>Nội dung:</b> {selectedFeedback.Content}
            </Text>
          </Box>
        )}
      </Sheet>

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
