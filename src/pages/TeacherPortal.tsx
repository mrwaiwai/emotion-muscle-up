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

type AssessmentSession = Tables<'assessment_sessions'>;

export default function TeacherPortal() {
  const { user, teacherProfile, loading, signOut } = useAuth();
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
    { name: 'Show up', desc: '勇敢面對', icon: '💪' },
    { name: 'Step out', desc: '踏出一步', icon: '🚀' },
    { name: 'Value', desc: '跟住內心', icon: '❤️' },
    { name: 'Move on', desc: '繼續向前', icon: '✨' },
  ];

  const overviewSkills = [
    { name: '辨別 Recognizing', color: 'bg-skill-recognizing' },
    { name: '理解 Understanding', color: 'bg-skill-understanding' },
    { name: '標記 Labeling', color: 'bg-skill-labeling' },
    { name: '表達 Expressing', color: 'bg-skill-expressing' },
    { name: '調節 Regulating', color: 'bg-skill-regulating' },
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
              <h1 className="text-3xl font-bold">準備開始 Emotion MUSCLE UP</h1>
              <p className="mt-2 text-muted-foreground">每一題慢慢睇情境，揀一個最似自己平時反應嘅答案。</p>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  { icon: '👀', title: '睇清楚', text: '先讀情境同問題' },
                  { icon: '☝️', title: '揀答案', text: '點選最合適選項' },
                  { icon: '➡️', title: '去下一題', text: '完成後按下一題' },
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
                我明白，開始答題
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
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="start">開始測試</TabsTrigger>
            <TabsTrigger value="records">學生記錄</TabsTrigger>
            <TabsTrigger value="account">帳戶設定</TabsTrigger>
          </TabsList>

          <TabsContent value="start">
            <div className="space-y-6">
              <section className="text-center">
                <h2 className="text-3xl font-extrabold md:text-5xl">
                  <span className="gradient-text">情緒 MUSCLE UP</span>
                </h2>
                <p className="mt-2 text-lg font-medium text-muted-foreground">兒童情緒能力測驗 💪🧠❤️</p>
              </section>

              <HeroAnimation />

              <div className="grid gap-6 md:grid-cols-2">
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">呢個測驗係咩嚟㗎？</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        我哋會一齊探索你嘅情緒肌肉！睇吓你喺認識同處理情緒方面做得點。
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-accent/50">
                      <Users className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">邊個可以玩？</h3>
                      <p className="text-2xl font-bold text-primary mb-1">小學生！🎒</p>
                      <p className="text-muted-foreground">小一至小六都啱玩 ✨</p>
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/50 p-3">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">呢個只係參考，唔係心理測試</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">我哋會睇呢 5 種情緒技能</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {overviewSkills.map((skill, index) => (
                    <motion.span
                      key={skill.name}
                      className={`px-4 py-2 rounded-full text-white font-medium text-sm ${skill.color}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>

                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emotion-labeling" />
                  四個成長階段
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {overviewStages.map((stage, index) => (
                    <motion.div
                      key={stage.name}
                      className="text-center p-3 rounded-xl bg-muted/30"
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                    >
                      <span className="text-2xl mb-1 block">{stage.icon}</span>
                      <p className="font-bold text-sm">{stage.name}</p>
                      <p className="text-xs text-muted-foreground">{stage.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard variant="strong" className="p-6 max-w-xl">
                <div className="mb-6 rounded-2xl bg-primary/10 p-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-2xl">
                      👋
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">老師您好，歡迎使用 Emotion MUSCLE UP</p>
                      <h2 className="mt-1 text-2xl font-bold">這裡是學生開始檢測的入口</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        請先輸入學生姓名和年級，再按「開始測試」。系統會自動記錄學校，學生開始答題前亦會看到操作動畫，知道要讀情境、揀答案和按下一題。
                      </p>
                    </div>
                  </motion.div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {[
                      '輸入學生姓名',
                      '填寫年級',
                      '交給學生開始答題',
                    ].map((step, index) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.08 }}
                        className="flex items-center gap-2 rounded-xl bg-background/70 px-3 py-2 text-sm font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>

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
