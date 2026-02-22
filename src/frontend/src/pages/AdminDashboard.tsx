import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useGetAllSubmissions, useMarkAsReviewed, useMarkAsFollowup, useMarkAsInProgress, useMarkAsCompleted, useIsCallerAdmin, useSendMessage, useAddDeliveryLink, useGetAllMessages } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckCircle2, Clock, Mail, Building, Calendar, DollarSign, FileText, AlertCircle, Loader2, PlayCircle, ShieldAlert, MessageSquare, Send, ExternalLink, Link, Headphones } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProjectSubmission, ProjectBudgetRange, ProjectStatus } from '../backend';

function normalizeStatus(status: ProjectStatus | string): string {
  if (typeof status === 'object' && status !== null) {
    return String(status);
  }
  return String(status);
}

function getBudgetRangeText(budget: ProjectBudgetRange): string {
  switch (budget) {
    case 'range1_10kNOK':
      return '1 000 – 10 000 NOK';
    case 'range10_50kNOK':
      return '10 000 – 50 000 NOK';
    case 'range50_100kNOK':
      return '50 000 – 100 000 NOK';
    case 'range100kPlusNOK':
      return '100 000 NOK +';
    default:
      return 'Ikke spesifisert';
  }
}

function getStatusLabel(status: ProjectStatus | string): string {
  const normalized = normalizeStatus(status);
  
  switch (normalized) {
    case 'new':
      return 'Ny';
    case 'reviewed':
      return 'Gjennomgått';
    case 'followup':
      return 'Trenger oppfølging';
    case 'inProgress':
      return 'Under arbeid';
    case 'completed':
      return 'Fullført';
    default:
      console.warn('Unknown status label:', status, 'Normalized:', normalized);
      return 'Ukjent status';
  }
}

function getStatusBadge(status: ProjectStatus) {
  const normalized = normalizeStatus(status);
  
  switch (normalized) {
    case 'new':
      return (
        <Badge variant="default" className="gap-1">
          <Clock className="h-3 w-3" />
          Ny
        </Badge>
      );
    case 'reviewed':
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Gjennomgått
        </Badge>
      );
    case 'followup':
      return (
        <Badge variant="outline" className="gap-1 border-orange-500 text-orange-500">
          <AlertCircle className="h-3 w-3" />
          Trenger oppfølging
        </Badge>
      );
    case 'inProgress':
      return (
        <Badge variant="outline" className="gap-1 border-blue-500 text-blue-500">
          <PlayCircle className="h-3 w-3" />
          Under arbeid
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="gap-1 border-green-500 text-green-500">
          <CheckCircle2 className="h-3 w-3" />
          Fullført
        </Badge>
      );
    default:
      console.warn('Unknown status for badge:', status, 'Normalized:', normalized);
      return (
        <Badge variant="outline" className="gap-1 border-gray-500 text-gray-500">
          <AlertCircle className="h-3 w-3" />
          Ukjent status
        </Badge>
      );
  }
}

export default function AdminDashboard() {
  const { data: submissions, isLoading, error } = useGetAllSubmissions();
  const { data: isAdmin, isLoading: isAdminLoading, refetch: refetchAdminStatus } = useIsCallerAdmin();
  const markAsReviewed = useMarkAsReviewed();
  const markAsFollowup = useMarkAsFollowup();
  const markAsInProgress = useMarkAsInProgress();
  const markAsCompleted = useMarkAsCompleted();
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    projectId: bigint;
    newStatus: string;
  } | null>(null);
  const [statusComment, setStatusComment] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'kundeservice'>('projects');

  useEffect(() => {
    if (!isAdminLoading && isAdmin === false) {
      const retryTimer = setTimeout(() => {
        refetchAdminStatus();
      }, 1000);
      return () => clearTimeout(retryTimer);
    }
  }, [isAdmin, isAdminLoading, refetchAdminStatus]);

  if (isAdminLoading) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Laster admin-dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-24">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Uautorisert: Kun administratorer har tilgang</AlertTitle>
            <AlertDescription className="mt-2">
              Du har ikke tillatelse til å få tilgang til admin-dashbordet. Dette området er kun tilgjengelig for autoriserte administratorer.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Gå til forsiden
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-24">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Feil ved lasting av data</AlertTitle>
            <AlertDescription className="mt-2">
              Det oppstod en feil ved lasting av prosjektinnsendinger. Vennligst prøv igjen senere.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (projectId: bigint, newStatus: string) => {
    setStatusChangeDialog({ projectId, newStatus });
    setStatusComment('');
  };

  const confirmStatusChange = async () => {
    if (!statusChangeDialog) return;

    const { projectId, newStatus } = statusChangeDialog;
    const comment = statusComment.trim() || null;

    try {
      if (newStatus === 'reviewed') {
        await markAsReviewed.mutateAsync({ projectId, comment });
        toast.success('Status oppdatert til gjennomgått', {
          description: 'E-postvarsler behandles i bakgrunnen.',
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 4000,
        });
      } else if (newStatus === 'followup') {
        await markAsFollowup.mutateAsync({ projectId, comment });
        toast.success('Status oppdatert til trenger oppfølging', {
          description: 'E-postvarsler behandles i bakgrunnen.',
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 4000,
        });
      } else if (newStatus === 'inProgress') {
        await markAsInProgress.mutateAsync({ projectId, comment });
        toast.success('Status oppdatert til under arbeid', {
          description: 'E-postvarsler behandles i bakgrunnen.',
          icon: <PlayCircle className="h-4 w-4" />,
          duration: 4000,
        });
      } else if (newStatus === 'completed') {
        await markAsCompleted.mutateAsync({ projectId, comment });
        toast.success('Status oppdatert til fullført', {
          description: 'E-postvarsler behandles i bakgrunnen.',
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 4000,
        });
      }

      setStatusChangeDialog(null);
      setStatusComment('');
    } catch (error) {
      toast.error('Kunne ikke oppdatere innsending');
      console.error(error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const newSubmissions = submissions?.filter((s) => normalizeStatus(s.status) === 'new') || [];
  const reviewedSubmissions = submissions?.filter((s) => normalizeStatus(s.status) === 'reviewed') || [];
  const followupSubmissions = submissions?.filter((s) => normalizeStatus(s.status) === 'followup') || [];
  const inProgressSubmissions = submissions?.filter((s) => normalizeStatus(s.status) === 'inProgress') || [];
  const completedSubmissions = submissions?.filter((s) => normalizeStatus(s.status) === 'completed') || [];

  return (
    <div className="container py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Administrer kundeprosjektinnsendinger og kundeservice</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Totalt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nye</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{newSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Oppfølging</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{followupSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Under arbeid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{inProgressSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fullført</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{completedSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gjennomgått</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{reviewedSubmissions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'projects' | 'kundeservice')} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="projects">
              <FileText className="mr-2 h-4 w-4" />
              Prosjekter
            </TabsTrigger>
            <TabsTrigger value="kundeservice">
              <Headphones className="mr-2 h-4 w-4" />
              Kundeservice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Prosjektinnsendinger</CardTitle>
                <CardDescription>Se og administrer alle kundeprosjektinnsendinger</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">Laster innsendinger...</p>
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kunde</TableHead>
                          <TableHead>Selskap</TableHead>
                          <TableHead>E-post</TableHead>
                          <TableHead>Innsendt</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Handlinger</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id.toString()}>
                            <TableCell className="font-medium">{submission.clientName}</TableCell>
                            <TableCell>{submission.companyName || '-'}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(submission.timestamp)}
                            </TableCell>
                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  Se
                                </Button>
                                <Select
                                  onValueChange={(value) => handleStatusChange(submission.id, value)}
                                >
                                  <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Endre status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="reviewed">Gjennomgått</SelectItem>
                                    <SelectItem value="followup">Trenger oppfølging</SelectItem>
                                    <SelectItem value="inProgress">Under arbeid</SelectItem>
                                    <SelectItem value="completed">Fullført</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Ingen innsendinger ennå</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kundeservice">
            <KundeserviceSection submissions={submissions || []} />
          </TabsContent>
        </Tabs>
      </div>

      {selectedSubmission && (
        <ProjectDetailsDialog
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {statusChangeDialog && (
        <Dialog open={!!statusChangeDialog} onOpenChange={() => setStatusChangeDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Endre prosjektstatus</DialogTitle>
              <DialogDescription>
                Endre status til: <strong>{getStatusLabel(statusChangeDialog.newStatus)}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="statusComment">Kommentar (valgfritt)</Label>
                <Textarea
                  id="statusComment"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Legg til en kommentar som vil bli sendt til klienten..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Klienten vil motta en e-post med statusoppdateringen og din kommentar. E-postvarsler behandles i bakgrunnen.
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStatusChangeDialog(null)}>
                  Avbryt
                </Button>
                <Button
                  onClick={confirmStatusChange}
                  disabled={
                    markAsReviewed.isPending ||
                    markAsFollowup.isPending ||
                    markAsInProgress.isPending ||
                    markAsCompleted.isPending
                  }
                >
                  {(markAsReviewed.isPending ||
                    markAsFollowup.isPending ||
                    markAsInProgress.isPending ||
                    markAsCompleted.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Bekreft
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function KundeserviceSection({ submissions }: { submissions: ProjectSubmission[] }) {
  const { data: allMessages = [] } = useGetAllMessages();
  const sendMessage = useSendMessage();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [filterProjectId, setFilterProjectId] = useState<string>('all');

  const handleSendMessage = async () => {
    if (!selectedProjectId) {
      toast.error('Vennligst velg et prosjekt');
      return;
    }

    if (!messageText.trim()) {
      toast.error('Vennligst skriv en melding');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        projectId: BigInt(selectedProjectId),
        sender: 'Admin',
        text: messageText.trim(),
      });

      toast.success('Melding sendt!', {
        description: 'E-postvarsler behandles i bakgrunnen.',
        icon: <MessageSquare className="h-4 w-4" />,
        duration: 4000,
      });

      setMessageText('');
      setSelectedProjectId('');
    } catch (error) {
      toast.error('Kunne ikke sende melding');
      console.error(error);
    }
  };

  const projectMap = new Map(submissions.map(p => [p.id.toString(), p]));
  
  const filteredMessages = filterProjectId === 'all' 
    ? allMessages 
    : allMessages.filter(([projectId]) => projectId.toString() === filterProjectId);

  const allMessagesFlat = filteredMessages.flatMap(([projectId, messages]) => 
    messages.map(msg => ({ projectId, ...msg }))
  ).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Headphones className="h-6 w-6 text-primary" />
          <CardTitle>Kundeservice</CardTitle>
        </div>
        <CardDescription>
          Se alle meldinger på tvers av prosjekter og svar på kundehenvendelser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-project-select">Velg prosjekt *</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger id="admin-project-select">
                <SelectValue placeholder="Velg et prosjekt for å sende melding" />
              </SelectTrigger>
              <SelectContent>
                {submissions.map((project) => (
                  <SelectItem key={project.id.toString()} value={project.id.toString()}>
                    {project.clientName} - {project.projectDescription.slice(0, 40)}... ({getStatusLabel(project.status)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-message-text">Ny melding</Label>
            <Textarea
              id="admin-message-text"
              placeholder="Skriv din melding til klient..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={sendMessage.isPending || !messageText.trim() || !selectedProjectId}
            className="w-full"
          >
            {sendMessage.isPending ? (
              'Sender...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send melding
              </>
            )}
          </Button>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <Label className="text-base font-semibold">Alle meldinger ({allMessagesFlat.length})</Label>
            </div>
            <Select value={filterProjectId} onValueChange={setFilterProjectId}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filtrer per prosjekt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle prosjekter</SelectItem>
                {submissions.map((project) => (
                  <SelectItem key={project.id.toString()} value={project.id.toString()}>
                    {project.clientName} - {project.projectDescription.slice(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {allMessagesFlat.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {allMessagesFlat.map((message, index) => {
                  const project = projectMap.get(message.projectId.toString());
                  const isAdmin = message.sender === 'Admin';
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span className="font-medium">
                          {project ? `${project.clientName} - ${project.projectDescription.slice(0, 40)}...` : 'Ukjent prosjekt'}
                        </span>
                        {project && getStatusBadge(project.status)}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          isAdmin
                            ? 'bg-primary/10 ml-8'
                            : 'bg-muted/50 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {message.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Number(message.timestamp) / 1000000).toLocaleString('nb-NO', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filterProjectId === 'all' ? 'Ingen meldinger ennå' : 'Ingen meldinger for dette prosjektet'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDetailsDialog({
  submission,
  onClose,
}: {
  submission: ProjectSubmission;
  onClose: () => void;
}) {
  const sendMessage = useSendMessage();
  const addDeliveryLink = useAddDeliveryLink();
  const [messageText, setMessageText] = useState('');
  const [deliveryLinkUrl, setDeliveryLinkUrl] = useState('');
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Vennligst skriv en melding');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        projectId: submission.id,
        sender: 'Admin',
        text: messageText.trim(),
      });

      toast.success('Melding sendt!', {
        description: 'E-postvarsler behandles i bakgrunnen.',
        icon: <MessageSquare className="h-4 w-4" />,
        duration: 4000,
      });

      setMessageText('');
    } catch (error) {
      toast.error('Kunne ikke sende melding');
      console.error(error);
    }
  };

  const handleAddDeliveryLink = async () => {
    if (!deliveryLinkUrl.trim() || !deliveryDescription.trim()) {
      toast.error('Vennligst fyll ut både lenke og beskrivelse');
      return;
    }

    try {
      await addDeliveryLink.mutateAsync({
        projectId: submission.id,
        link: deliveryLinkUrl.trim(),
        description: deliveryDescription.trim(),
      });

      toast.success('Leveringslenke lagt til!', {
        description: 'E-postvarsler behandles i bakgrunnen.',
        icon: <Link className="h-4 w-4" />,
        duration: 4000,
      });

      setDeliveryLinkUrl('');
      setDeliveryDescription('');
      setShowDeliveryForm(false);
    } catch (error) {
      toast.error('Kunne ikke legge til leveringslenke');
      console.error(error);
    }
  };

  const sortedMessages = [...submission.messages].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
  const isCompleted = normalizeStatus(submission.status) === 'completed';

  return (
    <Dialog open={!!submission} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Prosjektinnsendingsdetaljer</DialogTitle>
          <DialogDescription>
            Innsendt {new Date(Number(submission.timestamp) / 1000000).toLocaleDateString('nb-NO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Kundenavn
                </div>
                <p className="font-medium">{submission.clientName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Selskap
                </div>
                <p className="font-medium">{submission.companyName || 'Ikke oppgitt'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                E-post
              </div>
              <p className="font-medium">{submission.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Prosjektbeskrivelse
              </div>
              <p className="text-sm whitespace-pre-wrap">{submission.projectDescription}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Tidslinje
                </div>
                <p className="font-medium">{submission.timeline || 'Ikke spesifisert'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Budsjett
                </div>
                <p className="font-medium">{getBudgetRangeText(submission.budget)}</p>
              </div>
            </div>

            {submission.statusComment && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Admin-kommentar</div>
                <p className="text-sm whitespace-pre-wrap">{submission.statusComment}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div>{getStatusBadge(submission.status)}</div>
            </div>

            {isCompleted && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5 text-muted-foreground" />
                      <Label className="text-base font-semibold">Leveringslenke</Label>
                    </div>
                    {!submission.deliveryLink && !showDeliveryForm && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDeliveryForm(true)}
                      >
                        <Link className="mr-2 h-4 w-4" />
                        Legg til leveringslenke
                      </Button>
                    )}
                  </div>

                  {submission.deliveryLink ? (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <Label className="text-green-900 dark:text-green-100 font-semibold">Leveringslenke lagt til</Label>
                      </div>
                      {submission.deliveryDescription && (
                        <p className="text-sm text-green-800 dark:text-green-200 mb-3">{submission.deliveryDescription}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          value={submission.deliveryLink}
                          readOnly
                          className="flex-1 bg-white dark:bg-green-950/30"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400"
                          onClick={() => window.open(submission.deliveryLink, '_blank', 'noopener,noreferrer')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : showDeliveryForm ? (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="deliveryLink">Leveringslenke *</Label>
                        <Input
                          id="deliveryLink"
                          type="url"
                          placeholder="https://..."
                          value={deliveryLinkUrl}
                          onChange={(e) => setDeliveryLinkUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryDescription">Beskrivelse *</Label>
                        <Textarea
                          id="deliveryDescription"
                          placeholder="Beskriv hva som leveres..."
                          value={deliveryDescription}
                          onChange={(e) => setDeliveryDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddDeliveryLink}
                          disabled={addDeliveryLink.isPending}
                          className="flex-1"
                        >
                          {addDeliveryLink.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Legger til...
                            </>
                          ) : (
                            <>
                              <Link className="mr-2 h-4 w-4" />
                              Legg til leveringslenke
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDeliveryForm(false);
                            setDeliveryLinkUrl('');
                            setDeliveryDescription('');
                          }}
                        >
                          Avbryt
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Ingen leveringslenke lagt til ennå</p>
                  )}
                </div>
              </>
            )}

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-semibold">Meldinger ({sortedMessages.length})</Label>
              </div>
              
              {sortedMessages.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {sortedMessages.map((message, index) => {
                    const isAdmin = message.sender === 'Admin';
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          isAdmin
                            ? 'bg-primary/10 ml-8'
                            : 'bg-muted/50 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {message.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Number(message.timestamp) / 1000000).toLocaleString('nb-NO', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Ingen meldinger ennå</p>
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="Skriv en melding til klient..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessage.isPending || !messageText.trim()}
                  className="w-full"
                >
                  {sendMessage.isPending ? (
                    'Sender...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send melding
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
