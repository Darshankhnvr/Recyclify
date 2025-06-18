import WasteLogForm from '@/components/dashboard/WasteLogForm'
import { logWaste } from '@/lib/actions/waste.actions'
import React from 'react'
import {Leaf} from "lucide-react";

const LogWastePage = () => {
  return (
    <div>
        <header className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-lg shadow">
                    <Leaf className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Log Your Green Contribution
                </h1>
            </div>
            <p className="mt-1 text-md text-gray-600 dark:text-gray-400 max-w-2xl">
                Every item you log brings us closer to a sustainable future. Fill in the details below to record your recycling activity and earn points!
            </p>
        </header>
      <h2 className="text-xl font-semibold mb-4">Log New Waste</h2>
      <p className={'mb-5'}>Log the type and amount of waste you've recycled.</p>
      <WasteLogForm onSubmitAction={logWaste} />
    </div>
  )
}

export default LogWastePage
