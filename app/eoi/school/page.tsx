"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { regions, districts } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";

interface SchoolFormData {
  schoolName: string;
  schoolCoordinatorContact: string;
  schoolCoordinatorEmail: string;
  schoolAddress: string;
  region: string;
  district: string;
}

export default function SchoolRegistrationPage() {
  const [schoolForm, setSchoolForm] = useState<SchoolFormData>({
    schoolName: "",
    schoolCoordinatorContact: "",
    schoolCoordinatorEmail: "",
    schoolAddress: "",
    region: "",
    district: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(schoolForm);

    

    if (!/^\d{10}$/.test(schoolForm.schoolCoordinatorContact)) {
      error("Invalid contact number!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a 10-digit phone number.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolForm.schoolCoordinatorEmail)) {
      error("Invalid email ID!", {
        duration: 3000,
        position: "top-right",
        description: "Please enter a valid email address.",
      });
      setIsSubmitting(false);
      return;
    }

    // Submit
    try {
      const response = await fetch("/api/eoi/school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schoolForm),
      });

      if (response.ok) {
        success("We have got your message!", {
          position: "top-right",
          duration: 2000,
          description: "We will get back to you soon.",
        });

        setSchoolForm({
          schoolName: "",
          schoolCoordinatorContact: "",
          schoolCoordinatorEmail: "",
          schoolAddress: "",
          region: "",
          district: "",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }
    } catch (err: any) {
      error("Something went wrong!", {
        duration: 3000,
        position: "top-right",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStateChange = (state: string) => {
    setSchoolForm((prev) => ({
      ...prev,
      region: state,
      district: "",
    }));
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardDescription className="text-base font-medium text-black">
              Please share your school’s details so we can initiate the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  value={schoolForm.schoolName}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolName: e.target.value }))
                  }
                  placeholder="Enter school name"
                  required
                />
              </div>

              {/* Coordinator Contact */}
              <div className="space-y-2">
                <Label htmlFor="coordinator-contact">School Coordinator Contact Number</Label>
                <Input
                  id="coordinator-contact"
                  value={schoolForm.schoolCoordinatorContact}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolCoordinatorContact: e.target.value }))
                  }
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>

              {/* Coordinator Email */}
              <div className="space-y-2">
                <Label htmlFor="coordinator-email">School Coordinator Email ID</Label>
                <Input
                  id="coordinator-email"
                  type="email"
                  value={schoolForm.schoolCoordinatorEmail}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolCoordinatorEmail: e.target.value }))
                  }
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* School Address */}
              <div className="space-y-2">
                <Label htmlFor="school-address">School Address</Label>
                <Input
                  id="school-address"
                  value={schoolForm.schoolAddress}
                  onChange={(e) =>
                    setSchoolForm((prev) => ({ ...prev, schoolAddress: e.target.value }))
                  }
                  placeholder="Enter school address"
                  required
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={schoolForm.region} onValueChange={handleStateChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={schoolForm.district}
                  onValueChange={(val) =>
                    setSchoolForm((prev) => ({ ...prev, district: val }))
                  }
                  disabled={!schoolForm.region}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolForm.region &&
                      districts[schoolForm.region as keyof typeof districts].map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
