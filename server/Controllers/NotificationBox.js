import { NoticeBox } from "../Models/notification.js"; // adjust path as needed

export const pushNotification = async ({
  userId,          // receiver
  notifierId,      // sender
  kind,            // "answer" | "like" | "vote"
  questionId,
  answersId = null // optional
}) => {
  try {
    const newNotice = {
      kind,
      questionId,
      answersId,
      notifier: notifierId
    };

    await NoticeBox.findOneAndUpdate(
      { user: userId },
      { $push: { notices: newNotice } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("❌ Error pushing notification:", err);
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notiBox = await NoticeBox.findOne({ user: userId })
      .populate("notices.notifier", "username")
      .populate("notices.questionId", "title")
      .populate("notices.answersId", "_id")
      .lean();

    res.status(200).json({ notifications: notiBox?.notices || [] });
  } catch (err) {
    console.error("❌ Failed to get notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
};
