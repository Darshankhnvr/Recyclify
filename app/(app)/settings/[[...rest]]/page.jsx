import { UserProfile } from '@clerk/nextjs';
import React from 'react'

const SettingsPage = () => {
  return (
    <div>
      <h2>Profile Settings</h2>
      <p>Manage your profile settings here.</p>
      <UserProfile path='/settings' routing='path' />
    </div>
  );
}

export default SettingsPage
