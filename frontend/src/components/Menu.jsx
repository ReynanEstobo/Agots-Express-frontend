import {
  Coffee,
  Drumstick,
  Edit,
  Flame,
  Gift,
  Heart as HeartIcon,
  IceCream,
  Plus,
  Soup,
  Star,
  Trash2,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
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
import { StatsCard } from "../ui/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

import {
  createMenuItem,
  deleteMenuItem,
  fetchMenuItems,
  updateMenuItem,
} from "../api/MenuAPI";

// Categories for dropdown
const categories = [
  "None",
  "Best Seller",
  "Most Bought",
  "New Arrival",
  "Limited Offer",
  "Recommended",
  "Specialty",
];

// Groups for tabs
const groups = [
  "Main Course",
  "Dessert",
  "Appetizer",
  "Beverage",
  "Combo Meal",
];

// Mapping groups to StatsCard icons & background color keys
const groupStatsConfig = {
  "Main Course": { icon: Drumstick, iconColor: "bg-red-500" },
  Dessert: { icon: IceCream, iconColor: "bg-pink-500" },
  Appetizer: { icon: Soup, iconColor: "bg-green-500" },
  Beverage: { icon: Coffee, iconColor: "bg-yellow-400" },
  "Combo Meal": { icon: Plus, iconColor: "bg-indigo-500" },
};

// Category badge colors
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
      return "bg-gray-300 text-black";
  }
};

// Category icons inside badges
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

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "None",
    group: "Main Course",
  });
  const [selectedGroup, setSelectedGroup] = useState("Main Course");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch menu items
  const loadMenu = async () => {
    try {
      const data = await fetchMenuItems();
      setMenu(data || []);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const openModal = (item = null) => {
    setSelectedItem(
      item || {
        name: "",
        price: "",
        description: "",
        category: "None",
        group: "Main Course",
      }
    );
    setModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    const { name, price, description, category, group, id } = selectedItem;

    if (!name || !price || !description) {
      const missing = [];
      if (!name) missing.push("Name");
      if (!price) missing.push("Price");
      if (!description) missing.push("Description");
      setErrorMessage(`${missing.join(", ")} are required.`);
      return;
    }

    try {
      const validCategory = category === "None" ? null : category;

      if (id) {
        const updated = await updateMenuItem(id, {
          name,
          price,
          description,
          category: validCategory,
          group,
        });
        setMenu((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...updated, category: updated.category || "None" }
              : item
          )
        );
      } else {
        const newItem = await createMenuItem({
          name,
          price,
          description,
          category: validCategory,
          group,
        });
        setMenu([
          ...menu,
          { ...newItem, category: newItem.category || "None" },
        ]);
      }

      setSuccessMessage("Menu item saved successfully!");
      closeModal();
    } catch (err) {
      setErrorMessage("Failed to save menu item: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      setMenu((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setErrorMessage("Failed to delete menu item: " + err.message);
    }
  };

  const MenuItemCard = ({ item }) => {
    return (
      <Card className="hover:shadow-xl transition p-4">
        <CardContent className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-black">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <div className="flex gap-2">
              {item.category && item.category !== "None" && (
                <Badge
                  className={`flex items-center gap-1 ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {getCategoryIcon(item.category)} {item.category}
                </Badge>
              )}
              <Badge className="bg-gray-200 text-gray-800 flex items-center gap-1">
                {item.group}
              </Badge>
            </div>
          </div>
          <div className="text-right flex flex-col justify-between">
            <div className="text-xl font-bold text-black mb-2">
              {item.price}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openModal(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

          {/* Messages */}
          {errorMessage && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-6">
            {groups.map((grp) => {
              const Icon = groupStatsConfig[grp].icon;
              const iconColor = groupStatsConfig[grp].iconColor;
              return (
                <StatsCard
                  key={grp}
                  title={grp}
                  value={menu.filter((item) => item.group === grp).length}
                  icon={Icon}
                  iconColor={iconColor}
                />
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs
            value={selectedGroup}
            onValueChange={setSelectedGroup}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 gap-2 mt-4">
              {groups.map((grp) => (
                <TabsTrigger
                  key={grp}
                  value={grp}
                  className="flex items-center justify-center gap-1"
                >
                  {grp}
                </TabsTrigger>
              ))}
            </TabsList>

            {groups.map((grp) => (
              <TabsContent key={grp} value={grp}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {menu
                    .filter((item) => item.group === grp)
                    .map((item) => (
                      <MenuItemCard key={item.id} item={item} />
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
                    placeholder="Dish Name"
                    value={selectedItem?.name}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    name="price"
                    placeholder="Price"
                    value={selectedItem?.price}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({
                        ...prev,
                        price: e.target.value.replace(/[^\d]/g, ""),
                      }))
                    }
                  />
                  <Input
                    name="description"
                    placeholder="Description"
                    value={selectedItem?.description}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />

                  {/* Category Dropdown */}
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

                  {/* Group Dropdown */}
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
