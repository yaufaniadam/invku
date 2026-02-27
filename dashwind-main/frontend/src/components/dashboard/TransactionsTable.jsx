import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const transactions = [
  {
    id: 'TRX-001',
    customer: { name: 'Emma Wilson', email: 'emma@email.com', avatar: 'emma' },
    date: 'Dec 12, 2024',
    amount: '$2,450.00',
    status: 'completed',
  },
  {
    id: 'TRX-002',
    customer: { name: 'James Anderson', email: 'james@email.com', avatar: 'james' },
    date: 'Dec 11, 2024',
    amount: '$1,890.00',
    status: 'pending',
  },
  {
    id: 'TRX-003',
    customer: { name: 'Sophie Taylor', email: 'sophie@email.com', avatar: 'sophie' },
    date: 'Dec 11, 2024',
    amount: '$3,100.00',
    status: 'completed',
  },
  {
    id: 'TRX-004',
    customer: { name: 'Michael Brown', email: 'michael@email.com', avatar: 'michael' },
    date: 'Dec 10, 2024',
    amount: '$890.00',
    status: 'failed',
  },
  {
    id: 'TRX-005',
    customer: { name: 'Olivia Davis', email: 'olivia@email.com', avatar: 'olivia' },
    date: 'Dec 10, 2024',
    amount: '$1,560.00',
    status: 'completed',
  },
];

const statusStyles = {
  completed: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
};

export const TransactionsTable = () => {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Latest payment activity</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-semibold text-muted-foreground">Customer</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Date</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Amount</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id} 
                  className="border-border transition-colors hover:bg-secondary/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${transaction.customer.avatar}`} 
                        />
                        <AvatarFallback>
                          {transaction.customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{transaction.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{transaction.customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                  <TableCell className="font-semibold text-foreground">{transaction.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${statusStyles[transaction.status]}`}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Download className="h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
