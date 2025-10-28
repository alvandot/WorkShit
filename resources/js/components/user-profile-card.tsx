import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { edit as profileEdit } from '@/routes/profile';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, Mail, Shield, User as UserIcon } from 'lucide-react';

interface UserProfileCardProps {
    user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
    const getInitials = useInitials();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">
                                {user.name}
                            </CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {user.email}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {user.email_verified_at && (
                            <Badge
                                variant="default"
                                className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                            >
                                <Shield className="mr-1 h-3 w-3" />
                                Terverifikasi
                            </Badge>
                        )}
                        {user.two_factor_enabled && (
                            <Badge
                                variant="default"
                                className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400"
                            >
                                <Shield className="mr-1 h-3 w-3" />
                                2FA Aktif
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                            Informasi Akun
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        ID Pengguna
                                    </p>
                                    <p className="font-medium">#{user.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        Bergabung Sejak
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        Status Email
                                    </p>
                                    <p className="font-medium">
                                        {user.email_verified_at
                                            ? 'Terverifikasi'
                                            : 'Belum Terverifikasi'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                        <Button asChild className="flex-1" variant="default">
                            <Link href={profileEdit().url}>Edit Profil</Link>
                        </Button>
                        <Button asChild className="flex-1" variant="outline">
                            <Link href={profileEdit().url}>Pengaturan</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
