import React, { useEffect, useState } from 'react';
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pickupDate, setPickupDate] = useState("");
    const [note, setNote] = useState("");
    const [claimCode, setClaimCode] = useState("");
    const [membershipId, setMembershipId] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:5127/api/orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5127/api/orders/${orderId}`);
            setOrders(orders.filter((o) => o.id !== orderId));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const openPickupModal = (order) => {
        setSelectedOrder(order);
        setPickupDate("");
        setNote("");
        setShowPickupModal(true);
    };

    const handlePickup = async () => {
        try {
            await axios.put(`http://localhost:5127/api/orders/${selectedOrder.id}/pickup`, {
                pickupDate: new Date(pickupDate).toISOString(),
                note
            });
            await fetchOrders();
            setShowPickupModal(false);
        } catch (err) {
            console.error("Pickup update failed:", err);
        }
    };

    const openVerifyModal = (order) => {
        setSelectedOrder(order);
        setClaimCode(order.claimCode);
        setMembershipId("");
        setShowVerifyModal(true);
    };

    const handleVerify = async () => {
        try {
            await axios.post(`http://localhost:5127/api/orders/verify`, {
                claimCode,
                membershipId
            });
            await fetchOrders();
            setShowVerifyModal(false);
        } catch (err) {
            console.error("Verification failed:", err);
        }
    };

    return (
        <div className="h-screen flex">
            <AdminNav />
            <div className='flex-1 flex flex-col'>
                <AdminTop />
                <div className="p-6">
                    <h2 className="text-center text-lg font-semibold mb-4">Orders</h2>
                    <div className="overflow-auto">
                        <table className="min-w-full table-auto border border-gray-300">
                            <thead className="bg-black text-white text-sm">
                                <tr>
                                    <th className="px-4 py-2 text-left">Order ID</th>
                                    <th className="px-4 py-2 text-left">Customer Name</th>
                                    <th className="px-4 py-2 text-left">Book Name</th>
                                    <th className="px-4 py-2 text-left">Claim Code</th>
                                    <th className="px-4 py-2 text-left">Total Amount</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Order Date</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="8" className="text-center py-6">Loading...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-6">No orders found.</td></tr>
                                ) : (
                                    orders.map((o) => (
                                        <tr key={o.id} className="border-t">
                                            <td className="px-4 py-2">{o.id}</td>
                                            <td className="px-4 py-2">{o.customerName}</td>
                                            <td className="px-4 py-2">{o.bookName}</td>
                                            <td className="px-4 py-2">{o.claimCode}</td>
                                            <td className="px-4 py-2">{o.totalAmount}</td>
                                            <td className="px-4 py-2">{o.status}</td>
                                            <td className="px-4 py-2">{o.orderDate?.slice(0, 10)}</td>
                                            <td className="px-4 py-2 space-y-2">
                                                {o.status === "Pending" && (
                                                    <button onClick={() => openPickupModal(o)}
                                                        className="bg-green-600 text-white px-4 py-1 rounded w-full">
                                                        Ready for Pickup
                                                    </button>
                                                )}
                                                {o.status === "ReadyForPickup" && (
                                                    <button onClick={() => openVerifyModal(o)}
                                                        className="bg-blue-600 text-white px-4 py-1 rounded w-full">
                                                        Verify Claim
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(o.id)}
                                                    className="bg-red-600 text-white px-4 py-1 rounded w-full">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {showPickupModal && (
                        <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-md p-6 w-[90%] max-w-xl border">
                                <h2 className="text-center text-lg font-semibold mb-4">Mark as Ready for Pickup</h2>
                                <form className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block font-medium">Pickup Date</label>
                                        <input type="date" value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            className="w-full border p-2 rounded" required />
                                    </div>
                                    <div>
                                        <label className="block font-medium">Note / Message (optional)</label>
                                        <textarea value={note} onChange={(e) => setNote(e.target.value)}
                                            className="w-full border p-2 rounded"
                                            placeholder="e.g., Bring ID when picking up" />
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2">
                                        <button type="button" onClick={handlePickup}
                                            className="bg-[#5c2314] text-white px-6 py-2 rounded">
                                            Confirm
                                        </button>
                                        <button type="button" onClick={() => setShowPickupModal(false)}
                                            className="bg-gray-600 text-white px-6 py-2 rounded">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {showVerifyModal && (
                        <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-md p-6 w-[90%] max-w-xl border">
                                <h2 className="text-center text-lg font-semibold mb-4">Verify Claim Code</h2>
                                <form className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block font-medium">Claim Code</label>
                                        <input type="text" value={claimCode}
                                            onChange={(e) => setClaimCode(e.target.value)}
                                            className="w-full border p-2 rounded" required />
                                    </div>
                                    <div>
                                        <label className="block font-medium">Membership ID</label>
                                        <input type="text" value={membershipId}
                                            onChange={(e) => setMembershipId(e.target.value)}
                                            className="w-full border p-2 rounded" required />
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2">
                                        <button type="button" onClick={handleVerify}
                                            className="bg-[#5c2314] text-white px-6 py-2 rounded">
                                            Verify
                                        </button>
                                        <button type="button" onClick={() => setShowVerifyModal(false)}
                                            className="bg-gray-600 text-white px-6 py-2 rounded">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminOrders;