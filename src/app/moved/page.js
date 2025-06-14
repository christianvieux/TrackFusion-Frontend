// app/moved/page.js
"use client";

import React from "react";
import Link from "next/link";

export default function WebsiteMovedPage() {
 return (
   <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
     <div className="mx-auto max-w-2xl text-center px-4">
       <h1 className="text-4xl font-bold mb-6">Website Has Moved</h1>
       <div className="bg-gray-800/50 p-8 rounded-lg backdrop-blur">
         <p className="text-xl mb-6">
           Thank you for your interest in my portfolio project. The website has been migrated to a new domain with improved features and capabilities.
         </p>
         <p className="text-lg mb-8">
           Please visit{" "}
           <Link 
             href="https://trackfusionweb.com"
             className="text-blue-400 hover:text-blue-300 underline transition-colors font-medium"
             target="_blank"
             rel="noopener noreferrer"
           >
             https://trackfusionweb.com
           </Link>
           {" "}to access the latest version.
         </p>
         <div className="text-gray-300 text-sm">
           <p>For recruiters: The updated site demonstrates additional technical competencies including AWS deployment and custom domain configuration.</p>
         </div>
       </div>
     </div>
   </div>
 );
}