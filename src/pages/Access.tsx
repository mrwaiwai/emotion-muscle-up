import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Access() {
  const { isAdmin, teacherProfile, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (isAdmin) navigate('/admin', { replace: true });
    if (teacherProfile) navigate('/teacher', { replace: true });
  }, [isAdmin, loading, navigate, teacherProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Emotion MUSCLE UP</h1>
          <p className="mt-2 text-muted-foreground">
            {t(
              '請選擇登入身份，開始使用學生情緒能力評估工具。',
              'Choose your login role to begin using the student emotional skills assessment tool.',
            )}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t(
              'Emotion MUSCLE UP 協助學校老師以友善、具結構的方式帶領小學生認識情緒能力，並保存評估記錄，方便日後跟進學生需要。',
              'Emotion MUSCLE UP helps teachers guide primary students through a friendly, structured emotional skills assessment, with records saved for follow-up support.',
            )}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{t('老師登入', 'Teacher Login')}</h2>
            <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
              {t(
                '使用學校獲發的老師帳號，為學生開始評估、查看結果及下載記錄。',
                'Use your school-issued teacher account to start assessments, review results, and download records.',
              )}
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              {[
                t('輸入學生姓名和年級', 'Enter the student name and grade'),
                t('開始學生情緒能力評估', 'Start the emotional skills assessment'),
                t('查看及匯出學生記錄', 'Review and export student records'),
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/teacher/login')}>
              {t('進入老師平台', 'Enter Teacher Portal')}
            </Button>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{t('管理員登入', 'Administrator Login')}</h2>
            <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
              {t(
                '管理老師帳號、學校使用情況、學生評估記錄及網站設定。',
                'Manage teacher accounts, school usage, student assessment records, and site settings.',
              )}
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              {[
                t('建立及管理老師帳號', 'Create and manage teacher accounts'),
                t('查看學校及學生使用情況', 'Review school and student usage'),
                t('維護評估資料及設定', 'Maintain assessment data and settings'),
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" size="lg" variant="outline" onClick={() => navigate('/admin/login')}>
              {t('進入管理員後台', 'Enter Admin Dashboard')}
            </Button>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
