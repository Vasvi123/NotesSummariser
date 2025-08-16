import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Save, Send, ArrowLeft, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const BACKEND_URL = "https://notessummariser.onrender.com"; // <-- Deployed backend URL

const SummaryPage = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    recipients: [""],
    subject: "",
    senderName: "Meeting Notes Summarizer",
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("summaryData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setSummaryData(data);
      setEditedSummary(data.summary);
      setEmailData((prev) => ({
        ...prev,
        subject: `Meeting Summary - ${new Date().toLocaleDateString()}`,
      }));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditedSummary(summaryData.summary);
    setIsEditing(false);
  };
  const handleSave = () => {
    if (editedSummary.trim() !== summaryData.summary) {
      const updatedData = { ...summaryData, summary: editedSummary };
      localStorage.setItem("summaryData", JSON.stringify(updatedData));
      setSummaryData(updatedData);
      toast.success("Summary updated successfully!");
    }
    setIsEditing(false);
  };
  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(editedSummary);
      setCopied(true);
      toast.success("Summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const validRecipients = emailData.recipients.filter((r) => r.trim());
    if (!validRecipients.length) return toast.error("Enter at least one recipient");
    if (!emailData.subject.trim()) return toast.error("Enter email subject");

    setIsSendingEmail(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: validRecipients,
          subject: emailData.subject,
          summary: editedSummary,
          senderName: emailData.senderName,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Email API error:", text);
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setShowEmailForm(false);
        setEmailData({
          recipients: [""],
          subject: `Meeting Summary - ${new Date().toLocaleDateString()}`,
          senderName: "Meeting Notes Summarizer",
        });
      } else {
        toast.error(data.error || "Failed to send email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const addRecipient = () =>
    setEmailData((prev) => ({ ...prev, recipients: [...prev.recipients, ""] }));
  const removeRecipient = (index) =>
    setEmailData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  const updateRecipient = (index, value) =>
    setEmailData((prev) => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => (i === index ? value : r)),
    }));

  if (!summaryData)
    return (
      <div className="loading">
        <div className="spinner"></div>Loading summary...
      </div>
    );

  return (
    <div className="container">
      {/* ... Your summary UI code remains the same ... */}
      {/* Only change is the fetch URL for email */}
    </div>
  );
};

export default SummaryPage;

