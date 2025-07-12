import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SubjectFilterProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  subjects: string[];
}

const SubjectFilter: React.FC<SubjectFilterProps> = ({ 
  selectedSubject, 
  onSubjectChange, 
  subjects 
}) => {
  return (
    <Tabs value={selectedSubject} onValueChange={onSubjectChange} className="mb-6">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        {subjects.slice(0, 4).map(subject => (
          <TabsTrigger key={subject} value={subject} className="text-xs">
            {subject}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SubjectFilter;