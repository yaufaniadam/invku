import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const ProfileCard = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [username, setUsername] = useState('johndoe');
  const [bio, setBio] = useState('');
  const maxBioLength = 240;

  return (
    <Card className="border-0 shadow-card col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
        <CardDescription>Update your personal details and public profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Upload Section */}
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
            <AvatarFallback className="text-lg">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Change Photo
              </Button>
              <button className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                Remove
              </button>
            </div>
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
          </div>
        </div>

        {/* Name Fields - Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-input focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border-input focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Username with Addon */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-foreground">
            Username
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-muted-foreground text-sm">@</span>
            </div>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-8 border-input focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="username"
            />
          </div>
          <p className="text-xs text-muted-foreground">Public facing username. This will be visible to other users.</p>
        </div>

        {/* Bio Textarea with Character Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio
            </Label>
            <span className={cn(
              "text-xs",
              bio.length > maxBioLength ? "text-destructive" : "text-muted-foreground"
            )}>
              {bio.length}/{maxBioLength} characters
            </span>
          </div>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className={cn(
              "flex w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary resize-none",
              bio.length > maxBioLength 
                ? "border-destructive focus:ring-destructive" 
                : "border-input focus:ring-primary"
            )}
            placeholder="Write a brief description about yourself..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="border-input">
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
