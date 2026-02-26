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
                Internet Identity er en sikker innloggingsmetode fra Internet Computer. 
                Du autentiserer deg med din digitale identitet (kalt "anchor") i stedet for et passord. 
                Dette gir deg full kontroll over din identitet uten å måtte stole på tredjeparter.
              </p>
              <p className="text-xs">
                Ved første gangs innlogging vil du opprette en ny anchor. Denne kan brukes på tvers av alle applikasjoner på Internet Computer.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Prosjektinnsendingsskjema</CardTitle>
            <CardDescription>Vennligst oppgi så mye detaljer som mulig om ditt prosjekt</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Ditt navn *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ola Nordmann"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Selskapsnavn</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Ditt selskap"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-postadresse *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ola@eksempel.no"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Prosjektbeskrivelse *</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Beskriv ditt prosjekt, mål og krav..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timeline">Tidslinje</Label>
                  <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Velg tidslinje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Haster (1-2 uker)</SelectItem>
                      <SelectItem value="short">Kort sikt (1-2 måneder)</SelectItem>
                      <SelectItem value="medium">Mellomlang sikt (3-6 måneder)</SelectItem>
                      <SelectItem value="long">Lang sikt (6+ måneder)</SelectItem>
                      <SelectItem value="flexible">Fleksibel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budsjettramme *</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value as ProjectBudgetRange })}>
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Velg budsjettramme" />
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

              <Button type="submit" className="w-full" size="lg" disabled={submitProject.isPending}>
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
      </div>
    </div>
  );
}
