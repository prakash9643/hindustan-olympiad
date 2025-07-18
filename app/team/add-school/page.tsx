"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { School } from "@/types/school";
import { regions, districts } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AddSchoolForm() {
  const { success, error } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const type = localStorage.getItem("type");

    if (userData && userData !== "undefined" && type === "team-member") {
      setUser(JSON.parse(userData));
    } else {
      router.push("/phone-login/team");
    }
  }, []);

  const [formData, setFormData] = useState({
    schoolName: "",
    branch: "",
    serialNumber: "",
    district: "",
    region: "",
    city: "",
    pincode: "",
    board: "",
    principalName: "",
    principalPhone: "",
    principalEmail: "",
    coordinatorName: "",
    coordinatorPhone: "",
    coordinatorEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate empty fields
    for (const [key, value] of Object.entries(formData)) {
      if (
        typeof value === "string" &&
        value.trim() === "" &&
        key !== "city" &&
        key !== "serialNumber"
      ) {
        error("All fields are required!", {
          duration: 3000,
          position: "top-right",
          description: `Please fill the ${key} field.`,
        });
        return;
      }
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.principalEmail)) {
      error("Invalid email!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a valid principal email.",
      });
      return;
    }

    if (!emailRegex.test(formData.coordinatorEmail)) {
      error("Invalid email!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a valid coordinator email.",
      });
      return;
    }

    // Validate phone numbers (10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.principalPhone)) {
      error("Invalid phone number!", {
        duration: 3000,
        position: "top-right",
        description: "Principal's phone number should be 10 digits.",
      });
      return;
    }

    if (!phoneRegex.test(formData.coordinatorPhone)) {
      error("Invalid phone number!", {
        duration: 3000,
        position: "top-right",
        description: "Coordinator's phone number should be 10 digits.",
      });
      return;
    }

    // check if school name doesn't contain any special characters or numbers and it starts with a capital letter
    if (!/^[A-Z][a-zA-Z\s]*$/.test(formData.schoolName)) {
      error("Invalid school name!", {
        duration: 3000,
        position: "top-right",
        description:
          "School name must start with a capital letter and contain only alphabets.",
      });
      return;
    }

    const newSchool: School = {
      ...formData,
      studentsCount: 0,
      paymentVerification: 0,
    };

    console.log(newSchool);

    if (formData.region === "" || formData.district === "") {
      error("Please select a region and district!", {
        duration: 3000,
        position: "top-right",
        description: "Please select a region and district.",
      });
      return;
    }

    const response = await fetch("/api/schools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
      body: JSON.stringify(newSchool),
    });

    const data = await response.json();
    if (data.error) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: data.error,
      });
    } else {
      success("School added successfully!", {
        position: "top-right",
        duration: 2000,
        description: "Your school has been added successfully.",
      });
      // Reset form
      setFormData({
        schoolName: "",
        branch: "",
        serialNumber: "",
        district: "",
        region: "",
        city: "",
        pincode: "",
        board: "",
        principalName: "",
        principalPhone: "",
        principalEmail: "",
        coordinatorName: "",
        coordinatorPhone: "",
        coordinatorEmail: "",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full p-0 border-none pb-12">
      <CardHeader className="p-0 py-4">
        <CardTitle>Add New School</CardTitle>
        <CardDescription>
          Fill in the details to add a new school to the system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              School Information
            </p>
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) =>
                  handleInputChange("schoolName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="board">Board</Label>

              <Select
                value={formData.board}
                onValueChange={(value) => handleInputChange("board", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="SSC">SSC</SelectItem> */}
                  <SelectItem value="State Board">State Board</SelectItem>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              Region Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleInputChange("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(
                    (region) =>
                      user?.region.split(",").includes(region.value) && (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District</Label>

              <Select
                value={formData.district}
                onValueChange={(value) => handleInputChange("district", value)}
                disabled={!formData.region} // disable if no region selected
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    districts[formData.region as keyof typeof districts] || []
                  ).map((district: { value: string; label: string }) => (
                    <SelectItem key={district.value} value={district.value}>
                      {district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                required
              />
            </div>

            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              Principal Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="principalName">Principal Name</Label>
              <Input
                id="principalName"
                value={formData.principalName}
                onChange={(e) =>
                  handleInputChange("principalName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="principalPhone">Principal Phone</Label>
              <Input
                id="principalPhone"
                value={formData.principalPhone}
                onChange={(e) =>
                  handleInputChange("principalPhone", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="principalEmail">Principal Email</Label>
              <Input
                id="principalEmail"
                type="email"
                value={formData.principalEmail}
                onChange={(e) =>
                  handleInputChange("principalEmail", e.target.value)
                }
                required
              />
            </div>

            <p className="text-muted-foreground md:col-span-2 text-sm uppercase pt-4">
              Coordinator Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="coordinatorName">Coordinator Name</Label>
              <Input
                id="coordinatorName"
                value={formData.coordinatorName}
                onChange={(e) =>
                  handleInputChange("coordinatorName", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinatorPhone">Coordinator Phone</Label>
              <Input
                id="coordinatorPhone"
                value={formData.coordinatorPhone}
                onChange={(e) =>
                  handleInputChange("coordinatorPhone", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinatorEmail">Coordinator Email</Label>
              <Input
                id="coordinatorEmail"
                type="email"
                value={formData.coordinatorEmail}
                onChange={(e) =>
                  handleInputChange("coordinatorEmail", e.target.value)
                }
                required
              />
            </div>
          </div>

          <Button type="submit">Add School</Button>
        </form>
      </CardContent>
    </Card>
  );
}
