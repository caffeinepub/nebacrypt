import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitProject } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckCircle2, Send, LogIn, Shield, Mail } from 'lucide-react';
import { ProjectBudgetRange } from '../backend';

interface PublicSubmissionFormProps {
  onLogin: () => void;
  loginStatus: string;
}

export default function PublicSubmissionForm({ onLogin, loginStatus }: PublicSubmissionFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    projectDescription: '',
    timeline: '',
    budget: '' as ProjectBudgetRange | '',
  });
  const [submitted, setSubmitted] = useState(false);

  const submitProject = useSubmitProject();
  const disabled = loginStatus === 'logging-in';

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
      await submitProject.mutateAsync({
        ...formData,
        budget: formData.budget as ProjectBudgetRange,
      });
      
      toast.success('Prosjekt sendt inn!', {
        description: 'Vi kontakter deg snart. E-postvarsler behandles i bakgrunnen.',
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 5000,
      });

      setSubmitted(true);
      setFormData({
        clientName: '',
        companyName: '',
        email: '',
        projectDescription: '',
        timeline: '',
        budget: '',
      });
    } catch (error) {
      toast.error('Kunne ikke sende inn prosjekt. Vennligst prøv igjen.');
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div className="container py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Takk!</h1>
          <p className="text-lg text-muted-foreground">
            Din prosjektinnsending er mottatt. Vårt team vil gjennomgå den og komme tilbake til deg innen 24-48 timer.
          </p>
          <p className="text-sm text-muted-foreground">
            E-postvarsler sendes i bakgrunnen og vil ankomme snart.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send inn et nytt prosjekt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Kundeportal</h1>
          <p className="text-lg text-muted-foreground">
            Fortell oss om ditt prosjekt, så kommer vi tilbake med en skreddersydd løsning
          </p>
        </div>

        {/* Internet Identity Login Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Sikker innlogging</CardTitle>
            </div>
            <CardDescription>
              Logg inn for å administrere dine prosjekter og laste opp filer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={onLogin}
              disabled={disabled}
              variant="default"
              size="lg"
              className="w-full"
            >
              {loginStatus === 'logging-in' ? (
                'Logger inn...'
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Logg inn med Internet Identity
                </>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2 px-1">
              <p>
                <strong className="text-foreground">Internet Identity 2.0</strong> er en moderne og sikker innloggingsløsning fra Internet Computer.
                Du kan logge inn med <strong className="text-foreground">passkeys</strong> (fingeravtrykk, ansiktsgjenkjenning eller PIN),
                eller bruke din eksisterende konto hos <strong className="text-foreground">Google, Apple eller Microsoft</strong> –
                uten passord og uten at noen tredjepart lagrer din identitet.
              </p>
              <p className="text-xs">
                Ved første gangs innlogging opprettes en kryptografisk identitet som er unik for deg.
                Ingen persondata deles med oss eller andre parter.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Public Submission Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Send inn prosjektforespørsel</CardTitle>
            </div>
            <CardDescription>
              Du kan også sende inn en forespørsel uten å logge inn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Navn *</Label>
                  <Input
                    id="clientName"
                    placeholder="Ditt navn"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firma</Label>
                  <Input
                    id="companyName"
                    placeholder="Firmanavn (valgfritt)"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-post *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@epost.no"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Prosjektbeskrivelse *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Beskriv prosjektet ditt..."
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline">Tidsramme</Label>
                  <Input
                    id="timeline"
                    placeholder="f.eks. 3 måneder"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budsjett *</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value as ProjectBudgetRange })}
                  >
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Velg budsjettområde" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProjectBudgetRange.range1_10kNOK}>1 000 – 10 000 NOK</SelectItem>
                      <SelectItem value={ProjectBudgetRange.range10_50kNOK}>10 000 – 50 000 NOK</SelectItem>
                      <SelectItem value={ProjectBudgetRange.range50_100kNOK}>50 000 – 100 000 NOK</SelectItem>
                      <SelectItem value={ProjectBudgetRange.range100kPlusNOK}>100 000 NOK +</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitProject.isPending}
              >
                {submitProject.isPending ? (
                  'Sender inn...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send inn forespørsel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
