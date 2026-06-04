import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { AdminUsersList } from '@/components/admin/AdminUsersList';
import { AdminQuestionsList } from '@/components/admin/AdminQuestionsList';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminSchoolUsage } from '@/components/admin/AdminSchoolUsage';
import { AdminTeacherAccounts } from '@/components/admin/AdminTeacherAccounts';
import { 
  LayoutDashboard, 
  Users, 
  FileQuestion, 
  Settings, 
  LogOut,
  Loader2,
  Building2,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight sm:text-xl">情緒 MUSCLE UP</h1>
              <p className="text-sm text-muted-foreground">管理後台</p>
            </div>
          </div>
          <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground sm:flex-none">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="shrink-0">
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <TabsList className="flex h-auto w-max min-w-full justify-start gap-1 p-1 sm:grid sm:w-full sm:max-w-5xl sm:grid-cols-6">
              <TabsTrigger value="dashboard" className="min-w-[5.75rem] shrink-0 flex items-center gap-2 px-3">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-xs sm:text-sm">總覽</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="min-w-[5.75rem] shrink-0 flex items-center gap-2 px-3">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm">用戶數據</span>
              </TabsTrigger>
              <TabsTrigger value="schools" className="min-w-[5.75rem] shrink-0 flex items-center gap-2 px-3">
                <Building2 className="w-4 h-4" />
                <span className="text-xs sm:text-sm">學校</span>
              </TabsTrigger>
              <TabsTrigger value="teachers" className="min-w-[5.75rem] shrink-0 flex items-center gap-2 px-3">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs sm:text-sm">老師帳號</span>
              </TabsTrigger>
              <TabsTrigger value="questions" className="min-w-[5.75rem] shrink-0 flex items-center gap-2 px-3">
                <FileQuestion className="w-4 h-4" />
                <span className="text-xs sm:text-sm">題目管理</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="min-w-[5.75rem] shrink-0 flex items-center gap-2 px-3">
                <Settings className="w-4 h-4" />
                <span className="text-xs sm:text-sm">設定</span>
              </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsersList />
            </TabsContent>

            <TabsContent value="schools">
              <AdminSchoolUsage />
            </TabsContent>

            <TabsContent value="teachers">
              <AdminTeacherAccounts />
            </TabsContent>

            <TabsContent value="questions">
              <AdminQuestionsList />
            </TabsContent>

            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
