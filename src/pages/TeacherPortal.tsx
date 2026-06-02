import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Loader2, LogOut, Play, RefreshCw, Search } from 'lucide-react';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { GlassCard } from '@/components/GlassCard';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultsPrototypeSelector } from '@/components/results/ResultsPrototypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAssessment } from '@/hooks/useAssessment';
import { useAuth } from '@/hooks/useAuth';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { downloadSessionReportPdf } from '@/lib/sessionReportPdf';

type AssessmentSession = Tables<'assessment_sessions'>;

export default function TeacherPortal() {
  const { user, teacherProfile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [records, setRecords] = useState<AssessmentSession[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    phase,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    result,
    isLastQuestion,
    startAssessment,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeAssessment,
    resetAssessment,
  } = useAssessment({
    schoolId: teacherProfile?.schoolId,
    schoolName: teacherProfile?.schoolName,
    teacherId: user?.id,
  });

  const { generatePdf } = usePdfGenerator();

  useEffect(() => {
    if (!loading && !user) navigate('/teacher/login');
  }, [loading, navigate, user]);

  useEffect(() => {
    if (!loading && user && !teacherProfile) navigate('/teacher/login');
  }, [loading, navigate, teacherProfile, user]);

  const fetchRecords = useCallback(async (showLoading = false) => {
    if (showLoading) setRecordsLoading(true);

    try {
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching teacher records:', error);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!teacherProfile) return;

    fetchRecords(true);
    const intervalId = window.setInterval(() => fetchRecords(false), 2000);
    return () => window.clearInterval(intervalId);
  }, [fetchRecords, teacherProfile]);

  const handleStart = (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentName.trim() || !teacherProfile) return;
    startAssessment(studentName.trim(), studentGrade.trim() || undefined, teacherProfile.schoolName);
  };

  const handleReset = () => {
    setStudentName('');
    setStudentGrade('');
    resetAssessment();
    fetchRecords(false);
  };

  const handleDownloadResultPdf = () => {
    if (result) generatePdf(result);
  };

  const handleRecordPdf = async (session: AssessmentSession) => {
    const { data, error } = await supabase
      .from('assessment_answers')
      .select('*')
      .eq('session_id', session.id)
      .order('answered_at', { ascending: true });

    if (error) {
      console.error('Error fetching report answers:', error);
      return;
    }

    downloadSessionReportPdf(session, data || []);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredRecords = records.filter((record) =>
    record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.student_class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || (user && !teacherProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !teacherProfile) return null;

  if (phase === 'assessment' && currentQuestion) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingOrbs />
        <QuestionCard
          key={`teacher-question-${currentQuestionIndex}`}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          progress={progress}
          selectedAnswer={answers[currentQuestion.id]}
          isLastQuestion={isLastQuestion}
          onAnswer={answerQuestion}
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onComplete={completeAssessment}
        />
      </div>
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingOrbs />
        <ResultsPrototypeSelector
          result={result}
          onReset={handleReset}
          onDownloadPdf={handleDownloadResultPdf}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">老師工作台</h1>
            <p className="text-sm text-muted-foreground">
              {teacherProfile.displayName} · {teacherProfile.schoolName}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="start" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="start">開始測試</TabsTrigger>
            <TabsTrigger value="records">學生記錄</TabsTrigger>
          </TabsList>

          <TabsContent value="start">
            <GlassCard className="p-6 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">開始 Emotion MUSCLE UP 評估</h2>
                  <p className="text-sm text-muted-foreground">網站會自動記錄學校：{teacherProfile.schoolName}</p>
                </div>
              </div>

              <form onSubmit={handleStart} className="space-y-4">
                <Input
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  placeholder="輸入學生姓名"
                  className="h-12"
                  required
                />
                <Input
                  value={studentGrade}
                  onChange={(event) => setStudentGrade(event.target.value)}
                  placeholder="輸入年級，例如：小三"
                  className="h-12"
                />
                <Button type="submit" size="lg" className="w-full">
                  開始測試
                </Button>
              </form>
            </GlassCard>
          </TabsContent>

          <TabsContent value="records">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">學生互動記錄</h2>
                  <p className="text-sm text-muted-foreground">只顯示 {teacherProfile.schoolName} 的評估記錄</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="搜尋學生"
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={() => fetchRecords(true)} disabled={recordsLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${recordsLoading ? 'animate-spin' : ''}`} />
                    刷新
                  </Button>
                </div>
              </div>

              <GlassCard className="p-6">
                {recordsLoading ? (
                  <p className="text-center py-8 text-muted-foreground">載入中...</p>
                ) : filteredRecords.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">暫無評估記錄</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>學生姓名</TableHead>
                          <TableHead>年級</TableHead>
                          <TableHead>學校</TableHead>
                          <TableHead>總分</TableHead>
                          <TableHead>完成時間</TableHead>
                          <TableHead className="text-right">報告</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.student_name}</TableCell>
                            <TableCell>{record.student_class || '-'}</TableCell>
                            <TableCell>{record.school_name || '-'}</TableCell>
                            <TableCell>{record.total_score !== null ? `${record.total_score}%` : '-'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.completed_at ? new Date(record.completed_at).toLocaleString('zh-HK') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleRecordPdf(record)}>
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </GlassCard>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
