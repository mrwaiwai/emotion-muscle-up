import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { Users, FileCheck, TrendingUp, Clock } from 'lucide-react';

interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  todaySessions: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    completedSessions: 0,
    averageScore: 0,
    todaySessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      const { data: sessions, error } = await supabase
        .from('assessment_sessions')
        .select('*');

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.completed_at)?.length || 0;
      const todaySessions = sessions?.filter(s => 
        new Date(s.created_at) >= today
      )?.length || 0;
      
      const scores = sessions
        ?.filter(s => s.total_score !== null)
        .map(s => s.total_score) || [];
      
      const averageScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => (a || 0) + (b || 0), 0) / scores.length)
        : 0;

      setStats({
        totalSessions,
        completedSessions,
        averageScore,
        todaySessions,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentSessions(data || []);
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    }
  }, []);

  useEffect(() => {
    const refreshDashboard = () => {
      fetchStats();
      fetchRecentSessions();
    };
    const refreshWhenVisible = () => {
      if (!document.hidden) refreshDashboard();
    };

    refreshDashboard();
    window.addEventListener('focus', refreshDashboard);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    const intervalId = window.setInterval(refreshDashboard, 2000);

    return () => {
      window.removeEventListener('focus', refreshDashboard);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.clearInterval(intervalId);
    };
  }, [fetchRecentSessions, fetchStats]);

  const statCards = [
    {
      label: '總評估次數',
      value: stats.totalSessions,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: '已完成評估',
      value: stats.completedSessions,
      icon: FileCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: '平均分數',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: '今日評估',
      value: stats.todaySessions,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">總覽</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{loading ? '...' : stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Sessions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">最近評估記錄</h3>
        {recentSessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">暫無評估記錄</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">學生姓名</th>
                  <th className="text-left py-3 px-2 font-medium">班級</th>
                  <th className="text-left py-3 px-2 font-medium">學校</th>
                  <th className="text-left py-3 px-2 font-medium">分數</th>
                  <th className="text-left py-3 px-2 font-medium">時間</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b last:border-0">
                    <td className="py-3 px-2">{session.student_name}</td>
                    <td className="py-3 px-2">{session.student_class || '-'}</td>
                    <td className="py-3 px-2">{session.school_name || '-'}</td>
                    <td className="py-3 px-2">
                      {session.total_score !== null ? `${session.total_score}%` : '進行中'}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-sm">
                      {new Date(session.created_at).toLocaleString('zh-HK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
