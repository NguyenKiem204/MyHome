// src/pages/FeedbackPage.jsx
import React, { useState } from "react";
import { Box, Page, Text, Input, Button, Radio, Tabs, List, Icon, Sheet } from "zmp-ui";
import { Send, Camera, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import "../css/feedback.css";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [attachments, setAttachments] = useState([]);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const handleAddAttachment = () => {
    // Giả lập thêm tệp đính kèm
    const newAttachment = {
      id: Date.now(),
      name: `Attachment_${attachments.length + 1}.jpg`,
      size: "1.2 MB",
      type: "image/jpeg",
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    // Xử lý gửi phản ánh
    console.log({
      subject,
      content,
      feedbackType,
      attachments,
    });

    // Reset form
    setSubject("");
    setContent("");
    setFeedbackType("suggestion");
    setAttachments([]);

    // Hiển thị thông báo thành công
    setShowSuccessSheet(true);
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
        return <CheckCircle size={16} color="#10B981" />;
      case "processing":
        return <Clock size={16} color="#F59E0B" />;
      default:
        return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  return (
    <Page className="feedback-page">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="feedback-tabs"
      >
        <Tabs.Tab key="new" label="Gửi phản ánh">
          <Box className="feedback-form">
            <Text className="form-title">Gửi phản ánh của bạn</Text>

            <Box className="form-group">
              <Text className="form-label">Loại phản ánh</Text>
              <Radio.Group
                value={feedbackType}
                onChange={setFeedbackType}
              >
                <Box className="radio-options">
                  <Radio value="suggestion">Đề xuất</Radio>
                  <Radio value="problem">Sự cố</Radio>
                  <Radio value="question">Câu hỏi</Radio>
                </Box>
              </Radio.Group>
            </Box>

            <Box className="form-group">
              <Text className="form-label">Tiêu đề</Text>
              <Input
                placeholder="Nhập tiêu đề phản ánh"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Box>

            <Box className="form-group">
              <Text className="form-label">Nội dung</Text>
              <Input.TextArea
                placeholder="Mô tả chi tiết phản ánh của bạn"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </Box>

            <Box className="form-group">
              <Text className="form-label">Tệp đính kèm</Text>
              <Box className="attachments-container">
                {attachments.map((file) => (
                  <Box key={file.id} className="attachment-item">
                    <Box className="attachment-info">
                      <Clock size={16} />
                      <Text className="attachment-name">{file.name}</Text>
                      <Text className="attachment-size">({file.size})</Text>
                    </Box>
                    <Button
                      className="remove-attachment-btn"
                      variant="text"
                      onClick={() => handleRemoveAttachment(file.id)}
                      icon={<X size={16} />}
                    />
                  </Box>
                ))}

                <Button
                  className="add-attachment-btn"
                  variant="secondary"
                  suffixIcon={<Camera size={16} />}
                  onClick={handleAddAttachment}
                >
                  Thêm tệp đính kèm
                </Button>
              </Box>
            </Box>

            <Button
              className="submit-btn"
              fullWidth
              disabled={!subject || !content}
              onClick={handleSubmit}
              suffixIcon={<Send size={16} />}
            >
              Gửi phản ánh
            </Button>
          </Box>
        </Tabs.Tab>

        <Tabs.Tab key="history" label="Lịch sử phản ánh">
          <Box className="feedback-history">
            {feedbackHistory.length > 0 ? (
              <List>
                {feedbackHistory.map((item) => (
                  <List.Item
                    key={item.id}
                    title={
                      <Box className="feedback-history-item-title">
                        <Text>{item.subject}</Text>
                        {getStatusIcon(item.status)}
                      </Box>
                    }
                    description={
                      <Box className="feedback-history-item-desc">
                        <Text>
                          {item.date} - {" "}
                          <Text
                            style={{
                              color: item.status === "completed" ? "#10B981" :
                                item.status === "processing" ? "#F59E0B" : "#6B7280"
                            }}
                          >
                            {item.status === "completed" ? "Đã xử lý" :
                              item.status === "processing" ? "Đang xử lý" : "Chờ xử lý"}
                          </Text>
                        </Text>
                      </Box>
                    }
                    onClick={() => window.location.href = `/feedback/${item.id}`}
                  />
                ))}
              </List>
            ) : (
              <Box className="empty-history">
                <Text>Bạn chưa có phản ánh nào</Text>
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
      >
        <Box className="success-sheet">
          <Box className="success-icon">
            <CheckCircle size={50} color="#10B981" />
          </Box>
          <Text className="success-title">Gửi phản ánh thành công!</Text>
          <Text className="success-message">
            Cảm ơn bạn đã gửi phản ánh. Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể.
          </Text>
          <Button
            className="success-btn"
            fullWidth
            onClick={() => {
              setShowSuccessSheet(false);
              setActiveTab("history");
            }}
          >
            Xem lịch sử phản ánh
          </Button>
        </Box>
      </Sheet>
    </Page>
  );
};

export default FeedbackPage;