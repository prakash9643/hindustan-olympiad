"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Download, Edit, Trash2, Users } from "lucide-react"
import type { School, SchoolsResponse } from "@/types/school"
import EditSchoolDialog from "@/components/ui/edit-school-dialog"
import DeleteConfirmDialog from "@/components/delete-confirm-dialog"
import Pagination from "@/components/pagination"
import SearchAndFilter from "@/components/search-and-filter"
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import CopyToClipboard from "@/components/copy-to-clipboard"
import { regions, districts } from "@/utils/constants"
import { useRouter } from 'next/navigation';
import { fi } from "date-fns/locale"



export default function ViewSchools() {

    const router = useRouter();     // Import the useRouter hook from Next.js
    const { success, toast, error } = useToast()
    const [schoolData, setSchoolData] = useState<SchoolsResponse>({
        schools: [],
        total: 0,
        page: 1,
        totalPages: 0,
    })
    const [editingSchool, setEditingSchool] = useState<School | null>(null)
    const [deletingSchool, setDeletingSchool] = useState<School | null>(null)
    const [verifyPaymentSchool, setVerifyPaymentSchool] = useState<School | null>(null)
    const [loading, setLoading] = useState(true)
    const [exportLoading, setExportLoading] = useState(false)

    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState<Record<string, string>>({
        region: "",
        district: "",
        board: "",
    })
    const [sortBy, setSortBy] = useState<string>("schoolName");

    const handleSchoolSearchChange = (search: string) => {
        setSearch(search)
    }

    const handleSchoolFiltersChange = (filters: Record<string, string>) => {
        setFilters(filters)
        onFiltersChange(filters)
    }

    const onSearchChange = (search: string) => {
        setSearch(search);
    }
    const onFiltersChange = (filters: Record<string, string>) => {
        setFilters(filters)
    }

    const onUpdateSchool = async (school: School) => {
        const response = await fetch(`/api/schools/${school.schoolId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
            },
            body: JSON.stringify(school),
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
            success('School updated!', { position: "top-right", duration: 2000, description: "Your school has been updated successfully." })
        }
    }

    const onDeleteSchool = async (schoolId: string) => {
        const response = await fetch(`/api/schools/${schoolId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        } else {
            success('School deleted!', { position: "top-right", duration: 2000, description: "Your school has been deleted successfully." })
        }
    }

    const viewSchoolStudents = (school: School) => {
        router.push(`/team/view-students?search=${school.schoolId}`);
    }

    useEffect(() => {
        const fetchSchools = async () => {
            setLoading(true)
            // const response = await fetch(`/api/schools?query=${search}&region=${filters.region}&district=${filters.district}&board=${filters.board}`, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            // })
            const response = await axios.get(`/api/schools?query=${search}&region=${filters.region}&district=${filters.district}&board=${filters.board}&sortBy=${sortBy}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
                }
            });
            const data = await response.data
            console.log(data);
            setSchoolData(data)
            setLoading(false)
        }
        fetchSchools()
    }, [search, filters, sortBy])

    const { schools, total, page, totalPages } = schoolData

    const onPageChange = (page: number) => {
        const fetchSchools = async () => {
            setLoading(true)
            const response = await fetch(`/api/schools?page=${page}&limit=${10}&query=${search}&region=${filters.region}&district=${filters.district}&board=${filters.board}&sortBy=${sortBy}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
                },
            })
            const data = await response.json()
            console.log(data)
            setSchoolData(data)
            setLoading(false)
        }
        fetchSchools()
    }

    const verifyPayment = async (school: School) => {
        const response = await fetch(`/api/schools/${school.schoolId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `${JSON.parse(localStorage.getItem("user") || "")._id}`,
            },
            body: JSON.stringify({
                ...school,
                confirmPayment: true,
            }),
        })
        const data = await response.json()
        if (data.error) {
            error("Something went wrong!", { duration: 3000, position: "top-right", description: data.error })
        }
        else {
            success("Payment verified!", { position: "top-right", duration: 2000, description: "Your payment has been verified successfully." })
        }
    }


    const schoolFilterOptions = [
        {
            key: "region",
            label: "Region",
            options: [
                { value: "1", label: "Region 1" },
                { value: "2", label: "Region 2" },
                { value: "3", label: "Region 3" },
            ],
        },
        {
            key: "district",
            label: "District",
            options: [
                { value: "65", label: "District 65" },
                { value: "66", label: "District 66" },
                { value: "67", label: "District 67" },
            ],
        },
        {
            key: "board",
            label: "Board",
            options: [
                { value: "board", label: "Board" },
                { value: "Board 2", label: "Board 2" },
                { value: "Board 3", label: "Board 3" },
            ],
        },
    ]

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const res = await fetch(`/api/export/schools?search=${search}&sortBy=${sortBy}`, {
                method: "GET",
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem("user") || "{}")._id}`,
                },
            });

            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "schools.csv";
            a.click();
        } catch (e: any) {
            error("Something went wrong!", {
                duration: 3000,
                position: "top-right",
                description: "Failed to export schools.",
            });
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <Card className="p-0 border-none pb-12">
            <div className="flex justify-between items-center">
                <CardHeader className="p-0 py-4">
                    <CardTitle>Schools List</CardTitle>
                    <CardDescription>View and manage all schools in the system</CardDescription>
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
                    filterOptions={schoolFilterOptions}
                    placeholder="Search schools by name, branch, principal, or serial number..."
                    sortBy={sortBy}
                    sortOptions={[
                        { key: "schoolName", label: "School Name" },
                        { key: "schoolId", label: "School ID" },
                    ]}
                    onSortChange={(value) => { setSortBy(value) }}
                />
                {loading && <div className="flex justify-center items-center">Loading...</div>}
                {!loading && (
                    <div className="overflow-x-auto mt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>School Name</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>School ID</TableHead>
                                    <TableHead>Region</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>Principal</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schools?.length > 0 && schools.map((school, index) => (
                                    <TableRow key={`school_${school.schoolId}`}>
                                        <TableCell className="font-medium">{school.schoolName}</TableCell>
                                        <TableCell>{school.branch}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                {school.schoolId}
                                                <CopyToClipboard text={school.schoolId || ''} />
                                            </div>
                                        </TableCell>
                                        <TableCell>{regions.find(region => region.value === school.region)?.label}</TableCell>
                                        <TableCell>{districts[school.region as keyof typeof districts]?.find(district => district.value === school.district)?.label}</TableCell>
                                        <TableCell>{school.principalName}</TableCell>
                                        <TableCell>{school.paymentVerification}/{school.studentsCount}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button className="w-9 h-9" variant="outline" size="sm" onClick={() => setEditingSchool(school)} title="Edit School">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button className="w-9 h-9" variant="outline" size="sm" onClick={() => setDeletingSchool(school)} title="Delete School">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button className="w-9 h-9" variant="outline" size="sm" onClick={() => viewSchoolStudents(school)} title="View students">
                                                    <Users className="h-4 w-4" />
                                                </Button>

                                                <Button className="w-9 h-9" variant="outline" size="sm" disabled={school.paymentVerification === school.studentsCount} onClick={() => setVerifyPaymentSchool(school)} title="Verify payment for school">
                                                    <Banknote className="h-4 w-4 text-green-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    total={total}
                    onPageChange={onPageChange}
                />

                {editingSchool && (
                    <EditSchoolDialog
                        school={editingSchool}
                        open={!!editingSchool}
                        onClose={() => setEditingSchool(null)}
                        onSave={onUpdateSchool}
                    />
                )}

                {deletingSchool && (
                    <DeleteConfirmDialog
                        open={!!deletingSchool}
                        onClose={() => setDeletingSchool(null)}
                        onConfirm={() => {
                            onDeleteSchool(deletingSchool._id || "")
                            setDeletingSchool(null)
                        }}
                        title="Delete School"
                        description={`Are you sure you want to delete "${deletingSchool.schoolName}"? This action cannot be undone and will also remove all students associated with this school.`}
                    />
                )}

                {verifyPaymentSchool && (
                    <DeleteConfirmDialog
                        open={!!verifyPaymentSchool}
                        onClose={() => setVerifyPaymentSchool(null)}
                        onConfirm={() => {
                            verifyPayment(verifyPaymentSchool)
                            setVerifyPaymentSchool(null)
                        }}
                        title="Verify Payment"
                        description={`Are you sure you want to verify payment for "${verifyPaymentSchool.schoolName}"? This action cannot be undone.`}
                        confirmText="Verify Payment"
                        cancelText="Cancel"
                    />
                )}
            </CardContent>
        </Card>
    )
}
