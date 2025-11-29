// Feedback.jsx
import { AlertCircle, MessageSquare, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
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
import { Textarea } from "../ui/Textarea";

// StatsCard with Orders.jsx style
const StatsCard = ({ title, value, icon: Icon, iconColor }) => {
  const gradientMap = {
    "bg-yellow-400": "bg-gradient-to-br from-yellow-400 to-yellow-300",
    "bg-blue-400": "bg-gradient-to-br from-blue-400 to-blue-300",
    "bg-green-500": "bg-gradient-to-br from-green-500 to-green-400",
    "bg-orange-400": "bg-gradient-to-br from-orange-400 to-orange-300",
  };
  const gradientClass = gradientMap[iconColor] || "bg-gray-400";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 relative flex items-start gap-4">
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-lg ${gradientClass} absolute -top-6 left-5 shadow-lg`}
      >
        {Icon && <Icon size={28} className="text-white" />}
      </div>
      <div className="flex-1 pl-20">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

// Sample feedback data
const feedbackData = [
  {
    id: 1,
    customer: "Juan Dela Cruz",
    email: "juan@email.com",
    rating: 5,
    comment: "Excellent food quality and fast delivery!",
    date: "2024-03-15",
    status: "resolved",
    orderId: "ORD-001",
  },
  {
    id: 2,
    customer: "Maria Santos",
    email: "maria@email.com",
    rating: 4,
    comment: "Good food but delivery took longer than expected.",
    date: "2024-03-14",
    status: "pending",
    orderId: "ORD-002",
  },
  {
    id: 3,
    customer: "Pedro Reyes",
    email: "pedro@email.com",
    rating: 5,
    comment: "Best Filipino restaurant! Love the authentic taste.",
    date: "2024-03-13",
    status: "resolved",
    orderId: "ORD-003",
  },
];

export default function Feedback() {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState("");
  const { toast: triggerToast } = useToast();

  const handleRespond = () => {
    if (!response.trim()) return;
    triggerToast({
      title: "Response Sent",
      description: `Your response has been sent to ${selectedFeedback.customer}`,
    });
    setResponse("");
    setSelectedFeedback(null);
  };

  const getStatusBadge = (status) =>
    status === "resolved" ? (
      <Badge className="bg-green-500 text-white">Resolved</Badge>
    ) : (
      <Badge className="bg-yellow-300 text-black">Pending</Badge>
    );

  // Stats calculations
  const avgRating = (
    feedbackData.reduce((acc, f) => acc + f.rating, 0) / feedbackData.length
  ).toFixed(1);
  const totalFeedback = feedbackData.length;
  const pendingCount = feedbackData.filter(
    (f) => f.status === "pending"
  ).length;
  const positiveCount = feedbackData.filter((f) => f.rating >= 4).length;

  const statsCards = [
    {
      title: "Average Rating",
      value: avgRating,
      icon: Star,
      iconColor: "bg-yellow-400",
    },
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: MessageSquare,
      iconColor: "bg-blue-400",
    },
    {
      title: "Pending Review",
      value: pendingCount,
      icon: AlertCircle,
      iconColor: "bg-orange-400",
    },
    {
      title: "Positive Reviews",
      value: positiveCount,
      icon: ThumbsUp,
      iconColor: "bg-green-500",
    },
  ];

  return (
    <div className="pl-64 min-h-screen w-full bg-[#F4F6F9]">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Customer Feedback
            </h1>
            <p className="text-gray-500">
              Monitor and respond to customer reviews
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, idx) => (
              <StatsCard
                key={idx}
                title={card.title}
                value={card.value}
                icon={card.icon}
                iconColor={card.iconColor}
              />
            ))}
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {feedbackData.map((feedback) => (
              <Card
                key={feedback.id}
                className="hover:shadow-xl transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-lg font-semibold">
                          {feedback.customer}
                        </p>
                        {getStatusBadge(feedback.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{feedback.email}</span>
                        <span>•</span>
                        <span>Order: {feedback.orderId}</span>
                        <span>•</span>
                        <span>{feedback.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < feedback.rating
                              ? "fill-current text-green-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 mb-4">{feedback.comment}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedFeedback(feedback)}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Respond to Feedback</DialogTitle>
                      </DialogHeader>
                      <DialogClose asChild>
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                          X
                        </button>
                      </DialogClose>
                      <div className="space-y-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Customer:
                          </p>
                          <p className="font-medium">
                            {selectedFeedback?.customer}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Original Feedback:
                          </p>
                          <p className="text-sm">{selectedFeedback?.comment}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Your Response:
                          </label>
                          <Textarea
                            placeholder="Type your response here..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleRespond}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Send Response
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
