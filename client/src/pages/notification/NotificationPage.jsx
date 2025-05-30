import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { baseUrl } from "../../constant/url";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/notifications`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/notifications`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setShowDropdown(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting notifications");
    },
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold text-xl">Notifications</p>

        <div className="relative" ref={dropdownRef}>
          <button
            className="hover:bg-gray-800 p-2 rounded-full"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <IoSettingsOutline className="w-6 h-6" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={deleteNotifications}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
              >
                Delete all notifications
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && notifications?.length === 0 && (
        <div className="text-center py-6 text-gray-400 font-semibold">
          No notifications 🤔
        </div>
      )}

      <div className="flex flex-col">
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className="border-b border-gray-700 hover:bg-gray-900 transition-all px-4 py-3"
          >
            <div className="flex gap-3 items-center">
              {notification.type === "follow" && (
                <FaUser className="w-6 h-6 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-6 h-6 text-red-500" />
              )}

              <Link
                to={`/profile/${notification.from.userName}`}
                className="flex items-center gap-3"
              >
                <div className="avatar">
                  <div className="w-8 rounded-full overflow-hidden">
                    <img
                      src={
                        notification.from.profileImage ||
                        "/avatar-placeholder.png"
                      }
                      alt={`${notification.from.userName}'s avatar`}
                    />
                  </div>
                </div>

                <div className="text-sm md:text-base">
                  <span className="font-semibold">
                    @{notification.from.userName}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
