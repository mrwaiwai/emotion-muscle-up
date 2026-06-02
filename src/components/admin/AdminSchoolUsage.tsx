import { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, Download, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { downloadSessionReportPdf } from '@/lib/sessionReportPdf';

type AssessmentSession = Tables<'assessment_sessions'>;

export function AdminSchoolUsage() {
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching school usage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const schoolNames = useMemo(() => {
    return Array.from(new Set(sessions.map((session) => session.school_name).filter(Boolean) as string[])).sort();
  }, [sessions]);

  const visibleSessions = sessions.filter((session) => {
    const matchesSchool = selectedSchool === 'all' || session.school_name === selectedSchool;
    const matchesSearch = session.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.student_class?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSchool && matchesSearch;
  });

  const stats = useMemo(() => {
    const completed = visibleSessions.filter((session) => session.completed_at);
    const scores = completed
      .map((session) => session.total_score)
      .filter((score): score is number => score !== null);

    return {
      sessions: visibleSessions.length,
      completed: completed.length,
      students: new Set(visibleSessions.map((session) => session.student_name)).size,
      average: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    };
  }, [visibleSessions]);

  const handlePdf = async (session: AssessmentSession) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">學校使用情況</h2>
          <p className="text-sm text-muted-foreground">按學校查看使用量同學生評估</p>
        </div>
        <Button variant="outline" onClick={fetchSessions} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          ['評估次數', stats.sessions],
          ['已完成', stats.completed],
          ['學生數', stats.students],
          ['平均分', `${stats.average}%`],
        ].map(([label, value]) => (
          <GlassCard key={label} className="p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{loading ? '...' : value}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="w-full sm:w-72">
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="選擇學校" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部學校</SelectItem>
                {schoolNames.map((school) => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="搜尋學生或班級"
              className="pl-10"
            />
          </div>
        </div>

        {visibleSessions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">暫無評估記錄</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>學生姓名</TableHead>
                  <TableHead>班級</TableHead>
                  <TableHead>學校</TableHead>
                  <TableHead>總分</TableHead>
                  <TableHead>完成時間</TableHead>
                  <TableHead className="text-right">報告</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.student_name}</TableCell>
                    <TableCell>{session.student_class || '-'}</TableCell>
                    <TableCell>{session.school_name || '-'}</TableCell>
                    <TableCell>{session.total_score !== null ? `${session.total_score}%` : '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.completed_at ? new Date(session.completed_at).toLocaleString('zh-HK') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handlePdf(session)}>
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
  );
}
