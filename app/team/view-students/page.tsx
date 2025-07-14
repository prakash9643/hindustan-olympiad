"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Download, Edit, Trash2 } from "lucide-react"
import type { Student, StudentsResponse } from "@/types/student"
import type { School } from "@/types/school"
import EditStudentDialog from "@/components/edit-student-dialog"
import DeleteConfirmDialog from "@/components/delete-confirm-dialog"
import Pagination from "@/components/pagination"
import SearchAndFilter from "@/components/search-and-filter"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from 'next/navigation';

const constantFilters = [
    {
        key: "gender",
        label: "Gender",
        options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
        ],
    },
    {
        key: "class",
        label: "Class",
        options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7" },
            { value: "8", label: "8" },
            { value: "9", label: "9" },
            { value: "10", label: "10" },
        ],
    }
]

export default function ViewStudents() {
    const searchParams = useSearchParams();

    const { success, toast, error } = useToast()
    const [loading, setLoading] = useState(true)
    const [exportLoading, setExportLoading] = useState(false)
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
    const [verifyPaymentStudent, setVerifyPaymentStudent] = useState<Student | null>(null)
    const [filterOptions, setFilterOptions] = useState<any>({ key: "", label: "", options: [] })
    const [studentsData, setStudentsData] = useState<StudentsResponse>({
        students: [],
        total: 0,
        page: 1,
        totalPages: 0,
    })

    const [sortBy, setSortBy] = useState<string>("name");

    const sortOptions = [
        { key: "name", label: "Name" },
        { key: "studentId", label: "Roll Number" },
        // { key: "studentId", label: "Student ID" },
    ]

    const { students, total, page, totalPages } = studentsData
    useEffect(() => {
        const fetchSchools = async () => {
            const res = await fetch("/api/schools", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
                },
            })
            const data = await res.json()
            const schoolData = data.schools.map((school: any) => ({
                label: `${school.schoolName} - ${school.branch}`,
                value: school._id,
            }));
            setFilterOptions({
                key: "schoolId",
                label: "School",
                options: schoolData,
            })
        }
        fetchSchools()
    }, [])

    const [search, setSearch] = useState<string>(searchParams.get("search") || "")

    const [filters, setFilters] = useState<Record<string, string>>({
        gender: "",
        class: "",
        stream: "",
        schoolId: "",
    })

    const onUpdateStudent = async (student: Student) => {
        const response = await fetch(`/api/students/${student._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
            },
            body: JSON.stringify(student),
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
            success('Student updated!', { position: "top-right", duration: 2000, description: "Your student has been updated successfully." })
        }
    }

    const onDeleteStudent = async (studentId: string) => {
        const response = await fetch(`/api/students/${studentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
            },
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
            success('Student deleted!', { position: "top-right", duration: 2000, description: "Your student has been deleted successfully." })
        }
    }

    const verifyPayment = async (student: Student) => {
        const response = await fetch(`/api/students/${student._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
            },
            body: JSON.stringify({
                ...student,
                confirmPayment: true,
            }),
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        }
        else {
            success('Payment verified!', { position: "top-right", duration: 2000, description: "Your payment has been verified successfully." })
            setLoading(true)
            const res = await fetch(`/api/students?search=${search}&filters=${JSON.stringify(filters)}&sortBy=${sortBy}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
                },
            })
            const data = await res.json()
            setStudentsData(data)
            setLoading(false)
        }
    }

    const onSearchChange = (search: string) => {
        setSearch(search)
    }
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
            const res = await fetch(`/api/students?search=${search}&filters=${JSON.stringify(filters)}&sortBy=${sortBy}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
                },
            })
            const data = await res.json()
            setStudentsData(data)
            setLoading(false)
        }
        fetchStudents()
    }, [search, filters, sortBy])

    const onFiltersChange = (filters: Record<string, string>) => {
        setFilters(filters)
    }

    const onPageChange = (page: number) => {
        const fetchStudents = async () => {
            setLoading(true)
            const response = await fetch(`/api/students?page=${page}&limit=${10}&search=${search}&filters=${JSON.stringify(filters)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
                },
            })
            const data = await response.json()
            setStudentsData(data)
            setLoading(false)
        }
        fetchStudents()
    }

    const handleExport = () => {
        setExportLoading(true);
        fetch(`/api/export/students?search=${search}&sortBy=${sortBy}`, {
            method: "GET",
            headers: {
                authorization: `${JSON.parse(localStorage.getItem("user") || "{}")._id}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to export");
                }
                return res.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "students.csv";
                a.click();
            })
            .catch((e) => {
                error("Something went wrong!", {
                    duration: 3000,
                    position: "top-right",
                    description: "Failed to export students.",
                });
            })
            .finally(() => {
                setExportLoading(false);
            });
    };


    return (
        <Card className="p-0 border-none pb-12">
            <div className="flex justify-between items-center">
                <CardHeader className="p-0 py-4">
                    <CardTitle>Students List</CardTitle>
                    <CardDescription>View and manage all students in the system</CardDescription>
                </CardHeader>
                <Button onClick={handleExport} className="py-2 px-4" disabled={exportLoading}>
                    <Download className="h-4 w-4" />
                    { exportLoading ? "Exporting..." : "Export"}
                </Button>
            </div>
            <CardContent className="p-0">
                <SearchAndFilter
                    search={search}
                    onSearchChange={onSearchChange}
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    filterOptions={[...constantFilters, filterOptions]}
                    placeholder="Search students by name, parent name, school, or city..."
                    sortBy={sortBy}
                    sortOptions={sortOptions}
                    onSortChange={(sortBy) => setSortBy(sortBy)}
                />
                {loading ? <div className="flex justify-center items-center">Loading...</div> : <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Stream</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Roll Number</TableHead>
                                {/* <TableHead>Student ID</TableHead> */}
                                <TableHead>Contact</TableHead>
                                <TableHead>Payment </TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student: any) => (
                                <TableRow key={student._id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>{student.section}</TableCell>
                                    <TableCell>{student.gender}</TableCell>
                                    <TableCell>{student.stream}</TableCell>
                                    <TableCell>{student.schoolName}</TableCell>
                                    <TableCell>{student.studentId}</TableCell>

                                    <TableCell>{student.parentContact}</TableCell>
                                    <TableCell className={`${student.paymentVerified ? 'text-green-500' : 'text-red-500 '} `}>
                                        {student.paymentVerified ? "Received" : "Pending"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button className="w-9 h-9" variant="outline" size="sm" onClick={() => setEditingStudent(student)} title="Edit Student">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button className="w-9 h-9" variant="outline" size="sm" onClick={() => setDeletingStudent(student)} title="Delete Student">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button className="w-9 h-9" variant="outline" size="sm" onClick={() => setVerifyPaymentStudent(student)} title="Verify Payment for Student" disabled={student.paymentVerified}>
                                                <Banknote className="h-4 w-4 text-green-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    total={total}
                    onPageChange={onPageChange}
                />

                {editingStudent && (
                    <EditStudentDialog
                        student={editingStudent}
                        open={!!editingStudent}
                        onClose={() => setEditingStudent(null)}
                        onSave={onUpdateStudent}
                    />
                )}

                {deletingStudent && (
                    <DeleteConfirmDialog
                        open={!!deletingStudent}
                        onClose={() => setDeletingStudent(null)}
                        onConfirm={() => {
                            onDeleteStudent(deletingStudent._id!)
                            setDeletingStudent(null)
                        }}
                        title="Delete Student"
                        description={`Are you sure you want to delete "${deletingStudent.name}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                    />
                )}

                {verifyPaymentStudent && (
                    <DeleteConfirmDialog
                        open={!!verifyPaymentStudent}
                        onClose={() => setVerifyPaymentStudent(null)}
                        onConfirm={() => {
                            verifyPayment(verifyPaymentStudent)
                            setVerifyPaymentStudent(null)
                        }}
                        title="Verify Payment"
                        description={`Are you sure you want to verify payment for "${verifyPaymentStudent.name}"? This action cannot be undone.`}
                        confirmText="Verify Payment"
                        cancelText="Cancel"
                    />
                )}
            </CardContent>
        </Card>
    )
}
