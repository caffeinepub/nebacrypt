import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitAuthenticatedProject, useGetUserProjects, useGetCallerUserProfile, useUpdateUserProfile, useSendMessage, useGetAllUserMessages } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckCircle2, Send, LogIn, FileText, Plus, Clock, Eye, AlertCircle, PlayCircle, Mail, Edit, MessageSquare, ExternalLink, Headphones, User } from 'lucide-react';
import { ProjectBudgetRange, ExternalBlob, ProjectStatus } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import PublicSubmissionForm from '../components/PublicSubmissionForm';

function normalizeStatus(status: ProjectStatus | string): string {
  if (typeof status === 'object' && status !== null) {
    return String(status);
  }
  return String(status);
}

function getStatusText(status: ProjectStatus): string {
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
      console.warn('Unknown status value:', status, 'Normalized:', normalized, 'Type:', typeof status);
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
      console.warn('Unknown status for badge:', status, 'Normalized:', normalized, 'Type:', typeof status);
      return (
        <Badge variant="outline" className="gap-1 border-gray-500 text-gray-500">
          <AlertCircle className="h-3 w-3" />
          Ukjent status
        </Badge>
      );
  }
}

export default function ClientPortal() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (!isAuthenticated) {
    return <PublicSubmissionForm onLogin={handleAuth} loginStatus={loginStatus} />;
  }

  return <AuthenticatedPortal onLogout={handleAuth} />;
}

function AuthenticatedPortal({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new' | 'kundeservice' | 'profile'>('dashboard');
  const { data: userProjects = [], isLoading } = useGetUserProjects();
  const [selectedProject, setSelectedProject] = useState<typeof userProjects[0] | null>(null);

  // Scroll to top when changing tabs for better mobile UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="container py-20 pb-32 md:pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Min kundeportal</h1>
            <p className="text-base md:text-lg text-muted-foreground mt-1 md:mt-2">
              Administrer dine prosjekter og send inn nye forespørsler
            </p>
          </div>
          <Button onClick={onLogout} variant="outline" className="w-full sm:w-auto">
            <LogIn className="mr-2 h-4 w-4" />
            Logg ut
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'dashboard' | 'new' | 'kundeservice' | 'profile')} className="space-y-6">
          {/* Desktop/Tablet Navigation */}
          <TabsList className="hidden md:grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="dashboard">
              <FileText className="mr-2 h-4 w-4" />
              Mine prosjekter
            </TabsTrigger>
            <TabsTrigger value="new">
              <Plus className="mr-2 h-4 w-4" />
              Nytt prosjekt
            </TabsTrigger>
            <TabsTrigger value="kundeservice">
              <Headphones className="mr-2 h-4 w-4" />
              Kundeservice
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Laster prosjekter...</p>
                </CardContent>
              </Card>
            ) : userProjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Ingen prosjekter ennå</h3>
                    <p className="text-muted-foreground">
                      Send inn ditt første prosjekt for å komme i gang
                    </p>
                  </div>
                  <Button onClick={() => setActiveTab('new')} className="min-h-[44px]">
                    <Plus className="mr-2 h-4 w-4" />
                    Send inn prosjekt
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userProjects.map((project) => (
                  <Card key={project.id.toString()} className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl break-words">{project.projectDescription.slice(0, 60)}...</CardTitle>
                          <CardDescription className="text-sm">
                            Sendt inn {new Date(Number(project.timestamp) / 1000000).toLocaleDateString('nb-NO')}
                          </CardDescription>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(project.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Klient:</span>
                          <p className="font-medium break-words">{project.clientName}</p>
                        </div>
                        {project.companyName && (
                          <div>
                            <span className="text-muted-foreground">Selskap:</span>
                            <p className="font-medium break-words">{project.companyName}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Tidslinje:</span>
                          <p className="font-medium">{project.timeline || 'Ikke spesifisert'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Meldinger:</span>
                          <p className="font-medium">{project.messages.length} melding(er)</p>
                        </div>
                      </div>
                      {project.statusComment && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Admin-kommentar:</p>
                          <p className="text-sm whitespace-pre-wrap break-words">{project.statusComment}</p>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full min-h-[44px]"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Se detaljer og meldinger
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <NewProjectForm onSuccess={() => setActiveTab('dashboard')} />
          </TabsContent>

          <TabsContent value="kundeservice">
            <KundeserviceSection />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileEditForm />
          </TabsContent>
        </Tabs>

        {selectedProject && (
          <ProjectDetailsDialog 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar - Enhanced for better accessibility */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg"
        role="navigation"
        aria-label="Hovednavigasjon"
      >
        <div className="grid grid-cols-4 h-20 px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors rounded-lg mx-1 ${
              activeTab === 'dashboard'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            style={{ minHeight: '64px', minWidth: '64px' }}
            aria-label="Mine prosjekter"
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          >
            <FileText className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs font-medium">Prosjekter</span>
          </button>
          <button
            onClick={() => setActiveTab('kundeservice')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors rounded-lg mx-1 ${
              activeTab === 'kundeservice'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            style={{ minHeight: '64px', minWidth: '64px' }}
            aria-label="Kundeservice"
            aria-current={activeTab === 'kundeservice' ? 'page' : undefined}
          >
            <Headphones className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs font-medium">Service</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors rounded-lg mx-1 ${
              activeTab === 'new'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            style={{ minHeight: '64px', minWidth: '64px' }}
            aria-label="Nytt prosjekt"
            aria-current={activeTab === 'new' ? 'page' : undefined}
          >
            <div className={`rounded-full p-2 transition-colors ${activeTab === 'new' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <Plus className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium">Nytt</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors rounded-lg mx-1 ${
              activeTab === 'profile'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            style={{ minHeight: '64px', minWidth: '64px' }}
            aria-label="Profil"
            aria-current={activeTab === 'profile' ? 'page' : undefined}
          >
            <User className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function KundeserviceSection() {
  const { data: userProjects = [] } = useGetUserProjects();
  const { data: allMessages = [] } = useGetAllUserMessages();
  const { data: userProfile } = useGetCallerUserProfile();
  const sendMessage = useSendMessage();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [messageText, setMessageText] = useState('');

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
        sender: userProfile?.name || 'Klient',
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

  const projectMap = new Map(userProjects.map(p => [p.id.toString(), p]));
  const allMessagesFlat = allMessages.flatMap(([projectId, messages]) => 
    messages.map(msg => ({ projectId, ...msg }))
  ).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <CardTitle className="text-xl md:text-2xl">Kundeservice</CardTitle>
        </div>
        <CardDescription className="text-sm md:text-base">
          Se alle meldinger på tvers av prosjekter og send nye meldinger til admin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-select" className="text-base">Velg prosjekt *</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger id="project-select" className="min-h-[44px]">
                <SelectValue placeholder="Velg et prosjekt for å sende melding" />
              </SelectTrigger>
              <SelectContent>
                {userProjects.map((project) => (
                  <SelectItem key={project.id.toString()} value={project.id.toString()} className="min-h-[44px]">
                    {project.projectDescription.slice(0, 50)}... ({getStatusText(project.status)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-text" className="text-base">Ny melding</Label>
            <Textarea
              id="message-text"
              placeholder="Skriv din melding til admin..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="text-base resize-none"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={sendMessage.isPending || !messageText.trim() || !selectedProjectId}
            className="w-full min-h-[48px] text-base"
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
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-semibold">Alle meldinger ({allMessagesFlat.length})</Label>
          </div>

          {allMessagesFlat.length > 0 ? (
            <ScrollArea className="h-[400px] md:h-[500px] pr-2 md:pr-4">
              <div className="space-y-4">
                {allMessagesFlat.map((message, index) => {
                  const project = projectMap.get(message.projectId.toString());
                  const isClient = message.sender !== 'Admin';
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        <span className="font-medium break-words">
                          {project ? project.projectDescription.slice(0, 40) + '...' : 'Ukjent prosjekt'}
                        </span>
                        {project && getStatusBadge(project.status)}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          isClient
                            ? 'bg-primary/10 ml-4 md:ml-8'
                            : 'bg-muted/50 mr-4 md:mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {message.sender}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(Number(message.timestamp) / 1000000).toLocaleString('nb-NO', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Ingen meldinger ennå</p>
              <p className="text-sm text-muted-foreground mt-2">
                Send din første melding til admin ved å velge et prosjekt ovenfor
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NewProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    projectDescription: '',
    timeline: '',
    budget: '' as ProjectBudgetRange | '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const submitProject = useSubmitAuthenticatedProject();

  useEffect(() => {
    if (userProfile && !profileLoading) {
      setFormData((prev) => ({
        ...prev,
        clientName: userProfile.name || prev.clientName,
        companyName: userProfile.company || prev.companyName,
        email: userProfile.email || prev.email,
      }));
    }
  }, [userProfile, profileLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.email || !formData.projectDescription) {
      toast.error('Vennligst fyll ut alle obligatoriske felt');
      return;
    }

    if (!formData.budget) {
      toast.error('Vennligst velg et budsjettområde');
      return;
    }

    try {
      const externalBlobs: ExternalBlob[] = [];
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
        });
        externalBlobs.push(blob);
      }

      await submitProject.mutateAsync({
        ...formData,
        budget: formData.budget as ProjectBudgetRange,
        files: externalBlobs,
      });

      toast.success('Prosjekt sendt inn!', {
        description: 'Vi kontakter deg snart. E-postvarsler behandles i bakgrunnen.',
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 5000,
      });

      setFormData({
        clientName: userProfile?.name || '',
        companyName: userProfile?.company || '',
        email: userProfile?.email || '',
        projectDescription: '',
        timeline: '',
        budget: '',
      });
      setFiles([]);
      setUploadProgress({});
      onSuccess();
    } catch (error) {
      toast.error('Kunne ikke sende inn prosjekt. Vennligst prøv igjen.');
      console.error(error);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Send inn nytt prosjekt</CardTitle>
        <CardDescription className="text-sm md:text-base">Fyll ut skjemaet nedenfor og last opp eventuelle relevante filer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-base">Ditt navn *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Ola Nordmann"
                required
                disabled={profileLoading}
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-base">Selskapsnavn</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Ditt selskap"
                disabled={profileLoading}
                className="min-h-[44px] text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">E-postadresse *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ola@eksempel.no"
              required
              disabled={profileLoading}
              className="min-h-[44px] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription" className="text-base">Prosjektbeskrivelse *</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Beskriv ditt prosjekt, mål og krav..."
              rows={6}
              required
              className="text-base resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-base">Tidslinje</Label>
              <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                <SelectTrigger id="timeline" className="min-h-[44px]">
                  <SelectValue placeholder="Velg tidslinje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent" className="min-h-[44px]">Haster (1-2 uker)</SelectItem>
                  <SelectItem value="short" className="min-h-[44px]">Kort sikt (1-2 måneder)</SelectItem>
                  <SelectItem value="medium" className="min-h-[44px]">Mellomlang sikt (3-6 måneder)</SelectItem>
                  <SelectItem value="long" className="min-h-[44px]">Lang sikt (6+ måneder)</SelectItem>
                  <SelectItem value="flexible" className="min-h-[44px]">Fleksibel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-base">Budsjettramme *</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value as ProjectBudgetRange })}>
                <SelectTrigger id="budget" className="min-h-[44px]">
                  <SelectValue placeholder="Velg budsjettramme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProjectBudgetRange.range1_10kNOK} className="min-h-[44px]">1 000 – 10 000 NOK</SelectItem>
                  <SelectItem value={ProjectBudgetRange.range10_50kNOK} className="min-h-[44px]">10 000 – 50 000 NOK</SelectItem>
                  <SelectItem value={ProjectBudgetRange.range50_100kNOK} className="min-h-[44px]">50 000 – 100 000 NOK</SelectItem>
                  <SelectItem value={ProjectBudgetRange.range100kPlusNOK} className="min-h-[44px]">100 000 NOK +</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files" className="text-base">Last opp filer (valgfritt)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer min-h-[44px]"
              />
            </div>
            {files.length > 0 && (
              <div className="space-y-2 mt-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    {uploadProgress[file.name] !== undefined && (
                      <span className="text-xs text-muted-foreground mr-2 whitespace-nowrap">
                        {uploadProgress[file.name]}%
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="min-h-[36px] flex-shrink-0"
                    >
                      Fjern
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full min-h-[48px] text-base" size="lg" disabled={submitProject.isPending || profileLoading}>
            {submitProject.isPending ? (
              'Sender inn...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send inn prosjekt
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProfileEditForm() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const updateProfile = useUpdateUserProfile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });

  useEffect(() => {
    if (userProfile && !profileLoading) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        company: userProfile.company || '',
      });
    }
  }, [userProfile, profileLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Vennligst fyll ut alle obligatoriske felt');
      return;
    }

    try {
      await updateProfile.mutateAsync(formData);
      toast.success('Profil oppdatert!');
    } catch (error: any) {
      if (error.message?.includes('finnes ikke')) {
        toast.error('Profil finnes ikke. Vennligst logg inn på nytt.');
      } else {
        toast.error('Kunne ikke oppdatere profil');
      }
      console.error(error);
    }
  };

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Laster profil...</p>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Ingen profil funnet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Rediger profil</CardTitle>
        <CardDescription className="text-sm md:text-base">Oppdater din profilinformasjon</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-base">Navn *</Label>
            <Input
              id="profile-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ditt navn"
              required
              className="min-h-[44px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email" className="text-base">E-post *</Label>
            <Input
              id="profile-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="din@epost.no"
              required
              className="min-h-[44px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-company" className="text-base">Selskap</Label>
            <Input
              id="profile-company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Ditt selskap (valgfritt)"
              className="min-h-[44px] text-base"
            />
          </div>
          <Button type="submit" className="w-full min-h-[48px] text-base" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Oppdaterer...' : 'Oppdater profil'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProjectDetailsDialog({ 
  project, 
  onClose 
}: { 
  project: any; 
  onClose: () => void;
}) {
  const { data: userProfile } = useGetCallerUserProfile();
  const sendMessage = useSendMessage();
  const [messageText, setMessageText] = useState('');

  const getBudgetText = (budget: ProjectBudgetRange) => {
    switch (budget) {
      case ProjectBudgetRange.range1_10kNOK:
        return '1 000 – 10 000 NOK';
      case ProjectBudgetRange.range10_50kNOK:
        return '10 000 – 50 000 NOK';
      case ProjectBudgetRange.range50_100kNOK:
        return '50 000 – 100 000 NOK';
      case ProjectBudgetRange.range100kPlusNOK:
        return '100 000 NOK +';
      default:
        return 'Ikke spesifisert';
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Vennligst skriv en melding');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        projectId: project.id,
        sender: userProfile?.name || 'Klient',
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

  const sortedMessages = [...project.messages].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Prosjektdetaljer</DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Sendt inn {new Date(Number(project.timestamp) / 1000000).toLocaleDateString('nb-NO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-2 md:pr-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {getStatusBadge(project.status)}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Klientnavn</Label>
                <p className="font-medium break-words">{project.clientName}</p>
              </div>
              {project.companyName && (
                <div>
                  <Label className="text-muted-foreground text-sm">Selskapsnavn</Label>
                  <p className="font-medium break-words">{project.companyName}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground text-sm">E-post</Label>
                <p className="font-medium break-words">{project.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Budsjett</Label>
                <p className="font-medium">{getBudgetText(project.budget)}</p>
              </div>
              {project.timeline && (
                <div>
                  <Label className="text-muted-foreground text-sm">Tidslinje</Label>
                  <p className="font-medium">{project.timeline}</p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-sm">Prosjektbeskrivelse</Label>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm md:text-base">{project.projectDescription}</p>
            </div>

            {project.statusComment && (
              <div className="p-3 md:p-4 bg-muted/50 rounded-lg">
                <Label className="text-muted-foreground text-sm">Admin-kommentar</Label>
                <p className="mt-2 text-sm whitespace-pre-wrap break-words">{project.statusComment}</p>
              </div>
            )}

            {project.files.length > 0 && (
              <div>
                <Label className="text-muted-foreground text-sm">Vedlagte filer ({project.files.length})</Label>
                <div className="mt-2 space-y-2">
                  {project.files.map((file: ExternalBlob, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">Fil {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const url = file.getDirectURL();
                          window.open(url, '_blank');
                        }}
                        className="min-h-[36px] flex-shrink-0"
                      >
                        Last ned
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.deliveryLink && (
              <div className="p-3 md:p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <Label className="text-green-900 dark:text-green-100 font-semibold text-sm md:text-base">Leveringslenke</Label>
                </div>
                {project.deliveryDescription && (
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3 break-words">{project.deliveryDescription}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/30 min-h-[44px] w-full sm:w-auto"
                  onClick={() => window.open(project.deliveryLink, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Åpne leveringslenke
                </Button>
              </div>
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
                    const isClient = message.sender !== 'Admin';
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          isClient
                            ? 'bg-primary/10 ml-4 md:ml-8'
                            : 'bg-muted/50 mr-4 md:mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {message.sender}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(Number(message.timestamp) / 1000000).toLocaleString('nb-NO', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Ingen meldinger ennå</p>
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="Skriv en melding til admin..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                  className="text-base resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessage.isPending || !messageText.trim()}
                  className="w-full min-h-[48px] text-base"
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
