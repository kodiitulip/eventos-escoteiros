import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PaymentStatus } from '@/schemas/escoteiro';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pendente: {
    label: 'Pendente',
    className: 'bg-warning text-success-foreground hover:bg-warning/90',
  },
  pago: {
    label: 'Pago',
    className: 'bg-success text-success-foreground hover:bg-success/90',
  },
  isento: {
    label: 'Isento',
    className: 'bg-muted text-muted-foreground hover:bg-muted/90',
  },
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge className={cn(config.className, className)}>{config.label}</Badge>;
}
