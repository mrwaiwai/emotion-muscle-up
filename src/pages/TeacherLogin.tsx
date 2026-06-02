import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, ArrowLeft, GraduationCap, Lock, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email.trim().toLowerCase(), password);
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? t('帳號或密碼不正確', 'Incorrect account or password') : signInError.message);
      setLoading(false);
      return;
    }

    navigate('/teacher');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('返回主頁', 'Back to Home')}
        </Button>

        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t('老師登入', 'Teacher Login')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('請使用學校獲發的帳號，進入老師平台開始學生評估。', 'Use your school-issued account to enter the teacher portal and start student assessments.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-email">{t('帳號電郵', 'Account Email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="teacher-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teacher@school.edu.hk"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher-password">{t('密碼', 'Password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="teacher-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t('登入中...', 'Signing in...') : t('登入', 'Sign In')}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
