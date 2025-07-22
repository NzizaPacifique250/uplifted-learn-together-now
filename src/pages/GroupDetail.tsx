import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Users, Send, MessageSquare, Clock, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  created_by: string;
  member_limit: number;
  created_at: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface JoinRequest {
  id: string;
  group_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string | null;
  requested_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchGroupData();
    }
  }, [id, user]);

  useEffect(() => {
    if (isMember && id) {
      fetchMessages();
      setupRealtimeSubscription();
    }
    if (isAdmin && id) {
      fetchJoinRequests();
    }
  }, [isMember, isAdmin, id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchGroupData = async () => {
    try {
      setLoading(true);

      // Fetch group details
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', id)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('group_memberships')
        .select('*')
        .eq('group_id', id);

      if (membersError) throw membersError;

      // Fetch profiles for members
      const memberIds = membersData?.map(m => m.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', memberIds);

      // Combine members with profiles
      const membersWithProfiles = membersData?.map(member => ({
        ...member,
        profiles: profilesData?.find(p => p.user_id === member.user_id) || null
      })) || [];

      setMembers(membersWithProfiles);

      // Check if current user is a member and their role
      if (user) {
        const userMembership = membersData?.find(member => member.user_id === user.id);
        setIsMember(!!userMembership);
        setIsAdmin(userMembership?.role === 'admin' || false);
        
        // Check if user has existing join request
        if (!userMembership) {
          const { data: requestData } = await supabase
            .from('join_requests')
            .select('id')
            .eq('group_id', id)
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .single();
          setHasExistingRequest(!!requestData);
        }
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading group",
        description: error.message,
      });
      navigate('/study-groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const { data: messagesData, error } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles for message authors
      const userIds = messagesData?.map(m => m.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      // Combine messages with profiles
      const messagesWithProfiles = messagesData?.map(message => ({
        ...message,
        profiles: profilesData?.find(p => p.user_id === message.user_id) || null
      })) || [];

      setMessages(messagesWithProfiles);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: error.message,
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('group-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${id}`
        },
        (payload) => {
          // Fetch the new message
          supabase
            .from('group_messages')
            .select('*')
            .eq('id', payload.new.id)
            .single()
            .then(async ({ data: messageData }) => {
              if (messageData) {
                // Fetch profile for the message author
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('first_name, last_name')
                  .eq('user_id', messageData.user_id)
                  .single();

                const messageWithProfile = {
                  ...messageData,
                  profiles: profileData || null
                };

                setMessages(prev => [...prev, messageWithProfile]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchJoinRequests = async () => {
    try {
      const { data: requestsData, error } = await supabase
        .from('join_requests')
        .select('*')
        .eq('group_id', id)
        .eq('status', 'pending');

      if (error) throw error;

      // Fetch profiles for request authors
      const userIds = requestsData?.map(r => r.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      // Combine requests with profiles
      const requestsWithProfiles = requestsData?.map(request => ({
        ...request,
        status: request.status as 'pending' | 'approved' | 'rejected',
        profiles: profilesData?.find(p => p.user_id === request.user_id) || null
      })) || [];

      setJoinRequests(requestsWithProfiles);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading join requests",
        description: error.message,
      });
    }
  };

  const requestToJoin = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to request joining a study group.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('join_requests')
        .insert({
          group_id: id,
          user_id: user.id,
          message: requestMessage.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Join request sent!",
        description: "Your join request has been sent to the group admin.",
      });

      setHasExistingRequest(true);
      setRequestMessage('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending join request",
        description: error.message,
      });
    }
  };

  const handleJoinRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      // Update join request status
      const { data: requestData, error: updateError } = await supabase
        .from('join_requests')
        .update({
          status: action,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', requestId)
        .select()
        .single();

      if (updateError) throw updateError;

      // If approved, add user to group
      if (action === 'approved') {
        const { error: membershipError } = await supabase
          .from('group_memberships')
          .insert({
            group_id: id,
            user_id: requestData.user_id
          });

        if (membershipError) throw membershipError;
      }

      toast({
        title: `Request ${action}!`,
        description: `The join request has been ${action}.`,
      });

      // Refresh data
      fetchJoinRequests();
      if (action === 'approved') {
        fetchGroupData();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Error ${action === 'approved' ? 'approving' : 'rejecting'} request`,
        description: error.message,
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: id,
          user_id: user.id,
          content: newMessage.trim()
        });

      if (error) throw error;
      
      setNewMessage('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUserDisplayName = (profiles: any) => {
    if (profiles?.first_name && profiles?.last_name) {
      return `${profiles.first_name} ${profiles.last_name}`;
    }
    return 'Anonymous User';
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Loading group...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Group not found</h2>
            <Button onClick={() => navigate('/study-groups')}>Back to Study Groups</Button>
          </div>
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
              onClick={() => navigate('/study-groups')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Study Groups
            </Button>
          </div>

          {/* Group Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{group.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">{group.subject}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{members.length}/{group.member_limit} members</span>
                    </div>
                  </div>
                </div>
                {!isMember && !hasExistingRequest && (
                  <Button 
                    onClick={() => {
                      // Show request form
                    }}
                    disabled={members.length >= group.member_limit}
                  >
                    {members.length >= group.member_limit ? 'Group Full' : 'Request to Join'}
                  </Button>
                )}
                {hasExistingRequest && (
                  <Button disabled variant="outline" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Request Pending
                  </Button>
                )}
              </div>
            </CardHeader>
            {group.description && (
              <CardContent>
                <p className="text-muted-foreground">{group.description}</p>
              </CardContent>
            )}
          </Card>

          {isMember ? (
            <Tabs defaultValue="chat" className="space-y-4">
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members ({members.length})
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="requests" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Join Requests ({joinRequests.length})
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="chat">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Group Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {isLoadingMessages ? (
                        <div className="text-center text-muted-foreground">Loading messages...</div>
                      ) : messages.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getUserDisplayName(message.profiles).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {getUserDisplayName(message.profiles)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(message.created_at)}
                                </span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getUserDisplayName(member.profiles).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{getUserDisplayName(member.profiles)}</p>
                              <p className="text-sm text-muted-foreground">
                                Joined {new Date(member.joined_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {member.role === 'admin' && (
                            <Badge variant="secondary">Admin</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="requests">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Join Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {joinRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No pending join requests
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {joinRequests.map((request) => (
                            <div key={request.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <Avatar>
                                    <AvatarFallback>
                                      {getUserDisplayName(request.profiles).charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-medium">{getUserDisplayName(request.profiles)}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Requested {new Date(request.requested_at).toLocaleDateString()}
                                    </p>
                                    {request.message && (
                                      <p className="text-sm mt-2 p-2 bg-muted rounded">{request.message}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleJoinRequest(request.id, 'approved')}
                                    className="flex items-center gap-1"
                                  >
                                    <Check className="w-4 h-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleJoinRequest(request.id, 'rejected')}
                                    className="flex items-center gap-1"
                                  >
                                    <X className="w-4 h-4" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="space-y-6">
              {/* Members List for Non-Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Group Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getUserDisplayName(member.profiles).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getUserDisplayName(member.profiles)}</p>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {member.role === 'admin' && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Join Request Form */}
              {!hasExistingRequest && members.length < group.member_limit && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request to Join</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Send a request to join this study group. The admin will review your request.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message (optional)</label>
                      <Textarea
                        placeholder="Tell the admin why you want to join this group..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button onClick={requestToJoin} className="w-full">
                      Send Join Request
                    </Button>
                  </CardContent>
                </Card>
              )}

              {hasExistingRequest && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Request Pending</h3>
                    <p className="text-muted-foreground">
                      Your join request is pending approval from the group admin.
                    </p>
                  </CardContent>
                </Card>
              )}

              {members.length >= group.member_limit && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Group is Full</h3>
                    <p className="text-muted-foreground">
                      This study group has reached its maximum member limit.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GroupDetail;