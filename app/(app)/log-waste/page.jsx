import WasteLogForm from '@/components/dashboard/WasteLogForm'
import { logWaste } from '@/lib/actions/waste.actions'
import React from 'react'

const LogWastePage = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Log New Waste</h2>
      <p>Log the type and amount of waste you've recycled.</p>
      <WasteLogForm onSubmitAction={logWaste} />
    </div>
  )
}

export default LogWastePage
