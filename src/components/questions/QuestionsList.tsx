import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionCard from './QuestionCard';

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

interface QuestionsListProps {
  questions: Question[];
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No questions found. Be the first to ask!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
};

export default QuestionsList;