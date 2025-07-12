import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [memberLimit, setMemberLimit] = useState('20');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const subjects = ['Math', 'Science', 'History', 'English', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to create a study group.",
      });
      return;
    }

    if (!name.trim() || !subject) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill in the group name and subject.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the study group
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          subject,
          created_by: user.id,
          member_limit: parseInt(memberLimit)
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Automatically add the creator as a member with admin role
      const { error: membershipError } = await supabase
        .from('group_memberships')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (membershipError) throw membershipError;

      toast({
        title: "Study group created!",
        description: "Your study group has been created successfully.",
      });

      navigate(`/groups/${groupData.id}`);
    } catch (error: any) {
      console.error('Error creating study group:', error);
      toast({
        variant: "destructive",
        title: "Error creating study group",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/study-groups')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Study Groups
                  </Button>
                </div>
                <CardTitle className="text-2xl">Create Study Group</CardTitle>
                <p className="text-muted-foreground">
                  Create a study group to collaborate with other students on specific subjects.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Group Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Advanced Calculus Study Group"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subj => (
                          <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this study group is about, topics to cover, meeting schedule, etc."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberLimit">Member Limit</Label>
                    <Select value={memberLimit} onValueChange={setMemberLimit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="15">15 members</SelectItem>
                        <SelectItem value="20">20 members</SelectItem>
                        <SelectItem value="30">30 members</SelectItem>
                        <SelectItem value="50">50 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/study-groups')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Creating..." : "Create Group"}
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

export default CreateGroup;