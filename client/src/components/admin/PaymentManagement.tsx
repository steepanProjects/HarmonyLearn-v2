import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, Search, Download, RefreshCw, Eye, AlertCircle, 
  DollarSign, TrendingUp, Users, Calendar, CheckCircle, X
} from "lucide-react";

interface Payment {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  courseId: number;
  courseName: string;
  amount: number;
  currency: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Bank Transfer';
  transactionId: string;
  date: string;
  processingFee: number;
  netAmount: number;
}

export const PaymentManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const payments: Payment[] = [
    {
      id: "txn_001",
      userId: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      courseId: 1,
      courseName: "Advanced Jazz Piano",
      amount: 199.99,
      currency: "USD",
      status: "Completed",
      paymentMethod: "Credit Card",
      transactionId: "ch_3OvqKr2eZvKYlo2C0K8jdnr1",
      date: "2024-12-20T10:30:00Z",
      processingFee: 6.10,
      netAmount: 193.89
    },
    {
      id: "txn_002",
      userId: 2,
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      courseId: 2,
      courseName: "Guitar Fundamentals",
      amount: 89.99,
      currency: "USD",
      status: "Pending",
      paymentMethod: "PayPal",
      transactionId: "PAYID-MZ3XJ6A12345678901234567",
      date: "2024-12-20T14:15:00Z",
      processingFee: 2.90,
      netAmount: 87.09
    },
    {
      id: "txn_003",
      userId: 3,
      userName: "Mike Chen",
      userEmail: "mike@example.com",
      courseId: 3,
      courseName: "Classical Violin",
      amount: 299.99,
      currency: "USD",
      status: "Failed",
      paymentMethod: "Credit Card",
      transactionId: "ch_3OvqKr2eZvKYlo2C0K8jdnr2",
      date: "2024-12-19T16:45:00Z",
      processingFee: 0,
      netAmount: 0
    },
    {
      id: "txn_004",
      userId: 4,
      userName: "Elena Rodriguez",
      userEmail: "elena@example.com",
      courseId: 1,
      courseName: "Advanced Jazz Piano",
      amount: 199.99,
      currency: "USD",
      status: "Refunded",
      paymentMethod: "Credit Card",
      transactionId: "ch_3OvqKr2eZvKYlo2C0K8jdnr3",
      date: "2024-12-18T09:20:00Z",
      processingFee: -6.10,
      netAmount: -193.89
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.paymentMethod.toLowerCase().replace(' ', '') === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handlePaymentAction = (action: string, paymentId: string) => {
    toast({
      title: `Payment ${action}`,
      description: `Payment has been ${action.toLowerCase()} successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      case 'Refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card': return <CreditCard className="h-4 w-4" />;
      case 'PayPal': return <span className="text-xs font-bold">PP</span>;
      case 'Bank Transfer': return <span className="text-xs font-bold">BT</span>;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const refundedAmount = payments
    .filter(p => p.status === 'Refunded')
    .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Payment Management</h2>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Payments
          </Button>
          <Button variant="hero">
            <TrendingUp className="mr-2 h-4 w-4" />
            Revenue Analytics
          </Button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refunded</p>
                <p className="text-2xl font-bold text-red-600">${refundedAmount.toFixed(2)}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="creditcard">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="banktransfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.id}</p>
                      <p className="text-sm text-muted-foreground">{payment.transactionId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.userName}</p>
                      <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{payment.courseName}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">${payment.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        Net: ${payment.netAmount.toFixed(2)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(payment.paymentMethod)}
                      <span className="text-sm">{payment.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedPayment(payment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                                  <p className="text-sm font-mono">{selectedPayment.transactionId}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                                  <p className="text-sm">{selectedPayment.userName}</p>
                                  <p className="text-sm text-muted-foreground">{selectedPayment.userEmail}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Course</Label>
                                  <p className="text-sm">{selectedPayment.courseName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                                  <p className="text-sm">{selectedPayment.paymentMethod}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                                  <p className="text-sm">${selectedPayment.amount}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Processing Fee</Label>
                                  <p className="text-sm">${selectedPayment.processingFee.toFixed(2)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Net Amount</Label>
                                  <p className="text-sm font-medium text-green-600">${selectedPayment.netAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                  <Badge variant={getStatusColor(selectedPayment.status)}>{selectedPayment.status}</Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                                  <p className="text-sm">{new Date(selectedPayment.date).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {payment.status === 'Completed' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handlePaymentAction('Refunded', payment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handlePaymentAction('Downloaded', payment.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};