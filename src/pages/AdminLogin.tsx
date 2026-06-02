import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/GlassCard';
import { Lock, User, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const adminUsername = 'ise';
  const adminEmail = 'admin@emotion-assessment.app';

  const handleSetup = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { username, password }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setSetupSuccess(true);
      setSetupMode(false);
      
      // Auto-login after setup
      setTimeout(() => handleLogin(), 1000);
    } catch (err: any) {
      setError(err.message || '設定失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    const normalizedUsername = username.trim().toLowerCase();
    const email = normalizedUsername === adminUsername
      ? adminEmail
      : `${normalizedUsername}@emotion-assessment.app`;

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('名稱或密碼錯誤');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (setupMode) {
      await handleSetup();
    } else {
      await handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回主頁
        </Button>

        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">管理員登入</h1>
            <p className="text-muted-foreground mt-2">
              {setupMode ? '首次設定管理員帳號' : '請使用管理員帳號登入'}
            </p>
          </div>

          {setupSuccess && (
            <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary p-3 rounded-lg mb-4">
              <CheckCircle className="w-4 h-4" />
              管理員帳號設定成功！正在登入...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">管理員名稱</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ise"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (setupMode ? '設定中...' : '登入中...') : (setupMode ? '設定帳號' : '登入')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setSetupMode(!setupMode)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {setupMode ? '已有帳號？返回登入' : '首次使用？設定管理員帳號'}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
