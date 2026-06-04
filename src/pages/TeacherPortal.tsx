import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Download, Heart, KeyRound, Loader2, LogOut, Play, RefreshCw, Search, Sparkles, Star, Users } from 'lucide-react';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { GlassCard } from '@/components/GlassCard';
import { HeroAnimation } from '@/components/HeroAnimation';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultsPrototypeSelector } from '@/components/results/ResultsPrototypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useLanguage } from '@/contexts/LanguageContext';

type AssessmentSession = Tables<'assessment_sessions'>;

export default function TeacherPortal() {
  const { user, teacherProfile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [records, setRecords] = useState<AssessmentSession[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    setShowWelcomeGuide(true);
  };

  const handleReset = () => {
    setStudentName('');
    setStudentGrade('');
    setShowWelcomeGuide(false);
    resetAssessment();
    fetchRecords(false);
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('新密碼最少需要 6 個字元');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('兩次輸入的新密碼不一致');
      return;
    }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage('密碼已更新，下次登入請使用新密碼');
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

  const overviewStages = [
    { name: 'Show up', desc: t('勇敢面對', 'Be present'), icon: '💪' },
    { name: 'Step out', desc: t('踏出一步', 'Take a step'), icon: '🚀' },
    { name: 'Value', desc: t('聆聽內心', 'Follow values'), icon: '❤️' },
    { name: 'Move on', desc: t('繼續前進', 'Move forward'), icon: '✨' },
  ];

  const overviewSkills = [
    { name: t('辨別 Recognizing', 'Recognizing'), color: 'bg-skill-recognizing' },
    { name: t('理解 Understanding', 'Understanding'), color: 'bg-skill-understanding' },
    { name: t('標記 Labeling', 'Labeling'), color: 'bg-skill-labeling' },
    { name: t('表達 Expressing', 'Expressing'), color: 'bg-skill-expressing' },
    { name: t('調節 Regulating', 'Regulating'), color: 'bg-skill-regulating' },
  ];

  if (phase === 'assessment' && currentQuestion && showWelcomeGuide) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <FloatingOrbs />
        <main className="container mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <GlassCard className="p-6 md:p-8 text-center">
              <motion.div
                initial={{ scale: 0.9, rotate: -4 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180 }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-5xl"
              >
                💪
              </motion.div>
              <h1 className="text-3xl font-bold">{t('準備開始 Emotion MUSCLE UP', 'Get Ready for Emotion MUSCLE UP')}</h1>
              <p className="mt-2 text-muted-foreground">
                {t('請仔細閱讀每一題的情境，然後選擇最接近自己平日反應的答案。', 'Read each situation carefully, then choose the answer that best matches how you usually respond.')}
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  { icon: '👀', title: t('仔細閱讀', 'Read Carefully'), text: t('先閱讀情境和問題', 'Read the situation and question first') },
                  { icon: '☝️', title: t('選擇答案', 'Choose an Answer'), text: t('點選最合適的選項', 'Tap the most suitable option') },
                  { icon: '➡️', title: t('前往下一題', 'Move to the Next Question'), text: t('完成後按下一題', 'Press Next when finished') },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.12 }}
                    className="rounded-xl bg-white/50 p-4"
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <h2 className="mt-2 font-bold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <Button className="mt-8 h-14 px-10 text-lg" onClick={() => setShowWelcomeGuide(false)}>
                {t('我明白，開始答題', 'I Understand. Start')}
              </Button>
            </GlassCard>
          </motion.div>
        </main>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold">{t('老師工作台', 'Teacher Portal')}</h1>
            <p className="text-sm text-muted-foreground">
              {teacherProfile.displayName} · {teacherProfile.schoolName}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('登出', 'Sign Out')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="start" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="start">{t('開始測試', 'Start Assessment')}</TabsTrigger>
            <TabsTrigger value="records">{t('學生記錄', 'Student Records')}</TabsTrigger>
            <TabsTrigger value="account">{t('帳戶設定', 'Account Settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="start">
            <div className="mx-auto max-w-7xl space-y-6">
              <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
                <div className="space-y-5">
                  <div className="space-y-3 text-center lg:text-left">
                    <p className="text-sm font-bold uppercase text-primary">
                      {t('兒童情緒能力評估', 'Children’s Emotional Skills Assessment')}
                    </p>
                    <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                      <span className="gradient-text">情緒 MUSCLE UP</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                      {t(
                        '以友善、清晰的流程，協助老師了解學生在辨識、理解、表達和調節情緒方面的能力。',
                        'A friendly, structured flow that helps teachers understand how students recognize, understand, express, and regulate emotions.',
                      )}
                    </p>
                  </div>

                  <HeroAnimation />
                </div>

                <GlassCard variant="strong" className="p-5 sm:p-6 lg:sticky lg:top-28">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {t('老師您好，歡迎使用 Emotion MUSCLE UP', 'Welcome to Emotion MUSCLE UP')}
                      </p>
                      <h3 className="mt-1 text-xl font-bold leading-snug">
                        {t('開始學生評估', 'Start Student Assessment')}
                      </h3>
                    </div>
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {t(
                      '輸入學生姓名和年級後，學生會先看到簡短操作說明，再正式開始答題。',
                      'After entering the student name and grade, the student will see a short guide before answering.',
                    )}
                  </p>

                  <form onSubmit={handleStart} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-name">{t('學生姓名', 'Student Name')}</Label>
                      <Input
                        id="student-name"
                        value={studentName}
                        onChange={(event) => setStudentName(event.target.value)}
                        placeholder={t('例如：陳小明', 'e.g. Alex Chan')}
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-grade">{t('年級', 'Grade')}</Label>
                      <Input
                        id="student-grade"
                        value={studentGrade}
                        onChange={(event) => setStudentGrade(event.target.value)}
                        placeholder={t('例如：小三 / P3', 'e.g. Primary 3 / P3')}
                        className="h-12"
                      />
                    </div>

                    <Button type="submit" size="lg" className="h-12 w-full text-base font-bold">
                      <Play className="mr-2 h-4 w-4" />
                      {t('開始測試', 'Start Assessment')}
                    </Button>
                  </form>

                  <div className="mt-5 grid gap-2">
                    {[
                      t('確認學生資料', 'Confirm student details'),
                      t('學生閱讀操作說明', 'Student reads the short guide'),
                      t('開始二十題情境評估', 'Begin the 20-question assessment'),
                    ].map((step, index) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + index * 0.06 }}
                        className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-sm font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        <span>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.2fr]">
                <GlassCard className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{t('這項評估是甚麼？', 'What is this assessment?')}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {t(
                          '這項工具會以學生容易理解的方式，觀察他們在不同情境中的情緒反應和處理方式。',
                          'This tool uses student-friendly situations to observe emotional responses and coping approaches.',
                        )}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/60">
                      <Users className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold">{t('適合哪些學生？', 'Who is it for?')}</h3>
                      <p className="mt-2 text-xl font-bold text-primary">{t('小一至小六學生', 'Primary 1 to Primary 6 Students')}</p>
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 p-3">
                        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {t('評估結果只作教育參考，並非心理診斷。', 'Results are for educational reference only and are not a psychological diagnosis.')}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <GlassCard className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-bold">{t('五項情緒技能', 'Five Emotional Skills')}</h3>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                    {overviewSkills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        className="flex min-h-12 items-center rounded-xl bg-background/70 p-2.5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className={`mr-2 h-3 w-3 shrink-0 rounded-full ${skill.color}`} />
                        <span className="text-sm font-bold leading-snug">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Star className="h-5 w-5 text-emotion-labeling" />
                    <h3 className="text-lg font-bold">{t('四個成長階段', 'Four Growth Stages')}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {overviewStages.map((stage, index) => (
                      <motion.div
                        key={stage.name}
                        className="rounded-xl bg-muted/30 p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.06 }}
                      >
                        <span className="mb-1 block text-2xl">{stage.icon}</span>
                        <p className="text-sm font-bold">{stage.name}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{stage.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </section>
            </div>
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

          <TabsContent value="account">
            <GlassCard className="p-6 max-w-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">修改密碼</h2>
                  <p className="text-sm text-muted-foreground">更新後，下次登入請使用新密碼</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-new-password">新密碼</Label>
                  <Input
                    id="teacher-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-confirm-password">確認新密碼</Label>
                  <Input
                    id="teacher-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                {passwordError && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{passwordError}</p>}
                {passwordMessage && <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{passwordMessage}</p>}

                <Button type="submit" disabled={passwordSaving}>
                  {passwordSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
                  更新密碼
                </Button>
              </form>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
