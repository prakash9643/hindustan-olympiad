"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Save, Search, Trash2, Upload } from "lucide-react"
import type { School } from "@/types/school"
import type { Student } from "@/types/student"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { is } from "date-fns/locale"
import SchoolSearchSelect from "@/components/ui/schoolsearchselect";

export default function BulkAddStudentForm() {
  const { success, error } = useToast()
  const [bulkStudents, setBulkStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    gender: "",
    stream: "",
    parentName: "",
    parentContact: "",
    schoolId: "",
    schoolName: "",
    branch: "",
    city: "",
    district: "",
    region: "",
    pincode: "",
  })

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

  const findSchoolById = async (schoolId: string) => {
    const school: School = await fetch(`/api/schools/${schoolId}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      }
    }).then(res => res.json());
    return school;
  }

  const handleSchoolSearch = async (school: any) => {
    
    setSelectedSchool(school)
    if (school) {
      setFormData((prev) => ({
        ...prev,
        schoolId: school._id,
        schoolName: school.schoolName,
        branch: school.branch,
        district: school.district,
        region: school.region,
        city: school.city,
        pincode: school.pincode,
      }))
    } else {
      alert("School not found!")
    }
  }

  const downloadExcelTemplate = () => {
    const template = [
      {
        "Student Name": "",
        "Class": "",
        "Section": "",
        "Gender": "M", // Default value
        "Stream": "PCB", // Default value
        "Parent Name": "",
        "Parent Contact": "",
        "Payment Verified (Yes/No)": "Yes",
      },
    ]

    const ws = XLSX?.utils?.json_to_sheet(template)

    // Add data validation for Gender column (column D)
    const genderValidation = {
      type: "list",
      allowBlank: false,
      formula1: '"M,F"',
    }

    // Add data validation for Stream column (column E)
    const streamValidation = {
      type: "list",
      allowBlank: false,
      formula1: '"PCB,PCM,COMM,COMW,ARTS"',
    }

    // Apply validation to cells (assuming row 2 onwards for data)
    if (!ws["!dataValidation"]) ws["!dataValidation"] = []

    ws["!dataValidation"].push({
      sqref: "D2:D1000",
      ...genderValidation,
    })

    ws["!dataValidation"].push({
      sqref: "E2:E1000",
      ...streamValidation,
    })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students Template")

    // Generate buffer for browser download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    // Create blob and download
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "students_template.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const students: any[] = jsonData.map((row: any) => ({
          name: row["Student Name"] || "",
          class: row["Class"] || "",
          section: row["Section"] || "",
          gender: row["Gender"] || "",
          stream: row["Stream"] || "",
          parentName: row["Parent Name"] || "",
          parentContact: row["Parent Contact"] || "",
          paymentVerified: row["Payment Verified (Yes/No)"] === "Yes",
        }))

        setBulkStudents(students)
      } catch (error) {
        alert("Error reading Excel file. Please check the format.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleBulkSave = () => {
    const validStudents = bulkStudents.filter((student) => {
      return isStudentValid(student)
    })

    if (!selectedSchool) {
      error("School not found!", { duration: 3000, position: "top-right", description: "Please select a school first." })
      return
    }

    if (validStudents.length === 0) {
      alert("No valid students to save")
      return
    }
    // TODO :: SAve using API
    fetch(`/api/students/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },

      body: JSON.stringify({
        students: validStudents,
        schoolId: selectedSchool?._id,
        schoolName: selectedSchool?.schoolName,
        branch: selectedSchool?.branch,
        district: selectedSchool?.district,
        region: selectedSchool?.region,
        city: selectedSchool?.city,
        pincode: selectedSchool?.pincode,
      }),
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
          success('Students added!', { position: "top-right", duration: 2000, description: "Your students have been added successfully." })
        }
      })
      .catch(error => {
        error("Something went wrong!", { duration: 3000, position: "top-right", description: error })
      })
    setBulkStudents([])
  }

  const removeBulkStudent = (index: number) => {
    setBulkStudents((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.schoolId) {
      alert("Please search and select a school first!")
      return
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    if (data.error) {
      error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
    } else {
      success('Student added!', { position: "top-right", duration: 2000, description: "Your student has been added successfully." })
    }

    // Reset form
    setFormData({
      name: "",
      class: "",
      section: "",
      gender: "",
      stream: "",
      parentName: "",
      parentContact: "",
      schoolId: "",
      schoolName: "",
      branch: "",
      city: "",
      district: "",
      region: "",
      pincode: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStreamValid = ({class: studentClass, stream} : {class: string, stream: string}): boolean => {
    if(studentClass === "11" || studentClass === "12") {
      console.log("Stream Valid:", studentClass, stream);
      return stream ? ["PCB", "PCM", "COMM", "COMW", "ARTS"].includes(stream.trim().toUpperCase()) : false;
    } else {
      return stream === "" || stream === null;
    }
  }

  const isStudentValid = (student: Student): boolean => {
    const requiredFields = [
      student.name,
      student.class,
      student.section,
      student.gender,
      student.parentName,
      student.parentContact,
    ];

    const allFieldsFilled = requiredFields.every((value) => {
      return value.toString().trim() !== "";
    });

    const genderValid = ["M", "F"].includes(student.gender.toUpperCase());
    const streamValid : boolean = isStreamValid({class: student.class+ "", stream: student.stream});
    console.log("Stream Valid:", student.name, student.class, student.stream, streamValid)
    const contactValid = /^[0-9]{10}$/.test(student.parentContact); // assuming 10-digit contact
    const paymentValid = student.paymentVerified === true || student.paymentVerified === false;

    console.log("Student Valid:", student.name, allFieldsFilled, genderValid, streamValid, contactValid, paymentValid)

    return allFieldsFilled && genderValid && streamValid && contactValid && paymentValid;
  }

  const isAllStudentsValid = bulkStudents.every(isStudentValid);

  return (
    <Card className="p-0 border-none pb-12">
      <CardHeader className="p-0 py-4">
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>Fill in the details to add a new student to the system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* School Search Section */}
          <Card className="bg-muted/50 px-4 py-2">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">School Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="flex space-x-2 mb-4">
                <SchoolSearchSelect onSchoolSelect={handleSchoolSearch} selectedSchool={selectedSchool} />
              </div>

              {formData.schoolId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input value={formData.schoolName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Input value={formData.branch} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input value={formData.region} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input value={formData.district} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input value={formData.pincode} disabled />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Information */}
          <div className="">

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={downloadExcelTemplate} type="button" variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Excel Template
              </Button>
              <div className="flex-1">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <Label htmlFor="excel-upload" className="cursor-pointer">
                  <Button variant="outline" type="button" className="w-full" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel File
                    </span>
                  </Button>
                </Label>
              </div>
            </div>

            {bulkStudents.length > 0 && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Validate Students Data</h3>
                  <Button type="button" onClick={handleBulkSave} disabled={!isAllStudentsValid}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Valid Students
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Stream</TableHead>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Parent Contact</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkStudents.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {isStudentValid(student) ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Valid</Badge>
                            ) : (
                              <Badge variant="destructive">Invalid</Badge>
                            )}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.stream}</TableCell>
                          <TableCell>{student.parentName}</TableCell>
                          <TableCell>{student.parentContact}</TableCell>
                          <TableCell>{student.paymentVerified ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeBulkStudent(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

          </div>
        </form>
      </CardContent>

      <CardFooter className="p-0 pt-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Note for Gender:</strong> Use &apos;M&apos; for Male and &apos;F&apos; for Female students only.</p>
          <p><strong>Note for Stream (Only for Class 11 & 12):</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>PCM - Physics, Chemistry, Mathematics</li>
            <li>PCB - Physics, Chemistry, Biology</li>
            <li>COMM - Commerce with Mathematics</li>
            <li>COMW - Commerce without Mathematics</li>
            <li>ARTS - Arts/Humanities</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}
