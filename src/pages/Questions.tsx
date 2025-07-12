import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchBar from "@/components/questions/SearchBar";
import SubjectFilter from "@/components/questions/SubjectFilter";
import SubjectSidebar from "@/components/questions/SubjectSidebar";
import QuestionsList from "@/components/questions/QuestionsList";

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

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const subjects = ['Math', 'Science', 'History', 'English', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedSubject]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching questions",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    setFilteredQuestions(filtered);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading questions...</div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Questions</h1>
                <p className="text-muted-foreground">Find answers to your academic questions</p>
              </div>
              <Link to="/ask">
                <Button>Ask Question</Button>
              </Link>
            </div>

            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />

            {/* Subject Filter */}
            <SubjectFilter 
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              subjects={subjects}
            />

            {/* Questions List */}
            <QuestionsList questions={filteredQuestions} />
          </div>

          <SubjectSidebar 
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            subjects={subjects}
          />
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Questions;