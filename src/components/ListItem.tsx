import React from 'react'
import { Individual } from '@/types/types'
import Link from 'next/link'
Link
type ListItemProps = {
    item: Individual
}

export default function ListItem({ item }: ListItemProps) {
  return (
    <tr key={item.id} className="hover:bg-zinc-200 transition-all">
        <td className="text-left p-4">
          <Link href={`/individuals/${item.id}`}>
            {item.id}
          </Link>
        </td>
        
        <td className="text-left p-4">{item.gender?'Søye':'Veir'}</td>
        <td className="text-left p-4">{item.birth_date}</td>
        
        <td className="text-left p-4">
          <Link href={`/individuals/${item.mother||''}`}>
            {item.mother || 'None'}
          </Link>
        </td>
        
        <td className="text-left p-4">
          <Link href={`/individuals/${item.father||''}`}>
            {item.father || 'None'}
          </Link>
        </td>

        <td className="text-left p-4">{item.active?'Ok':'Utmeldt'}</td>
        <td className="text-left p-4">{item.bottle?'Ja':'Nei'}</td>
    </tr>
  )
}
