import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Question {
  id: string;
  title: string;
  content: string;
  subject: string;
  grade_level: string;
  tags: string[];
  votes: number;
  answer_count: number;
  created_at: string;
  user_id: string;
}

interface Answer {
  id: string;
  content: string;
  votes: number;
  created_at: string;
  user_id: string;
  question_id: string;
}

interface Vote {
  id: string;
  user_id: string;
  vote_type: number;
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [questionVotes, setQuestionVotes] = useState<Vote[]>([]);
  const [answerVotes, setAnswerVotes] = useState<{ [key: string]: Vote[] }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchQuestionData();
    }
  }, [id]);

  const fetchQuestionData = async () => {
    try {
      // Fetch question
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (questionError) throw questionError;
      setQuestion(questionData);

      // Fetch answers
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', id)
        .order('votes', { ascending: false });

      if (answersError) throw answersError;
      setAnswers(answersData || []);

      // Fetch question votes
      const { data: questionVotesData, error: questionVotesError } = await supabase
        .from('question_votes')
        .select('*')
        .eq('question_id', id);

      if (questionVotesError) throw questionVotesError;
      setQuestionVotes(questionVotesData || []);

      // Fetch answer votes
      if (answersData && answersData.length > 0) {
        const answerIds = answersData.map(answer => answer.id);
        const { data: answerVotesData, error: answerVotesError } = await supabase
          .from('answer_votes')
          .select('*')
          .in('answer_id', answerIds);

        if (answerVotesError) throw answerVotesError;
        
        const votesGrouped = (answerVotesData || []).reduce((acc, vote) => {
          if (!acc[vote.answer_id]) acc[vote.answer_id] = [];
          acc[vote.answer_id].push(vote);
          return acc;
        }, {} as { [key: string]: Vote[] });

        setAnswerVotes(votesGrouped);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading question",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoteQuestion = async (voteType: number) => {
    if (!user || !question) return;

    const existingVote = questionVotes.find(vote => vote.user_id === user.id);

    try {
      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase.from('question_votes').delete().eq('id', existingVote.id);
        } else {
          // Update vote
          await supabase.from('question_votes').update({ vote_type: voteType }).eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase.from('question_votes').insert({
          question_id: question.id,
          user_id: user.id,
          vote_type: voteType,
        });
      }
      
      fetchQuestionData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error voting",
        description: error.message,
      });
    }
  };

  const handleVoteAnswer = async (answerId: string, voteType: number) => {
    if (!user) return;

    const existingVote = answerVotes[answerId]?.find(vote => vote.user_id === user.id);

    try {
      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase.from('answer_votes').delete().eq('id', existingVote.id);
        } else {
          // Update vote
          await supabase.from('answer_votes').update({ vote_type: voteType }).eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase.from('answer_votes').insert({
          answer_id: answerId,
          user_id: user.id,
          vote_type: voteType,
        });
      }
      
      fetchQuestionData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error voting",
        description: error.message,
      });
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user || !question || !newAnswer.trim()) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from('answers').insert({
        content: newAnswer.trim(),
        question_id: question.id,
        user_id: user.id,
      });

      if (error) throw error;

      setNewAnswer('');
      fetchQuestionData();
      
      toast({
        title: "Answer posted!",
        description: "Your answer has been posted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error posting answer",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserVote = (votes: Vote[], userId: string) => {
    return votes.find(vote => vote.user_id === userId)?.vote_type || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading question...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Question not found</h2>
          <p className="text-muted-foreground">The question you're looking for doesn't exist.</p>
          <Link to="/questions">
            <Button className="mt-4">Browse Questions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userQuestionVote = user ? getUserVote(questionVotes, user.id) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/questions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </Link>

          {/* Question */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{question.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary">{question.subject}</Badge>
                    <Badge variant="outline">{question.grade_level}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(question.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={userQuestionVote === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVoteQuestion(1)}
                    disabled={!user}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {question.votes}
                  </Button>
                  <Button
                    variant={userQuestionVote === -1 ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleVoteQuestion(-1)}
                    disabled={!user}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap mb-4">{question.content}</p>
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answers Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
            </div>

            {/* Answer Form */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your answer here..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim() || submitting}
                  >
                    {submitting ? 'Posting...' : 'Post Answer'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Answers List */}
            {answers.length > 0 ? (
              <div className="space-y-4">
                {answers.map((answer) => {
                  const userAnswerVote = user ? getUserVote(answerVotes[answer.id] || [], user.id) : 0;
                  
                  return (
                    <Card key={answer.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <Button
                              variant={userAnswerVote === 1 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleVoteAnswer(answer.id, 1)}
                              disabled={!user}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <span className="font-medium">{answer.votes}</span>
                            <Button
                              variant={userAnswerVote === -1 ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => handleVoteAnswer(answer.id, -1)}
                              disabled={!user}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground whitespace-pre-wrap mb-2">{answer.content}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(answer.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No answers yet. Be the first to answer!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;