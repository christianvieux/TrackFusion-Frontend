//app/layout.js
// .css file
import "../../public/css/global.css";
import React from "react";
import App from "./components/app.js";
import { SessionProvider } from "./context/SessionContext.js";
import { UserInfoProvider } from "./context/UserInfoContext";
import { DynamicStyles } from "./components/DynamicStyles";
import { TrackEventsProvider } from "./context/TrackEventsContext";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <DynamicStyles />
      </head>
      <body className="h-screen bg-green-darkest">
          <SessionProvider>
            <UserInfoProvider>
              <TrackEventsProvider>
                <App>{children}</App>
              </TrackEventsProvider>
            </UserInfoProvider>
          </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;