import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const createProfile = useCreateUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Vennligst fyll ut alle obligatoriske felt');
      return;
    }

    try {
      await createProfile.mutateAsync({ name, email, company });
      toast.success('Profil opprettet! Du kan nå sende inn prosjekter.');
    } catch (error: any) {
      if (error.message?.includes('eksisterer allerede')) {
        toast.error('Profil eksisterer allerede');
      } else {
        toast.error('Kunne ikke opprette profil');
      }
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-md max-w-[calc(100vw-2rem)] mx-4" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Velkommen! Sett opp profilen din</DialogTitle>
          <DialogDescription className="text-sm">
            Vennligst oppgi informasjonen din for å fortsette. Dette trenger du bare å gjøre én gang.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Navn *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt navn"
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm">Selskap</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ditt selskap (valgfritt)"
              className="text-base"
            />
          </div>
          <Button type="submit" className="w-full touch-manipulation" size="lg" disabled={createProfile.isPending}>
            {createProfile.isPending ? 'Oppretter...' : 'Opprett profil'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
