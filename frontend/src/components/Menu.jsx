// Menu.jsx
import {
  Coffee,
  Drumstick,
  Edit,
  IceCream,
  Plus,
  Soup,
  Trash2,
} from "lucide-react";
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
} from "../ui/Dialog";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { StatsCard } from "../ui/StatsCard";

// Categories for dropdown
const categories = [
  "Best Seller",
  "Most Bought",
  "New Arrival",
  "Limited Offer",
  "Recommended",
  "Combo Meal",
  "Specialty",
];

// Groups for tab organization
const groups = [
  "Main Course",
  "Dessert",
  "Appetizer",
  "Beverage",
  "Combo Meal",
];

// Initial menu items
const initialMenuItems = [
  {
    id: 1,
    name: "Chicken Adobo",
    price: "₱280",
    description: "Served with rice",
    category: "Best Seller",
    group: "Main Course",
  },
  {
    id: 2,
    name: "Pork Adobo",
    price: "₱300",
    description: "Served with rice",
    category: "Specialty",
    group: "Main Course",
  },
  {
    id: 3,
    name: "Lumpiang Shanghai",
    price: "₱180",
    description: "Served with rice",
    category: "Most Bought",
    group: "Appetizer",
  },
  {
    id: 4,
    name: "Halo-Halo",
    price: "₱150",
    description: "Sweet treat with ice cream",
    category: "Specialty",
    group: "Dessert",
  },
  {
    id: 5,
    name: "Calamansi Juice",
    price: "₱80",
    description: "Fresh lime juice",
    category: "Recommended",
    group: "Beverage",
  },
  {
    id: 6,
    name: "Chicken + Pancit Canton Combo",
    price: "₱350",
    description: "Chicken Adobo with Pancit Canton",
    category: "Combo Meal",
    group: "Combo Meal",
  },
];

// Badge color helper
const getCategoryColor = (category) => {
  switch (category) {
    case "Best Seller":
      return "bg-yellow-500 text-white";
    case "Specialty":
      return "bg-purple-500 text-white";
    case "Most Bought":
      return "bg-blue-500 text-white";
    case "New Arrival":
      return "bg-green-500 text-white";
    case "Limited Offer":
      return "bg-orange-500 text-white";
    case "Recommended":
      return "bg-pink-500 text-white";
    case "Combo Meal":
      return "bg-indigo-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "Best Seller":
      return <Drumstick className="h-4 w-4 text-white" />;
    case "Specialty":
      return <Soup className="h-4 w-4 text-white" />;
    case "Most Bought":
      return <Coffee className="h-4 w-4 text-white" />;
    case "New Arrival":
      return <Drumstick className="h-4 w-4 text-white" />;
    case "Limited Offer":
      return <Coffee className="h-4 w-4 text-white" />;
    case "Recommended":
      return <IceCream className="h-4 w-4 text-white" />;
    case "Combo Meal":
      return <Drumstick className="h-4 w-4 text-white" />;
    default:
      return null;
  }
};

// Menu item card
const MenuItemCard = ({ item, onEdit }) => (
  <Card className="hover:shadow-xl transition p-4">
    <CardContent className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-black">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
        <div className="flex gap-2">
          <Badge
            className={`flex items-center gap-1 ${getCategoryColor(
              item.category
            )}`}
          >
            {getCategoryIcon(item.category)} {item.category}
          </Badge>
          <Badge className="bg-gray-200 text-gray-800">{item.group}</Badge>
        </div>
      </div>
      <div className="text-right flex flex-col justify-between">
        <div className="text-xl font-bold text-black mb-2">{item.price}</div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Menu() {
  const [menu, setMenu] = useState(initialMenuItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item = null) => {
    setSelectedItem(
      item || {
        name: "",
        price: "",
        description: "",
        category: "Best Seller",
        group: "Main Course",
      }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (!selectedItem.name || !selectedItem.price) return;
    if (selectedItem.id) {
      setMenu((prev) =>
        prev.map((i) => (i.id === selectedItem.id ? selectedItem : i))
      );
    } else {
      setMenu((prev) => [...prev, { ...selectedItem, id: Date.now() }]);
    }
    closeModal();
  };

  // Get unique groups for tabs
  const tabs = Array.from(new Set(menu.map((item) => item.group)));

  // Stats cards based on groups
  const statsCards = [
    {
      title: "Main Course",
      value: menu.filter((i) => i.group === "Main Course").length,
      icon: Drumstick,
      iconColor: "bg-blue-400",
    },
    {
      title: "Appetizer",
      value: menu.filter((i) => i.group === "Appetizer").length,
      icon: Coffee,
      iconColor: "bg-yellow-400",
    },
    {
      title: "Dessert",
      value: menu.filter((i) => i.group === "Dessert").length,
      icon: IceCream,
      iconColor: "bg-pink-400",
    },
    {
      title: "Beverage",
      value: menu.filter((i) => i.group === "Beverage").length,
      icon: Soup,
      iconColor: "bg-green-400",
    },
    {
      title: "Combo Meal",
      value: menu.filter((i) => i.group === "Combo Meal").length,
      icon: Drumstick,
      iconColor: "bg-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardHeader />
        <main className="px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Menu Management</h1>
              <p className="text-gray-500 mb-6">
                Manage your Filipino cuisine menu items
              </p>
            </div>
            <Button
              onClick={() => openModal()}
              className="bg-accent hover:bg-accent/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-6">
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

          {/* Tabs */}
          <Tabs defaultValue={tabs[0]} className="w-full">
            <TabsList className="grid grid-cols-5 gap-2 mt-4">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex items-center justify-center gap-1"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {menu
                    .filter((item) => item.group === tab)
                    .map((item) => (
                      <MenuItemCard key={item.id} item={item} onEdit={openModal} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Modal */}
          {modalOpen && (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg z-50">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-center">
                    {selectedItem?.id ? "Edit Menu Item" : "Add Menu Item"}
                  </DialogTitle>
                </DialogHeader>
                <DialogClose asChild>
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    X
                  </button>
                </DialogClose>
                <div className="space-y-3 mt-2">
                  <Input
                    name="name"
                    placeholder="Name"
                    value={selectedItem?.name}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    name="price"
                    placeholder="Price"
                    value={selectedItem?.price}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({ ...prev, price: e.target.value }))
                    }
                  />
                  <Input
                    name="description"
                    placeholder="Description"
                    value={selectedItem?.description}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />

                  {/* Category */}
                  <Select
                    value={selectedItem?.category}
                    onValueChange={(val) =>
                      setSelectedItem((prev) => ({ ...prev, category: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Group */}
                  <Select
                    value={selectedItem?.group}
                    onValueChange={(val) =>
                      setSelectedItem((prev) => ({ ...prev, group: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((grp) => (
                        <SelectItem key={grp} value={grp}>
                          {grp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}
