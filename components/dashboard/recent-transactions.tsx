import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentTransactions() {
  const transactions = [
    {
      id: "1",
      amount: "-$250.00",
      name: "Spotify Subscription",
      date: "2023-06-15",
    },
    {
      id: "2",
      amount: "-$1000.00",
      name: "Rent Payment",
      date: "2023-06-01",
    },
    {
      id: "3",
      amount: "+$5000.00",
      name: "Salary Deposit",
      date: "2023-06-30",
    },
  ]

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>OP</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.date}</p>
          </div>
          <div className="ml-auto font-medium">{transaction.amount}</div>
        </div>
      ))}
    </div>
  )
}

