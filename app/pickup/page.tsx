"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

export default function PickUp(){
    const user = useAuthStore((state) => state.user);
    return <ProtectedRoute>
    Pick Up page step 1 of 3
     <div>
      UID: {user?.uid}
      <br />
      Phone: {user?.phoneNumber}
    </div>
    </ProtectedRoute>
}