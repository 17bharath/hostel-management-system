"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import logo from '../../public/assets/hostel_logo.jpg';


// ---------------------------
// Initial Feedback Data
// ---------------------------


// ---------------------------
// Helpers
// ---------------------------
const getPriority = (rating) => {
    if (rating <= 2) return "High";
    if (rating === 3) return "Medium";
    return "Low";
};

const renderStars = (rating) => {
    return "★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating);
};

// ---------------------------
// Page Component
// ---------------------------
export default function FeedbackDashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [changedStatuses, setChangedStatuses] = useState({});
    const [saveStatuses, setSaveStatuses] = useState({});


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch("/api/feedback");
                const data = await res.json();

                // normalize status from backend (open → Open)
                const formatted = data.map((t) => ({
                    ...t,
                    status:
                        t.status === "open"
                            ? "Open"
                            : t.status === "inprogress"
                                ? "In Progress"
                                : t.status === "closed"
                                    ? "Closed"
                                    : t.status === "unactive"
                                        ? "Unactive"
                                        : t.status,
                }));

                setTickets(formatted);
            } catch (err) {
                console.error("Failed to fetch tickets", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/feedback");
            const data = await res.json();

            // normalize status from backend (open → Open)
            const formatted = data.map((t) => ({
                ...t,
                status:
                    t.status === "open"
                        ? "Open"
                        : t.status === "inprogress"
                            ? "In Progress"
                            : t.status === "closed"
                                ? "Closed"
                                : t.status === "unactive"
                                    ? "Unactive"
                                    : t.status,
            }));

            setTickets(formatted);
        } catch (err) {
            console.error("Failed to fetch tickets", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id, status) => {
        // Track the changed status locally
        setChangedStatuses(prev => ({
            ...prev,
            [id]: status
        }));

        // Update the local display immediately
        setTickets((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
    };

    const saveStatus = async (id) => {
        const newStatus = changedStatuses[id];
        if (!newStatus) return; // No change to save

        // Convert frontend status to backend format
        const backendStatus =
            newStatus === "Open" ? "open" :
                newStatus === "In Progress" ? "inprogress" :
                    newStatus === "Closed" ? "closed" :
                        newStatus === "Unactive" ? "unactive" : newStatus;

        // Set saving state
        setSaveStatuses(prev => ({ ...prev, [id]: true }));

        try {
            // Make PUT request to update status in backend
            const response = await fetch(`/api/feedback/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: backendStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(`Status updated successfully for ticket ${id}:`, result);

            // Clear the changed status after successful save
            setChangedStatuses(prev => {
                const newStatuses = { ...prev };
                delete newStatuses[id];
                return newStatuses;
            });

            // Refresh the tickets to get the latest data
            await fetchTickets();

        } catch (error) {
            console.error("Failed to update status:", error);
            alert(`Failed to update status: ${error.message}`);
        } finally {
            // Clear saving state
            setSaveStatuses(prev => {
                const newStatuses = { ...prev };
                delete newStatuses[id];
                return newStatuses;
            });
        }
    };

    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProgress = tickets.filter((t) => t.status === "In Progress").length;
    const closed = tickets.filter((t) => t.status === "Closed").length;
    const unactive = tickets.filter((t) => t.status === "Unactive").length;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}

            <div className="flex items-center gap-4">
                <Image
                    src={logo}
                    alt="Hostel Logo"
                    width={70}
                    height={70}
                // className="rounded-md object-contain  w-full h-full"
                />
                <h1 className="text-2xl font-bold">
                    Sri Kamashitayai Boys Hostel – Feedback Tickets
                </h1>

            </div>



            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StatCard title="Total Tickets" value={total} />
                <StatCard title="Open" value={open} color="bg-red-100" />
                <StatCard title="In Progress" value={inProgress} color="bg-yellow-100" />
                <StatCard title="Closed" value={closed} color="bg-green-100" />
                {/* <StatCard title="Unactive" value={unactive} color="bg-gray-100" /> */}
            </div>

            {/* Tickets Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Ticket List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(ticket.created_at)}
                                    </TableCell>
                                    <TableCell>{ticket.name}</TableCell>
                                    <TableCell>{ticket.room_number}</TableCell>
                                    <TableCell>{ticket.category}</TableCell>

                                    <TableCell className="max-w-[250px] truncate" title={ticket.description}>
                                        {ticket.description}
                                    </TableCell>

                                    <TableCell className="text-yellow-500">
                                        {renderStars(ticket.rating)}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                getPriority(ticket.rating) === "High"
                                                    ? "destructive"
                                                    : getPriority(ticket.rating) === "Medium"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {getPriority(ticket.rating)}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge>{ticket.status}</Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={ticket.status}
                                                onValueChange={(value) =>
                                                    handleStatusChange(ticket.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Open">Open</SelectItem>
                                                    <SelectItem value="In Progress">
                                                        In Progress
                                                    </SelectItem>
                                                    <SelectItem value="Closed">Closed</SelectItem>
                                                    <SelectItem value="Unactive">Unactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                size="sm"
                                                onClick={() => saveStatus(ticket.id)}
                                                disabled={!changedStatuses[ticket.id] || saveStatuses[ticket.id]}
                                                variant={changedStatuses[ticket.id] ? "default" : "outline"}
                                            >
                                                {saveStatuses[ticket.id] ? "Saving..." : "Save"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// ---------------------------
// Reusable Stat Card
// ---------------------------
function StatCard({ title, value, color = "bg-muted" }) {
    return (
        <Card className={color}>
            <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{title}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
            </CardContent>
        </Card>
    );
}
