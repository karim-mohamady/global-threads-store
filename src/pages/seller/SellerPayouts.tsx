import { useState, useEffect } from "react";
import { Wallet, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sellerApi } from "@/services/api";

interface Payout {
  id: number;
  amount: number;
  status: "pending" | "processing" | "completed" | "rejected";
  requested_at: string;
  processed_at?: string;
  reference?: string;
}

const SellerPayouts = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestAmount, setRequestAmount] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [balance, setBalance] = useState({
    available: 2500.00,
    pending: 450.00,
    totalPaid: 12000.00,
  });

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    setLoading(true);
    try {
      const response = await sellerApi.payouts.getAll();
      setPayouts(response.data || []);
    } catch (error) {
      // Use mock data for demo
      setPayouts([
        { id: 1, amount: 500, status: "completed", requested_at: "2024-01-15", processed_at: "2024-01-17", reference: "PAY-001" },
        { id: 2, amount: 750, status: "completed", requested_at: "2024-01-01", processed_at: "2024-01-03", reference: "PAY-002" },
        { id: 3, amount: 450, status: "pending", requested_at: "2024-01-20" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please enter a valid amount" : "الرجاء إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance.available) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Insufficient balance" : "رصيد غير كافٍ",
        variant: "destructive",
      });
      return;
    }

    setRequesting(true);
    try {
      await sellerApi.payouts.request(amount);
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" ? "Payout request submitted" : "تم تقديم طلب السحب",
      });
      setDialogOpen(false);
      setRequestAmount("");
      loadPayouts();
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRequesting(false);
    }
  };

  const getStatusBadge = (status: Payout["status"]) => {
    const config = {
      pending: { label: language === "en" ? "Pending" : "معلق", variant: "secondary" as const, icon: Clock },
      processing: { label: language === "en" ? "Processing" : "قيد المعالجة", variant: "secondary" as const, icon: Clock },
      completed: { label: language === "en" ? "Completed" : "مكتمل", variant: "default" as const, icon: CheckCircle },
      rejected: { label: language === "en" ? "Rejected" : "مرفوض", variant: "destructive" as const, icon: XCircle },
    };
    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Payouts" : "المدفوعات"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en" ? "Manage your earnings and payouts" : "إدارة أرباحك ومدفوعاتك"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Wallet className="h-4 w-4 me-2" />
              {language === "en" ? "Request Payout" : "طلب سحب"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Request Payout" : "طلب سحب"}</DialogTitle>
              <DialogDescription>
                {language === "en"
                  ? `Available balance: $${balance.available.toFixed(2)}`
                  : `الرصيد المتاح: $${balance.available.toFixed(2)}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === "en" ? "Amount" : "المبلغ"}</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={balance.available}
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setRequestAmount(balance.available.toString())}
              >
                {language === "en" ? "Withdraw all" : "سحب الكل"}
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              <Button onClick={handleRequestPayout} disabled={requesting}>
                {requesting
                  ? language === "en" ? "Processing..." : "جاري المعالجة..."
                  : language === "en" ? "Request" : "طلب"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Available Balance" : "الرصيد المتاح"}
                </p>
                <p className="text-3xl font-bold text-primary mt-1">
                  ${balance.available.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Pending Payouts" : "المدفوعات المعلقة"}
                </p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  ${balance.pending.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Total Paid" : "إجمالي المدفوعات"}
                </p>
                <p className="text-3xl font-bold mt-1">
                  ${balance.totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Payout History" : "سجل المدفوعات"}</CardTitle>
          <CardDescription>
            {language === "en" ? "View all your payout requests" : "عرض جميع طلبات السحب"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">
                {language === "en" ? "No payouts yet" : "لا توجد مدفوعات بعد"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {language === "en"
                  ? "Your payout history will appear here"
                  : "سيظهر سجل مدفوعاتك هنا"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "en" ? "ID" : "الرقم"}</TableHead>
                    <TableHead>{language === "en" ? "Amount" : "المبلغ"}</TableHead>
                    <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead>{language === "en" ? "Requested" : "تاريخ الطلب"}</TableHead>
                    <TableHead>{language === "en" ? "Processed" : "تاريخ المعالجة"}</TableHead>
                    <TableHead>{language === "en" ? "Reference" : "المرجع"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono">#{payout.id}</TableCell>
                      <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>{new Date(payout.requested_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payout.processed_at
                          ? new Date(payout.processed_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payout.reference || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerPayouts;
