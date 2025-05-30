import React from "react";
import toast from "react-hot-toast";
import { baseUrl } from "../constant/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useFollow() {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`${baseUrl}/api/users/follow/${userId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { follow, isPending };
}

export default useFollow;
