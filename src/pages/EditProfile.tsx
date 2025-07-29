import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  grade_level: string;
  school_type: string;
  subjects: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const EditProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    grade_level: '',
    school_type: '',
    subjects: '',
    bio: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const gradeLevels = ['elementary', 'middle', 'high', 'college', 'graduate'];
  const schoolTypes = ['public', 'private', 'homeschool', 'online'];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // First, try to get existing profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          grade_level: profileData.grade_level || '',
          school_type: profileData.school_type || '',
          subjects: profileData.subjects || '',
          bio: profileData.bio || ''
        });
      } else {
        // If no profile exists, create one with basic info
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user?.id,
            first_name: user?.user_metadata?.first_name || '',
            last_name: user?.user_metadata?.last_name || '',
            grade_level: user?.user_metadata?.grade_level || 'high',
            school_type: user?.user_metadata?.school_type || 'public',
            subjects: user?.user_metadata?.subjects || '',
            bio: user?.user_metadata?.bio || ''
          })
          .select()
          .single();

        if (createError) throw createError;

        setProfile(newProfile);
        setFormData({
          first_name: newProfile.first_name || '',
          last_name: newProfile.last_name || '',
          grade_level: newProfile.grade_level || '',
          school_type: newProfile.school_type || '',
          subjects: newProfile.subjects || '',
          bio: newProfile.bio || ''
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to edit your profile.",
      });
      return;
    }

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill in your first name and last name.",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          grade_level: formData.grade_level,
          school_type: formData.school_type,
          subjects: formData.subjects.trim() || null,
          bio: formData.bio.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Loading profile...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 pt-24">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Profile Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-hero p-2 rounded-lg">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Edit Profile</CardTitle>
                    <p className="text-muted-foreground">Update your personal information</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Education Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade_level">Grade Level *</Label>
                      <Select 
                        value={formData.grade_level} 
                        onValueChange={(value) => handleInputChange('grade_level', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school_type">School Type *</Label>
                      <Select 
                        value={formData.school_type} 
                        onValueChange={(value) => handleInputChange('school_type', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Favorite Subjects</Label>
                    <Input
                      id="subjects"
                      value={formData.subjects}
                      onChange={(e) => handleInputChange('subjects', e.target.value)}
                      placeholder="e.g., Math, Science, History, English"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your favorite subjects separated by commas
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself, your interests, and what you're studying..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Share a bit about yourself with the community
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={saving} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile; 