import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SubscriptionList() {
  const subscriptions = [
    { name: "Netflix", cost: 15.99, cycle: "Monthly", nextPayment: "2023-07-15" },
    { name: "Spotify", cost: 9.99, cycle: "Monthly", nextPayment: "2023-07-20" },
    { name: "Adobe Creative Cloud", cost: 52.99, cycle: "Monthly", nextPayment: "2023-07-25" },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Billing Cycle</TableHead>
          <TableHead>Next Payment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((sub) => (
          <TableRow key={sub.name}>
            <TableCell className="font-medium">{sub.name}</TableCell>
            <TableCell>${sub.cost.toFixed(2)}</TableCell>
            <TableCell>{sub.cycle}</TableCell>
            <TableCell>{sub.nextPayment}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

