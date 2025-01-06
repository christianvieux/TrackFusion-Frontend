// app/hoc/withAuth.js
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../context/SessionContext";

export default function WithAuth(WrappedComponent) {
  const EnhancedComponent = (props) => {
    const { user, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div className="text-green">Loading...</div>;
    }

    if (!user) {
      return <div className="text-green">Redirecting to login...</div>;
    }
    
    return <WrappedComponent {...props} />;
  };

  // Set the display name for easier debugging
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  EnhancedComponent.displayName = `WithAuth(${wrappedComponentName})`;

  return EnhancedComponent;
}
