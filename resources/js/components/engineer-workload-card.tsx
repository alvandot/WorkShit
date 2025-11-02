import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EngineerStats } from '@/types';
import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    FileText,
    TrendingUp,
    UserCircle,
} from 'lucide-react';

interface EngineerWorkloadCardProps {
    engineer: EngineerStats;
}

export default function EngineerWorkloadCard({
    engineer,
}: EngineerWorkloadCardProps) {
    const completionRate =
        engineer.total_tickets_count > 0
            ? (engineer.completed_tickets_count /
                  engineer.total_tickets_count) *
              100
            : 0;

    const getWorkloadLevel = () => {
        if (engineer.active_tickets_count === 0) return 'light';
        if (engineer.active_tickets_count <= 5) return 'moderate';
        if (engineer.active_tickets_count <= 10) return 'heavy';
        return 'critical';
    };

    const workloadLevel = getWorkloadLevel();

    const workloadColors = {
        light: 'bg-green-500/10 text-green-600 border-green-500/20',
        moderate: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        heavy: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
        critical: 'bg-red-500/10 text-red-600 border-red-500/20',
    };

    const workloadLabels = {
        light: 'Light Load',
        moderate: 'Moderate Load',
        heavy: 'Heavy Load',
        critical: 'Critical Load',
    };

    return (
        <Card className="transition-colors hover:border-primary/50">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <UserCircle className="size-4 shrink-0" />
                            <span className="truncate">{engineer.name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1 truncate">
                            {engineer.email}
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className={workloadColors[workloadLevel]}
                    >
                        {workloadLabels[workloadLevel]}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="size-3.5" />
                            <span>Active</span>
                        </div>
                        <p className="text-2xl font-bold">
                            {engineer.active_tickets_count}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle2 className="size-3.5" />
                            <span>Completed</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {engineer.completed_tickets_count}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="size-3.5" />
                            <span>Total</span>
                        </div>
                        <p className="text-2xl font-bold text-muted-foreground">
                            {engineer.total_tickets_count}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Completion Rate
                        </span>
                        <div className="flex items-center gap-1.5 font-medium">
                            <TrendingUp className="size-3.5 text-green-600" />
                            <span>{completionRate.toFixed(0)}%</span>
                        </div>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                </div>

                <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href={`/assignments?engineer_id=${engineer.id}`}>
                        View Assignments
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
