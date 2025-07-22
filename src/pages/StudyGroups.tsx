import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  created_by: string;
  member_limit: number;
  is_public: boolean;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
}

const StudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const subjects = ['Math', 'Science', 'History', 'English', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];

  useEffect(() => {
    fetchStudyGroups();
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    filterGroups();
  }, [groups, searchTerm, selectedSubject]);

  const fetchStudyGroups = async () => {
    try {
      setLoading(true);
      
      // Fetch all public study groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // Get member counts and check if current user is a member
      const groupsWithMemberInfo = await Promise.all(
        (groupsData || []).map(async (group) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('group_memberships')
            .select('*', { count: 'exact' })
            .eq('group_id', group.id);

          // Check if current user is a member (only if logged in)
          let isMember = false;
          if (user) {
            const { data: membership } = await supabase
              .from('group_memberships')
              .select('id')
              .eq('group_id', group.id)
              .eq('user_id', user.id)
              .single();
            isMember = !!membership;
          }

          return {
            ...group,
            member_count: memberCount || 0,
            is_member: isMember
          };
        })
      );

      setGroups(groupsWithMemberInfo);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching study groups",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsAdmin(!!data);
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const filterGroups = () => {
    let filtered = groups;

    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(group => group.subject === selectedSubject);
    }

    setFilteredGroups(filtered);
  };


  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Loading study groups...</div>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Study Groups</h1>
              <p className="text-muted-foreground">Join study groups to collaborate with other students</p>
            </div>
            {isAdmin && (
              <Link to="/create-group">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Group
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Groups Grid */}
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No study groups found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedSubject !== 'all' 
                  ? "Try adjusting your search criteria." 
                  : "Be the first to create a study group!"}
              </p>
              {isAdmin && (
                <Link to="/create-group">
                  <Button>Create First Group</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {group.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {group.member_count}/{group.member_limit}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {group.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link to={`/groups/${group.id}`} className="flex-1">
                        <Button className="w-full" variant={group.is_member ? "default" : "outline"}>
                          {group.is_member ? 'View Group' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudyGroups;