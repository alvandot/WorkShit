import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    BookOpen,
    FileQuestion,
    Mail,
    MessageSquare,
    Phone,
} from 'lucide-react';

export default function HelpIndex() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Help & Support', href: '/help' },
            ]}
        >
            <Head title="Help & Support" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                    <div className="space-y-2">
                        <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent">
                            Help & Support
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Get help with AppDesk and reach out to our support
                            team
                        </p>
                    </div>
                </div>

                {/* Support Options Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Documentation */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="size-6 text-primary" />
                            </div>
                            <CardTitle>Documentation</CardTitle>
                            <CardDescription>
                                Browse our comprehensive documentation and
                                guides
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Learn how to use all features of AppDesk with
                                our detailed documentation.
                            </p>
                        </CardContent>
                    </Card>

                    {/* FAQ */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                                <FileQuestion className="size-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle>FAQ</CardTitle>
                            <CardDescription>
                                Find answers to frequently asked questions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Quick answers to common questions about ticket
                                management and features.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                                <MessageSquare className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle>Contact Support</CardTitle>
                            <CardDescription>
                                Get in touch with our support team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Our support team is here to help you with any
                                issues or questions.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            Reach out to us through any of these channels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                <Mail className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">
                                    support@appdesk.com
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                <Phone className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p className="text-sm text-muted-foreground">
                                    +1 (555) 123-4567
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Live Chat
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Available Monday - Friday, 9AM - 5PM EST
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                        <CardDescription>
                            Common help topics and resources
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 md:grid-cols-2">
                            <a
                                href="#"
                                className="rounded-lg border p-3 transition-colors hover:bg-accent"
                            >
                                <p className="font-medium">
                                    Getting Started Guide
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Learn the basics of AppDesk
                                </p>
                            </a>
                            <a
                                href="#"
                                className="rounded-lg border p-3 transition-colors hover:bg-accent"
                            >
                                <p className="font-medium">
                                    Ticket Management
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    How to create and manage tickets
                                </p>
                            </a>
                            <a
                                href="#"
                                className="rounded-lg border p-3 transition-colors hover:bg-accent"
                            >
                                <p className="font-medium">
                                    User Management
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Managing engineers and assignments
                                </p>
                            </a>
                            <a
                                href="#"
                                className="rounded-lg border p-3 transition-colors hover:bg-accent"
                            >
                                <p className="font-medium">
                                    Analytics & Reports
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Understanding your data
                                </p>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
