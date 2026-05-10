"use client";

import AccountSettings from "../components/AccountSettings";
import withAuth from "../hoc/withAuth";

function SettingsPage() {
  return <AccountSettings />;
}

export default withAuth(SettingsPage);