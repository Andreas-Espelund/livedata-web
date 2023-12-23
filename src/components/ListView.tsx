import { Individual } from '@/types/types'
import React from 'react'
import ListItem from './ListItem'


type ListViewProps = {
    items: Individual[]
}

export default function ListView({ items }: ListViewProps) {
  return (
    <table className="table-auto border-spacing-2 w-full rounded-lg overflow-hidden outline outline-zinc-200">
        <thead className="bg-zinc-200">
          <tr className="">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Kjønn</th>
            <th className="text-left p-4">Født</th>
            <th className="text-left p-4">Mor</th>
            <th className="text-left p-4">Far</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Flaskelam</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e: any) => 
            <ListItem item={e} key={e.id}/>
          )}
        </tbody>
    </table>
  )
}
