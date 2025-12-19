'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Mail, Github, Linkedin, Instagram, Link, Code } from 'lucide-react'; // Code for Codeforces
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface AdminProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminProfileDialog({ isOpen, onOpenChange }: AdminProfileDialogProps) {
  // Hardcoded profile details and links
  const profile = {
    name: 'Admin - Sandeep Kumar',
    tagline: 'IIT Dhanbad (CSE\'28)',
    avatar: '/avatar-placeholder.png', // You might want to place a custom image here
    links: [
      { id: 'email', icon: Mail, url: 'mailto:iitianias@gmail.com', label: 'Email' },
      { id: 'github', icon: Github, url: 'https://github.com/sandeep172918', label: 'GitHub' },
      { id: 'linkedin', icon: Linkedin, url: 'https://linkedin.com/in/sandeep172918', label: 'LinkedIn' },
      { id: 'instagram', icon: Instagram, url: 'https://instagram.com/sandeep172918', label: 'Instagram' },
      { id: 'codeforces', icon: Code, url: 'https://codeforces.com/profile/sandeep172918', label: 'Codeforces' },
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center pt-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar} alt={profile.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-4xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl font-bold">{profile.name}</DialogTitle>
          <DialogDescription className="text-md text-muted-foreground">
            {profile.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center gap-6 py-4">
          {profile.links.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center group"
              aria-label={link.label}
            >
              <link.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
