import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    ticket_number: '',
    case_id: '',
    company: '',
    contact: '',
    problem: '',
    schedule: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('tickets.store'));
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Tickets', href: '/tickets' },
        { label: 'Create New Ticket' },
      ]}
    >
      <Head title="Create Ticket" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Ticket
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new support ticket
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/tickets')}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Tickets
          </Button>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Ticket Number */}
                <div className="space-y-2">
                  <Label htmlFor="ticket_number">
                    Ticket Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ticket_number"
                    value={data.ticket_number}
                    onChange={(e) => setData('ticket_number', e.target.value)}
                    placeholder="Enter ticket number"
                    required
                  />
                  <InputError message={errors.ticket_number} />
                </div>

                {/* Case ID */}
                <div className="space-y-2">
                  <Label htmlFor="case_id">Case ID</Label>
                  <Input
                    id="case_id"
                    value={data.case_id}
                    onChange={(e) => setData('case_id', e.target.value)}
                    placeholder="Enter case ID (optional)"
                  />
                  <InputError message={errors.case_id} />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={data.company}
                    onChange={(e) => setData('company', e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                  <InputError message={errors.company} />
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input
                    id="contact"
                    value={data.contact}
                    onChange={(e) => setData('contact', e.target.value)}
                    placeholder="Enter contact person"
                  />
                  <InputError message={errors.contact} />
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    type="datetime-local"
                    value={data.schedule}
                    onChange={(e) => setData('schedule', e.target.value)}
                  />
                  <InputError message={errors.schedule} />
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <Label htmlFor="problem">
                  Problem Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="problem"
                  value={data.problem}
                  onChange={(e) => setData('problem', e.target.value)}
                  placeholder="Describe the problem in detail..."
                  rows={6}
                  required
                />
                <InputError message={errors.problem} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/tickets')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
