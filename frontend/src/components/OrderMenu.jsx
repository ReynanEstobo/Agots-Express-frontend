import {
  Flame,
  Gift,
  Heart as HeartIcon,
  Home,
  IceCream,
  Search,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMenuItems } from "../api/MenuAPI";
import CartSheet from "../components/CartSheet";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

const tabs = [
  { key: "Main Course", label: "Main Course" },
  { key: "Dessert", label: "Dessert" },
  { key: "Appetizer", label: "Appetizer" },
  { key: "Beverage", label: "Beverage" },
  { key: "Combo Meal", label: "Combo Meal" },
];

const getCategoryColor = (category) => {
  switch (category) {
    case "Best Seller":
      return "bg-yellow-500 text-white";
    case "Most Bought":
      return "bg-blue-500 text-white";
    case "New Arrival":
      return "bg-green-500 text-white";
    case "Limited Offer":
      return "bg-orange-500 text-white";
    case "Recommended":
      return "bg-pink-500 text-white";
    case "Specialty":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-200 text-[#0A1A3F]";
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "Best Seller":
      return <Flame className="h-4 w-4 text-white" />;
    case "Most Bought":
      return <Star className="h-4 w-4 text-white" />;
    case "New Arrival":
      return <Zap className="h-4 w-4 text-white" />;
    case "Limited Offer":
      return <Gift className="h-4 w-4 text-white" />;
    case "Recommended":
      return <HeartIcon className="h-4 w-4 text-white" />;
    case "Specialty":
      return <IceCream className="h-4 w-4 text-white" />;
    default:
      return null;
  }
};

export default function OrderMenu() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Main Course");
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart, items: cartItems } = useCart();

  const userId = sessionStorage.getItem("user_id");

  // ---------------- LOGIN PROTECTION ----------------
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    if (!token || role !== "customer") {
      alert("You must be logged in as a customer to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  // ---------------- LOAD MENU ----------------
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await fetchMenuItems();
        setMenuItems(data || []);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = (items) =>
    items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddToCart = (item) => {
    if (!userId) {
      addToast({ description: "You must log in to add items to your cart." });
      navigate("/login");
      return;
    }

    addToCart(item, 1, ""); // Using context
    addToast({ description: `${item.name} added to cart` });
  };

  const MenuItemCard = ({ item }) => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-72">
      {item.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(http://localhost:5000/uploads/menu/${item.image})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-1">
        <h3 className="text-lg font-extrabold text-white drop-shadow-lg">
          {item.name}
        </h3>
        <p className="text-sm font-semibold text-yellow-300 drop-shadow-lg">
          ₱{item.price}
        </p>
      </div>

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4 space-y-2">
        <p className="text-sm text-gray-200">{item.description}</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {item.category && item.category !== "None" && (
            <Badge
              className={`flex items-center gap-1 ${getCategoryColor(
                item.category
              )} text-xs px-2 py-1 rounded-full`}
            >
              {getCategoryIcon(item.category)} {item.category}
            </Badge>
          )}
          <Badge className="bg-gray-200 text-gray-800 flex items-center gap-1 text-xs px-2 py-1 rounded-full">
            {item.group}
          </Badge>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 z-20">
        <Button
          onClick={() => handleAddToCart(item)}
          style={{ backgroundColor: "#F2C94C", color: "#0A1A3F" }}
          className="hover:bg-[#D4B13D] flex items-center justify-center p-2 rounded-lg"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F5F5F5", color: "#0A1A3F" }}
    >
      <header
        className="sticky top-0 border-b border-[#374A6B] z-40"
        style={{ backgroundColor: "#0A1A3F", color: "#FFFFFF" }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F2C94C] text-[#0A1A3F]">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Order Online</h1>
              <p className="text-xs text-[#D4D4D4]">Agot's Restaurant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/customer-dashboard">
              <Button
                style={{ color: "#FFFFFF" }}
                className="hover:bg-[#17254F] flex items-center gap-2"
              >
                <Home className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
            <CartSheet />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4C4C4C]" />
          <Input
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#0A1A3F",
              borderColor: "#374A6B",
            }}
            className="pl-12 h-12 text-lg"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredItems(
                  menuItems.filter((item) => item.group === tab.key)
                ).map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
