import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SubjectSidebarProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  subjects: string[];
}

const SubjectSidebar: React.FC<SubjectSidebarProps> = ({ 
  selectedSubject, 
  onSubjectChange, 
  subjects 
}) => {
  return (
    <div className="lg:w-80">
      <Card>
        <CardHeader>
          <CardTitle>Browse by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={selectedSubject === 'all' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onSubjectChange('all')}
            >
              All Subjects
            </Button>
            {subjects.map(subject => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onSubjectChange(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectSidebar;