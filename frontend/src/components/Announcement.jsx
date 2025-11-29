import { Calendar, Megaphone, Plus, Trash, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { DashboardHeader } from "../ui/DashboardHeader";
import { DashboardSidebar } from "../ui/DashboardSidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Textarea } from "../ui/Textarea";

const initialAnnouncements = [
  {
    id: 1,
    title: "New Menu Items Available!",
    date: "2024-03-15",
    type: "update",
    content: "Try our new Vegan Filipino dishes!",
  },
  {
    id: 2,
    title: "Extended Operating Hours",
    date: "2024-03-10",
    type: "info",
    content: "We are now open until 11 PM on weekends.",
  },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const getTypeColor = (type) => {
    switch (type) {
      case "update":
        return "bg-blue-500 text-white";
      case "promo":
        return "bg-pink-500 text-white";
      case "alert":
        return "bg-red-500 text-white";
      case "event":
        return "bg-green-500 text-white";
      case "info":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const handlePost = () => {
    if (!title || !type || !content || !date) return;
    const newAnnouncement = { id: Date.now(), title, type, content, date };
    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setType("");
    setContent("");
    setDate("");
    setOpenModal(false);
  };

  const handleDelete = (id) =>
    setAnnouncements(announcements.filter((a) => a.id !== id));

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardHeader />
        <main className="px-8 py-6 space-y-6">
          {/* Header + Post Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-black">Announcements</h1>
              </div>
              <p className="text-gray-500 text-sm">
                Stay updated with the latest news and updates from your website.
              </p>
            </div>

            {/* Post Announcement Modal */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" /> Post Announcement
                </Button>
              </DialogTrigger>

              <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg z-50">
                {/* Modal Header */}
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-center">
                    Post Announcement
                  </DialogTitle>
                </DialogHeader>

                {/* Close Button Top Right */}
                <DialogClose asChild>
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </DialogClose>

                <div className="space-y-4 mt-2">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <Input
                      placeholder="Announcement title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="promo">Promo</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Content
                    </label>
                    <Textarea
                      placeholder="Announcement content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handlePost}
                  >
                    Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Announcement List */}
          <div className="space-y-4">
            {announcements.map((a) => (
              <Card key={a.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(a.type)}>{a.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{a.title}</CardTitle>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(a.id)}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{a.content}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {a.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
