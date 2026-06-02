import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/hooks/useAuth';

export default function Access() {
  const { isAdmin, teacherProfile, loading } = useAuth();
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
          <p className="mt-2 text-muted-foreground">請先登入合適平台，再開始使用評估工具</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">老師登入</h2>
            <p className="mt-2 min-h-12 text-sm text-muted-foreground">
              使用學校獲發帳號，為學生開始 Emotion MUSCLE UP 評估及查看記錄。
            </p>
            <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/teacher/login')}>
              進入老師平台
            </Button>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">管理員登入</h2>
            <p className="mt-2 min-h-12 text-sm text-muted-foreground">
              管理學校使用情況、老師帳號、評估記錄及網站設定。
            </p>
            <Button className="mt-6 w-full" size="lg" variant="outline" onClick={() => navigate('/admin/login')}>
              進入管理員後台
            </Button>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
