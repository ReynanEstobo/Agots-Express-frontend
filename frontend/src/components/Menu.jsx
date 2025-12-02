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

import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DashboardHeader } from "../ui/DashboardHeader";
import { DashboardSidebar } from "../ui/DashboardSidebar";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../ui/Dialog";
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

const categories = [
  "None",
  "Best Seller",
  "Most Bought",
  "New Arrival",
  "Limited Offer",
  "Recommended",
  "Specialty",
];

const groups = [
  "Main Course",
  "Dessert",
  "Appetizer",
  "Beverage",
  "Combo Meal",
];

const groupStatsConfig = {
  "Main Course": { icon: Drumstick, iconColor: "bg-red-500" },
  Dessert: { icon: IceCream, iconColor: "bg-pink-500" },
  Appetizer: { icon: Soup, iconColor: "bg-green-500" },
  Beverage: { icon: Coffee, iconColor: "bg-yellow-400" },
  "Combo Meal": { icon: Plus, iconColor: "bg-indigo-500" },
};

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

// ---------------------- MenuItemCard ----------------------
const MenuItemCard = React.memo(({ item, onEdit, onDelete }) => {
  return (
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
      <div className="absolute bottom-4 left-4 z-10 text-white">
        <h3 className="text-lg font-semibold drop-shadow-lg">{item.name}</h3>
        <p className="text-sm font-medium drop-shadow-lg">₱{item.price}</p>
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
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
          <Edit className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
});
// -----------------------------------------------------------

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("Main Course");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // ------------------ Stable Callbacks ------------------
  const loadMenu = useCallback(async () => {
    try {
      const data = await fetchMenuItems();
      setMenu(data || []);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  }, []);

  const openModal = useCallback((item = null) => {
    if (item) {
      setSelectedItem({ ...item, imageFile: null });
      setImagePreview(
        item.image ? `http://localhost:5000/uploads/menu/${item.image}` : null
      );
    } else {
      setSelectedItem({
        name: "",
        price: "",
        description: "",
        category: "None",
        group: "Main Course",
        image: null,
        imageFile: null,
        id: null,
      });
      setImagePreview(null);
    }
    setModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const confirmDelete = useCallback((item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  }, []);

  // ------------------------------------------------------

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedItem((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const { name, price, description, category, group, id, imageFile, image } =
      selectedItem;

    if (!name || !price || !description) {
      const missing = [];
      if (!name) missing.push("Name");
      if (!price) missing.push("Price");
      if (!description) missing.push("Description");
      setErrorMessage(`${missing.join(", ")} are required.`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category === "None" ? "" : category);
      formData.append("group", group);

      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      } else if (image) {
        formData.append("existingImage", image);
      }

      if (id) {
        const updated = await updateMenuItem(id, formData);
        setMenu((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...updated, category: updated.category || "None" }
              : item
          )
        );
      } else {
        const newItem = await createMenuItem(formData);
        setMenu((prev) => [
          ...prev,
          { ...newItem, category: newItem.category || "None" },
        ]);
      }

      setSuccessMessage("Menu item saved successfully!");
      closeModal();
    } catch (err) {
      setErrorMessage("Failed to save menu item: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenuItem(itemToDelete.id);
      setMenu((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setErrorMessage("Failed to delete menu item: " + err.message);
    }
  };

  // -------------------- Render --------------------
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                  {menu
                    .filter((item) => item.group === grp)
                    .map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={openModal}
                        onDelete={confirmDelete}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Add/Edit Modal */}
          {modalOpen && selectedItem && (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="fixed top-1/2 left-1/2 max-w-lg w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] z-50">
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <DialogTitle className="text-2xl font-bold">
                    {selectedItem?.id ? "Edit Menu Item" : "Add Menu Item"}
                  </DialogTitle>
                  <DialogClose asChild>
                    <button className="text-gray-400 hover:text-gray-600 text-xl font-semibold">
                      &times;
                    </button>
                  </DialogClose>
                </div>

                <div className="p-6 space-y-5">
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
                    className="text-lg py-3"
                  />
                  <Input
                    name="price"
                    placeholder="₱ Price"
                    value={selectedItem?.price}
                    onChange={(e) =>
                      setSelectedItem((prev) => ({
                        ...prev,
                        price: e.target.value.replace(/[^\d]/g, ""),
                      }))
                    }
                    className="text-lg py-3"
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
                    className="text-lg py-3"
                  />

                  {/* Image Upload */}
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                    <label className="text-gray-500 mb-2">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl shadow-md mt-2 pointer-events-none"
                      />
                    ) : (
                      <div className="text-gray-400">
                        Drag & drop or click to upload
                      </div>
                    )}
                  </div>

                  {/* Category & Group */}
                  <Select
                    value={selectedItem?.category}
                    onValueChange={(val) =>
                      setSelectedItem((prev) => ({ ...prev, category: val }))
                    }
                  >
                    <SelectTrigger className="text-lg py-3">
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

                  <Select
                    value={selectedItem?.group}
                    onValueChange={(val) =>
                      setSelectedItem((prev) => ({ ...prev, group: val }))
                    }
                  >
                    <SelectTrigger className="text-lg py-3">
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

                <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={closeModal}
                    className="px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="px-6 py-2 rounded-lg">
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmOpen && (
            <Dialog
              open={deleteConfirmOpen}
              onOpenChange={setDeleteConfirmOpen}
            >
              <DialogContent className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 z-50">
                <DialogTitle className="text-xl font-bold mb-4">
                  Confirm Delete
                </DialogTitle>
                <p className="mb-6 text-gray-700">
                  Are you sure you want to delete "{itemToDelete?.name}"? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}
