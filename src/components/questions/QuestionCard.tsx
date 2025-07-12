import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <Link to={`/questions/${question.id}`}>
              <CardTitle className="hover:text-primary transition-colors cursor-pointer">
                {question.title}
              </CardTitle>
            </Link>
            <p className="text-muted-foreground mt-2 line-clamp-2">
              {question.content}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{question.subject}</Badge>
            <Badge variant="outline">{question.grade_level}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{question.votes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{question.answer_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(question.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;