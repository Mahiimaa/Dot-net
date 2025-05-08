import React, { useState, useEffect } from "react";
import AdminNav from "../Components/AdminNavbar";
import AdminTop from "../Components/AdminTop";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Pagination from "../Components/Pagination";
import { CiSearch } from "react-icons/ci";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedStock, setUpdatedStock] = useState("");
  const [updatedReserved, setUpdatedReserved] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInventory = async (page = 1, search = "") => {
    try {
      const res = await axios.get("http://localhost:5127/api/inventory", {
        params: {
          page,
          pageSize: booksPerPage,
          search,
        },
      });
      setInventory(res.data);
      setTotalPages(Math.ceil(res.data.total / booksPerPage) || 1);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, booksPerPage]);

  useEffect(() => {
    fetchInventory(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, booksPerPage]);

  const openModal = (item) => {
    setSelectedItem(item);
    setUpdatedStock(item.inStockQty);
    setUpdatedReserved(item.reservedQty);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5127/api/inventory/${selectedItem.id}`,
        {
          inStockQty: parseInt(updatedStock),
          reservedQty: parseInt(updatedReserved),
        }
      );

      setInventory((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                inStockQty: updatedStock,
                reservedQty: updatedReserved,
              }
            : item
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setUpdatedStock("");
    setUpdatedReserved("");
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.isbn.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * booksPerPage;
  const indexOfFirstItem = indexOfLastItem - booksPerPage;
  const currentItems = filteredInventory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    if (filteredInventory.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredInventory]);

  return (
    <div className="h-screen flex ">
      <AdminNav />
      <div className="flex-1 flex flex-col">
        <AdminTop />
        <div className="p-6">
          <h2 className="text-center text-lg font-semibold mb-4">Inventory</h2>
          <div className="flex items-center gap-4 justify-between w-full mb-4">
            <div className="relative w-full">
              <div className="flex border rounded-lg border-gray-300 items-center w-1/3">
                <CiSearch className="w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN"
                  className="border-none p-2 focus:outline-none focus:ring-0 focus:border-none w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  aria-label="Search books by title, author, or ISBN"
                />
              </div>
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <select
              value={booksPerPage}
              onChange={(e) => {
                setBooksPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded"
              aria-label="Select items per page"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-black text-white text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">ISBN</th>
                  <th className="px-4 py-2 text-left">Total Qty</th>
                  <th className="px-4 py-2 text-left">In Stock Quantity</th>
                  <th className="px-4 py-2 text-left">Reserved</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">{item.title}</td>
                      <td className="px-4 py-2">{item.isbn}</td>
                      <td className="px-4 py-2">
                        {parseInt(item.inStockQty) + parseInt(item.reservedQty)}
                      </td>
                      <td
                        className={`px-4 py-2font-semibold ${
                          item.inStockQty < 5
                            ? "text-red-600"
                            : "text-green-700"
                        }`}
                      >
                        {item.inStockQty}
                      </td>
                      <td className="px-4 py-2">{item.reservedQty}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-[#5c2314] text-white px-4 py-1 rounded hover:opacity-90"
                          onClick={() => openModal(item)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            maxPagesToShow={5}
            className="mt-4"
            ariaLabel="Inventory pagination"
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[90%] max-w-xl border">
            <h2 className="text-center text-lg font-semibold mb-4">
              Update Inventory
            </h2>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  value={selectedItem.title}
                  disabled
                  className="w-full border rounded p-2 bg-gray-200"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">ISBN</label>
                <input
                  type="text"
                  value={selectedItem.isbn}
                  disabled
                  className="w-full border rounded p-2 bg-gray-200"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  In Stock Quantity
                </label>
                <input
                  type="number"
                  value={updatedStock}
                  onChange={(e) => setUpdatedStock(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Reserved</label>
                <input
                  type="number"
                  value={updatedReserved}
                  onChange={(e) => setUpdatedReserved(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="col-span-2 flex justify-center mt-4 gap-4">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-[#5c2314] text-white px-6 py-2 rounded hover:opacity-90"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
