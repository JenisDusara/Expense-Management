'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  CalendarIcon,
  Check,
  LoaderCircle,
  ScanLine,
  Upload,
  X,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { processReceipt, approveExpense, rejectExpense, createExpense } from '@/lib/actions';
import type { Expense, User } from '@/lib/definitions';
import { formatCurrency } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

const ExpenseFormSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().default('USD'),
  category: z.string(),
  description: z.string(),
  date: z.date(),
  restaurantName: z.string().optional(),
  expenseLines: z.array(z.string()).optional(),
});

type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;

export function ExpenseForm({ userId, companyId }: { userId: string, companyId: string }) {
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const receiptImage = PlaceHolderImages.find((img) => img.id === 'receipt-example');

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      amount: 0,
      currency: 'USD',
      description: '',
      restaurantName: '',
      expenseLines: [],
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    setReceiptPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      const result = await processReceipt(base64);
      setIsOcrLoading(false);
      if (result.success && result.data) {
        toast({ title: 'Receipt Scanned!', description: "We've filled in the details for you." });
        form.setValue('amount', result.data.amount);
        form.setValue('date', new Date(result.data.date));
        form.setValue('description', result.data.description);
        form.setValue('restaurantName', result.data.restaurantName);
        form.setValue('expenseLines', result.data.expenseLines);
        form.setValue('category', result.data.expenseType);
      } else {
        toast({ variant: 'destructive', title: 'Scan Failed', description: result.message });
      }
    };
  };

  const handleUseSample = async () => {
    if (!receiptImage) return;

    setIsOcrLoading(true);
    setReceiptPreview(receiptImage.imageUrl);

    setTimeout(async () => {
      const mockOcrData = {
        amount: 55.47,
        date: '2024-05-12',
        description: 'Dinner at The Corner Bistro',
        expenseType: 'Food',
        restaurantName: 'The Corner Bistro',
        expenseLines: ['Truffle Fries - $12.00', 'Bistro Burger - $22.50', 'Craft Beer - $9.00'],
      };

      const result = { success: true, data: mockOcrData };
      setIsOcrLoading(false);

      if (result.success && result.data) {
        toast({ title: 'Receipt Scanned!', description: "We've filled in the details for you." });
        form.setValue('amount', result.data.amount);
        form.setValue('date', new Date(result.data.date));
        form.setValue('description', result.data.description);
        form.setValue('restaurantName', result.data.restaurantName);
        form.setValue('expenseLines', result.data.expenseLines);
        form.setValue('category', result.data.expenseType);
      } else {
        toast({ variant: 'destructive', title: 'Scan Failed', description: 'Could not process sample.' });
      }
    }, 1500);
  };

  async function onSubmit(data: ExpenseFormValues) {
    startTransition(async () => {
      try {
        await createExpense(data, userId, companyId);
        toast({ title: 'Expense Submitted', description: 'Your expense is now pending approval.' });
        router.push('/expenses');
      } catch (error) {
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'Could not submit expense.' });
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Client lunch meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col pt-2">
                        <FormLabel>Expense Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Expense
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="relative">
          <CardHeader>
            <CardTitle>Scan Receipt</CardTitle>
            <CardDescription>Upload a receipt image to auto-fill the form.</CardDescription>
          </CardHeader>
          <CardContent>
            {isOcrLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Analyzing receipt...</p>
              </div>
            )}
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-6 text-center">
              {receiptPreview ? (
                <Image
                  src={receiptPreview}
                  alt="Receipt preview"
                  width={200}
                  height={300}
                  className="max-h-48 w-auto rounded-md object-contain"
                />
              ) : (
                <ScanLine className="h-12 w-12 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                {receiptPreview ? 'Replace receipt by uploading another.' : 'Supported formats: JPG, PNG'}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" /> Upload
                    <input
                      id="receipt-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg"
                    />
                  </label>
                </Button>
                <Button variant="secondary" onClick={handleUseSample}>
                  Use Sample
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const statusVariant: Record<Expense['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
};


export function ExpensesTable({
  expenses,
  onRowClick,
}: {
  expenses: Expense[];
  onRowClick: (expense: Expense) => void;
}) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense.id} onClick={() => onRowClick(expense)} className="cursor-pointer">
                <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(expense.amount, expense.currency)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[expense.status]} className={cn(
                    expense.status === 'Approved' && 'bg-primary hover:bg-primary',
                  )}>{expense.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No expenses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

export function ExpensesToApprove({ expenses, isLoading }: { expenses: Expense[], isLoading?: boolean }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleApprove = async (expense: Expense) => {
    setLoadingAction(`approve-${expense.id}`);
    await approveExpense(expense.id, expense.companyId, expense.userId, 'Approved via dashboard');
    setLoadingAction(null);
    toast({ title: 'Expense Approved' });
    router.refresh();
  };

  const handleReject = async (expense: Expense) => {
    setLoadingAction(`reject-${expense.id}`);
    // In a real app, a modal would pop up for comments.
    await rejectExpense(expense.id, expense.companyId, expense.userId, 'Rejected via dashboard');
    setLoadingAction(null);
    toast({ title: 'Expense Rejected', variant: 'destructive' });
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Awaiting Your Approval</CardTitle>
        <CardDescription>Review and act on expenses submitted by your team.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        ) : expenses.length > 0 ? (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between gap-4 rounded-md border p-3"
            >
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(expense.amount, expense.currency)} -{' '}
                  {format(new Date(expense.date), 'MMM d')}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => handleApprove(expense)}
                  disabled={!!loadingAction}
                  aria-label="Approve"
                >
                  {loadingAction === `approve-${expense.id}` ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleReject(expense)}
                  disabled={!!loadingAction}
                  aria-label="Reject"
                >
                  {loadingAction === `reject-${expense.id}` ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border-dashed p-8 text-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground">You have no pending approvals.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type ExpenseDetailModalProps = {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onOpenChange?: (open: boolean) => void;
};

export function ExpenseDetailModal({
  expense,
  isOpen,
  onClose,
  currentUser,
  onOpenChange,
}: ExpenseDetailModalProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleApprove = async (expense: Expense) => {
    setLoadingAction(`approve-${expense.id}`);
    await approveExpense(expense.id, expense.companyId, expense.userId, "Approved from detail view");
    setLoadingAction(null);
    toast({ title: "Expense Approved" });
    onClose();
    router.refresh();
  }

  const handleReject = async (expense: Expense) => {
    setLoadingAction(`reject-${expense.id}`);
    await rejectExpense(expense.id, expense.companyId, expense.userId, "Rejected from detail view");
    setLoadingAction(null);
    toast({ title: "Expense Rejected", variant: "destructive" });
    onClose();
    router.refresh();
  }


  if (!expense) return null;
  
  const canApprove = currentUser.role !== 'Employee' && expense.status === 'Pending';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{expense.description}</DialogTitle>
          <DialogDescription>
             {formatCurrency(expense.amount, expense.currency)} - Submitted on {format(new Date(expense.date), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={statusVariant[expense.status]}>{expense.status}</Badge>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{expense.category}</span>
            </div>
            {expense.restaurantName && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Restaurant</span>
                    <span>{expense.restaurantName}</span>
                </div>
            )}
            <Separator />
            <h4 className="font-medium">Approval History</h4>
            {expense.approvalHistory && expense.approvalHistory.length > 0 ? (
                <div className="space-y-2">
                    {expense.approvalHistory.map((entry, index) => (
                        <div key={index} className="text-sm">
                            <p><strong>{entry.status}</strong> by {entry.approverId} on {format(new Date(entry.date), "PPP")}</p>
                            {entry.comment && <p className="text-muted-foreground">Comment: {entry.comment}</p>}
                        </div>
                    ))}
                </div>
            ): (<p className="text-sm text-muted-foreground">No history yet.</p>)}

            {expense.expenseLines && expense.expenseLines.length > 0 && (
                <>
                    <Separator />
                    <h4 className="font-medium">Expense Items</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {expense.expenseLines.map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
        <DialogFooter>
          {canApprove && (
            <div className="flex w-full gap-2">
                 <Button 
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleReject(expense)}
                    disabled={!!loadingAction}
                 >
                    {loadingAction === `reject-${expense.id}` ? <LoaderCircle className="h-4 w-4 animate-spin"/> : 'Reject'}
                </Button>
                 <Button 
                    className="w-full"
                    onClick={() => handleApprove(expense)}
                    disabled={!!loadingAction}
                 >
                     {loadingAction === `approve-${expense.id}` ? <LoaderCircle className="h-4 w-4 animate-spin"/> : 'Approve'}
                </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
