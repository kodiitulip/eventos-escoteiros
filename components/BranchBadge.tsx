import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EventScoutBranches } from '@/schemas/escoteiro';

interface BranchBadgeProps {
  branch: EventScoutBranches;
  className?: string;
}

const branchConfig: Record<EventScoutBranches, { label: string; className: string }> = {
  lobinho: {
    label: 'Lobinho',
    className: 'bg-lobinho text-lobinho-foreground hover:bg-lobinho/90',
  },
  escoteiro: {
    label: 'Escoteiro',
    className: 'bg-escoteiro text-escoteiro-foreground hover:bg-escoteiro/90',
  },
  senior: {
    label: 'Sênior',
    className: 'bg-senior text-senior-foreground hover:bg-senior/90',
  },
  pioneiro: {
    label: 'Pioneiro',
    className: 'bg-pioneiro text-pioneiro-foreground hover:bg-pioneiro/90',
  },
  geral: {
    label: 'Geral',
    className: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
};

export function BranchBadge({ branch, className }: BranchBadgeProps) {
  const config = branchConfig[branch];

  return <Badge className={cn(config.className, className)}>{config.label}</Badge>;
}
