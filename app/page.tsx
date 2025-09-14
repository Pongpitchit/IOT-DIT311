"use client";

import { Dot, Flower, Leaf, Sprout } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useLiffProfile } from "@/context/LiffContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LiffLogin from "@/components/LiffLogin";

type Plant = {
  id: number;
  name: string;
  room: string;
  image: string;
  status: "healthy" | "warning" | string;
  category: string;
  humidity: number;
  soilMoisture: number;
  fertilizer: string;
};

type DeviceData = Omit<Plant, "id"> & {
  dataDeviceId: number;
  id: string;
};

const PlantIcon = [
  { id: 1, name: "Indoor", icon: <Sprout /> },
  { id: 2, name: "Outdoor", icon: <Leaf /> },
  { id: 3, name: "Living Room", icon: <Flower /> },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { profile } = useLiffProfile();

  const [plants, setPlants] = useState<Plant[]>([
    {
      id: 1,
      name: "Aloe Vera",
      room: "Living Room",
      image: "/images/plant.webp",
      status: "healthy" as const,
      category: "Outdoor" as const,
      humidity: 50,
      soilMoisture: 40,
      fertilizer: "Weekly",
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      room: "Bedroom",
      image: "/images/plant.webp",
      status: "healthy" as const,
      category: "Indoor" as const,
      humidity: 50,
      soilMoisture: 40,
      fertilizer: "Weekly",
    },
    {
      id: 3,
      name: "Snake Plant",
      room: "Office",
      image: "/images/plant.webp",
      status: "warning" as const,
      category: "Indoor" as const,
      humidity: 69,
      soilMoisture: 40,
      fertilizer: "Weekly",
    },
  ]);

  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [editablePlant, setEditablePlant] = useState<Plant | null>(null);

  const categories = [...new Set(plants.map((plant) => plant.category))];
  const rooms = [...new Set(plants.map((plant) => plant.room))];
  const categoriesWithIcon = categories.map((c) => {
    const found = PlantIcon.find((p) => p.name === c);
    return { name: c, icon: found?.icon ?? null };
  });
  const finalCategories = [{ name: "All", icon: null }, ...categoriesWithIcon];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center w-full h-18 px-5 border-b border-gray-200/25">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
          <h1>Plant Growth</h1>
        </div>
        <div>
          <LiffLogin />
        </div>
      </div>

      <div className="px-5">
        <main className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.displayName ?? "Guest"} 👋🏻 !
          </h1>

          <Input
            placeholder="Search by plant name or room"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {finalCategories.map((c) => (
              <div
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition
                  ${
                    selectedCategory === c.name
                      ? "bg-primary text-white"
                      : "bg-gray-200/25"
                  }`}
              >
                {c.icon}
                <span>{c.name}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {plants
              .filter((plant) => {
                const matchesCategory =
                  selectedCategory === "All" ||
                  plant.category === selectedCategory;
                const q = searchQuery.trim().toLowerCase();
                return (
                  matchesCategory &&
                  (q === "" ||
                    plant.name.toLowerCase().includes(q) ||
                    plant.room.toLowerCase().includes(q))
                );
              })
              .map((plant) => (
                <Card
                  key={plant.id}
                  className="p-0 gap-2 cursor-pointer"
                  onClick={() => {
                    setEditablePlant({ ...plant });
                    setDetailOpen(true);
                  }}
                >
                  <CardContent className="p-0">
                    <Image
                      src={plant.image}
                      alt={plant.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded-xl overflow-hidden"
                    />
                  </CardContent>
                  <CardHeader className="p-2">
                    <CardTitle>{plant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Dot
                        className={
                          plant.status === "healthy"
                            ? "stroke-5 text-green-600 animate-pulse duration-1000"
                            : "stroke-5 text-yellow-500"
                        }
                      />
                      <span>{plant.room}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
          </div>

          <Drawer open={detailOpen} onOpenChange={setDetailOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{editablePlant?.name ?? "Plant"}</DrawerTitle>
                <DrawerDescription>
                  {editablePlant
                    ? `${editablePlant.category} • ${editablePlant.room}`
                    : ""}
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4 grid gap-4">
                {/* Name */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editablePlant?.name ?? ""}
                    onChange={(e) =>
                      setEditablePlant((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                  />
                </div>

                {/* Room */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Room</label>
                  <Select
                    value={editablePlant?.room ?? ""}
                    onValueChange={(val) =>
                      setEditablePlant((prev) =>
                        prev ? { ...prev, room: val } : prev
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Humidity */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Humidity: {editablePlant?.humidity ?? 0}%
                  </label>
                  <Slider
                    value={[editablePlant?.humidity ?? 0]}
                    onValueChange={(v) =>
                      setEditablePlant((prev) =>
                        prev ? { ...prev, humidity: v[0] ?? 0 } : prev
                      )
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Soil Moisture */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Soil Moisture: {editablePlant?.soilMoisture ?? 0}%
                  </label>
                  <Slider
                    value={[editablePlant?.soilMoisture ?? 0]}
                    onValueChange={(v) =>
                      setEditablePlant((prev) =>
                        prev ? { ...prev, soilMoisture: v[0] ?? 0 } : prev
                      )
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Fertilizer */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Fertilizer</label>
                  <Select
                    value={editablePlant?.fertilizer ?? ""}
                    onValueChange={(val) =>
                      setEditablePlant((prev) =>
                        prev ? { ...prev, fertilizer: val } : prev
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Biweekly">Biweekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={async () => {
                      if (!editablePlant || !profile) return;

                      try {
                        // PUT request ไปยัง deviceId = plant.id
                        const res = await fetch(
                          `/api/${profile.userId}/devices/${editablePlant.id}`,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              dataDeviceId: editablePlant.id,
                              id: btoa(editablePlant.name),
                              name: editablePlant.name,
                              room: editablePlant.room,
                              image: editablePlant.image,
                              status: editablePlant.status,
                              category: editablePlant.category,
                              humidity: editablePlant.humidity,
                              soilMoisture: editablePlant.soilMoisture,
                              fertilizer: editablePlant.fertilizer,
                              userId: profile.userId,
                            }),
                          }
                        );

                        if (res.ok) {
                          console.log("Plant saved successfully");
                          // update local state
                          setPlants((prev) =>
                            prev.map((p) =>
                              p.id === editablePlant.id ? editablePlant : p
                            )
                          );
                        } else {
                          console.error("Failed to save plant");
                        }
                      } catch (error) {
                        console.error("Error saving plant:", error);
                      }
                    }}
                  >
                    Save
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </main>
      </div>
    </div>
  );
}
