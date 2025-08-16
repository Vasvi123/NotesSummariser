import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Save, Send, ArrowLeft, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

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
    // Load from localStorage
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
  const handleCancel = () => setEditedSummary(summaryData.summary) && setIsEditing(false);

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
    } catch (err) {
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
      const response = await fetch("/api/email/send", {
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
      } else toast.error(data.error || "Failed to send email");
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
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Generated Summary</h1>
      </div>

      <div className="summary-container">
        <div className="summary-header">
          <div>
            <h2 className="text-xl font-semibold mb-2">Custom Instructions Applied</h2>
            <p className="text-gray-600">{summaryData.customPrompt}</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={handleEdit} className="btn btn-secondary">
                <Edit3 size={16} /> Edit
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="btn btn-success">
                  <Save size={16} /> Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </>
            )}
            <button onClick={handleCopySummary} className="btn btn-secondary">
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="summary-content">
          {isEditing ? (
            <textarea
              className="summary-content editable"
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={20}
            />
          ) : (
            <div>{editedSummary}</div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={() => setShowEmailForm(!showEmailForm)} className="btn btn-primary">
            <Send size={16} /> Share via Email
          </button>
        </div>
      </div>

      {showEmailForm && (
        <div className="email-form">
          <h3 className="text-xl font-semibold mb-4">Send Summary via Email</h3>
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>Recipient Emails</label>
              {emailData.recipients.map((email, index) => (
                <div key={index} className="recipient-row">
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => updateRecipient(index, e.target.value)}
                    placeholder="recipient@example.com"
                    required
                  />
                  {emailData.recipients.length > 1 && (
                    <button type="button" onClick={() => removeRecipient(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addRecipient}>
                + Add Another Recipient
              </button>
            </div>

            <div className="form-group">
              <label>Email Subject</label>
              <input
                type="text"
                className="form-input"
                value={emailData.subject}
                onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Sender Name</label>
              <input
                type="text"
                className="form-input"
                value={emailData.senderName}
                onChange={(e) => setEmailData((prev) => ({ ...prev, senderName: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn btn-success" disabled={isSendingEmail}>
                {isSendingEmail ? "Sending..." : "Send Email"}
              </button>
              <button type="button" onClick={() => setShowEmailForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Summary Details</h3>
        <p><strong>Generated:</strong> {new Date(summaryData.timestamp).toLocaleString()}</p>
        <p><strong>Original Length:</strong> {summaryData.originalTranscript.length} characters</p>
        <p><strong>Summary Length:</strong> {editedSummary.length} characters</p>
      </div>
    </div>
  );
};

export default SummaryPage;


